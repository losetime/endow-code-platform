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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetLogAnalysisList, apiPostExportLogAnalysisList } from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
import { Moment } from 'moment'

const dateArea = ref<Moment[]>([])

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
          haveLogProjectInfo.value = true
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

const onChange = (date: any, dateString: any) => {
  console.log('date', dateString)
  logListParam.value.startTime = dateString[0]
  logListParam.value.endTime = dateString[1]
  if (tableLogTaggingInstance.value != null) tableLogTaggingInstance.value.handleReacquire()
  if (tableLogTaggingProjectInstance.value != null) tableLogTaggingProjectInstance.value.handleReacquire()
}

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
