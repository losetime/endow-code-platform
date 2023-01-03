import { $http } from '../http/index'

enum Api {
  getUserInfo = '/usermanager/getInfo',
  getInfoByDateArea = '/usermanager/getRouters',
}

/**
 * @desc: 获取用户信息
 */
export function apiGetUserInfo(): Promise<any> {
  return $http.request({
    url: Api.getUserInfo,
    method: 'GET',
  })
}

/**
 * @desc: 通过事件过去获取报表信息
 */
export function apiGetInfoByDateArea(params: { startDate: string; endDate: string }) {
  return $http.request({
    url: Api.getInfoByDateArea,
    method: 'GET',
    params,
  })
}
