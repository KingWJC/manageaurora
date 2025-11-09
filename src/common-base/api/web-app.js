/************************************************************
 Created by lijianwei on 2019/6/6.
 AppCallBacks回调列表(总表)
 定义App回调集合对象
 1.通过水单控制接口回调流水，回调完成立即删除回调，
 sn：String WebCallApp水单
 data: Json 返回数据
 2.App通知Web消息
 command: String
 msg: String 消息
 3.回调函数可以清空，清空后，如果没有新的水单数据调用，仍然接收App通知Web消息
 4.WebCallAppList
 goback args:{} 后退
 openUrl args:{url} 打开地址
 ***********************************************************/
import config from '../../config/index';
import utils from '../utils/utils';
import appMsgHandlers from './app-msg-handlers';
import postMessageHandlers from './post-message-handlers';
// import {Loading} from 'element-ui';
import Loading from '../components/lonchComponents/loading/index.js';
import {Message} from 'element-ui';
import webLog from './web-log';
import router from '../../router';
import autoTaskMonitor from './auto-task-monitoring';
import timeout from './time-out';
import AdjustErrorLevel from './adjustErrorLevel';
import InterfaceModules from './webSocketApi/InterfaceModules.js';
// token异常的数据错误码
import { tokenInvalidList } from './webSocketApi/apiCustomResult.js';
import Login from "../login/login";
import API from './api';

let loadingConfig = {
  show: false,
  loading: null
};

function showLoading (sn) {
  LonchJsApi.loadingCallBacks.push(sn);
  loadingConfig.show = true;
  loadingConfig.loading = Loading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.01)'
  });
}

function closeLoading (sn) {
  if (LonchJsApi.loadingCallBacks.indexOf(sn) >= 0) {
    LonchJsApi.loadingCallBacks.splice(LonchJsApi.loadingCallBacks.indexOf(sn), 1);
  }
  if (LonchJsApi.loadingCallBacks.length <= 0) {
    loadingConfig.loading.close();
    loadingConfig.show = false;
  }
}

