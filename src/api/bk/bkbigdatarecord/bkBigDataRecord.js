import request from '../../../service/request'

/**
 * 保客清单显示
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const queryAllBigdataRecordList = (params) => request('/BKInventoryCtrl/queryAllBigdataRecordList', params,
  'get')
