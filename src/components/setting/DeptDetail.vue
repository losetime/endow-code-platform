<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    @ok="handleConfirm"
  >
    <a-form :label-col="labelCol" labelAlign="right">
      <a-form-item label="部门/公司">
        <a-radio-group
          :disabled="handleType === actionTypeEnum.EDIT"
          v-model:value="detailInfo.orgType"
          @change="radioGroupChange"
        >
          <a-radio value="COMPANY">公司</a-radio>
          <a-radio value="DEPARTMENT">部门</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="detailInfo.orgType == 'COMPANY' ? '公司名称' : '部门名称'" v-bind="validateInfos.deptName">
        <a-input
          v-model:value="detailInfo.deptName"
          :placeholder="detailInfo.orgType == 'COMPANY' ? '请输入公司名称' : '请输入部门名称'"
        />
      </a-form-item>
      <a-form-item
        :label="detailInfo.orgType == 'COMPANY' ? '上级公司' : '上级公司/部门'"
        v-bind="validateInfos.parentId"
      >
        <a-cascader
          v-model:value="detailInfo.parentId"
          :field-names="{ value: 'id' }"
          :options="deptOptions"
          :placeholder="detailInfo.orgType == 'COMPANY' ? '请选择上级公司' : '请选择上级部门'"
          change-on-select
        />
      </a-form-item>
      <a-form-item :label="detailInfo.orgType == 'COMPANY' ? '公司类型' : '部门类型'" v-bind="validateInfos.orgTypeId">
        <a-select v-model:value="detailInfo.orgTypeId" placeholder="请选择" :options="typeOptions" />
      </a-form-item>
      <a-form-item label="是否建管单位" v-if="detailInfo.orgType == 'COMPANY'">
        <a-radio-group v-model:value="detailInfo.superDept">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="关联洛斯达单位"
        v-if="detailInfo.orgType == 'COMPANY' && detailInfo.superDept == '1'"
        v-bind="validateInfos.relateLsdDeptId"
      >
        <a-select
          v-model:value="detailInfo.relateLsdDeptId"
          show-search
          placeholder="请选择"
          :options="lsdOptions"
          :filterOption="filterOption"
          :getPopupContainer="getPopupContainer"
        />
      </a-form-item>
      <a-form-item label="关联风控单位" v-if="detailInfo.orgType == 'COMPANY' && detailInfo.superDept == '1'">
        <a-select
          v-model:value="detailInfo.relateFkJiUnitId"
          show-search
          placeholder="请选择"
          :options="relateFkJiUnitOptions"
          :filterOption="filterOption"
          :getPopupContainer="getPopupContainer"
        />
      </a-form-item>
      <a-form-item label="排序" v-bind="validateInfos.orderNum">
        <a-input-number
          style="width: 100%"
          v-model:value="detailInfo.orderNum"
          :min="0"
          :formatter="limitNumber"
          :parser="limitNumber"
        />
      </a-form-item>
      <a-form-item label="状态" v-bind="validateInfos.status">
        <a-radio-group v-model:value="detailInfo.status">
          <a-radio value="0">启用</a-radio>
          <a-radio value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import { deptDetailRules } from '@/validator/setting'
import { actionTypeEnum } from '@/enums/commonEnum'
import {
  apiGetDeptDetail,
  apiGetDepartmentTypeList,
  apiGetDepartmentListNew,
  apiAddDept,
  apiUpdateDept,
  apiGetLsdDeptData,
  apiGetRelateFkJiUnitData,
} from '@/service/api/setting'
import { findTreePath } from '@/utils/base'
import useSelect from '@/hooks/useSelect'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 6 }

const visible = ref<boolean>(false)

const title = ref<string>('添加组织')

const handleType = ref(actionTypeEnum.ADD)

const deptId = ref()

const limitNumber = (input: any) => {
  if (typeof input === 'string') {
    return !isNaN(Number(input)) ? input.replace(/\./g, '') : 0
  } else if (typeof input === 'number') {
    return !isNaN(input) ? String(input).replace(/\./g, '') : 0
  } else {
    return 0
  }
}

const { filterOption, getPopupContainer } = useSelect()

const detailInfo = reactive({
  orgType: 'COMPANY',
  parentId: [],
  orgTypeId: null,
  deptName: '',
  relateLsdDeptId: null,
  orderNum: 0,
  status: '0',
  superDept: '1',
  relateFkJiUnitId: null,
})

