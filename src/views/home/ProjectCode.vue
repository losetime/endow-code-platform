<template>
  <div class="project-code-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-input v-model:value="searchParams.name" placeholder="请输入工程名称" allowClear />
        <a-input v-model:value="searchParams.singleProjectCode" placeholder="请输入工程编码" allowClear />
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
import { createQRCode, downloadQRCode } from '@/utils/base'
import { useRouter } from 'vue-router'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ name: '', singleProjectCode: '' })

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

// 选择表格
const selectedRows = computed(() => (tableInstance.value ? tableInstance.value.selectedRows : []))

/**
 * @desc 下载信息二维码
 */
const handleDownloadInfoCode = () => {
  const base64Arr: any[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push({
      name: `${item.name}(信息码)`,
      file: createQRCode(item.infoCode, item.codeColor),
    })
  })
  downloadQRCode(base64Arr)
}

/**
 * @desc 下载签到码
 */
const handleDownloadSignInCode = () => {
  const base64Arr: any[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push({
      name: `${item.name}(签到码)`,
      file: createQRCode(item.signCode, '#ffffff'),
    })
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
const checkProjectInfoCode = (record: any) => {
  detailInstance.value.initModal(record)
}

const signInInstance = ref()
const router = useRouter()

/**
 * @desc 查看工程签到码
 */
const checkProjectSignInCode = (record: any) => {
  router.push({
    name: 'SignInCode',
    query: {
      code: record.singleProjectCode,
    },
  })
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
