/**
 * 创建元素
 * @param tagName
 * @param className
 * @param props
 * @param parent
 * @return {*}
 */
export function createElement (tagName, className, props, parent) {
  if (tagName) {
    let el = document.createElement(tagName);
    if (className) {
      this.addClass(el, className);
    }
    if (props) {
      this.properties(el, props);
    }
    if (parent && this.isHtmlElement(parent)) {
      this.appendTo(el, parent);
    }
    return el;
  } else {
    // throw {
    //   code: 'error',
    //   msg: '标签名称不能为空！'
    // };
    throw new Error('标签名称不能为空！');
  }
}

/**
 * 判断是不是HTMLElement对象
 * @param  {[type]}  el [description]
 * @return {Boolean}    [description]
 */
export function isHtmlElement (el) {
  return el && el.nodeType && /^html[A-Za-z]+element$/.test(this.type(el));
}

/**
 * 判断对象是否是window
 * @param obj
 * @return {boolean}
 */
export function isWindow (obj) {
  return obj !== null && typeof obj === 'object' && obj === obj.window;
}

/**
 * 判断是否为类数组对象,
 * 所谓"类数组对象"就是一个常规的Object对象，但它和数组对象非常相似：具备length属性，并以0、1、2、3……等数字作为属性名。
 * 不过它毕竟不是数组，没有从数组的原型对象上继承下来的内置方法(例如：push()、 sort()等)。
 * @param obj
 * @return {boolean}
 */
export function isArrayLike (obj) {
  let length = !!obj && 'length' in obj && obj.length,
    type = this.type(obj);
  if (type === 'function' || this.isWindow(obj)) {
    return false;
  }
  return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
}

export function isPlainObject (obj) {
  let key, class2type = {};
  if (Elf.type(obj) !== 'object' || obj.nodeType || Elf.isWindow(obj)) {
    return false;
  }
  if (obj.constructor && !class2type.hasOwnProperty.call(obj, 'constructor') && !class2type.hasOwnProperty.call(obj.constructor.prototype || class2type, 'isPrototypeOf')) {
    return false;
  }
  return key === undefined || Object.hasOwnProperty.call(obj, key);
}

/**
 * [isJsonString 判断是否为合法的JSON字符串,排查基本数据类型]
 * @param  {[type]}  str [description]
 * @return {Boolean}
 */
export function isJsonString (str) {
  try {
    JSON.parse(str);
    return typeof str === 'string' && /^{.*}$|^\[.*\]$/.test(str);
  } catch (e) {
    return false;
  }
}

/**
 * [isCanParse 是否可被JSON解析]
 * @param  {[string]}  str [description]
 * @return {Boolean}     [description]
 */
