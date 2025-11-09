/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2022-12-05 10:11:34
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-09-21 16:45:13
 * @FilePath: \common-data-configc:\project\middleground\manage\src\common-base\mixins\permissions.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  data () {
    return {
      moduleCode: '',
      activationState: true,
      isEnableFixedCol: true,
      isHasAccessPermision: false,
      permissions: {
        codes: {},
        names: {}
      },
    };
  },
  created () {
    window.vm.currentPage = this;
    let moduleCode = this.utils.getParam('moduleCode');
    // 优先获取参数中模块编码配置
    //this.moduleCode = this.$route.meta && this.$route.meta.moduleCode ? this.$route.meta.moduleCode || moduleCode :
    // moduleCode;
    this.moduleCode = moduleCode;
    // 具有模块编码切无权限时，提示没有权限
    if (this.moduleCode && !this.hasAccessPermision(this.moduleCode)) {
      this.isHasAccessPermision = false;
      let to = this.$route;
      let commonParams = {};
      if (to.query.appName) {
        commonParams.appName = to.query.appName;
      }
      this.$router.push({
        path: '/error/noAccessError',
        query: Object.assign(commonParams, {path: to.path, title: to.meta.name})
      });
    } else {
      this.isHasAccessPermision = true;
    }
    this.isEnableFixedCol = this.CFG.viewportWidth > 768 ? true : false;
    if (this.moduleCode) {
      this.initActions(this.moduleCode);
    }
  },
  methods: {
    // 初始化组件权限
    initActions (moduleCode) {
      let codes = {};
      let names = {};
      let actions = this.getActionsByModuleCode(moduleCode);
      for (let action of actions) {
        let code = action.code;
        if ( !code ) {
          continue
        }
        if (action.permissionType !== 'data' && code.length > 6) {
          code = code.substring(6);
        }
        codes[code] = action.name;
        names[action.actionName] = code;
      }
      this.permissions.codes = codes;
      this.permissions.names = names;
    },
    updateActions () {
      let moduleCode = this.utils.getParam('moduleCode');
      if (this.activationState && moduleCode) {
        this.initActions(moduleCode);
      }
    },
    /**
     * 获取按钮权限列表
     * @param {String} moduleCode 模块编码
     * @returns 
     */
    getActions(moduleCode) {
      let permissions = this.utils.matchedData(this.CFG.permissions, 'code', moduleCode, true);
      let actions = [];
      for (let item of permissions) {
        if (item.actions && item.actions.length > 0) {
          actions = Array.prototype.concat.call(actions, item.actions);
        }
      }
      return actions;
    },
    /**
     * 获取模块权限列表
     * @param {String} moduleCode 
     * @returns 
     */
    getActionsByModuleCode (moduleCode) {
      let actions = this.getActions(moduleCode);
      // 有权限时，直接返回
      // if(actions.length) {
        return actions;
      // }
      /**
       * 无按钮权限时，再次获取按钮权限
       */
      // return new Promise((resolve) => {
      //   LonchJsApi.postMessage('INNER-FRAME-GET-PERMISSION', {moduleCode}, null, (data) => {

      //     this.CFG.permissions = data.permissions;

      //     let actions = this.getActions(moduleCode);
      //     resolve(actions);
      //   });
      // })
    },
    // 判定是否具有某个按钮权限
    hasPermissionCode (actionCode) {
      return this.permissions.codes[actionCode] ? true : false;
    },
    hasPermissionName (name) {
      return this.permissions.names[name] ? true : false;
    },
    hasAccessPermision (moduleCode) {
      if (moduleCode) {
        let actions = this.utils.matchedData(this.CFG.permissions || [], 'code', moduleCode);
        return actions.length > 0 ? true : false;
      } else {
        return true;
      }
    }
  },
  watch: {
    $route: function () {
      this.$nextTick(() => {
        this.updateActions();
      })
    }
  },
  activated() {
    this.activationState = true
  },
  deactivated() {
    this.activationState = false
  },
};
