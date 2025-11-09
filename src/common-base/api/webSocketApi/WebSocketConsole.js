/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-12 16:19:30
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-07-13 20:52:06
 * @FilePath: \common-basec:\project\middleground\lonch-isfe\src\common-base\api\webSocketApi\customEvent.js
 * @Description: 打印，待扩展（为以后开发chrome浏览器插件时，扩展功能）
 */

import config from '../../../config/index';
import utils from '../../utils/utils.js';

// function WebSocketConsole() {}
const WebSocketConsole = new Function();

// 单例
WebSocketConsole.instance = null;
WebSocketConsole.getInstance = () => {
  if (!WebSocketConsole.instance) {
    WebSocketConsole.instance = new WebSocketConsole();
  }

  return WebSocketConsole.instance;
};


WebSocketConsole.prototype = {
  editorExtensionId: utils.getCookie('lonch-webSocket-editor-extension-id') || '', // 朗致的webSocket连接debugger的插件ID
  logEnvList: ['dev', 'test', 'apptest'], // 显示打印的环境
  XHRListObj: {}, // 待打印的集合，已打印的数据会清除，避免占用空间
  installTipsStatus: false, // 进行安装说明的提示
  init: true, // 初始化
  
  /**
   * 初始化设置
   */
  initConfig() {
    if(!this.init) { 
      return
    }

    this.init = false

    // 进行安装说明的提示
    this.installTipsStatus = this.logEnvList.includes(process.env.VUE_APP_MODE) && !config.client.isMobile
  },

  // 添加接口数据，为以后扩展做准备
  request(sid, data, type = 'webSocket') {
    this.initConfig()

    data = utils.turnJson(data);
    const body = utils.turnJson(data.body);
    const param = utils.turnJson(data.param);

    this.XHRListObj[sid] = {
      ...data,
      body,
      param,
      type,
      status: 'pending',
      origin: location.href,
      startTime: Date.now(),
      endTime: 0,
      secretKey: config.sk,
      response: {}
    };

    this.sendMessage(this.XHRListObj[sid]);
  },

  // 添加响应数据，只响应一次，响应及打印
  response(sid, data) {
    if (!this.XHRListObj[sid]) {
      return;
    }

    this.XHRListObj[sid].status = 'complete';
    this.XHRListObj[sid].endTime = Date.now();
    this.XHRListObj[sid].response = data;

    if (this.logEnvList.includes(process.env.VUE_APP_MODE) && config.client.isMobile) {
      this.log(this.XHRListObj[sid]);
    }

    this.sendMessage(this.XHRListObj[sid]);

    delete this.XHRListObj[sid];
  },

  /**
   * 发送到谷歌的朗致的webSocket debuger插件上，进行调试
   * @param {*} data
   */
  sendMessage(data) {
    // 验证是否符合要求
    if (!window.chrome || !window.chrome.runtime || !window.chrome.runtime.sendMessage || !this.editorExtensionId) {
      return;
    }

    try {
      // 发送数据
      window.chrome.runtime.sendMessage(this.editorExtensionId, data).catch(() => {
        console.warn('发送到lonch-webSocket插件报错: 请检查cookies的lonch-webSocket-editor-extension-id的值')
      })
    } catch(e) {
      // 未安装lonch-webSocket插件时，第一次进行提示
      if ( this.installTipsStatus ) {
        console.log('%c使用webSocket请求，请安装lonch-webSocket，设置cookies的lonch-webSocket-editor-extension-id', 'color: #fff; border-radius: 5px; padding: 10px 10px; background: rgba(131,58,180,1);')
        this.installTipsStatus = false;
      }
    }
  },

  log(data) {
    console.group(
      '_______________________________________________________________'
    );
    console.log('url：', data.url);
    console.log('request：', data.body);
    console.log('response：', data.response);
    console.groupEnd(
      '_______________________________________________________________'
    );
  }
};

export default WebSocketConsole.getInstance;
