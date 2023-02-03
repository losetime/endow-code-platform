<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    @ok="handleConfirm"
    width="450px"
  >
    <a-form :label-col="labelCol" labelAlign="left">
      <a-form-item label="目录名称" v-bind="validateInfos.categoryName">
        <a-input v-model:value="detailInfo.categoryName" placeholder="请输入目录名称" />
      </a-form-item>
      <a-form-item label="上级目录" v-bind="validateInfos.parentId">
        <a-tree-select
          v-model:value="detailInfo.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级菜单"
          allow-clear
          :tree-data="menuTreeOptions"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { Form, message } from 'ant-design-vue'
import { thinkCodeLibraryCatalogAddRules } from '@/validator/setting'
import { apiGetCategoryTree, apiCreateCategoryTree } from '@/service/api/common'

const treeListParam = reactive({ type: 'SMART_CODE' })

const props = defineProps<{
  handleRefresh: Function
}>()

// const fieldNames = ref({
//   label: 'name',
//   value: 'id',
// })

const labelCol = { span: 5 }
const menuTreeOptions = ref<any[]>([
  {
    title: '无上级分类',
    value: '-1',
    key: '0',
  },
])

/**
 * @desc 初始化对话框
 */
const initModal = () => {
  visible.value = true
  getMenuTreeOptions()
}

/**
 * @desc 获取所有菜单树
 */
const getMenuTreeOptions = async () => {
  const { code, data } = await apiGetCategoryTree(treeListParam)
  if (code === 20000) {
    var res = await convertToTreedata(data)
    console.log(res)
    menuTreeOptions.value.push(...res)
  }
}

const convertToTreedata = (data: any[]) => {
  var returnData = []
  //遍历数据
  for (var i = 0; i < data?.length; i++) {
    var tempObj = {
      title: data[i].name,
      value: data[i].id,
      key: data[i].id,
      children: data[i].children,
    }
    if (data[i]?.children?.length) {
      tempObj.children = convertToTreedata(data[i].children)
    }
    returnData.push(tempObj)
  }
  return returnData
}

const title = ref<string>('新增目录')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const detailInfo = reactive<any>({
  categoryName: '',
  parentId: '',
  type: '0',
})

const { resetFields, validateInfos, validate } = useForm(detailInfo, thinkCodeLibraryCatalogAddRules)

/**
 * @desc 关闭
 */
const handleCancel = () => {
  resetFields()
  visible.value = false
  menuTreeOptions.value.length = 1
}
/**
 * @desc 确认
 */
const handleConfirm = () => {
  const validateField = Object.keys(toRaw(detailInfo)).filter((val: string) => val !== '')
  validate(validateField).then(async () => {
    const { code } = await apiCreateCategoryTree({ ...detailInfo })
    if (code === 20000) {
      message.success('添加目录成功')
      props.handleRefresh()
    }
    handleCancel()
  })
}
defineExpose({
  initModal,
})
</script>

<style lang="less" scoped>
.ant-form {
  .ant-form-item {
    .ant-input-number {
      width: 100%;
    }

    .ym-tree-wrapper {
      height: 250px;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      overflow-y: auto;
    }
  }
}
</style>
