<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    @ok="handleConfirm"
    width="800px"
  >
    <a-form :label-col="labelCol" labelAlign="left">
      <a-form-item label="用户昵称" v-bind="validateInfos.nickName">
        <a-input v-model:value="detailInfo.nickName" placeholder="请输入用户昵称" allowClear />
      </a-form-item>
      <a-form-item label="归属部门" v-bind="validateInfos.deptId">
        <a-cascader
          v-model:value="detailInfo.deptId"
          :field-names="{ value: 'id' }"
          :options="deptOptions"
          placeholder="请选择归属部门"
          change-on-select
        />
      </a-form-item>
      <a-form-item label="手机号码" v-bind="validateInfos.phonenumber">
        <a-input
          v-model:value="detailInfo.phonenumber"
          placeholder="请输入手机号码"
          type="tel"
          maxlength="11"
          @change="detailInfo.phonenumber = detailInfo.phonenumber.replace(/[^\d]/g, '')"
          allowClear
        />
      </a-form-item>
      <a-form-item label="邮箱" v-bind="validateInfos.email">
        <a-input v-model:value="detailInfo.email" placeholder="请输入邮箱" allowClear />
      </a-form-item>
      <a-form-item label="用户名称" v-bind="validateInfos.userName" v-if="!isEdit">
        <a-input v-model:value="detailInfo.userName" placeholder="请输入用户名称" allowClear />
      </a-form-item>
      <a-form-item label="用户密码" v-bind="validateInfos.password" v-if="!isEdit">
        <a-input v-model:value="detailInfo.password" placeholder="请输入用户密码" allowClear />
      </a-form-item>
      <a-form-item label="用户性别" v-bind="validateInfos.sex">
        <a-select v-model:value="detailInfo.sex" placeholder="请选择性别">
          <a-select-option v-for="item in sexOptionsEnum" :value="item.value" :key="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" v-bind="validateInfos.status">
        <a-radio-group v-model:value="detailInfo.status">
          <a-radio value="0">启用</a-radio>
          <a-radio value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- <a-form-item label="岗位" v-bind="validateInfos.postIds">
        <a-input v-model:value="detailInfo.postIds" placeholder="请输入"></a-input>
      </a-form-item>-->
      <a-form-item label="角色" v-bind="validateInfos.roleIds">
        <a-select mode="multiple" v-model:value="detailInfo.roleIds" placeholder="请选择角色">
          <a-select-option
            v-for="item in statusOptions"
            :value="item.roleId"
            :key="item.roleId"
            :disabled="item.status == 1"
            >{{ item.roleName }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="备注" v-bind="validateInfos.remark">
        <a-textarea v-model:value="detailInfo.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { Form, message } from 'ant-design-vue'
import { userDetailRules } from '@/validator/setting'
import { actionTypeEnum } from '@/enums/commonEnum'
import { sexOptionsEnum } from '@/enums/settingEnum'
import {
  apiGetUserDetail,
  apiGetDepartmentList,
  apiAddUser,
  apiUpdateUser,
  apiGetRolesDropList,
} from '@/service/api/setting'
import { findTreePath } from '@/utils/base'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 6 }

const visible = ref<boolean>(false)

const title = ref<string>('添加用户')

const handleType = ref(actionTypeEnum.ADD)

const detailInfo = reactive({
  nickName: '',
  deptId: [],
  phonenumber: '',
  email: '',
  userName: '',
  password: '',
  sex: '',
  status: '0',
  roleIds: [],
  remark: '',
})

const userId = ref<number>(-1)

const statusOptions = ref()

const deptOptions = ref()

const useForm = Form.useForm

const { validate, validateInfos, resetFields } = useForm(detailInfo, userDetailRules)

const isEdit = computed(() => handleType.value === actionTypeEnum.EDIT)

/**
 * @desc 初始化对话框
 */
const initModal = (type: number, initInfo: any) => {
  handleType.value = type
  getDepartmentList()
  if (type === actionTypeEnum.EDIT) {
    title.value = '编辑用户'
    userId.value = initInfo.userId as number
    getUserDetail()
  } else {
    getRoles()
  }
  visible.value = true
}

/**
 * @desc 获取用户详情
 */
const getUserDetail = async () => {
  const { code, data } = await apiGetUserDetail({ userId: userId.value })
  if (code === 20000) {
    const { nickName, deptId, phonenumber, email, sex, status, remark, userName } = data.user
    statusOptions.value = data.roles
    Object.assign(detailInfo, {
      nickName,
      phonenumber,
      email,
      sex,
      status,
      remark,
      userName,
      roleIds: data.roleIds,
    })
    // 根据最后一个节点找到各级父节点
    const parentIdArr = findTreePath(deptOptions.value, (val: any) => val.id === deptId, [])
    detailInfo.deptId = parentIdArr
  }
}

/**
 * @desc 获取部门
 */
const getDepartmentList = async () => {
  const { code, data } = await apiGetDepartmentList()
  if (code === 20000) {
    deptOptions.value = data
  }
}

/**
 * 获取角色列表
 */
const getRoles = async () => {
  const { code, data } = await apiGetRolesDropList()
  if (code === 20000) {
    statusOptions.value = data
  }
}

/**
 * @desc 确认
 */
const handleConfirm = () => {
  let validateField = ['nickName']
  console.log(handleType.value, actionTypeEnum.ADD)
  if (handleType.value === actionTypeEnum.ADD) {
    validateField = validateField.concat(['userName', 'password'])
  }
  validate(validateField).then(async () => {
    const { deptId } = detailInfo
    const len = deptId.length
    if (handleType.value === actionTypeEnum.ADD) {
      const { code } = await apiAddUser({ ...detailInfo, deptId: deptId[len - 1] })
      if (code === 20000) {
        message.success('添加用户成功')
        props.handleRefresh()
      }
    } else {
      const { code } = await apiUpdateUser({ ...detailInfo, deptId: deptId[len - 1], userId: userId.value })
      if (code === 20000) {
        message.success('更新用户成功')
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

<style lang="less" scoped>
.ant-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .ant-form-item {
    width: 45%;
  }
}
</style>
