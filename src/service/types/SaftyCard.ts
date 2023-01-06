/**
 * @description: 登录
 */
export interface SubmitSaftyCardConfigInterface {
  name: string
  categoryParent: string
  sort: string
}

export interface SubmitSaftyCardInterface {
  name: string
  code: string
  type: string
}

export interface ReNameSaftyCardInterface {
  name: string
  id: number
}
