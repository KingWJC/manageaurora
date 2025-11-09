/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-05-23 01:24:42
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-07-11 01:21:32
 * @FilePath: \lonch-angels-wings-app\src\common-base\api\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Api from '@/common-base/api/api';

// 设置当前code的权限
export function setPermissionAction(moduleCode) {
    
  // 根据moduleCode，找到用户所拥有的资源权限
  const permissions = [];
  if(window.vm.CFG && window.vm.CFG.permissions && window.vm.CFG.permissions.length > 0) {
    window.vm.CFG.permissions.forEach(v => {
      if(v.code === moduleCode) {
        permissions.push(v);
      }
    })
  }
  // 判断用户至少得有一个当前moduleCode的权限
  if(permissions.length > 0 && permissions[0] && permissions[0].id) {
    // 当前用户如果有这个moduleCode权限，则继续逻辑
    // 有moduleCode，查询一下这个moduleCode下的按钮权限
    return new Promise((resolve) => {

      /**
       * 权限已经存在actions, 不再请求接口
       */
      if(permissions.every(el => el.actions && el.actions.length)) {
        resolve(true);
        return 
      }

      let url = {
        module: 'uaapi',
        url: '/user/productPermissionNamesByParentId',
        method: 'POST',
        cache: true,
        expire: 0,
        isGlobal: true,
        comment: '当前登录用户产品菜单'
      }
      if(/^angelswings$/i.test(window.vm.CFG.projectName) && LonchJsApi.isInApp()) {
        url = {...url, ...{networkFirst: true}}
      }
      Api.send(
        url,
        {
          ids: permissions.map(v => v.id || '')
        },
        function (res) {
          const result = res.data || [];
          // 传进接口查询的是多个权限id，则回调的时候，要根据id把操作权限、行权限写回
          if(result) {
            result.forEach(v => {
              const permission = permissions.find(item => item.id === v.id);
              permission.actions = v.manageProductPermissionVos;
            })
          }
          resolve(true)
        },
        function () {
          resolve(true)
        },
        this
      );
    })
  } else {
    // 用户没有这个moduleCode权限，则直接去根路径
    return Promise.resolve(false)
  }
}

