import request from '../../../service/request'

export const addUpdateSysParam = (params) => request('/datadic/addUpdateSysParam', params,'post')
export const updateUseFlagOfJs = (params) => request('/datadic/updateUseFlag', params,'post')

