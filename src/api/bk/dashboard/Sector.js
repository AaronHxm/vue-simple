import request from '../../../service/request'

/**
 * 月数据量方法
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const shiftUPMethod = (params) => request('/preleasing/indexPageDataCtrl/selectShiftUpRate', params,
  'get')
