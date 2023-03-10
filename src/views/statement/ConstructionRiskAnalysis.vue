<template>
  <a-button type="primary" @click="HandleLogExport">导出报表</a-button>
  <a-button v-if="tempLogDeptIds.length > 0" type="primary" style="margin-left: 15px" @click="lastLogCompanyList"
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
      :columns="columnRisk"
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import {
  apiGetConstructionRiskAnalysisList,
  apiPostExportConstructionRiskAnalysisList,
} from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
import { Moment } from 'moment'

const dateArea = ref<Moment[]>([])
const lastIsClick = ref(false)
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

function rowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        lastIsClick.value = false
        logListParam.value.deptId = record.id
        if (
          tempLogDeptIds.value.length == 0 ||
          tempLogDeptIds.value.indexOf(tempLogDataList.value[index].parentId) == -1
        ) {
          tempLogDeptIds.value.push(tempLogDataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          haveLogProjectInfo.value = true
          return
        }
        tableLogTaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastLogCompanyList = () => {
  lastIsClick.value = true
  if (haveLogProjectInfo.value) {
    haveLogProjectInfo.value = false
  }
  logListParam.value.deptId = tempLogDeptIds.value[tempLogDeptIds.value.length - 1]
  if (tableLogTaggingInstance.value !== null) tableLogTaggingInstance.value.handleReacquire()
}

const getLogAnalysisData = async (params: any) => {
  const { code, data } = await apiGetConstructionRiskAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempLogDeptIds.value = tempLogDeptIds.value.slice(0, tempLogDeptIds.value.length - 1)
    tempLogExportList.value = data
    return new Promise((resolve: any) => {
      tempLogDataList.value = data.map((item: any, i: number) => ({
        key: i,
        id: item.id,
        parentId: item.parentId,
        label: item.label,
        risk1PlanCount: item.otherInfo.risk1PlanCount,
        risk1OnDutyRate: item.otherInfo.risk1OnDutyRate,
        risk2PlanCount: item.otherInfo.risk2PlanCount,
        risk2OnDutyRate: item.otherInfo.risk2OnDutyRate,
        risk3PlanCount: item.otherInfo.risk3PlanCount,
        risk3OnDutyRate: item.otherInfo.risk3OnDutyRate,
        risk4PlanCount: item.otherInfo.risk4PlanCount,
        risk4OnDutyRate: item.otherInfo.risk4OnDutyRate,
        risk5PlanCount: item.otherInfo.risk5PlanCount,
        risk5OnDutyRate: item.otherInfo.risk5OnDutyRate,
        childrenColumnName: item.children,
        singleProjects: item.otherInfo.singleProjects,
      }))
      resolve({
        code: 20000,
        data: tempLogDataList.value,
      })
    })
  }
}

const getLogAnalysisProjectData = async (params: any) => {
  const { code, data } = await apiGetConstructionRiskAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempLogDeptIds.value = tempLogDeptIds.value.slice(0, tempLogDeptIds.value.length - 1)
    tempLogExportList.value = data
    return new Promise((resolve: any) => {
      tempLogDataList.value = data[0].otherInfo.singleProjects.map((item: any, index: number) => ({
        key: index,
        name: item.name,
        risk1PlanCount: item.risk1PlanCount,
        risk1OnDutyRate: item.risk1OnDutyRate,
        risk2PlanCount: item.risk2PlanCount,
        risk2OnDutyRate: item.risk2OnDutyRate,
        risk3PlanCount: item.risk3PlanCount,
        risk3OnDutyRate: item.risk3OnDutyRate,
        risk4PlanCount: item.risk4PlanCount,
        risk4OnDutyRate: item.risk4OnDutyRate,
        risk5PlanCount: item.risk5PlanCount,
        risk5OnDutyRate: item.risk5OnDutyRate,
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
  await apiPostExportConstructionRiskAnalysisList(exportParma)
}

const onChange = (date: any, dateString: any) => {
  console.log('date', dateString)
  logListParam.value.startTime = dateString[0]
  logListParam.value.endTime = dateString[1]
  if (tableLogTaggingInstance.value != null) tableLogTaggingInstance.value.handleReacquire()
  if (tableLogTaggingProjectInstance.value != null) tableLogTaggingProjectInstance.value.handleReacquire()
}

const columnRisk = [
  {
    title: '建管单位',
    dataIndex: 'label',
    key: 'slotOne',
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
        dataIndex: 'risk1PlanCount',
        key: 'risk1PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk1OnDutyRate',
        key: 'risk1OnDutyRate',
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
        dataIndex: 'risk2PlanCount',
        key: 'risk2PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk2OnDutyRate',
        key: 'risk2OnDutyRate',
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
        dataIndex: 'risk3PlanCount',
        key: 'risk3PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk3OnDutyRate',
        key: 'risk3OnDutyRate',
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
        dataIndex: 'risk4PlanCount',
        key: 'risk4PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk4OnDutyRate',
        key: 'risk4OnDutyRate',
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
        dataIndex: 'risk5PlanCount',
        key: 'risk5PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk5OnDutyRate',
        key: 'risk5OnDutyRate',
        align: 'center',
        width: 50,
      },
    ],
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
    title: '一级风险',
    children: [
      {
        title: '作业计划数',
        dataIndex: 'risk1PlanCount',
        key: 'risk1PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk1OnDutyRate',
        key: 'risk1OnDutyRate',
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
        dataIndex: 'risk2PlanCount',
        key: 'risk2PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk2OnDutyRate',
        key: 'risk2OnDutyRate',
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
        dataIndex: 'risk3PlanCount',
        key: 'risk3PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk3OnDutyRate',
        key: 'risk3OnDutyRate',
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
        dataIndex: 'risk4PlanCount',
        key: 'risk4PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk4OnDutyRate',
        key: 'risk4OnDutyRate',
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
        dataIndex: 'risk5PlanCount',
        key: 'risk5PlanCount',
        align: 'center',
        width: 50,
      },
      {
        title: '到岗到位率',
        dataIndex: 'risk5OnDutyRate',
        key: 'risk5OnDutyRate',
        align: 'center',
        width: 50,
      },
    ],
  },
]
</script>

<style lang="less" scoped>
.item-statement {
  width: 100%;
  margin-top: 14px;
}
.btn-date {
  margin-bottom: 14px;
  margin-right: 14px;
}
</style>
