import utils from './utils'
import iterate from './iterate'

/**
 * 修改：设置元素属性或attribute支持自定义属性
 */
function properties (el, props) {
  iterate(props, function (key, obj) {
    if (typeof el[key] == 'string') {
      el[key] = obj
    } else {
      el.setAttribute(key, obj)
    }
  })
}

/**
 * [createElement 创建html对象]
 * @param {[sting]} [标准标签名称，必须]
 * @param {[string|object|HTMLElement]}[分别为class列表，属性列表，parent对象]
 * @return {[type]} [HTMLElement]
 */
function createElement () {
  let [tagName, length] = [arguments[0], arguments.length]
  let t, i = 1, parent, attr, classLs, el
  for (; i < length; i++) {
    t = arguments[i]
    if (utils.isEmpty(t)) {
      continue
    }
    if (typeof t == 'object' && (t.nodeType == 1 || t.nodeType == 9 || t.nodeType == 11)) {
      parent = t
    } else if (typeof t == 'object') {
      attr = t
    } else if (typeof t == 'string') {
      classLs = t
    }
  }
  el = document.createElement(tagName)
  if (attr) {
    properties(el, attr)
  }
  if (classLs) {
    utils.addClass(el, classLs)
  }
  if (parent) {
    parent.appendChild(el)
  }
  return el
}

/**
 * 添加子元素 from 2.0
 */
function append (el, child) {
  return el.appendChild(child)
}

/**
 * 添加到父元素 from 2.0
 */
function appendTo (el, parent) {
  parent.appendChild(el)
  return el
}

/**
 * 在第一个位置添加子元素 from 2.0
 */
function prepend (el, child, target) {
  target = target || el.children[0]
  if (target) {
    return el.insertBefore(child, target)
  } else {
    return el.appendChild(child)
  }
}

/**
 * 添加到父元素的第一个位置或者指定位置 from 2.0
 */
function prependTo (el, parent, target) {
  target = target || parent.children[0]
  if (target) {
    parent.insertBefore(el, target)
  } else {
    parent.appendChild(el)
  }
  return el
}

/**
 * 删除节点
 * create from 2.0
 */
function remove (el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el)
    el = null
  }
  return el
}

/**
 * 设置或读取属性值操作
 * create from 2.0
 */
function attr (el, name, value) {
  //value = typeof value == "number" ? value + "" : value
  if (el && name) {
    if (typeof value != 'undefined') {
      if (el.nodeType) {
        el.setAttribute(name, value)
      } else {
        el[name] = value
      }
      return el
    } else {
      return el.attributes && el.attributes[name] ? el.attributes[name].value : el[name] || ''
    }
  } else {
    return el
  }
}

/**
 * 删除元素的属性
 * create from 2.0
 */
function removeAttr (el, name) {
  el.removeAttribute(name)
}

export default {
  createElement,
  properties,
  append,
  appendTo,
  prepend,
  prependTo,
  remove,
  attr,
  removeAttr
}
