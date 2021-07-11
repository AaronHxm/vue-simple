import request from '../../../service/request'

/**
 * 根据权限id    查询出所有的菜单以及 该权限拥有的菜单
 * @param params
 * @returns {*|Promise<unknown>}
 */
export const selectMenuByAuthId = (params) => request('/view/authMenuCtrl/getAllMenu', params,
  'get')
/**
 * 获取所有的权限
 * @returns {*|Promise<unknown>}
 */
export const selectAllRole = () => request('/view/authMenuCtrl/getAllAuth',
  'get')

/**
 * 给权限根据权限id分配菜单
 * @param params
 * @returns {*|Promise<unknown>}
 */
export const upadteRelAuthMenu = (params) => request('/view/authMenuCtrl/updateAuthMenu', params,
  'get')
