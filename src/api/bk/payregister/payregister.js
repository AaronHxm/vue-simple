import request from '@/service/request'

export const getPayRegisterList = {
  'url': '/preleasing/payRegisterCtrl/queryPayRegisterList',
  type: 'GET'
}
export const loanSuccessOfJs = (params) => request('/preleasing/payRegisterCtrl/updatePayRegisterSucceed', params,
  'POST')
export const loanFailedOfJs = (params) => request('/preleasing/payRegisterCtrl/updatePayRegisterFailed', params,
  'POST')
