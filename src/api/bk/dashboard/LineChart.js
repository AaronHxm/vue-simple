import request from '../../../service/request'

/**
 * 折线图调用方法
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const lineChartInit = (params) => request('/preleasing/indexPageDataCtrl/selectKPIAchievingRate', params,
  'get')
