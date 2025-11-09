/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-12 16:19:30
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-08-08 11:39:34
 * @FilePath: \common-basec:\project\middleground\lonch-isfe\src\common-base\api\webSocketApi\IframeWebSocket.js
 * @Description: iframe服务，如果需要项部窗口统一管理webSocket时使用，目前不使用。
 */

export const IFRAME_WEB_SOCKET = {
  REQUEST: 'WEB-SOCKET-REQUEST'
};

// 事件处理器
// function IframeWebSocket() {}
const IframeWebSocket = new Function();

// 单例
IframeWebSocket.instance = null;
IframeWebSocket.getInstance = () => {
  if (!IframeWebSocket.instance) {
    IframeWebSocket.instance = new IframeWebSocket();
  }

  return IframeWebSocket.instance;
};

IframeWebSocket.prototype = {
  // 发送
  send(data) {
    return new Promise((resolve, reject) => {
      LonchJsApi.postMessage(
        IFRAME_WEB_SOCKET.REQUEST,
        data,
        null,
        function (res) {
          if (res.type === 'success') {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        }
      );
    });
  }
};

export default IframeWebSocket.getInstance();
