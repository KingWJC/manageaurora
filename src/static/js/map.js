/**
 * 动态加载百度地图api函数
 * @param {String} ak  百度地图AK，必传
 */
function loadBMap(ak) {
  return new Promise(function (resolve, reject) {
    if (typeof window.BMap !== 'undefined') {
      resolve(window.BMap);
      return true;
    }
    window.onBMapCallback = function () {
      resolve(window.BMap);
    };
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      '//api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=onBMapCallback';
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function validateAddress(address = {}) {
  const area = vue.getCommonDictionary('area');
  const cityAreas = address.provinceCode
    ? area.filter((v) => v.parentid === address.provinceCode)
    : [];
  const districtAreas = area.filter((v) => v.parentid === address.cityCode);
  return !!(
    address.detailedAddress &&
    address.provinceCode &&
    ((address.cityCode && cityAreas.length) || !cityAreas.length) &&
    ((address.districtCode && districtAreas.length) || !districtAreas.length)
  );
}

function getFullAddress(address = {}) {
  const area = vue.getCommonDictionary('area');
  const province = address.provinceCode
    ? area.find((v) => v.c === address.provinceCode)
    : null;
  const city = address.cityCode
    ? area.find((v) => v.c === address.cityCode)
    : null;
  const district = address.districtCode
    ? area.find((v) => v.c === address.districtCode)
    : null;
  return `${province ? province.n : ''}${city ? city.n : ''}${
    district ? district.n : ''
  }${address.detailedAddress || ''}`;
}

export { loadBMap, validateAddress, getFullAddress };
