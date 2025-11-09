import config from '../../config/index';
import utils from '../utils/utils';
import webLog from '../api/web-log';
import { Message } from 'element-ui';
/**
 * 客户端初始化token
 */
function initialize () {
  let tools = utils;
  let params = tools.getParams();
  // 记录产品标示
  if (params.manageProductId) {
    config.commonParams.manageProductId = params.manageProductId;
  }
  if (config.token) {
    return true;
  } else if (typeof LonchJsApi === 'object' && LonchJsApi.isInApp()) {
    // 在App中不需要token,或者已登录
    return true;
  } else {
    let session = getSession();
    let paramsSession = getSessionFromLocation();
    if (paramsSession && paramsSession.token && paramsSession.token !== 'undefined' && paramsSession.token !== 'null' && paramsSession.token != session.token) {
      // 通过参数传入token时，判断是否已经设置,相同token，首次保存为准
      session = paramsSession;
      setSession(session);
      // 20230516 如果url params输入的token变了，则把接口缓存清掉掉
      utils.clearAllCacheData();
    }
    if (session.token) {
      config.token = session.token;
      config.loginUserName = session.userName;
      config.loginTime = session.time;
      // 是否为游客登录
      config.isVisitor = session.isVisitor;
      let clientType = getClientType();
      // todo will delete clientType
      if (clientType) {
        config.clientType = clientType;
        utils.setCookie('CLIENT-TYPE', clientType, '/', config.domain, config.expire);
      } else {
        config.clientType = '0';
        utils.deleteCookie('CLIENT-TYPE', '/', config.domain, -1);
      }
      clearExpiredCache(session.time);
      return true;
    } else {
      return false;
    }
  }
}

// 更新Session
function updateSessionOrg (dataOwnerOrgId) {
  let session = getSession();
  let sessionKey = config.sessionKey + '-' + config.project.name.toUpperCase();
  utils.deleteCookie(sessionKey, '/', config.domain, -1);
  session.dataOwnerOrgId = dataOwnerOrgId;
  //session.userName = encodeURIComponent(session.userName);
  //session.realName = encodeURIComponent(session.realName);
  setSession(session);
}

// 更新token
function refreshToken (token) {
  let session = getSession();
  let sessionKey = config.sessionKey + '-' + config.project.name.toUpperCase();
  utils.deleteCookie(sessionKey, '/', config.domain, -1);
  //session.dataOwnerOrgId = dataOwnerOrgId
  let time = new Date().getTime();
  session.token = token;
  //session.userName = encodeURIComponent(session.userName);
  //session.realName = encodeURIComponent(session.realName);
  session.time = time;
  clearLocalStorage();
  setSession(session);
  // 更新token时，清除缓存
  window.vm.postMessageWorker({command: 'clearCache'});
}

/**
 * 获取登录token
 */
function getToken () {
  let session = getSession();
  return config.token || session.token;
}

/**
 * 获取登录信息
 */
function getSessionFromLocation () {
  let params = utils.getParams();
  if (params.token) {
    return {
      token: params.token,
      isVisitor: params.isVisitor,
      time: new Date().getTime()
    };
  }
  return {};
}

// 保存登录会话
function setSession (session) {
  let domain = config.domain;
  let sessionKey = config.sessionKey + '-' + config.project.name.toUpperCase();
  if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
    localStorage.setItem(sessionKey, JSON.stringify(session));
  } else if (new RegExp('^http[s]?:\\\/\\\/[\\w-_]+' + domain.replace(/[.]/g, '\\.')).test(window.location.href)) {
    utils.setCookie(sessionKey, JSON.stringify(session), '/', config.domain, config.expire);
  } else {
    utils.setCookie(sessionKey, JSON.stringify(session), '/', document.domain, config.expire);
  }
}

/**
 * 获取会话信息
 */
function getSession () {
  // 被阿里嵌套，不能使用getCookie
  let sessionKey = config.sessionKey + '-' + config?.project?.name?.toUpperCase();
  if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
    return JSON.parse(localStorage.getItem(sessionKey) || '{}');
  } else {
    return JSON.parse(utils.getCookie(sessionKey) || '{}');
  }
}

