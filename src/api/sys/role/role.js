import request from '../../../service/request'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const getList = (params) => request('/view/roleCtrl/queryRoleList', params,
  'post')
export const updateRoleOfJs = (params) => request('/view/roleCtrl/updateRole', params,
  'post')
export const addRoleOfJs = (params) => request('/view/roleCtrl/insertRole', params,
  'post')
export const selectGroupsByRoleIdOfJs = (params) => request('/view/roleGroupCtrl/selectGroup', params,
  'get')
/**
 * 给角色分配菜单
 * @param params
 * @returns {*|Promise<unknown>}
 */
export const updateRoleAuth = (params) => request('/view/roleAuthCtrl/updateRoleAuth', params,
  'get')
export const roleAddGroup = (params) => request('/view/roleGroupCtrl/updateRoleGroup', params,
  'get')
export const updateUseFlagOfJs = (params) => request('/view/roleCtrl/updateUseFlagOfRole', params,
  'get')
export const roleListUrl = {
  'url': '/view/roleCtrl/queryRoleList',
  type: 'get'
}
