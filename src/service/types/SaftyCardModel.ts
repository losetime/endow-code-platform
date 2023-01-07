export interface SubmitSaftyCardInterface {
  name: string
  code: string
  type: string
}

export interface ReNameSaftyCardInterface {
  name: string
  id: number
}

export interface ProjectSaftyCardInterface {
  categoryId: string
}

export interface CreateSaftyCardProjectInterface {
  content: string
  id: string //Id,新增时无需传，修改时必传
  orderNum: string
  safetyCardCategoryId: string
}

export interface CreateSaftyCardProjectTypeInterface {
  categoryName: string
  id: string
  orderNum: string
  safetyCardId: string
  parentId: string
}
