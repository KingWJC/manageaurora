/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-14 10:52:39
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-07-24 15:32:37
 * @FilePath: \common-basec:\project\middleground\lonch-erp\src\common-base\api\webSocketApi\InterfaceModules.js
 * @Description: 通用：微服务与接口功能
 */

import config from '../../../config/index'

// 查询接口是否要走 webSocket
function InterfaceModules(list = []) {
  this.setWebSocketServiceObj(list);
}

// 单例
InterfaceModules.instance = null;
InterfaceModules.getInstance = (list) => {
  if (!list) {
    return new InterfaceModules(list);
  }
  if (!InterfaceModules.instance) {
    InterfaceModules.instance = new InterfaceModules(list);
  }

  return InterfaceModules.instance;
};

InterfaceModules.prototype = {
  webSocketServiceObj: [],
  defaultVersion: '2.0',
  defaultScheme: 'wth',
  defaultUseWebSocket: true, // 默认是否使用webSocket

  /**
   * 检查当前API是否需要使用webSocket
   * @param {Object} service 接口配置
   * @param {String} url 接口全地址
   * @returns Boolean
   */
  check(service, url, params) {
    /**
     * 有链接，且不是以网关方式访问的，不使用webSocket请求
     * 接口协议版本是1.0不使用为webSocket
     * 服务协议版本是1.0不使用为webSocket
     * 没有配置webSocketGateway 地址，不使用webSocket
     * 未登录，无token，不使用webSocket
     * get请求不走webSocket
     * FormData参数不走webSocket
     */
    if(
      url && !url.includes(config.project.gateway) || 
      service.protocolVersion === '1.0' || 
      this.webSocketServiceObj[service.module]?.version === '1.0' || 
      !config.project || !config.project.webSocketGateway || 
      !config.token || 
      (service.method && service.method.toLowerCase() === 'get') || 
      params instanceof FormData || (params && params.demand && params.demand instanceof FormData)
    ) {
      return false
    }

    return (
      this.isWebSocket(service) ?? this.webSocketServiceObj[service.module] ?? this.defaultUseWebSocket
    );
  },

  /**
   * 设置使用webSocket服务的数据，使用对象方式，方便查询
   * @param {*} list 
   */
  setWebSocketServiceObj(list) {
    const webSocketServiceObj = {};
    list.forEach((el) => {
      // 判断是否使用websocket
      webSocketServiceObj[el.name] = this.isWebSocket(el)
    });

    this.webSocketServiceObj = webSocketServiceObj;
  },

  /**
   * 是否使用webSocket的方式
   */
  isWebSocket(service) {
    const type = typeof service.type === 'string' ? service.type.toLowerCase() : service.type;
    return {
      websocket: true,
      http: false,
    }[type]
  },

  /**
   * 得到当前微服务使用webSocket的列表
   * @returns 
   */
  getModulesWebSocketList() {
    return Object.keys(this.webSocketServiceObj);
  },

  /**
   * 得到微服务的符合name的数据字段
   */
  getListProp(prop, name) {
    if (!name) {
      return;
    }
    const current = this.webSocketServiceObj[name] || {};
    return current[prop];
  },

  /**
   * 得到微服务的版本号
   * @param {*} service 
   * @returns 
   */
  getVersion(service) {
    return (
      service.version || service.protocolVersion ||
      this.getListProp('version', service.module) ||
      this.defaultVersion
    );
  },

  /**
   * 得到微服务的scheme
   * @param {*} service 
   * @returns 
   */
  getScheme(service) {
    return (
      service.scheme ||
      this.getListProp('scheme', service.module) ||
      this.defaultScheme
    );
  }
};

export default InterfaceModules.getInstance;
