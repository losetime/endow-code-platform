<template>
  <div class="inspection-solution-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.vrSn" placeholder="请输入设备编码" allowClear />
        <a-button type="primary" @click="handleReacquire(1)">查询</a-button>
      </a-space>
    </div>
    <a-space class="download-wrap">
      <a-button type="primary" @click="handleAdd">新增设备码</a-button>
      <a-button type="primary" @click="handleDownloadCode">批量下载设备码</a-button>
    </a-space>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="VRCodeColumns"
        :getTableList="apiGetVRCodeList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
            <a-button type="link" size="small" @click="checkQRCode(record)">设备码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
    <VRCodeDetail ref="vrCodeDetailInstance" />
    <VRCodeInfo :handleReacquire="handleReacquire" ref="vrCodeInfoInstance" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import VRCodeDetail from '@/components/home/VRCodeDetail.vue'
import VRCodeInfo from '@/components/home/VRCodeInfo.vue'
import { apiGetVRCodeList, apiDeleteVRInfo } from '@/service/api/home'
import { VRCodeColumns } from '@/columns/home'
import { createQRCode, downloadQRCode } from '@/utils/base'
import { actionTypeEnum } from '@/enums/commonEnum'
import { message } from 'ant-design-vue'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ vrSn: '' })

// 选择表格
const selectedRows = computed(() => (tableInstance.value ? tableInstance.value.selectedRows : []))

/**
 * @desc 列表搜索
 */
const handleReacquire = (page?: number) => {
  tableInstance.value.handleReacquire(page)
}

/**
 * @desc 下载二维码
 */
const handleDownloadCode = () => {
  const base64Arr: any[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push({
      name: item.vrSn,
      file: createQRCode(item.qrCode),
    })
  })
  downloadQRCode(base64Arr)
}

/**
 ********************************* 详情操作 ******************************************
 */

const vrCodeInfoInstance = ref()

/**
 * @desc 新增设备码
 */
const handleAdd = (record: any) => {
  vrCodeInfoInstance.value.initModal(actionTypeEnum.ADD, record)
}

/**
 * @desc 编辑设备码
 */
const handleEdit = (record: any) => {
  vrCodeInfoInstance.value.initModal(actionTypeEnum.EDIT, record)
}

/**
 * @desc 编辑设备码
 */
const handleDelete = async (record: any) => {
  const { code } = await apiDeleteVRInfo({ id: record.id })
  if (code === 20000) {
    message.success('删除成功')
    handleReacquire()
  }
}

/**
 ********************************* 详情操作 ******************************************
 */

const vrCodeDetailInstance = ref()

/**
 * @desc 查看二维码
 */
const checkQRCode = (record: any) => {
  vrCodeDetailInstance.value.initModal(record)
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
