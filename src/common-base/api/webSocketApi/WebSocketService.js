/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-11 23:17:43
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-03-18 09:50:30
 * @FilePath: \common-basec:\project\middleground\lonch-isfe\src\common-base\api\webSocketService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Message } from 'element-ui';
import utils from '../../utils/utils.js';
import CustomEvent from './CustomEvent.js';
import InterfaceModules from './InterfaceModules.js';
import Login from '../../login/login';
import {
  RESULT_TYPE_ENUM,
  tokenInvalidList, // token异常的数据错误码
  webSocketConnectErrorList,
  default as getApiCustomResult
} from './apiCustomResult.js';
import WebSocketConsole from './WebSocketConsole.js';
import webLog from '../web-log';

export const CONNECT_STATE = {
  NO_INIT: 'no-init', // 未初始化
  CONNECTING: 'connecting', // 连接中
  SUCCESS: 'success',
  ERROR: 'error',
  CLOSE: 'close'
};

// 等待检查连接类型
const WAIT_CONNECT_TYPE = {
  SEND: 'send',
  INIT: 'init'
};

// 自定义事件类型
const CUSTOM_EVENT_TYPE = {
  INIT: 'init'
};

const customEvent = new CustomEvent();
const webSocketConsole = WebSocketConsole();

// webSocket接口请求
function WebSocketService(config) {
  this.config = config;
  /**
   * 验证token是否通过
   */
  const { state } = this.verifyConfig(config);
  if (!state) {
    return;
  }

  // this.config.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhT3duZXJPcmdJZCI6IjEyOTE3OTE0NTY5MDI4ODEyOCIsImFjY291bnRJZCI6ImQ2YTZkMzQyNTNhYzQyOWE4Y2Y3OTkwM2ZiZDRmNDI0IiwicHJvZHVjdElkIjoiMTZmOWUxZmYxYTA5MTFlZDk0MGRiODU5OWZlNTNmN2EiLCJleHAiOjEyNTE1ODQ1Mjk5LCJ1c2VySWQiOiI2N2UyZWJmMzg0NTk0YWU0ODQ1YjllM2IzODVhZDdiYiIsInV1aWQiOiI3MDQ3OTQ2MTg4MGQ0MTNmOTUyMTg4YjlkYjVjYzdkZCIsImlhdCI6MTcxNTg0NTI5OSwidXNlcm5hbWUiOiIxODIwNDM0OTkyMyJ9.5j85LX2daJHL3B5ibgL1F2_g7tM-yrDUjZa6-j9bMjw'

  this.interfaceModules = InterfaceModules(
    this.config && this.config.modulesVersions
  );

  this.closeWebSocketThrottle = utils.throttle2(
    this.closeWebSocket,
    1000,
    true
  );
  this.initConnectCompleteDebounce = utils.debounce2(
    this.initConnectComplete,
    500,
    true
  );
}

// 单例
WebSocketService.instance = null;
WebSocketService.getInstance = (config) => {
  if (!WebSocketService.instance) {
    WebSocketService.instance = new WebSocketService(config);
  }

  return WebSocketService.instance;
};

