<template>
  <a-button type="primary" @click="HandleSmAExport">导出报表</a-button>
  <a-button v-if="tempSmADeptIds.length > 0" type="primary" style="margin-left: 15px" @click="lastSmACompanyList"
    >返回上级</a-button
  >
  <div class="item-statement">
    <a-button class="btn-date" type="primary" @click="changeSmAParam(0)">本周</a-button>
    <a-button class="btn-date" type="primary" @click="changeSmAParam(1)">本月</a-button>
    <a-range-picker class="btn-date" v-model:value="dateArea" @change="onChange" />
    <ym-table
      ref="tableSmATaggingInstance"
      rowKey="id"
      v-if="!haveSmAProjectInfo"
      :columns="columnSupervision"
      :getTableList="getSupervisionManagementAnalysisData"
      :row-selection="false"
      :params="smaListParam"
    >
      <template #slotOne="{ index, record }">
        <a v-if="index > 0">{{ record.label }}</a>
        <span v-else>{{ record.label }}</span>
      </template>
    </ym-table>
    <ym-table
      ref="tableSmATaggingProjectInstance"
      rowKey="id"
      v-else
      :columns="columnSmAInfo"
      :getTableList="getSupervisionManagementAnalysisProjectData"
      :row-selection="false"
      :params="smaListParam"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import {
  apiGetSupervisonManagementAnalysisList,
  apiPostExportSupervisonManagementAnalysisList,
} from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
import { Moment } from 'moment'

const dateArea = ref<Moment[]>([])
const lastIsClick = ref(false)
const tableSmATaggingInstance = ref()
const tableSmATaggingProjectInstance = ref()
const haveSmAProjectInfo = ref(false)
//用来记录上一级的deptId
const tempSmADeptIds = ref<any>([])
//导出报表使用
const tempSmAExportList = ref<any>([])
//用来分析列表数据
const tempSmADataList = ref<any>([])
const smaListParam = ref<any>({
  deptId: '',
  endTime: '',
  startTime: '',
  thisMonth: false,
  thisWeek: false,
})

//改变报表查询参数方法  0：本周 1：本月
const changeSmAParam = (flag: number) => {
  if (flag === 0) {
    smaListParam.value.thisWeek = true
    smaListParam.value.thisMonth = false
  } else {
    smaListParam.value.thisWeek = false
    smaListParam.value.thisMonth = true
  }
  tableSmATaggingInstance.value.handleReacquire()
}

function smaRowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        lastIsClick.value = false
        smaListParam.value.deptId = record.id
        if (
          tempSmADeptIds.value.length == 0 ||
          tempSmADeptIds.value.indexOf(tempSmADataList.value[index].parentId) == -1
        ) {
          tempSmADeptIds.value.push(tempSmADataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          haveSmAProjectInfo.value = true
          return
        }
        tableSmATaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastSmACompanyList = () => {
  lastIsClick.value = true
  if (haveSmAProjectInfo.value) {
    haveSmAProjectInfo.value = false
  }
  smaListParam.value.deptId = tempSmADeptIds.value[tempSmADeptIds.value.length - 1]
  if (tableSmATaggingInstance.value !== null) tableSmATaggingInstance.value.handleReacquire()
}

const getSupervisionManagementAnalysisData = async (params: any) => {
  const { code, data } = await apiGetSupervisonManagementAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempSmADeptIds.value = tempSmADeptIds.value.slice(0, tempSmADeptIds.value.length - 1)
    tempSmAExportList.value = data
    return new Promise((resolve: any) => {
      tempSmADataList.value = data.map((item: any, i: number) => ({
        key: i,
        id: item.id,
        parentId: item.parentId,
        childrenColumnName: item.children,
        label: item.label,
        planCount: item.otherInfo.planCount,
        jlPzCount: item.otherInfo.jlPzCount,
        safetyCardCount: item.otherInfo.safetyCardCount,
        safetyCardCoverageRate: item.otherInfo.safetyCardCoverageRate,
        problemIncrementCount: item.otherInfo.problemIncrementCount,
        problemHandledCount: item.otherInfo.problemHandledCount,
        problemHandledRate: item.otherInfo.problemHandledRate,
        inspectionCount: item.otherInfo.inspectionCount,
        maintenanceCount: item.otherInfo.maintenanceCount,
      }))
      resolve({
        code: 20000,
        data: tempSmADataList.value,
      })
    })
  }
}

