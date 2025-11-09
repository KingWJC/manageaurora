/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-09-05 00:40:14
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-08-08 10:58:49
 * @FilePath: \common-base\mixins\init-app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 行为日志
 *  1. 项目启动时
 *  2. 页面更新
 *  3. 页面销毁-ok
 *  4. 启动worker,worker 失败
 *  5. 启动本地协议字典配置, 加载字典异常
 *  6. 启动线上加载字典配置, 加载字典异常
 *  7. 页面跳转
 *  8. 页面点击
 *  9. 页面进入前后台切换
 *  10. 用户发生切换-暂不支持上报
 *  11. tab切换
 */

import Login from '../login/login';
import LonchJsApi from '../api/web-app';
import commonEventHandler from '../mixins/common-event-handler';
import dictionary from '../data-dictionary/dictionary';
import {reportBehavior} from '../api/web-log';
import fingerprint from '../utils/fingerprintjs.v3.3.3.min';
import config from '../../config';
import {default as WebSocketService} from '../api/webSocketApi/WebSocketService.js'
import commonApi from "@/common-base/config/common-api-config.js";
import { getMD5String, getCookieSKKey, getCookieSKKeyObject } from '../utils/crypto.js';

import UserRole from './user-role.js'

function initProductPermissionsActions (arr) {
  let result = [];
  arr.forEach(function (item) {
    if (item.type === '0') {
      result.push(item);
    } else if (item.type === '1') {
      item.actions = function (item, arr) {
        let actions = [];
        arr.forEach((subItem) => {
          if (subItem.type === '2' && subItem.parentid === item.id) {
            actions.push(subItem);
          }
        });
        return actions;
      }(item, arr);
      result.push(item);
    }
  });
  return result;
}

function filterNoPermissionNode (list) {
  let arr = [];
  list.forEach(function (item) {
    if (item.type === '1') {
      arr.push(item);
    } else if (item.type === '0' && item.children && item.children.length > 0) {
      let children = filterNoPermissionNode(item.children);
      if (children.length > 0) {
        item.children = children;
        arr.push(item);
      }
    }
  });
  return arr;
}