function getClientType () {
  let params = utils.getParams();
  return params.clientType;
}

function setLoginCallbackUrl (callbackUrl) {
  let domain = config.domain;
  let loginCallbackKey = config.loginCallbackKey + '-' + config.project.name.toUpperCase();
  if (new RegExp('^http[s]?:\\\/\\\/[\\w-_]+' + domain.replace(/[.]/g, '\\.')).test(window.location.href)) {
    utils.setCookie(loginCallbackKey, callbackUrl, '/', config.domain, config.expire);
  } else {
    utils.setCookie(loginCallbackKey, callbackUrl, '/', document.domain, config.expire);
  }
}

/**
 * 退出登录
 */
function toLogOut (callbackUrl, isRecordCallbackAddress) {
  if (window.self != window.top) {
    LonchJsApi.postMessage('TO-LOGOUT', {callbackUrl: callbackUrl, isRecordCallbackAddress: isRecordCallbackAddress}, null, function () {
    });
  } else {
    toLogin(callbackUrl, isRecordCallbackAddress);
  }
}

/**
 * 退出对话框
 */
function toLogOutConfirm(errorMsg, context = vm) {
  LonchJsApi.timeout.clearAllTimeout();
  window.vm.$confirm({
    text: errorMsg || '登录已过期，请重新登录！', // 提示信息
    // 操作按钮
    buttons: [
      {
        text: '确定',
        type: 'primary',
        callback: function () {
          // token失效时，是否要记录登录后回跳地址
          let isRecordCallbackAddress = false;
          if(context && context.$route && context.$route.matched && context.$route.matched.length === 0) {
            isRecordCallbackAddress = true;
          }
          toLogOut(null, isRecordCallbackAddress);
        }
      }
    ]
  });
}

/**
 * 去登录,
 * 回调地址添加产品标识
 */
function toLogin (callbackUrl, isRecordCallbackAddress) {
  clearSession();
  callbackUrl = callbackUrl || window.location.href;
  callbackUrl = utils.removeParam('token', callbackUrl);
  callbackUrl = utils.removeParam('isVisitor', callbackUrl);
  callbackUrl = utils.makeUrl(callbackUrl, {appName: config.project.name}, true);
  callbackUrl = encodeURIComponent(callbackUrl);
  if (typeof LonchJsApi === 'object' && LonchJsApi.isInApp()) {
    LonchJsApi.webCallAppRequest(config.services.appCommand.cmdAppLogout, {callbackUrl: callbackUrl}, null, null, null, true);
  } else if (config.client.isMiniprogram) {
    wx.miniProgram.navigateTo({
      url: '/pages/login/login' + (callbackUrl ? '?to=' + callbackUrl : '')
    });
  } else {
    // 设置写入回调地址的时候，才写入回调地址
    if(isRecordCallbackAddress) {
      // 浏览器端通过cookie设置登录回调
      setLoginCallbackUrl(callbackUrl);
    }
    if (config.client.isWxwork) {
      // 企业微信自动登录
      toWxWorkAutoLogin();
    } else if (config.client.isMicromessenger) {
      // 微信默认进入自动登录
      toWxAutoLogin();
    } else {
      // pc浏览器默认进入扫码登录
      let logoutUrl = utils.setSearchParams({
        t: new Date().getTime(),
        appName: config.project.name
      }, config.defaultLogOutUrl);
      window.location.replace(logoutUrl);
    }
  }
}

/**
 * 退出登录清除登录数据
 */
