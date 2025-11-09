/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-09-05 00:40:14
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-09-15 15:19:55
 * @FilePath: \common-data-configc:\project\middleground\lonch-umcfe\src\common-base\api\api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * author 李见伟 create 2019-6-19
 * 前端通讯组件，所有前端数据调用通过此接口
 * 接口配置
 *  command：APP通讯协议、default:getAppProxyData
 *  module：接口模块名称（纯APP通讯，无需配置）
 *  url：接口地址
 *  method：接口类型
 *  cache：配置缓存
 *    AppCache（2023-01-10开始支持）优先于localStorage
 *    localStorage
 *  networkFirst 依赖cache、配置网络优先（有网情况下）默认缓存优先 2023-01-10开始支持
 *  expire 依赖cache、缓存失效时间，仅支持localStorage
 *  isGlobal，全局通用接口（不追加moduleCode）
 *  comment：接口注释
 */
import request from './request';
import utils from '../utils/utils';
import { getAESEncryptString, getAESDecryptObject, getRSAEncryptString, getCookieSKKey } from '../utils/crypto';
import config from '../../config/index'; // 具体项目中配置
import AES from 'crypto-js/aes';
import Login from '../login/login';
import Utf8 from 'crypto-js/enc-utf8';
import {Message} from 'element-ui';
import Loading from '../components/lonchComponents/loading/index.js';
import webLog from './web-log';
import WebSocketService from './webSocketApi/WebSocketService.js'
import IframeWebSocket from './webSocketApi/IframeWebSocket.js'
import InterfaceModules from './webSocketApi/InterfaceModules.js'
import AdjustErrorLevel from './adjustErrorLevel';
import commonApiConfig from '../config/common-api-config.js';
// token异常的数据错误码
import { tokenInvalidList } from './webSocketApi/apiCustomResult.js';
import WebSocketConsole from './webSocketApi/WebSocketConsole.js';
import apiConfig from './config'

let loadings = [];
let loadingConfig = {
  show: false,
  loading: null
};

const defaultPostConfig = {
  headers: {'Content-Type': 'application/json'}
};

const defaultGetConfig = {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
};
const webSocketConsole = WebSocketConsole();

// eslint-disable-next-line no-unused-vars
function showLoading (text) {
  loadings.push(1);
  loadingConfig.show = true;
  loadingConfig.loading = Loading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.01)'
  });
}

// eslint-disable-next-line no-unused-vars
function closeLoading () {
  loadings.shift();
  if (loadings.length <= 0) {
    loadingConfig.loading.close();
    loadingConfig.show = false;
  }
}

/**
 * 显示消息
 */
function showMessage({
  message,
  type = 'warning',
  requestConfig = {},
} = {}) {
  /**
   * 不显示消息
   */
  if(getRequestConfigAttr(requestConfig, 'isNoMessage')) {
    return;
  }

  // 提示
  Message({
    message,
    type
  });
} 

/**
 * 获取requestConfig的属性
 * @param {*} requestConfig 
 * @param {*} attr 
 * @returns 
 */
function getRequestConfigAttr(requestConfig, attr) {
  if(typeof requestConfig === 'object') {
    return requestConfig[attr];
  }
  return null;
}

/**
 * 获取当前配置是否加载loading，兼容旧版
 * @param {*} requestConfig 
 */
function getIsNoLoading(requestConfig = {}) {
  // 设置是否不显示loading
  let isNoLoading;
  if(typeof requestConfig === 'boolean') {
    isNoLoading = requestConfig;
  }
  else {
    isNoLoading = getRequestConfigAttr(requestConfig, 'isNoLoading');
  }

  return isNoLoading;
}

/**
 * 发送get请求
 */
function get (url, params, cfg) {
  let requestHeaders = Object.assign({}, cfg.headers, defaultGetConfig.headers);
  params.requestHeaders = requestHeaders;
  return request.get(url, {params}, {headers: requestHeaders});
}

/**
 * 发送post请求
 */
function post (url, params, cfg, loadingInstance) {
  const config = cfg || defaultPostConfig;
  if(loadingInstance && typeof loadingInstance === 'function' && params instanceof FormData) {
    // formData才显示请求进度
    config.onUploadProgress = function (progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      loadingInstance('上传进度：' + percentCompleted + '%');
    }
  }
  return request.post(url, params, config)
}

