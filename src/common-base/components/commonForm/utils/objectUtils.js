/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-01-18 01:30:27
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-10 18:58:53
 * @FilePath: @\common-base\components\commonForm\utils\objectUtils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function _basePath(path) {
  // 若是数组，则直接返回
  if (Array.isArray(path)) {
    return path;
  }
  // 若有 '[',']'，则替换成将 '[' 替换成 '.',去掉 ']'
  return path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
}

/**
 * 获取对象的值
 * @param {*} object 要获取值的对象
 * @param {*} path 对象路径
 * @param {*} defaultValue 如果该路径没有值, 则用该默认值赋值路径
 * @returns 返回该值
 */
function get(object, path, defaultValue) {
  // 判断 object 是否是数组或者对象，否则直接返回默认值 defaultValue
  if (typeof object !== 'object') {
    return defaultValue;
  }
  // 沿着路径寻找到对应的值，未找到则返回默认值 defaultValue
  const result = _basePath(path).reduce((o, k) => (o || {})[k], object);
  if (result === undefined) {
    return defaultValue;
  }
  return result;
}

/**
 * 设置对象的值
 * @param {*} object 被赋值的对象(修改原对象)
 * @param {*} path 被赋值的路径
 * @param {*} value 被赋予的值
 * @returns 返回对象
 */
function set(object, path, value) {
  if (typeof object !== 'object') {
    return object;
  }
  _basePath(path).reduce((o, k, i, _) => {
    if (i === _.length - 1) {
      // 若遍历结束直接赋值
      o[k] = value;
      return null;
    } else if (k in o) {
      // 若存在对应路径，则返回找到的对象，进行下一次遍历
      return o[k];
    } else {
      // 若不存在对应路径，则创建对应对象，若下一路径是数字，新对象赋值为空数组，否则赋值为空对象
      o[k] = /^\d+$/.test(_[i + 1]) ? [] : {};
      return o[k];
    }
  }, object);
  // 返回object
  return object;
}

/**
 * 合并两个对象，合并规则：对象里面对应的 key 名字相同，如果 key 对应的值是数组，则合并数组，
 * 否则，用第二个对象对应的值替换第一个对象对应的值
 * @param {Object} target 第一个对象
 * @param {Object} source 第二个对象
 * @returns {Object} 合并后的对象
 */
function mergeTwoObjects(target, source) {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value) && Array.isArray(result[key])) {
      result[key] = [...result[key], ...value];
    } else if (Object.prototype.toString.call(value) === '[object Object]' && Object.prototype.toString.call(result[key]) === '[object Object]'){
      result[key] = {
        ...result[key],
        ...value
      };
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * 合并数组里的对象，合并规则：对象里面对应的 key 名字相同，如果 key 对应的值是数组，则合并数组，
 * 否则，用后一个对象对应的值替换前一个对象对应的值
 * @param {Array<Object>} arr 包含对象的数组
 * @returns {Object} 合并后的对象
 */
function mergeArrayObject(arr = []) {
  return arr.filter(Boolean).reduce((previous, current) => {
    return mergeTwoObjects(previous, current);
  }, {});
}

/**
 * 根据指定的键对集合中的对象进行合并
 * @param {Array<Object>} collection 包含对象的集合
 * @param {string} key 用于判断对象是否相同的键
 * @returns {Array<Object>} 合并后的集合
 */
function mergeCollectionByKey(collection, key) {
  const mergedMap = new Map();
  collection.forEach((item) => {
    const keyValue = item[key];
    if (mergedMap.has(keyValue)) {
      const existingItem = mergedMap.get(keyValue);
      const mergedItem = mergeTwoObjects(existingItem, item);
      mergedMap.set(keyValue, mergedItem);
    } else {
      mergedMap.set(keyValue, { ...item });
    }
  });
  return Array.from(mergedMap.values());
}

/**
 * 如果 fields 存在, 且长度大于 0, 该 field 的值赋值给对象, 并返回
 * 否则, 返回该对象
 * @param {*} object
 * @param {*} fields
 * @returns
 */
function getFieldsObject(object = {}, fields = []) {
  if (fields.length) {
    const result = {};
    fields.map((field) => {
      const value = get(object, field);
      set(result, field, value);
    });
    return result;
  }
  return { ...object };
}

function removeObjectNullDeep(obj) {
  const isArray = obj instanceof Array;
  for (let k in obj) {
    if (obj[k] === null) {
      isArray ? obj.splice(+k, 1) : delete obj[k];
    } else if (typeof obj[k] === 'object') {
      removeObjectNullDeep(obj[k]);
    }
  }
}

/**
 * 递归去除对象里的 0, null, undefined, ''
 * @param {Object} obj 要处理的对象
 * @returns {Object} 处理后的对象
 */
function removeFalsyValues(obj) {
  if (typeof obj!== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.filter(item => item!== 0 && item!== null && item!== undefined && item!== '').map(removeFalsyValues);
  }
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value!== 0 && value!== null && value!== undefined && value!== '') {
      newObj[key] = removeFalsyValues(value);
    }
  }
  return newObj;
}

function filterObjectNull(obj) {
  removeObjectNullDeep(obj);
  return obj;
}

/**
 * 深度克隆一个对象
 * @param {Object} obj 要克隆的对象
 * @param {WeakMap} hash 用于处理循环引用的 WeakMap
 * @returns {Object} 克隆后的对象
 */
function cloneDeep(obj, hash = new WeakMap()) {
  // 处理基本类型和null/undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理Date对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => cloneDeep(item, hash));
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理普通对象
  const clonedObj = Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );

  hash.set(obj, clonedObj);

  for (const key of Reflect.ownKeys(obj)) {
    clonedObj[key] = cloneDeep(obj[key], hash);
  }

  return clonedObj;
}

/**
 * 深度比较两个对象是否相等
 * @param {Object} obj1 第一个对象
 * @param {Object} obj2 第二个对象
 * @returns {boolean} 如果两个对象深度相等返回 true，否则返回 false
 */
function deepEqual(obj1, obj2) {
    // 检查是否为同一引用
    if (obj1 === obj2) {
        return true;
    }

    // 检查是否为对象
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // 获取对象的键
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 检查键的数量是否相同
    if (keys1.length !== keys2.length) {
        return false;
    }

    // 遍历每个键并递归比较值
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * 按照指定的 key 对数组进行分组
 * @param {Array} array 要分组的数组
 * @param {string|Function} key 用于分组的键，可以是属性名或函数
 * @returns {Object} 分组后的对象
 */
function groupBy(array, key) {
  if (!Array.isArray(array)) {
    return {};
  }
  return array.reduce((result, currentItem) => {
    const keyValue = typeof key === 'function' ? key(currentItem) : currentItem[key];
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(currentItem);
    return result;
  }, {});
}

export { get, set, mergeArrayObject, mergeCollectionByKey, mergeTwoObjects,
getFieldsObject, removeObjectNullDeep, filterObjectNull, removeFalsyValues, cloneDeep,
deepEqual, groupBy };
