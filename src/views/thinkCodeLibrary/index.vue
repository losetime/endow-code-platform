<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="content-body">
    <div class="left-body">
      <div class="btn-line">
        <a-button type="primary" style="margin-bottom: 14px" @click="handleAdd">新增目录</a-button>
      </div>
      <ym-tree
        ref="configTreeInstance"
        :tree-data="menuTreeOptions"
        :field-names="fieldNames"
        :show-search="false"
        :defaultChecked="detailInfo.menuIds"
        @select="onSelect"
        :showLine="false"
      />
    </div>
    <create-catalog ref="detailInstance" :handleRefresh="handleRefresh" :getSourceData="getSourceData" />
    <div class="right-body">
      <div class="search-item">
        <a-space>
          <a-button type="primary" @click="handleNewContent(searchParams.categoryId)">新增</a-button>
          <a-button type="primary" ghost style="margin-left: 12px" @click="handleBatchDownLoad()">批量下载</a-button>
        </a-space>
        <a-space>
          <span>标题：</span>
          <a-input v-model:value="searchParams.title" placeholder="请输入" allowClear />
          <a-button type="primary" @click="onSearch">查询</a-button>
        </a-space>
      </div>

      <ym-table
        rowKey="id"
        :columns="thinkCodeLibraryColumns"
        :getTableList="apiGetThinkCodeLibrary"
        :params="searchParams"
        style="margin-top: 14px"
        :isImmediately="loadApi"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record.id)"> 编辑 </a-button>
            <span class="list-span">|</span>
            <a-button type="link" size="small" @click="handleDownLoadCode(record)">下载二维码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import YmTree from '@/components/common/YmTree.vue'
import YmTable from '@/components/common/YmTable.vue'
import { thinkCodeLibraryColumns } from '@/columns/home'
import { apiGetThinkCodeLibrary } from '@/service/api/thinkCodeLibrary'
import { apiGetCategoryTree } from '@/service/api/common'
import CreateCatalog from '@/components/thinkCodeLibrary/CreateCatalog.vue'
import { useRouter } from 'vue-router'

import { createQRCode, downloadQRCode } from '@/utils/base'
import { saveAs } from 'file-saver'
import { message } from 'ant-design-vue'

const router = useRouter()

const loadApi = ref(false)

const imgUrl = ref('')

const searchParams = ref<any>({ title: '', categoryId: '' })
// 表格实例
const tableInstance = ref()

const detailInstance = ref()

const configTreeInstance = ref()

// 选择表格
const selectedRows = computed(() => (tableInstance.value ? tableInstance.value.selectedRows : []))

const fieldNames = ref({
  title: 'name',
  key: 'id',
})

const treeListParam = reactive({ type: 'SMART_CODE' })

/**
 * @desc 列表刷新
 */
const handleRefresh = () => {
  configTreeInstance.value.handleReacquire(1)
}

/**
 * @desc 重新获取当前页列表
 */
const getSourceData = () => {
  configTreeInstance.value.handleReacquire()
}

// const getCodeTableList = () => {
//   tableInstance.value.handleReacquire()
// }

const menuTreeOptions = ref<any[]>([])

onMounted(() => {
  getMenuTreeOptions()
})

const getMenuTreeOptions = async () => {
  const { code, data } = await apiGetCategoryTree(treeListParam)
  if (code === 20000) {
    menuTreeOptions.value = data || []
    if (menuTreeOptions?.value?.length > 0) {
      searchParams.value.categoryId = menuTreeOptions.value[0].id
      loadApi.value = true
      tableInstance.value.handleReacquire()
    }
  }
}

const detailInfo = reactive<any>({
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  menuIds: [],
  menuCheckStrictly: true,
  remark: '',
})

const onSelect = (keys: number[] | string[]) => {
  console.log('key', keys)
  if (keys.length > 0) {
    searchParams.value.categoryId = keys[0]
    tableInstance.value.handleReacquire()
  }
}
const handleAdd = () => {
  detailInstance.value.initModal()
}

const handleNewContent = (scope: any) => {
  router.push({
    name: 'CreatThinkCodeLibrary',
    query: { id: scope },
  })
}

const handleEdit = (scope: any) => {
  router.push({
    name: 'CreatThinkCodeLibrary',
    query: { id: scope.id },
  })
}

/**
 * 下载二维码
 * @param scope
 */
const handleDownLoadCode = (scope: any) => {
  imgUrl.value = createQRCode(scope.qrCode)
  console.log(scope.qrCode)
  saveAs(imgUrl.value, `${scope.id}.png`)
}

/**
 * @desc 下载二维码
 */
const handleBatchDownLoad = () => {
  if (selectedRows.value.length == 0) {
    message.info('请选择条目后重试！')
    return
  }
  const base64Arr: any[] = []
  selectedRows.value.forEach((item: any) => {
    base64Arr.push({
      name: item.id,
      file: createQRCode(item.qrCode),
    })
  })
  downloadQRCode(base64Arr)
}

/**
 * @desc 列表搜索
 */
const onSearch = (page?: number) => {
  tableInstance.value.handleReacquire(page)
}
</script>

<style lang="less" scoped>
.content-body {
  width: 100%;
  height: 100%;
  display: flex;

  .left-body {
    width: 30%;
    background-color: white;
    padding: 14px;
    margin-right: 14px;
  }

  .right-body {
    width: 100%;
    padding: 14px;
    background-color: white;
  }

  .btn-line {
    border-bottom: 1px solid #e8e8e8;
    margin: 11px 0px;
  }

  .list-span {
    margin: 0px 5px;
  }

  .search-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
