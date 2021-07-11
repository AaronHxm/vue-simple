import request from "@/service/request";

export const getContractById = (params) => request('/preleasing/secondaryMarketing/selectSecondaryMarketingByapplyNo', params,
  'GET')

export const updateInfo = (params) => request('/preleasing/secondaryMarketing/updateSecondaryMarketing', params,
  'POST')

export const selectGpsDataDic = (params) => request('/preleasing/secondaryMarketing/selectGpsDataDic', params,
  'GET')
temporaryStorageOfJs

export const temporaryStorageOfJs = (params) => request('/preleasing/secondaryMarketing/temporaryStorage', params,
  'POST')
export const queryHistoryOfJs = {
  'url': '/preleasing/flow/queryHistory/',
  type: 'GET'
}
