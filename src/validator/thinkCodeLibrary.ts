import { reactive } from 'vue'

export const createThinkCodeRules = reactive({
  title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'change' }],
})
