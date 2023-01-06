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
      <a-form-item label="目录名称" v-bind="validateInfos.name">
        <a-input v-model:value="detailInfo.name" placeholder="请输入目录名称" />
      </a-form-item>
      <a-form-item label="上级目录" v-bind="validateInfos.categoryParent">
        <a-tree-select
          v-model:value="detailInfo.categoryParent"
          show-search
          :field-names="fieldNames"
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
import { apiGetSaftyCardConfig, apiSubmitSaftyCardConfig } from '@/service/api/saftyCard'
import { thinkCodeLibraryCatalogAddRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const fieldNames = ref({
  title: 'label',
  value: 'id',
})

const labelCol = { span: 5 }
const menuTreeOptions = ref<any[]>([])

/**
 * @desc 初始化对话框
 */
const initModal = async () => {
  visible.value = true
  await getMenuTreeOptions
}

/**
 * @desc 获取所有菜单树
 */
const getMenuTreeOptions = async () => {
  const { code, data } = await apiGetSaftyCardConfig()
  if (code === 20000) {
    menuTreeOptions.value = [
      {
        label: '主类目',
        id: 0,
        children: data,
      },
    ]
    console.log(menuTreeOptions.value)
  }
}

const title = ref<string>('新增目录')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const detailInfo = reactive<any>({
  name: '',
  categoryParent: '',
  sort: '',
})

const { resetFields, validateInfos, validate } = useForm(detailInfo, thinkCodeLibraryCatalogAddRules)

/**
 * @desc 关闭
 */
const handleCancel = () => {
  resetFields()
  visible.value = false
}
/**
 * @desc 确认
 */
const handleConfirm = () => {
  const validateField = Object.keys(toRaw(detailInfo)).filter((val: string) => val !== '')
  validate(validateField).then(async () => {
    const { code } = await apiSubmitSaftyCardConfig({ ...detailInfo })
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
