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
      <a-form-item label="内容" v-bind="validateInfos.content" style="margin-right: 5px">
        <a-input v-model:value="detailInfo.content" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item label="排序" v-bind="validateInfos.sort" style="margin-right: 5px">
        <a-input v-model:value="detailInfo.sort" placeholder="请输入排序" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { Form, message } from 'ant-design-vue'
import { apiSubmitSaftyCardConfig } from '@/service/api/saftyCard'
import { saftyCardProjectAddRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 4 }

/**
 * @desc 初始化对话框
 */
const initModal = async () => {
  visible.value = true
}

const title = ref<string>('项目内容')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const detailInfo = reactive<any>({
  content: '',
  sort: '',
})

const { resetFields, validateInfos, validate } = useForm(detailInfo, saftyCardProjectAddRules)

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
      message.success('添加项目内容成功')
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
