import request from '../service/request'
import { getToken } from '@/utils/auth'

export function getAuthority() {
  return JSON.parse(localStorage.getItem('operation-authority'))// || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('operation-authority', JSON.stringify(authority))
}

export function clearLocalStorag() {
  return localStorage.clear()
}

export const login = (params) => request('/api/v1/login',
  params,
  'post')


export const getInfo = (params) =>
  request(
    '/api/v1/getUserInfo', '',
    'get',
    {
      headers: {
        'token': getToken()
      }
    }

  )

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
