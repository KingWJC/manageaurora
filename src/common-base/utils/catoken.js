/*
 * @Date: 2024-03-28 16:10:49
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-07-24 00:08:46
 * @FilePath: \lonch-rxv-fe\src\catoken.js
 * @Description:
 */
// import storage from './localstorage.js'
import Utils from '@/common-base/utils/utils'

class CaTokenTools {
  getCurrentDomain() {
    let domain = document.domain;
    let parts = domain.split('.').reverse();

    // Check if it's an IP address
    if (parts.length !== 4 || isNaN(parseInt(parts[0]))) {
        return domain;
    } else {
        // IP address
        return parts[2] + '.' + parts[1] + '.' + parts[0];
    }
  }
  /**
   * @description: 根据humanId写入caToken
   * @param {*} huamnId
   * @param {*} caToken
   * @return {*}
   */
  set(huamnId, caToken) {
    if(!huamnId || !caToken) {
      return;
    }
    // 缓存的key
    let key = 'CATOKEN-' + huamnId;
    console.log('设置catoken......')
    // 判断运行时环境
    if(LonchJsApi.isInAppV2() || LonchJsApi.isInSimpleApp()) {
      console.log('设置catoken......在app中....', 'remain: true')
      // 在app中使用缓存
      LonchJsApi.webCallAppRequest({command: 'setCache'},
        {
          key: key,
          value: caToken,
          // remain表示退出登录不清除
          remain: true
        },
        function () {},
        function () {},
        this,
        true
      );
    } else {
      console.log('设置catoken......在非app中....')
      // 在非APP环境使用cookie
      Utils.setCookie('CATOKEN-' + huamnId, caToken, '/', this.getCurrentDomain(), 30 * 24 * 60 * 60 * 1000);
    }
  }
  /**
   * @description: 根据humanId删除caToken
   * @param {*} huamnId
   * @return {*}
   */
  remove(huamnId) {
    if(!huamnId) {
      return '';
    }
    // 缓存的key
    let key = 'CATOKEN-' + huamnId;
    if(LonchJsApi.isInAppV2() || LonchJsApi.isInSimpleApp()) {
      console.log('clearCache:::', 'remain: true')
      LonchJsApi.webCallAppRequest(
        {
          command: 'clearCache'
        },
        {
          keys: [key],
          remain: true
        },
        function () {
          console.log('删 除catoken成功....')
        },
        function () {
          console.log('删 除catokenr失败....')
        },
        this,
        true
      );
    } else {
      Utils.setCookie(key, '', '/', this.getCurrentDomain(), 0);
    }
  }
  /**
   * @description: 根据humanId获取caToken
   * @param {*} huamnId
   * @return {*}
   */
  get(huamnId) {
    return new Promise(resolve => {
      if(!huamnId) {
        resolve('');
      }
      // 缓存的key
      let key = 'CATOKEN-' + huamnId;
      // 判断运行时环境
      if(LonchJsApi.isInAppV2() || LonchJsApi.isInSimpleApp()) {
        LonchJsApi.webCallAppRequest(
          {
            command: 'getCache'
          },
          {
            keys: [key],
            remain: true
          },
          function (res) {
            console.log('get catoken:::::::::::', res)
            if(res && res.data && res.data[key]) {
              console.log('取到了catoken:::', res.serviceResult[key], 'remain: true')
              resolve(res.serviceResult[key]);
            } else {
              console.log('没取到catoken....', 'remain: true')
              resolve('');
            }
          },
          function () {
            resolve('');
          },
          this,
          true
        );
      } else {
        const caToken = Utils.getCookie(key);
        if(caToken) {
          resolve(caToken);
        } else {
          resolve('');
        }
      }
    })
  }
}

export default CaTokenTools
