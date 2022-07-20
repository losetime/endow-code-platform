<template>
  <div class="sign-in-code-wrapper">
    <a-space class="download-wrap">
      <a-button type="primary" @click="handleDownloadSignInCode">下载签到码</a-button>
    </a-space>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="SignInCodeColumns"
        :getTableList="apiGetBidSectionList"
        :params="searchParams"
        :pagination="false"
        ref="tableInstance"
      >
        <template #slotOne="{ record }">
          <span :style="{ color: formatQRcodeColor(record.codeColor) }">{{ formatQRcodeText(record.codeColor) }}</span>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="checkProjectSignInCode(record)">标段签到码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
    <project-code-sign-in ref="signInInstance" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import ProjectCodeSignIn from '@/components/home/ProjectCodeSignIn.vue'
import { apiGetBidSectionList } from '@/service/api/home'
import { SignInCodeColumns } from '@/columns/home'
import { formatQRcodeText, formatQRcodeColor } from '@/enums/homeEnum'
import { createQRCode, downloadQRCode } from '@/utils/base'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  const code = route.query.code as string
  if (code) {
    searchParams.singleProjectCode = code
    onSearch()
  }
})

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ singleProjectCode: '' })

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
}

// 选择表格
const selectedRows = computed(() => (tableInstance.value ? tableInstance.value.selectedRows : []))

/**
 * @desc 下载签到码
 */
const handleDownloadSignInCode = () => {
  const base64Arr: any[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push({
      name: `${item.singleProjectName}-${item.bidName}(签到码)`,
      file: createQRCode(item.bidSignCode, '#ffffff'),
    })
  })
  downloadQRCode(base64Arr)
}

/**
 ********************************* 详情操作 ******************************************
 */

const signInInstance = ref()

/**
 * @desc 查看工程签到码
 */
const checkProjectSignInCode = (record: any) => {
  signInInstance.value.initModal(record)
}
</script>

<style lang="less" scoped>
.sign-in-code-wrapper {
  height: 100%;
  .download-wrap {
    width: 100%;
    background-color: #ffffff;
    padding: 14px 0 0 14px;
  }
  .table-wrap {
    margin-top: 0 !important;
    height: calc(100% - 50px) !important;
    background-color: #ffffff;
    padding: 14px;
  }
}
</style>