WebSocketService.prototype = {
  url: '', // webSocket连接的url
  // 当前webSocket的链接
  webSocketLink: null,
  // 配置
  config: null,

  // 接口过期时间（可配置）
  maxExpireTime: 1 * 60 * 1000,
  // maxExpireTime: 5 * 1000,

  // 检查连接状态
  inspectConnectIntervalTime: 100, // 检查连接状态间隔
  inspectConnectSustainTime: 10 * 1000, // 检查连接状态维持时间（可配置）

  // 最大重试连接次数（可配置）
  maxRetryConnectCount: 1,

  // 初始化
  initCount: 0, // 初始化已连接次数
  initMaxRetryConnectCount: 3, // 初始化最大连接次数（可配置）
  initConnectState: CONNECT_STATE.NO_INIT, // 当前状态，[CONNECT_STATE]类型

  // 断开时间，暂不使用
  // closeWebSocketTime: 0, // 断开连接时间
  // closeWebSocketRetryIntervalTime: 30 * 60 * 1000, // 断开连接后重新连接间隔时间（可配置）
  // closeWebSocketRetryIntervalTime: 60 * 1000, // 断开连接后重新连接间隔时间

  // 无数据，自动断开
  noResponseAutoCloseTime: 1 * 60 * 60 * 1000, // 无数据传递时，自动断开时间，为0时，不断开（可配置）
  // noResponseAutoCloseTime: 1 * 1000, // 无数据传递时，自动断开时间，为0时，不断开（可配置）
  noResponseAutoCloseTimer: null, // 自动断开连接定时器

  // 心跳检测
  heartbeatInterval: 10 * 1000, // 心跳检测时间
  heartbeatTimer: null, // 心跳检测定时器

  connectError: false, // 连接是否失败
  closeMsg: '', // 关闭原因

  sid: '', // websocket连接上报日志使用的sid
  startTime: 0, // 连接开始的时间

  tryReconnectState : false, // 尝试重新连接状态

  // 验证config
  verifyConfig(config) {
    if (!config) {
      /**
       * 验证config失败，返回失败原因
       */
      return {
        state: false,
        message: 'WebSocketService类config为空'
      };
    }

    // 判断当前webSocket链接是否配置
    if (!config.project || !config.project.webSocketGateway) {
      this.initConnectState = CONNECT_STATE.ERROR;
      /**
       * 验证config失败，返回失败原因
       */
      return {
        state: false,
        message: '无法连接webSocket, 公共配置project无此网关的webSocketGateway'
      };
    }

    // 无token
    if (!config.token) {
      /**
       * 验证config失败，返回失败原因
       */
      return {
        state: false,
        message: '无法连接webSocket, WebSocketService类无参数token'
      };
    }

    return {
      state: true
    };
  },

  init() {
    /**
     * 验证token是否通过
     */
    const { state } = this.verifyConfig(this.config);
    if (this.initConnectState !== CONNECT_STATE.NO_INIT || !state) {
      return;
    }

    // 连接中
    this.initConnectState = CONNECT_STATE.CONNECTING;

    this.initCount = 1;
    this.createWebSocket();
    this.waitConnectWebSocket({
      type: WAIT_CONNECT_TYPE.INIT
    });

    // 返回连接Promise,成功或失败
    return new Promise((resolve) => {
      customEvent.on(CUSTOM_EVENT_TYPE.INIT, {}, (res) => {
        resolve(res);
      });
    });
  },
  // 初始化链接完成
  initConnectComplete(type) {
    // 初始化结束
    if (
      [
        CONNECT_STATE.SUCCESS,
        CONNECT_STATE.ERROR,
        CONNECT_STATE.CLOSE
      ].includes(this.initConnectState)
    ) {
      return;
    }

    // 连接成功
    if (type === CONNECT_STATE.SUCCESS) {
      this.initConnectState = type;
      customEvent.emit(CUSTOM_EVENT_TYPE.INIT, { type: this.initConnectState });
      return;
    }

    // 连接失败最多重试n次，或者token过期
    this.initCount++;
    if (this.initCount > this.initMaxRetryConnectCount || this.connectError) {
      this.initConnectState = type;
      customEvent.emit(CUSTOM_EVENT_TYPE.INIT, { type: this.initConnectState });
      return;
    }

    // 连接失败，重新连接
    this.createWebSocket();
    this.waitConnectWebSocket({
      type: WAIT_CONNECT_TYPE.INIT
    });
  },

  /**
   * 获取当前webSocket的参数
   * @returns 返回以&号进行分隔的参数
   */
  getWebSocketQuery() {
    // webSocket连接的参数
    // this.sid = this.config.terminalId + utils.UUID(10);
    this.sid = this.config.terminalId;
    const params = {
      accessToken: this.config.token,
      terminalId: this.sid
    };

    if (this.config.projectName === 'telescreen') {
      params.clientId = params.terminalId;
    }

    // 当前项目的webSocket连接参数
    // if (this.config.webSocketParam) {
    //   Object.entries(this.config.webSocketParam).forEach((el) => {
    //     const key = el[0];
    //     const value = el[1];
    //     // 参数为函数时，运行得到结果
    //     if (typeof value === 'function') {
    //       params[key] = value();
    //     } else {
    //       params[key] = value;
    //     }
    //   });
    // }

    return utils.object2search(params);
  },

  // 创建webSocket
  createWebSocket() {
    // webSocket链接的参数
    this.closeMsg = ''; // 重置关闭状态
    const query = this.getWebSocketQuery();
    this.url = `${this.config.project.webSocketGateway}?${query}`;
    // this.url = `wss://test-idcs-gateway.lonchgroup.com/websocket?${query}`;
    // this.url = `ws://2.0.1.2:18010/websocket?${query}`;
    // this.url = `wss://test-edc-gateway.zhiyimall.com/websocket?${query}`;
    try {
      this.webSocketLink = new WebSocket(this.url);
    } catch (e) {
      console.warn('连接失败:', e);
    }

    window.webSocketLink = this.webSocketLink;

    this.webSocketLink.addEventListener(
      'open',
      this.openWebSocketEvent.bind(this)
    );
    this.webSocketLink.addEventListener(
      'message',
      this.messageWebSocketEvent.bind(this)
    );
    this.webSocketLink.addEventListener(
      'close',
      this.closeWebSocketEvent.bind(this)
    );
    this.webSocketLink.addEventListener(
      'error',
      this.errorWebSocketEvent.bind(this)
    );
  },

  // webSocket 连接成功事件
  openWebSocketEvent() {
    this.initConnectCompleteDebounce(CONNECT_STATE.SUCCESS);

    this.startTime = Date.now();

  },

  // 接收消息事件
  messageWebSocketEvent(event) {
    this.tryReconnectState = false;
    
    let data = utils.turnJson(event.data);
    const sid = data.sid || '';
    const errorCode =
      typeof data === 'object'
        ? (data.errorCode || data.code || '').toUpperCase()
        : 'WEBAPP020000';

    // 服务器主动发送的数据
    if (data.forward === 'down') {
      LonchJsApi.triggerServerSendMsgHandlers(data || {});
      return;
    }

    /**
     * 无sid
     */
    if (!sid) {
      // 等待响应接口的url列表
      const urlList = customEvent
        .getList()
        .map((el) => (el.request ? el.request.url : ''));

      /**
       * 未返回sid
       * 上报异常日志
       */
      webLog.log(
        {
          code: errorCode,
          level: 'error',
          sid: sid,
          msg: `数据返回异常，无sid；请求方式websocket; 返回信息：${data.errorMsg}`
        },
        {
          url: urlList.join(',')
        },
        {},
        data // 返回的数据
      );

      return;
    } else if (
      /**
       * 返回异常数据
       */
      !customEvent.hasId(data.sid) &&
      (!data.opFlag ||
        tokenInvalidList.includes(errorCode) ||
        webSocketConnectErrorList.includes(errorCode))
    ) {
      // 设置连接错误
      this.connectError = true;

      let level = 'warn';
      let msg = '';
      /**
       * token错误,重新登录
       */
      if (tokenInvalidList.includes(errorCode)) {
        // 关闭连接
        this.closeMsg = data.errorMsg || '连接返回错误';
        this.closeWebSocketThrottle();

        // 登录退出
        Login.toLogOutConfirmCommon({ data });
      } else if (webSocketConnectErrorList.includes(errorCode)) {
        /**
         * webSocket连接报错
         */
        msg = data.errorMsg || '连接webSocket错误';
      } else {
        // 打印错误信息
        Message({
          message: data.errorMsg,
          type: 'warning'
        });
        // level = 'error';
        msg = `数据返回异常，无匹配的sid，请求方式websocket; 返回信息：${data.errorMsg}`;
      }

      /**
       * 上报异常日志
       */
      webLog.log(
        {
          code: errorCode,
          level,
          sid: data.sid,
          msg
        },
        {
          url: ''
        },
        {},
        data
      );
      return;
    }

    // 通知消息接收
    const state = customEvent.emit(sid, data);

    // 重置---无数据，自动断开
    this.autoCloseWebSocket();

    /**
     * 未找到对应的sid事件
     * 上报异常日志
     *
     */
    if (!state) {
      webLog.log(
        {
          code: errorCode,
          level: 'warn',
          sid: sid,
          msg: `数据返回异常，此sid未找到对应的请求；请求方式websocket，返回信息：${data.errorMsg}`
        },
        {
          url: ''
        },
        {},
        data // 返回的数据
      );
    }

  },

  // 关闭链接事件
  closeWebSocketEvent(res) {
    if (!this.closeMsg) {
      this.closeMsg = '关闭';
    }
    this.reportCloseLog(`监听到websocket关闭事件, 关闭原因：${this.closeMsg}，关闭码：${res.code}`, {
      code: res.code,
      reason: res.reason,
      wasClean: res.wasClean,
      bufferedAmount: this.webSocketLink.bufferedAmount,
    })

    // 连接断开，重新连接
    this.closeNoResponseTryReconnect();

    // 重新初始化，节流，避免错误事件导致触发两次
    this.initConnectCompleteDebounce(CONNECT_STATE.CLOSE);

  },

  // 链接错误事件
  errorWebSocketEvent() {
    if (!this.closeMsg) {
      this.closeMsg = '错误';
    }
    this.reportCloseLog(`监听到websocket错误事件`)

    // 重新初始化，节流，避免关闭事件导致触发两次
    this.initConnectCompleteDebounce(CONNECT_STATE.ERROR);
  },

  // 自动关闭链接(长时间无数据响应)
  autoCloseWebSocket() {
    if (!this.noResponseAutoCloseTime) {
      return;
    }

    clearTimeout(this.noResponseAutoCloseTimer);
    this.noResponseAutoCloseTimer = setTimeout(() => {
      this.closeMsg = '超时关闭';
      this.closeWebSocketThrottle();
    }, this.noResponseAutoCloseTime);
  },

  // 关闭链接
  closeWebSocket() {
    this.reportCloseLog(`前端主动关闭websocket连接, 关闭原因：${this.closeMsg}`)
    
    this.webSocketLink.close();
  },

  // 接口发送入口
  async send({ url, method, params, service }) {
    /**
     * 验证token是否通过
     */
    const { state, message } = this.verifyConfig(this.config);
    if (!state) {
      return Promise.reject(`验证config错误，${message}`);
    }

    // get请求不走webSocket
    if (method && method.toLowerCase() === 'get') {
      return Promise.reject('get请求');
    }

    /** 初始化时，未连接，进行连接 */
    if (this.initConnectState === CONNECT_STATE.NO_INIT) {
      this.init();
    }

    // 检查连接状态并等待
    if (!(await this.waitConnectWebSocket())) {
      return Promise.reject(`连接失败：${this.closeMsg}`);
    }

    // 发送数据
    return this.webSocketSend({ url, method, params, service });
  },

  // webSocket发送
  webSocketSend({ url, method, params, service }) {
    method = method.toUpperCase();

    const sid = params.sid;
    params = JSON.stringify(params);

    const sendData = JSON.stringify({
      forward: 'up',
      url: utils.trim(url),
      method,
      sid,
      scheme: this.interfaceModules.getScheme(service),
      token: this.config.token,
      userAgent: window.navigator.userAgent,
      contentType: 'application/json; charset=utf-8',
      protocolVersion: this.interfaceModules.getVersion(service),
      moduleCode: utils.getModuleCode(),
      body: method === 'POST' ? params : {}
      // param: method === 'GET' ? params : {}
    });

    // 打印接口请求
    webSocketConsole.request(sid, sendData);

    // 发送接口请求
    this.webSocketLink.send(sendData);

    // 重置---无数据，自动断开
    this.autoCloseWebSocket();

    // 添加回调
    return new Promise((resolve, reject) => {
      customEvent.on(
        sid,
        sendData,
        (res) => {
          // 打印数据
          webSocketConsole.response(sid, JSON.parse(JSON.stringify(res)));

          /**
           * webscoket关闭，使用http请求
           */
          // if(res.errorCode ===  ERROR_CODE_ENUM[RESULT_TYPE_ENUM.CLOSE] ) {
          //   reject(res);
          // } else {
          resolve(res);
          // }
        },
        {
          maxExpireTime: this.maxExpireTime
        }
      );
    });
  },

  /**
   * 检查连接socket状态及返回，无连接等待或重连
   * @param {Number} count 重试次数
   * @param {Number} currentConnectTime 当前连接进行时间
   * @param {String} type 检查连接的类型，send-发送， init-初始化
   * @returns
   */
  async waitConnectWebSocket({
    count = 0,
    currentConnectTime = 0,
    type = WAIT_CONNECT_TYPE.SEND
  } = {}) {
    // 初始化连接失败，直接返回未链接
    if (
      [CONNECT_STATE.ERROR, CONNECT_STATE.CLOSE].includes(
        this.initConnectState
      ) ||
      !this.webSocketLink
    ) {
      return Promise.resolve(false);
    }

    // 链接成功
    if (this.webSocketLink.readyState === 1) {
      return Promise.resolve(true);
    }

    // 正在链接中，等待；初始化时发送数据一直等待返回连接状态
    else if (
      (this.webSocketLink.readyState === 0 &&
        currentConnectTime < this.inspectConnectSustainTime) ||
      (this.initConnectState === CONNECT_STATE.CONNECTING &&
        type === WAIT_CONNECT_TYPE.SEND)
    ) {
      return await new Promise((resolve) => {
        setTimeout(async () => {
          currentConnectTime += this.inspectConnectIntervalTime
          const result = await this.waitConnectWebSocket({
            count,
            currentConnectTime,
            type
          });

          resolve(result);
        }, this.inspectConnectIntervalTime);
      });
    }

    this.closeMsg = '未连接或连接失败';
    // 正在连接中的，关闭连接
    if (this.webSocketLink.readyState === 0) {
      this.closeWebSocketThrottle();
    }

    // 初始化中，且是初始化检查连接状态，直接返回，
    if (
      this.initConnectState === CONNECT_STATE.CONNECTING &&
      type === WAIT_CONNECT_TYPE.INIT
    ) {
      return;
    }

    // 发送时，连接关闭或没有连接成功，重新链接
    if (count < this.maxRetryConnectCount) {
      this.createWebSocket();

      return await this.waitConnectWebSocket({ count: ++count, type });
    }

    return Promise.resolve(false);
  },

  // 连接关闭，有未响应数据时，尝试重新连接
  closeNoResponseTryReconnect() {
    const idList = customEvent
      .getIdList()
      .filter((el) => !el.includes(CUSTOM_EVENT_TYPE.INIT));

    // console.log('idList', idList);

    if (!idList.length && !this.tryReconnectState) {
      return;
    }

    // this.tryReconnectState = true;
    // this.waitConnectWebSocket()
  },


  /**
   * 上报关闭日志
   */
  reportCloseLog(msg, data = {}) {

    /**
     * 获取未响应的接口列表数据
     */
    const notResponseUrlList = customEvent
      .getList()
      // 过滤过url的
      .filter((el) => el.request && el.request.url)
      .map(el => {
        const request = el.request || {};
        return {
          url: request.url, // 接口地址
          method: request.method, // 请求方式
          sid: request.sid, // 请求的sid
          scheme: request.scheme, // wth或wtw方式
          body: request.body, // 请求的参数
          moduleCode: request.moduleCode // 请求的资源码
        }
      })


    /**
     * 添加日志：前端主动关闭
     */
    webLog.log(
      {
        code: 'WEBAPP000000', // 自定义消息
        level: 'info',
        sid: this.sid,
        msg
      },
      {
        url: this.url
      },
      {},// 请求的数据
      {
        startTime: this.startTime, // 连接开始的时间
        endTime: Date.now(), // 连接关闭的时间
        notResponseUrlList,  // 未响应接口列表
        ...data,
      }, // 响应的数据
      this.startTime ? Date.now() - this.startTime : 0,
    );
  }
};

export default WebSocketService.getInstance;
