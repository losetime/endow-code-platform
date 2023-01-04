<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="item-content">
    <div class="item-tab">
      <a-button type="primary" @click="handleAddCard">新增</a-button>
      <div class="item-statement"></div>
    </div>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="saftyCardColumns"
        :row-selection="false"
        :getTableList="apiGetSaftyCardInfo"
        ref="tableInstance"
      >
        <!-- <template v-if="record.statu === 1" #action="{ record }">
          <a-space>
            <a-button type="link" size="small">查看</a-button>
            <a-button class="action-middle" type="link" size="small">重命名</a-button>
            <a-button type="link" size="small">取消发布</a-button>
          </a-space>
        </template> -->
      </ym-table>
    </div>
    <create-safty-card ref="cardInstance" :handleRefresh="handleCardRefresh" :getSourceData="getCardSourceData" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { saftyCardColumns } from '@/columns/home'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetSaftyCardInfo } from '@/service/api/saftyCard'
import CreateSaftyCard from '@/components/saftyCardView/CreateSaftyCard.vue'

// 表格实例
const tableInstance = ref()
const cardInstance = ref()

/**
 * @desc 列表刷新
 */
const handleCardRefresh = () => {
  tableInstance.value.handleReacquire(1)
}

const getCardSourceData = () => {
  tableInstance.value.handleReacquire()
}

/**
 * @desc 新增项目内容
 */
const handleAddCard = () => {
  cardInstance.value.initModal()
}
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
    margin-top: 14px;
  }

  .item-tab {
    background-color: #ffffff;
    padding: 14px;
  }

  .item-statement {
    width: 100%;
  }

  .action-middle {
    margin: 0 14px;
  }
}
</style>