const getSupervisionManagementAnalysisProjectData = async (params: any) => {
  const { code, data } = await apiGetSupervisonManagementAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempSmADeptIds.value = tempSmADeptIds.value.slice(0, tempSmADeptIds.value.length - 1)
    tempSmAExportList.value = data
    return new Promise((resolve: any) => {
      tempSmADataList.value = data[0].otherInfo.singleProjects.map((item: any, index: number) => ({
        key: index,
        name: item.name,
        planCount: item.planCount,
        jlPzCount: item.jlPzCount,
        safetyCardCount: item.safetyCardCount,
        safetyCardCoverageRate: item.safetyCardCoverageRate,
        problemIncrementCount: item.problemIncrementCount,
        problemHandledCount: item.problemHandledCount,
        problemHandledRate: item.problemHandledRate,
        inspectionCount: item.inspectionCount,
        maintenanceCount: item.maintenanceCount,
      }))
      resolve({
        code: 20000,
        data: tempSmADataList.value,
      })
    })
  }
}

const HandleSmAExport = async () => {
  let exportParma = {
    deptId: smaListParam.value.deptId,
    reportData: tempSmAExportList.value,
  }
  if (tempSmAExportList.value.length == 0) {
    message.info('暂无报表需要导出')
    return
  }
  await apiPostExportSupervisonManagementAnalysisList(exportParma)
}

const onChange = (date: any, dateString: any) => {
  console.log('date', dateString)
  smaListParam.value.startTime = dateString[0]
  smaListParam.value.endTime = dateString[1]
  if (tableSmATaggingInstance.value != null) tableSmATaggingInstance.value.handleReacquire()
  if (tableSmATaggingProjectInstance.value != null) tableSmATaggingProjectInstance.value.handleReacquire()
}

const columnSupervision = [
  {
    title: '建管单位',
    dataIndex: 'supervisoryUnit',
    key: 'slotOne',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: smaRowClick,
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
    title: '监理旁站记录数',
    dataIndex: 'jlPzCount',
    key: 'jlPzCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡数',
    dataIndex: 'safetyCardCount',
    key: 'safetyCardCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡覆盖率',
    dataIndex: 'safetyCardCoverageRate',
    key: 'safetyCardCoverageRate',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患新增数',
    dataIndex: 'problemIncrementCount',
    key: 'problemIncrementCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患解决数',
    dataIndex: 'problemHandledCount',
    key: 'problemHandledCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题隐患解决/比例',
    dataIndex: 'problemHandledRate',
    key: 'problemHandledRate',
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
    dataIndex: 'maintenanceCount',
    key: 'maintenanceCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
]

const columnSmAInfo = [
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
    title: '监理旁站记录数',
    dataIndex: 'jlPzCount',
    key: 'jlPzCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡数',
    dataIndex: 'safetyCardCount',
    key: 'safetyCardCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '安全监督卡覆盖率',
    dataIndex: 'safetyCardCoverageRate',
    key: 'safetyCardCoverageRate',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患新增数',
    dataIndex: 'problemIncrementCount',
    key: 'problemIncrementCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题/隐患解决数',
    dataIndex: 'problemHandledCount',
    key: 'problemHandledCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '问题隐患解决/比例',
    dataIndex: 'problemHandledRate',
    key: 'problemHandledRate',
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
    dataIndex: 'maintenanceCount',
    key: 'maintenanceCount',
    width: 100,
    align: 'center',
    ellipsis: true,
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
