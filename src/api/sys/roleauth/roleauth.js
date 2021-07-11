import request from '../../../service/request'
export const selectAuth = (params) => request('/view/roleAuthCtrl/selectAuth', params,
  'get')
