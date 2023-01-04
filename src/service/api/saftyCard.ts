import { $http } from '../http/index'
import { SubmitSaftyCardConfigInterface } from '../types/SaftyCardConfig'

enum Api {
  getSaftyCardList = '/usermanager/captchaImage',
  getSaftyCardConfig = '/usermanager/login',
  getSaftyCardConfigProject = '/usermanager/getInfo',
  confirmSaftyCardConfigTree = '/xxx/sss',
  getCardTypes = '/xxx/sss',
}

/**
 * @desc: 获取token
 */
export function apiGetSaftyCardInfo(): Promise<any> {
  return $http.request({
    url: Api.getSaftyCardList,
    method: 'GET',
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
 * @desc: 提交安全监督卡配置
 */
export function apiSubmitSaftyCardConfig(params: SubmitSaftyCardConfigInterface): Promise<any> {
  return $http.request({
    url: Api.confirmSaftyCardConfigTree,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 提交安全监督卡配置
 */
export function apiGetCardTypes(): Promise<any> {
  return $http.request({
    url: Api.getCardTypes,
    method: 'GET',
  })
}

//getSaftyCardConfigProject
