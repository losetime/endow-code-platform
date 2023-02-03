<template>
  <div class="content-body">
    <div class="left-body">
      <a-button type="primary" :disabled="status !== '未发布'" style="margin-bottom: 14px" @click="handleAdd"
        >新增</a-button
      >
      <template v-if="!isTableShow">
        <a-empty />
      </template>
      <ym-tree
        ref="configTreeInstance"
        :tree-data="menuTreeOptions"
        :field-names="fieldNames"
        :show-search="false"
        :onSelect="onSelect"
        :showLine="false"
      />
      <create-menu ref="detailInstance" :getSourceData="getMenuSourceData" />
    </div>
    <div class="right-body">
      <a-button type="primary" :disabled="status !== '未发布'" style="margin-bottom: 14px" @click="handleAddProject"
        >新增项目</a-button
      >
      <template v-if="isTableShow">
        <ym-table
          rowKey="id"
          :columns="saftyCardConfigColumns"
          :row-selection="false"
          :getTableList="apiGetSaftyCardConfigProject"
          :params="params"
          ref="tableInstance"
        >
          <template #action="{ record }">
            <a-space>
              <a-button
                class="btn-item"
                type="link"
                :disabled="status !== '未发布'"
                size="small"
                @click="handleEditProject(record)"
                >编辑</a-button
              >
              <a-popconfirm
                placement="topRight"
                title="确认删除该安全监督卡对应的项目吗?"
                ok-text="确认"
                cancel-text="取消"
                :disabled="status !== '未发布'"
                @confirm="handleDeletProject(record.id)"
              >
                <a-button type="link" size="small" :disabled="status !== '未发布'">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </ym-table>
      </template>
      <template v-if="!isTableShow">
        <a-empty />
      </template>
    </div>
    <create-project
      ref="projectContentInstance"
      :handleRefresh="handleProjectRefresh"
      :getSourceData="getProjectSourceData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import YmTree from '@/components/common/YmTree.vue'
import YmTable from '@/components/common/YmTable.vue'
import { saftyCardConfigColumns } from '@/columns/home'
import CreateMenu from '@/components/saftyCardView/CreateMenu.vue'
import CreateProject from '@/components/saftyCardView/CreateProject.vue'
import { apiGetSaftyCardConfig } from '@/service/api/saftyCard'
import { apiGetSaftyCardConfigProject, apiDeleteSaftyCardProject } from '@/service/api/saftyCard'
import { useRoute } from 'vue-router'

const route = useRoute()
const cardId = route.query?.cardId as string
const status = route.query?.status as string

const isTableShow = ref()

const menuTreeOptions = ref<any[]>([])

const params = ref<any>({
  categoryId: '',
})

onMounted(() => {
  getMenuTreeOptions(cardId)
})

const tableInstance = ref()
const configTreeInstance = ref()
const detailInstance = ref()
const projectContentInstance = ref()

const fieldNames = ref({
  title: 'name',
  key: 'id',
})

/**
 * @desc 列表刷新
 */
const handleProjectRefresh = () => {
  tableInstance.value.handleReacquire(1)
}

/**
 * @desc 重新获取当前页列表
 */
const getMenuSourceData = () => {
  getMenuTreeOptions(cardId)
}

const getProjectSourceData = () => {
  tableInstance.value.handleReacquire()
}

const onSelect = (keys: number[] | string[]) => {
  console.log('key', keys)
  if (keys.length > 0) {
    params.value.categoryId = keys[0]
    tableInstance.value.handleReacquire()
  }
}

/**
 * @desc 获取所有菜单树
 */
const getMenuTreeOptions = async (scope: string) => {
  const { code, data } = await apiGetSaftyCardConfig(scope)
  if (code === 20000) {
    menuTreeOptions.value = data || []
    if (menuTreeOptions?.value?.length > 0) {
      params.value.categoryId = menuTreeOptions.value[0].id
      isTableShow.value = true
    }
  }
}

/**
 * @desc 新增
 */
const handleAdd = () => {
  detailInstance.value.initModal(cardId)
}

/**
 * 编辑
 */
const handleEditProject = (scope: any) => {
  projectContentInstance.value.initModal('EDIT', scope)
}

/**
 * @desc 新增项目内容
 */
const handleAddProject = () => {
  projectContentInstance.value.initModal('ADD', params.value.categoryId)
}

const handleDeletProject = async (scope: any) => {
  const { code } = await apiDeleteSaftyCardProject(scope)
  if (code === 20000) {
    tableInstance.value.handleReacquire(1)
  }
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
