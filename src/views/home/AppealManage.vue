<template>
  <div class="complaint-manage-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-select
          v-model:value="searchParams.type"
          :options="transcodeTypeOptions"
          style="width: 200px"
          allowClear
          placeholder="请输入申诉对象类型"
        />
        <a-input v-model:value="searchParams.name" placeholder="请输入申诉对象名称" allowClear />
        <a-button type="primary" @click="onSearch">查询</a-button>
      </a-space>
    </div>
    <div class="tabs-wrap">
      <a-tabs v-model:activeKey="tabKey">
        <a-tab-pane key="0" tab="未处理">
          <div class="table-wrap">
            <ym-table
              rowKey="id"
              :columns="NotHandleAppealColumns"
              :getTableList="apiGetAppealManageList"
              :params="searchParams"
              :rowSelection="false"
              ref="tableInstance"
            >
              <template #slotOne="{ record }">
                <span :style="{ color: formatQRcodeColor(record.codeColor) }">{{
                  formatQRcodeText(record.codeColor)
                }}</span>
              </template>
              <template #action="{ record }">
                <a-space>
                  <a-button type="link" size="small" @click="handleMarker(record)">标记为已处理</a-button>
                  <a-button type="link" size="small" @click="handleEndowCode(record)">去赋码</a-button>
                </a-space>
              </template>
            </ym-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="1" tab="已处理">
          <div class="table-wrap">
            <ym-table
              rowKey="id"
              :columns="AlreadyHandleAppealColumns"
              :getTableList="apiGetAppealManageList"
              :params="searchParams"
              :rowSelection="false"
              ref="tableInstance"
            >
              <template #slotOne="{ record }">
                <span :style="{ color: formatQRcodeColor(record.codeColor) }">{{
                  formatQRcodeText(record.codeColor)
                }}</span>
              </template>
            </ym-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetAppealManageList, apiHandleMarkProcessed } from '@/service/api/home'
import { NotHandleAppealColumns, AlreadyHandleAppealColumns } from '@/columns/home'
import { useRouter } from 'vue-router'
import { transcodeTypeOptions } from '@/enums/homeEnum'
import { message } from 'ant-design-vue'
import { formatQRcodeText, formatQRcodeColor } from '@/enums/homeEnum'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ status: '0', name: '', type: null })

const tabKey = ref('0')

watch(
  () => tabKey.value,
  () => {
    searchParams.status = tabKey.value
    tableInstance.value.handleReacquire()
  },
)

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

/**
 * @desc 标记为已处理
 */
const handleMarker = async (record: any) => {
  const { code } = await apiHandleMarkProcessed({ id: record.id })
  if (code === 20000) {
    message.success('标记成功')
    onSearch()
  }
}

const router = useRouter()

/**
 * @desc 去赋码
 */
const handleEndowCode = (record: any) => {
  router.push({
    name: 'ConvertCodeDetail',
    query: {
      id: record.id,
    },
  })
}
</script>

<style lang="less" scoped>
.complaint-manage-wrapper {
  height: 100%;
  .handle-wrap {
    display: flex;
    justify-content: space-between;
  }
  .tabs-wrap {
    margin-top: 14px;
    padding: 14px;
    background-color: #ffffff;
    ::v-deep(.ant-tabs) {
      .ant-tabs-nav {
        margin-bottom: 0;
      }
      .ant-tabs-content-holder {
        .ant-tabs-content {
          .ant-tabs-tabpane {
            .table-wrap {
              width: 100%;
              margin-top: 0 !important;
              padding: 0 !important;
              height: calc(100vh - 295px) !important;
              position: relative;
            }
          }
        }
      }
    }
  }
}
</style>
