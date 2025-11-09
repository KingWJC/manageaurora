const History = {
  _history: [],
  // 以新开窗口打开某个页面，点击关闭，要直接回到弹出前的页面
  _popup: {
    index: 0,
    path: ''
  },
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$routerHistory', {
      get () {
        return History;
      }
    });
  },
  push (route) {
    this._history.push(route);
  },
  pop (_self) {
    this._history.pop();
    _self.$router.go(-1);
  },
  list () {
    return this._history;
  },
  canBack () {
    return this._history.length > 1;
  },
  // 后退
  goBack (_self) {
    if (this.canBack()) {
      _self.$router.isBack = true;
      this.pop(_self);
    } else {
      if (LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
        try {
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
            // 当前页面在iframe中
            window.parent.history.back();
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        this._history = [];
        _self.$router.go(-1);
      }
    }
  },
  // 打开弹出窗口
  popup (_self, path, query) {
    this._popup.index = this._history.length - 1;
    // this._popup.path = this._history[this._history.length - 1].fullPath;
    // this.pop(_self);
    // _self.$router.push({
    //   path,
    //   query
    // });
    _self.$router.replace({
      path,
      query
    });
  },
  // 关闭弹出窗口
  closePopup (_self) {
    this._history.splice(this._popup.index);
    _self.$router.push({
      path: this._popup.path
    });
  },
  // 关闭所有页面，打开到应用内某个页
  reLaunch (_self, path, query) {
    this._history = [];
    _self.$router.push({
      path,
      query: query || ''
    });
  }
};
export default History;
