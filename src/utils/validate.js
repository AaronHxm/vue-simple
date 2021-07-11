/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 是不是https 或者http
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path) || /^(http?:|mailto:|tel:)/.test(path)
}

/**
 * 字符串非空
 * @param {string} str
 *  const valid_map = ['admin', 'editor']
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str.trim().length !== 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 验证手机号
 * @param arg
 * @returns {boolean}
 */
export function isMobile(arg) {
  const reg = /^1[3,4,5,6,7,8,9]\d{9}$/
  if (!reg.test(strTrim(arg))) {
    return '请输入正确格式的手机号码'
  }
  return true
}

function strTrim(Obj) {

  if (Obj) {
    return Obj.trim()
  }
  return ''
}

/**
 * 账号
 */
export function isAcct(arg) {
  //特殊字符串
  const specialChar = /[,;；，《》]+/
  //中文
  const pattern = /^[a-zA-Z0-9_]{0,}$/
  if (!pattern.test(strTrim(arg))||specialChar.test(strTrim(arg))) {
    return '账户名中不能含有中文或空格等特殊符号'
  }
  return true
}

/**
 *密码 var pwd =/^[a-zA-Z]\w{5,17}$/
 */
export function isPwd(arg) {
  //中文
  const pwd = /^[a-zA-Z]\w{5,17}$/
  if (!pwd.test(strTrim(arg))) {
    return '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
  }
  return true
}

/**
 *
 * @param arg
 * @returns {string|boolean}
 */
export function isPhoneNum(arg) {
  //电话
  const phoneNum = /^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/
  if (!phoneNum.test(strTrim(arg))) {
    return '请输入正确格式的固定电话号码'
  }
  return true
}




