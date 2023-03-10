<template>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetCodingAnalysisList, apiPostExportCoddingAnalysisList } from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
//--------赋码分析------------
//赋码分析引用
const tableTaggingInstance = ref()
const tableTaggingProjectInstance = ref()
const codingAnalysisParams = ref<any>({
  deptId: '',
})
const lastIsClick = ref(false)
const haveProjectInfo = ref(false)
//用来记录赋码分析列表数据
const tempDataList = ref<any>([])
//用来记录上一级的deptId
const tempDeptIds = ref<any>([])
//导出报表使用
const tempExportList = ref<any>([])
function rowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        lastIsClick.value = false
        codingAnalysisParams.value.deptId = record.id
        if (tempDeptIds.value.length == 0 || tempDeptIds.value.indexOf(tempDataList.value[index].parentId) == -1) {
          tempDeptIds.value.push(tempDataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          haveProjectInfo.value = true
          return
        }
        tableTaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastCompanyList = () => {
  lastIsClick.value = true
  if (haveProjectInfo.value) {
    haveProjectInfo.value = false
  }
  codingAnalysisParams.value.deptId = tempDeptIds.value[tempDeptIds.value.length - 1]
  if (tableTaggingInstance.value !== null) tableTaggingInstance.value.handleReacquire()
}

const getCodingAnalysisData = async (params: any) => {
  const { code, data } = await apiGetCodingAnalysisList(params)
  if (code === 20000) {
    tempExportList.value = data
    if (lastIsClick.value) tempDeptIds.value = tempDeptIds.value.slice(0, tempDeptIds.value.length - 1)
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
    if (lastIsClick.value) tempDeptIds.value = tempDeptIds.value.slice(0, tempDeptIds.value.length - 1)
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
</script>

<style lang="less" scoped>
.item-statement {
  width: 100%;
  margin-top: 14px;
}
</style>
