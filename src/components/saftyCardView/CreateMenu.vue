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
      <a-form-item label="分类名称" v-bind="validateInfos.categoryName">
        <a-input v-model:value="detailInfo.categoryName" placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item label="上级分类" v-bind="validateInfos.parentId">
        <a-tree-select
          v-model:value="detailInfo.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级分类"
          allow-clear
          :tree-data="menuTreeOptions"
        />
      </a-form-item>
      <a-form-item label="排序" v-bind="validateInfos.orderNum" style="margin-right: 5px">
        <a-input
          v-model:value="detailInfo.orderNum"
          placeholder="请输入分类排序"
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
import { apiGetSaftyCardConfig, apiConfirmCreateSaftyCardConfig } from '@/service/api/saftyCard'
import { saftyCardConfigAddRules } from '@/validator/setting'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const detailInfo = reactive<any>({
  categoryName: '',
  orderNum: '',
  safetyCardId: '',
  parentId: null,
})

const labelCol = { span: 5 }
const menuTreeOptions = ref<any[]>([
  {
    title: '无上级分类',
    value: '0',
    key: '0',
  },
])

/**
 * @desc 初始化对话框
 */
const initModal = async (cardId: string) => {
  visible.value = true
  detailInfo.safetyCardId = cardId
  await getMenuTreeOptions(cardId)
}

/**
 * @desc 获取所有菜单树
 */
const getMenuTreeOptions = async (scope: any) => {
  const { code, data } = await apiGetSaftyCardConfig(scope)
  if (code === 20000) {
    var res = convertToTreedata(data)
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
    if ('children' in data[i]) {
      tempObj.children = convertToTreedata(data[i].children)
    }
    returnData.push(tempObj)
  }
  return returnData
}

const title = ref<string>('新增目录')
const visible = ref<boolean>(false)

const useForm = Form.useForm

const { resetFields, validateInfos, validate } = useForm(detailInfo, saftyCardConfigAddRules)

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
    const { code } = await apiConfirmCreateSaftyCardConfig({ ...detailInfo })
    if (code === 20000) {
      message.success('操作成功')
      props.handleRefresh()
    }
    handleCancel()
  })
}

const onChange = () => {
  detailInfo.orderNum = detailInfo.orderNum.replace(/[^\d]/g, '')
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
