import request from '../../../service/request'

/**
 * 保客营销合同页面
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const getBkHTList = {'url':'preleasing/contract/contractShow',type:'post' }

export const downloadContract = (params) => request('/file/upliadByTypeIdAndRelNo', params,
  'get')


export const makeContract = (params) => request('/preleasing/contract/makeContract', params,
  'post')

