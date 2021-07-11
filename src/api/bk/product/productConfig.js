import request from '../../../service/request'

/**
 * 保客营销页面
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const getProductConfigList = {
  'url': '/preleasing/GuarantorProductsCtrl/getGuarantorProductsCtrl',
  type: 'get'
}
export const startProductOfJs = (params) => request('/preleasing/GuarantorProductsCtrl/startProductByPrdId', params,
  'get')

export const stopProductOfJs = (params) => request('/preleasing/GuarantorProductsCtrl/stopProductByPrdId', params,
  'get')
export const addProductOfJs = (params) => request('/preleasing/GuarantorProductsCtrl/insertGuarantorProductsCtrl', params,
  'get')

export const SelectGuarantorProductsById = (params) => request('/preleasing/GuarantorProductsCtrl/SelectGuarantorProductsById', params,
  'get')

export const editProductOfJs = (params) => request('/preleasing/GuarantorProductsCtrl/updateGuarantorProductsCtrl', params,
  'get')


