/**
 * 省市县 静态数据
 * 存放位置，window.areaDatas对象下
 */

import getAreaData from './__getAreaData'

export default (() => {
  if (window.areaDatas !== undefined) {
    return window.areaDatas;
  } else {
    return getAreaData();
  }
})();
