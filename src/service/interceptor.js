import axios from 'axios'
import { MessageBox, Message} from 'element-ui'
import store from '@/store'
import { getToken,setToken } from '@/utils/auth'
import { showLoading, hideLoading } from './loading';

// create an axios instance
const service = axios.create({
     baseURL: '/product', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 6000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    showLoading();
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['xftmtoken'] = getToken()
    }
    return config
  },
  error => {
    hideLoading();
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    hideLoading()
    console.log('response',response)
    const res = response.data
    const newToken = response.headers.newToken
    if(newToken){
      setToken(newToken)
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code != 200 ) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      }
      return Promise.reject(new Error(res.message || '系统异常,请稍后尝试'))
    } else {
      return res
    }
  },
  error => {
    hideLoading()
    console.log('err' + error) // for debug
    Message({
      message: '系统超时',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
