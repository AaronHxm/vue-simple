import request from '@/service/request'

export const applyStatusListUrlOfJs = {
  'url': '/preleasing/ApplicationStatusChangeCtrl/selectApplicationStatusChange',
  type: 'get'
}
export const startProductOfJs = (params) => request('/preleasing/GuarantorProductsCtrl/startProductByPrdId', params,
  'get')

export const startProductOf = (params) => request('/preleasing/ApplicationStatusChangeCtrl/selectRocessChanges', params,
  'get')

export const saveStatus = (params) => request('/preleasing/ApplicationStatusChangeCtrl/saveChangeStatus', params,
  'POST')
