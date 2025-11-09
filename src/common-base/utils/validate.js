/**
 * Created by lijianwei on 19/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const reg = /^[A-Za-z0-9]+$/
  return reg.test(str)
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
 * @param {string} str
 * @returns {Boolean}
 */
export function isNumber(number) {
  if (typeof number === 'number' || number instanceof Number) {
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

/** 表单校验 **/

// 数字校验
// 数字校验
export function validNumber(rule, value, callback) {
  const reg = /^[0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}

export function positiveIntegerCheck(rule, value, callback) {
  const reg = /^[1-9]\d*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正整数（不包含0）'))
  } else {
    callback()
  }
}

export function positiveIntegerZoneCheck(rule, value, callback) {
  const reg = /^[0-9]\d*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}

export function currencyCheck(rule, value, callback) {
  const reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
  if (!reg.test(value)) {
    callback(new Error('请输入大于0的整数或小数(保留两位)'))
  } else {
    callback()
  }
}

// 手机号校验
export function phoneNumber(rule, value, callback) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

// 固定电话校验
export function telephone(rule, value, callback) {
  const reg = /0\d{2,3}-\d{7,8}/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的固话格式 000-12345678'))
  } else {
    callback()
  }
}

// 银行卡号校验
export function bankCard(rule, value, callback) {
  const reg = /^([1-9]{1})(\d{14}|\d{18})$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的银行卡号'))
  } else {
    callback()
  }
}

// url校验
export function urlValidate(rule, value, callback) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的url'))
  } else {
    callback()
  }
}
