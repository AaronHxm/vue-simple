import request from '../../../service/request'

/**
 * 月数据量方法
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const initMethod = (params) => request('/preleasing/indexPageDataCtrl/selectIndexData', params,
  'get')
