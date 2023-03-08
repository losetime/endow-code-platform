<template>
  <div class="item-content">
    <div class="handle-wrap">
      <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition" :tabBarGutter="20" size="small">
        <a-tab-pane class="item-tab" key="1" tab="赋码分析">
          <a-button type="primary" @click="HandleExport">导出报表</a-button>
          <a-button v-if="tempDeptIds.length > 0" type="primary" style="margin-left: 15px" @click="lastCompanyList"
            >返回上级</a-button
          >
          <div class="item-statement">
            <ym-table
              ref="tableTaggingInstance"
              rowKey="id"
              v-if="!haveProjectInfo"
              :columns="columns"
              :getTableList="getCodingAnalysisData"
              :row-selection="false"
              :params="codingAnalysisParams"
            >
              <template #slotOne="{ index, record }">
                <a v-if="index > 0">{{ record.label }}</a>
                <span v-else>{{ record.label }}</span>
              </template>
            </ym-table>

            <ym-table
              rowKey="id"
              v-else
              :columns="columnsProject"
              :getTableList="getCodingAnalysisProjectData"
              :row-selection="false"
              :params="codingAnalysisParams"
              ref="tableTaggingProjectInstance"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="2" tab="日志分析">
          <a-button type="primary" @click="HandleLogExport">导出报表</a-button>
          <a-button
            v-if="tempLogDeptIds.length > 0"
            type="primary"
            style="margin-left: 15px"
            @click="lastLogCompanyList"
            >返回上级</a-button
          >
          <div class="item-statement">
            <a-button class="btn-date" type="primary" @click="changeLogParam(0)">本周</a-button>
            <a-button class="btn-date" type="primary" @click="changeLogParam(1)">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" @change="onChange" />
            <ym-table
              ref="tableLogTaggingInstance"
              rowKey="id"
              v-if="!haveLogProjectInfo"
              :columns="columnLog"
              :getTableList="getLogAnalysisData"
              :row-selection="false"
              :params="logListParam"
            >
              <template #slotOne="{ index, record }">
                <a v-if="index > 0">{{ record.label }}</a>
                <span v-else>{{ record.label }}</span>
              </template>
            </ym-table>
            <ym-table
              ref="tableLogTaggingProjectInstance"
              rowKey="id"
              v-else
              :columns="columnLogProject"
              :getTableList="getLogAnalysisProjectData"
              :row-selection="false"
              :params="logListParam"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="3" tab="监督管理分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-button class="btn-date" type="primary">本周</a-button>
            <a-button class="btn-date" type="primary">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" />
            <ym-table
              rowKey="id"
              :columns="columnSupervision"
              :getTableList="getCodingAnalysisProjectData"
              :row-selection="false"
              ref="tableSupervisionInstance"
            >
              <template #bodyCell="{ column, text, index }">
                <template v-if="column.dataIndex === 'label'">
                  <a v-if="index > 0">{{ text }}</a>
                  <span v-else>{{ text }}</span>
                </template>
              </template>
            </ym-table>
          </div>
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="4" tab="施工风险分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-button class="btn-date" type="primary">本周</a-button>
            <a-button class="btn-date" type="primary">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" />

            <ym-table
              rowKey="id"
              :columns="columnRisk"
              :getTableList="apiGetCodingAnalysisList"
              :row-selection="false"
              ref="tableRiskInstance"
            >
              <template #bodyCell="{ column, text, index }">
                <template v-if="column.dataIndex === 'supervisoryUnit'">
                  <a v-if="index > 0">{{ text }}</a>
                  <span v-else>{{ text }}</span>
                </template>
              </template>
            </ym-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import {
  apiGetCodingAnalysisList,
  apiPostExportCoddingAnalysisList,
  apiGetLogAnalysisList,
  apiPostExportLogAnalysisList,
} from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
import { Moment } from 'moment'

//tab页相关
const tabPosition = ref('left')
const activeKey = ref('1')
//--------赋码分析------------
//赋码分析引用
const tableTaggingInstance = ref()
const tableTaggingProjectInstance = ref()
const codingAnalysisParams = ref<any>({
  deptId: '',
})

const haveProjectInfo = ref(false)
//用来记录赋码分析列表数据
const tempDataList = ref<any>([])
//用来记录上一级的deptId
const tempDeptIds = ref<any>([])
//导出报表使用
const tempExportList = ref<any>([])

