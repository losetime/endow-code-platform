<template>
  <div class="project-code-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.name" placeholder="请输入工程名称" allowClear />
        <a-input v-model:value="searchParams.projectCode" placeholder="请输入工程编码" allowClear />
        <a-button type="primary" @click="onSearch">查询</a-button>
      </a-space>
    </div>
    <a-space class="download-wrap">
      <a-button type="primary" @click="handleDownloadInfoCode">下载工程信息码</a-button>
      <a-button type="primary" @click="handleDownloadSignInCode">下载工程签到码</a-button>
    </a-space>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="ProjectCodeColumns"
        :getTableList="apiGetProjectCodeList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #slotOne="{ record }">
          <span :style="{ color: formatQRcodeColor(record.codeColor) }">{{ formatQRcodeText(record.codeColor) }}</span>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="checkProjectInfoCode(record)">工程信息码</a-button>
            <a-button type="link" size="small" @click="checkProjectSignInCode(record)">工程签到码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
    <project-code-detail ref="detailInstance" />
    <project-code-sign-in ref="signInInstance" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import ProjectCodeDetail from '@/components/home/ProjectCodeDetail.vue'
import ProjectCodeSignIn from '@/components/home/ProjectCodeSignIn.vue'
import { apiGetProjectCodeList } from '@/service/api/home'
import { ProjectCodeColumns } from '@/columns/home'
import { formatQRcodeText, formatQRcodeColor } from '@/enums/homeEnum'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ name: '', projectCode: '' })

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

// 选择表格
const selectedRowKeys = computed(() => (tableInstance.value ? tableInstance.value.selectedRowKeys : []))

/**
 * @desc 下载信息二维码
 */
const handleDownloadInfoCode = () => {
  console.log(selectedRowKeys)
}

/**
 * @desc 下载签到码
 */
const handleDownloadSignInCode = () => {
  console.log(selectedRowKeys)
}

/**
 ********************************* 详情操作 ******************************************
 */

const detailInstance = ref()

/**
 * @desc 查看二维码
 */
const checkProjectInfoCode = (record: any) => {
  detailInstance.value.initModal(record)
}

const signInInstance = ref()

/**
 * @desc 查看工程签到码
 */
const checkProjectSignInCode = (record: any) => {
  signInInstance.value.initModal(record)
}
</script>

<style lang="less" scoped>
.project-code-wrapper {
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
