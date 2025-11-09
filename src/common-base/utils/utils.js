/* eslint-disable no-undef */
/**
 * Created by lijianwei on 16/11/18
 * 公共工具库
 */
import IndexedArray from './indexed-array';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
// import dictionary from '../static/dictionary-worker';

function throttle (fn, delay, atLeast) {
  let timer = null;
  let previous = null;
  return function () {
    const now = +new Date();
    if (!previous) previous = now;
    if (atLeast && now - previous > atLeast) {
      fn();
      previous = now;
      clearTimeout(timer);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn();
        previous = null;
      }, delay);
    }
  };
}

function throttle2(fn, wait, immediate = false) {
  let timer;

  return function (...args) {
    const _this = this;
    if (!timer) {
      if (immediate) {
        fn.apply(_this, args);
      }
      // 开始一个新周期
      timer = setTimeout(() => {
        if (!immediate) {
          fn.apply(_this, args);
        }
        // 周期结束
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}

/**
 * 延时处理
 * @param fn
 * @param delay
 * @return {Function}
 */
function debounce (fn, delay) {
  // 定时器，用来 setTimeout
  let timer;
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return () => {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * 延时处理 支持this
 * @param fn
 * @param delay
 * @return {Function}
 */
function debounce2 (fn, delay) {
  // 定时器，用来 setTimeout
  let timer;
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function (...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const _this = this;
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}

/**
 * 判断是否为window
 */
function isWindow (obj) {
  return obj !== null && typeof obj === 'object' && obj === obj.window;
}

/**
 * 判断指定参数是否是一个纯粹的对象
 */
function isPlainObject (obj) {
  let key;
  const class2type = {};
  if (obj === null || obj === undefined || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
    return false;
  }
  if (
    obj.constructor &&
    !class2type.hasOwnProperty.call(obj, 'constructor') &&
    !class2type.hasOwnProperty.call(obj.constructor.prototype || class2type, 'isPrototypeOf')
  ) {
    return false;
  }
  Object.keys(obj);
  return key === undefined || Object.hasOwnProperty.call(obj, key);
}

/**
 * [isHtmlElement 判断是不是HTMLElement对象]
 * @param el
 * @return
 */
function isHtmlElement (el) {
  return el && el.nodeType && /^html[A-Za-z]+element$/.test(type(el));
}

/**
 * 扩展对象
 * 第一个参数为Boolean时，表示是否为深度扩展
 */
function extend () {
  let options;
  let name;
  let src;
  let copy;
  let copyIsArray;
  let clone;
  // eslint-disable-next-line prefer-rest-params
  let target = arguments[0] || {};
  let i = 1;
  const length = arguments.length;
  let deep = false;
  if (typeof target === 'boolean') {
    deep = target;
    // eslint-disable-next-line prefer-rest-params
    target = arguments[i] || {};
    // eslint-disable-next-line no-plusplus
    i++;
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }
  if (i === length) {
    target = this;
    // eslint-disable-next-line no-plusplus
    i--;
  }
  // eslint-disable-next-line no-plusplus
  for (; i < length; i++) {
    // eslint-disable-next-line prefer-rest-params,no-cond-assign
    if ((options = arguments[i]) !== null) {
      // eslint-disable-next-line no-restricted-syntax
      for (name in options) {
        // eslint-disable-next-line no-prototype-builtins
        if (options.hasOwnProperty(name)) {
          src = target[name];
          copy = options[name];
          // 防止死循环
          if (target === copy) {
            // eslint-disable-next-line no-continue
            continue;
          }
          // 递归合并纯对象或数组
          // eslint-disable-next-line no-cond-assign
          if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
  }
  return target;
}

/**
 * 判断是否为空对象
 */
function isEmptyObject (obj) {
  if (obj === null) {
    return true;
  }
  if (isHtmlElement(obj)) {
    return false;
  }
  if (obj instanceof Date) {
    return false;
  }
  return Object.keys(obj).length <= 0;
}

/**
 * 判断是否为空
 */
function isEmpty (obj) {
  let ss;
  if (typeof obj === 'string') {
    ss = trim(obj);
    return !(ss && ss.length > 0);
  } else if (typeof obj === 'object') {
    return isEmptyObject(obj);
  } else if (typeof obj === 'undefined') {
    return true;
  } else if (
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'symbol'
  ) {
    return false;
  } else {
    return obj || false;
  }
}

/**
 * 判断是否为数组对象
 * @param arg
 * @return {*}
 */
function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

/**
 * 判断是否为类数组对象,
 * 所谓"类数组对象"就是一个常规的Object对象，但它和数组对象非常相似：具备length属性，并以0、1、2、3……等数字作为属性名。
 * 不过它毕竟不是数组，没有从数组的原型对象上继承下来的内置方法(例如：push()、 sort()等)。
 */
function isArrayLike (obj) {
  const length = !!obj && typeof obj === 'object' && 'length' in obj && obj.length;
  const utype = type(obj);
  if (utype === 'function' || isWindow(obj)) {
    return false;
  }
  return (
    utype === 'array' ||
    length === 0 ||
    (typeof length === 'number' && length > 0 && length - 1 in obj)
  );
}

/**
 * 判断是否为Json格式字符串
 */
function isJsonString (str) {
  try {
    JSON.parse(str);
    return typeof str === 'string' && /^{.*}$|^\[.*]$/.test(str);
  } catch (e) {
    return false;
  }
}

/**
 * 转换成JSON
 */
function turnJson(str) {
  if( isJsonString(str) ) {
    return JSON.parse(str)
  } else if ( Object.prototype.toString.call(str) === '[object Object]') {
    return str
  }
  return {}
}

function trim (text) {
  return text == null ? '' : (text + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 对象转换为search字符串
 */
function object2search (params) {
  const arr = [];
  let value;
  //let name
  const keys = Object.keys(params);
  keys.forEach(k => {
    value = params[k];
    if (value) {
      arr.push(`${k}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
    }
  });
  return arr.join('&');
}

/**
 * js字符串转换为可执行的
 * @param fn
 * @return {*}
 */
function toFunction (fn) {
  return new Function('return ' + fn)();
}

/**
 * search字符串转换为对象
 */
function search2object (search) {
  const obj = {};
  if (isEmpty(search)) {
    return obj;
  }
  if (/^[?]/.test(search)) {
    search = search.replace('?', '');
  }
  if (!search) {
    return {};
  }
  const arr = search.split('&');
  let tempArr;
  arr.forEach(item => {
    tempArr = item.split('=');
    obj[tempArr[0]] = isJsonString(tempArr[1]) ? JSON.parse(tempArr[1]) : tempArr[1] || '';
  });
  return obj;
}

/**
 * 根据URL和参数创建get方式URL
 * @param isSearch 添加到search位置，默认存在hash时，参数追加到hash后面，除非指定为search位置，只针对合法的url生效
 * @param path
 *  http,https,ftp开始的地址,支持hash参数
 *  接口部分地址 /advertising/add
 * @param obj 参数列表，支持search字符串和object
 */
function makeUrl (path, obj, isSearch) {
  if (obj && typeof obj === 'string') {
    // string 防止输入以?,&开始和结束位置的&的参数列表，并转换为URL参数对象
    obj = search2object(obj.replace(/^[?&]|[&]$/g, ''));
  }
  // path为空直接返回，参数列表为空，直接返回
  if (!path || isEmptyObject(obj)) {
    return path;
  }
  // 匹配合法的url地址，保持原有参数位置，且可以指定参数放置位置
  if (/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/.test(path)) {
    let url = new URL(path);
    let searchParams = getSearchParams(path);
    let hashParams = getHashParams(path);
    if (url.hash && !isSearch) {
      Object.assign(hashParams, obj);
    } else {
      Object.assign(searchParams, obj);
    }
    url.search = !isEmptyObject(searchParams) ? '?' + object2search(searchParams) : '';
    url.hash = url.hash && !isEmptyObject(hashParams) ? url.hash.split('?')[0] + '?' + object2search(hashParams) : url.hash;
    return url.toString();
  } else {
    let params;
    const arr = path.split('?');
    params = arr.length > 1 ? search2object(arr[1]) : {};
    Object.assign(params, obj);
    return !isEmptyObject(params) ? `${arr[0]}?${object2search(params)}` : arr[0];
  }
}

/**
 * 获取元素上偏移量
 */
function getOffsetTop (el, parent) {
  let offsetTop = el.nodeType ? el.offsetTop : 0;
  if (el.offsetParent !== null && el.offsetParent !== parent) {
    offsetTop += getOffsetTop(el.offsetParent, parent);
  }
  return offsetTop;
}

/**
 * 获取元素左偏移量
 */
function getOffsetLeft (el, parent) {
  let left = el.nodeType ? el.offsetLeft : 0;
  if (el.offsetParent != null && el.offsetParent !== parent) {
    left += getOffsetLeft(el.offsetParent, parent);
  }
  return left;
}

/**
 * 获取元素偏移量
 */
function getOffsetParent (el, parent) {
  return {
    x: getOffsetLeft(el, parent),
    y: getOffsetTop(el, parent)
  };
}

/**
 * 返回对象的类型
 * 确定JavaScript内置对象的类型，并返回小写形式的类型名称
 */
function type (obj) {
  return obj === null || obj === undefined
    ? `${obj}`
    : Object.prototype.toString.call(obj).match(/\w+/g)[1].toLowerCase() || 'object';
}

/**
 * 字符串根据规则转换为数组
 * 数组，类数组不转换
 * 其他对象时返回数组，对象作为第一个元素
 */
function toArray (ss) {
  // eslint-disable-next-line no-nested-ternary
  // return typeof ss === 'string' ? (ss || '').match(/[^\s,]+/g) || [] : !isArrayLike(ss) ? [ss] : ss;
  if(typeof ss === 'string') {
    return (ss || '').match(/[^\s,]+/g) || [];
  } else {
    return !isArrayLike(ss) ? [ss] : ss;
  }
}

/**
 * 确定第一个参数在数组中的位置(如果没有找到则返回 -1)
 */
function inArray (elem, arr, i) {
  const newArr = toArray(arr);
  return newArr === null ? -1 : [].indexOf.call(newArr, elem, i);
}

/**
 * 判断元素是否再数组中
 * @returns {boolean}
 */
function isInArray (el, arr, i) {
  return inArray(el, arr, i) >= 0;
}

/**
 * 连接两个数组
 * @param a1
 * @param a2
 * @return {*}
 */
function concat (a1, a2) {
  const a11 = toArray(a1);
  const a22 = toArray(a2);
  a22.forEach(item => {
    a11.push(item);
  });
  return a11;
}

/**
 * 从数组中删元素，支持数组
 */
function reject (arr, args) {
  const array = [];
  const arr1 = toArray(arr);
  const arg = toArray(args);
  arr1.forEach((item, i) => {
    if (!isInArray(arr1[i], arg)) {
      array.push(arr1[i]);
    }
  });
  return array;
}

/**
 * 用于合并两个数组的元素到第一个数组中
 */
function merge (first, second) {
  const len = +second.length;
  let j = 0;
  let i = first.length;
  for (; j < len; j++) {
    first[i++] = second[j];
  }
  first.length = i;
  return first;
}

/**
 * 数组去重
 * @param arr
 * @param key
 * @return {*}
 */
function duplicate (arr, key) {
  if (arr.length < 1 || !isArray(arr)) {
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
function sort (arr, by = null, order = 'ASC') {
  Array.prototype.sort.call(arr, function (a, b) {
    if (order.toUpperCase() === 'ASC') {
      return by ? a[by] - b[by] : a - b;
    } else {
      return by ? b[by] - a[by] : b - a;
    }
  });
}

/**
 * 遍历数组、对象数组(类数组对象)或对象字典
 */
function each (obj, callback, params) {
  let length;
  let i = 0;
  if (isArrayLike(obj)) {
    length = obj.length;
    // eslint-disable-next-line no-plusplus
    for (; i < length; i++) {
      if (callback.call(obj, obj[i], i, params) === false) {
        break;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        if (callback.call(obj, obj[i], i, params) === false) {
          break;
        }
      }
    }
  }
  return obj;
}

/**
 * 数组转换为树，
 * key,设置数据关键属性，
 * parentKey 设置数据关联属性
 * 注：调用之前为保险起见，建议对数据进行深度Copy以免影响原数据
 * 如果是key==id并且parentKey==parentId,则不用设置
 */
//function array2tree (array, key, parentKey, parent, level) {
//  key = key || 'id';// 默认为id
//  parentKey = parentKey || 'parentId';// 默认为 parentId
//  const tree = [];
//  let children = [];
//  each(array, item => {
//    let currentItem = {...item};
//    if (parent) {
//      if (currentItem[parentKey] === parent[key]) {
//        children = array2tree(array, key, parentKey, currentItem, level ? level + 1 : null);
//        if (children.length > 0) {
//          currentItem.children = children;
//        }
//        if (level) {
//          currentItem.level = level;
//        }
//        tree.push(currentItem);
//      }
//    } else if (!currentItem[parentKey]) {
//      // 根节点
//      children = array2tree(array, key, parentKey, currentItem, level ? level + 1 : null);
//      if (children.length > 0) {
//        currentItem.children = children;
//      }
//      if (level) {
//        currentItem.level = level;
//      }
//      tree.push(currentItem);
//    }
//  });
//  return tree;
//}

/**
 * 通过索引处理
 * @param array
 * @param key
 * @param parentKey
 * @param parent
 * @param level 级别深度
 * @return {Array}
 */
function array2tree (array, key, parentKey, parent, level) {
  key = key || 'id';
  parentKey = parentKey || 'parentId';
  if (!IndexedArray.prototype.isIndexedArray(array)) {
    array = new IndexedArray(array, [key, parentKey]);
  }
  const tree = [];
  // 根据parentKey获取下级列表
  let roots = IndexedArray.prototype.getByIndex(array, parentKey, parent ? parent[key] : '');

  function doItem (item) {
    let currentItem = {...item};
    let children = array2tree(array, key, parentKey, currentItem, level ? level + 1 : null);
    if (children.length > 0) {
      currentItem.children = children;
    }
    if (level) {
      currentItem.level = level;
    }
    return currentItem;
  }

  // 获取到多个
  if (Array.isArray(roots)) {
    each(roots, item => {
      tree.push(doItem(item));
    });
  } else if (roots) {
    tree.push(doItem(roots));
  }
  return tree;
}

/**
 * 数组转换为双向二叉树，
 * key 关键属性，
 * parentKey 上级标识
 * nameKey 名称关键字
 * 注：调用之前为保险起见，建议对数据进行深度Copy以免影响原数据
 * 如果是key==id并且parentKey==parentId,nameKey==name则不用设置
 */
//function array2BidirectionalTree (array, key, parentKey, nameKey, parent, level) {
//  const tree = [];
//  key = key || 'id'; // 默认为id
//  parentKey = parentKey || 'parentId'; // 默认为 parentId
//  nameKey = nameKey || 'name'; // 默认为name
//  let children = [];
//  each(array, item => {
//    let currentItem = {...item};
//    if (parent) {
//      if (currentItem[parentKey] === parent[key]) {
//        currentItem.parent = deepCopy(parent);
//        currentItem.treeNamePath = parent.treeNamePath + '/' + currentItem[nameKey];
//        currentItem.treePath = parent.treePath + '/' + currentItem[key];
//        children = array2BidirectionalTree(array, key, parentKey, nameKey, currentItem, level ? level + 1 : null);
//        if (children.length > 0) {
//          currentItem.children = children;
//        }
//        if (level) {
//          currentItem.level = level;
//        }
//        tree.push(currentItem);
//      }
//    } else if (!currentItem[parentKey]) {
//      // 根节点
//      currentItem.parent = null;
//      currentItem.treeNamePath = currentItem[nameKey];
//      currentItem.treePath = currentItem[key];
//      // eslint-disable-next-line no-param-reassign
//      children = array2BidirectionalTree(array, key, parentKey, nameKey, currentItem, level ? level + 1 : null);
//      if (children.length > 0) {
//        currentItem.children = children;
//      }
//      if (level) {
//        currentItem.level = level;
//      }
//      tree.push(currentItem);
//    }
//  });
//  return tree;
//}
function array2BidirectionalTree (array, key, parentKey, nameKey, parent) {
  key = key || 'id'; // 默认为id
  parentKey = parentKey || 'parentId'; // 默认为 parentId
  nameKey = nameKey || 'name'; // 默认为name
  if (!IndexedArray.prototype.isIndexedArray(array)) {
    array = new IndexedArray(array, [key, parentKey]);
  }
  const tree = [];
  let children = [];
  let search = parent ? parent[key] : '';
  let roots = IndexedArray.prototype.getByIndex(array, parentKey, search);

  function doItem (item, parent) {
    let currentItem = {...item};
    if (parent) {
      currentItem.parent = {...parent};
      currentItem.treeNamePath = parent.treeNamePath + '/' + currentItem[nameKey];
      currentItem.treePath = parent.treePath + '/' + currentItem[key];
    } else {
      currentItem.parent = null;
      currentItem.treeNamePath = currentItem[nameKey];
      currentItem.treePath = currentItem[key];
    }
    children = array2BidirectionalTree(array, key, parentKey, nameKey, currentItem);
    if (children.length > 0) {
      currentItem.children = children;
    }
    return currentItem;
  }

  // 获取到多个
  if (Array.isArray(roots)) {
    each(roots, item => {
      tree.push(doItem(item, parent));
    });
  } else if (roots) {
    tree.push(doItem(roots, parent));
  }
  return tree;
}

/**
 * 树转换为数组，
 * key,设置数据关键属性，
 * parentKey 设置数据关联属性
 * 注：调用之前为保险起见，建议对数据进行深度Copy以免影响原数据
 * 如果是key==id并且parentKey==parentId,则不用设置
 */
function tree2array (data, key = 'id', parentKey = 'parentId', parent = null) {
  let children = [];
  let arr = [];
  let childrenArr = [];
  let treeData = deepCopy(data);
  while (treeData.length > 0) {
    let treeItem = treeData[0];
    children = treeItem.children;
    if (typeof children !== 'undefined') {
      delete treeItem.children;
    }
    // 设置关系
    if (parent) {
      treeItem[parentKey] = parent[key];
    } else {
      treeItem[parentKey] = '';
    }
    arr.push(treeItem);
    // 处理子节点
    if (children && children.length > 0) {
      childrenArr = tree2array(children, key, parentKey, treeItem);
    }
    arr = concat(arr, childrenArr);
    treeItem.splice(0, 1); // 删除节点
  }
  return arr;
}

/**
 * 树型数据排序
 * @param data
 * @param by
 * @param order
 */
function sortTree (data, by, order = 'ASC') {
  sort(data, by, order);
  for (let item of data) {
    if (item.children && item.children.length > 0) {
      sortTree(item.children, by, order);
    }
  }
}

/**
 * 树转换为流式数组
 * @param treeData
 * @param parents
 * @param key
 * @param parentKey
 * @param _arr
 * @return {*}
 */
function tree2flowArray (treeData, key = 'id', parentKey = 'parentId', parents = [], _arr = []) {
  let i = 0;
  let l = treeData.length;
  for (; i < l; i++) {
    let item = deepCopy(treeData[i]);
    let children = item.children;
    if (typeof children !== 'undefined') {
      delete item.children;
    }
    if (children && children.length > 0) {
      tree2flowArray(children, key, parentKey, Array.prototype.concat([], parents, [item]), _arr);
    } else {
      _arr.push(Array.prototype.concat([], parents, [item]));
    }
  }
  return _arr;
}

/**
 * 树转换为流式数组
 * @param arrayData
 * @param key
 * @return
 */
function createIndex (arrayData, key = 'id') {
  let i = 0;
  let l = arrayData.length;
  let index = {};
  for (; i < l; i++) {
    let item = arrayData[i];
    let children = item.children;
    index[item[key]] = item;
    if (children && children.length > 0) {
      let childrenIndex = createIndex(children, key);
      index = Object.assign(index, childrenIndex);
    }
  }
  return index;
}

/**
 * Formdata >> Json
 */
function formdata2json (formdata) {
  let json = {};

  for (let key of formdata.keys()) {
    json[key] = formdata.get(key);
  }
  return json;
}

/**
 * 设置属性或读取属性值
 */
function attr (el, name, value) {
  if (el && name) {
    if (typeof value !== 'undefined') {
      if (el.nodeType) {
        el.setAttribute(name, value);
      } else {
        // eslint-disable-next-line no-param-reassign
        el[name] = value;
      }
      return el;
    }
    return el.attributes && el.attributes[name] ? el.attributes[name].value : el[name] || '';
  }
  return el;
}

/**
 * [deepCopy 深度复制对象,copy一个对象生成一个新对象]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
//function deepCopy (arr) {
//  if (typeof arr !== 'object') {
//    return arr;
//  }
//  let temp = arr instanceof Array ? [] : {}, item;
//  for (item in arr) {
//    if (arr.hasOwnProperty(item)) {
//      temp[item] = Array.isArray(arr[item]) || isPlainObject(arr[item]) ? deepCopy(arr[item]) : arr[item];
//    }
//  }
//  return temp;
//}

/**
 * [deepCopy 深度复制对象,copy一个对象生成一个新对象]
 * @param  {[type]} source
 * @return {[type]}     
 */
function deepCopy (source, map = new WeakMap()) {
  // 原代码先保留：2025-08-24
  // if (typeof arr !== 'object') {
  //   return arr;
  // }
  // return JSON.parse(JSON.stringify(arr));

  // 处理原始类型 和 Function（直接返回）
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // 处理循环引用
  if (map.has(source)) {
    return map.get(source);
  }

  // 处理 Date 和 RegExp 对象
  if (source instanceof Date) {
    return new Date(source);
  }
  if (source instanceof RegExp) {
    return new RegExp(source);
  }

  // 创建新对象或数组
  const target = Array.isArray(source) ? [] : {};

  // 将当前对象存入 WeakMap，用于后续循环引用检查
  map.set(source, target);

  // 递归拷贝所有属性（包括Symbol键）
  const keys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)];
  for (let key of keys) {
    target[key] = deepCopy(source[key], map);
  }

  return target;
}

/**
 * 获取style
 *
 */
function getStyle (el, name) {
  if (el && el.hasOwnProperty('currentStyle')) {
    let val = el.currentStyle[name];
    if (name === 'height' && val.search(/px/i) !== 1) {
      let rect = el.getBoundingClientRect();
      return rect.bottom - rect.top -
        parseFloat(getStyle(el, 'paddingTop')) -
        parseFloat(getStyle(el, 'paddingBottom')) + 'px';
    }
    return val;
  } else {
    return getComputedStyle(el, null)[name];
  }
}

/**
 * el 添加类名
 */
function addClass (el, names) {
  let classList = '';
  if (el.nodeType) {
    classList = el.className ? el.className.split(' ') : [];
    classList = Array.from(new Set(concat(classList, names)));
    // eslint-disable-next-line no-param-reassign
    el.className = classList.join(' ');
  } else if (isArrayLike(el)) {
    return each(el, _el => {
      addClass(_el, names);
    });
  }
  return el;
}

/**
 * 删除el 类名
 */
function removeClass (el, names) {
  let classList;
  if (el.length) {
    each(el, obj => {
      classList = obj.className ? obj.className.split(' ') : [];
      classList = reject(classList, names);
      // eslint-disable-next-line no-param-reassign
      obj.className = classList.join(' ');
    });
  } else {
    classList = el.className ? el.className.split(' ') : [];
    classList = reject(classList, names);
    // eslint-disable-next-line no-param-reassign
    el.className = classList.join(' ');
  }
  return el;
}

/**
 * 判断el是否有某类名
 * 暂不支持判断多个类名
 */
function hasClass (el, names) {
  const clazz = el.className ? el.className.split(' ') : [];
  for (let o in clazz) {
    if (clazz.hasOwnProperty(o) && clazz[o] === names) {
      return true;
    }
  }
  return false;
}

/**
 * 禁用滚动条
 * 禁用body滚动条
 */
const allowLockScroll = () => {
  document.body.style.overflow = 'hidden';
  // document.addEventListener("touchmove", lockScroll,{ passive: false })//禁止页面滑动
};

/**
 * 取消禁用滚动条
 * 取消禁用body滚动条
 */
const disableLockScroll = () => {
  document.body.style.overflow = '';
  // document.removeEventListener("touchmove", lockScroll,{ passive: false })//取消禁止页面滑动
};

/***********************************************************
 格式化时间格式，用于评论时间，以分钟为单位的时间
 param format
 yyyy-MM-dd hh:mm:ss
 yyyy-MM-dd hh:mm:ss:S
 yyyy年MM月dd日 PP hh小时mm分ss秒
 yyyy年MM月dd日
 MM/dd/yyyy
 yyyyMMdd
 yyyy-MM-dd hh:mm:ss
 yyyy.MM.dd hh:mm
 ***********************************************************/
function formatDate (timestamp, format) {
  if (!timestamp) {
    return timestamp;
  }
  format = format || 'yyyy-MM-dd hh:mm:ss';
  let realDate = '';
  if (typeof timestamp === 'string') {
    // 判断timestamp是否有毫秒，如果有的话，把毫秒去掉
    const regex = /\.\d{1,3}$/;
    if(regex.test(timestamp)) {
      timestamp = timestamp.replace(/\.\d{1,3}/, '');
    }
    if (new Date(timestamp) + '' != 'Invalid Date') {
      realDate = new Date(timestamp);
    } else if (new Date(timestamp.replace(/-/g, '/')) + '' != 'Invalid Date') {
      realDate = new Date(timestamp.replace(/-/g, '/'));
    } else {
      return '';
    }
  } else {
    realDate = new Date(timestamp);
  }
  let o = {
    'M+': realDate.getMonth() + 1,
    'd+': realDate.getDate(),
    'h+': realDate.getHours(),
    'm+': realDate.getMinutes(),
    's+': realDate.getSeconds(),
    'q+': Math.floor((realDate.getMonth() + 3) / 3),
    'S': realDate.getMilliseconds(),
    'P+': realDate.getHours() > 12 ? '下午' : '上午' // 支持上午，下午
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (realDate.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
}

/**
 * 格式化空
 */
function formatEmpty (ss, format) {
  if (ss === null || ss === undefined || ss === '') {
    return format;
  }
  return ss;
}

/**
 * 格式化钱
 * 无法识别为数字,null,undefined,空字符串等返回原始值
 * @param num 数字钱数单位为分
 * @param type 转换方法
 * @param figure 保留小数位数
 */
function formatMoney (num, type, figure) {
  if (!/^[+-]?\d+(.\d+)?([eE][+-]?\d+)?$/.test(num)) {
    return num;
  }
  let format = num - 0;
  switch (type) {
    case 'toYuan':
      figure = figure || 0;
      format = (num / 100).toFixed(figure);
      break;
    default:
      break;
  }
  return format;
}

/**
 * 格式化数字:
 * 无法识别为数字,null,undefined,空字符串等返回原始值
 * @param num 数字（支持科学计数法）
 * @param type 转换方法
 * @param figure 保留小数位数
 */
function formatNumber (num, type, figure) {
  if (!/^[+-]?\d+(.\d+)?([eE][+-]?\d+)?$/.test(num)) {
    return num;
  }
  let format = num - 0;
  switch (type) {
    case 'ceil':
      format = Math.ceil(format);
      break;
    case 'floor':
      format = Math.floor(format);
      break;
    case 'round':
      format = Math.round(format);
      break;
    case 'fixed':
      format = format.toFixed(figure || 0);
      break;
    case 'max':
      format = format > figure ? figure : format;
      break;
    case 'min':
      format = format < figure ? figure : format;
      break;
    default:
      format = format.toFixed(figure || 0);
      break;
  }
  return format;
}

/**
 * 格式性别
 * @param ss
 * @param option 可选项，配置规则，如果不配置根据男单女双规则返回男女
 * @returns {string}
 */
function formatSex (ss, option) {
  if (ss === null || ss === undefined || ss === '') {
    return ss;
  }
  if (option) {
    return option[ss];
  } else {
    ss = ss - 0;
    return ss % 2 === 0 ? '女' : '男';
  }
}

/**
 * 转换为大写模式
 */
function toUpperCase (ss) {
  if (ss === null || ss === undefined || ss === '') {
    return ss;
  }
  return ss.toString().toLocaleUpperCase();
}

/**
 * 小写模式
 */
function toLowerCase (ss) {
  if (ss === null || ss === undefined || ss === '') {
    return ss;
  }
  return ss.toString().toLocaleLowerCase();
}

/**
 * textarea 自动高度
 */
function autoHeightTextArea (target) {
  if (!target) {
    return;
  }
  let height;
  let padding = 0;
  let style = target.style;
  let minHeight = parseFloat(getStyle(target, 'min-height'));
  target.style.height = minHeight + 'px';
  if (target.scrollHeight > minHeight) {
    height = target.scrollHeight - padding;
    style.overflowY = 'hidden';
    style.height = height + 'px';
    target.currHeight = parseInt(style.height);
  }
}

/**
 * [getScrollingElement 获取滚动对象]
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
function getScrollingElement (el) {
  let parent = el;
  while (parent) {
    if (parent === document.scrollingElement || parent === document.body) {
      break;
    }
    if (parent.offsetHeight < parent.scrollHeight) {
      break;
    }
    parent = parent.parentNode;
  }
  return parent || document.scrollingElement || document.body;
}

/**
 * 生成UUID
 * @param len
 * @param radix
 * @return {string}
 * @constructor
 */
function UUID (len, radix = 62) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [];
  if (len) {
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.length > 0 ? uuid.join('') : '';
}

/**
 * 生成序列号
 * @return {string}
 */
function getSerialNumber () {
  return formatDate(new Date(), 'yyyyMMddhhmmssS') + UUID(3, 8);
}

/**
 * 获取满足条件最近的上级元素（含自身）
 * @param el
 * @param selector
 * @param context
 * @return {*}
 */
function closest (el, selector, context = document.body) {
  //context = context || document.body
  let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el && el !== context) {
    if (matchesSelector.call(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}

/**
 * 编码
 */
function encode (s) {
  return encodeURIComponent(s).replace(/'/g, '%27').replace(/"/g, '%22');
}

/**
 * 解码
 */
function decode (s) {
  return decodeURIComponent(s.replace(/\+/g, ' '));
}

/**
 * base64加密
 */
function encodeBase64 (s) {
  return window.btoa(encodeURIComponent(s));
}

/**
 * base64解密
 */
function decodeBase64 (s) {
  try {
    return decodeURIComponent(window.atob(s));
  } catch (e) {
    return s;
  }
}

/**
 * 设置cookie
 * @param name
 * @param value
 * @param path
 * @param domain
 * @param time
 * @return {string}
 */
function setCookie (name, value, path, domain, time) {
  let arr = [];
  let now = new Date();
  arr.push(name + '=' + value);
  if (path) {
    arr.push('path=' + path);
  }
  if (domain) {
    arr.push('domain=' + domain);
  }
  if (time !== null || time !== undefined) {
    now.setTime(now.getTime() + time);
    arr.push('expires=' + now.toUTCString());
  }
  document.cookie = arr.join(';');
}

/**
 * 获取指定cookie
 * @param name
 * @return {*}
 */
function getCookie (name) {
  let cookies = getCookies();
  return cookies[name];
}

/**
 * 获取cookies
 */
function getCookies () {
  let cookies = decodeURIComponent(document.cookie).split(';');
  let result = {};
  for (let i = 0; i < cookies.length; i++) {
    let c = trim(cookies[i]);
    let cookie = c.split('=');
    let ck = trim(cookie.shift());
    let cv = trim(Array.prototype.join.call(cookie, '='));
    if (ck && cv) {
      result[ck] = cv;
    }
  }
  return result;
}

/**
 * 删除cookie
 * @param name,
 * @param path
 * @param domain
 */
function deleteCookie (name, path, domain) {
  return setCookie(name, '', path, domain, -1);
}

/**
 * 数组去重
 */
export function arrayWeightRemoval (_arr) {
  return _arr.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

/**
 * 数组对象去重
 */
function objectDeDuplication (array) {
  if (!(array instanceof Array)) {
    return -1;
  }
  let newArr = [];
  let duplicates = []; // 记录已比较过得重复项下标
  for (let i = 0; i < array.length; i++) {
    if (i && duplicates.indexOf(i) > -1) {
      continue;
    }
    for (let j = i + 1; j < array.length; j++) {
      if (_compareObj(array[i], array[j])) {
        duplicates.push(j);
      }
    }
    newArr.push(array[i]);
  }
  return newArr;

  function _compareObj (a, b) {
    let keysA = Object.keys(a);
    let keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    let isSame = true;
    keysA.forEach(function (v) {
      if (b[v] !== a[v]) {
        isSame = false;
      }
    });
    return isSame;
  }
}

/**
 * 不刷新界面设置当前路由浏览器url参数
 * @param {object} data
 */
function setUrlArgs (data) {
  let url = data.url ? data.url : window.location.origin + window.location.pathname + window.location.hash.split('?')[0] + '?';
  const oldArgs = getUrlArgs();
  const args = {
    ...oldArgs,
    ...data
  };
  if (!data.url) {
    for (const key in args) {
      if (key !== url) {
        url += key + '=' + args[key] + '&';
      }
    }
    url = url.substring(0, url.lastIndexOf('&'));
  }
  history.replaceState(null, null, url);
}

/**
 * 清空当前路由浏览器url参数
 */
function clearUrlArgs () {
  let moduleCode = getUrlArgs('moduleCode') || null;
  let appName = getUrlArgs('appName') || null;
  let src = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
  let param = '?';
  // param = moduleCode ? param + `${param !== '?' ? '&' : ''}moduleCode=${moduleCode}` : param;
  if(moduleCode) {
    param = param + `${param !== '?' ? '&' : ''}moduleCode=${moduleCode}`;
  }
  // param = appName ? param + `${param !== '?' ? '&' : ''}appName=${appName}` : param;
  if(appName) {
    param = param + `${param !== '?' ? '&' : ''}appName=${appName}`;
  }
  src = param !== '?' ? src + param : src;
  history.replaceState(null, null, src);
}

function getUrlArgs (key) {
  const args = {};
  let argsStr = (window.location.hash ? window.location.hash : window.location.search).split('?')[1];
  if (argsStr) {
    argsStr = argsStr.replace(/&&/g, '&');
    argsStr = argsStr.replace(/&&&/g, '&');
    if (argsStr) {
      [...argsStr.split('&')].forEach(i => {
        args[i.split('=')[0]] = i.split('=')[1];
      });
    }
    if (key) {
      return args[key] ? args[key] : null;
    }
  }
  return args;
}

/**
 * RGB色转换为HEX色值 todo
 * @param color
 * @return {string}
 */
function rgb2hex (color) {
  // RGB颜色值的正则
  let reg = /^(rgb|RGB)/;
  if (reg.test(color)) {
    let strHex = '#';
    // 把RGB的3个数值变成数组
    let colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16);
      if (hex === '0') {
        hex += hex;
      }
      strHex += hex;
    }
    return strHex;
  } else {
    return String(color);
  }
}

/**
 * hex色转换为rgb色 todo
 * @param color
 * @return {*}
 */
function hex2rgb (color) {
  // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  color = color.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    let i;
    if (color.length === 4) {
      let colorNew = '#';
      for (i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    let colorChange = [];
    for (i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }
    return 'RGB(' + colorChange.join(',') + ')';
  } else {
    return color;
  }
}

/**
 * cmyk色转换为RGB色 todo
 * @param c
 * @param m
 * @param y
 * @param k
 * @return {string}
 */
function cmyk2Rgb (c, m, y, k) {
  c = c / 100;
  m = m / 100;
  y = y / 100;
  k = k / 100;

  let r = Math.round((1 - Math.min(1, c * (1 - k) + k)) * 255);
  let g = Math.round((1 - Math.min(1, m * (1 - k) + k)) * 255);
  let b = Math.round((1 - Math.min(1, y * (1 - k) + k)) * 255);

  //result.r = Math.round( result.r * 255 );
  //result.g = Math.round( result.g * 255 );
  //result.b = Math.round( result.b * 255 );
  //return result;
  //function padZero (str) {
  //  return '000000'.substr(str.length) + str;
  //}
  //
  //let cyan = (c * 255 * (1 - k)) << 16;
  //let magenta = (m * 255 * (1 - k)) << 8;
  //let yellow = (y * 255 * (1 - k)) >> 0;
  //
  //let black = 255 * (1 - k);
  //let white = black | black << 8 | black << 16;
  //
  //let color = white - (cyan | magenta | yellow);

  return 'RGB(' + r + ',' + g + ',' + b + ')';
}

/**
 * 数字单位转换
 */
function numberFormat (value) {
  const param = {};
  let k = 10000,
    sizes = ['', '万', '亿', '万亿'],
    i;
  if (value < k) {
    param.value = value.toFixed(5).slice(0, -1);
    param.unit = '';
  } else {
    i = Math.floor((Math.log(value) / Math.log(k)));
    param.value = ((value / Math.pow(k, i))).toFixed(5).slice(0, -1);
    param.unit = sizes[i];
  }
  return param;
}

/**
 * 转换匹配的版本地址
 * @param url 跳转地址
 * @param versions 版本列表（local_path，App本地根路径）
 * @param basePathName
 * @return {*}
 */
function transformationMachedVersion (url, versions, basePathName) {
  basePathName = basePathName || '/index.html';
  let version = getVersionConfig(versions, url);
  if (version) {
    let origin = version.webapp_url;
    let originRegStr = '^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.');
    let pathname;
    // ios, mac software_type字段丢失，改为根据域名判断
    //if (version.software_type === '3') {
    if (/^http[s]?:\/\/resources\.lonch\.com\.cn/.test(origin)) {
      pathname = basePathName;
      let localPath = version.local_path ? version.local_path : origin;
      return localPath + pathname;
    } else {
      pathname = version.version ? '/' + version.version + basePathName : basePathName;
      let versionedPathName = (version.local_path ? version.local_path : origin) + pathname;
      // 切换版本入口
      let re = new RegExp(originRegStr + '(\\/v\\d+\\.\\d+\\.\\d+)?\\/(index\\.html)?');
      return url.replace(re, versionedPathName);
    }
  } else {
    return url;
  }
}

/**
 * 获取匹配的版本配置
 * @param versions
 * @param url
 * @return {*}
 */
function getVersionConfig (versions, url) {
  url = url || window.location.href;
  for (let i = 0, l = versions.length; i < l; i++) {
    let version = versions[i];
    let origin = version.webapp_url;
    let localPath = version.local_path;
    let localPathRegStr = localPath ? '^' + localPath.replace(/\//g, '\\\/').replace(/[.]/g, '\\.') : '';
    let localPathRegExp = localPath ? new RegExp(localPathRegStr) : '';
    let originRegStr = '^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.');
    let originRegExp = new RegExp(originRegStr);
    //if (version.software_type === '3') {
    if (/^http[s]?:\/\/resources\.lonch\.com\.cn/.test(origin)) {
      // 公共资源域名相同，不使用版本号
      if (origin === url) {
        return version;
      }
    } else if (originRegExp.test(url)) {
      return version;
    } else if (localPathRegExp && localPathRegExp.test(url)) {
      return version;
    }
  }
  return null;
}

/**
 * 获取模块配置
 * @param modules
 * @param name
 * @return {Array}
 */
function getServiceModuleConfigByName (modules, name) {
  let matchs = matchedDataX(modules, 'name', name);
  return matchs.length === 1 ? matchs[0] : matchs;
}

/**
 * Url转换为分享地址,并删除token参数
 * @param url App 本地地址
 * @param versions 版本列表（local_path，App本地根路径）
 * @return {*}
 * 注：没有版本控制的不处理，特别主要window端安装中文路径、路径文件夹名称带有控制等情况,
 */
function url2sharePathByMachedVersion (url, versions) {
  for (let i = 0, l = versions.length; i < l; i++) {
    let version = versions[i];
    let localPath = version.local_path;
    let origin = version.webapp_url;
    let localPathRegStr = localPath ? '^' + localPath.replace(/\//g, '\\\/').replace(/[.]/g, '\\.') : '';
    let localPathRegExp = localPath ? new RegExp(localPathRegStr) : '';
    // 如果版本存在本地安装路径且使用了本地访问方式
    if (version.local_path && localPathRegExp && localPathRegExp.test(url)) {
      // 这里不带版本号，因为用户点击分享的链接的时候可能版本已经更新
      let originPath = origin + '/index.html';
      let re = new RegExp(localPathRegStr + '(\\/v\\d+\\.\\d+\\.\\d+)?\\/(index\\.html)?');
      url = url.replace(re, originPath);
      break;
    } else if (origin && new RegExp('^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.')).test(url)) {
      // 如果没有App本地地址，则去除版本号
      url = url.replace(/\/v\d+\.\d+\.\d+/, '');
      break;
    }
  }
  url = removeParam('token', url);
  url = makeUrl(url, {_f: 'share'});
  return url;
}

/**
 * 设置search位置参数
 * @param params
 * @param path
 * @return {string}
 */
function setSearchParams (params, path) {
  path = path || window.location.href;
  let url = new URL(path);
  let search = Object.assign(url.search ? search2object(search) : {}, params);
  url.search = object2search(search);
  return url.toString();
}

/**
 * 获取search参数列表
 */
function getSearchParams (path) {
  path = path || window.location.href;
  let url = new URL(path);
  let search = url.search ? url.search : '';
  return search2object(search);
}

/**
 * 获取hash
 */
function getHashParams (path) {
  path = path || window.location.href;
  let url = new URL(path);
  let hash = url.hash ? url.hash : '';
  return hash.indexOf('?') > 0 ? search2object(hash.substring(hash.indexOf('?') + 1)) : {};
}

/**
 * 获取hash和search位置的参数列表，并合并，优先取hash
 */
function getParams (path) {
  path = path || window.location.href;
  let searchParams = getSearchParams(path);
  let hashParams = getHashParams(path);
  return Object.assign(searchParams, hashParams);
}

/**
 * 获取hash和search位置的参数列表，并合并，优先取hash
 */
function getParam (param, path) {
  let params = getParams(path);
  return params[param];
}

/**
 * 获取模块编码，路由配置优先
 * @return {*}
 */
function getModuleCode () {
  //return window.vm && window.vm.$route && window.vm.$route.meta && window.vm.$route.meta.moduleCode ?
  // window.vm.$route.meta.moduleCode : getParam('moduleCode');
  return getParam('moduleCode');
}

/**
 * 删除url的参数
 * @param param
 * @param path
 * @return {*}
 */
function removeParam (param, path) {
  path = path || window.location.href;
  if (path.indexOf(param) <= 0) {
    return path;
  }
  let url = new URL(path);
  let hashParams = getHashParams(path);
  let searchParams = getSearchParams(path);
  if (searchParams.hasOwnProperty(param)) {
    delete searchParams[param];
  }
  if (hashParams.hasOwnProperty(param)) {
    delete hashParams[param];
  }
  let sreachString = object2search(searchParams);
  // let hashPath = url.hash ? url.hash.substring(0, url.hash.indexOf('?') > 0 ? url.hash.indexOf('?') : url.hash.length) : '';
  // 20241220优化sonar
  let hashPath = '';
  if (url.hash) {
    const queryIndex = url.hash.indexOf('?');
    if (queryIndex > 0) {
      hashPath = url.hash.substring(0, queryIndex);
    } else {
      hashPath = url.hash;
    }
  }
  let hashQueryString = object2search(hashParams);
  url.hash = hashQueryString ? hashPath + '?' + object2search(hashParams) : hashPath;
  url.search = sreachString ? '?' + sreachString : '';
  return url.toString();
}

/**
 * 根据关键字匹配
 * @param arr 支持一维数组和树形数据
 * @param prop 匹配的字段
 * @param keyword 搜索的关键字
 * @param isExact 是否精确匹配，默认false
 * @return {Array}
 */
function matchedData (arr, prop, keyword, isExact = false) {
  let matched = [];
  let regExp = isExact ? new RegExp('^' + keyword + '$') : new RegExp(keyword, 'i');
  arr.forEach(function (item) {
    if (regExp.test(item[prop])) {
      // 匹配本级菜单
      matched.push(item);
    } else if (item.children && item.children.length > 0) {
      // 不匹配本级菜单，检查是否匹配子菜单
      let matchedChildren = matchedData(item.children, prop, keyword, isExact);
      if (matchedChildren.length > 0) {
        item.children = matchedChildren;
        matched.push(item);
      }
    }
  });
  return matched;
}

/**
 * 根据关键字匹配
 * @param arr 支持一维数组和树形数据
 * @param prop 匹配的字段
 * @param keyword 搜索的关键字，使用通配符规则区分左匹配，右匹配和全匹配规则，通配符为星号（*）
 * @param isExact 是否精确匹配，默认true, left,right
 * @return {Array}
 */
function matchedDataX (arr, prop, keyword, isExact = true) {
  let matched = [];
  if (!arr || arr.length <= 0) {
    return matched;
  }
  let regExp;
  if (/^\*|\*$/.test(keyword)) {
    // isExact = /^\*.*\*$/.test(keyword) ? false : /^\*/.test(keyword) ? 'left' : 'right';
    // 20241226优化sonar
    if (/^\*.*\*$/.test(keyword)) {
      isExact = false;
    } else if (/^\*/.test(keyword)) {
      isExact = 'left';
    } else {
      isExact = 'right';
    }

    keyword = keyword.replace(/^\*|\*$/g, ''); // 清除左右*号
  }
  if (isExact === 'left') {
    regExp = new RegExp(keyword + '$', 'i');
  } else if (isExact === 'right') {
    regExp = new RegExp('^' + keyword, 'i');
  } else {
    regExp = isExact ? new RegExp('^' + keyword + '$') : new RegExp(keyword, 'i');
  }
  arr.forEach(function (item) {
    if (regExp.test(item[prop])) {
      // 匹配本级
      matched.push(item);
    } else if (item.children && item.children.length > 0) {
      // 不匹配本级，检查是否匹配children
      let matchedChildren = matchedDataX(item.children, prop, keyword, isExact);
      if (matchedChildren.length > 0) {
        item.children = matchedChildren;
        matched.push(item);
      }
    }
  });
  return matched;
}

function getFirstMatchedData (arr, prop, keyword) {
  let matched = matchedDataX(arr, prop, keyword);
  return matched && matched.length > 0 ? matched[0] : {};
}

/**
 * 获取数据中具体属性重复的列表，支持树形数据
 */
function getRepeatingItems (arr, prop, props = {}) {
  let result = [];
  for (let item of arr) {
    let propValue = item[prop];
    if (propValue) {
      if (props[propValue]) {
        console.log('===重复==', propValue);
        if (props[propValue].length === 1) {
          // 添加已有重复数据
          result.push(props[propValue][0]);
        }
        props[propValue].push(item);
        result.push(item);
      } else {
        props[propValue] = [item];
      }
    }
    if (item.children && item.children.length > 0) {
      let subResult = getRepeatingItems(item.children, prop, props);
      result = Array.prototype.concat.call(result, subResult);
    }
  }
  return result;
}

/**
 * 获取当前访问项目的版本
 * @return {string}
 */
function getAccessVersion (url) {
  url = url || window.location.href;
  let matchVersions = url.match(/\/v\d+\.\d+\.\d+\//gi) || [];
  return matchVersions.length > 0 ? matchVersions[0].replace(/\//g, '') : '';
}

/**
 * 比较版本号大小 version1>=version2?true:false
 * @param version1
 * @param version2
 */
function compareVersions (version1, version2) {
  if (version1 === version2) {
    return true;
  }
  if (version1 && version2) {
    let va1 = version1.replace(/^v/i, '').split('.');
    let va2 = version2.replace(/^v/i, '').split('.');
    let l = va1.length < va2.length ? va1.length : va2.length;
    let i = 0;
    while (i < l) {
      let v1 = Number(va1[i]);
      let v2 = Number(va2[i]);
      if (i === l - 1 && v1 >= v2) {
        return true;
      } else if (v1 > v2) {
        return true;
      } else if (v1 !== v2) {
        return false;
      }
      i++;
    }
  }
  return false;
}

/**
 * 格式化会计金额
 */
function moneyFormat (number) {
  if (number === '') {
    return;
  }
  number = (number + '').replace(/[^0-9+-Ee.]/g, '').replace(/\,/g, '');
  let n = !isFinite(+number) ? 0 : +number,
    prec = 4, sep = ',', dec = '.',
    toFixedFix = (n, prec) => {
      let k = Math.pow(10, prec);
      return '' + divide(Math.floor(multiply(n, k)), k);
    },
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  let re = /(-?\d+)(\d{3})/;

  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2');
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length - 1).join('0');
  }
  return s.join(dec);
}

function toInteger (floatNum) {
  const ret = {
    times: 1,
    num: 0
  };
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }

  function isInteger (obj) {
    return Math.floor(obj) === obj;
  }

  const strfi = floatNum + '';
  const dotPos = strfi.indexOf('.');
  const len = strfi.substr(dotPos + 1).length;
  const times = Math.pow(10, len);
  const intNum = parseInt(floatNum * times, 10);
  ret.times = times;
  ret.num = intNum;
  return ret;
}

function operation (a, b, op) {
  const o1 = toInteger(a);
  const o2 = toInteger(b);
  const n1 = o1.num;
  const n2 = o2.num;
  const t1 = o1.times;
  const t2 = o2.times;
  const max = t1 > t2 ? t1 : t2;
  let result = null;
  switch (op) {
    case 'add':
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2;
      } else if (t1 > t2) {
        // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2);
      } else {
        // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2;
      }
      return result / max;
    case 'subtract':
      if (t1 === t2) {
        result = n1 - n2;
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2);
      } else {
        result = n1 * (t2 / t1) - n2;
      }
      return result / max;
    case 'multiply':
      result = (n1 * n2) / (t1 * t2);
      return result;
    case 'divide':
      result = (n1 / n2) * (t2 / t1);
      return result;
  }
}

// 加减乘除的四个接口
function add (a, b) {
  return operation(a, b, 'add');
}

function subtract (a, b) {
  return operation(a, b, 'subtract');
}

function multiply (a, b) {
  return operation(a, b, 'multiply');
}

function divide (a, b) {
  return operation(a, b, 'divide');
}

/**
 * 清空null todo
 */
function clearNullProps (obj) {
  let props = {};
  for (let item in obj) {
    let prop = obj[item];
    if (isPlainObject(prop)) {
      props[item] = clearNullProps(prop);
    } else {
      props[item] = prop;
    }
  }
  return props;
}

/**
 * 兼容协议数据处理
 */
function compatibleProtocolData (data, requestHeadersCfg) {
  let result;
  let protocolVersion = requestHeadersCfg && requestHeadersCfg.headers ? requestHeadersCfg.headers['protocol-version'] : '';
  if (protocolVersion === '2.0') {
    result = data.serviceResult || {};
    result.error = data.errorMsg;
    result.code = data.errorCode;
    result.errorMsg = data.errorMsg;
    result.errorCode = data.errorCode;
    if (result.data) {
      result.serviceResult = result.data;
      result.opFlag = result.success;
    }
  } else {
    result = data;
    result.errorMsg = data.error;
    result.errorCode = data.code;
  }
  return result;
}

/**
 * 计算两个字符串的相似度
 * Levenshtein 距离，又称编辑距离，
 * 指的是两个字符串之间，由一个转换成另一个所需的最少编辑操作次数
 * 可以用在 DNA分析、拼字检查、语音辨识、抄袭侦测
 */
function levenshtein (str1, str2) {
  //计算两个字符串的长度。
  let len1 = str1.length;
  let len2 = str2.length;
  //建立上面说的数组，比字符长度大一个空间
  let dif = [];
  //赋初值，步骤B。
  for (let a = 0; a <= len1; a++) {
    dif[a] = [];
    dif[a][0] = a;
  }
  for (let b = 0; b <= len2; b++) {
    dif[0][b] = b;
  }
  //计算两个字符是否一样，计算左上的值
  let temp;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] == str2[j - 1]) {
        temp = 0;
      } else {
        temp = 1;
      }
      //取三个值中最小的
      dif[i][j] = Math.min(dif[i - 1][j - 1] + temp, dif[i][j - 1] + 1, dif[i - 1][j] + 1);
    }
  }
  //取数组右下角的值，同样不同位置代表不同字符串的比较
  return dif[len1][len2];
}

/**
 * 计算两个字符串的相似度
 * @param str1
 * @param str2
 */
function similarity (str1 = '', str2 = '') {
  let dif = levenshtein(str1, str2);
  return 1 - dif / Math.max(str1.length, str2.length);
}

/**
 * 获取客户端IP地址
 * @return {string}
 */
function getClientIp () {
  let ip = window.hasOwnProperty('returnCitySN') && window.returnCitySN.hasOwnProperty('cip') ? window.returnCitySN.cip : window.ip;
  return ip === '127.0.0.1' ? '0.0.0.0' : ip;
}

function getIpAddress (vm, url) {
  if (!url) {
    return;
  }
  return new Promise((resolve, reject) => {
    vm.API.send(url, {}, (res) => {
      res = res.data;
      resolve(res);
    }, (error) => {
      reject(error);
      vm.$toast({text: '网络异常'});
    }, vm);
  });
}

/**
 * 获取LocalStorage剩余可存储大小
 * 根据localStorage最大缓存5M进行计算
 */
/*
function getLocalStorageLeftSize () {
  let size = 0;
  for (let key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      size += window.localStorage.getItem(key).length;
    }
  }
  return 5 * 1024 * 1024 - size;
}
*/

/**
 * 根据key获取对象下的模糊节点值
 * 例如：{a: {b:{c:1}}} key = .a.b.c
 * @param key 取值使用的key
 * @param data 取值目标对象
 * @return {*}
 */
function getDataVal (key, data) {
  let keys = key.split('.');
  let val = data;
  keys.forEach(k => {
    if (k && val && typeof val === 'object') {
      val = val[k];
    }
  });
  return val;
}

/**
 * 生产接口缓存key
 * @param service
 * @param params todo 以后可以增加参数配置规则
 * @returns {string}
 */
function getCacheKey (service, params, cfg) {
  // 防止修改原对象
  let query = typeof params === 'string' ? search2object(params) : Object.assign({}, params);
  if (query.originalDemand || query.demand) {
    query = Object.assign({}, query.originalDemand || query.demand);
  }
  // 去除无意义参数
  if (query.timestamp) {
    delete query.timestamp;
  }
  if (query.ip) {
    delete query.ip;
  }
  let key = service.module + makeUrl(service.url, query);
  if(cfg.projectName === 'angelswings') {
    let cacheStaffCaOrganizeId = cfg && cfg.loginInfo && cfg.loginInfo.staffCaOrganizeId ? `&cacheStaffCaOrganizeId=${cfg.loginInfo.staffCaOrganizeId}` : '';
    let cacheCaHumanId = cfg && cfg.loginInfo && cfg.loginInfo.caHumanId ? `&cacheCaHumanId=${cfg.loginInfo.caHumanId}` : '';
    return key + cacheStaffCaOrganizeId + cacheCaHumanId;
  } else {
    let token = cfg && cfg.token ? `&token=${cfg.token}` : '';
    return key + token;
  }
  
  //return service.module + service.url;
}

/**
 * 加密缓存数据
 */
/*
function encodeCacheData (data, aesKey) {
  let cache = {
    time: new Date().getTime(),
    data: AES.encrypt(JSON.stringify(data), aesKey).toString()
  };
  return JSON.stringify(cache);
}
*/

/*
* 不加密缓存数据
* */
function encodeCacheDataV2 (data) {
  let cache = {
    time: new Date().getTime(),
    data: JSON.stringify(data)
  };
  return JSON.stringify(cache);
}

/**
 * 解密缓存数据
 */
function decodeCacheData (service, cache, aesKey, isOnErrorClear) {
  try {
    let bytes = AES.decrypt(cache.data, aesKey);
    return JSON.parse(bytes.toString(Utf8));
  } catch (e) {
    if (isOnErrorClear) {
      clearCacheData(service);
    }
    return null;
  }
}

function decodeCacheDataV2 (service, params, cache, cfg, context, aesKey, isOnErrorClear) {
  if(cache.data) {
    try {
      const data = JSON.parse(cache.data);
      if(typeof data !== 'object') {
        // console.log('typeof data:::', typeof data);
        throw error();
      }
      // console.log(service.url, ':::可以JSON序列化，这是新的加密格式', data, typeof data);
      return data;
    } catch (e) {
      // console.log(service.url, ':::不能JSON序列化，尝试解密后存储未加密数据');
      // 不能进行JSON序列化，尝试用AES解密，AES解密不了的话，会清除缓存
      const encodeData = decodeCacheData(service, cache, aesKey, isOnErrorClear);
      if(encodeData) {
        // 能解密的话，是AES加密的数据，直接存储解密后的数据
        // console.log('能解密的话，是AES加密的数据，直接将解密后的数据');
        setCache (service, params, encodeData, cfg, context);
      }
    }
  }
}

/**
 * 获取接口缓存数据
 * app支持前端缓存取app缓存数据，否则到localStorage获取
 * @param service
 * @param params
 * @param callback
 * @param context
 */
function getCache (service, params, callback, cfg, context) {
  let key = getCacheKey(service, params, cfg);
  let cacheData = null;
  let cache;
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'getCache'},
      {keys: [key], remain: service.remain || false},
      function (res) {
        cache = JSON.parse(res.serviceResult[key] || null);
        if (cache) {
          cacheData = decodeCacheDataV2(service, params, cache, cfg, context, cfg.aesKey, true);
          callback.call(context, cacheData);
        } else {
          callback.call(context);
        }
      },
      function () {
        callback.call(context);
      },
      context,
      true
    );
  } else {
    // cache = JSON.parse(localStorage.getItem(key) || null);
    let sn = 'INDEXDB' + LonchJsApi.UUID(32, 16);
    window.vm.postMessageWorker({command: 'getCache', data: {code: `${key}`, sn}});
    LonchJsApi.indexDBCallBacks[sn] = function (cache) {
      if (cache) {
        let now = new Date().getTime();
        // 清除登录之前设置等缓存
        // 如果设置过期时间0为不过期,如果过期则清空数据,缓存已失效,清楚同一个接口下所有缓存
        if (cache.time < cfg.loginTime || (cache.expire > 0 && now > cache.time + service.expire)) {
          delectCacheData(key);
        } else {
          // console.log('get form cache:', key);
          cacheData = cache.data;
        }
      }
      if (!isEmpty(cacheData)) {
        callback.call(context, cacheData);
      } else {
        callback.call(context);
      }
      if(sn && LonchJsApi.indexDBCallBacks[sn]) {
        delete LonchJsApi.indexDBCallBacks[sn];
      }
    }
  }
}

/**
 * 设置缓存，app支持前端缓存存储到app，否则存储到localStorage
 * 数据使用AES解密缓存数据
 * @param service
 * @param params
 * @param data
 * @param context
 */
function setCache (service, params, data, cfg, context) {
  let key = getCacheKey(service, params, cfg);
  // let cache = encodeCacheData(data, cfg.aesKey);
  // let cache = encodeCacheDataV2(data);
  // indexDB支持存json格式的数据，所以不用编码了
  // let cache = data;
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'setCache'},
      {key: key, value: encodeCacheDataV2(data), remain: service.remain || false},
      function () {
      },
      function () {
      },
      context,
      true
    );
  } else {
    // 20230510 改缓存到indexDB
    window.vm.postMessageWorker({command: 'setCache', data: {data, code: `${key}`}});
    /*
    let leftSize = getLocalStorageLeftSize();
    console.log('leftSize', leftSize, cache.length)
    if (cache.length < leftSize - 20) {
      localStorage.setItem(key, cache);
    }
    */
  }
}

/**
 * 更新缓存数据,清除同一个接口所有缓存
 * @param service
 */
function clearCacheData (service) {
  for (let key in localStorage) {
    if (key.indexOf(service.url) > 0) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * 根据key获取缓存
 * @param key
 * @param callback
 * @param remain
 */
function getKeyCache(key, callback, remain = false) {
  let cacheData = null;
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'getCache'},
      {keys: [key], remain: remain},
      function (res) {
        let cache = JSON.parse(res.serviceResult[key] || null);
        if (cache) {
          callback(cache);
        } else {
          callback();
        }
      },
      function () {
        callback();
      },
      this,
      true
    );
  } else {
    let sn = 'INDEXDB' + LonchJsApi.UUID(32, 16);
    window.vm.postMessageWorker({command: 'getCache', data: {code: `${key}`, sn}});
    LonchJsApi.indexDBCallBacks[sn] = function (cache) {
      if (cache) {
        cacheData = cache.data;
      }
      if (!isEmpty(cacheData)) {
        callback(cacheData);
      } else {
        callback();
      }
      if(sn && LonchJsApi.indexDBCallBacks[sn]) {
        delete LonchJsApi.indexDBCallBacks[sn];
      }
    }
  }
}

/**
 * 根据key设置缓存
 * @param key
 * @param data
 * @param remain
 */
function setKeyCache(key, data, remain = false) {
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'setCache'},
      {key: key, value: JSON.stringify(data), remain: remain},
      function () {
      },
      function () {
      },
      this,
      true
    );
  } else {
    window.vm.postMessageWorker({command: 'setCache', data: {data, code: `${key}`}});
  }
}

/**
 * 清除缓存
 * @param key
 * @param callBack
 * @param remain
 */
function clearCache(key = null, callBack = null, remain = false) {
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'clearCache'},
      {keys: key, remain: remain},
      function () {
        /**
         * 如果清除完有回调函数，则执行回调函数
         */
        if(callBack && typeof callBack === 'function') {
          callBack();
        }
      },
      function () {},
      this,
      true
    );
  } else {
    window.vm.postMessageWorker({command: 'clearCache', key: `${key}`});
    /**
         * 如果清除完有回调函数，则执行回调函数
         */
    if(callBack && typeof callBack === 'function') {
      callBack();
    }
  }
}

/**
 * 删除指定key的缓存（退出登录、token失效时调用）
 */
function delectCacheData (key) {
  window.vm.postMessageWorker({command: 'delectCache', key: `${key}`});
}
/**
 * 清除所有缓存（退出登录、token失效时调用）
 */
function clearAllCacheData () {
  window.vm.postMessageWorker({command: 'clearCache'});
}

const getAge = (birthday) => {
  if (!birthday) {
    return '';
  }
  if (typeof birthday === 'number') {
    birthday = formatDate(birthday, 'yyyy-MM-dd hh:mm:ss');
  }
  birthday = birthday.split(' ')[0].split('-');
  // 新建日期对象
  let date = new Date()
  // 今天日期，数组，同 birthday
  let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  // 分别计算年月日差值
  let age = today.map((value, index) => {
      return value - birthday[index]
  })
  // 当天数为负数时，月减 1，天数加上月总天数
  if (age[2] < 0) {
      // 简单获取上个月总天数的方法，不会错
      let lastMonth = new Date(today[0], today[1], 0)
      age[1]--
      age[2] += lastMonth.getDate()
  }
  // 当月数为负数时，年减 1，月数加上 12
  if (age[1] < 0) {
      age[0]--
      age[1] += 12
  }
  return age
}
/**
 * 获取日期天数
*/
const getAgeStr = (birthday) => {
  if (!birthday) {
    return '';
  }
  let age = getAge(birthday);
  let res = '';
  if (age[0] || age[0]===0) {
    res += age[0] + '岁';
  }
  if (age[1]) {
    res += age[1] + '个月';
  }
  if (age[2]) {
    res += age[2] + '天';
  }
  return res
}

// 等待多少秒
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/**
 * 获取缓存数据
 * app支持前端缓存取app缓存数据，否则到localStorage获取
 * @param params
 * @param callback
 * @param context
 */
function getDataCache (key, callback, cfg, context) {
  let cacheData = null;
  let cache;
  if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
    LonchJsApi.webCallAppRequest({command: 'getCache'},
      {keys: [key], remain: false},
      function (res) {
        cache = JSON.parse(res.serviceResult[key] || null);
        if (cache) {
          callback.call(context, cache);
        } else {
          callback.call(context);
        }
      },
      function () {
        callback.call(context);
      },
      context,
      true
    );
  } else {
    let sn = 'INDEXDB' + LonchJsApi.UUID(32, 16);
    window.vm.postMessageWorker({command: 'getCache', data: {code: `${key}`, sn}});
    LonchJsApi.indexDBCallBacks[sn] = function (cache) {
      if (cache) {
        let now = new Date().getTime();
        // 清除登录之前设置等缓存
        // 如果设置过期时间0为不过期,如果过期则清空数据,缓存已失效,清楚同一个接口下所有缓存
        if (cache.time < cfg.loginTime || (cache.expire > 0 && now > cache.time + service.expire)) {
          delectCacheData(key);
        } else {
          cacheData = cache.data;
        }
      }
      if (!isEmpty(cacheData)) {
        callback.call(context, cacheData);
      } else {
        callback.call(context);
      }
      if(sn && LonchJsApi.indexDBCallBacks[sn]) {
        delete LonchJsApi.indexDBCallBacks[sn];
      }
    }
  }
}

/**
 * 设置缓存，app支持前端缓存存储到app，否则存储到localStorage
 * 数据使用AES解密缓存数据
 * @param service
 * @param params
 * @param data
 * @param context
 */
function setDataCache (key, data, context) {
  if(key && data) {
    if (LonchJsApi.isInApp() && LonchJsApi.isSupportCache()) {
      const args = {
        key: key, value: data,
        remain: false
      };
      LonchJsApi.webCallAppRequest({command: 'setCache'},
        args,
        function () {
        },
        function () {
        },
        context || this,
        true
      );
    } else {
      window.vm.postMessageWorker({command: 'setCache', data: {data, code: `${key}`}});
    }
  } else {
    console.error("key is null or undefined");
  }
}

export default {
  isEmpty, // 是否为空
  isEmptyObject, // 是否为空对象
  isPlainObject, // 是否为纯粹对象
  isJsonString, // 是否为可解析的JSON字符串
  turnJson,
  isArray,// 是否为数组
  isArrayLike, // 是否为类数组对象
  isHtmlElement, // 是否为html对象
  allowLockScroll, // 禁用滚动条
  disableLockScroll, // 取消禁用滚动条
  object2search, // 对象转换为search字符串
  search2object, // search字符串转换为对象
  toFunction,
  extend, // 扩展对象
  makeUrl, // 根据URL和参数创建get方式URL
  debounce, // 延时处理
  debounce2,
  throttle,
  throttle2,
  getOffsetTop,
  getOffsetLeft,
  getOffsetParent,
  array2tree,
  array2BidirectionalTree,
  tree2array,
  sortTree,
  tree2flowArray,
  formdata2json,
  createIndex,
  deepCopy,
  matchedData,
  matchedDataX,
  getFirstMatchedData,
  getRepeatingItems,
  each,
  concat,
  reject,
  merge,
  duplicate,
  sort,
  attr,
  getStyle,
  addClass,
  removeClass,
  hasClass,
  formatDate,
  formatEmpty,
  formatMoney,
  formatNumber,
  formatSex,
  trim,
  toUpperCase,
  toLowerCase,
  autoHeightTextArea,
  getScrollingElement,
  UUID,
  getSerialNumber,
  closest,
  encode,
  decode,
  encodeBase64,
  decodeBase64,
  setCookie,
  getCookie,
  deleteCookie,
  arrayWeightRemoval,
  objectDeDuplication,
  setUrlArgs,
  clearUrlArgs,
  getUrlArgs,
  rgb2hex,
  hex2rgb,
  cmyk2Rgb,
  getVersionConfig,
  getServiceModuleConfigByName,
  transformationMachedVersion,
  url2sharePathByMachedVersion,
  numberFormat,
  getSearchParams,
  getHashParams,
  getParams,
  getParam,
  getModuleCode,
  getAccessVersion,
  removeParam,
  setSearchParams,
  compareVersions,
  add,
  subtract,
  multiply,
  divide,
  moneyFormat,
  clearNullProps,
  compatibleProtocolData,
  similarity,
  IndexedArray,
  getClientIp,
  getIpAddress,
  getDataVal,
  getCache,
  setCache,
  getAgeStr,
  clearAllCacheData,
  delectCacheData,
  getKeyCache,
  setKeyCache,
  clearCache,
  sleep,
  setDataCache,
  getDataCache
};
