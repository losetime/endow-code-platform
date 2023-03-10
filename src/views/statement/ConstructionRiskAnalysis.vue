<template>
  <a-button type="primary" @click="HandleRiskExport">导出报表</a-button>
  <a-button v-if="tempRiskDeptIds.length > 0" type="primary" style="margin-left: 15px" @click="lastRiskCompanyList"
    >返回上级</a-button
  >
  <div class="item-statement">
    <a-button class="btn-date" type="primary" @click="changeRiskParam(0)">本周</a-button>
    <a-button class="btn-date" type="primary" @click="changeRiskParam(1)">本月</a-button>
    <a-range-picker class="btn-date" v-model:value="dateArea" @change="onChange" />
    <ym-table
      ref="tableRiskTaggingInstance"
      rowKey="id"
      v-if="!haveRiskProjectInfo"
      :columns="columnRisk"
      :getTableList="getRiskAnalysisData"
      :row-selection="false"
      :params="riskListParam"
    >
      <template #slotOne="{ index, record }">
        <a v-if="index > 0">{{ record.label }}</a>
        <span v-else>{{ record.label }}</span>
      </template>
    </ym-table>
    <ym-table
      ref="tableRiskTaggingProjectInstance"
      rowKey="id"
      v-else
      :columns="columnRiskProject"
      :getTableList="getRiskAnalysisProjectData"
      :row-selection="false"
      :params="riskListParam"
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
const tableRiskTaggingInstance = ref()
const tableRiskTaggingProjectInstance = ref()
const haveRiskProjectInfo = ref(false)
//用来记录上一级的deptId
const tempRiskDeptIds = ref<any>([])
//导出报表使用
const tempRiskExportList = ref<any>([])
//用来记录实施风险分析列表数据
const tempRiskDataList = ref<any>([])
const riskListParam = ref<any>({
  deptId: '',
  endTime: '',
  startTime: '',
  thisMonth: false,
  thisWeek: false,
})

//改变报表查询参数方法  0：本周 1：本月
const changeRiskParam = (flag: number) => {
  if (flag === 0) {
    riskListParam.value.thisWeek = true
    riskListParam.value.thisMonth = false
  } else {
    riskListParam.value.thisWeek = false
    riskListParam.value.thisMonth = true
  }
  tableRiskTaggingInstance.value.handleReacquire()
}

function rowClick(record: any, index: any) {
  return {
    onClick: () => {
      if (index > 0) {
        lastIsClick.value = false
        riskListParam.value.deptId = record.id
        if (
          tempRiskDeptIds.value.length == 0 ||
          tempRiskDeptIds.value.indexOf(tempRiskDataList.value[index].parentId) == -1
        ) {
          tempRiskDeptIds.value.push(tempRiskDataList.value[index].parentId)
        }
        if (record.childrenColumnName == null || record.childrenColumnName.length == 0) {
          haveRiskProjectInfo.value = true
          return
        }
        tableRiskTaggingInstance.value.handleReacquire()
      }
    },
  }
}

const lastRiskCompanyList = () => {
  lastIsClick.value = true
  if (haveRiskProjectInfo.value) {
    haveRiskProjectInfo.value = false
  }
  riskListParam.value.deptId = tempRiskDeptIds.value[tempRiskDeptIds.value.length - 1]
  if (tableRiskTaggingInstance.value !== null) tableRiskTaggingInstance.value.handleReacquire()
}

const getRiskAnalysisData = async (params: any) => {
  const { code, data } = await apiGetConstructionRiskAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempRiskDeptIds.value = tempRiskDeptIds.value.slice(0, tempRiskDeptIds.value.length - 1)
    tempRiskExportList.value = data
    return new Promise((resolve: any) => {
      tempRiskDataList.value = data.map((item: any, i: number) => ({
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
        data: tempRiskDataList.value,
      })
    })
  }
}

const getRiskAnalysisProjectData = async (params: any) => {
  const { code, data } = await apiGetConstructionRiskAnalysisList(params)
  if (code === 20000) {
    if (lastIsClick.value) tempRiskDeptIds.value = tempRiskDeptIds.value.slice(0, tempRiskDeptIds.value.length - 1)
    tempRiskExportList.value = data
    return new Promise((resolve: any) => {
      tempRiskDataList.value = data[0].otherInfo.singleProjects.map((item: any, index: number) => ({
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
        data: tempRiskDataList.value,
      })
    })
  }
}

const HandleRiskExport = async () => {
  let exportParma = {
    deptId: riskListParam.value.deptId,
    reportData: tempRiskExportList.value,
  }
  if (tempRiskExportList.value.length == 0) {
    message.info('暂无报表需要导出')
    return
  }
  await apiPostExportConstructionRiskAnalysisList(exportParma)
}

const onChange = (date: any, dateString: any) => {
  riskListParam.value.startTime = dateString[0]
  riskListParam.value.endTime = dateString[1]
  if (tableRiskTaggingInstance.value != null) tableRiskTaggingInstance.value.handleReacquire()
  if (tableRiskTaggingProjectInstance.value != null) tableRiskTaggingProjectInstance.value.handleReacquire()
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

const columnRiskProject = [
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
