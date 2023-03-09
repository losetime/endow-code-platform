<template>
  <div class="item-content">
    <div class="handle-wrap">
      <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition" :tabBarGutter="20" size="small">
        <a-tab-pane class="item-tab" key="1" tab="赋码分析">
          <coding-analysis />
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="2" tab="日志分析">
          <log-analysis />
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="3" tab="监督管理分析">
          <supervision-management-analysis />
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="4" tab="施工风险分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <!-- <a-button class="btn-date" type="primary">本周</a-button>
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
            </ym-table> -->
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CodingAnalysis from '@/views/statement/CodingAnalysis.vue'
import LogAnalysis from '@/views/statement/LogAnalysis.vue'
import SupervisionManagementAnalysis from '@/views/statement/SupervisionManagementAnalysis.vue'

//tab页相关
const tabPosition = ref('left')
const activeKey = ref('1')

// const columnRisk = [
//   {
//     title: '建管单位',
//     dataIndex: 'supervisoryUnit',
//     key: 'supervisoryUnit',
//     width: 100,
//     fixed: 'left',
//     align: 'center',
//     customCell: rowClick,
//     ellipsis: true,
//   },
//   {
//     title: '一级风险',
//     children: [
//       {
//         title: '作业计划数',
//         dataIndex: 'oneJobPlanCount',
//         key: 'oneJobPlanCount',
//         align: 'center',
//         width: 50,
//       },
//       {
//         title: '到岗到位率',
//         dataIndex: 'oneJobOnDutyScale',
//         key: 'oneJobOnDutyScale',
//         align: 'center',
//         width: 50,
//       },
//     ],
//   },
//   {
//     title: '二级风险',
//     children: [
//       {
//         title: '作业计划数',
//         dataIndex: 'twoJobPlanCount',
//         key: 'twoJobPlanCount',
//         align: 'center',
//         width: 50,
//       },
//       {
//         title: '到岗到位率',
//         dataIndex: 'twoJobOnDutyScale',
//         key: 'twoJobOnDutyScale',
//         align: 'center',
//         width: 50,
//       },
//     ],
//   },
//   {
//     title: '三级风险',
//     children: [
//       {
//         title: '作业计划数',
//         dataIndex: 'threeJobPlanCount',
//         key: 'threeJobPlanCount',
//         align: 'center',
//         width: 50,
//       },
//       {
//         title: '到岗到位率',
//         dataIndex: 'threeJobOnDutyScale',
//         key: 'threeJobOnDutyScale',
//         align: 'center',
//         width: 50,
//       },
//     ],
//   },
//   {
//     title: '四级风险',
//     children: [
//       {
//         title: '作业计划数',
//         dataIndex: 'fourJobPlanCount',
//         key: 'fourJobPlanCount',
//         align: 'center',
//         width: 50,
//       },
//       {
//         title: '到岗到位率',
//         dataIndex: 'fourJobOnDutyScale',
//         key: 'fourJobOnDutyScale',
//         align: 'center',
//         width: 50,
//       },
//     ],
//   },
//   {
//     title: '五级风险',
//     children: [
//       {
//         title: '作业计划数',
//         dataIndex: 'fiveJobPlanCount',
//         key: 'fiveJobPlanCount',
//         align: 'center',
//         width: 50,
//       },
//       {
//         title: '到岗到位率',
//         dataIndex: 'fiveJobOnDutyScale',
//         key: 'fiveJobOnDutyScale',
//         align: 'center',
//         width: 50,
//       },
//     ],
//   },
// ]
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
