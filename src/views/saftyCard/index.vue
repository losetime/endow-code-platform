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
        :params="params"
        ref="tableInstance"
      >
        <template #slotOne="{ record }">
          <a-button type="link" size="small" @click="handleConfig(record)">配置</a-button>
        </template>
        <template #action="{ record }">
          <a-space v-if="record?.status == '已发布'">
            <a-button class="btn-item" type="link" size="small">重命名</a-button>
            <a-popconfirm
              placement="topRight"
              title="确认撤销发布该安全监督卡吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="confirmUnPublish(record.id)"
            >
              <a-button type="link" size="small">撤销发布</a-button>
            </a-popconfirm>
          </a-space>

          <a-space v-else-if="record?.status === '已撤销'">
            <a-button type="link" size="small" @click="handleRename(record)">重命名</a-button>
            <a-popconfirm
              placement="top"
              title="确认重新发布该安全监督卡吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="confirmPublish(record.id)"
            >
              <a-button type="link" size="small">重新发布</a-button>
            </a-popconfirm>
          </a-space>

          <a-space v-else>
            <a-button type="link" size="small" @click="handleRename(record)">重命名</a-button>
            <a-popconfirm
              placement="top"
              title="确认发布该安全监督卡吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="confirmPublish(record.id)"
            >
              <a-button type="link" size="small">发布</a-button>
            </a-popconfirm>

            <a-popconfirm
              placement="topRight"
              title="确认删除该安全监督卡吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="confirm(record.id)"
            >
              <a-button class="btn-item" type="link" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </ym-table>
    </div>
    <create-safty-card ref="cardInstance" :handleRefresh="handleCardRefresh" :getSourceData="getCardSourceData" />
    <re-name-card ref="renameInstance" :handleRefresh="handleCardRefresh" :getSourceData="getCardSourceData" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { saftyCardColumns } from '@/columns/home'
import YmTable from '@/components/common/YmTable.vue'
import {
  apiGetSaftyCardInfo,
  apiDeleteSaftyCard,
  apiUnPublishSaftyCard,
  apiPublishSaftyCard,
} from '@/service/api/saftyCard'
import CreateSaftyCard from '@/components/saftyCardView/CreateSaftyCard.vue'
import ReNameCard from '@/components/saftyCardView/ReNameCard.vue'
import { message } from 'ant-design-vue'
import router from '@/router'

// 表格实例
const tableInstance = ref()
const cardInstance = ref()
const renameInstance = ref()
const params = ref()

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

const handleConfig = (scope: any) => {
  router.push({
    path: '/home/safty-card-config',
    query: { cardId: scope.id },
  })
}

const handleRename = (scope: any) => {
  renameInstance.value.initModal(scope.id, scope.name)
}

const confirm = async (scope: any) => {
  const { code } = await apiDeleteSaftyCard(scope)
  if (code === 20000) {
    message.success('操作成功')
    tableInstance.value.handleReacquire(1)
  }
}

const confirmUnPublish = async (scope: any) => {
  const { code } = await apiUnPublishSaftyCard(scope)
  if (code === 20000) {
    message.success('操作成功')
    tableInstance.value.handleReacquire(1)
  }
}

const confirmPublish = async (scope: any) => {
  const { code } = await apiPublishSaftyCard(scope)
  if (code === 20000) {
    message.success('操作成功')
    tableInstance.value.handleReacquire(1)
  }
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
}
</style>
