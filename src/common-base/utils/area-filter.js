import IndexedArray from './indexed-array';

let commonAreaData = null;

function getAreaData () {
  if (!commonAreaData) {
    commonAreaData = new IndexedArray(vue.getCommonDictionary('area'), ['id', 'parentid']);
  }
  return commonAreaData;
}

function isAllChildrenSelected (id, selected) {
  let childrens = getChildrenAreas(id);
  for (let i = 0; i < childrens.length; i++) {
    let child = childrens[i];
    if (isCity(child.id) && !isAllChildrenSelected(child.id, selected)) {
      return false;
    } else {
      if (Array.prototype.indexOf.call(selected, child.id) < 0) {
        return false;
      }
    }
  }
  return true;
}

function isProvince (id) {
  let area = getAreaById(id);
  // 如果存在父级
  return !(area && area.parentid);
  //if (area.parentid) {
  //  return false;
  //}
  //return true;
}

function isCity (id) {
  let area = getAreaById(id);
  // 存在父级且父级为省
  return area && area.parentid && isProvince(area.parentid);
  //if (area.parentid && isProvince(area.parentid)) {
  //  return true;
  //}
  //return false;
}

//function isPistrict (id) {
//  let area = getAreaById(id)
//  // 存在父级且父级为市
//  if (area.parentid && isCity(area.parentid)) {
//    return true
//  }
//  return false
//}

function getParentArea (id) {
  let area = getAreaById(id);
  let parent = {};
  if (area && area.parentid) {
    parent = getAreaById(area.parentid);
  }
  return parent;
}

function getChildrenAreas (id) {
  let areaData = getAreaData();
  return IndexedArray.prototype.getListByIndex(areaData, 'parentid', id);
}

function getAreaById (id) {
  let areaData = getAreaData();
  return IndexedArray.prototype.getByIndex(areaData, 'id', id);
}

function formatArea (data, defaultValue = '') {
  let arr = [];
  let selectAreas = [];
  if (data.city && data.province) {
    let selectProvinces = data.province.split(',');
    let selectCitys = data.city.split(',');
    let selectDistricts = data.district ? data.district.split(',') : [];
    for (let pi = 0; pi < selectProvinces.length; pi++) {
      let provinceid = selectProvinces[pi];
      if (isAllChildrenSelected(provinceid, selectCitys)) {
        selectAreas.push(provinceid);
      }
    }
    for (let ci = 0; ci < selectCitys.length; ci++) {
      let cityid = selectCitys[ci];
      let parent = getParentArea(cityid);
      // 省级没有全选时
      if (Array.prototype.indexOf.call(selectAreas, parent.id) < 0 && isAllChildrenSelected(cityid, selectDistricts)) {
        selectAreas.push(cityid);
      }
    }
    for (let di = 0; di < selectDistricts.length; di++) {
      let districtid = selectDistricts[di];
      let city = getParentArea(districtid);
      let province = getParentArea(city.id);
      // 存在父级
      if (!(Array.prototype.indexOf.call(selectAreas, city.id) >= 0 || Array.prototype.indexOf.call(selectAreas, province.id) >= 0)) {
        selectAreas.push(districtid);
      }
    }
  }
  for (let i in selectAreas) {
    let area = getAreaById(selectAreas[i]);
    if (area) {
      arr.push(area.label);
    }
  }
  return arr.length > 0 ? arr.join(' ') : defaultValue;
}

export default {
  formatArea
};
