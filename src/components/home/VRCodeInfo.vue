<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    :confirm-loading="confirmLoading"
    @ok="handleConfirm"
    width="600px"
  >
    <div class="custom-template-detail-wrapper">
      <a-form :label-col="labelCol" labelAlign="left">
        <a-form-item label="设备编码" v-bind="validateInfos.vrSn">
          <a-input v-model:value="detailInfo.vrSn" placeholder="请输入设备编码" />
        </a-form-item>
        <a-form-item label="关联标段" required>
          <a-form-item v-bind="validateInfos.projectCode">
            <a-select
              v-model:value="detailInfo.projectCode"
              style="width: 100%"
              placeholder="请选择工程"
              :options="projectOptions"
              @change="onProjectList"
            />
          </a-form-item>
          <a-form-item v-bind="validateInfos.singleProjectCode">
            <a-select
              v-model:value="detailInfo.singleProjectCode"
              style="width: 100%"
              placeholder="请选择单项工程"
              :options="singleProjectOptions"
              @change="onSingleProjectChange"
            />
          </a-form-item>
          <a-form-item v-bind="validateInfos.bidNo">
            <a-select
              v-model:value="detailInfo.bidNo"
              style="width: 100%"
              placeholder="请选择标段"
              :options="bidNoOptions"
              @change="onBidNoOptions"
            />
          </a-form-item>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import { vrCodeInfoRules } from '@/validator/home'
import { actionTypeEnum } from '@/enums/commonEnum'
import {
  apiGetProjectList,
  apiGetSingleProjectList,
  apiGetBidSectionList,
  apiAddVRInfo,
  apiUpdateVRInfo,
} from '@/service/api/home'

const props = defineProps<{
  handleReacquire: Function
}>()

const labelCol = { span: 4 }

const visible = ref<boolean>(false)

const title = ref<string>('新增设备')

const handleType = ref<number>(actionTypeEnum.ADD)

const detailInfo = reactive<any>({
  id: '',
  vrSn: '',
  bidNo: null,
  bidDesc: '',
  projectCode: null,
  singleProjectCode: null,
})

const projectOptions = ref<any[]>([])

const singleProjectOptions = ref<any[]>([])

const bidNoOptions = ref<any[]>([])

const confirmLoading = ref(false)

const useForm = Form.useForm

const { validate, validateInfos, resetFields } = useForm(detailInfo, vrCodeInfoRules)

/**
 * @desc 初始化对话框
 */
const initModal = async (type: number, initInfo: any) => {
  handleType.value = type
  await getProjectList()
  if (type === actionTypeEnum.EDIT) {
    title.value = '编辑设备'
    const { id, vrSn, bidNo, projectCode, singleProjectCode } = initInfo
    Object.assign(detailInfo, { id, vrSn, bidNo, projectCode, singleProjectCode })
    await getSingleProjectList(projectCode)
    await getBidSectionList(singleProjectCode)
  }
  visible.value = true
}

/**
 * @desc 获取工程
 */
const getProjectList = async () => {
  const { code, data } = await apiGetProjectList()
  if (code === 20000) {
    projectOptions.value = data.map((item: any) => ({ label: item.name, value: item.code }))
  }
}

const onProjectList = (val: string) => {
  bidNoOptions.value = []
  detailInfo.singleProjectCode = null
  detailInfo.bidNo = null
  getSingleProjectList(val)
}

/**
 * @desc 获取单项工程
 */
const getSingleProjectList = async (val: string) => {
  const { code, data } = await apiGetSingleProjectList({ projectCode: val })
  if (code === 20000) {
    singleProjectOptions.value = data.map((item: any) => ({ label: item.name, value: item.code }))
  }
}

const onSingleProjectChange = (val: string) => {
  detailInfo.bidNo = null
  getBidSectionList(val)
}

/**
 * @desc 获取标段
 */
const getBidSectionList = async (val: string) => {
  const { code, data } = await apiGetBidSectionList({ singleProjectCode: val })
  if (code === 20000) {
    bidNoOptions.value = data.map((item: any) => ({ label: item.bidName, value: item.bidNo }))
  }
}

/**
 * @desc 监听标段
 */
const onBidNoOptions = (_val: string, options: any) => {
  detailInfo.bidDesc = options.label
}

/**
 * @desc 确认操作
 */
const handleConfirm = () => {
  validate()
    .then(async () => {
      if (handleType.value === actionTypeEnum.ADD) {
        const { code } = await apiAddVRInfo(detailInfo)
        if (code === 20000) {
          props.handleReacquire(1)
          message.success('新增成功')
        }
      } else {
        const { code } = await apiUpdateVRInfo(detailInfo)
        if (code === 20000) {
          props.handleReacquire()
          message.success('编辑成功')
        }
      }
      handleCancel()
    })
    .catch((e: any) => {
      console.log(e)
    })
}

/**
 * @desc 取消操作
 */
const handleCancel = () => {
  visible.value = false
  singleProjectOptions.value = []
  bidNoOptions.value = []
  resetFields()
}

defineExpose({
  initModal,
})
</script>

<style lang="less" scoped>
.custom-template-detail-wrapper {
  h4 {
    margin-bottom: 14px;
  }
}
</style>
