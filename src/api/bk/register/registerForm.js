import request from '../../../service/request'

export const registerCust = (params) => request('/preleasing/registerCustomerCtrl/updateCust', params,
  'post')
export const exitRegister = (params) => request('/preleasing/registerCustomerCtrl/updateCust', params,
  'get')

export const selectBySourceIdOrPersonIdOfJs = (params) => request('/preleasing/registerCustomerCtrl/selectBySourceIdOrPersonId', params,
  'get')
export const improveCustInfoOfJs = (params) => request('preleasing/custCtrl/improveCustInfo', params,
  'post')
