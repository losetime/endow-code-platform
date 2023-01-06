import { $http } from '../http/index'
import { SubmitSaftyCardConfigInterface, SubmitSaftyCardInterface, ReNameSaftyCardInterface } from '../types/SaftyCard'

enum Api {
  getSaftyCardList = '/ecode_grant/safety_checklist_card',
  confirmCreateSaftyCard = '/ecode_grant/safety_checklist_card',
  getSaftyCardConfig = '/xxx/sss',
  getSaftyCardConfigProject = '/xxx/sss',
  confirmCreateSaftyCardConfig = '/xxx/sss',
  renameSaftyCardName = '/ecode_grant/safety_checklist_card',
  deleteSaftyCard = '/ecode_grant/safety_checklist_card',
  unPublishSaftyCard = '/ecode_grant/safety_checklist_card/cancel_publicsh',
  publishSaftyCard = '/ecode_grant/safety_checklist_card/publish',
}

/**
 * @desc: 获取token
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
export function apiGetSaftyCardConfig(): Promise<any> {
  return $http.request({
    url: Api.getSaftyCardConfig,
    method: 'GET',
  })
}

/**
 * @desc: 获取配置树节点对应的项目信息
 */
export function apiGetSaftyCardConfigProject(): Promise<any> {
  return $http.request({
    url: Api.getSaftyCardConfigProject,
    method: 'GET',
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
 * @desc: 提交创建安全监督卡配置
 */
export function apiSubmitSaftyCardConfig(params: SubmitSaftyCardConfigInterface): Promise<any> {
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

//publishSaftyCard
