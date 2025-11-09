/*
 * @Date: 2024-04-05 00:06:00
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-04-08 23:45:44
 * @FilePath: \lonch-rxv-fe\src\customerUtils\index.js
 * @Description: 
 */
// 根据传入的项目名称，返回完整域名
const toProduct = (_doman) => {
  const origins = window.vm.CFG.origins || [];
  if(origins) {
    const origin = origins.find(v => v.name === _doman);
    if(origin && origin.domain) {
      return origin.domain
    } else {
      return ''
    }
  } else {
    return ''
  }
};

// this 上下文
// 哪个项目
// 页面路程由（带GET参数）
// 查询参数（android还未实现，不用这个）
// 页面标题
// 打开当前项目页面是否是新开窗口
// 手机端是否显示标题
const openPage = (_self, _domain, _path, _query = {}, _title = '', _type = false, _isBackTitleBar = false) => {
  // _domain：跳转的项目
  // _path：路由
  // _query：参数
  // _title：新开窗口的标题
  // _type：是否在app新开窗口
  
  // 处理没有moduleCode的链接
  if(!new RegExp(/(.*?)moduleCode=(.*?)/).test(_path)) {
    // 没有moduleCode
    if(new RegExp(/\?/).test(_path)) {
      // 路径里有?号
      _path = `${_path}&moduleCode=${'365600'}`
    } else {
      // 路径里没有?号
      _path = `${_path}?moduleCode=${'365600'}`
    }
  }

  let url = _domain === 'commonLibrary' ? `${toProduct(_domain)}${_path}` :`${toProduct(_domain)}/index.html#${_path}`;
  if(_self.CFG.versionConfig && _self.CFG.versionConfig.length > 0){
    url = _self.utils.transformationMachedVersion(url, _self.CFG.versionConfig)
  }


  const _args = {
    url,
    title: _title,
    query: _query,
    addChat: _domain === 'chat',
    animated: false,
    isBackTitleBar: _isBackTitleBar,
    config: {
      addChat: _domain === 'chat',
      animated: false,
      isBackTitleBar: _isBackTitleBar
    }
  };
  if(!_domain) {
    if((LonchJsApi.isInIosApp() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInMacApp()) && _type) {
      _args.url = _path;
      // if (LonchJsApi.isInApp()) {
      //   _self.webLog.log('===跳转非朗致项目===', url);
      // }
      _self.API.send(_self.CFG.services.im.cmdAppOpenUrl, { ..._args }, function () { }, function () { }, _self, true);
    } else {
      location.href = decodeURI(_path);
    }
  } else if(_domain !== 'yfc') {
    // if (LonchJsApi.isInApp()) {
    //   _self.webLog.log('===跳转到非药发采项目===', url);
    // }
    if(LonchJsApi.isInIosApp() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInMacApp()) {
      _self.API.send(_self.CFG.services.im.cmdAppOpenUrl, { ..._args }, function () { }, function () { }, _self, true);
    } else {
      location.href = decodeURI(url);
    }
  } else {
    if((LonchJsApi.isInIosApp() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInMacApp()) && _type) {
      // console.log('在药发采内新开webview查看页面', _type)
      _self.API.send(_self.CFG.services.im.cmdAppOpenUrl, { ..._args }, function () { }, function () { }, _self, true);
    } else {
      // console.log('只是路由跳转页面', _type)
      _self.$router.push({
        path: _path,
        query: _query
      })
    }
  }
}

export {
  openPage,
  toProduct,
}