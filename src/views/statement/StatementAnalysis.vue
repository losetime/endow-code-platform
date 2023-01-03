<template>
  <div class="item-content">
    <div class="handle-wrap">
      <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition" :tabBarGutter="20" size="small">
        <a-tab-pane class="item-tab" key="1" tab="赋码分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <ym-table
              rowKey="id"
              :columns="columns"
              :getTableList="apiGetUserInfo"
              :row-selection="false"
              ref="tableTaggingInstance"
            >
              <template #bodyCell="{ column, text, index }">
                <template v-if="column.dataIndex === 'constructionUnit'">
                  <a v-if="index > 0">{{ text }}</a>
                  <span v-else>{{ text }}</span>
                </template>
              </template>
            </ym-table>
          </div>
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="2" tab="日志分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-button class="btn-date" type="primary">本周</a-button>
            <a-button class="btn-date" type="primary">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" @change="onChange" />
            <!-- <a-table :columns="columnLog" :data-source="logData" bordered size="middle"
              :scroll="{ x: 'calc(700px + 50%)', y: 240 }"> -->
            <!-- :getTableList="apiGetProjectCodeList" -->

            <ym-table
              rowKey="id"
              :columns="columnLog"
              :getTableList="apiGetUserInfo"
              :row-selection="false"
              ref="tableInstance"
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
        <a-tab-pane class="item-tab" key="3" tab="监督管理分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-button class="btn-date" type="primary">本周</a-button>
            <a-button class="btn-date" type="primary">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" />
            <ym-table
              rowKey="id"
              :columns="columnSupervision"
              :getTableList="apiGetUserInfo"
              :row-selection="false"
              ref="tableSupervisionInstance"
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
        <a-tab-pane class="item-tab" key="4" tab="施工风险分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-button class="btn-date" type="primary">本周</a-button>
            <a-button class="btn-date" type="primary">本月</a-button>
            <a-range-picker class="btn-date" v-model:value="dateArea" />

            <ym-table
              rowKey="id"
              :columns="columnRisk"
              :getTableList="apiGetUserInfo"
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
import { ref } from 'vue'
import type { Dayjs } from 'dayjs'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetUserInfo, apiGetInfoByDateArea } from '@/service/api/statementAnalysis'
import { message } from 'ant-design-vue'
import moment, { Moment } from 'moment'
const tabPosition = ref('left')
const activeKey = ref('1')
const tableTaggingInstance = ref()
const tableInstance = ref()
const tableSupervisionInstance = ref()
const tableRiskInstance = ref()

const dateArea = ref<Moment[]>()
function rowClick(record: any, index: any) {
  return {
    onClick: (event: any) => {
      console.log(record.tablename, index, event, '666')
      //TODO 添加事件
    },
  }
}

/**
 * @desc 列表搜索
 */
const handleReacquire = (page?: number) => {
  tableInstance.value.handleReacquire(page)
}

const onDateChange = async (dateArea: RangeValue) => {
  const { code } = await apiGetInfoByDateArea({ startDate: dateArea[0]?.toString, endDate: dateArea[1]?.toString })
  if (code === 20000) {
    message.success('删除成功')
    handleReacquire()
  }
}

const onChange = (date: any, dateString: any) => {
  console.log('date', dateString)
}

const columns = [
  {
    title: '建管单位',
    dataIndex: 'constructionUnit',
    key: 'operation',
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
        dataIndex: 'projectGreen',
        key: 'projectGreen',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'projectOrange',
        key: 'projectOrange',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'projectRed',
        key: 'projectRed',
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
        dataIndex: 'enterpriseGreen',
        key: 'enterpriseGreen',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'enterpriseOrange',
        key: 'enterpriseOrange',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'enterpriseRed',
        key: 'enterpriseRed',
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
        dataIndex: 'personGreen',
        key: 'personGreen',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'personOrange',
        key: 'personOrange',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'personRed',
        key: 'personRed',
        align: 'center',
        width: 50,
      },
    ],
  },
]
const data = [...Array(100)].map((_, i) => ({
  key: i,
  constructionUnit: '国网陕西公司',
  projectGreen: i + 1,
  projectOrange: i + 1,
  projectRed: i + 1,
  enterpriseGreen: i + 1,
  enterpriseOrange: i + 1,
  enterpriseRed: i + 1,
  personGreen: i + 1,
  personOrange: i + 1,
  personRed: i + 1,
}))

const columnProject = [
  {
    title: '工程名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 100,
    fixed: 'left',
    align: 'center',
    customCell: rowClick,
    ellipsis: true,
  },
  {
    title: '码类型',
    dataIndex: 'codeType',
    key: 'codeType',
    width: 100,
    fixed: 'left',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '施工企业码',
    children: [
      {
        title: '绿码',
        dataIndex: 'buildCompanyGreen',
        key: 'buildCompanyGreen',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'buildCompanyOrange',
        key: 'buildCompanyOrange',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'buildCompanyRed',
        key: 'buildCompanyRed',
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
        dataIndex: 'buildPersonGreen',
        key: 'buildPersonGreen',
        align: 'center',
        width: 50,
      },
      {
        title: '黄码',
        dataIndex: 'buildPersonOrange',
        key: 'buildPersonOrange',
        align: 'center',
        width: 50,
      },
      {
        title: '红码',
        dataIndex: 'buildPersonRed',
        key: 'buildPersonRed',
        align: 'center',
        width: 50,
      },
    ],
  },
]

const columnLog = [
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
    title: '施工日志上报数',
    dataIndex: 'logReportedCount',
    key: 'logReportedCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '监理日志上报数',
    dataIndex: 'supervisorReportedCount',
    key: 'supervisorReportedCount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
]

const logData = [...Array(100)].map((_, i) => ({
  key: i,
  supervisoryUnit: '国网陕西公司',
  jobPlanCount: i + 1,
  logReportedCount: i + 1,
  supervisorReportedCount: i + 1,
}))

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

const SupervisionData = [...Array(100)].map((_, i) => ({
  key: i,
  supervisoryUnit: '国网陕西公司',
}))

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
