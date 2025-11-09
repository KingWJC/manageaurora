/**
 * Created by lijianwei on 2022/03/21
 * 缓存
 * 需要缓存配置
 * localStorage,
 * indexedDB
 * cookie
 */

function getCacheByKey (key, store) {
  // 原是空函数，sonar提示增加console.log
  console.log(key, store);
}

/**
 * 设置缓存
 * @param key
 * @param data
 */
function setCache (key, data, store) {
  // 原是空函数，sonar提示增加console.log
  console.log(key, data, store);
}

/**
 * 清除缓存指定缓存数据
 */
function clearCacheByKey (key, store) {
  // 原是空函数，sonar提示增加console.log
  console.log(key, store);
}

/**
 * 清除所有缓存数据
 */
function clearAllCache (store) {
  // 原是空函数，sonar提示增加console.log
  console.log(store);
}

export default {
  getCacheByKey,
  setCache,
  clearCacheByKey,
  clearAllCache
}
