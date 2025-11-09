// /**
//  * 省市县 静态数据
//  * 存放位置，window.areaDatas对象下
//  */

//import getAreaData from './getAreaData'
function getAreaData () {
  window.areaDatas = [];
  window.area.forEach(i => {
    window.areaDatas.push({
      ...i,
      c: i.code,
      id: i.code,
      n: i.name,
      label: i.name,
      p: i.parentcode,
      parentid: i.parentcode,
      level: i.levelcode,
    })
  });
  return window.areaDatas;
}
export default (() => {
  if (window.areaDatas !== undefined) {
    return window.areaDatas;
  } else {
    return getAreaData();
  }
})();
