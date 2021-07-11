import request from '@/service/request'

export const download = (params) => request('/preleasing/financialPreparation/financialPreparation', params,
  'GET')
export const queryFuKuanDetialOfJs = (params) => request('/preleasing/financialPreparation/getInfoByContractNo', params,
  'get')
export const getPayList = {
  'url': '/preleasing/financialPreparation/getAllFinancialPreparationList',
  type: 'get'
}
export const downloadUrl = {
  'url': '/preleasing/financialPreparation/financialPreparation/',
  type: 'get'
}
