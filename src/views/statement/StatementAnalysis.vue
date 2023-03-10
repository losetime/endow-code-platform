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
          <construction-risk-analysis />
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
import ConstructionRiskAnalysis from '@/views/statement/ConstructionRiskAnalysis.vue'

//tab页相关
const tabPosition = ref('left')
const activeKey = ref('1')
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
