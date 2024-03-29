import { $http } from '../http/index'

enum Api {
  getThinkCodeLibrary = '/ecode_grant/smart_code_content', //智码库内容列表(分页)+搜索
  createGrantInfo = '/ecode_grant/smart_code_content', //新建智码库内容
  editGrantInfo = '/ecode_grant/smart_code_content', //编辑智码库内容
  delGrantInfo = '/ecode_grant/smart_code_content/',
  getThinkCodeInfo = '/ecode_grant/smart_code_content/', //获取智码库详情
}

/**
 * @desc: 获取智码库列表
 */
export function apiGetThinkCodeLibrary(params: any): Promise<any> {
  return $http.request({
    url: Api.getThinkCodeLibrary,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 新增智码库
 */
export function apiCreatThinkCodeLibrary(params: any): Promise<any> {
  return $http.request({
    url: Api.createGrantInfo,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 编辑智码库
 */
export function apiEditThinkCodeLibrary(params: any): Promise<any> {
  return $http.request({
    url: Api.editGrantInfo,
    method: 'PUT',
    params,
  })
}

/**
 * @desc: 获取智码库详情
 */
export function apiGetThinkCodeInfo(id: string): Promise<any> {
  return $http.request({
    url: Api.getThinkCodeInfo + `${id}`,
    method: 'GET',
  })
}

/**
 * @desc 删除智码库
 */
export function apiDeleteGrand(id: string) {
  return $http.request({
    url: Api.delGrantInfo + `${id}`,
    method: 'DELETE',
  })
}
