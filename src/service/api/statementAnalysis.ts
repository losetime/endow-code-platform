import { $http } from '../http/index'

enum Api {
  getCodingAnalysisList = '/ecode_grant/report/code_color', //赋码分析列表
  exportCodingAnalysisList = '/ecode_grant/report/code_color/export', //赋码报表导出
  getLogAnalysisList = '/ecode_grant/report/log', //日志分析列表
  exportLogAnalysisList = '/ecode_grant/report/log/export', //导出日志分析报表
  getSupervisonManagementAnalysisList = '/ecode_grant/report/supervision', //获取监督管理分析列表
  exportSupervisonManagementAnalysisList = '/ecode_grant/report/supervision/export', //导出监督管理分析报表
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

/**
 * @desc: 导出日志分析报表列表
 */
export function apiPostExportLogAnalysisList(params: any) {
  return $http.request({
    url: Api.exportLogAnalysisList,
    method: 'POST',
    responseType: 'blob',
    params,
  })
}

/**
 * @desc: 获取监督管理分析列表
 */
export function apiGetSupervisonManagementAnalysisList(params: any): Promise<any> {
  return $http.request({
    url: Api.getSupervisonManagementAnalysisList,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 导出监督管理分析报表列表
 */
export function apiPostExportSupervisonManagementAnalysisList(params: any) {
  return $http.request({
    url: Api.exportSupervisonManagementAnalysisList,
    method: 'POST',
    responseType: 'blob',
    params,
  })
}
