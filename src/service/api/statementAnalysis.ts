import { $http } from '../http/index'

enum Api {
  getCodingAnalysisList = '/ecode_grant/report/code_color', //赋码分析列表
  exportCodingAnalysisList = '/ecode_grant/report/code_color/export', //赋码报表导出
  getLogAnalysisList = '/ecode_grant/report/log', //日志分析列表
  exportLogAnalysisList = '/ecode_grant/report/log/export', //导出日志分析报表
}

/**
 * @desc: 获取赋码分析报表列表
 */
export function apiGetCodingAnalysisList(params: any): Promise<any> {
  return $http.request({
    url: Api.getCodingAnalysisList,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 导出赋码分析报表
 */

export function apiPostExportCoddingAnalysisList(params: any) {
  return $http.request({
    url: Api.exportCodingAnalysisList,
    method: 'POST',
    responseType: 'blob',
    params,
  })
}

/**
 * @desc: 获取日志分析报表列表
 */
export function apiGetLogAnalysisList(params: any): Promise<any> {
  return $http.request({
    url: Api.getLogAnalysisList,
    method: 'GET',
    params,
  })
}

export function apiPostExportLogAnalysisList(params: any) {
  return $http.request({
    url: Api.exportLogAnalysisList,
    method: 'POST',
    responseType: 'blob',
    params,
  })
}