export function isCanParse (str) {
  if (typeof str != 'string') {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 判断是否是空对象
 */
export function isEmptyObject (obj) {
  // for (let name in obj) {
  //   return false;
  // }
  // return true;
  return Object.keys(obj).length === 0;
}

/**
 * 判断是否为空
 */
export function isEmpty (obj) {
  if (typeof obj === 'string') {
    return this.trim(obj).length > 0 ? false : true;
  } else if (typeof obj === 'object') {
    return this.isEmptyObject(obj);
  } else if (typeof obj === 'undefined') {
    return true;
  } else if (typeof obj === 'boolean') {
    return !obj;
  } else if (typeof obj === 'number') {
    return obj === 0;
  } else {
    return obj || false;
  }
}

/**
 * 判断元素是否再数组中
 */
export function isInArray (el, arr, i) {
  return this.inArray(el, arr, i) >= 0 ? true : false;
}

/**
 * 判断是否是图片地址
 */
export function isImage (obj) {
  return /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i.test(obj);
}

/**
 * 返回对象的类型
 * 确定JavaScript内置对象的类型，并返回小写形式的类型名称
 */
export function type (obj) {
  return (obj === null || obj === undefined) ? obj + '' : Object.prototype.toString.call(obj).match(/\w+/g)[1].toLowerCase() || 'object';
}

/**
 * 遍历对象操作
 * @param obj
 * @param callback
 * @return {*}
 */
export function iterate (obj, callback) {
  for (let key in obj) {
    if (key.toString() !== 'length' && Object.prototype.hasOwnProperty.call(obj, key)) {
      callback.call(obj, key, obj[key]);
    }
  }
  return obj;
}

/**
 * 删除左右空格
 */
export function trim (text) {
  return text === null ? '' : (text + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 深度复制对象,copy一个对象生成一个新对象
 */
export function deepCopy (arr) {
  if (typeof arr !== 'object') {
    return;
  }
  let temp = arr instanceof Array ? [] : {},
    item;
  for (item in arr) {
    if (arr.hasOwnProperty(item)) {
      temp[item] = arr[item] && typeof arr[item] === 'object' ? Elf.deepCopy(arr[item]) : arr[item];
    }
  }
  return temp;
}

/**
 * [inArray 确定第一个参数在数组中的位置(如果没有找到则返回 -1)]
 * Modification to 2018-04-17 支持数组字符串格式（空格分割）
 * @param  {[type]} elem [description]
 * @param  {[type]} arr  [必须,数组或数组字符串格式（空格分割）]
 * @param  {[type]} i    [开始查找的位置，如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1 ]
 * @return {[type]}      [返回index,如果没有找到则返回 -1]
 */
export function inArray (elem, arr, i) {
  arr = typeof arr === 'string' ? (arr || '').match(/[^\s,]+/g) || [] : arr;
  return arr === null ? -1 : [].indexOf.call(arr, elem, i);
}

/**
 * 字符串转数组
 * @param str
 * @return {any}
 */
export function stringToArray (str) {
  return typeof str === 'string' ? str.match(/[^\s,]+/g) || [] : [str];
}

/**
 * [reject 从数组中删元素，支持数组]
 */
export function reject (arr, args) {
  let array = [];
  // arr = typeof arr === 'string' ? this.stringToArray(arr) : (!this.isArrayLike(arr) ? [arr] : arr);
  if (typeof arr === 'string') {
    arr = this.stringToArray(arr);
  } else if (!this.isArrayLike(arr)) {
    arr = [arr];
  }
  // args = typeof args === 'string' ? this.stringToArray(args) : (!this.isArrayLike(args) ? [args] : args);
  if (typeof args === 'string') {
    args = this.stringToArray(args);
  } else if (!this.isArrayLike(args)) {
    args = [args];
  }  
  Elf.each(arr, function (item) {
    if (!Elf.isInArray(item, args)) {
      array.push(item);
    }
  });
  return array;
}

/**
 * [concat 合并数组并去重，支持String]
 * @param  {[type]} a1 [description]
 * @param  {[type]} a2 [description]
 * @return {[type]}    [返回数组]
 */
export function concat (a1, a2) {
  return Array.prototype.concat(a1, a2);
}

/**
 * 数组去重
 * @param arr
 * @param key
 * @return {*}
 */
export function duplicate (arr, key) {
  //
  if (!this.isArray(arr) || arr.length < 1) {
    return arr;
  }
  if (key) {
    let obj = {};
    return arr.reduce((cur, next) => {
      if (!obj[next[key]]) {
        obj[next[key]] = next[key];
        cur.push(next);
      }
      return cur;
    }, []);
  } else {
    return Array.from(new Set(arr));
  }
}

/**
 * 排序
 * @param arr 排序的数据
 * @param order 排序方式 default :ASC升序 [ASC,DESC] 【升序，降序】
 * @param by 根据具体字段排序
 */
export function sort (arr, by = null, order = 'ASC') {
  Array.prototype.sort.call(arr, function (a, b) {
    if (order.toUpperCase() === 'ASC') {
      return by ? a[by] - b[by] : a - b;
    } else {
      return by ? b[by] - a[by] : b - a;
    }
  });
}

/**
 * 为El添加类名，支持列表"a b c"
 * @param el
 * @param names
 */
export function addClass (el, names) {
  let classList;
  classList = !!el.className ? el.className.split(' ') : [];
  classList = this.concat(classList, this.stringToArray(names));
  el.className = classList.join(' ');
  return el;
}

/**
 * 删除el类名
 * @param el
 * @param names
 * @return {{nodeType}|Object}
 */
export function removeClass (el, names) {
  if (el && this.isHtmlElement(el)) {
    let classList = '';
    classList = !!el.className ? el.className.split(' ') : [];
    classList = Elf.reject(classList, names);
    el.className = classList.join(' ');
  }
  return el;
}

/**
 * 切换class
 * @param el
 * @param name
 */
export function toggleClass (el, name) {
  if (this.hasClass(el, name)) {
    this.removeClass(el, name);
  } else {
    this.addClass(el, name);
  }
}

/**
 * 设置元素属性或attribute支持自定义属性
 * @param el
 * @param props
 */
export function properties (el, props) {
  this.iterate(props, function (key, obj) {
    if (typeof el[key] === 'string') {
      el[key] = obj;
    } else {
      el.setAttribute(key, obj);
    }
  });
}

/**
 * 设置或读取属性值操作
 * @param el
 * @param name
 * @param value
 */
export function attr (el, name, value) {
  if (el && name) {
    if (typeof value !== 'undefined') {
      if (el.nodeType) {
        el.setAttribute(name, value);
      } else {
        el[name] = value;
      }
      return el;
    } else {
      return el.attributes && el.attributes[name] ? el.attributes[name].value : el[name] || '';
    }
  } else {
    // throw {
    //   code: 'error',
    //   msg: '对象或属性名称不能为空！'
    // };
    throw new Error("对象或属性名称不能为空！");
  }
}

/**
 * 删除元素的属性
 * @param el
 * @param name
 */
export function removeAttr (el, name) {
  return el.removeAttribute(name);
}

/**
 * 判断el是否有某类名
 */
export function hasClass (el, name) {
  let classList = !!el.className ? el.className.split(' ') : [], item;
  for (item in classList) {
    if (clazz[item] === name) {
      return true;
    }
  }
  return false;
}


/**
 * 添加子元素
 * @param el
 * @param child
 * @return {void|Node|ActiveX.IXMLDOMNode}
 */
export function append (el, child) {
  return el.appendChild(child);
}

/**
 * 添加到父元素
 * @param el
 * @param parent
 * @return {*}
 */
export function appendTo (el, parent) {
  parent.appendChild(el);
  return el;
}

/**
 * 在第一个位置添加子元素
 * @param el: not null
 * @param child: not null
 * @param target 相对位置
 * @return {*}
 */
export function prepend (el, child, target) {
  target = target || el.children[0];
  if (target) {
    return el.insertBefore(child, target);
  } else {
    return el.appendChild(child);
  }
}

/**
 * 添加到父元素的第一个位置或者指定位置
 * @param el: not null
 * @param parent: not null
 * @param target
 * @return {*}
 */
export function prependTo (el, parent, target) {
  if (el && parent) {
    target = target || parent.children[0];
    if (target) {
      parent.insertBefore(el, target);
    } else {
      parent.appendChild(el);
    }
    return el;
  } else {
    // throw {
    //   code: 'error',
    //   msg: 'element or parent element is not null!'
    // };
    throw new Error("element or parent element is not null!");
  }
}

/**
 * 生成UUID
 * rfc4122标准生成UUID，len是生成的长度，radix是指定随机范围
 * @param len:默认32
 * @param radix:默认64
 * @return {string}
 */
export function uuid (len = 32, radix = 64) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';// rfc4122 requires these characters
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      // Fill in random data.At i===19 set the high bits of clock sequence as. | per rfc4122, sec. 4.1.5
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

export default {
  createElement
}
