!function (e, fn) {
  'function' == typeof define && (define.amd || define.cmd) ? define(function () {
    return fn(e);
  }) : fn(e, !0);
}('undefined' != typeof window ? window : this, function (global) {
  //let ws = null;
  function getWebsocket (url) {
    return new WebSocket(url);
  }
  
  /**
   * 判断是否为Json格式字符串
   */
  function isJsonString (str) {
    try {
      JSON.parse(str);
      return typeof str === 'string' && /^{.*}$|^\[.*]$/.test(str);
    } catch (e) {
      return false;
    }
  }
  
  function send (url, args, success, error, context) {
    context = context || this;
    if (/^ws[s]?:\/\//.test(url)) {
      try {
        let ws = getWebsocket(url);
        ws.addEventListener('open', function () {
          ws.send(JSON.stringify(args));
        });
        ws.addEventListener('message', function (event) {
          if (typeof success === 'function') {
            success.call(context, isJsonString(event.data) ? JSON.parse(event.data) : event.data);
          }
        });
        ws.addEventListener('error', function (event) {
          if (typeof error === 'function') {
            error.call(context, event);
          }
          close(ws);
        });
        ws.addEventListener('close', function (event) {
          if (typeof error === 'function') {
            error.call(context, event);
          }
          ws = null;
        });
        return ws;
      } catch (e) {
        console.log('WebSocket 异常：', e);
      }
      return null
    } else {
      error.call(context, {opFlag: false, error: '接口地址不合法'});
    }
  }
  
  function close (ws) {
    if (ws) {
      try {
        ws.close();
      } catch (e) {
        //console.log('关闭WebSocket失败：', e);
      } finally {
        ws = null;
      }
    }
  }
  
  let exports = {
    send,
    close
  };
  Object.assign(global, exports);
  return exports;
});
