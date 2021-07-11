import request from '@/service/request'

export const queryInfoVerifyOfJs = (params) => request('/preleasing/infoVerifyCtrl/queryInfoVerify', params,
  'get')
