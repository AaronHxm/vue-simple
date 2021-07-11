import request from '@/service/request'

export const getPayConfirmList = {
  'url': '/preleasing/payConfirmCtrl/queryPayConfirmList',
  type: 'get'
}
export const queryPayConfirmOfJs = (params) => request('/preleasing/payConfirmCtrl/queryPayConfirmByContractNo', params,
  'get')
export const loanConfirm = (params) => request('/preleasing/lendingToConfirmCtrl/lendingToConfirm', params,
  'post')

export const querySN = (params) => request('/preleasing/secondaryMarketing/getGpsSn', params,
  'get')
