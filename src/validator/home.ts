/**
 * 主页表单验证规则
 */
import { reactive } from 'vue'

// ----------------------------------VR设备码规则------------------------------------------
export const vrCodeInfoRules = reactive({
  vrSn: [{ required: true, message: '设备编码不能为空', trigger: 'change' }],
  bidNo: [{ required: true, message: '请选择标段', trigger: 'change' }],
})
