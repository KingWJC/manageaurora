/**
 * 为数据创建索引对象
 * @param arr
 * @param indexs Array
 * @return {*}
 * @constructor
 */
function IndexedArray (arr, indexs) {
  let result = JSON.parse(JSON.stringify(arr));
  this.createIndex(result, indexs);
  return Object.assign(result, this);
}

IndexedArray.prototype.createIndex = function (indexedArr, indexs) {
  Object.defineProperty(indexedArr, 'indexs', {
    value: {},
    enumerable: false, // 是否可枚举
    configurable: true, //是否可配置
    writable: true // 是否可以改变
  });
  for (let i = 0; i < indexs.length; i++) {
    let keyPath = indexs[i];
    if (i === 0) {
      Object.defineProperty(indexedArr, 'primaryKey', {
        value: keyPath,
        enumerable: false, // 是否可枚举
        configurable: false, //
        writable: false // 是否可以改变
      });
    }
    Object.defineProperty(indexedArr, keyPath, {
      value: keyPath,
      enumerable: false, // 是否可枚举
      configurable: false, //
      writable: false // 是否可以改变
    });
    let keyIndexs = {};
    for (let i = 0; i < indexedArr.length; i++) {
      let item = indexedArr[i];
      let keyValue = item[keyPath] || ''; // 如果null,undefined 转为空
      if (Array.isArray(keyIndexs[keyValue])) {
        keyIndexs[keyValue].push(item);
      } else if (keyIndexs[keyValue]) {
        // 多个同样等keyPath值，转换为数组
        let arrTemp = [keyIndexs[keyValue]];
        arrTemp.push(item);
        keyIndexs[keyValue] = arrTemp;
      } else {
        keyIndexs[keyValue] = item;
      }
    }
    indexedArr.indexs[keyPath] = keyIndexs;
  }
};

/**
 * 根据索引获取对应的值
 * @param indexedArray
 * @param index
 * @param value
 * @return {*}
 */
IndexedArray.prototype.getByIndex = function (indexedArray, index, value) {
  return indexedArray.indexs[index][value];
};

/**
 * 根据索引获取对应值，转换为数组
 * @param indexedArray
 * @param index
 * @param value
 * @return []
 */
IndexedArray.prototype.getListByIndex = function (indexedArray, index, value) {
  let result = indexedArray.indexs[index][value];
  return result && !Array.isArray(result) ? [result] : result || [];
};

/**
 * 判断是否为IndexedArray对象
 * @param array
 * @return boolean
 */
IndexedArray.prototype.isIndexedArray = function (array) {
  return Array.isArray(array) && array.hasOwnProperty('indexs');
};

export default IndexedArray;