const deptOptions = ref<any>()
const typeOptions = ref()
const lsdOptions = ref()
const relateFkJiUnitOptions = ref()

const useForm = Form.useForm

const { validate, validateInfos, resetFields } = useForm(detailInfo, deptDetailRules)

/**
 * @desc 初始化对话框
 */
const initModal = async (type: number, initInfo: any) => {
  visible.value = true
  handleType.value = type
  await getDepartmentList()
  if (type === actionTypeEnum.EDIT) {
    title.value = '编辑用户'
    deptId.value = initInfo.deptId
    await getDeptDetail(initInfo.deptId)
  }
  await getDepartmentTypeList()
  await getLsdDeptData()
  await getRelateFkJiUnitData()
}

const radioGroupChange = async () => {
  let emptyObj = {
    parentId: [],
    orgTypeId: null,
    deptName: '',
    relateLsdDeptId: null,
    orderNum: 0,
    status: '0',
    superDept: '1',
  }
  Object.assign(detailInfo, emptyObj)
  await getDepartmentList()
  await getDepartmentTypeList()
}

/**
 * @desc 获取部门详情
 */
const getDeptDetail = async (deptId: number) => {
  const { code, data } = await apiGetDeptDetail({ deptId })
  if (code === 20000) {
    detailInfo.orgType = data.orgType
    if (data.orgType === 'DEPARTMENT') {
      await getDepartmentList()
    }
    const { deptName, orderNum, orgType, status, relateLsdDeptId, orgTypeId, relateFkJiUnitId } = data
    const parentIdArr = findTreePath(deptOptions.value, (val: any) => val.id === data.parentId, [])
    Object.assign(detailInfo, {
      parentId: parentIdArr,
      deptName,
      orderNum: parseInt(orderNum),
      orgType,
      orgTypeId,
      status,
      relateLsdDeptId,
      relateFkJiUnitId,
    })
  }
}

/**
 * @desc 获取部门
 */
const getDepartmentList = async () => {
  let params = ref<any>({ orgType: '' })
  if (detailInfo.orgType == 'COMPANY') {
    params.value.orgType = 'COMPANY'
  } else {
    params.value.orgType = 'DEPARTMENT'
  }
  const { code, data } = await apiGetDepartmentListNew(params.value)
  if (code === 20000) {
    deptOptions.value = data
  }
}

/**
 * @desc 获取洛斯达关联单位
 */
const getLsdDeptData = async () => {
  const { code, data } = await apiGetLsdDeptData()
  if (code === 20000) {
    lsdOptions.value = data.map((item: any) => ({ label: item.deptName, value: item.relateId }))
  }
}

//apiGetRelateFkJiUnitData
/**
 * @desc 获取风控关联单位
 */
const getRelateFkJiUnitData = async () => {
  const { code, data } = await apiGetRelateFkJiUnitData()
  if (code === 20000) {
    relateFkJiUnitOptions.value = data.map((item: any) => ({ label: item.name, value: item.code }))
  }
}

/**
 * @desc 获取公司/部门类型
 */
const getDepartmentTypeList = async () => {
  let params = ref<any>({ orgType: '' })
  if (detailInfo.orgType == 'COMPANY') {
    params.value.orgType = 'COMPANY'
  } else {
    params.value.orgType = 'DEPARTMENT'
  }
  const { code, data } = await apiGetDepartmentTypeList(params.value)
  if (code === 20000) {
    typeOptions.value = data.map((item: any) => ({ label: item.name, value: item.id }))
  }
}
/**
 * @desc 确认
 */
const handleConfirm = () => {
  let validateField = ['parentId', 'deptName', 'orderNum']
  validate(validateField).then(async () => {
    const len = detailInfo.parentId.length
    const params = { ...detailInfo, parentId: detailInfo.parentId[len - 1] }
    if (handleType.value === actionTypeEnum.ADD) {
      const { code } = await apiAddDept(params)
      if (code === 20000) {
        message.success('添加部门成功')
        props.handleRefresh()
      }
    } else {
      const { code } = await apiUpdateDept({ ...params, deptId: deptId.value })
      if (code === 20000) {
        message.success('更新部门成功')
        props.getSourceData()
      }
    }
    handleCancel()
  })
}

/**
 * @desc 关闭
 */
const handleCancel = () => {
  resetFields()
  visible.value = false
}

defineExpose({
  initModal,
})
</script>

<style lang="less" scoped></style>
