import request from '../../../service/request'

export const getList = (params) => request('/view/groupCtrl/getSelectGroup', params,
  'get')

export const addGroup = (params) => request('/view/groupCtrl/insert', params,
  'post')

export const updateGroup = (params) => request('/view/groupCtrl/updateGroup', params,
  'post')

export const adminGroup = (params) => request('/view/groupUserCtrl/updateUserGroup', params,
  'post')

export const userList = (params) => request('view/groupUserCtrl/selectUser', params,
  'get')

export const openOrCloseFlag = (params) => request('/view/groupCtrl/updateFlag', params,
  'post')

export const userByName = (params) => request('/view/groupCtrl/getUserByName', params,
  'get')
