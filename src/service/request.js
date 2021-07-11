import axios from './interceptor'
import Qs from 'qs'

export default function request(url = '', params = {}, type = 'GET', config) {
  // 1. 变量
  let promise
  // 2. 返回一个promise对象
  return new Promise((resolve, reject) => {
    // 2.1 判断请求的类型
    if (type.toUpperCase() === 'GET') { // get请求
      // 2.2 拼接字符串
      let paramsStr = ''
      // 2.3 遍历
      Object.keys(params).forEach(key => {
        paramsStr += key + '=' + params[key] + '&'
      })
      // 2.4 过滤最后的&
      /*
        注意：为了防止请求缓存，在尾部加了时间戳
      */
      if (paramsStr) {
        paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'))
        // 2.5 拼接完整路径
        if (url.indexOf('127.0.0.1') === -1) {
          url += '?' + paramsStr // + '&Geek-James=' + randomCode(20);
        } else {
          url += '?' + paramsStr
        }
      } else {
        if (url.indexOf('127.0.0.1') === -1) {
          // url += '?Geek-James=' + randomCode(20)
        }
      }
      // 2.6 发起get请求
      console.log(
        'config',config
      )
      promise = axios.get(url,config)
    } else if (type.toUpperCase() === 'POST') { // post请求
      // 2.7 发起post请求  params ={'username':'1111','password':'22222'}
      promise = axios.post(url, params, {
        headers: {
         // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
      })
    }
    // 2.8 处理结果并返回
    promise.then((response) => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })

}
function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
// 将一个对象转成QueryString
function toQueryString(obj) {
  if (!obj) return ""
  return cleanArray(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return ""
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    })
  ).join("&")
}
// 生成指定长度的随机数
function randomCode(length) {
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let result = ''
  for (let i = 0; i < length; i++) {
    let index = Math.ceil(Math.random() * 9)
    result += chars[index]
  }
  return result
}
