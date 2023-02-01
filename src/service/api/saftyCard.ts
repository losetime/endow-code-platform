import { $http } from '../http/index'
import {
  SubmitSaftyCardInterface,
  ReNameSaftyCardInterface,
  ProjectSaftyCardInterface,
  CreateSaftyCardProjectInterface,
  CreateSaftyCardProjectTypeInterface,
} from '../types/SaftyCardModel'

enum Api {
  getSaftyCardList = '/ecode_grant/safety_checklist_card',
  confirmCreateSaftyCard = '/ecode_grant/safety_checklist_card',
  getSaftyCardConfigTree = '/ecode_grant/safety_checklist_card_category/tree',
  getSaftyCardConfigProject = '/ecode_grant/safety_checklist_card_content',
  confirmCreateSaftyCardConfig = '/ecode_grant/safety_checklist_card_category',
  createSaftyCardProject = '/ecode_grant/safety_checklist_card_content',
  editSaftyCardProject = '/ecode_grant/safety_checklist_card_content',
  renameSaftyCardName = '/ecode_grant/safety_checklist_card',
  deleteSaftyCard = '/ecode_grant/safety_checklist_card',
  deleteSaftyCardProject = '/ecode_grant/safety_checklist_card_content',
  unPublishSaftyCard = '/ecode_grant/safety_checklist_card/cancel_publicsh',
  publishSaftyCard = '/ecode_grant/safety_checklist_card/publish',
}

/**
 * @desc: 获取安全监督卡
 */
export function apiGetSaftyCardInfo(params: any): Promise<any> {
  return $http.request({
    url: Api.getSaftyCardList,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 获取配置树
 */
export function apiGetSaftyCardConfig(cardId: string) {
  return $http.request({
    url: Api.getSaftyCardConfigTree + `/${cardId}`,
    method: 'GET',
  })
}

/**
 * @desc: 获取配置树节点对应的项目信息
 */
export function apiGetSaftyCardConfigProject(params: ProjectSaftyCardInterface): Promise<any> {
  return $http.request({
    url: Api.getSaftyCardConfigProject,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 提交创建安全监督卡
 */
export function apiSubmitCreateSaftyCard(params: SubmitSaftyCardInterface): Promise<any> {
  return $http.request({
    url: Api.confirmCreateSaftyCard,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 重命名安全监督卡
 */
export function apiRenameSaftyCardName(params: ReNameSaftyCardInterface): Promise<any> {
  return $http.request({
    url: Api.renameSaftyCardName,
    method: 'PUT',
    params,
  })
}

/**
 * @desc 删除安全监督卡
 */
export function apiDeleteSaftyCard(id: string) {
  return $http.request({
    url: Api.deleteSaftyCard + `/${id}`,
    method: 'DELETE',
  })
}

/**
 * @desc 删除安全监督卡对应的项目
 */
export function apiDeleteSaftyCardProject(id: string) {
  return $http.request({
    url: Api.deleteSaftyCardProject + `/${id}`,
    method: 'DELETE',
  })
}

/**
 * @desc 撤销发布安全监督卡
 */
export function apiUnPublishSaftyCard(id: string) {
  return $http.request({
    url: Api.unPublishSaftyCard + `/${id}`,
    method: 'POST',
  })
}

/**
 * @desc 发布安全监督卡
 */
export function apiPublishSaftyCard(id: string) {
  return $http.request({
    url: Api.publishSaftyCard + `/${id}`,
    method: 'POST',
  })
}

/**
 * @desc: 提交创建安全监督卡内容
 */
export function apiCreateSaftyCardProject(params: CreateSaftyCardProjectInterface): Promise<any> {
  return $http.request({
    url: Api.createSaftyCardProject,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 重命名安全监督卡
 */
export function apiEditSaftyCardProject(params: CreateSaftyCardProjectInterface): Promise<any> {
  return $http.request({
    url: Api.editSaftyCardProject,
    method: 'PUT',
    params,
  })
}

/**
 * @desc: 提交创建安全监督卡分类
 */
export function apiConfirmCreateSaftyCardConfig(params: CreateSaftyCardProjectTypeInterface): Promise<any> {
  return $http.request({
    url: Api.confirmCreateSaftyCardConfig,
    method: 'POST',
    params,
  })
}

//confirmCreateSaftyCardConfig
