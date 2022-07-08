<template>
  <div class="inspection-solution-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.aggName" placeholder="请输入企业名称" />
        <a-input v-model:value="searchParams.aggName" placeholder="请输入统一社会信用代码" />
        <a-button type="primary" @click="onSearch">查询</a-button>
      </a-space>
    </div>
    <div class="download-qr-code">
      <a-button type="primary" @click="onSearch">下载二维码</a-button>
    </div>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="EnterpriseCodeColumns"
        :getTableList="apiGetTaskScheduleList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="checkQRCode(record)">查看二维码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetTaskScheduleList } from '@/service/api/home'
import { EnterpriseCodeColumns } from '@/columns/home'
import { useRouter } from 'vue-router'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ aggName: '' })

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

const router = useRouter()

/**
 * @desc 查看二维码
 */
const checkQRCode = (record: any) => {
  router.push({
    name: 'EditInspectionSolution',
    query: {
      id: record.id,
    },
  })
}
</script>

<style lang="less" scoped>
.inspection-solution-wrapper {
  height: 100%;
  .handle-wrap {
    display: flex;
    justify-content: space-between;
  }
  .download-qr-code {
    background-color: #ffffff;
    margin-top: 14px;
    padding: 14px 0 0 14px;
  }
  .table-wrap {
    margin-top: 0 !important;
    height: calc(100% - 120px) !important;
  }
}
</style>
