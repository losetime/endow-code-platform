/**
 * 系统设置表单验证规则
 */
import { reactive } from 'vue'

// ---------------------------------- 用户管理 ------------------------------------------

export const userDetailRules = reactive({
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'change' }],
  userName: [{ required: true, message: '用户名称不能为空', trigger: 'change' }],
  password: [{ required: true, message: '用户密码不能为空', trigger: 'change' }],
})

export const passwordRules = reactive({
  password: [{ required: true, message: '用户新密码不能为空', trigger: 'change' }],
})

// ---------------------------------- 角色管理 ------------------------------------------

export const roleDetailRules = reactive({
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'change' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'change' }],
  roleSort: [{ required: true, type: 'number', message: '角色顺序不能为空', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
})

// ---------------------------------- 菜单管理 ------------------------------------------

export const menuDetailRules = reactive({
  parentId: [{ required: true, type: 'number', message: '上级菜单不能为空', trigger: 'change' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'change' }],
  orderNum: [{ required: true, type: 'number', message: '显示排序不能为空', trigger: 'change' }],
  visible: [{ required: true, message: '请选择显示状态', trigger: 'change' }],
  isFrame: [{ required: true, message: '请选择是否外链', trigger: 'change' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'change' }],
  routerName: [{ required: true, message: '路由名称不能为空', trigger: 'change' }],
  level: [{ required: true, type: 'number', message: '路由等级不能为空', trigger: 'change' }],
  component: [{ required: true, message: '组件路径不能为空', trigger: 'change' }],
  status: [{ required: true, message: '请选择菜单状态', trigger: 'change' }],
  isCache: [{ required: true, message: '请选择是否缓存', trigger: 'change' }],
})

// ---------------------------------- 部门管理 ------------------------------------------

export const deptDetailRules = reactive({
  parentId: [{ required: true, type: 'array', message: '请选择上级部门', trigger: 'change' }],
  deptName: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
  orderNum: [{ required: true, type: 'number', message: '排序不能为空', trigger: 'change' }],
  orgTypeId: [{ required: true, message: '公司/部门类型不能为空', trigger: 'change' }],
  relateLsdDeptId: [{ required: true, message: '洛斯达监理单位不能为空', trigger: 'change' }],
})

export const saftyCardConfigAddRules = reactive({
  categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'change' }],
  parentId: [{ required: true, message: '上级分类不能为空', trigger: 'change' }],
  orderNum: [{ required: true, message: '分类排序不能为空', trigger: 'change' }],
})

export const thinkCodeLibraryCatalogAddRules = reactive({
  categoryName: [{ required: true, message: '目录名称不能为空', trigger: 'change' }],
  parentId: [{ required: true, message: '上级目录不能为空', trigger: 'change' }],
})

export const saftyCardProjectAddRules = reactive({
  content: [{ required: true, message: '内容不能为空', trigger: 'change' }],
  orderNum: [{ required: true, message: '排序不能为空', trigger: 'change' }],
})

export const saftyCardAddRules = reactive({
  name: [{ required: true, message: '监督卡名称不能为空', trigger: 'change' }],
  code: [{ required: true, message: '代码不能为空', trigger: 'change' }],
  type: [{ required: true, message: '监督卡类型不能为空', trigger: 'change' }],
})

export const saftyCardReNameRules = reactive({
  name: [{ required: true, message: '监督卡名称不能为空', trigger: 'change' }],
})