export default {
  mixins: [UserRole],
  data () {
    return {
      isLogin: false,
      isInitialized: false,
      isAppInitialized: false,
      isPermissionInitialized: false,
      isUserInfoInitialized: false,
      isVersionInitialized: false,
      viewportWidth: document.body.offsetWidth,
      commonAreaDatas: null,
      isFormNetWork: false,
      // 是否跳过开屏广告
      isSkipStartVideo: false,
    };
  },
  created () {
    window.vue = this;
    window.vm = this;
    this.LonchJsApi = LonchJsApi;
    this.Login = Login;
    // todo: 这一行代码会引起ios跳转about:blank，所以先注释掉获取终端id的功能
    // this.initTerminalId();
    LonchJsApi.ready(
      async () => {
        await this.iframeInit()

        let params = this.utils.getParams();
        let projectName = (params.appName || this.CFG.projectName).toLowerCase();
        if (params.hasOwnProperty('hiddenMenu')) {
          this.CFG.isShowLeftSide = !params.hiddenMenu;
        }
        this.CFG.appName = projectName;
        this.CFG.projectName = projectName;
        if (/^https/.test(window.location.href)) {
          this.isFormNetWork = true;
        }
        if (LonchJsApi.isInAppV2()) {
          this.queryNetStatus();
        }
        // 基础数据预加载是否已初始化
        if (this.CFG.isCommonDataPreLoadingInitialized) {
          this.onConfigedInitializedMixin();
        } else {
          if (LonchJsApi.isInAppV2() && !this.isVersionInitialized) {
            // 需要先加载本地版本数据
            this.getVersions(function (appInfo) {
              if (appInfo && appInfo.clientInfo) {
                this.CFG.token = appInfo.clientInfo.token;
                this.CFG.isVisitor = !!appInfo.clientInfo.isVisitor; // 游客标识
                this.CFG.isSupportH5Cache = !!appInfo.clientInfo.isSupportH5Cache; // app是否支持h5缓存
                this.CFG.isLogin = !!appInfo.clientInfo.token;
                // 终端ID取App的设备id
                // let terminalId = appInfo && appInfo.clientInfo ? appInfo.clientInfo.deviceId : this.utils.UUID(32, 16);
                // 20241226优化sonar
                // 上面判断了appInfo.clientInfo存在，所以上面三元表达式条件一定成立
                let terminalId = appInfo.clientInfo.deviceId;
                this.CFG.terminalId = terminalId;
                this.CFG.sk = '';
                this.saveTerminalId();
              }
              this.loadCommonDataConfig();
            });
          } else {
            this.loadCommonDataConfig();
          }
        }
      },
      this
    );
  },
  mounted () {
    /**
     * 关闭加载中
     */
    if (typeof window.closeWaitLoading === 'function') {
      window.closeWaitLoading();
    }
    this.viewportWidth = document.body.offsetWidth;
    this.CFG.viewportWidth = this.viewportWidth;
    window.addEventListener('popstate', this.popstate, false);
    /**
     * 统一点击事件处理
     *  按钮防暴击
     *  收集按钮点击行为
     */
    document.removeEventListener('click', this.eventHandlerMixin);
    document.addEventListener('click', this.eventHandlerMixin, false);

    /**
     * 控制是否线上VConsole
     * 连续点击三秒内15次，开启或关闭
     * 默认关闭VConsole
     */
    if (this.CFG.env.VUE_APP_MODE === 'production') {
      this.closeVConsole(); // 生产环境，默认关闭VConsole
    }

    /**
     * 非App环境和小程序环境，监控显示隐藏，顶级窗口,
     * AndroidApp,无原生visibilitychange事件，使用app通知处理
     */
    if (!LonchJsApi.isInAndroidApp() && !this.CFG.client.isMiniprogram && window.self === window.top) {
      document.addEventListener('visibilitychange', this.onReVisible);
    }

    /**
     * 监听网络变化
     */
    LonchJsApi.bindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged
    });

    /**
     * 监听显示、隐藏变化
     */
    LonchJsApi.bindMsgHandlers({
      visibilityChanged: this.onVisibilityChanged
    });
    // 添加通用城市参数
    //let themeLink = document.querySelector('link[name=theme]');
    //console.log('theme defaultStyle',defaultStyle);
    //themeLink.setAttribute('href', './');
    // window.addEventListener('offline', function () {
    //   console.log('offline');
    //   that.$router.push({
    //     path: '/error/netWorkError'
    //   });
    // });
  },
  updated () {
    this.$nextTick(() => {
      this.updateCustomSettings();
    });
    //if (LonchJsApi.isInApp()) {
    //  reportBehavior({
    //    operation: 'updated',
    //    url: window.location.href,
    //    evt: 'updated',
    //    target: 'init-app',
    //    data: {}
    //  });
    //}
  },
  beforeDestroy () {
    LonchJsApi.unBindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged
    });
    LonchJsApi.unBindMsgHandlers({
      visibilityChanged: this.onVisibilityChanged
    });
    reportBehavior({
      operation: 'pageDestroy',
      url: window.location.href,
      evt: 'beforeDestroy',
      target: 'initApp',
      data: {}
    });
  },
  methods: {
    /**
     * 初始化终端ID,不区分正式测试环境
     * 优先取cookie、cookie没有再生成
     */
    initTerminalId (terminalId, callback) {
      if (terminalId) {
        callback();
      } else if (LonchJsApi.isInApp()) {
        terminalId = this.utils.UUID(32, 16);
        this.CFG.terminalId = terminalId;
        this.CFG.sk = '';
        callback();
      } else {
        // todo: 这一行代码会引起ios跳转about:blank，所以先注释掉获取终端id的功能 需要app环境测试
        this.getTerminalIdByFinger(id => {
          this.CFG.terminalId = id;
          this.CFG.sk = '';
          this.webLog.customLog({
            sourceName: this.CFG.projectName,
            sourceType: LonchJsApi.clientType,
            appVer: this.CFG.client.clientInfo ? this.CFG.client.clientInfo.version : '',
            curPageUrl: window.location.href,
            errCode: 'WEBAPP060000',
            reqResult: JSON.stringify({
              terminalId: this.CFG.terminalId,
              sk: this.CFG.sk,
              isIframe: window.self !== window.top
            }),
            errLevel: 'info',
            errMsg: `保存 WEB-ID:, WEB-ID=${this.CFG.terminalId}:SK=${this.CFG.sk}`,
            userAgent: window.navigator.userAgent
          });
          callback();
        });
      }
    },
    /**
     * 页面点击事件处理
     * 按钮防暴击
     * toggle vconsole
     * 用户点击行为上报
     * @param evt
     */
    eventHandlerMixin (evt) {
      let that = this;
      let target = evt.target || evt.srcElement || evt.currentTarget.activeElement;
      let button = this.utils.closest(target, 'button');
      if (button) {
        setTimeout(function () {
          that.perventButtonReClick(button);
        }, 0);
      }
      // toggle vconsole
      this.toggleVConsole(evt);
      // 用户点击行为上报
      if (LonchJsApi.isInApp() && config.isOpenLog) {
        commonEventHandler(evt);
      }
    },

    /**
     * 防止用户暴击
     * @param button
     */
    perventButtonReClick (button) {
      if (button && !button.disabled) {
        button.disabled = true;
        setTimeout(function () {
          button.disabled = false;
        }, 500);
      }
    },
    // 获取浏览器指纹
    getTerminalIdByFinger (callback) {
      fingerprint.load().then(fp => fp.get()).then(async result => {
        const visitorId = result.visitorId;
        const webId = await this.getWebId(visitorId);
        if (typeof callback === 'function') {
          callback(webId);
        } else {
          return webId;
        }
      });
    },
    /**
     * @description: 保存webId（以前的函数名叫保存terminalId，20240525后改成webId）
     * @param {*} webId
     * @return {*}
     */
    saveTerminalId () {
      // 每次更新 WEB-ID 的时候，如果 WEB-ID 有变化，则清空缓存和cookie中的密钥
      if (LonchJsApi.isInApp()) {
        this.utils.setCookie(getCookieSKKey(), this.CFG.terminalId, '/', this.CFG.domain, 365 * 24 * 60 * 60 * 1000);
      } else {
        this.utils.setCookie(getCookieSKKey(), `${this.CFG.terminalId}:${this.CFG.sk || ''}`, '/', this.CFG.domain, 365 * 24 * 60 * 60 * 1000);
      }
    },
    onNetStatusChanged (result) {
      this.CFG.netStatus = result.status;
      if (!this.CFG.disableErrorGame && result.status === 0) {
        this.$router.push({
          path: '/error/netWorkError'
        });
      }
      reportBehavior({
        operation: 'netStatusChanged',
        url: window.location.href,
        evt: 'netStatusChanged',
        target: 'initApp',
        data: {
          status: result.status
        }
      });
    },
    updateClient (client) {
      this.CFG.client = Object.assign(this.CFG.client, client);
    },
    /**
     * 查询网络状态，APP环境
     */
    queryNetStatus () {
      this.API.send(
        {'command': 'queryNetStatus'},
        {},
        function (res) {
          if (res.opFlag) {
            let serviceResult = res.serviceResult;
            this.CFG.netStatus = serviceResult.status;
          }
        },
        function () {
        },
        this,
        true
      );
    },
    /**
     * 页面路由发生变化，用户行为上报
     */
    popstate () {
      this.$router.isBack = true;
      if (LonchJsApi.isInApp()) {
        reportBehavior({
          operation: 'popstate',
          url: window.location.href,
          evt: 'popstate',
          target: 'initApp',
          data: {}
        });
      }
    },

    /**
     * 监听app显示隐藏通知
     */
    onVisibilityChanged (result) {
      this.CFG.visibilityState = result.visibilityState;
    },
    /**
     * 页面显示或隐藏状态监听器
     * @param e
     */
    onReVisible (e) {
      // 未初始化完成时不处理
      if (!this.isInitialized) {
        return;
      }
      //console.log('===visibilitychange===', e.target.visibilityState, window.location.href);
      if (LonchJsApi.AppMsgHandlers['visibilityChanged']) {
        LonchJsApi.triggerAppMsgHandlers('visibilityChanged', {visibilityState: e.target.visibilityState});
      }
      if (window.self === window.top && e && e.target && e.target.visibilityState === 'visible') {
        let session = Login.getSession();
        if (session.token && this.CFG.token !== session.token) {
          // 用户重新登录后，更新token和拉新版本并检查当前版本是否伟最新
          //let url = window.location.origin + window.location.pathname;
          //let params = {appName: this.CFG.project.name};
          let homePath = this.utils.makeUrl(window.location.origin + window.location.pathname, {appName: this.CFG.project.name});
          this.$confirm({
            title: '提示',
            text: '当前用户已发生变化，请重新加载！',
            buttons: [
              {
                text: '确定',
                type: 'primary',
                callback: () => {
                  window.location.href = homePath;
                }
              }
            ]
          });
          // 清除菜单接口缓存
          //this.CFG.token = session.token;
          //this.CFG.loginTime = session.time;
          //this.updateLastVersions(); // 更新版本
          //this.isChangeUser();
          reportBehavior({
            operation: 'loggedUserChanged',
            url: window.location.href,
            evt: 'visibilitychange',
            target: 'initApp',
            data: {
              token: this.CFG.token,
              newToken: session.token
            }
          });
        }
      }

      let operation = e.target.visibilityState === 'visible' ? 'pageVisible' : 'pageHidden';
      // 记录页面是否显示
      reportBehavior({
        operation: operation,
        url: window.location.href,
        evt: 'visibilitychange',
        target: 'initApp',
        data: {
          visibilityState: e.target.visibilityState
        }
      });
    },
    /**
     * token变化时，检查是否切换用户
     * 1. 同一用户重新登录，更新权限列表、检查当前页面是否有权限，无权限时跳转到无权限页面，有权限不处理
     * 2. 换用户登录，跳转到首页，更新权限列表
     */
    //isChangeUser () {
    //  let that = this;
    //  that.$confirm({
    //    title: '提示',
    //    text: '您当前用户已发生变化，需要从新加载',
    //    buttons: [
    //      {
    //        text: '确定',
    //        type: 'primary',
    //        callback: () => {
    //          window.location.href = window.location.origin + window.location.pathname;
    //        }
    //      }
    //    ]
    //  });
    //  //this.getUserByTokenMixin({}, function () {
    //
    //  //if (this.CFG.userInfo.id === userInfo.id) {
    //  //  console.log('==切换用户：重新登录==');
    //  //  this.updateProPermissions();
    //  //} else {
    //  //  console.log('==切换用户：新用户==');
    //  //  this.$confirm({
    //  //    title: '提示',
    //  //    text: '您当前用户已发生变化，需要从新加载',
    //  //    buttons: [
    //  //      {
    //  //        text: '确定',
    //  //        type: 'primary',
    //  //        callback: () => {
    //  //          window.location.href = window.location.origin + window.location.pathname;
    //  //        }
    //  //      }
    //  //    ]
    //  //  });
    //  //}
    //  //});
    //},
    onConfigedInitializedMixin () {
      this.CFG.projects = this.CFG.commonDataConfig.projects;
      this.CFG.origins = this.CFG.origins.length > 0 ? this.CFG.origins : this.CFG.commonDataConfig.origins;
      this.CFG.project = this.utils.getFirstMatchedData(this.CFG.projects, 'name', this.CFG.projectName.toLocaleLowerCase());
      if (LonchJsApi.isInApp()) {
        const terminalId = this.utils.getCookie(getCookieSKKey());
        this.CFG.terminalId = terminalId;
      } else {
        const originSk = this.utils.getCookie(getCookieSKKey());
        const skObject = getCookieSKKeyObject(originSk);
        if (skObject) {
          this.CFG.terminalId = skObject.terminalId;
          this.CFG.sk = skObject.sk;
        }
      }
      this.initTerminalId(this.CFG.terminalId, async () => {
        this.CFG.projects = this.CFG.commonDataConfig.projects;
        this.CFG.modulesVersions = this.CFG.commonDataConfig.modulesVersions;
        this.CFG.origins = this.CFG.origins.length > 0 ? this.CFG.origins : this.CFG.commonDataConfig.origins;
        this.CFG.project = this.utils.getFirstMatchedData(this.CFG.projects, 'name', this.CFG.projectName.toLocaleLowerCase());
        this.CFG.commonParams = Object.assign(this.CFG.commonParams, {
          productId: this.CFG.project.id,
          manageProductId: this.CFG.project.id
        });

        if(!this.checkRuntime()) {
          return
        }
        
        this.isLogin = Login.initialize();
        
        // 如果该项目不在 App 中，则进行设置 前端 ajax 请求，加密密钥（SK）
        if (this.CFG.project.secretEnabled && !LonchJsApi.isInApp()) {
          await this.setAjaxSecretKey();
        } else {
          this.saveTerminalId();
        }

        if (this.isLogin || LonchJsApi.isInApp()) {

          this.connectApiWebSocket()
          if (this.isInitialized) {
            this.isPermissionInitialized = true;
            this.isUserInfoInitialized = true;
            this.isVersionInitialized = true;
          } else {
            this.getUserInfoMixin();
            this.initVersions();
            this.initPermissions();
          }
        } else if (this.CFG.isNonCompulsoryLogin) {
          /**
           * 主项目如果支持游客登录，自动进行游客登录
           * 游客登录后,
           */
          if (window.self === window.top && this.CFG.isVisitorLogin) {
            this.visitorLogin(() => {

              this.connectApiWebSocket()

              this.initVersions();
              this.initPermissions();
              this.getUserInfoMixin();
            });
          } else {
            this.initVersions();
          }
        } else {
          // 没有token的情况下，是第一次登录，所以这个场景是用户输入一个页面地址，但是没有登录，所以要登录后回到这个地址
          Login.toLogOut(null, true);
          return;
        }
        if (typeof this.onConfigedInitialized === 'function') {
          this.onConfigedInitialized();
        }
        if (this.CFG.isLogClient && !LonchJsApi.isInApp()) {
          this.saveClientInfo();
        }
      });
    },
    initProductPermissions (arr) {
      arr = this.utils.duplicate(arr, 'id'); // 去重
      this.utils.sort(arr, 'id'); // 默认根据ID排序
      //this.utils.sort(arr, 'sort'); // 根据sort排序
      let permissions = this.CFG.permissions && this.CFG.permissions.length ? this.CFG.permissions : initProductPermissionsActions(arr);// 初始化权限按钮
      let permissionTree = this.utils.array2tree(permissions, 'id', 'parentid');
      permissionTree = filterNoPermissionNode(permissionTree);
      this.utils.sortTree(permissionTree, 'sort');
      this.CFG.permissionTree = permissionTree;
      this.CFG.permissions = permissions;
      this.isPermissionInitialized = true;
      this.updateInitStatus();
    },
    updateInitStatus () {
      // 必须初始化基础数据\必须初始化版本
      if (!this.CFG.isCommonDataConfigInitialized || !this.isVersionInitialized) {
        return;
      }
      // 必须登录时，初始化权限和用户信息
      if (!this.CFG.isNonCompulsoryLogin && (!this.isPermissionInitialized || !this.isUserInfoInitialized)) {
        return;
      }
      if (this.CFG.customSettings && typeof this.CFG.customSettings === 'object') {
        this.updateCustomSettings();
      }
      // 校验当前用户在当前产品中是否没有权限
      this.checkUserPermission(() => {
        this.isInitialized = true;
        this.CFG.isInitialized = true;
        this.onInitialized();
      });
    },
    // 触发初始化回调
    onInitialized () {
      let callbacks = this.CFG.initializedCallBacks;
      for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback.fn.call(callback.context, callback.params);
      }
      this.CFG.initializedCallBacks = [];
      // 页面初始化完成处理，app.vue初始化
      if (typeof this.onAppInitialized === 'function' && !this.isAppInitialized) {
        this.isAppInitialized = true;
        this.onAppInitialized();
      }
    },

    /**
     * 更新用户自定义设置
     * 当前仅支持字体大小设置
     */
    updateCustomSettings () {
      let documentElement = self.document.documentElement;
      let fs;
      let customSettings = this.CFG.customSettings;
      for (let item in customSettings) {
        if (customSettings.hasOwnProperty(item)) {
          switch (item) {
            case 'fontSize':
              fs = customSettings.fontSize + 'px';
              documentElement.style.fontSize = fs;
              self.document.body.style.fontSize = fs;
              break;
            default:
              break;
          }
        }
      }
    },

    /**
     * 初始化权限数据
     * 非必须登录且不支持游客登录时取消调用
     */
    initPermissions () {
      if (this.CFG.isNonPermissions || this.isInitialized || (this.CFG.isNonCompulsoryLogin && !this.CFG.isVisitorLogin) || this.isPermissionInitialized) {
        this.isPermissionInitialized = true;
        this.updateInitStatus();
      } else {
        this.getPermissions({});
      }
    },

    /**
     * 初始化版本配置数据
     */
    initVersions () {
      if (this.CFG.isNonVersionControl || this.isVersionInitialized) {
        this.isVersionInitialized = true;
      } else {
        if (this.CFG.versionConfig && this.CFG.versionConfig.length > 0) {
          this.checkVersion(this.CFG.versionConfig);
          this.isVersionInitialized = true;
        } else {
          this.getVersions();
        }
      }
      this.updateInitStatus();
    },

    /**
     * 获取版本
     * @param callBack
     */
    getVersions (callBack) {
      let service;
      if (LonchJsApi.isInApp()) {
        service = {'command': 'getAppInfo', module: 'appClient'};
      } else {
        //service = {module: 'appClient', url: '/App/QueryUserWebAppUpdateSetting', method: 'POST', comment: '获取版本信息'};
        service = {module: 'appClient', url: '/App/QueryUserWebAppUpdateSettingV2', method: 'POST', comment: '获取版本信息'};
      }
      this.API.send(
        service, {},
        function (res) {
          if (res.opFlag) {
            let serviceResult = res.serviceResult;
            let versions = serviceResult && serviceResult.webApps ? serviceResult.webApps : [];
            let clientInfo = serviceResult.clientInfo || {};
            //this.CFG.client.appType = clientInfo.deviceType || '';
            if (clientInfo.appName || clientInfo.name) {
              this.CFG.client.appName = clientInfo.appName || clientInfo.name;
            }
            this.CFG.client.clientInfo = clientInfo;
            this.CFG.versionConfig = versions;
            this.CFG.customSettings = serviceResult && serviceResult.customSettings ? serviceResult.customSettings : {};
            if (LonchJsApi.isInApp() && versions.length < 1) {
              this.webLog.customLog({
                sourceName: this.CFG.projectName,
                sourceType: LonchJsApi.clientType,
                appVer: clientInfo ? clientInfo.version : '',
                curPageUrl: window.location.href,
                errCode: 'WEBAPP060000',
                reqResult: typeof res === 'object' ? JSON.stringify(res) : res,
                errLevel: 'info',
                errMsg: '***getAppInfo no versions error***',
                userAgent: window.navigator.userAgent
              });
            }
            if (typeof this.updateVersions === 'function') {
              this.updateVersions(versions);
            }
            // 检查当前版本
            this.checkVersion(versions);
            this.isVersionInitialized = true;
            this.updateInitStatus();
            if (typeof callBack === 'function') {
              callBack.call(this, serviceResult);
            }
          }
        },
        function () {
          //console.log('===getVersions error==', err);
        },
        this
      );
    },
    /**
     * @description: 获取LID
     * @param {*} callBack
     * @return {*}
     */
    getWebId (visitorId) {
      return new Promise(resolve => {
        const args = {
          "description": "web客户端WebId",
          "name": visitorId,
          "regenerate": true
        };
        this.API.send(
          commonApi.lid.lidAssignWorkerId, args,
          function (res) {
            if (res.opFlag && res.data) {
              resolve(`${new Date().getTime()}${res.data}0000001`);
            }
          },
          function () {
          },
          this
        );
      })
    },
    /**
     * 设置前端 Ajax 请求并设置对称密钥 sk
     * 1. 判断 sk 是否存在, 或者 terminalId 是否有变化
     * 2. sk 存在，设置 CFG.sk = sk
     * 3. sk 不存在，或者 terminalId 有变化
     *  3.1 根据 terminalId 获取公钥（该请求不加密） 
     *  3.2 生成对称密钥 sk, 规则：MD5(terminalId + 毫秒时间戳)
     *  3.3 保存对称密钥到 CFG.sk 里
     *  3.4 保存对称密钥到 cookie 里（SK） // TODO: 注意这里的 domain 为 CFG.domain 如果路由非 CFG.domain 子域名，则无法保存到 cookie 里
     *  3.5 保存对称密钥到 服务器（该请求 RSA 加密） 
     * 
     * @param {*} needSetSk 如果 terminalId 有变化，则设置 Ajax SecretKey 
     */
    async setAjaxSecretKey() {
      if (!this.CFG.sk)  {
        // 获取公钥
        const publicKey = await this.getWebSecretKey();
        // 对称密钥 MD5(terminalId + 毫秒时间戳)
        const rawKey = `${this.CFG.terminalId}${new Date().getTime()}`;
        const symmetricKey = getMD5String(rawKey);
        // 保存对称密钥到 CFG.sk
        this.CFG.sk = symmetricKey;
        this.saveTerminalId();
        this.webLog.customLog({
          sourceName: this.CFG.projectName,
          sourceType: LonchJsApi.clientType,
          appVer: this.CFG.client.clientInfo ? this.CFG.client.clientInfo.version : '',
          curPageUrl: window.location.href,
          errCode: 'WEBAPP060000',
          reqResult: JSON.stringify({
            terminalId: this.CFG.terminalId,
            sk: this.CFG.sk,
            isIframe: window.self !== window.top
          }),
          errLevel: 'info',
          errMsg: `保存 WEB-ID:SK, WEB-ID=${this.CFG.terminalId}:SK=${this.CFG.sk}`,
          userAgent: window.navigator.userAgent
        });
        // 保存对称密钥到 服务器
        await this.saveWebSecretKey(symmetricKey, publicKey);
      } else {
        this.saveTerminalId();
      }
    },
    /**
     * 获取 Ajax 请求公钥（根据 terminalId）
     * @returns Promise
     */
    getWebSecretKey() {
      return new Promise((resolve) => {
        this.API.send(
          commonApi.secretkey.securityGetPublicKey, {
            terminalType: 1 // 终端类型: 0: App 1：web
          },
          (res) => {
            if (res.opFlag && res.data) {
              resolve(res.data)
            }
            resolve()
          },
          () => {},
          this
        );
      });
    },
    /**
     * 保存对称密钥到 服务器
     * @param {*} symmetricKey // 对称密钥
     * @param {*} publicKey // 公钥
     * @returns 
     */
    saveWebSecretKey(symmetricKey, publicKey) {
      return new Promise((resolve) => {
        this.API.send(
          commonApi.secretkey.securitySaveSymmetricKey, {
            terminalType: 1, // 终端类型: 0: App 1：web
            symmetricKey,
            publicKey // 公钥并不传给后端，在构造 params 的时候使用公钥加密对称密钥
          },
          () => {
            resolve();
          },
          () => {
            this.CFG.sk = '';
            this.utils.deleteCookie(getCookieSKKey(), '/', this.CFG.domain, -1);
            window.location.reload();
          },
          this
        );
      });
    },
    /**
     * 更新版本数据
     */
    //updateLastVersions () {
    //  let service;
    //  if (LonchJsApi.isInApp()) {
    //    service = {'command': 'getAppInfo', module: 'appClient'};
    //  } else {
    //    service = {module: 'appClient', url: '/App/QueryUserWebAppUpdateSettingV2', method: 'POST', comment:
    // '获取版本信息'}; } this.API.send( service, {}, function (res) { if (res.opFlag) { let versions = res.serviceResult &&
    // res.serviceResult.webApps ? res.serviceResult.webApps : []; this.CFG.versionConfig = versions;
    // this.CFG.customSettings = res.serviceResult && res.serviceResult.customSettings ?
    // res.serviceResult.customSettings : {}; if (typeof this.updateVersions === 'function') {
    // this.updateVersions(versions); } this.checkVersion(versions); } }, function () { }, this ); },
    /**
     * 更新数据权限数据
     * 1. 清除菜单缓存，
     * 2. 重新获取数据
     */
    //updateProPermissions () {
    //  // 清除菜单缓存
    //  //console.log('===updateProPermissions===');
    //  this.getPermissions({}, function (result) {
    //    let arr = this.utils.duplicate(result, 'id'); // 去重
    //    this.utils.sort(arr, 'id'); // 默认根据ID排序
    //    let permissions = initProductPermissionsActions(arr);// 初始化权限按钮
    //    let permissionTree = this.utils.array2tree(permissions, 'id', 'parentid');
    //    permissionTree = filterNoPermissionNode(permissionTree);
    //    this.utils.sortTree(permissionTree, 'sort');
    //    this.CFG.permissionTree = permissionTree;
    //    this.CFG.permissions = permissions;
    //  });
    //},
    // 废弃报错版本到cookie机制，改为根据token是否更新，重新拉取版本
    //setupVersions (versions) {
    //  let vs = [];
    //  for (let v of versions) {
    //    vs.push({
    //      version: v.version,
    //      last_force_update_version: v.last_force_update_version,
    //      webapp_url: v.webapp_url
    //    });
    //  }
    //  this.utils.setCookie(this.CFG.versionKey, JSON.stringify(vs), '/', this.CFG.domain, this.CFG.expire);
    //},
    //getLastUpdateVersions () {
    //  let session = Login.getSession();
    //  if(session.time < this.CFG.loginTime){
    //    //
    //  }
    //  if (this.CFG.versionKey) {
    //    return JSON.parse(this.utils.getCookie(this.CFG.versionKey) || '[]');
    //  }
    //  return [];
    //},

    /**
     * 获取权限数据
     * @param args
     * @param callBack
     */
    getPermissions (args, callBack) {
      this.API.send(
        {
          // module: 'mserver',
          // url: '/user/productPermissionNames',
          module: 'uaapi',
          url: '/user/productPermissionNames2',
          method: 'POST',
          cache: true,
          expire: 0,
          isGlobal: true,
          comment: '当前登录用户产品菜单'
        },
        args,
        function (res) {
          if (typeof callBack === 'function') {
            callBack.call(this, res.serviceResult);
          } else {
            this.initProductPermissions(res.serviceResult);
          }
        },
        function () {
        },
        this
      );
    },

    /**
     * 保存用户访问类型
     */
    saveClientInfo () {
      let os = this.CFG.client.os;
      // YaoFaCai_Client_Andriod YaoFaCai_Client_IOS YaoFaCai_Client_PC, YaoFaCai_Client_MAC
      // appClientId
      let appClientId = this.CFG.project.appName + '_' + LonchJsApi.clientType;
      let osName = os.sys;
      if (/iPhone|Mac|iPad/i.test(osName)) {
        osName = 'macOS';
      }
      let args = {
        'os': osName,
        'deviceId': '--',
        'deviceBrand': '--',
        'deviceVersion': os.name,
        'appClientId': appClientId,
        'appType': this.CFG.project.appName,
        'appVersion': '--'
      };
      this.API.send(
        {module: 'appClient', url: '/App/SaveClientInstallInfo', method: 'POST', comment: '保存用户客户端信息'},
        args,
        function () {
        },
        function () {
        },
        this
      );
    },

    /**
     * 获取当前登录人资料
     * 非必须登录且不支持游客登录时取消调用
     */
    getUserInfoMixin () {
      if (this.CFG.isNonUserInfo || this.isInitialized || !this.utils.isEmpty(this.CFG.userInfo) || (this.CFG.isNonCompulsoryLogin && !this.CFG.isVisitorLogin)) {
        this.isUserInfoInitialized = true;
        this.updateInitStatus();
      } else {
        this.getUserByTokenMixin({});
      }
    },

    /**
     * 获取登录用户资料
     * @param args
     * @param callback
     */
    getUserByTokenMixin (args, callback) {
      this.API.send({
        module: 'mserver',
        url: '/human/selectHumanByToken',
        method: 'POST',
        cache: true, networkFirst: true,
        expire: 0
      }, args, function (res) {
        if (res.opFlag) {
          let serviceResult = res.serviceResult;
          if (typeof callback === 'function') {
            callback.call(this, serviceResult);
          } else {
            this.CFG.userInfo = serviceResult;
            this.isUserInfoInitialized = true;
            this.updateInitStatus();
          }
        }
      }, function () {
      }, this);
    },

    /**
     * 游客登录
     * 游客登录成功，设置token、time、isVisitor游客标识，(todo App端根据getAppInfo方法获取）
     */
    visitorLogin (callback) {
      let args = {
        uuid: this.CFG.terminalId
      };
      this.API.send({module: 'uaapi', url: '/user/doUuidlogin2', method: 'POST', comment: '游客登录'}, args,
        function (res) {
          if (res.opFlag) {
            let data = res.serviceResult;
            let session = {
              token: data.token,
              isVisitor: 1,
              time: new Date().getTime()
            };
            this.CFG.token = data.token;
            this.CFG.isVisitor = true;
            this.CFG.isLogin = true;
            this.isLogin = true;
            Login.setSession(session);
            if (typeof callback === 'function') {
              callback(data);
            }
          }
        },
        function (e) {
          if (typeof callback === 'function') {
            callback(e);
          }
        },
        this
      );
    },

    /**
     * web-app端：检查是否访问了最低可用版本，否则跳转到最新版本
     * @param versions
     */
    checkVersion (versions) {
      let url = window.location.href;
      let accessVersion = this.utils.getAccessVersion();
      let versionConfig = this.utils.getVersionConfig(versions);
      let lastForceUpdateVersion = versionConfig ? versionConfig.last_force_update_version || versionConfig.version : '';
      // 在浏览器端如果访问了低于最低可用版本，则自动切换到最新版本
      if (accessVersion && lastForceUpdateVersion && typeof LonchJsApi === 'object' && !LonchJsApi.isInApp()) {
        if (!this.utils.compareVersions(accessVersion, lastForceUpdateVersion)) {
          let lastVersionUrl = this.utils.transformationMachedVersion(url, versions);
          window.location.replace(lastVersionUrl);
        }
      }
    },
    /**
     * 获取公共数据地址
     * @param isFormNetWork 来自网络，使用cdn配置路径
     * @return {string}
     */
    getCommonDataBasePath (isFormNetWork) {
      let commonDataPath = this.CFG.cdn.commonDataPath;
      if (LonchJsApi.isInAppV2() && !isFormNetWork) {
        commonDataPath = this.utils.transformationMachedVersion(commonDataPath, this.CFG.versionConfig, '/');
      }
      return commonDataPath.replace(/\/$/, '');
    },
    /**
     * webwork 消息处理器
     * @param e
     */
    webWorkerMessageHandler (e) {
      let data = e.data;
      let context = data.context;
      let result = data.data;
      switch (data.command) {
        case 'ready':
          this.postMessageWorker({
            command: 'start',
            url: this.CFG.commonDataConfigUrl,
            basePath: this.getCommonDataBasePath(this.isFormNetWork)
          });
          reportBehavior({
            operation: 'workerStart',
            url: window.location.href,
            evt: 'worker',
            target: 'initApp',
            data: {
              command: data.command,
              url: this.CFG.commonDataConfigUrl,
              basePath: this.getCommonDataBasePath(this.isFormNetWork),
              context: context
            }
          });
          break;
        case 'bunding-data':
          this.bundingData(context, result);
          break;
        case 'pre-loading-done':
          this.preLoadingDone();
          break;
        case 'lazy-loading-done':
          this.lazyLoadingDone();
          break;
        case 'loading-all-done':
          this.loadingAllDone();
          // 记录worker日志
          reportBehavior({
            operation: 'workerDone',
            url: window.location.href,
            evt: 'worker',
            target: 'initApp',
            data: {
              command: data.command,
              url: this.CFG.commonDataConfigUrl,
              basePath: this.getCommonDataBasePath(this.isFormNetWork),
              context: context
            }
          });
          break;
        case 'load-data-error':
          this.initDictionaryConfigMixin({
            url: this.CFG.commonDataConfigUrl,
            basePath: this.getCommonDataBasePath(this.isFormNetWork)
          });
          this.webLog.customLog({
            sourceName: this.CFG.projectName,
            sourceType: LonchJsApi.clientType,
            appVer: this.CFG.client.clientInfo ? this.CFG.client.clientInfo.version : '',
            curPageUrl: window.location.href,
            errCode: 'WEBAPP060000',
            reqResult: typeof data === 'object' ? JSON.stringify(data) : data,
            errLevel: 'info',
            errMsg: '加载字典数据失败！',
            userAgent: window.navigator.userAgent
          });
          break;
        case 'load-cache':
          LonchJsApi.indexDBCallBacks[e.data.data.sn](e.data.data);
          break;
        default:
          break;
      }

    },
    /**
     * 预加载完成,触发初始化完成
     * 开始初始化页面基础流程
     */
    preLoadingDone () {
      this.CFG.isCommonDataPreLoadingInitialized = true; // 开始权限、版本、用户信息接口
      this.onConfigedInitializedMixin();
    },
    /**
     * 懒加载公共数据完成事件，预留事件，暂时没有使用
     */
    lazyLoadingDone () {
    },
    /**
     * 字典数据加载完成
     */
    loadingAllDone () {
      this.CFG.isCommonDataConfigInitialized = true; // 开始加载页面
      this.updateInitStatus();
    },
    /**
     * 绑定字典数据
     * @param context 字典配置
     * @param data 字典数据
     */
    bundingData (context, data) {
      if (context && context.name) {
        this.CFG.commonDataConfig[context.name] = data;
      }
    },
    dictLoadingDone (type) {
      switch (type) {
        case 'pre-loading':
          this.preLoadingDone();
          break;
        case 'lazy-loading':
          this.lazyLoadingDone();
          this.loadingAllDone();
          break;
        default:
          this.loadingAllDone();
          break;
      }
    },
    /**
     * 加载字典数据,
     * todo mac App 加载本地调试时，无法发起worker通讯
     */
    loadCommonDataConfig () {
      if (typeof Worker === 'function' && !this.CFG.noWorker) {
        this.initWebWorker();
      } else {
        this.initDictionaryConfigMixin({
          url: this.CFG.commonDataConfigUrl,
          basePath: this.getCommonDataBasePath(this.isFormNetWork)
        });
      }
    },
    /**
     * 加载字典本地配置失败, 从网络获取配置
     * @param err
     */
    loadingLocalConfigError (err) {
      let that = this;
      this.isFormNetWork = true;
      that.initDictionaryConfigMixin({
        url: that.CFG.commonDataConfigUrl,
        basePath: that.getCommonDataBasePath(this.isFormNetWork)
      });
      // 加载字典失败记录行为日志
      reportBehavior({
        operation: 'loadDictinaryError',
        url: window.location.href,
        evt: 'loadDictinaryError',
        target: 'initApp',
        data: {
          info: err.toString()
        }
      });
    },
    /**
     * 初始化webworker
     * 绑定worker消息处理
     * 绑定错误处理
     */
    initWebWorker () {
      let that = this;
      this.webWorker = new Worker('static/load-dict-worker.js');
      this.webWorker.addEventListener('message', this.webWorkerMessageHandler);
      this.webWorker.addEventListener('error', function (event) {
        that.initDictionaryConfigMixin({
          url: that.CFG.commonDataConfigUrl,
          basePath: that.getCommonDataBasePath(that.isFormNetWork)
        });
        // 记录worker失败
        reportBehavior({
          operation: 'workerError',
          url: window.location.href,
          evt: 'worker',
          target: 'initApp',
          data: {
            info: event.toString()
          }
        });
      });
    },
    /**
     * webworker失败后，启动字典加载模式
     * @param data
     */
    initDictionaryConfigMixin (data) {
      dictionary.init(data, null, this);
      // 启动获取字典数据
      reportBehavior({
        operation: 'loadDictinary',
        url: window.location.href,
        evt: 'loadDictinary',
        target: 'initApp',
        data: data
      });
    },
    /**
     * webworker通讯
     * @param data
     */
    postMessageWorker (data) {
      if (!this.webWorker) {
        this.initWebWorker();
      }
      this.webWorker.postMessage(data);
    },
    /**
     * 获取字典数据接口
     * @param name
     * @return {*}
     */
    getCommonDictionaryByName (name) {
      let commonData = this.CFG.commonDataConfig;
      if (name && commonData.hasOwnProperty(name)) {
        if (name === 'area') {
          if (!this.commonAreaDatas) {
            let areaDatas = [];
            let area = commonData[name];
            area.forEach(i => {
              areaDatas.push({
                ...i,
                c: i.code,
                id: i.code,
                n: i.name,
                label: i.name,
                p: i.parentcode,
                parentid: i.parentcode,
                level: i.levelcode
              });
            });
            this.commonAreaDatas = areaDatas;
          }
          return this.commonAreaDatas;
        } else {
          return commonData[name];
        }
      }
      return null;
    },
    /**
     * 批量获取字典数据接口
     * @param names
     * @return {*}
     */
    getCommonDictionary (names) {
      let commonData = this.CFG.commonDataConfig;
      if (names && this.utils.isArray(names)) {
        let arr = [];
        for (let i = 0; i < names.length; i++) {
          let name = names[i];
          let result = this.getCommonDictionaryByName(name);
          arr.push(result);
        }
        return arr;
      } else if (names && typeof names === 'string') {
        return this.getCommonDictionaryByName(names);
      } else {
        return commonData;
      }
    },

    /**
     * 显示或隐藏VConsole
     * 控制是否线上VConsole
     * 连续点击三秒内15次，开启或关闭
     * 默认关闭VConsole
     */
    toggleVConsole () {
      let now = new Date().getTime();
      if (now - this.startTime <= 3000) {
        this.clickTimes = this.clickTimes + 1;
        if (this.clickTimes >= 15) {
          if (this.isShowVConsole) {
            this.closeVConsole();
          } else {
            this.showVConsole();
          }
          this.clickTimes = 0;
          this.startTime = now;
        }
      } else {
        this.clickTimes = 0;
        this.startTime = now;
      }
    },
    initVConsoleStyle () {
      let style = document.createElement('style');
      style.type = 'text/css';
      document.head.appendChild(style);
      return style;
    },
    showVConsole () {
      if (!this.vConsoleStyle) {
        this.vConsoleStyle = this.initVConsoleStyle();
      }
      if (this.vConsoleStyle.hasChildNodes()) {
        this.vConsoleStyle.childNodes[0].textContent = '#__vconsole {display: block;}';
      } else {
        let cssText = [];
        cssText.push('#__vconsole {display: block;}');
        let pagecss = document.createTextNode(cssText.join(' '));
        this.vConsoleStyle.appendChild(pagecss);
      }
      this.isShowVConsole = true;
    },
    closeVConsole () {
      if (!this.vConsoleStyle) {
        this.vConsoleStyle = this.initVConsoleStyle();
      }
      if (this.vConsoleStyle.hasChildNodes()) {
        this.vConsoleStyle.childNodes[0].textContent = '#__vconsole {display: none;}';
      } else {
        let cssText = [];
        cssText.push('#__vconsole {display: none;}');
        let pagecss = document.createTextNode(cssText.join(' '));
        this.vConsoleStyle.appendChild(pagecss);
      }
      this.isShowVConsole = false;
    },
    /**
     * 当前登录用户是否为游客
     */
    isVisitor () {
      return this.CFG.isVisitor;
    },
    // iframe 初始化
    iframeInit() {
      if ( window.self === window.top ) {
        return
      }
      if ( Object.keys(this.CFG.commonDataConfig).length ) {
        this.CFG.isCommonDataPreLoadingInitialized = true
        this.CFG.isCommonDataConfigInitialized = true
      }
      if ( this.CFG.userInfo && Object.keys(this.CFG.userInfo).length ) {
        this.isUserInfoInitialized = true
      }

      if ( this.CFG.permissions && Object.keys(this.CFG.permissions).length ) {
        this.isPermissionInitialized = true
      }

      if ( this.CFG.versionConfig && this.CFG.versionConfig.length ) {
        this.checkVersion(this.CFG.versionConfig);
        this.isVersionInitialized = true
      }

      return new Promise((resolve) => {
        // 如果不是游客模式，不能确定是父页面没有传，还是非游客模式，所以在从app中获取一次。

        if ( !this.CFG.isVisitor && LonchJsApi.isInAppV2() ) {
          this.getVersions(function (appInfo) {
            if (appInfo && appInfo.clientInfo) {
              this.CFG.isVisitor = !!appInfo.clientInfo.isVisitor; // 游客标识
            }

            resolve()
          });
        } else {
          resolve()
        }
      })

      // isUserInfoInitialized: false,
      // isPermissionInitialized: false,
      // isVersionInitialized: false,

      // isInitialized: false,
      // this.updateInitStatus()
    },
    // 连接webSocket
    connectApiWebSocket() {
      /**
       * 不支持webSocket或在移动端，不连接webSocket
       * 未配置webSocketGateway地址, 没有登录，不初始化webSocket
       * 没有登录，不初始化webSocket
       * iframe，不初始化webSocket
       */
      if(
        typeof WebSocket === 'undefined' || 
        LonchJsApi.isInApp() || 
        !config.project || !config.project.webSocketGateway || 
        !config.token || 
        window.top !== window.self
      ) {
        return Promise.resolve(false)
      }

      // 使用webSocket请求
      const requestService = WebSocketService(this.CFG)
      requestService.init()
    },
    /**
     * 初始化判断当前设备是否支持（不展示设备的细颗度控制）
     * @return Boolean 此设置是否支持，true 支持
     */
    checkRuntime() {
      const disabledRuntime = this.CFG.project.disabledRuntime || []
      // web：浏览器
      //   pcWeb: 电脑浏览器
      //   mobileWeb: 手机浏览器
      //   wxWeb ：微信浏览器
      //   qyWxWeb ： 企业微信浏览器 
      //   wxMiniProgram ：微信小程序
      // app: app
      //   androidApp： 安卓APP
      //   iosApp：	iOSAPP
      //   macApp: macAPP
      //   windowsApp: windowsAPP

      /**
       * 没有禁用运行时
       */
      if(!disabledRuntime || !Array.isArray(disabledRuntime) || !disabledRuntime.length) {
        return true
      }

      const disabledConfig = {
        webApp: ['web'],
        miniprogram: ['web', 'miniprogram'],
        wxwork: ['web', 'wxwork'],
        micromessenger: ['web', 'micromessenger'],
        iosApp: ['app', 'iosApp'],
        macApp: ['app', 'macApp'],
        windowApp: ['app', 'windowApp'],
        androidApp: ['app', 'androidApp'],
      }


      const client = this.CFG.client || {}
      // 当前设备的类型
      const appType = client.appType || ''

      // 当前设备禁用类型列表
      const appTypeDisabledList = disabledConfig[appType] || []

      // 是否禁用
      let isDisabled = !!appTypeDisabledList.find(el => disabledRuntime.includes(el))

      // 浏览器进行PC端和移动端处理
      if( appType === 'webApp' && !isDisabled ) {
        if(
          client.isMobile && disabledRuntime.includes('mobileWeb') || 
          !client.isMobile && disabledRuntime.includes('pcWeb')
        ) {
          isDisabled = true
        }
      }
      
      /**
       * 禁用时，页面的提示 
       */ 
      if (isDisabled) {
        window.vm.$confirm({
          text: '当前设备不支持，请关闭',
          buttons: []
        });
      }

      return !isDisabled
    },
    /**
     * 跳过开屏广告
     */
    skipStartVideo() {
      this.isSkipStartVideo = true;
    }
  },
  watch: {
    '$route' () {
      reportBehavior({
        operation: 'pageOpened',
        url: window.location.href,
        evt: 'router',
        target: 'initApp',
        data: {
          path: this.$route.fullPath
        }
      });
    }
  }
};
