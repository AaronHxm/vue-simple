import request from '../../../service/request'

/**
 * 用户登录
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const login = (params) => request('/view/user/loginByUserNameAndPwd', params,
  'post')
/**
 * 用户显示
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const getList = (params) => request('/view/user/userlist', params,
  'post')

/**
 * 添加用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const userInsert = (params) => request('/view/user/userInsert', params,
  'post')

/**
 * 根据Id 查询用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const selectUserById = (params) => request('/view/user/selectUserById', params,
  'post')


/**
 * 修改用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const userupdate = (params) => request('/view/user/userupdate', params,
  'post')


/**
 * 查询没有机构的用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const selectUserNull = (params) => request('/view/user/selectUserNull', params,
  'post')
/**
 * 查询没有机构的用户
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const updatepasswordOfJs = (params) => request('/view/user/updatepassword', params,
  'post')
/**
 * 禁用修改
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export const userupflag = (params) => request('/view/user/userupflag', params,
  'post')

export const getUserMenusByUserId = (params) => request('/view/authMenuCtrl/selectIndexMenu',params,'GET')
