<template>
  <div class="code-convert-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.reason" placeholder="请输入转码说明" allowClear />
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button danger @click="handleDelete" :disabled="selectedRowKeys.length <= 0">删除</a-button>
      </a-space>
    </div>
    <a-space class="download-wrap">
      <a-button type="primary" @click="addConvertCodeRule">新增转码规则</a-button>
    </a-space>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="CodeConvertColumns"
        :getTableList="apiGetTranscodeList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleRelease(record)">
              {{ record.status === '0' ? '发布' : '取消发布' }}
            </a-button>
            <a-button type="link" size="small" @click="handleCheck(record)">查看</a-button>
            <a-button type="link" size="small" @click="handleEdit(record)" v-if="record.status === '0'">编辑</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import { apiGetTranscodeList, apiDeleteTranscode, apiSaveTranscodeInfo } from '@/service/api/home'
import { CodeConvertColumns } from '@/columns/home'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { YmModal } from '@/utils/antd'
import { actionTypeEnum } from '@/enums/commonEnum'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ reason: '' })

const selectedRowKeys = computed(() => (tableInstance.value ? tableInstance.value.selectedRowKeys : []))

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

/**
 * @desc 删除
 */
const handleDelete = async () => {
  YmModal.delete(async () => {
    const { code } = await apiDeleteTranscode(selectedRowKeys.value)
    if (code === 20000) {
      onSearch()
      message.success('删除成功')
    }
  })
}

const router = useRouter()

/**
 * @desc 新增转码规则
 */
const addConvertCodeRule = () => {
  router.push({
    name: 'ConvertCodeDetail',
    query: {
      handleType: actionTypeEnum.ADD,
    },
  })
}

/**
 * @desc 发布/取消发布
 */
const handleRelease = async (record: any) => {
  const { id, status } = record
  const { code } = await apiSaveTranscodeInfo({ id, status: status === '0' ? '1' : '0' })
  if (code === 20000) {
    if (status === '0') {
      message.success('发布成功')
    } else {
      message.success('取消发布成功')
    }
    onSearch()
  }
}

/**
 * @desc 查看详情
 */
const handleCheck = (record: any) => {
  router.push({
    name: 'ConvertCodeDetail',
    query: {
      id: record.id,
      handleType: actionTypeEnum.CHECK,
    },
  })
}

/**
 * @desc 编辑
 */
const handleEdit = (record: any) => {
  router.push({
    name: 'ConvertCodeDetail',
    query: {
      id: record.id,
      handleType: actionTypeEnum.EDIT,
    },
  })
}
</script>

<style lang="less" scoped>
.code-convert-wrapper {
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
