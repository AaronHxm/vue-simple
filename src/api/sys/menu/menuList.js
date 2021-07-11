import request from '../../../service/request'

export const getList = (params) => request('/view/menuCtrl/queryMenuList', params,
  'get')

export const addMenu = (params) => request('/view/menuCtrl/insert', params,
  'post')

export const updateMenu = (params) => request('/view/menuCtrl/updateMenu', params,
  'post')

export const selectMenuVo = (params) => request('/view/menuCtrl/selectMenuVo', params,
  'post')

export const openOrCloseFlag = (params) => request('/view/menuCtrl/updateMenuFlag', params,
  'post')
