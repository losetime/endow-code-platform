import { IPaging } from './common'

/**
 * @desc: 企业码
 */
export interface IGetEnterpriseCodeList extends IPaging {
  licenseCode?: string
  name?: string
}

/**
 * @desc 人员码
 */
export interface IGetPeopleCodeList extends IPaging {
  name?: string
  mobile?: string
  identity?: string
}

/**
 * @desc 工程码
 */
export interface IGetProjectCodeList extends IPaging {
  name?: string
  projectCode?: string
}

/**
 * @desc 获取转码信息列表
 */
export interface IGetTranscodeList extends IPaging {
  reason?: string
}

/**
 * @desc 查询唯一编码相关信息
 */
export interface IGetTargetCodeInfo {
  objectCode: string
  type: string
}

/**
 * @desc 获取转码详情
 */
export interface ISaveTranscodeInfo {
  id?: number
  status?: string
  type?: string
  targetCode?: string
  targetCodeColor?: string
  reason?: string
  codeExpire?: string
  name?: string
  targetId?: string
  attachmentList?: any[]
}

/**
 * @desc 获取申诉列表
 */
export interface IGetAppealManageList extends IPaging {
  status: string
  name?: string
  type?: string
}
