import request from '@/service/request'

export const queryLoandetilOfJs = (params) => request('/preleasing//payCtrl/queryPayDetailById', params,
  'get')
export const getLoandetilList = {
  'url': '/preleasing/payCtrl/queryPayDetailList',
  type: 'get'
}