export default (function () {
  if (typeof LonchJsApi === 'undefined') {
    window.LonchJsApi = window.webkit && window.webkit.messageHandlers ? window.webkit.messageHandlers : {};
  }
  LonchJsApi.readyCallbacks = []; // 准备完成回调列表
  LonchJsApi.loadingCallBacks = []; //加载loading的接口列表
  LonchJsApi.indexDBCallBacks = []; // 获取indexDB的回调
  LonchJsApi.autoTaskMonitor = autoTaskMonitor; // 自动任务
  LonchJsApi.timeout = timeout; // 全局定时器
  LonchJsApi.isTopWindowInApp = false; // 是否顶级窗口在App中
  LonchJsApi.readyTimer = null;
  LonchJsApi.isReady = false; // 是否准备完成
  LonchJsApi.readyTimeout = 1000; //准备完成超时时间
  LonchJsApi.clientType = ''; // 客户端类型
  LonchJsApi.AppCallBacks = {}; // 绑定回调对象
  LonchJsApi.AppMsgHandlers = appMsgHandlers; // 监听处理器
  LonchJsApi.postMessageCallBacks = {}; // postMessage回调处理
  LonchJsApi.serverSendMsgHandlers = {} // 服务器主动发送消息
  /**
   * 获取设置为LonchApp，目的在浏览器模拟App环境流程
   * localStorage.setItem('ClientType', 'LonchApp')
   * localStorage.setItem('ClientType', 'LonchAppV2')
   */
  LonchJsApi.getClientType = function () {
    return localStorage.getItem('ClientType');
  };

  /**
   * 判断是否在App中运行
   */
  LonchJsApi.isInApp = function () {
    return (
      LonchJsApi.isInIosApp()
      || LonchJsApi.isInMacApp()
      || LonchJsApi.isInAndroidApp()
      || LonchJsApi.isInCef()
      || LonchJsApi.isInAppV2()
      || LonchJsApi.isTopWindowInApp
      || LonchJsApi.getClientType() === 'LonchApp'
    );
  };

  /**
   * 判断是否为支持2.0协议的App
   * @return {*|boolean|y.webkit|webkit}
   */
  LonchJsApi.isInAppV2 = function () {
    return (
      LonchJsApi.isInIosAppV2()
      || LonchJsApi.isInMacAppV2()
      || LonchJsApi.isInAndroidAppV2()
      || LonchJsApi.isInCefV2()
      || LonchJsApi.getClientType() === 'LonchAppV2'
    );
  };
  /**
   * named err todo delete change name isInAppV2
   */
  LonchJsApi.isInInAppV2 = function () {
    return (
      LonchJsApi.isInIosAppV2()
      || LonchJsApi.isInMacAppV2()
      || LonchJsApi.isInAndroidAppV2()
      || LonchJsApi.isInCefV2()
      || LonchJsApi.getClientType() === 'LonchAppV2'
    );
  };

  /**
   * 判断是否在IosApp中
   */
  LonchJsApi.isInIosApp = function () {
    return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['webCallApp']) || LonchJsApi.clientType === 'iosApp';
  };

  /**
   * 判断是否在IosAppV2
   */
  LonchJsApi.isInIosAppV2 = function () {
    return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['webCallAppV2'] && window.webkit.messageHandlers['iAmIos']) || LonchJsApi.clientType === 'iosAppV2';
  };

  /**
   * 判断是否在IosApp中
   */
  LonchJsApi.isInMacApp = function () {
    return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['webCallMac']) || LonchJsApi.clientType === 'macApp';
  };

  /**
   * 判断是否在IosAppV2
   */
  LonchJsApi.isInMacAppV2 = function () {
    return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['webCallAppV2'] && window.webkit.messageHandlers['iAmMac']) || LonchJsApi.clientType === 'macAppV2';
  };

  /**
   * 判断是否在AndroidApp中
   */
  LonchJsApi.isInAndroidApp = function () {
    return typeof LonchJsApi.webCallApp === 'function' || LonchJsApi.clientType === 'androidApp';
  };

  /**
   * 判断是否在AndroidAppV2
   */
  LonchJsApi.isInAndroidAppV2 = function () {
    return typeof LonchJsApi.webCallAppV2 === 'function' && typeof LonchJsApi.iAmAndroid === 'function';
  };

  /**
   * 判断是否在windowsApp中
   */
  LonchJsApi.isInCef = function () {
    return typeof LonchJsApi.webCallCef === 'function' || LonchJsApi.clientType === 'windowApp';
  };

  /**
   * 判断是否在windowsAppV2
   */
  LonchJsApi.isInCefV2 = function () {
    return typeof LonchJsApi.webCallAppV2 === 'function' && typeof LonchJsApi.iAmPC === 'function';
  };

  /**
   * @description: 简单版桥接协议
   * @return {*}
   */
  LonchJsApi.isInSimpleApp = function () {
    return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['webCallAppSimple'])
    || typeof LonchJsApi.webCallAppSimple === 'function'
  };

  /**
   * @description: 简单版桥接协议-PC
   * @return {*}
   */
  LonchJsApi.isInSimplePcApp = function () {
    return typeof LonchJsApi.webCallAppSimple === 'function' && typeof LonchJsApi.iAmPC === 'function';
  };
  /**
   * @description: 简单版桥接协议-一体机
   * @return {*}
   */
  LonchJsApi.isInSimpleOneMachineApp = function () {
    return typeof LonchJsApi.webCallAppSimple === 'function' && typeof LonchJsApi.iAmOneMachine === 'function';
  };

  /**
   * 判断是否为多web框架
   */
  LonchJsApi.isMultiWebFramework = function () {
    return config.isMultiWebFramework;
  };

  /**
   * 获取webId自增序列
   */
  LonchJsApi.getWorkIdOrder = (function() {
    let orderMap = {};
    return function(timestamp) {
      if(orderMap[timestamp]) {
        orderMap[timestamp]++;
      } else {
        orderMap = {[timestamp]: 1};
      }
      // 不够7位，则补0
      return orderMap[timestamp].toString().padStart(6, '0');
    }
  })();

  /**
   * 判断App版本是否过低
   */
  LonchJsApi.isLowAppVersion = function () {
    let version = config.client.clientInfo ? config.client.clientInfo.version : '';
    let lastCanUseAppVersion = config.lastCanUseAppVersion ? config.lastCanUseAppVersion[LonchJsApi.clientType] : '';
    if (version && lastCanUseAppVersion) {
      if (version === lastCanUseAppVersion) {
        return true;
      }
      let parsedLastCanUseAppVersion = lastCanUseAppVersion.replace(/^v/i, '').split('.');
      let parsedVersion = version.replace(/^v/i, '').split('.');
      for (let i = 0; i < 3; i++) {
        let pV = Number(parsedVersion[i]);
        let pLastV = Number(parsedLastCanUseAppVersion[i]);
        if (pLastV > pV) {
          return true;
        } else if (pLastV !== pV) {
          return false;
        }
      }
    }
    return false;
  };

  /**
   * 判断app是否支持缓存
   * @return {boolean}
   */
  LonchJsApi.isSupportCache = function () {
    return !!config.isSupportH5Cache;
  };
  /**
   * 完成方法
   * @param callback
   * @param context
   */
  LonchJsApi.ready = function (callback, context) {
    context = context || document;
    if (LonchJsApi.isReady) {
      callback.call(context);
    } else {
      LonchJsApi.readyCallbacks.push({fn: callback, context: context});
    }
  };

  /**
   * 触发ready绑定处理
   */
  LonchJsApi.callReady = function () {
    LonchJsApi.isReady = true;
    let callbacks = LonchJsApi.readyCallbacks;
    if (LonchJsApi.readyTimer) {
      clearTimeout(LonchJsApi.readyTimer);
      LonchJsApi.readyTimer = null;
    }
    if (callbacks.length > 0) {
      for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback.fn.call(callback.context);
      }
      LonchJsApi.readyCallbacks = [];
    }
  };

  /**
   * 生成UUID
   * @param len number 长度
   * @param radix number 进制(max 62) default:36位，16进制
   * @return {string}
   * @constructor
   */
  LonchJsApi.UUID = function (len, radix = 62) {
    if (radix > 62) {
      radix = 62;
    }
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    let i;
    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  };

  //LonchJsApi.formatDate = function (timestamp, format = 'yyyy-MM-dd hh:mm:ss') {
  //  if (!timestamp) {
  //    return timestamp;
  //  }
  //  let formated = format;
  //  const realDate = new Date(timestamp);
  //  let o = {
  //    'M+': realDate.getMonth() + 1,
  //    'd+': realDate.getDate(),
  //    'h+': realDate.getHours(),
  //    'm+': realDate.getMinutes(),
  //    's+': realDate.getSeconds(),
  //    'q+': Math.floor((realDate.getMonth() + 3) / 3),
  //    'S': realDate.getMilliseconds()
  //  };
  //  if (/(y+)/i.test(formated)) {
  //    formated = formated.replace(RegExp.$1, (realDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  //  }
  //  for (let k in o) {
  //    if (new RegExp('(' + k + ')').test(formated)) {
  //      formated = formated.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' +
  // o[k]).length)); } } return formated; };

  /**
   * 生成UUID
   */
  LonchJsApi.getSerialNumber = function () {
    // return 'WEBAPP' + LonchJsApi.UUID(32, 16);
    const isWebIdRex = /^\d{32,33}$/;
    let prefix = 'WEB';
    if(LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
      prefix = 'WEBAPP';
    }
    if(config.terminalId && isWebIdRex.test(config.terminalId)) {
      const webId = config.terminalId.substr(13,13);
      const timestamp = new Date().getTime();
      return prefix + timestamp + webId + LonchJsApi.getWorkIdOrder(timestamp);
    } else {
      return prefix + LonchJsApi.UUID(32, 16);
    }
  };

  /**
   * 获取流水号
   * @return {string}
   */
  //LonchJsApi.serialNumber = function () {
  //  if (window.URL && window.URL.createObjectURL && typeof window.URL.createObjectURL === 'function') {
  //    let blobUrl = URL.createObjectURL(new Blob());
  //    URL.revokeObjectURL(blobUrl);
  //    return blobUrl.substring(blobUrl.lastIndexOf('/') + 1).toUpperCase();
  //  } else {
  //    return LonchJsApi.formatDate(new Date(), 'yyyyMMddhhmmssS') + LonchJsApi.UUID(32, 36);
  //  }
  //};
  /**
   * 通讯接口
   * appCallWeb, 前端实现，
   * webCallApp App客户端实现注入
   * 1.0桥接协议不支持2.0接口规范
   */
  LonchJsApi.appCallWeb = function (sn, data) {
    if (utils.isEmpty(sn)) {
      webLog.log({code: 'WEBAPP040000', level: 'error', msg: 'SN 不能为空'}, null, null, data, '', config);
      return;
    }
    let result;
    let appCallBack = LonchJsApi.AppCallBacks[sn];
    // 删除对象
    delete LonchJsApi.AppCallBacks[sn];
    //let err = {};
    let time = appCallBack ? new Date().getTime() - appCallBack.startTime : 0;
    if (appCallBack && appCallBack.frameName) {
      // 发起通讯，结果给嵌套页面处理
      LonchJsApi.postMessage('APP-CALL-WEB', {sn: sn, data: data}, appCallBack.frameName);
    } else {
      try {
        result = JSON.parse(decodeURIComponent(data.replace(/[\r\n]/g, ''))); // \n是换行、\r是回车、解决空格变成+的问题，
      } catch (e) {
        Message({
          message: 'JSON 解析错误',
          type: 'warning'
        });
        /**
         * data为空或不可解析均上报JSON 解析错误
         */
        webLog.log(
          {
            code: 'WEBAPP020001',
            level: 'error',
            sid: sn,
            msg: 'JSON 解析错误 SN：' + sn
          },
          appCallBack.service, appCallBack.params, data, time, config
        );
        result = {
          error: 'JSON 解析错误',
          opFlag: false,
          code: 'WEBAPP020001',
          serviceResult: null
        };
      }
      if (appCallBack) {
        if (appCallBack.isLoading) {
          closeLoading(sn);
        }
        if (typeof result === 'object' && result.opFlag && JSON.parse(result.opFlag)) {
          if (appCallBack.success && typeof appCallBack.success === 'function') {
            try {
              appCallBack.success.call(appCallBack.context, result);
            } catch (e) {
              webLog.log({
                code: 'WEBAPP030000',
                level: 'error',
                sid: sn,
                msg: '***前端代码报错*** SN:' + sn + e.toString()
              }, appCallBack.service, appCallBack.params, data, time, config);
            }
          }
        } else {
          let msg = typeof result === 'object' ? result.error || '数据返回异常' : '数据返回异常';
          // 网关返回服务拒绝访问,请联系管理员授权，时，转换提示内容
          if (typeof result === 'object' && result.code === 'SERGTW1201100005') {
            msg = '当前页面无权限访问，请联系管理员授权！';
          }
          if (appCallBack.service && !appCallBack.service.noErrTips) {
            API.showMessage({
              message: msg,
              requestConfig: appCallBack.requestConfig
            });
          }
          if (appCallBack.error && typeof appCallBack.error === 'function') {
            try {
              appCallBack.error.call(appCallBack.context, result);
            } catch (e) {
              webLog.log({
                code: 'WEBAPP030000',
                level: 'error',
                sid: sn,
                msg: '***前端代码报错*** SN:' + sn + e.toString()
              }, appCallBack.service, appCallBack.params, data, time, config);
            }
          }
          // 上报错误日志，正常返回数据设置级别为warn
          if (result) { // JSON 解析错误，不再重复上报，
            let level = typeof result === 'object' ? 'warn' : 'error';
            if (typeof result === 'object' && result.error && /异常|无法解析|报错|系统繁忙|服务拒绝访问/i.test(result.error)) {
              level = 'error';
            }

            webLog.log(
              {
                code: typeof result === 'object' ? result.code || 'WEBAPP020000' : 'WEBAPP020000',
                level: level,
                sid: sn,
                msg: typeof result === 'object' ? result.error + 'SN:' + sn : '数据返回异常 SN:' + sn
              },
              appCallBack.service, appCallBack.params, data, time, config
            );
          }
          // token为空，token已过期等发起退出登录命令
          if (typeof result === 'object' && (result.code === 'SERGTW1201100006' || result.code === 'SERGTW1201100003' || /^token/.test(result.error))) {
            // token不能为空，token已过期等，发起App退出登录处理
            LonchJsApi.callApp({
              command: 'cmdAppLogout',
              args: {}
            });
          }
        }
      } else if (LonchJsApi.AppMsgHandlers[sn]) {
        // 此处SN为协议名称
        if (config.activatedOrigin) {
          LonchJsApi.postMessage('APP-CALL-WEB', {sn: sn, data: data}, config.activatedOrigin);
        } else {
          // 优先判断是否是服务器主动下放的数据
          if ( this.triggerAppMsgHandlersServerSend(sn, result) ) {
            return
          }
          let msgHandlers = LonchJsApi.AppMsgHandlers[sn];
          if (msgHandlers && msgHandlers.length > 0) {
            for (let agreement in msgHandlers) {
              if (msgHandlers.hasOwnProperty(agreement)) {
                let handler = msgHandlers[agreement];
                if (handler && typeof handler === 'function') {
                  try {
                    handler.call(window, result);
                  } catch (e) {
                    webLog.log({
                      code: 'WEBAPP030000',
                      level: 'error',
                      sid: sn,
                      msg: '***前端代码报错***' + e.toString()
                    }, {}, {}, data, time, config);
                  }
                }
              }
            }
          }
        }
      } else {
        webLog.log({code: 'WEBAPP010001', level: 'info', msg: '未绑定数据回调 SN:' + sn}, null, null, data, time, config);
        Message({
          message: '未绑定数据回调 SN:' + sn,
          type: 'warning'
        });
      }
    }
  };

  /**
   * 通讯接口V2版本
   * appCallWebV2
   */
  LonchJsApi.appCallWebV2 = function (data) {
    // console.log('****appCallWebV2****', data);
    let appData;
    try {
      appData = JSON.parse(decodeURIComponent(data.replace(/[\r\n]/g, ''))); // 解决空格变成+的问题
      if(appData.command === 'appNoticeBaseDataChanged') {
        console.log('****appCallWebV2**** 监听到appNoticeBaseDataChanged', data);
      }
    } catch (e) {
      Message({
        message: 'JSON 解析错误',
        type: 'warning'
      });
      /**
       * data为空或不可解析均上报JSON 解析错误
       */
      webLog.log({code: 'WEBAPP020001', level: 'error', msg: 'JSON 解析错误：'}, {}, {}, data, 0, config);
      return; // 解析错误，停止处理
    }
    let sn = appData.sn;
    let command = appData.command;
    let result = appData.args.data;
    let serviceResult;
    let appCallBack = LonchJsApi.AppCallBacks[sn];
    //console.log('****appCallWebV2 sn****', sn);
    let time = appCallBack ? new Date().getTime() - appCallBack.startTime : 0;
    let protocolVersion = appData.version;
    if (appCallBack) {
      // 删除回调函数
      delete LonchJsApi.AppCallBacks[sn];
      if (appCallBack.isLoading) {
        closeLoading(sn);
      }
      // 如果回调函数指定了iframe，返回iframe
      if (appCallBack.frameName) {
        LonchJsApi.postMessage('APP-CALL-WEB-V2', data, appCallBack.frameName);
        // 将消息发送给iframe后，
        return;
      }
      console.log('result', command, result, appCallBack)
      // 数据转换
      if (command === 'getAppProxyDataResult') {
        // 代理协议或接口返回的协议版本或接口请求版本
        protocolVersion = result.protocolVersion || appCallBack.service.version;
        console.log('protocolVersion', protocolVersion)
        // 代理协议区分1.0、2.0、3.0接口
        if (['2.0', '3.0'].includes(protocolVersion)) {
          serviceResult = Object.assign({}, result.serviceResult);
          serviceResult.error = serviceResult.reason || result.errorMsg;
          serviceResult.opFlag = serviceResult.success === undefined ? result.opFlag : serviceResult.success;
          serviceResult.code = serviceResult.errorCode || result.errorCode;
          serviceResult.serviceResult = serviceResult.data;
        } else {
          serviceResult = result;
        }
      } else if (['2.0', '3.0'].includes(protocolVersion)) { // 桥接协议返回2.0格式
        // 其他接口 根据app版本区分接口是否为2.0
        serviceResult = Object.assign({}, result.serviceResult);
        serviceResult.error = serviceResult.reason || result.errorMsg;
        serviceResult.opFlag = serviceResult.success === undefined ? result.opFlag : serviceResult.success;
        serviceResult.code = serviceResult.errorCode || result.errorCode;
        serviceResult.serviceResult = serviceResult.data;
      } else {
        // 其他情况默认1.0接口
        serviceResult = result;
      }
      if (result.opFlag && serviceResult.opFlag) {
        if (appCallBack.success && typeof appCallBack.success === 'function') {
          try {
            appCallBack.success.call(appCallBack.context, serviceResult, ['2.0', '3.0'].includes(protocolVersion) ? result : null);
          } catch (e) {
            webLog.log({
              code: 'WEBAPP030000',
              level: 'error',
              sid: sn,
              msg: '***前端代码报错*** SN:' + sn + e.toString()
            }, appCallBack.service, appCallBack.params, data, time, config);
          }
          try {
            // 设置缓存
            if (appCallBack.service.cache) {
              utils.setCache(appCallBack.service, appCallBack.params, serviceResult, config, appCallBack.context);
            }
          } catch (e) {
            console.log('设置缓存失败！！！', e);
          }
        }
      } else {
        // 网关返回服务拒绝访问,请联系管理员授权，时，转换提示内容
        let errorCode = typeof serviceResult === 'object' ? (serviceResult.errorCode || serviceResult.code || '').toUpperCase() : '';
        let errorMsg = serviceResult.error || serviceResult.errorMsg || result.errorMsg;
        if (tokenInvalidList.includes(errorCode)) {
          Login.toLogOutConfirmCommon({data: {...result, errorMsg}, type: 'cmdAppLogout'})
        } else if (errorCode === 'SERGTW1201100005') {
          API.showMessage({
            message: errorMsg || '当前页面无权限访问，请联系管理员授权！',
            requestConfig: appCallBack.requestConfig
          });
          webLog.log({
            code: errorCode,
            level: 'error',
            sid: sn,
            msg: errorMsg || '当前页面无权限访问，请联系管理员授权！'
          }, appCallBack.service, appCallBack.params, data, time, config);
        } else {
          if (serviceResult) { // JSON 解析错误，不再重复上报，
            let level = typeof serviceResult === 'object' ? 'warn' : 'error';
            // 错误消息含有特别错误含义为Error
            if (errorMsg && /异常|报错|系统繁忙|服务拒绝访问|sql error|error/i.test(errorMsg)) {
              level = 'error';
            }
            // ssl,目前App端无法处理，暂定降级为warn级别 Read error: ssl=0x789a942348: I/O error during system call
            if (errorMsg && /Read error: ssl=/i.test(errorMsg)) {
              level = 'warn';
            }
            // “代理请求出错,接口请求异常。"是windows app请求的网络不通报错，降级为warn
            if (errorMsg && /代理请求出错,接口请求异常/i.test(errorMsg)) {
              level = 'warn';
            }
            const adjustErrorLevel = new AdjustErrorLevel();
            level = adjustErrorLevel.status2warn(serviceResult, level);
            webLog.log(
              {
                code: typeof serviceResult === 'object' ? serviceResult.code || 'WEBAPP020000' : 'WEBAPP020000',
                level: level,
                sid: sn,
                msg: errorMsg
              },
              appCallBack.service, appCallBack.params, data, time, config
            );
          }
          if (appCallBack.service && !appCallBack.service.noErrTips) {
            API.showMessage({
              message: errorMsg || '数据返回异常',
              requestConfig: appCallBack.requestConfig
            });
          }
        }
        // 发起错误回调
        if (appCallBack.error && typeof appCallBack.error === 'function') {
          try {
            appCallBack.error.call(appCallBack.context, serviceResult, ['2.0', '3.0'].includes(protocolVersion) ? result : null);
          } catch (e) {
            webLog.log({
              code: 'WEBAPP030000',
              level: 'error',
              sid: sn,
              msg: '***前端代码报错*** SN:' + sn + e.toString()
            }, appCallBack.service, appCallBack.params, data, time, config);
          }
        }
      }
    } else if (LonchJsApi.AppMsgHandlers[command]) {
      // App 主调
      if (config.activatedOrigin) {
        LonchJsApi.postMessage('APP-CALL-WEB-V2', data, config.activatedOrigin);
      }
      try {
        LonchJsApi.triggerAppMsgHandlers(command, result, sn);
      } catch (e) {
        webLog.log(
          {
            code: 'WEBAPP030000',
            level: 'error',
            sid: sn,
            msg: '***前端代码报错***:' + e.toString()
          }, {}, {}, data, time, config
        );
      }
    } else {
      webLog.log({code: 'WEBAPP010001', level: 'warn', msg: '未绑定数据回调数据'}, null, null, data, time, config);
      // App发送无协商定通知，不打印页面提示，只记录日志
      //Message({
      //  message: '未绑定数据回调数据',
      //  type: 'warning'
      //});
    }
  };

  LonchJsApi.appCallWebSimple = LonchJsApi.appCallWebV2;

  /**
   * 触发App消息监听器
   * @param command
   * @param data
   * @param sn
   */
  LonchJsApi.triggerAppMsgHandlers = function (command, result, sn) {
    console.log('-----------command---------', result)
    // 优先判断是否是服务器主动下放的数据
    if ( this.triggerAppMsgHandlersServerSend(command, result, sn) ) {
      return
    }

    let msgHandlers = LonchJsApi.AppMsgHandlers[command];
    if (msgHandlers && msgHandlers.length > 0) {
      for (let agreement in msgHandlers) {
        if (msgHandlers.hasOwnProperty(agreement)) {
          let handler = msgHandlers[agreement];
          if (handler && typeof handler === 'function') {
            handler.call(window, Object.assign({serviceResult: result}, result));
          }
        }
      }
    }
  };

  /**
   * 触发APP消息接受, 服务器主动发送消息监听器
   * @param command
   * @param data
   */
  LonchJsApi.triggerAppMsgHandlersServerSend = function (command, result, sn = '') {
    const serviceResult = result.serviceResult || result
    if (command === 'appSendDataToH5' && serviceResult && String(serviceResult.type) === '2000' ) {
      let msg = serviceResult.msg
      // 服务器主动发送的消息，由APP传给H5
      try {
        if(typeof serviceResult.msg === 'string') {
          msg = JSON.parse(serviceResult.msg);
        }
      } catch (e) {
        Message({
          message: 'appSendDataToH5发送的msg字段数据，不是json字符串格式，解析失败',
          type: 'warning'
        });
        // 解析msg为json出错，报错
        webLog.log(
          {
            code: 'WEBAPP030000',
            level: 'error',
            sid: sn,
            msg: `***前端代码报错***：appSendDataToH5发送的msg字段数据，不是json字符串格式，解析失败， ${e.toString()}`
          }, {}, {}, result, 0, config
        );
      }

      try {
        // 触发服务器主动发送消息监听器
        LonchJsApi.triggerServerSendMsgHandlers(msg || {});
      } catch(e) {
        Message({
          message: '解析失败',
          type: 'warning'
        });
        // 解析msg为json出错，报错
        webLog.log(
          {
            code: 'WEBAPP030000',
            level: 'error',
            sid: sn,
            msg: `***前端代码报错***：triggerServerSendMsgHandlers报错： ${e.stack} `
          }, {}, {}, result, 0, config
        );
      }
      return true;
    }
    return false
  }

  /**
   * 触发服务器主动发送消息监听器
   * @param command
   * @param data
   */
  LonchJsApi.triggerServerSendMsgHandlers = function (result) {
    const projectName = result.projectName || ''; // 服务名称

    let serviceResult = result.serviceResult || {}; //
    // 字符串JF 解析成JSON
    if(typeof result.serviceResult === 'string') {
      try {
        serviceResult = JSON.parse(result.serviceResult)
      } catch(e) {
        Message({
          message: '服务器主动发送消息的serviceResult解析成json报错',
          type: 'warning'
        });
          /**
           * 解析报错
           */
          webLog.log(
            {
              code: 'WEBAPP030000',
              level: 'error',
              msg: `***前端代码报错***：服务器主动发送消息的serviceResult解析成json报错`,
              sid: result.sid
            }, {}, {}, result, 0, config
          );
          return
      }
    }
    const type = serviceResult.type || ''; // 服务中唯一编码，标识业务操作（6位数字）
    const data = serviceResult.data || {}; // 业务数据

    const command = `${projectName}-${type}` // 服务器主动发起的命令，格式：服务名称-唯一编码

    if(!projectName || !type) {
      Message({
        message: '服务器主动发送消息的projectName或code为空',
        type: 'warning'
      });
      // 无命令时，报错
      webLog.log(
        {
          code: 'WEBAPP030000',
          level: 'error',
          msg: `***前端代码报错***：服务器主动发送消息的projectName或code为空`,
          sid: result.sid
        }, {}, {}, result, 0, config
      );
      return
    }

    // 获取当前命令的事件
    let msgHandlers = LonchJsApi.serverSendMsgHandlers[command];
    // 无绑定command的事件时退出
    if (!msgHandlers || !msgHandlers.length > 0) {
      return;
    }

    // command绑定的事件，依次执行
    msgHandlers.forEach(commandFun => {
      if (commandFun && typeof commandFun === 'function') {
        commandFun.call(window, data);
      }
    })
  };
  /**
   * 创建参数
   * @param service
   * @param demand
   * @param cfg
   * @param _appSecretType 是否加密请求
   */
  LonchJsApi.createProtocolData = function (service, demand, cfg, _appSecretType) {
    let data = {};
    let args = {};
    let command = service.url ? service.command || 'getAppProxyData' : service.command;
    let method = (service.method || 'POST').toUpperCase();
    let commonParams = config.commonParams;
    let headers = service.config && service.config.headers ? service.config.headers : {};
    let moduleCode = utils.getModuleCode();
    let sn = demand && demand.sid ? demand.sid : LonchJsApi.getSerialNumber();
    let params = {};
    // 合并通用参数
    if (demand && demand instanceof FormData) {
      for (let p in commonParams) {
        if (commonParams.hasOwnProperty(p) && demand.get(p) === null) {
          demand.append(p, commonParams[p]);
        }
      }
    } else {
      demand = Object.assign({}, commonParams, demand);
    }
    if (moduleCode) {
      headers = Object.assign(headers, {'module-code': moduleCode});
      if (demand && demand instanceof FormData) {
        demand.append('moduleCode', moduleCode);
      } else {
        demand.moduleCode = moduleCode;
      }
    }
    // 现在2.0协议支持2.0接口，添加3.0协议支持
    if (['2.0', '3.0'].includes(service.version) && LonchJsApi.isInAppV2()) {
      headers = Object.assign(headers, {'protocol-version': service.version});
      // 只有代理协议封装demand参数
      if (command === 'getAppProxyData' && method === 'POST') {
        params.demand = demand;
        if (service.version === '2.0' && _appSecretType) {
          params.appSecretType = 2;
        }
      } else {
        params = demand;
      }
      params.sid = sn; // 2.0 协议添加sid参数
    } else {
      headers = Object.assign(headers, {'sid': sn});
      params = demand;
    }
    if (demand instanceof FormData) {
      params.append('ip', utils.getClientIp());
      params.append('timestamp', new Date().getTime());
    } else {
      params.ip = utils.getClientIp();
      params.timestamp = new Date().getTime();
    }
    let serviceConfig = {headers};
    if (service.url) {
      // const url = /^http[s]?:\/\//.test(service.url) ? service.url : /^http[s]?:\/\//.test(cfg.modules[service.module]) ? cfg.modules[service.module] + service.url : cfg.project.gateway + cfg.modules[service.module] + service.url
      // 解决sonar提示
      // 20241226
      let url;

      if (/^http[s]?:\/\//.test(service.url)) {
        url = service.url;
      } else if (/^http[s]?:\/\//.test(cfg.modules[service.module])) {
        url = cfg.modules[service.module] + service.url;
      } else {
        url = cfg.project.gateway + cfg.modules[service.module] + service.url;
      }


      /**
       * 代理请求添加网关的配置
       */
      if(command === 'getAppProxyData' && config.project && config.project.webSocketGateway) {
        /**
         * 默认http请求
         */
        const gateway = {
          type: 'http',
          version: service.version,
          scheme: 'hth'
        }
        const interfaceModules = InterfaceModules(
          config && config.modulesVersions
        );
        /**
         * 如果是webSocket的请求，添加scheme属性 wtw|wth(默认)
         */
        if(interfaceModules.check(service, url)) {
          gateway.type = 'websocket';
          gateway.scheme = interfaceModules.getScheme(service);
        }
        serviceConfig.gateway = gateway
      }

      if (LonchJsApi.isInAppV2()) {
        args = {
          data: {
            url,
            method: method,
            dataType: demand instanceof FormData ? 'FormData' : 'JSON',
            parameters: params,
          },
          config: serviceConfig // 2.0版本config为Json对象
        };
        data.version = service.version;
        /**
         * 代理请求, 桥接协议的版本修改为3.0
         */
        if(command === 'getAppProxyData' && config.project && config.project.webSocketGateway) {
          data.version = '3.0';
        }
      } else {
        args = {
          url,
          method: method,
          dataType: demand instanceof FormData ? 'FormData' : 'JSON',
          parameters: params,
          config: JSON.stringify(serviceConfig) // 就版本config对象为字符串
        };
      }
    } else {
      if (LonchJsApi.isInAppV2() || LonchJsApi.isInSimpleApp()) {
        args.data = params;
        data.version = '2.0'; // V2版本除了代理协议统一为2.0
        args.config = serviceConfig;
      } else {
        args = params || {};
      }
    }
    /**
     * 不同协议传参方式, 2.0协议参数部分封装一层data
     */
    data.sn = sn;
    data.args = args;
    data.command = command;
    return data;
  };

  /***********************************************************
   service 接口对象
   -command:协议名称
   params：参数
   success：返回回调
   error: 错误回调
   context：上下文对象
   postMessage->data:{
    sn:流水号
    command: 协议名称
    args:{
      //app内部协议时，args为参数列表，
      //代理协议时参数列表为，args.parameters
      url:'', // 接口地址
      method 请求方法，默认：post
      parameters 接口请求参数列表对象字符串
      config 请求头设置null||对象字符串，默认：不设置 **--新增配置
    }
   }
   ***********************************************************/
  LonchJsApi.webCallAppRequest = function (service, demand, success, error, context, requestConfig) {
    // console.log('config.modulesVersions', config, config.modulesVersions)
    const interfaceModules = InterfaceModules(
      config && config.modulesVersions
    );

    // console.log('****webCallAppRequest service demand:****',service, demand);
    context = context || this;
    // 无需处理的无回调是，绑定一个空回调函数
    success = success || function () {
    };
    let cfg = config;
    service.version = service.protocolVersion || service.version || interfaceModules.getListProp('version', service.module) || '2.0';// 默认2.0协议
    // 删除 demand._appSecretType（值为 2 表示 app 端 AES 加密）， 该参数放到 params 外层
    const _appSecretType = demand._appSecretType;
    delete demand._appSecretType;
    let data = LonchJsApi.createProtocolData(service, demand, cfg, _appSecretType);
    // console.log('桥接协议-参数', JSON.parse(JSON.stringify(data)))
    console.log('桥接协议-参数', JSON.parse(JSON.stringify(data)))
    if (success) {
      // 是否显示loading
      const isNoLoading = API.getIsNoLoading(requestConfig);

      LonchJsApi.AppCallBacks[data.sn] = {
        service: service,
        params: demand,
        success: success,
        error: error,
        args: data.args,
        context: context,
        requestConfig: requestConfig,
        startTime: new Date().getTime(),
        isLoading: !isNoLoading
      };
      if (!isNoLoading) {
        showLoading(data.sn);
      }
    }
    LonchJsApi.webCallAppFun(data)
  };

  LonchJsApi.webCallAppFun = function(data) {
    if (window.self !== window.top) {
      // 向顶级窗口发起通讯
      if (LonchJsApi.isInAppV2()) {
        LonchJsApi.postMessage('WEB-CALL-APP-V2', data);
      } else {
        LonchJsApi.postMessage('WEB-CALL-APP', data);
      }
    } else if (LonchJsApi.isInAppV2()) {
      LonchJsApi.callAppV2(data);
    } else if (LonchJsApi.isInSimpleApp()) {
      // 简单版协议
      // console.log('简单版桥接协议data:', data, JSON.stringify(data))
      LonchJsApi.callAppSimple(data);
    } else {
      LonchJsApi.callApp(data);
    }
  }

  /**
   * 发起 web主调V1
   * @param data
   */
  LonchJsApi.callApp = function (data) {
    // console.log('****callApp data:****', data);
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers['webCallApp']) {
      // ios 1.0
      window.webkit.messageHandlers['webCallApp'].postMessage(JSON.stringify(data));
    } else if (
      // mac 1.0
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers['webCallMac']
    ) {
      window.webkit.messageHandlers['webCallMac'].postMessage(JSON.stringify(data));
    } else if (typeof LonchJsApi.webCallApp === 'function') {
      // Android 1.0
      LonchJsApi.webCallApp(JSON.stringify(data));
    } else if (typeof LonchJsApi.webCallCef === 'function') {
      // PC客户端 1.0
      LonchJsApi.webCallCef(JSON.stringify(data));
    } else {
      console.log('*******not matched client********');
    }
  };

  /**
   * 发起2.0 web主调
   */
  LonchJsApi.callAppV2 = function (data) {
    //console.log('****callAppV2 sn:****', data.sn);
    if (window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers['webCallAppV2']) {
      // ios and mac 2.0 版本
      window.webkit.messageHandlers['webCallAppV2'].postMessage(JSON.stringify(data));
    } else if (typeof LonchJsApi.webCallAppV2 === 'function') {
      // Android,PC客户端 2.0版本
      LonchJsApi.webCallAppV2(JSON.stringify(data));
    }
  };

  /**
   * 发起simple web主调
   */
  LonchJsApi.callAppSimple = function (data) {
    if (window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers['webCallAppSimple']) {
      // ios and mac 简单版本
      window.webkit.messageHandlers['webCallAppSimple'].postMessage(JSON.stringify(data));
    } else if (typeof LonchJsApi.webCallAppSimple === 'function') {
      // Android,PC客户端 简单版本
      LonchJsApi.webCallAppSimple(JSON.stringify(data));
    }
  };

  /**
   * 绑定消息
   * @param handlers
   */
  LonchJsApi.bindMsgHandlers = function (handlers) {
    if (handlers) {
      for (let handler in handlers) {
        if (LonchJsApi.AppMsgHandlers.hasOwnProperty(handler)) {
          LonchJsApi.AppMsgHandlers[handler].push(handlers[handler]);
        }
      }
    }
  };

  /**
   * 取消绑定消息处理
   */
  LonchJsApi.unBindMsgHandlers = function (handlers) {
    if (handlers) {
      for (let handler in handlers) {
        if (LonchJsApi.AppMsgHandlers && LonchJsApi.AppMsgHandlers.hasOwnProperty(handler)) {
          LonchJsApi.AppMsgHandlers[handler] = utils.reject(LonchJsApi.AppMsgHandlers[handler], handlers[handler]);
        }
      }
    }
  };

  /**
   * 绑定服务端主动发送的消息
   * @param {Object} handlers 绑定消息的命令和函数{command: function}
   */
  LonchJsApi.bindServerSendMsgHandlers = function (handlers) {
    console.log('handlers', handlers)
    // handlers不是对象格式
    if (!handlers || Object.prototype.toString.call(handlers) !== '[object Object]' ) {
      console.warn(`handlers不是对象格式，无法绑定`)
      return
    }
    /**
     * 使用app下发消息的条件判断,如果是服务器主动下发,appSendDataToH5桥接协议为空时,设置为空数组
     */
    if ( !LonchJsApi.AppMsgHandlers.appSendDataToH5 ) {
      LonchJsApi.AppMsgHandlers.appSendDataToH5 = []
    }

    for (let command in handlers) {
      // 验证command是否已定义，没有进行定义
      if (!LonchJsApi.serverSendMsgHandlers.hasOwnProperty(command)) {
        LonchJsApi.serverSendMsgHandlers[command] = []
      }
      // 添加事件到command命令上
      LonchJsApi.serverSendMsgHandlers[command].push(handlers[command])
    }
  };

  /**
   * 取消绑定服务端主动发送的消息
   * @param {Object} handlers 取消绑定消息的命令和函数{command: function}
   */
  LonchJsApi.unBindServerSendMsgHandlers = function (handlers) {
    // handlers不是对象格式
    if (!handlers || Object.prototype.toString.call(handlers) !== '[object Object]' ) {
      console.warn(`handlers不是对象格式，无法取消绑定`)
      return
    }

    for (let command in handlers) {
      // 验证command是否已定义，没有退出
      if (!LonchJsApi.serverSendMsgHandlers.hasOwnProperty(command)) {
        console.warn(`${command}命令没有绑定服务端主动发送的消息，无法取消绑定`)
        return
      }
      // 移除command命令的handlers[command]函数
      LonchJsApi.serverSendMsgHandlers[command] = utils.reject(LonchJsApi.serverSendMsgHandlers[command], handlers[command]);
    }
  };

  /**
   * 发起窗口通讯-云服
   */
  LonchJsApi.postMessage = function (command, data, frameName, callBack, origin) {
    origin = origin ? origin : '*';
    let frame;
    if(frameName && window.frames[frameName]) {
      frame = window.frames[frameName];
    } else {
      frame = window.parent !== window.self ? window.parent : null;
    }
    if (frame) {
      let postData = {
        command: command,
        data: data,
        frameName: window.top === window.self ? '' : window.self.name
      };
      if (typeof callBack === 'function') {
        let sn = LonchJsApi.getSerialNumber();
        postData.sn = sn;
        LonchJsApi.postMessageCallBacks[sn] = callBack;
      }
      frame.postMessage(JSON.stringify(postData), origin);
    }
  };

  /**
   * 安装自定义APP消息监听器
   * @param msgHandlers
   */
  LonchJsApi.setupCustomAppMsgHandlers = function (msgHandlers) {
    LonchJsApi.AppMsgHandlers = Object.assign(LonchJsApi.AppMsgHandlers, msgHandlers);
  };

  /**
   * 初始化窗口协议消息
   */
  LonchJsApi.initMessageListener = function () {
    window.addEventListener('message', function (event) {
      if (event.data === 'undefined') {
        return;
      }
      let msgData = typeof event.data === 'string' && utils.isJsonString(event.data) ? JSON.parse(event.data) : event.data;
      postMessageHandlers(msgData);
    });
    // 获取是否在App中, 内嵌页直接发起获取公共数据
    if (window.self !== window.top) {
      LonchJsApi.postMessage('INNER-FRAME-READY', {}, window.self.name, function (data) {
        config.token = data.token;
        config.loginTime = data.loginTime;
        config.isSupportH5Cache = data.isSupportH5Cache;
        config.userInfo = data.userInfo;
        config.versionConfig = data.versionConfig;
        config.permissions = data.permissions;
        config.isInitialized = true;
        config.isMultiWebFramework = data.isMultiWebFramework;
        config.projectName = data.projectName;
        config.project = data.project;
        config.projectTitle = data.projectTitle;
        config.customSettings = data.customSettings;
        config.client.clientInfo = data.clientInfo;
        LonchJsApi.isTopWindowInApp = data.isInApp;
        LonchJsApi.clientType = data.clientType;
        config.isCommonDataConfigInitialized = data.isCommonDataConfigInitialized;
        config.isCommonDataPreLoadingInitialized = data.isCommonDataPreLoadingInitialized;
        config.commonDataConfig = data.commonDataConfig;

        config.appName        = data.appName || config.appName
        config.projects       = data.projects || config.projects || []
        config.origins        = data.origins || config.origins || []
        config.commonParams   = data.commonParams || config.commonParams || {}
        config.isLogin        = data.isLogin || config.isLogin
        config.netStatus      = data.netStatus || config.netStatus
        config.client.appName = data.clientAppName || config.client.appName
        config.isVisitor      = data.isVisitor || config.isVisitor
        config.terminalId     = data.terminalId || config.terminalId
        config.sk             = data.sk || config.sk
        config.permissionTree = data.permissionTree;
        config.userRoles = data.userRoles;

        // LonchJsApi初始化完成
        LonchJsApi.callReady();
      });
      // 防止被其他网站引入，不执行ready回调
      LonchJsApi.readyTimer = setTimeout(
        function () {
          LonchJsApi.callReady();
        },
        LonchJsApi.readyTimeout
      );
    } else {
      LonchJsApi.callReady();
    }
  };

  /**
   * @param data
   *  url 实际打开路径（不做处理，需要编码）url为空时，路由模式routePath必传，非路由模式path必传
   *  title 页面标题（需要编码）
   *  routePath 路由地址
   *  originName 指定项目名称
   *  path 路径默认 /index.html 非必须
   *  query 参数列表 非必须
   *  config 打开app配置 非必须
   *  iframe 是否用组件里的iframe打开地址
   */
  LonchJsApi.openUrl = function (data) {
    if (window.self !== window.top) {
      return LonchJsApi.postMessage('INNER-OPEN-URL', data);
    }

    function createUrl (args) {
      if (args.url) {
        return args.url;
      }
      let arr = [];
      if (args.path && 'http[s]?:'.test(args.path)) {
        arr.push(args.path);
      } else if (args.originName !== '') {
        let origins = config.origins && config.origins.length > 0 ? config.origins : config.commonDataConfig.origins;
        let origin = utils.matchedData(origins, 'name', args.originName, true);
        if (origin && origin.length > 0) {
          arr.push(origin[0].domain);
        }
        arr.push(args.path || '/index.html');
      }
      if (args.routePath) {
        // 20241207这行没用到，所以注释
        // /^#/.test(args.routePath);
        if (args.originName === '') {
          arr.push(args.routePath);
        } else {
          arr.push(/^#/.test(args.routePath) ? args.routePath : '#' + args.routePath);
        }
      }
      return utils.transformationMachedVersion(arr.join(''), config.versionConfig);
    }

    let url = createUrl(data);
    if (LonchJsApi.isMultiWebFramework() && data.originName !== '' && data.target !== '_blank' && data.target !== 'iframe') {
      let urlUrl = new URL(url);
      let originPath = urlUrl.origin + urlUrl.pathname;
      let locationOriginPath = window.location.origin + window.location.pathname;
      if (/\//.test(window.location.pathname)) {
        locationOriginPath += 'index.html';
      }
      // todo 判断是否或略版本
      if (locationOriginPath.indexOf(originPath) >= 0) {
        // 当前项目
        let routePath = urlUrl.hash.replace('#', '');
        router.push({
          path: routePath,
          query: data.query
        });
      } else {
        let toUrl = utils.makeUrl(url, data.query);
        router.push({
          path: config.multiFramesRouterPath || '/admin/multiFrames',
          query: {url: window.btoa(encodeURIComponent(toUrl)), moduleCode: data.query ? data.query.moduleCode : ''}
        });
      }
    } else {
      const href = utils.makeUrl(url, data.query);
      if((LonchJsApi.isInApp() || LonchJsApi.isInAppV2())) {
        // 在APP中需要先判断该资源包是否已下载
        API.send(
          {'command': 'getResourcePackageInfo'},
          {
            url: encodeURIComponent(url)
          },
          function (res) {
            const result = res.data || {};
            if(result.is_downloaded) {
              const isBackTitleBar = data && typeof data.isBackTitleBar === 'boolean' ? data.isBackTitleBar : true;
              const args = {
                url: href,
                isBackTitleBar,
                title: data && data.title || '',
                config: {
                    isBackTitleBar,
                    title: data && data.title || ''
                }
              }
              if (data.target === '_blank') {
                // window.open(href);
                API.send({command: 'cmdAppOpenUrl'}, args, function () { }, function () { }, this, true);
              } else if(data.target === 'iframe') {
                data.iframe.src = url;
              } else {
                // window.location.href = href;
                API.send({command: 'cmdAppOpenUrl'}, args, function () { }, function () { }, this, true);
              }
            } else {
              Message({
                message: '页面加载失败，请重试',
                type: 'warning'
              });
            }
          },
          function () {
          },
          this,
          true
        );
      } else {
        if (data.target === '_blank') {
          window.open(href);
        } else if(data.target === 'iframe') {
          data.iframe.src = url;
        } else {
          window.location.href = href;
        }
      }
    }
  };
  /**
   * 打开菜单
   * @param menu
   * @param params
   */
    // 非朗致项目，比如：任务调度中心，不是单页面的，所以链接中不用
  const specialProcessedDomain = ['xxljob', 'cloudConsultBoss', 'cloudConsultZskt'];
  // 不是大前端的项目，但是使用vue方便，连接上添加#
  const noFrontEndDomain = ['cloudPharmacyBackend', 'cloudPharmacyUprr', 'cloudConsultClinic'];
  LonchJsApi.openMenu = function (menu, params = {}) {
    menu.params = menu.params || {};
    params = Object.assign({}, {moduleCode: menu.code}, menu.params, params);
    if (LonchJsApi.isMultiWebFramework() && window.self !== window.top) {
      return LonchJsApi.postMessage('INNER-OPEN-MENU', Object.assign({}, menu, {params: params}));
    }
    let domainName = menu.channel || 'manage';
    if (menu && /^\/|^#\//.test(menu.url)) {
      // menu.url 相对路径开始的资源非指定项目名称外全部为manage项目
      let origins = config.origins && config.origins.length > 0 ? config.origins : config.commonDataConfig.origins;
      let domain = utils.matchedDataX(origins, 'name', domainName)[0].domain;
      if (config.domainName === domainName || window.location.origin === domain) {
        // 域名相同或名称相同伟同一项目
        router.push({
          path: utils.makeUrl(/^http[s]?:\/\//.test(menu.url) ? new URL(menu.url).hash.replace(/^#/, '') : menu.url, params)
        });
      } else if(specialProcessedDomain.some(v => domain.includes(v)) || specialProcessedDomain.includes(domainName)) {
        params.token = vm ? vm.CFG.token : '';
        let url = utils.makeUrl((domain + menu.url), params);
        LonchJsApi.router2OtherProduct(url, params);
      }
      /**
       * 大前端,判断domainName
       * */
      else if( noFrontEndDomain.includes(domainName)) {
        let url = utils.makeUrl(`${domain}/#${menu.url}`, params);
        LonchJsApi.router2OtherProduct(url, params);
      } else {
        let menuUrl = function (url, domain) {
          if (/^http[s]?:\/\//.test(url)) {
            let origin = new URL(url).origin;
            let originRegStr = '^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.');
            let pathname = '/index.html';
            let newPathName = domain + pathname;
            // 切换版本入口
            let re = new RegExp(originRegStr + '(\\/v\\d+\\.\\d+\\.\\d+)?\\/(index\\.html)?');
            url = url.replace(re, newPathName);
          } else {
            url = /^#/.test(url) ? domain + '/index.html' + url : domain + '/index.html' + '#' + url;
          }
          return url;
        }(menu.url, domain);

        let url = utils.makeUrl(menuUrl, params);
        if (config.versionConfig && config.versionConfig.length > 0) {
          url = utils.transformationMachedVersion(url, config.versionConfig);
        }
        // 判断是否是在云服APP中
        // const isInLonchCloud = vm && vm.CFG && vm.CFG.client && vm.CFG.client.clientInfo && vm.CFG.client.clientInfo.name === 'LonchCloud';
        if((LonchJsApi.isInApp() || LonchJsApi.isInAppV2())) {
          // 在APP中需要先判断该资源包是否已下载
          API.send(
            {'command': 'getResourcePackageInfo'},
            {
              url: encodeURIComponent(url)
            },
            function (res) {
              const result = res.data || {};
              if(result.is_downloaded) {
                // APP返回有这个资源包，才跳转过去
                LonchJsApi.router2OtherProduct(url, params);
              } else {
                console.log('资源未准备好')
                Message({
                  message: '页面加载失败，请重试',
                  type: 'warning'
                });
              }
            },
            function () {
            },
            this,
            true
          );
        } else {
          LonchJsApi.router2OtherProduct(url, params);
        }
      }
    } else if (menu && menu.url && /^http[s]?:\/\//.test(menu.url)) {
      // 没有绑定域名名称且以http开始的，使用multiFrames加载管理
      let url = utils.makeUrl(menu.url, params);
      if (config.versionConfig && config.versionConfig.length > 0) {
        url = utils.transformationMachedVersion(url, config.versionConfig);
      }
      LonchJsApi.router2OtherProduct(url, params);
    } else {
      router.push({
        path: utils.makeUrl(menu.url, params)
      });
    }
  };
  /**
   * 通知父页面，使iframe全屏显示
   * @param {*} data
   */
  LonchJsApi.iframeFullScreen = function (fullscreenType) {
    LonchJsApi.postMessage('IFRAME-FULLSCREEN', { fullscreenType });
  }
  /**
   * 通知父页面，使iframe退出全屏显示
   * @param {*} data
   */
  LonchJsApi.iframeExitFullScreen = function (fullscreenType) {
    LonchJsApi.postMessage('IFRAME-EXIT-FULLSCREEN', { fullscreenType });
  }
  /**
   * 判断某个iframe是否全屏
   * @param {*} iframe
   * @returns
   */
  // LonchJsApi.isIframeInFullscreen = function (iframe) {
  //   if (
  //     // 标准方法
  //     document.fullscreenElement === iframe ||
  //     // 兼容 WebKit 内核浏览器 (Chrome, Safari)
  //     document.webkitFullscreenElement === iframe ||
  //     // 兼容 Firefox
  //     document.mozFullScreenElement === iframe ||
  //     // 兼容 IE/Edge
  //     document.msFullscreenElement === iframe
  //   ) {
  //     return true;
  //   }
  // }
  /**
   * 设置iframe标签全屏展示
   * @param {*} frameName
   * @param {*} type
   */
  LonchJsApi.setupIframeScreen = function (frameName, data, type) {
    if(frameName) {
      const fullscreenType = data.fullscreenType;
      // 浏览器页面全屏显示
      if (fullscreenType === 'page') {
        // 左侧菜单栏
        const leftSideElement = document.querySelector('.left-side');
        // 云服顶部元素
        const mainHeaderElement = document.querySelector('.main-content .viewport-header.viewport-header-l');
        // 去除云服顶部元素后, 页面内容元素, 需要去除 padding-top 样式
        const viewportHeaderElement = document.querySelector('.main-content .viewport-header.viewport-header-l~.viewport-view');
        // 类型为全屏
        if (type === 'fullscreen') {
          // 全局变量 $$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS 用于存储全屏前的样式参数，用于退出全屏时恢复样式
          // 如果全局变量存在, 则表示已经在全局记录, 不再重新记录
          if (window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS) {
            return;
          }
          window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS = {};
          // 左侧菜单栏隐藏, 并记录当时 display 的值
          if (leftSideElement) {
            window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.leftSideElement = leftSideElement.style.display;
            leftSideElement.style.display = 'none';
          }
          // 云服顶部元素隐藏, 并记录当时 display 的值
          if (mainHeaderElement) {
            window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.mainHeaderElement = mainHeaderElement.style.display;
            mainHeaderElement.style.display = 'none';
          }
          // 去除云服顶部元素后, 页面内容元素, 需要去除 padding-top 样式, 并记录当时 padding-top 的值
          if (viewportHeaderElement) {
            window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.viewportHeaderElement = viewportHeaderElement.style.paddingTop;
            viewportHeaderElement.style.paddingTop = '0';
          }
          // 退出浏览器全屏, 恢复进入全屏前的样式 (和进入全屏配合使用)
        } else if (type === 'exitFullscreen') {
          // 恢复左侧菜单栏的 display 的值
          if (leftSideElement) {
            if (window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS) {
              leftSideElement.style.display = window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.leftSideElement;
            }
          }
          // 恢复云服顶部元素的 display 的值
          if (mainHeaderElement) {
            if (window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS) {
              mainHeaderElement.style.display = window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.mainHeaderElement;
            }
          }
          // 恢复去除云服顶部元素 padding-top 的值
          if (viewportHeaderElement) {
            if (window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS) {
              viewportHeaderElement.style.paddingTop = window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS.viewportHeaderElement;
            }
          }
          // 退出全屏, 清空全局变量 $$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS
          window.$$setupIframeScreen_FULLSCREEN_MEMORY_STYLE_PARAMS = null;
        }
        // 整个浏览器全屏, 相当于 F11
      } else if (fullscreenType === 'browser') {
        // 判断浏览器全屏状态
        const fullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
        // 类型为 fullscreen
        if(type === 'fullscreen') {
          // 判断当前全屏状态, 如果是全屏, 则退出全屏, 否则进入全屏
          if (fullscreen) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
            // 全屏的 iframe 元素
            const element = document.querySelector(`iframe[name="${frameName}"]`);
            if(element) {
              if (element.requestFullscreen) {
                element.requestFullscreen();
              } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
              } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
              } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
              }
            }
          }
          // 类型为 exitFullscreen, 则不管当前全屏状态如何, 都退出全屏
          // 当前状态为全屏, 则退出全屏
          // 当前状态为非全屏, 则不做任何操作
        } else if (type === 'exitFullscreen' && fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    }
  }

  LonchJsApi.router2OtherProduct = function(url, params) {
    router.push({
      path: config.multiFramesRouterPath || '/admin/multiFrames',
      query: Object.assign({url: window.btoa(encodeURIComponent(url))}, params)
    });
  }
  /**
   * 环境探测，由于client比较有延迟这里不再依赖client方法
   */
  LonchJsApi.testingClient = function () {
    let userAgent = window.navigator.userAgent;
    let client = {
      userAgent: userAgent,
      isIOS: /.*Mac OS.*/i.test(userAgent),
      isAndroid: /.*Android.*/i.test(userAgent),
      isWindows: /.*windows.*/i.test(userAgent),
      isIE: /.*Trident.*/i.test(userAgent),
      isMobile: /.*Mobile.*/i.test(userAgent),
      isIPhone: /.*iPhone.*/i.test(userAgent),
      isIPad: /.*iPad.*/i.test(userAgent),
      isMicromessenger: /.*Micromessenger.*/i.test(userAgent) && !/.*wxwork.*/i.test(userAgent),
      isWxwork: /.*wxwork.*/i.test(userAgent),
      isMiniprogram: false,
      isApp: typeof LonchJsApi === 'object' && LonchJsApi.isInApp(),
      clientType: '', // windowApp，androidApp，iosApp，macApp, webApp
      ip: utils.getClientIp() || '0.0.0.0'
    };
    let os = userAgent.match(/(windows|Android|iPhone|iPad|Mac)(\s?OS\s?X|\s?nt)?(\s?\d+(\.\d+)*(_\d+(\.\d+)*)*)/i);
    if (os && os.length > 4) {
      client.os = {
        name: os[0],
        sys: os[1] || '',
        type: (os[2] || '').replace(/^\s/, ''),
        version: (os[3] || '').replace(/^\s/, '')
      };
    }
    if (client.isMicromessenger) {
      try {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            client.isMiniprogram = true;
            client.clientType = 'miniprogram';
          } else {
            client.isMiniprogram = false;
          }
        });
      } catch (e) {
        console.log('clent', e);
      }
    }
    if (LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2()) {
      client.clientType = 'iosApp';
    } else if (LonchJsApi.isInMacApp() || LonchJsApi.isInMacAppV2()) {
      client.clientType = 'macApp';
    } else if (LonchJsApi.isInCef() || LonchJsApi.isInCefV2()) {
      client.clientType = 'windowApp';
    } else if (LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2()) {
      client.clientType = 'androidApp';
    } else if (client.isMiniprogram) {
      client.clientType = 'miniprogram';
    } else if (client.isWxwork) {
      client.clientType = 'wxwork';
    } else if (client.isMicromessenger) {
      client.clientType = 'micromessenger';
    } else {
      client.clientType = 'webApp';
    }
    LonchJsApi.clientType = client.clientType;
    return client;
  };
  LonchJsApi.testingClient();
  LonchJsApi.initMessageListener();
  return LonchJsApi;
})();