function clearSession () {
  // 清除所有的localstorage缓存
  // localStorage.clear();
  /*
  清除所有的非caToken缓存
  */
  for (let i = localStorage.length - 1; i >= 0; i--) {
    let key = localStorage.key(i);
    if (!key.startsWith('CATOKEN-')) {
      localStorage.removeItem(key);
    }
  }
  // 清除indexDB的缓存
  utils.clearAllCacheData();
  let domain = config.domain || location.hostname;
  //只能在合法域名下才能操作
  let sessionKey = config.sessionKey + '-' + config.project.name.toUpperCase();
  if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
    localStorage.removeItem(sessionKey);
  } else if (new RegExp('^http[s]?:\\\/\\\/[\\w-_]+' + domain.replace(/[.]/g, '\\.')).test(window.location.href)) {
    utils.deleteCookie(sessionKey, '/', domain, -1);
  }
}

/**
 * 企业微信自动登录
 */
function toWxWorkAutoLogin () {
  let wechatWork = Object.assign({}, config.wechatWork);
  let appid = utils.getParam('appid') || wechatWork.appid;
  let agentid = utils.getParam('agentid') || wechatWork.agentid;
  let winxinCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  // 企业微信多企业自动登录，根据传入的appid进行识别账号
  let state = {
    lt: 21, //wechatWork.state,
    pn: config.project.name,
    id: appid,
    t: new Date().getTime()
  };
  let params = [];
  params.push('appid=' + appid);
  params.push('redirect_uri=' + encodeURIComponent(wechatWork.redirect));
  params.push('response_type=' + wechatWork.response_type);
  params.push('scope=' + wechatWork.scope);
  params.push('state=' + btoa(JSON.stringify(state)));
  params.push('agentid=' + agentid);
  let winxinUrl = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
  console.log('============winxinUrl:', winxinUrl);
  window.location.replace(winxinUrl);
}

/**
 * 微信自动登录
 */
function toWxAutoLogin () {
  let winxinCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  let state = {
    lt: config.wechatAutoLogin.state,
    pn: config.project.name,
    t: new Date().getTime()
  };
  let params = [];
  params.push('appid=' + config.wechatAutoLogin.appid);
  params.push('redirect_uri=' + encodeURIComponent(config.wechatAutoLogin.redirect_uri));
  params.push('response_type=' + config.wechatAutoLogin.response_type);
  params.push('scope=' + config.wechatAutoLogin.scope);
  params.push('state=' + encodeURIComponent(btoa(JSON.stringify(state))));
  let winxinUrl = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
  window.location.replace(winxinUrl);
}

/**
 * 清除过期缓存
 */
function clearExpiredCache (time) {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    try {
      let cache = JSON.parse(localStorage.getItem(key) || null);
      if (cache && cache.time && cache.time < time) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * 清除缓存
 *
 */
function clearLocalStorage () {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * 云屏s token失效退出登录
 */
function toLogOutForScreens(data){
  Message({
    message: data.errorMsg,
    type: 'warning',
    onClose:()=>{
      webLog.log({
        code: 'TELESCREEN_LOG',
        level: 'warn',
        msg: `云屏s-token失效:${JSON.stringify(data)}`
      });
      toLogin()
    }
  })
}
/**
 * 公共退出方法
 * @param {Object} data 
 */
function toLogOutConfirmCommon({data, type}) {
  if (config.projectName === 'telescreen') {
    /**
     * 云屏s token失效，走单独的逻辑
     */
    toLogOutForScreens(data);
  } else {
    if(type === 'cmdAppLogout') {
      /**
       * 退出登录
       */
      window.vm.$confirm({
        text: data.errorMsg || '登录已过期，请重新登录！',
        buttons: [
          {
            text: '确定',
            type: 'primary',
            callback: function () {
              LonchJsApi.webCallAppRequest({command: 'cmdAppLogout'}, {}, null, null, null, true);
            }
          }
        ]
      });
    } else {
      /**
       * 登录退出
       */
      toLogOutConfirm(data.errorMsg);
    }
  }

}
export default {
  getToken,
  getSession,
  setSession,
  initialize,
  updateSessionOrg,
  refreshToken,
  toLogin,
  toLogOut,
  toLogOutConfirm,
  clearLocalStorage,
  toWxWorkAutoLogin,
  toWxAutoLogin,
  toLogOutForScreens,
  toLogOutConfirmCommon
};
