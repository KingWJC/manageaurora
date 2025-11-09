//import indexDB from '../common-base/api/indexedDB';

import config from '../../config';
import utils from '../utils/utils';

export default {
  data () {
    return {};
  },
  methods: {
    initMinxin () {
      let params = this.utils.getParams();
      if (params.appName || params.projectName) {
        this.CFG.projectName = (params.appName || params.projectName).toLocaleLowerCase();
      }
      this.CFG.project = this.utils.getFirstMatchedData(this.CFG.commonDataConfig.projects, 'name', this.CFG.projectName.toLocaleLowerCase());
    },
    /**
     * 判断来源自动分辨登录处理
     */
    toLoginMixin (isFormError) {
      let callbackUrl = encodeURIComponent(utils.makeUrl(window.location.href, {appName: config.project.name}));
      if (typeof LonchJsApi === 'object' && LonchJsApi.isInApp()) {
        LonchJsApi.webCallAppRequest(config.services.appCommand.cmdAppLogout, {callbackUrl: callbackUrl});
      } else if (this.CFG.client.isWxwork) {
        // 企业微信-自动登录
        this.toWxWorkAutoLogin();
      } else if (this.CFG.client.isMobile) {
        if (this.CFG.client.isMicromessenger) {
          // 微信环境-微信自动登录，检查参数，判定来源（）
          if (this.CFG.client.isMiniprogram) {
            // let callbackUrl = encodeURIComponent(window.location.href);
            let callbackUrl = encodeURIComponent(utils.removeParam('token', window.location.href));
            wx.miniProgram.navigateTo({
              url: '/pages/login/login?to=' + callbackUrl
            });
          } else if (this.$route.query.clientType === '3') {
            this.toWxAutoLogin4xk();
          } else {
            this.toWxAutoLogin();
          }
        } else {
          // 移动端浏览器-账号密码登录
          this.$router.push({
            name: 'login',
            query: isFormError ? {} : this.$route.query
          });
        }
      } else {
        if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
          // 内嵌页面使用账号密码登录，暂时无法使用扫码登录
          this.$router.push({
            name: 'login',
            query: isFormError ? {} : this.$route.query
          });
        } else {
          // pc浏览器-企业微信、微信扫码登录
          this.$router.replace({
            name: 'wechatLogin',
            query: isFormError ? {} : this.$route.query
          });
        }
      }
    },
    getCallBackUrl () {
      return this.utils.getCookie(this.CFG.loginCallbackKey + '-' + this.CFG.projectName.toUpperCase());
    },
    removeCallBackUrl () {
      this.utils.deleteCookie(this.CFG.loginCallbackKey + '-' + this.CFG.projectName.toUpperCase(), '/', this.CFG.domain, -1);
    },
    // 登录成功后跳转处理
    forward (session) {
      // let callbackUrl = this.getCallBackUrl();
      //let jumpUrl = this.CFG.defaultJump;
      let jumpUrl = this.CFG.project.origin ? this.CFG.project.origin + '/index.html' : this.CFG.defaultJump;
      /*
      // 不再回到最后访问的页面
      if (callbackUrl) {
        this.removeCallBackUrl();
        jumpUrl = decodeURIComponent(callbackUrl);
      }
      jumpUrl = jumpUrl.replace(/\/v\d+\.\d+\.\d+/, '');
      */
      if (this.CFG.isVersionControl) {
        this.API.send(this.CFG.services.app.QueryUserWebAppUpdateSetting, {},
          function (res) {
            if (res.opFlag) {
              let versions = res.serviceResult.webApps || [];
              jumpUrl = this.transformationMachedVersion(jumpUrl, versions);
              // 转换内嵌页面版本
              if (/\/admin\/multiFrames/.test(jumpUrl)) {
                let subUrl = this.utils.getParam('url', jumpUrl);
                if (subUrl) {
                  subUrl = atob(subUrl);
                  subUrl = btoa(this.transformationMachedVersion(subUrl, versions));
                  jumpUrl = this.utils.makeUrl(jumpUrl, {url: subUrl});
                }
              }
              this.jumpTo(jumpUrl, session);
            } else {
              this.$toast({text: res.error});
              this.jumpTo(jumpUrl, session);
            }
          },
          function () {
            this.jumpTo(jumpUrl, session);
          },
          this);
      } else {
        this.jumpTo(jumpUrl, session);
      }
    },
    jumpTo (url, session) {
      // 被iframe嵌套时，明文传递登录token，用户名等
      let params = {};
      if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
        params = {
          realName: session.realName,
          token: session.token
          // dataOwnerOrgId: session.dataOwnerOrgId
        };
        url = this.utils.makeUrl(url, params);
        window.location.replace(url);
      } else {
        // window.location.href = url;
        url = this.utils.makeUrl(url, params);
        window.location.replace(url);
      }
    },
    // 获取
    transformationMachedVersion (url, versions) {
      for (let i = 0, l = versions.length; i < l; i++) {
        let version = versions[i];
        let origin = version.webapp_url;
        let originRegStr = '^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.');
        let originRegExp = new RegExp(originRegStr);
        if (originRegExp.test(url)) {
          let pathname = (version.version ? '/' + version.version : '') + '/index.html';
          let originPathName = origin + pathname;
          // 切换版本入口
          let re = new RegExp(originRegStr + '(\\/v\\d+\\.\\d+\\.\\d+)?\\/(index\\.html)?');
          url = url.replace(re, originPathName);
          break;
        }
      }
      return url;
    },
    // 企业微信自动登录
    toWxWorkAutoLogin () {
      let wechatWork = this.CFG.wechatWork;
      let appid = utils.getParam('appid') || wechatWork.appid;
      let agentid = utils.getParam('agentid') || wechatWork.agentid;
      let winxinCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
      let params = [];
      let state = {
        lt: 21, //wechatWork.state,自动登录loginType：21
        pn: this.CFG.projectName,
        id: appid,
        t: new Date().getTime()
      };
      params.push('appid=' + appid);
      params.push('redirect_uri=' + encodeURIComponent(wechatWork.redirect));
      params.push('response_type=' + wechatWork.response_type);
      params.push('scope=' + wechatWork.scope);
      params.push('state=' + encodeURIComponent(btoa(JSON.stringify(state))));
      params.push('agentid=' + agentid);
      // window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize
      // ?appid=ww98055e27dd1e67fd
      // &redirect_uri=https%3A%2F%2Fportal.lonch.com.cn%2F%23%2FwxRootBoot
      // &response_type=code
      // &scope=snsapi_base&state=0#wechat_redirect'

      //console.log(winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect');
      //window.location.href = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
      let authCodeUrl = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
      console.log('==========authCodeUrl:', authCodeUrl);
      window.location.replace(authCodeUrl);
    },
    // 微信自动登录
    toWxAutoLogin () {
      let winxinCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
      let state = {
        lt: this.CFG.wechatAutoLogin.state,
        pn: this.CFG.projectName,
        t: new Date().getTime()
      };
      let params = [];
      params.push('appid=' + this.CFG.wechatAutoLogin.appid);
      params.push('redirect_uri=' + encodeURIComponent(this.CFG.wechatAutoLogin.redirect_uri));
      params.push('response_type=' + this.CFG.wechatAutoLogin.response_type);
      params.push('scope=' + this.CFG.wechatAutoLogin.scope);
      params.push('state=' + encodeURIComponent(btoa(JSON.stringify(state))));
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize
      // ?appid=wx828ca62e1ab884e6&redirect_uri=https%3A%2F%2Fportal.lonch.com.cn%2F%23%2FwxRootBoot
      // &response_type=code&scope=snsapi_userinfo&state=2#wechat_redirect'
      //window.location.href = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
      window.location.replace(winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect');
    },
    // 微信自动登录（微信销客公众号入口登录）
    toWxAutoLogin4xk () {
      let winxinCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
      let state = {
        lt: this.CFG.wechatAutoLogin4XK.state,
        pn: this.CFG.projectName,
        t: new Date().getTime()
      };
      let params = [];
      params.push('appid=' + this.CFG.wechatAutoLogin4XK.appid);
      params.push('redirect_uri=' + encodeURIComponent(this.CFG.wechatAutoLogin4XK.redirect_uri));
      params.push('response_type=' + this.CFG.wechatAutoLogin4XK.response_type);
      params.push('scope=' + this.CFG.wechatAutoLogin4XK.scope);
      params.push('state=' + encodeURIComponent(btoa(JSON.stringify(state))));
      // window.location.href = 'wechatAutoLogin4XKUri: 'https://open.weixin.qq.com/connect/oauth2/authorize?
      // appid=wx27ad07aa1f5a61e2&redirect_uri=https%3A%2F%2Fportal.lonch.com.cn%2F%23%2FwxRootBoot&
      // response_type=code&scope=snsapi_userinfo&state=3#wechat_redirect',
      //window.location.href = winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect';
      window.location.replace(winxinCodeUrl + '?' + params.join('&') + '#wechat_redirect');
    },
    /**
     * 登录成功后处理
     * @param data
     */
    mixinLogin (data) {
      let session = {
        token: data.token,
        // 新增uidtoken
        uidToken: data.uidToken || '',
        // dataOwnerOrgId: data.dataOwnerOrgId,
        // userName: encodeURIComponent(data.realName),
        // realName: encodeURIComponent(data.realName),
        time: new Date().getTime()
      };
      this.CFG.token = data.token;
      this.CFG.uidToken = data.uidToken || '';
      this.clearErrorTimes();
      this.setSession(session);
      this.forward(session);
    },
    /**
     * 退出登录处理
     * 如果被iframe嵌套,使用localStorage存储
     */
    minxinLogout () {
      let domain = this.CFG.domain || location.hostname;
      let sessionKey = this.CFG.sessionKey + '-' + this.CFG.projectName.toUpperCase();
      //只能在合法域名下才能操作
      if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
        localStorage.removeItem(sessionKey);
      } else if (new RegExp('^http[s]?:\\\/\\\/[\\w-_]+' + domain.replace(/[.]/g, '\\.')).test(window.location.href)) {
        this.utils.deleteCookie(sessionKey, '/', domain, -1);
      }
    },
    /**
     * 保存登录会话
     * 如果被iframe嵌套，使用localStorage存储
     */
    setSession (session) {
      let domain = this.CFG.domain || location.hostname;
      let sessionKey = this.CFG.sessionKey + '-' + this.CFG.projectName.toUpperCase();
      if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
        localStorage.setItem(sessionKey, JSON.stringify(session));
      } else if (new RegExp('^http[s]?:\\\/\\\/([\\w-_]+)?' + domain.replace(/[.]/g, '\\.')).test(window.location.href)) {
        this.utils.setCookie(sessionKey, JSON.stringify(session), '/', domain, this.CFG.expire);
      }
    },
    /**
     * 是否已登录
     * 如果被iframe嵌套，使用localStorage存储
     */
    getSession () {
      let sessionKey = this.CFG.sessionKey + '-' + this.CFG.projectName.toUpperCase();
      if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
        return JSON.parse(localStorage.getItem(sessionKey) || {});
      } else {
        return JSON.parse(this.utils.getCookie(sessionKey) || '{}');
      }
    },
    /**
     * 检查登录
     */
    checkMixinLogin () {
      let session = this.getSession();
      if (session && session.token) {
        this.forward(session);
      } else {
        this.toLoginMixin();
      }
    },
    getErrorTimes () {
      return parseInt(localStorage.getItem(this.CFG.maxTryLonginTimesKey) || 0);
    },
    updateErrorTimes () {
      let times = parseInt(localStorage.getItem(this.CFG.maxTryLonginTimesKey) || 0);
      localStorage.setItem(this.CFG.maxTryLonginTimesKey, ++times);
    },
    clearErrorTimes () {
      localStorage.removeItem(this.CFG.maxTryLonginTimesKey);
    },
    /**
     * 微信扫码登录、企业微信扫码登录、企业微信自动、微信公众号自动登录接口
     * clientType 1: macApp 2:windowsApp: 0: 浏览器
     * @param {Object} args
     */
    loginMixin: function (args) {
      this.API.send(this.CFG.services.common.wxLogin, args, function (res) {
        this.isLoading = false;
        if (args.clientType == '1' || args.clientType == '2') {
          this.API.send({'command': 'cmdQrLogin'}, {result: res});
        } else {
          if (res.opFlag) {
            this.mixinLogin(res.serviceResult);
          } else if (res.serviceResult.code === '9999' && res.serviceResult.unionid) {
            this.$toast({text: res.serviceResult.msg});
            this.$router.push({
              path: '/BindMobileNumber',
              query: {unionid: res.serviceResult.unionid, clientType: args.clientType}
            });
          } else {
            this.errorMsg = res.serviceResult.msg;
            this.$toast({text: res.serviceResult.msg});
            let errorTimes = this.getErrorTimes();
            if (errorTimes < 3) {
              this.updateErrorTimes();
              this.toLoginMixin(true);
            }
          }
        }
      }, function (res) {
        this.isLoading = false;
        if (args.clientType == '1' || args.clientType == '2') {
          this.API.send({'command': 'cmdQrLogin'}, {result: res});
        } else if (res.serviceResult.code === '9999' && res.serviceResult.unionid) {
          this.$toast({text: res.serviceResult.msg});
          this.$router.push({
            path: '/BindMobileNumber',
            query: {unionid: res.serviceResult.unionid, clientType: args.clientType}
          });
        } else {
          this.errorMsg = res.serviceResult.msg;
          this.$toast({text: res.serviceResult.msg});
          let errorTimes = this.getErrorTimes();
          if (errorTimes < 3) {
            this.updateErrorTimes();
            this.toLoginMixin(true);
          }
        }
        //this.toLoginMixin()
      }, this);
    },
    generateCustomerID (callBack) {
      let that = this;
      // 获取用户唯一标识
      const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      if (indexedDB) { // 支持
        let request = indexedDB.open('lonch-web-db', 1); // 打开 lonch-customer-service 数据库
        request.onsuccess = function (e) { // 监听连接数据库成功时执行
          let db = e.target.result;
          let tx = db.transaction('sys-setting', 'readwrite');
          let store = tx.objectStore('sys-setting');
          // 先判断是否存在值
          const datas = store.get(1);
          datas.onsuccess = function () {
            // 如果不存在目标数据
            if (typeof(this.result) === 'undefined') {
              const value = {
                'id': 1,
                'customerId': that.utils.UUID()
              };
              // 存储数据
              store.put(value);
              // 做数据存储
              //_self.uid = id
              //sessionStorage.setItem('uid', id)
              if (typeof callBack === 'function') {
                callBack.call(that, value);
              }
            } else { // 如果存在数据的话
              // 做数据存储
              //_self.uid = this.result.UID
              //sessionStorage.setItem('uid', this.result.UID)
              if (typeof callBack === 'function') {
                callBack.call(that, this.result);
              }
            }
          };
        };
        request.onupgradeneeded = function (e) {
          let db = e.target.result;
          // 检测是否存在此数据库表
          if (!db.objectStoreNames.contains('sys-setting')) {
            // 创建对象仓库
            let store = db.createObjectStore('sys-setting', {
              keyPath: 'id'
            });
            // 创建索引
            store.createIndex('userIdIndex', 'userId', {
              unique: false
            });
          }
        };
      } else { // 不支持
        alert('不支持');
      }
    }
  }
};
