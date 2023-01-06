import { $http } from '../http/index'

enum Api {
  getCodeList = '/usermanager/getInfo',
}

/**
 * @desc: 获取智码库列表
 */
export function apiGetCodeList(): Promise<any> {
  return $http.request({
    url: Api.getCodeList,
    method: 'GET',
  })
}
