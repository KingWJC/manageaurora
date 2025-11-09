const Vue = require('vue');
const VueRouter = require('vue-router');
import History from './history';
import login from '../login/login';
import commonRouter from '../views/router';
import cfg from '../../config/index';
import utils from '../utils/utils';
import {reportBehavior} from './../api/web-log';

// import Api from '@/common-base/api/api';
import { setPermissionAction } from '@/common-base/api/permission';

const config = cfg;
const routerPush = VueRouter.prototype.push;

/**
 * 验证是否登录
 * @param to
 * @param from
 * @param next
 */
export function requireAuth (to, from, next) {
  if (LonchJsApi && LonchJsApi.isInApp()) {
    next();
  } else if (from.path === '/') {
    next();
  } else if (login.getToken()) {
    next();
  } else {
    login.toLogOut();
  }
}

/**
 * todo 路由跳转过程监控
 * @param location
 * @return {Q.Promise<any> | * | Promise<T | never>}
 */
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error);
};

/*
* 设置路由定时器
* */

function setRAFInterval(to, from, next, router) {
  if(window.vm && window.vm.CFG && window.vm.CFG.isInitialized) {
    cancelAnimationFrame(window.rAF);
    // 判断当前页面是否有moduleCode
    if(to.query && to.query.moduleCode) {
      getRouterActions(to, from, next, router);
    } else {
      routerOldlogic(to, from, next, router);
    }
  } else {
    window.rAF = requestAnimationFrame(function() {
      setRAFInterval(to, from, next, router);
    });
  }
}

/**
 * 初始化路由列表
 * @param routes
 */
export function initRouter (routes) {
  Vue.use(VueRouter);
  Vue.use(History);
  VueRouter.prototype.ownHistory = History;
  VueRouter.prototype.isBack = false;
  VueRouter.prototype.goBack = function () {
    if (this.ownHistory.canBack()) {
      this.isBack = true;
      this.go(-1);
    } else {
      if (LonchJsApi.clientType === 'androidApp' || LonchJsApi.clientType === 'iosApp' || (LonchJsApi.clientType === 'macApp' && window.self === window.top)) {
        if (window.self === window.top) {
          // 当前页面是顶级页面
          if (LonchJsApi.isInAppV2()) {
            LonchJsApi.callAppV2({
              command: 'popView',
              args: {}
            });
          } else if (LonchJsApi.isInApp()) {
            LonchJsApi.callApp({
              command: 'popView',
              args: {}
            });
          }
        } else {
          window.parent.history.back();
        }
      } else {
        this.isBack = true;
        this.go(-1);
      }
    }
    this.ownHistory.pop();
  };
  // 添加公共路由
  routes = Array.prototype.concat.call(commonRouter, routes);
  let router = new VueRouter({
    // mode: 'history',
    mode: 'hash',
    routes
  });

  router.beforeEach((to, from, next) => {
    if(window.vm && window.vm.CFG) {
      if(to.query && to.query.moduleCode) {
        getRouterActions(to, from, next, router);
      } else {
        routerOldlogic(to, from, next, router);
      }
    } else {
      setRAFInterval(to, from, next, router);
    }
  });
  return router;
}

// 获取moduleCode下的操作权限
async function getRouterActions(to, from, next, router) {
  // 优先以iframe的获取方式
  if ( await getRouterActionsIframe(to, from, next, router) ) {
    return
  }

  if ( await setPermissionAction(to.query.moduleCode) ) {
    routerOldlogic(to, from, next, router);
  } else {
    next('/');
  }
}

// iframe 获取权限，如果是iframe并获取成功，返回真
function getRouterActionsIframe(to, from, next, router) {
  // 不是iframe，退出并返回假
  if ( window.self === window.top ) {
    return false
  }
  const permissions = [];
  if(window.vm.CFG && window.vm.CFG.permissions && window.vm.CFG.permissions.length > 0) {
    window.vm.CFG.permissions.forEach(el => {
      if(el.code === to.query.moduleCode && el.actions && el.actions.length) {
        permissions.push(el);
      }
    })

    if ( permissions.length ) {
      routerOldlogic(to, from, next, router);
      return true
    }
  }

  // iframe请求父页面得到权限数据
  const iframeNoGetPermissionTime = 0.5 * 1000
  let iframePermissionTimeOut = false
  let getPermissionTimer = null
  return new Promise((resolve) => {
    LonchJsApi.postMessage('INNER-FRAME-GET-PERMISSION', {moduleCode: to.query.moduleCode}, null, function (data) {
      if ( iframePermissionTimeOut ) {
        return
      }
      config.permissions = data.permissions;
      clearTimeout(getPermissionTimer)
      routerOldlogic(to, from, next, router);
      resolve(true)
    });

    getPermissionTimer = setTimeout(() => {
      iframePermissionTimeOut = true
      resolve(false)
    }, iframeNoGetPermissionTime)
  })
}

// 这是之前router里的旧逻辑，因为现在需要在跳转前懒加载权限，所以把这部分的逻辑单独拿出来了
function routerOldlogic(to, from, next, router) {
  // todo 多web框架下, 内层窗口，检查路由跳转控制由框架负责处理
  //if (config.isMultiWebFramework && window.self != window.top) {
  //  console.log('===router beforeEach isMultiWebFramework subject===', window.location.href);
  //}
  if (router.isBack) {
    router.isBack = false;
    // todo 多web框架下, 内层窗口，检查路由跳转控制由框架负责处理
    //if (config.isMultiWebFramework && window.self != window.top) {
    //  console.log('===router beforeEach isMultiWebFramework subject isBack===', window.location.href);
    //}
    next();
  } else {
    let revisedQuery = {};
    let isReplace = false;
    /**
     * 追加form携带的moduleCode
     */
    if (!to.query.moduleCode && from.query.moduleCode && to.redirectedFrom !== '/') {
      isReplace = true;
      Object.assign(revisedQuery, {moduleCode: from.query.moduleCode});
    }
    /**
     * 路由修正：当访问非默认网关时，修正跳转路由携带appName参数，防止刷新路由改变网关调用
     */
    if (!to.query.appName && config.defaultName && config.projectName.toUpperCase() != config.defaultName.toUpperCase()) {
      isReplace = true;
      Object.assign(revisedQuery, {appName: config.projectName});
    }
    if (!utils.isEmptyObject(revisedQuery)) {
      if(isReplace) {
        next({path: to.path, query: Object.assign(to.query, revisedQuery)});
      } else {
        next();
      }
    } else {
      History.push(to);
      config.activateRoute = to;
      // 页面跳转时，记录行为
      reportBehavior({
        operation: 'pageClosed',
        url: window.location.href,
        evt: 'routerChange',
        target: 'router',
        data: {
          path:from.fullPath,
          query: from.query
        }
      });
      reportBehavior({
        operation: 'pageOpen',
        url: window.location.href,
        evt: 'routerChange',
        target: 'router',
        data: {
          path:to.fullPath,
          query: to.query
        }
      });
      next();
    }
  }
  // todo 多web框架下, 子项目路由处理受框架管理
  //if (config.isMultiWebFramework && window.self != window.top) {
  //  console.log('===router isMultiWebFramework===', isHasP);
  //}
}

export default {
  requireAuth,
  initRouter
};

