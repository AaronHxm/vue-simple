import request from '../../../../service/request'

/**
 * 添加或者修改
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const addOrUpdate = (params) => request('/preleasing/indexPageDataCtrl/updateKPI', params,
  'post')
