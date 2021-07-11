import request from '../../../service/request'

/**
 * 查询所有的机制的方法
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const orglist = (params) => request('/view/org/orglist', params,
  'post')
/**
 * 插入数据
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const orginsert = (params) => request('/view/org/orginsert', params,
  'post')

/**
 * 根据Id查询一个对象
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const selectOrgById = (params) => request('/view/org/selectOrgById', params,
  'post')
/**
 * * 修改数据
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const orgupdate = (params) => request('/view/org/orgupdate', params,
  'post')

/**
 * 查询机构为空的用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const selectUserNull = (params) => request('/view/user/selectUserNull', params,
  'post')

/**
 * 修改没有机构的用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const updataUserOrg = (params) => request('/view/user/updataUserOrg', params,
  'post')


/**
 * 树形回显
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const selMenuVo = (params) => request('/view/user/selMenuVo', params,
  'post')

/**
 * 修改flag
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const disable = (params) => request('/api/v1//sysOrigins/disable', params,
  'post')