/**
 * 获取缓存数据
 * 数据使用AES解密缓存数据
 * @param service 接口对象
 * @param params 接口参数
 * @return data 解密后的缓存数据
 */
function getCachedData (service, params) {
  let query = typeof params === 'string' ? utils.search2object(params) : params;
  if (query.demand) {
    query = Object.assign({}, query.demand);
  }
  if (query.timestamp) {
    delete query.timestamp;
  }
  let key = utils.makeUrl(service.url, query);
  let catche = JSON.parse(localStorage.getItem(key) || null);
  let data = null;
  if (catche) {
    let now = new Date().getTime();
    // 如果设置过期时间0为不过期,如果过期则清空数据
    if (catche.expire > 0 && now > catche.time + service.expire) {
      // 缓存已失效
      clearCacheData(service);
    } else {
      try {
        let bytes = AES.decrypt(catche.data, config.aesKey);
        data = JSON.parse(bytes.toString(Utf8));
      } catch (e) {
        clearCacheData(service);
        data = null;
      }
    }
  }
  return data;
}

/**
 * 更新缓存数据
 * 使用AES加密缓存数据
 * @param service 接口对象
 * @param params 接口参数
 * @param data JSON数据
 */
function setCacheData (service, params, data) {
  clearCacheData(service);
  let query = typeof params === 'string' ? utils.search2object(params) : params;
  if (query.demand) {
    query = Object.assign({}, query.demand);
  }
  if (query.timestamp) {
    delete query.timestamp;
  }
  let key = utils.makeUrl(service.url, query);
  let leftSize = getLocalStorageLeftSize();
  let cache = {
    time: new Date().getTime(),
    data: AES.encrypt(JSON.stringify(data), config.aesKey).toString()
  };
  if (cache.data.length < leftSize - 20) {
    localStorage.setItem(key, JSON.stringify(cache));
  }
}

/**
 * 获取LocalStorage剩余可存储大小
 */
function getLocalStorageLeftSize () {
  let size = 0;
  for (let key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      size += window.localStorage.getItem(key).length;
    }
  }
  return 5 * 1024 * 1024 - size;
}

/**
 * 是否需要加密
 * 1. POST 方法
 * 2. protocolVersion 为 2.0 协议
 * 3. 项目配置里需要加密 config.project.secretEnabled （common-data-config/projects.json）
 * 4. 有 url，且 url 没有配置网址，要走网关
 * 5. 非下面两种请求
 * {module: 'lid', url: '/lid/assignWorkerId', method: 'POST', comment: '获取lid'},
 * { module: 'secretkey', url: '/security/getPublicKey', method: 'POST', comment: '通过terminalId查询公钥'}
 * @param {*} service
 * @returns {Boolean} 需要加密：true, 不需要加密：false
 */
function needSecret(service) {
  const method = service.method ? service.method.toUpperCase() : 'POST';
  const interfaceModules = InterfaceModules(
    config && config.modulesVersions
  );
  const protocolVersion = service.protocolVersion || service.version || interfaceModules.getListProp('version', service.module) || service.config?.headers?.['protocol-version'] || '2.0';
  if (!service.url) {
    return false;
  }
  if (/^https?:\/\//i.test(service.url)) {
    return false;
  }
  if (/^https?:\/\//i.test(config.modules[service.module])) {
    return false;
  }
  return  method === 'POST'
    && protocolVersion === '2.0'
    && config.project.secretEnabled
    && !(service.module === 'lid' && service.url === '/lid/assignWorkerId')
    && !(service.module === 'secretkey' && service.url === '/security/getPublicKey')
    && !(service.module === 'secretkey' && service.url === '/security/resetPublicKey')
    && !(service.module === 'uaapi' && service.url === '/user/doWXlogin')
    && !(service.module === 'ca' && service.url === '/externalSystem/queryWecom')
    && !(service.module === 'appClient' && service.url === '/App/QueryUserWebAppUpdateSettingV2')
    && !(service.module === 'uaapi' && service.url === '/user/doWXlogin')
    && !(service.module === 'uaapi' && service.url === '/user/sendSms4Linkmanlogin')
    && !(service.module === 'uaapi' && service.url === '/user/confirm4Linkmanlogin')
    && !(service.module === 'uaapi' && service.url === '/user/sendSms4login')
    && !(service.module === 'uaapi' && service.url === '/captcha2/get')
    && !(service.module === 'uaapi' && service.url === '/captcha2/check')
    && !(service.module === 'uaapi' && service.url === '/user/loginPwdforget')
}

