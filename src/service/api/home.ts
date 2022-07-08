import { $http } from '../http/index'

import { GetTaskScheduleListInterface } from '../types/home'

enum Api {
  getTaskScheduleList = '/aggregation/agg/dsjobconfig/selectPage',
}

// -------------------------------------- 企业码 -----------------------------------------------

/**
 * @desc: 获取任务调度列表
 */
export function apiGetTaskScheduleList(params: GetTaskScheduleListInterface) {
  return $http.request({
    url: Api.getTaskScheduleList,
    method: 'GET',
    params,
  })
}
