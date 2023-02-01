import { IPaging } from './common'

/**
 * @desc: 智码库
 */
export interface NewThinkCodeLibrary extends IPaging {
  attachments?: string[]
  categoryId: number
  content: string
  id?: number //Id,新增时无需传，修改时必传
  orderNum?: number
  title: string //标题
}
