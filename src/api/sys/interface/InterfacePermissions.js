import request from '../../../service/request'

export const createCtrlUser = (params) => request('/view/CtrlUserCtrl/createCtrlUser', params,
  'post')
export const addIpWhite = (params) => request('/view/CtrlUserCtrl/addIpWhite', params,
  'post')
export const updateStatus = (params) => request('/view/CtrlUserCtrl/updateStatus', params,
  'post')
export const queryAllCtrl = (params) => request('/view/query/queryAllCtrl', params,
  'get')
export const addUserCtrlRel = (params) => request('/view/CtrlUserCtrl/addUserCtrlRel', params,
  'post')
export const queryAllUser = {
  'url': '/view/query/queryAllUser',
  type: 'get'
}
