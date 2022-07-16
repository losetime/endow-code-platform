import { $http } from '../http/index'

import {
  IGetEnterpriseCodeList,
  IGetPeopleCodeList,
  IGetProjectCodeList,
  IGetTranscodeList,
  IGetTargetCodeInfo,
  ISaveTranscodeInfo,
  IGetAppealManageList,
} from '../types/home'

enum Api {
  getEnterpriseCodeList = '/ecode_grant/codeCompany/selectPage',
  getPeopleCodeList = '/ecode_grant/codeEmployee/selectPage',
  getProjectCodeList = '/ecode_grant/codeProject/selectPage',
  getTranscodeList = '/ecode_grant/codeChange/selectPage',
  deleteTranscode = '/ecode_grant/codeChange/delete',
  getTargetCodeInfo = '/ecode_grant/codeChange/getObjectInfo',
  saveTranscodeInfo = '/ecode_grant/codeChange/save',
  getTranscodeDetail = '/ecode_grant/codeChange/getDetail',
  getAppealManageList = '/ecode_grant/feedback/selectPage',
  handleMarkProcessed = '/ecode_grant/feedback/deal',
  getOverviewInfo = '/ecode_grant/dashboard/overview',
}

// -------------------------------------- 概览 -----------------------------------------------

/**
 * @desc: 获取概览信息
 * @param: type: calSum、codeColorNum、yearNum
 */
export function apiGetOverviewInfo(params: { type: string }) {
  return $http.request({
    url: Api.getOverviewInfo,
    method: 'GET',
    params,
  })
}

// -------------------------------------- 企业码 -----------------------------------------------

/**
 * @desc: 获取企业码列表
 */
export function apiGetEnterpriseCodeList(params: IGetEnterpriseCodeList) {
  return $http.request({
    url: Api.getEnterpriseCodeList,
    method: 'GET',
    params,
  })
}

// -------------------------------------- 人员码 -----------------------------------------------

/**
 * @desc: 获取人员码列表
 */
export function apiGetPeopleCodeList(params: IGetPeopleCodeList) {
  return $http.request({
    url: Api.getPeopleCodeList,
    method: 'GET',
    params,
  })
}

// -------------------------------------- 工程码 -----------------------------------------------

/**
 * @desc: 获取工程列表
 */
export function apiGetProjectCodeList(params: IGetProjectCodeList) {
  return $http.request({
    url: Api.getProjectCodeList,
    method: 'GET',
    params,
  })
}

// -------------------------------------- 码转色 -----------------------------------------------

/**
 * @desc: 获取转码信息列表
 */
export function apiGetTranscodeList(params: IGetTranscodeList) {
  return $http.request({
    url: Api.getTranscodeList,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 删除列表
 */
export function apiDeleteTranscode(params: number[]) {
  return $http.request({
    url: Api.deleteTranscode,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 查询唯一编码相关信息
 */
export function apiGetTargetCodeInfo(params: IGetTargetCodeInfo) {
  return $http.request({
    url: Api.getTargetCodeInfo,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 保存转码信息
 */
export function apiSaveTranscodeInfo(params: ISaveTranscodeInfo) {
  return $http.uploadFiles(
    {
      url: Api.saveTranscodeInfo,
      method: 'POST',
      timeout: 50 * 1000,
    },
    params,
  )
}

/**
 * @desc 获取转码信息详情
 */
export function apiGetTranscodeDetail(params: { id: string }) {
  return $http.request({
    url: Api.getTranscodeDetail,
    method: 'GET',
    params,
  })
}

// -------------------------------------- 申诉管理 -----------------------------------------------

/**
 * @desc: 获取转码信息列表
 */
export function apiGetAppealManageList(params: IGetAppealManageList) {
  return $http.request({
    url: Api.getAppealManageList,
    method: 'GET',
    params,
  })
}

/**
 * @desc: 标记为已处理
 */
export function apiHandleMarkProcessed(params: { id: string }) {
  return $http.request({
    url: Api.handleMarkProcessed,
    method: 'GET',
    params,
  })
}
