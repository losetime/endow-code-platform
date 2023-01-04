<template>
  <div class="content-body">
    <div class="left-body">
      <a-button type="primary" style="margin-bottom: 14px" @click="handleAdd">新增</a-button>
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
    <div class="right-body">
      <a-button type="primary" style="margin-bottom: 14px" @click="handleAddProject">新增项目</a-button>
      <ym-table
        rowKey="id"
        :columns="saftyCardConfigColumns"
        :row-selection="false"
        :getTableList="apiGetSaftyCardConfigProject"
        ref="tableInstance"
      />
    </div>
    <create-menu ref="detailInstance" :handleRefresh="handleRefresh" :getSourceData="getSourceData" />
    <create-project
      ref="projectContentInstance"
      :handleRefresh="handleProjectRefresh"
      :getSourceData="getProjectSourceData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import YmTree from '@/components/common/YmTree.vue'
import YmTable from '@/components/common/YmTable.vue'
import { saftyCardConfigColumns } from '@/columns/home'
import CreateMenu from '@/components/saftyCardView/CreateMenu.vue'
import CreateProject from '@/components/saftyCardView/CreateProject.vue'
//import { apiGetSaftyCardConfig } from '@/service/api/saftyCard'
import { apiGetSaftyCardConfigProject } from '@/service/api/saftyCard'

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

const tableInstance = ref()
const configTreeInstance = ref()
const detailInstance = ref()
const projectContentInstance = ref()

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
 * @desc 列表刷新
 */
const handleProjectRefresh = () => {
  tableInstance.value.handleReacquire(1)
}

/**
 * @desc 重新获取当前页列表
 */
const getSourceData = () => {
  configTreeInstance.value.handleReacquire()
}

const getProjectSourceData = () => {
  tableInstance.value.handleReacquire()
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
  console.log('selected', keys)
  //TODO 重新获取项目列表
}

/**
 * @desc 获取所有菜单树
 */
// const getMenuTreeOptions = async () => {
//   const { code, data } = await apiGetSaftyCardConfig()
//   if (code === 20000) {
//     menuTreeOptions.value = data
//   }
// }

/**
 * @desc 新增
 */
const handleAdd = () => {
  detailInstance.value.initModal()
}

/**
 * @desc 新增项目内容
 */
const handleAddProject = () => {
  projectContentInstance.value.initModal()
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
}
</style>
