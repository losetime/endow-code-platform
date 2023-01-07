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
        <a-input v-model:value="detailInfo.content" placeholder="请输入内容" :allowClear="true" />
      </a-form-item>
      <a-form-item label="排序" v-bind="validateInfos.orderNum" style="margin-right: 5px">
        <a-input
          v-model:value="detailInfo.orderNum"
          placeholder="请输入排序"
          :allowClear="true"
          type="number"
          @change="onChange"
          :min="0"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { Form, message } from 'ant-design-vue'
import { apiCreateSaftyCardProject, apiEditSaftyCardProject } from '@/service/api/saftyCard'
import { saftyCardProjectAddRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 4 }

const isEdit = ref()

const detailInfo = reactive<any>({
  content: '',
  orderNum: '',
  safetyCardCategoryId: '',
  id: '',
})

const onChange = () => {
  detailInfo.orderNum = detailInfo.orderNum.replace(/[^\d]/g, '')
}

/**
 * @desc 初始化对话框
 */
const initModal = (flag: any, record: any) => {
  visible.value = true
  if (flag == 'EDIT') {
    isEdit.value = true
    detailInfo.content = record.content
    detailInfo.orderNum = record.orderNum
    detailInfo.safetyCardCategoryId = record.safetyCardCategoryId
    detailInfo.id = record.id
  } else {
    isEdit.value = false
    console.log('record', record)
    detailInfo.safetyCardCategoryId = record
  }
}

const title = ref<string>('项目内容')
const visible = ref<boolean>(false)

const useForm = Form.useForm

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
    if (isEdit.value) {
      const { code } = await apiEditSaftyCardProject({ ...detailInfo })
      if (code === 20000) {
        message.success('操作成功')
        props.handleRefresh()
      }
    } else {
      const { code } = await apiCreateSaftyCardProject({ ...detailInfo })
      if (code === 20000) {
        message.success('操作成功')
        props.handleRefresh()
      }
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
