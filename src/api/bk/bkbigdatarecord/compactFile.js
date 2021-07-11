import request from '@/service/request'

export const getContractFilingList = {
  'url': '/preleasing/contractFiling/contractFilingList',
  type: 'get'
}
export const queryGPSInfoByContractNoOfJs = (params) => request('/preleasing/gpsInfoCtrl/queryGPSInfoByContractNo', params,
  'get')
export const queryHistoryOfJs = {
  'url': '/preleasing/flow/queryHistory/',
  type: 'GET'
}

export const contractFilingOfJs = (params) => request('/preleasing/contractFiling/contractFiling', params,
  'POST')
