<template>
  <div class="inspection-solution-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.name" placeholder="请输入企业名称" allowClear />
        <a-input v-model:value="searchParams.licenseCode" placeholder="请输入统一社会信用代码" allowClear />
        <a-button type="primary" @click="onSearch">查询</a-button>
      </a-space>
    </div>
    <a-space class="download-wrap">
      <a-button type="primary" @click="handleDownloadCode">下载二维码</a-button>
    </a-space>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="EnterpriseCodeColumns"
        :getTableList="apiGetEnterpriseCodeList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #slotOne="{ record }">
          <span :style="{ color: formatQRcodeColor(record.codeColor) }">{{ formatQRcodeText(record.codeColor) }}</span>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="checkQRCode(record)">查看二维码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
    <enterprise-code-detail ref="detailInstance" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import EnterpriseCodeDetail from '@/components/home/EnterpriseCodeDetail.vue'
import { apiGetEnterpriseCodeList } from '@/service/api/home'
import { EnterpriseCodeColumns } from '@/columns/home'
import { formatQRcodeText, formatQRcodeColor } from '@/enums/homeEnum'
import { downloadQRCode } from '@/utils/base'
import { createQRCode } from '@/utils/base'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ name: '', licenseCode: '' })

// 选择表格
const selectedRows = computed(() => (tableInstance.value ? tableInstance.value.selectedRows : []))

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

/**
 * @desc 下载二维码
 */
const handleDownloadCode = () => {
  const base64Arr: string[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push(createQRCode(item.infoCode, item.codeColor))
  })
  downloadQRCode(base64Arr)
}

/**
 ********************************* 详情操作 ******************************************
 */

const detailInstance = ref()

/**
 * @desc 查看二维码
 */
const checkQRCode = (record: any) => {
  detailInstance.value.initModal(record)
}
</script>

<style lang="less" scoped>
.inspection-solution-wrapper {
  height: 100%;
  .handle-wrap {
    display: flex;
    justify-content: space-between;
  }
  .download-wrap {
    width: 100%;
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
