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
          <a-button type="primary" @click="handleNewContent">新增</a-button>
          <a-button type="primary" ghost style="margin-left: 12px">批量下载</a-button>
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
        :getTableList="apiGetCodeList"
        :params="searchParams"
        style="margin-top: 14px"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
            <span class="list-span">|</span>
            <a-button type="link" size="small" @click="handleCheck(record)">下载二维码</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import YmTree from '@/components/common/YmTree.vue'
import YmTable from '@/components/common/YmTable.vue'
import { thinkCodeLibraryColumns } from '@/columns/home'
import { apiGetCodeList } from '@/service/api/thinkCodeLibrary'
import CreateCatalog from '@/components/thinkCodeLibrary/CreateCatalog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchParams = reactive({ title: '' })
// 表格实例
const tableInstance = ref()

const detailInstance = ref()

const configTreeInstance = ref()

const fieldNames = ref({
  title: 'label',
  key: 'id',
})

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

const menuTreeOptions = ref<any[]>([
  {
    id: 100,
    label: '数据部',
    children: [
      { id: 108, label: '测试', children: [{ id: 112, label: 'b组' }] },
      { id: 103, label: '研发部', children: [{ id: 104, label: 'A组', children: [] }] },
    ],
  },
])

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
  console.log('selected', keys)
  //TODO 重新获取项目列表
}
const handleAdd = () => {
  detailInstance.value.initModal()
}

const handleNewContent = () => {
  router.push({
    name: 'CreatThinkCodeLibrary',
  })
}

const handleEdit = (scope: any) => {
  console.log(scope)
}

/**
 * 下载二维码
 * @param scope
 */
const handleCheck = (scope: any) => {
  console.log(scope)
}

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleReacquire()
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
