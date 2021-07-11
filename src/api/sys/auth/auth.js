import request from '../../../service/request'

export const getList = (params) => request('/view/authCtrl/queryAuthList', params,
  'post')
export const updateAuthOfJs = (params) => request('/view/authCtrl/updateAuth', params,
  'post')
export const addAuthOfJs = (params) => request('/view/authCtrl/insertAuth', params,
  'post')
export const updateUseFlagOfJs = (params) => request('/view/authCtrl/updateUseFlagOfAuth', params,
  'post')
export const authListUrl = {
  'url': '/view/authCtrl/queryAuthList',
  type: 'get'
}
