import request from '@/service/request'

export const getGpsOrderList = {
  'url': '/preleasing/gpsInfoCtrl/queryGPSInfoList',
  type: 'POST'
}
export const queryGPSInfoByContractNoOfJs = (params) => request('/preleasing/gpsInfoCtrl/queryGPSInfoByContractNo', params,
  'get')