function getServiceUrl(service) {
  // const url = /^http[s]?:\/\//.test(service.url) ? service.url : /^http[s]?:\/\//.test(config.modules[service.module]) ? config.modules[service.module] + service.url : config.project.gateway + config.modules[service.module] + service.url;
  let url;
  if (/^http[s]?:\/\//.test(service.url)) {
    url = service.url;
  } else if (/^http[s]?:\/\//.test(config.modules[service.module])) {
    url = config.modules[service.module] + service.url;
  } else {
    url = config.project.gateway + config.modules[service.module] + service.url;
  }
  return url;
}

/**
 * 删除本地对称密钥，并刷新浏览器，重新获取公钥私钥，并生成对称密钥
 *
 * @param {Boolean} reset 是否重置公钥
 */
function removeSKAndReload(reset, context) {
  if (reset) {
    ajaxSend(commonApiConfig.secretkey.securityResetPublicKey, { terminalType: 1 }, () => {}, () => {}, context, true);
    utils.setCookie(getCookieSKKey(), `${config.terminalId}:`, '/', config.domain, 365 * 24 * 60 * 60 * 1000);
  } else {
    // 如果加密失败, 则删除 SK, 重新获取公钥以及对称密钥
    utils.deleteCookie(getCookieSKKey(), '/', config.domain, -1);
  }
  window.location.reload();
}

/**
 * 更新缓存数据,清除同一个接口所有缓存
 * @param service
 */