//--------日志分析------------
//日志报表请求参数
const tableLogTaggingInstance = ref()
const tableLogTaggingProjectInstance = ref()
const haveLogProjectInfo = ref(false)
//用来记录上一级的deptId
const tempLogDeptIds = ref<any>([])
//导出报表使用
const tempLogExportList = ref<any>([])
//用来记录日志分析列表数据
const tempLogDataList = ref<any>([])
const logListParam = ref<any>({
  deptId: '',
  endTime: '',
  startTime: '',
  thisMonth: false,
  thisWeek: false,
})

const tableSupervisionInstance = ref()
const tableRiskInstance = ref()

const dateArea = ref<Moment[]>([])

function rowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        codingAnalysisParams.value.deptId = record.id
        if (tempDeptIds.value.length == 0 || tempDeptIds.value.indexOf(tempDataList.value[index].parentId) == -1) {
          tempDeptIds.value.push(tempDataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          if (record.singleProjects == null || record.singleProjects.length == 0) {
            message.info('该单位下没有工程信息')
            tempDeptIds.value = tempDeptIds.value.slice(0, tempDeptIds.value.length - 1)
            return
          }
          haveProjectInfo.value = true
          return
        }

        tableTaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastCompanyList = () => {
  if (haveProjectInfo.value) {
    haveProjectInfo.value = false
  }
  codingAnalysisParams.value.deptId = tempDeptIds.value[tempDeptIds.value.length - 1]
  if (tableTaggingInstance.value !== null) tableTaggingInstance.value.handleReacquire()
  tempDeptIds.value = tempDeptIds.value.slice(0, tempDeptIds.value.length - 1)
}

const getCodingAnalysisData = async (params: any) => {
  const { code, data } = await apiGetCodingAnalysisList(params)
  if (code === 20000) {
    tempExportList.value = data
    return new Promise((resolve: any) => {
      tempDataList.value = data.map((item: any, i: number) => ({
        key: i,
        id: item.id,
        parentId: item.parentId,
        label: item.label,
        companyRedCodeColorCount: item.otherInfo.companyRedCodeColorCount,
        companyYellowCodeColorCount: item.otherInfo.companyYellowCodeColorCount,
        companyGreenCodeColorCount: item.otherInfo.companyGreenCodeColorCount,
        employeeRedCodeColorCount: item.otherInfo.employeeRedCodeColorCount,
        employeeYellowCodeColorCount: item.otherInfo.employeeYellowCodeColorCount,
        employeeGreenCodeColorCount: item.otherInfo.employeeGreenCodeColorCount,
        projectRedCodeColorCount: item.otherInfo.projectRedCodeColorCount,
        projectYellowCodeColorCount: item.otherInfo.projectYellowCodeColorCount,
        projectGreenCodeColorCount: item.otherInfo.projectGreenCodeColorCount,
        childrenColumnName: item.children,
        singleProjects: item.otherInfo.singleProjects,
      }))
      resolve({
        code: 20000,
        data: tempDataList.value,
      })
    })
  }
}

const getCodingAnalysisProjectData = async (params: any) => {
  const { code, data } = await apiGetCodingAnalysisList(params)
  if (code === 20000) {
    tempExportList.value = data
    return new Promise((resolve: any) => {
      tempDataList.value = data[0].otherInfo.singleProjects.map((item: any, index: number) => ({
        key: index,
        codeColor: item.codeColor,
        companyGreenCodeColorCount: item.companyGreenCodeColorCount,
        companyRedCodeColorCount: item.companyRedCodeColorCount,
        companyYellowCodeColorCount: item.companyYellowCodeColorCount,
        employeeGreenCodeColorCount: item.employeeGreenCodeColorCount,
        employeeRedCodeColorCount: item.employeeRedCodeColorCount,
        employeeYellowCodeColorCount: item.employeeYellowCodeColorCount,
        name: item.name,
      }))
      resolve({
        code: 20000,
        data: tempDataList.value,
      })
    })
  }
}

const HandleExport = async () => {
  let exportParma = {
    deptId: codingAnalysisParams.value.deptId,
    reportData: tempExportList.value,
  }
  if (tempExportList.value.length == 0) {
    message.info('暂无报表需要导出')
    return
  }
  await apiPostExportCoddingAnalysisList(exportParma)
}

//---------------------日志报表---------------------
//改变报表查询参数方法  0：本周 1：本月
const changeLogParam = (flag: number) => {
  if (flag === 0) {
    logListParam.value.thisWeek = true
    logListParam.value.thisMonth = false
  } else {
    logListParam.value.thisWeek = false
    logListParam.value.thisMonth = true
  }
  tableLogTaggingInstance.value.handleReacquire()
}

function logRowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        logListParam.value.deptId = record.id
        if (
          tempLogDeptIds.value.length == 0 ||
          tempLogDeptIds.value.indexOf(tempLogDataList.value[index].parentId) == -1
        ) {
          tempLogDeptIds.value.push(tempLogDataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          if (record.singleProjects == null || record.singleProjects.length == 0) {
            message.info('该单位下没有工程信息')
            tempLogDeptIds.value = tempLogDeptIds.value.slice(0, tempLogDeptIds.value.length - 1)
            return
          }
          haveLogProjectInfo.value = true
          // tableTaggingProjectInstance.value.handleReacquire
          return
        }

        tableLogTaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastLogCompanyList = () => {
  if (haveLogProjectInfo.value) {
    haveLogProjectInfo.value = false
  }
  logListParam.value.deptId = tempLogDeptIds.value[tempLogDeptIds.value.length - 1]
  if (tableLogTaggingInstance.value !== null) tableLogTaggingInstance.value.handleReacquire()
  tempLogDeptIds.value = tempLogDeptIds.value.slice(0, tempLogDeptIds.value.length - 1)
}

const getLogAnalysisData = async (params: any) => {
  const { code, data } = await apiGetLogAnalysisList(params)
  if (code === 20000) {
    tempLogExportList.value = data
    return new Promise((resolve: any) => {
      tempLogDataList.value = data.map((item: any, i: number) => ({
        key: i,
        id: item.id,
        parentId: item.parentId,
        label: item.label,
        planCount: item.otherInfo.planCount,
        sgWorkLogCount: item.otherInfo.sgWorkLogCount,
        jlWorkLogCount: item.otherInfo.jlWorkLogCount,
        singleProjects: item.otherInfo.singleProjects,
        childrenColumnName: item.children,
      }))
      resolve({
        code: 20000,
        data: tempLogDataList.value,
      })
    })
  }
}

const getLogAnalysisProjectData = async (params: any) => {
  const { code, data } = await apiGetLogAnalysisList(params)
  if (code === 20000) {
    tempLogExportList.value = data
    return new Promise((resolve: any) => {
      tempLogDataList.value = data[0].otherInfo.singleProjects.map((item: any, index: number) => ({
        key: index,
        name: item.name,
        planCount: item.planCount,
        sgWorkLogCount: item.sgWorkLogCount,
        jlWorkLogCount: item.jlWorkLogCount,
      }))
      resolve({
        code: 20000,
        data: tempLogDataList.value,
      })
    })
  }
}

const HandleLogExport = async () => {
  let exportParma = {
    deptId: logListParam.value.deptId,
    reportData: tempLogExportList.value,
  }
  if (tempLogExportList.value.length == 0) {
    message.info('暂无报表需要导出')
    return
  }
  await apiPostExportLogAnalysisList(exportParma)
}

onMounted(() => {
  // getCodingAnalysisData(codingAnalysisParams.value.deptId)
})

const onChange = (date: any, dateString: any) => {
  console.log('date', dateString)
  logListParam.value.startTime = dateString[0]
  logListParam.value.endTime = dateString[1]
  if (tableLogTaggingInstance.value != null) tableLogTaggingInstance.value.handleReacquire()
  if (tableLogTaggingProjectInstance.value != null) tableLogTaggingProjectInstance.value.handleReacquire()
}

const columns = [
  {
    title: '建管单位',
    dataIndex: 'label',
    key: 'slotOne',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: rowClick,
    className: 'unit-style',
    ellipsis: true,
  },
  {
    title: '工程码',
    children: [
      {
        title: '绿码',
        dataIndex: 'projectGreenCodeColorCount',
        key: 'projectGreenCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'projectYellowCodeColorCount',
        key: 'projectYellowCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'projectRedCodeColorCount',
        key: 'projectRedCodeColorCount',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '企业码',
    children: [
      {
        title: '绿码',
        dataIndex: 'companyGreenCodeColorCount',
        key: 'companyGreenCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'companyYellowCodeColorCount',
        key: 'companyYellowCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'companyRedCodeColorCount',
        key: 'companyRedCodeColorCount',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '人员码',
    children: [
      {
        title: '绿码',
        dataIndex: 'employeeGreenCodeColorCount',
        key: 'employeeGreenCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'employeeYellowCodeColorCount',
        key: 'employeeYellowCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'employeeRedCodeColorCount',
        key: 'employeeRedCodeColorCount',
        align: 'center',
        width: 50,
      },
    ],
  },
]

const columnsProject = [
  {
    title: '工程名称',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    align: 'center',
    className: 'unit-style',
    ellipsis: true,
  },
  {
    title: '码类型',
    dataIndex: 'codeColor',
    key: 'codeColor',
    width: 100,
    fixed: 'left',
    align: 'center',
    className: 'unit-style',
    ellipsis: true,
  },
  {
    title: '施工企业码',
    children: [
      {
        title: '绿码',
        dataIndex: 'companyGreenCodeColorCount',
        key: 'companyGreenCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'companyYellowCodeColorCount',
        key: 'companyYellowCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'companyRedCodeColorCount',
        key: 'companyRedCodeColorCount',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '施工人员码',
    children: [
      {
        title: '绿码',
        dataIndex: 'employeeGreenCodeColorCount',
        key: 'employeeGreenCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'employeeYellowCodeColorCount',
        key: 'employeeYellowCodeColorCount',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'employeeRedCodeColorCount',
        key: 'employeeRedCodeColorCount',
        align: 'center',
        width: 50,
      },
    ],
  },
]

const columnLog = [
  {
    title: '建管单位',
    dataIndex: 'label',
    key: 'slotOne',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: logRowClick,
    ellipsis: true,
  },
  {
    title: '作业计划数',
    dataIndex: 'planCount',
    key: 'planCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '施工日志上报数',
    dataIndex: 'sgWorkLogCount',
    key: 'sgWorkLogCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '监理日志上报数',
    dataIndex: 'jlWorkLogCount',
    key: 'jlWorkLogCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
]

const columnLogProject = [
  {
    title: '工程名称',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '作业计划数',
    dataIndex: 'planCount',
    key: 'planCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '施工日志上报数',
    dataIndex: 'sgWorkLogCount',
    key: 'sgWorkLogCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '监理日志上报数',
    dataIndex: 'jlWorkLogCount',
    key: 'jlWorkLogCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
]

const columnSupervision = [
  {
    title: '建管单位',
    dataIndex: 'supervisoryUnit',
    key: 'supervisoryUnit',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: rowClick,
    ellipsis: true,
  },
  {
    title: '作业计划数',
    dataIndex: 'jobPlanCount',
    key: 'jobPlanCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '监理旁站记录数',
    dataIndex: 'sideStationCount',
    key: 'sideStationCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡数',
    dataIndex: 'supervisorCount',
    key: 'supervisorCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡覆盖率',
    dataIndex: 'supervisorReportedCount',
    key: 'supervisorReportedCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患新增数',
    dataIndex: 'problemCreatedCount',
    key: 'problemCreatedCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患解决数',
    dataIndex: 'problemCount',
    key: 'problemCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题隐患解决/比例',
    dataIndex: 'problemScale',
    key: 'problemScale',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '巡检记录次数',
    dataIndex: 'inspectionCount',
    key: 'inspectionCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '维修记录次数',
    dataIndex: 'maintenanceRecordCount',
    key: 'maintenanceRecordCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
]

const columnRisk = [
  {
    title: '建管单位',
    dataIndex: 'supervisoryUnit',
    key: 'supervisoryUnit',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: rowClick,
    ellipsis: true,
  },
  {
    title: '一级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'oneJobPlanCount',
        key: 'oneJobPlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'oneJobOnDutyScale',
        key: 'oneJobOnDutyScale',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '二级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'twoJobPlanCount',
        key: 'twoJobPlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'twoJobOnDutyScale',
        key: 'twoJobOnDutyScale',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '三级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'threeJobPlanCount',
        key: 'threeJobPlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'threeJobOnDutyScale',
        key: 'threeJobOnDutyScale',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '四级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'fourJobPlanCount',
        key: 'fourJobPlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'fourJobOnDutyScale',
        key: 'fourJobOnDutyScale',
        align: 'center',
        width: 50,
      },
    ],
  },
  {
    title: '五级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'fiveJobPlanCount',
        key: 'fiveJobPlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'fiveJobOnDutyScale',
        key: 'fiveJobOnDutyScale',
        align: 'center',
        width: 50,
      },
    ],
  },
]
</script>
<style lang="less" scoped>
.ant-tabs.ant-tabs-left.ant-tabs-small {
  width: 100%;
  height: 100%;
}

.item-content {
  height: 100%;

  .table-wrap {
    min-height: 240px;
  }

  .handle-wrap {
    height: 100%;
  }

  .item-tab {
    background-color: #ffffff;
  }

  .item-statement {
    width: 100%;
    margin-top: 14px;
  }

  .btn-date {
    margin-bottom: 14px;
    margin-right: 14px;
  }
}
</style>
