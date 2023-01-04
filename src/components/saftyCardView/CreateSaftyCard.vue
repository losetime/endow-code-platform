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
      <a-form-item label="监督卡名称" v-bind="validateInfos.cardName">
        <a-input v-model:value="detailInfo.cardName" placeholder="请输入监督卡名称" />
      </a-form-item>
      <a-form-item label="代码" v-bind="validateInfos.code">
        <a-input v-model:value="detailInfo.code" placeholder="请输入代码" />
      </a-form-item>
      <a-form-item label="安全监督卡类型" v-bind="validateInfos.cardType">
        <a-select v-model:value="detailInfo.cardType" placeholder="请选择类型">
          <a-select-option v-for="item in cardTypes" :value="item.value" :key="item.value">{{
            item?.label
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { Form, message } from 'ant-design-vue'
import { apiSubmitSaftyCardConfig, apiGetCardTypes } from '@/service/api/saftyCard'
import { saftyCardAddRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 8 }

/**
 * @desc 初始化对话框
 */
const initModal = async () => {
  visible.value = true
  await getCarTypes()
}

const title = ref<string>('项目内容')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const detailInfo = reactive<any>({
  cardName: '',
  code: '',
  cardType: '',
})

const cardTypes = ref()

const getCarTypes = async () => {
  const { code, data } = await apiGetCardTypes()
  if (code === 20000) {
    cardTypes.value = data.tyles
  }
}

const { resetFields, validateInfos, validate } = useForm(detailInfo, saftyCardAddRules)

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
