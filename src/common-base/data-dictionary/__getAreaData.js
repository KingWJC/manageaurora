/**
 * 省市县 静态数据
 * 存放位置，window.areaDatas对象下
 * 存放位置，window.areaTreeDatas对象下
 * 如果没有值需要请求接口数据
 * 服务 mserver
 * 接口 /system/areaslog
 */

// import Api from '../api/api';

export default function () {
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