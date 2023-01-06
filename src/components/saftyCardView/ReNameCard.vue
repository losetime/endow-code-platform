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
      <a-form-item label="监督卡名称" v-bind="validateInfos.name">
        <a-input v-model:value="detailInfo.name" placeholder="请输入监督卡名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { Form, message } from 'ant-design-vue'
import { apiRenameSaftyCardName } from '@/service/api/saftyCard'
import { saftyCardReNameRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 5 }

const title = ref<string>('重命名')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const detailInfo = reactive<any>({
  name: '',
  id: '',
})

/**
 * @desc 初始化对话框
 */
const initModal = async (id: any, name: any) => {
  visible.value = true
  detailInfo.name = name
  detailInfo.id = id
  console.log('name', detailInfo.name, 'id', detailInfo.id)
}

const { resetFields, validateInfos, validate } = useForm(detailInfo, saftyCardReNameRules)

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
    const { code } = await apiRenameSaftyCardName({ ...detailInfo })
    if (code === 20000) {
      message.success('操作成功')
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
