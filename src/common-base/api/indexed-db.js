let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
let database; // 当前链接数据库对象

/**
 * 打开或新建数据库
 * @param settings
 * @param success
 * @param error
 */
function openDatabase (settings, success, error, context = this) {
  if (indexedDB) {
    if (isOpen()) {
      if (typeof success === 'function') {
        success.call(context, database);
      }
      return;
    }
    let request = indexedDB.open(settings.dbName, settings.version);
    request.onsuccess = function (event) {
      database = event.target.result;
      if (typeof success === 'function') {
        success.call(context, event.target.result);
      }
    };
    request.onupgradeneeded = function (event) {
      database = event.target.result;
      createOrUpdateStore(settings);
    };
    request.onerror = function (event) {
      if (error && typeof error === 'function') {
        error.call(context, event);
      }
    };
  } else {
    if (typeof error === 'function') {
      error.call(context, '您的浏览器不支持本地数据库');
    }
  }
}

/**
 * 创建更新表结构, 如果数据库不存在则创建，如果存在但是version更大，会自动升级不会复制原来的版本
 * 版本升级，检查表配置，创建新表和索引
 * @param settings
 */
function createOrUpdateStore (settings) {
  let tables = settings.tables || [];
  let store;
  for (let table of tables) {
    if (!database.objectStoreNames.contains(table.name)) {
      store = database.createObjectStore(table.name, {keyPath: table.keyPath});
      // 创建索引
      for (let storeIndex of table.indexs) {
        store.createIndex(storeIndex.key + '-index', storeIndex.key, storeIndex.option || null);
      }
    }
  }
}

/**
 * 创建事物,获取数据
 * @param storeName
 * @param mode
 * @return {IDBObjectStore}
 */
function getStore (storeName, mode) {
  let tx = database.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

/**
 * 新增,修改数据
 * @param storeName
 * @param data
 * @param success
 * @param error
 */
function addOrUpdate (storeName, data, success, error, context = this) {
  try {
    let store = getStore(storeName, 'readwrite');
    if (Array.isArray(data)) {
      for (let item of data) {
        store.put(item);
      }
    } else if (data) {
      store.put(data);
    }
    if (typeof success === 'function') {
      success.call(context, store);
    }
  } catch (e) {
    if (typeof error === 'function') {
      error.call(context, e);
    }
  }
}

/**
 * 查询数据
 * @param storeName
 * @param condition, string:keyPath|object: 条件检索|function: 函数过滤
 * @param success
 * @param error
 */
function get (storeName, condition, success, error, context = this) {
  let store = getStore(storeName, 'readonly');
  let request;
  if (typeof condition === 'string') {
    // 字符串时，匹配主键
    request = store.get(condition);
  } else {
    request = store.getAll();
  }
  request.onsuccess = function (event) {
    let result = event.target.result;
    if (result && result.length > 0 && typeof condition === 'object') {
      if (typeof condition === 'function') {
        result = Array.prototype.filter.call(result, condition);
      } else {
        for (let key in condition) {
          result = matchedData(result, key, condition[key]);
        }
      }
    }
    success.call(context, result);
  };
  request.onerror = function (evt) {
    error.call(context, evt);
  };
}

//
//function remove (storeName, condition, success, error, context = this) {
//  let store = getStore(storeName, 'readwrite');
//  let request;
//  if (typeof condition === 'string') {
//    // 字符串时，匹配主键
//    request = store.get(condition);
//  } else {
//    request = store.getAll();
//  }
//  request.onsuccess = function (event) {
//    let result = event.target.result;
//    if (result && result.length > 0 && typeof condition === 'object') {
//      if (typeof condition === 'function') {
//        result = Array.prototype.filter.call(result, condition);
//      } else {
//        for (let key in condition) {
//          result = matchedData(result, key, condition[key]);
//        }
//      }
//    }
//  };
//  request.onerror = function (evt) {
//    error.call(context, evt);
//  };
//}

/**
 * 清空表
 */
function clear (storeName, success, error, context = this) {
  let store = getStore(storeName, 'readwrite');
  let result = store.clear();
  result.onsuccess = function (event) {
    if (typeof success === 'function') {
      success.call(context, event.target.result);
    }
  };
  result.onerror = function (event) {
    if (typeof error === 'function') {
      error.call(context, event.target.result);
    }
  };
}

function close () {
  try {
    if (database) {
      database.close();
    }
  } catch (e) {
    //
  } finally {
    database = null;
  }
}

/**
 * 根据关键字匹配
 * @param arr 支持一维数组和树形数据
 * @param prop 匹配的字段
 * @param keyword 搜索的关键字，使用通配符规则区分左匹配，右匹配和全匹配规则，通配符为星号（*）
 * @param isExact 是否精确匹配，默认true, left,right
 * @return {Array, treeDataArray}
 */
function matchedData (arr, prop, keyword, isExact = true) {
  let matched = [];
  if (!arr || arr.length <= 0) {
    return matched;
  }
  let regExp;
  // 如果搜索关键字含有匹配符，左右位置匹配全模糊，开始位置左模糊，结束位置右模糊，
  if (/^\*|\*$/.test(keyword)) {
    isExact = /^\*.*\*$/.test(keyword) ? false : /^\*/.test(keyword) ? 'left' : 'right';
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

function isOpen () {
  return database ? true : false;
}

export default {
  openDatabase,
  addOrUpdate,
  matchedData,
  isOpen,
  get,
  clear,
  close
};