function clearCacheData (service) {
  for (let key in localStorage) {
    if (key.indexOf(service.url) > 0) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * 接口返回统一处理（不含错误）
 * @param service
 * @param params
 * @param success
 * @param error
 * @param context
 * @param res
 * @param startTime
 * @param requestConfig 请求的配置
 */
function onComplete (service, params, success, error, context, res, startTime, requestConfig) {
  let time = startTime ? new Date().getTime() - startTime : '';
  let result;
  if(typeof res.data === 'string') {
    try {
      result = JSON.parse(res.data);
    } catch (e) {
      // 序列化失败时传输数据有问题，要进行上报
      webLog.log({
        code: 'WEBAPP020000',
        level: 'error',
        sid: params.sid,
        msg: `数据传输异常:${e.toString()}`
      }, service, params, res, time, config);
      return
    }
  } else {
    result = res.data;
  }
  let protocolVersion = service.config && service.config.headers ? service.config.headers['protocol-version'] : '';
  if (result) {
    let serviceResult;
    if (protocolVersion === '2.0') {
      // 如果不在 App 中, 且请求要求加密, 则对返回值进行解密 (AES)
      if (!LonchJsApi.isInApp() && params.secretType) {
        try {
          result.serviceResult = getAESDecryptObject(result.serviceResult, config.sk);
          // 非生产环境，打印加密响应参数
          if (process.env.VUE_APP_MODE !== 'production') {
            console.log('【RESPONSE_SERVICE_RESULT】', getServiceUrl(service), params.sid, result.serviceResult);
          }
        } catch (e) {
          webLog.log({
            code: 'WEBAPP020000',
            level: 'error',
            sid: params.sid,
            msg: `数据解密失败:${e.toString()},${getCookieSKKey()}=${config.sk}`
          }, service, JSON.stringify(params), res, time, config);
          removeSKAndReload();
        }
      }
      serviceResult = Object.assign({}, result.serviceResult);
      serviceResult.error = serviceResult.reason || result.errorMsg;
      serviceResult.opFlag = serviceResult.success === undefined ? result.opFlag : serviceResult.success;
      serviceResult.code = serviceResult.errorCode || result.errorCode;
      serviceResult.serviceResult = serviceResult.data;
    } else {
      serviceResult = result;
    }
    
    /**
     * 传入的lonch-websocket工具上，接口请求，
     */
    try {
      webSocketConsole.response(params.sid, {
        serviceResult
      }, 'http');
    } catch(e) {
      console.error('传入lonch-weboskcet失败，失败原因：', e);
    }
    let errorCode = (serviceResult.errorCode || serviceResult.code || '').toUpperCase();
    let errorMsg = serviceResult.error || serviceResult.errorMsg || result.errorMsg;
    // 处理1.0和2.0接口兼容
    if (serviceResult.opFlag) {
      try {
        if (serviceResult && serviceResult.opFlag) {
          if (typeof success === 'function') {
            success.call(context, serviceResult, protocolVersion === '2.0' ? result : null);
          }
          // 如果设置了缓存，则缓存数据
          if (service.cache) {
            try {
              utils.setCache(service, params, serviceResult, config, this);
            } catch (e) {
              console.log('设置缓存异常', e);
              //webLog.log({
              //  code: 'WEBAPP030001',
              //  msg: '设置缓存异常',
              //  sid: params.sid,
              //  level: 'info'
              //}, service, params, result, null, config);
            }
          }
        } else {
          if (typeof error === 'function') {
            error.call(context, serviceResult, protocolVersion === '2.0' ? result : null);
          }
          showMessage({
            message: serviceResult.reason || serviceResult.error,
            requestConfig
          });
          webLog.log({
            code: serviceResult.errorCode,
            level: 'warn',
            msg: serviceResult.reason || serviceResult.error
          }, service, params, result, time, config);
        }
      } catch (evt) {
        webLog.log({
          code: 'WEBAPP030000',
          level: 'error',
          sid: params.sid,
          msg: '***前端代码报错***'
        }, service, params, evt.toString(), time, config);
      }
    } else {
      let level = 'warn';
      if (tokenInvalidList.includes(errorCode)) {
        // 登录退出
        Login.toLogOutConfirmCommon({data: result});
      /**
       * ******* 需要重置 RSA 公钥，保存对应的私钥，生成对称密钥 START ***
       * ** /security/resetPublicKey ******
       * "SERGTW1301100003", "RSA解密失败，请重试"
       * ******* 需要重置 RSA 密钥，保存对应的私钥，生成对称密钥 END ***************
       *
       *  ******* 无需重新获取公钥，需要重新保存私钥，并生成对称密钥 START ***********
       * "SERGTW1301100004", "AES解密失败，请重试"
       * "SERGTW1301100006", "AES秘钥查询失败，请重试"
       * "SERGTW1301100007", "RSA私钥查询失败，请重试"
       * ******* 无需重新获取公钥，需要重新保存私钥，并生成对称密钥 END ***************
       *
       * 错误等级调整到 error 级别
       */
      } else if (!LonchJsApi.isInApp() && params.secretType && ["SERGTW1301100006","SERGTW1301100004","SERGTW1301100003","SERGTW1301100007"].includes(errorCode)) {
        level = 'error';
        removeSKAndReload(errorCode === 'SERGTW1301100003', context);
      } else if (errorCode === 'SERGTW1201100005') {
        // 接口拒绝访问提高报错级别
        level = 'error';
        // 网关返回服务拒绝访问,请联系管理员授权，时，转换提示内容
        showMessage({
          message: errorMsg || '当前页面无权限访问，请联系管理员授权！',
          requestConfig
        });
      } else {
        if(checkRemindUser(errorMsg)) {
          showMessage({
            message: errorMsg,
            requestConfig
          });
        }
        if (errorMsg && /异常|报错|错误|系统繁忙|服务拒绝访问|sql error|error/i.test(errorMsg)) {
          level = 'error';
        }
        const adjustErrorLevel = new AdjustErrorLevel();
        level = adjustErrorLevel.status2warn(serviceResult, level);
      }
      // 记录错误日志
      webLog.log({
        code: errorCode,
        level: checkWarningLevel(errorMsg, level),
        msg: errorMsg || '数据返回异常'
      }, service, params, result, time, config);
      // 执行错误回调
      if (typeof error === 'function') {
        try {
          error.call(context, serviceResult, protocolVersion === '2.0' ? result : null);
        } catch (e) {
          webLog.log({
            code: 'WEBAPP030000',
            level: 'error',
            sid: params.sid,
            msg: '***前端代码报错***'
          }, service, params, e.toString(), time, config);
        }
      }
    }
  } else {
    // 返回数据为空
    webLog.log({
      code: 'WEBAPP020003',
      msg: '服务端未返回内容',
      sid: params.sid,
      level: 'error'
    }, service, params, result, time, config);
  }
}

/**
 * 错误统一处理方法
 * @param service
 * @param params
 * @param error
 * @param context
 * @param evt
 * @param startTime
 * @param requestConfig
 */
function onError (service, params, error, context, evt, startTime, requestConfig) {
  let time = startTime ? new Date().getTime() - startTime : '';
  let errMsg = evt.toString();
  if(!apiConfig.checkSilence(service)) {
    showMessage({
      message: errMsg,
      requestConfig,
    });
  }
  if (typeof error === 'function') {
    try {
      error.call(context, evt);
    } catch (e) {
      webLog.log({
        code: 'WEBAPP030000',
        level: 'error',
        sid: params.sid,
        msg: '***前端代码报错***' + errMsg
      }, service, params, e.toString(), time, config);
    }
  }
  webLog.log({
    code: 'WEBAPP020000',
    level: checkWarningLevel(errMsg),
    sid: params.sid,
    msg: errMsg
  }, service, params, errMsg, time, config);
}

/**
 * 根据错误信息，判断这个警告的级别
 */
function checkWarningLevel(errMsg, level) {
  // warn不需要降级
  if(level && level === 'warn') {
    return level;
  }
  // 降级处理的提示
  const messages = [
    'timeout of 120000ms exceeded',
    'Network Error',
    'Request aborted',
    '无法获取当前位置天气信息',
    '验证码错误',
    '验证码失效',
    '密码错误',
  ];
  const regexStr = messages.join("|");
  const regex = new RegExp(regexStr, 'i');
  if(regex.test(errMsg)) {
    return 'warn'
  } else {
    return 'error'
  }
}

/**
 * 根据错误信息，判断是否提醒用户
 */
function checkRemindUser(errMsg) {
  // 降级处理的提示
  const messages = [
    '无法获取当前位置天气信息'
  ];
  const regexStr = messages.join("|");
  const regex = new RegExp(regexStr, 'i');
  return !regex.test(errMsg)
}

/**
 * 请求成功
 */
function requestComplete({
  requestConfig, service, params, success, error, context, res, startTime
}) {
  const isNoLoading = getIsNoLoading(requestConfig);
  if (!isNoLoading) {
    closeLoading();
  }
  onComplete(service, params, success, error, context, res, startTime, requestConfig);
}

/**
 * http请求
 */
function requestHttpAjax ({
  method,  // 请求方式 POST | GET
  url,  // 请求的链接
  params, // 请求的参数
  service, // 接口服务
  requestConfig, // 请求的配置
  success, // 执行成功的方法
  error,  // 执行失败的方法
  context,  // this指向
  startTime // 当前时间
}) {
  let requestMethod = post
  if(method.toUpperCase() === 'GET' ) {
    requestMethod = get
  }

    
  /**
   * 传入的lonch-websocket工具上，接口响应，
   */
  try {
    // 打印接口请求
    webSocketConsole.request(params.sid, {
      url: utils.trim(url),
      method,
      sid: params.sid,
      token: config.token,
      userAgent: window.navigator.userAgent,
      contentType: 'application/json; charset=utf-8',
      protocolVersion: service.config.headers['protocol-version'],
      moduleCode: utils.getModuleCode(),
      serviceResult: JSON.stringify(params),
      body: params
    }, 'http');
  } catch(e) {
    console.error('传入lonch-weboskcet失败，失败原因：', e);
  }

  requestMethod(url, params, service.config).then((res) => {
    requestComplete({requestConfig, service, params, success, error, context, res, startTime})
  }).catch(err => {
    const isNoLoading = getIsNoLoading(requestConfig);
    if (!isNoLoading) {
      closeLoading();
    }
    onError(service, params, error, context, err, startTime, requestConfig);
  });
}

/**
 * 开始请求ajax
 * @param {*} param0
 */
let webSocketSendErrorOnce = true; // webSocket 请求接口，连接报错只发送一次
function startRequestAjax({
  method,  // 请求方式 POST | GET
  url,  // 请求的链接
  params, // 请求的参数
  service, // 接口服务
  requestConfig, // 请求的配置
  success, // 执行成功的方法
  error,  // 执行失败的方法
  context,  // this指向
  startTime // 当前时间
}) {


  const interfaceModules = InterfaceModules(config && config.modulesVersions)


  // 不支持webSocket 或 不需要使用webSocket请求，使用http请求
  // if ( url.includes('log') ) {
  // if ( url.includes('warehouse/queryWarehouseApplyList') ) {
  if ( typeof WebSocket === 'undefined' || !interfaceModules.check(service, url, params) ) {

    requestHttpAjax({
      method,
      url,
      params,
      service,
      requestConfig,
      success,
      error,
      context,
      startTime
    })
    return
  }

  // 使用socket请求
  let requestService = null;

  /**
   * 判断是否是iframe，是使用iframw的webSocket的请求
   */
  if(window.top !== window.self) {
    requestService = IframeWebSocket;
    webSocketSendErrorOnce = false;
  } else {
    requestService = WebSocketService(context.CFG);
  }

  requestService.send({url, method, params, service}).then(data => {

    const res = {data}
    requestComplete({requestConfig, service, params, success, error, context, res, startTime})

  }).catch((res) => {
    const errorMsg = typeof res === 'object' ? res.errorMsg : res
    /**
     * 使用webSocket请求出错，改成使用http请求
     */
    if (webSocketSendErrorOnce && errorMsg || res === 'object') {
      let time = startTime ? new Date().getTime() - startTime : '';
      webLog.log(
        {
          code: 'WEBAPP020000',
          level: 'warn',
          sid: params.sid,
          msg: `使用websocket请求接口失败:(${errorMsg})；转http请求`
        },
        service, // 接口配置
        params, // 请求参数
        res, // 返回数据
        time, // 耗时时间
        config
      );
      webSocketSendErrorOnce = false;
    }

    requestHttpAjax({
      method,
      url,
      params,
      service,
      requestConfig,
      success,
      error,
      context,
      startTime
    })
  })
}

/**
 * 发送ajax请求
 * @param service
 * @param demand
 * @param success
 * @param error
 * @param context
 * @param requestConfig
 */
function ajaxSend (service, demand, success, error, context, requestConfig) {
  let startTime = new Date().getTime();
  let moduleCode = utils.getModuleCode();
  let headers = service.config && service.config.headers ? service.config.headers : {};
  let params = {};
  service.command = service.command || 'getAppProxyData';
  //let protocolVersion = service.protocolVersion || module.version;
  let protocolVersion = service.protocolVersion || '2.0'; // 默认2.0协议
  let method = service.method ? service.method.toUpperCase() : 'POST'; // 默认Post
  let sid = 'WEB' + utils.UUID(32, 16);
  // let sid = LonchJsApi.getSerialNumber(service);
  // 处理模块编码
  if (moduleCode && !service.isGlobal) {
    headers = Object.assign(headers, {'module-code': moduleCode});
    if (demand && demand instanceof FormData) {
      demand.append('moduleCode', moduleCode);
    } else {
      demand.moduleCode = moduleCode;
    }
  }

  // 处理不同版本协议，2.0 添加protocol-version请求头，1.0有sid请求头
  if (protocolVersion === '2.0') {
    headers = Object.assign(headers, {'protocol-version': '2.0'});
    // 只有代理协议封装demand参数
    if (service.command === 'getAppProxyData' && method === 'POST') {
      params.demand = demand;
    } else {
      params = demand;
    }
    params.sid = sid; // 2.0 协议添加sid参数
    params.terminalId = config.terminalId;
  } else {
    headers = Object.assign(headers);
    params = demand;
  }
  // 添加时间戳
  params.timestamp = new Date().getTime();
  // 添加ip
  params.ip = utils.getClientIp();
  // 添加原始demand
  params.originalDemand = JSON.parse(JSON.stringify(demand));
  service.config = {headers};
  const url = getServiceUrl(service);
  // 加密网关请求
  try {
    // 判断是否需要加密
    if (needSecret(service)) {
      // 非生产环境，打印加密请求参数, url, sid
      if (process.env.VUE_APP_MODE !== 'production') {
        console.log('【REQUEST_DEMAND】', url, params.sid, params.demand);
      }
      // 如果是保存密文接口，则用 RSA 加密（secretType：1）
      if (service.module === 'secretkey' && service.url === '/security/saveSymmetricKey') {
        params.secretType = 1;
        const publicKey = params.demand.publicKey;
        delete params.demand.publicKey;
        const rawDemandString = JSON.stringify(params.demand);
        params.demand = getRSAEncryptString(rawDemandString, publicKey);
      } else {
        // 如果是其他加密接口，则用 AES 加密（secretType：1）
        params.secretType = 2;
        params.demand = getAESEncryptString(params.demand, config.sk);
      }
    }
  } catch (e) {
    webLog.log({
      code: 'WEBAPP020000',
      level: 'error',
      sid: params.sid,
      msg: `数据加密失败:${e.toString()}`
    }, service, params, null, time, config);
    removeSKAndReload();
  }
  const isNoLoading = getIsNoLoading(requestConfig);
  if (!isNoLoading) {
    showLoading();
  }
  startRequestAjax({method, url, params, service, requestConfig, success, error, context, startTime})
}

/**
 * 统一请求数据接口
 * @param {Object} requestConfig 配置参数
 *        @param {Boolean} isNoLoading 是否不显示loading
 *        @param {Boolean} isNoMessage 是否不显示Message
 */
function send (service, demand, success, error, context, requestConfig = {}) {
  context = context || this;
  // 处理通用参数
  // 统一追加公共参数
  let commonParams = config.commonParams;
  if (demand && demand instanceof FormData) {
    for (let p in commonParams) {
      if (commonParams.hasOwnProperty(p) && demand.get(p) === null) {
        demand.append(p, commonParams[p]);
      }
    }
  } else {
    demand = Object.assign({}, commonParams, demand);
  }
  if (service.url && service.cache) {
    /**
     * 如果设置了缓存则获取缓存数据
     * 有网状态下，接口配置networkFirst时优先从网络获取，默认优先从缓存获取
     */
    if (config.netStatus === 1 && service.networkFirst) {
      sendData(service, demand, success, error, context, requestConfig);
    } else {
      utils.getCache(service, demand, function (cacheData) {
        if (cacheData) {
          return success.call(context, cacheData);
        } else {
          sendData(service, demand, success, error, context, requestConfig);
        }
      }, config, context);
    }
  } else {
    sendData(service, demand, success, error, context, requestConfig);
  }
}

/**
 * 发送请求数据
 * @param service
 * @param demand
 * @param success
 * @param error
 * @param context
 * @param requestConfig
 */
function sendData (service, demand, success, error, context, requestConfig) {
  if (typeof LonchJsApi === 'object' && LonchJsApi.isInApp()) {
    if(service && service.type === 'localService') {
      // 如果接口配置是本地查数据的接口的话，则用controller层去掉
      if(context && context.controller) {
        try {
          const protocolParam = {
            demand,
            sid: LonchJsApi.getSerialNumber(),
            terminalId: context.CFG && context.CFG.terminalId || '',
            timestamp: new Date().getTime()
          }
          const isNoLoading = getIsNoLoading(requestConfig);
          context.controller(service, protocolParam, success, error, context, isNoLoading)
        } catch (e) {
          console.error("执行SQL错误", e);
          webLog.log({
            code: 'WEBAPP0006',
            level: 'error',
            msg: '执行SQL错误'
          }, service, demand, null, null, config);
        }
      } else {
        throw new Error('请先注册controller!');
      }
    } else {
      // 在 App 中, 如果需要加密, 则请求 demand._appSecretType = 2 (避免参数冲突，最终放到请求协议外层是 appSecretType: 2
      if (needSecret(service)) {
        demand = demand || {};
        demand._appSecretType = 2;
      }
      LonchJsApi.webCallAppRequest(service, demand, success, error, context, requestConfig);
    }
  } else if(typeof LonchJsApi === 'object' && typeof LonchJsApi.isInSimpleApp === 'function' && LonchJsApi.isInSimpleApp()) {
    const commands = [
      'cmdApplySystemPermission'
    ];
    if(service.command && commands.includes(service.command)) {
      console.log('简单版协议', service.command, service)
      LonchJsApi.webCallAppRequest(service, demand, success, error, context, requestConfig);
    } else if(service.url) {
      // 有配置接口地址的话，则发起ajax请求
      console.log('service.url:', service.url)
      ajaxSend(service, demand, success, error, context, requestConfig);
    }
  }  else if (service.url) {
    ajaxSend(service, demand, success, error, context, requestConfig);
  } else {
    webLog.log({
      code: 'WEBAPP0006',
      level: 'error',
      msg: '接口未配置'
    }, service, demand, null, null, config);
  }
}

export default {
  get,
  post,
  send,
  getCachedData,
  setCacheData,
  getIsNoLoading,
  showMessage,
};
