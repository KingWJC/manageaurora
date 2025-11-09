/**
 * 获取资源重复的功能权限和数据行权限
 * @param permissionList 资源列表
 * @return {string}
 */
let getRepeatingActionAndDataTable = function (permissionList) {
  let copy = vm.utils.deepCopy(permissionList);
  let indexArr = new vm.utils.IndexedArray(copy, ['id']);
  let repeatingModules = getRepeatingModules(indexArr);
  console.log(repeatingModules);
  return repeatingModulesToTable(repeatingModules);
};

/**
 * 获取有重复按钮或数据行权限的资源列表
 * @param indexedArr
 * @param props
 * @return {Array}
 */
function getRepeatingModules (indexedArr, props = {}) {
  let result = [];
  for (let item of indexedArr) {
    if (item.type === '2' && item.parentid !== '0') {
      let propValue = item.parentid + '-' + item.code;
      if (props[propValue]) {
        props[propValue].push(item);
        // console.log('===重复==', propValue);
        let module = vm.utils.IndexedArray.prototype.getByIndex(indexedArr, 'id', item.parentid);
        if (module) {
          let matched = vm.utils.matchedDataX(result, 'id', module.id);
          // if(!module.repeatings){
          //     module.repeatings=[];
          //     module.repeatings.push(props[propValue][0])
          // }
          if (item && item.permissionType === 'action') {
            module.repeatingActions = props[propValue];
          } else {
            module.repeatingDatas = props[propValue];
          }
          module.repeatings = Array.prototype.concat.call(module.repeatingActions || [], module.repeatingDatas || []);
          if (!matched || matched.length < 1) {
            result.push(module);
          }
          console.log('===重复moduleCode==', module.code);
        }
      } else {
        props[propValue] = [item];
      }
    }
    if (item.children && item.children.length > 0) {
      let subResult = getRepeatingItems(item.children, props);
      result = Array.prototype.concat.call(result, subResult);
    }
  }
  return result;
}

/**
 * 获取有重复按钮或数据行权限的资源列表转换为表格代码
 * 生成table:[id,name,code,actions,datas,times]
 * @param repeatingModules 计算出来的资源列表
 */
function repeatingModulesToTable (repeatingModules) {
  let rows = [];
  rows.push('<table><tbody>');
  for (let i = 0; i < repeatingModules.length; i++) {
    let row = [];
    let item = repeatingModules[i];
    row.push('<tr>');
    row.push('<td>' + item.id + '</td>');
    row.push('<td>' + item.name + '</td>');
    row.push('<td>' + item.code + '</td>');
    let repeatActions = [];
    let repeatDatas = [];
    for (let repeat of item.repeatings) {
      if (repeat.permissionType === 'action') {
        repeatActions.push(repeat.remark ? repeat.name + '(' + repeat.code + ')' + '(' + repeat.remark + ')' : repeat.name + '(' + repeat.code + ')');
      } else {
        repeatDatas.push(repeat.remark ? repeat.name + '(' + repeat.code + ')' + '(' + repeat.remark + ')' : repeat.name + '(' + repeat.code + ')');
      }
    }
    row.push('<td>' + repeatActions.join('、') + '</td>');
    row.push('<td>' + repeatDatas.join('、') + '</td>');
    row.push('<td>' + item.repeatings.length + '</td>');
    row.push('</tr>');
    rows.push(row.join(''));
  }
  rows.push('</tbody></table>');
  console.log(rows);
  return rows.join('');
}

/**
 * 批量更新资源
 * @param list
 * @param currentIndex
 */
function updatePermissions (list, currentIndex) {
  console.log('--currentIndex--', currentIndex);
  if (currentIndex < 10) {
    updatePermissionNames(list[currentIndex], function () {
      updatePermissions(list, currentIndex + 1);
      
    });
  }
}

/**
 * 更新资源
 * @param permission
 * @param callback
 */
function updatePermissionNames (permission, callback) {
  origin = getOriginByUrl(permission.url);
  console.log('origin:', origin, permission);
  if (origin && /^http[s]?/.test(permission.url)) {
    console.log('----permission---', permission.channel, permission.url);
    permission.channel = origin.name;
    permission.url = permission.url.replace(/^http.*#/g, '');
    console.log('----new permission---', permission.channel, permission.url);
    vm.API.send(
      {module: 'mserver', url: '/user/updatePermissionNames', method: 'POST', comment: '更新菜单和按钮'},
      permission,
      function () {
        console.log('update-success', permission);
        callback.call(this);
      },
      function () {
        console.log('update-error', permission);
      }
    );
  } else {
    callback.call(this);
  }
}

/**
 * 测试接口
 */
function ajaxTest () {
  let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('post', 'https://test-yunfu-gateway.lonch.com.cn/operlog/template/list', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
  xhr.setRequestHeader('ACCESS-TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhT3duZXJPcmdJZCI6IjEyOTE3OTE0NTY5MDI4ODEyOCIsImFjY291bnRJZCI6ImMwYTQzYzdkMzYyODRiODliNzZhYTE1MDUxZjg1NjMzIiwiZXhwIjoxMjQzNTQyMDM5MCwidXNlcklkIjoiYzBhNDNjN2QzNjI4NGI4OWI3NmFhMTUwNTFmODU2MzMiLCJ1dWlkIjoiYTQyZDljOWMwNWZiNDFkY2E3ZjVkMjM0ZDhjMzE0NTEiLCJpYXQiOjE2MzU0MjAzOTAsInVzZXJuYW1lIjoiMTM1MjA2NjYyNjAifQ.UEEXVdC_kR8z9KEpcwqchWJJhWe2P3_oBKB-hyaUPvQ');
  xhr.send('{"current":1,"dataCode":"1067","manageProductId":"1","moduleCode":"99991067","param":{},"productId":"1","rowCount":20,"sortBy":"","system":"0001","timestamp":1634111664351,"type":"0"}');
}

// ===测试App代码===
//LonchJsApi.webCallAppRequest({'command': 'getAppInfo', module:
// 'appClient'},{},function(data){console.log('===getAppInfo===',data)},function(e){console.log(e)},vm)


//=========编码========
//encodeURIComponent(JSON.stringify())
//=========解码========
//JSON.parse(decodeURIComponent())

