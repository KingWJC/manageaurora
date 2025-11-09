/*
 * @Date: 2024-04-05 00:06:57
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-06-14 04:36:56
 * @FilePath: \lonch-chat\src\common-base\components\chat\index.js
 * @Description:
 */
import TIM from 'tim-js-sdk';
// import TRTC from 'trtc-js-sdk';
import TUICALLENGINE from 'tuicall-engine-webrtc';

// 聊天数据
window.chatExample = {
  // 我方信息
  meInfo: {
    userId: ''
  },
  // TIM是否reader
  isReady: false,
  // 聊天对象ID
  chatPartnerUserId: '',
  // 聊天对象姓名
  chatPartnerUserName: '',
  // 会话ID
  conversationId: '',
  // TIM实例化并登录后的回调
  READY_CALLBACKS: {},
  // 新消息回调
  MESSAGE_RECEIVED_CALLBACKS: {},
  // 未读消息数变化回调
  UNREADMESSAGECOUNT_CALLBACKS: {},
  // 发起聊天的回调方法
  INITIATE_CHAT_CALLBACKS: {},
  // 当前环境可以拨打视频通话
  isVideCall: true
};

// 聊天APPID配置
const appId = {
  production: 1400462901,
  app: 1400462901,
  dev: 1600046928,
  development: 1600046928,
  test: 1600046928,
  apptest: 1600046928
}

const btnStatus = {
  cancelBtn: true,
  rejectBtn: true,
  hangupBtn: true,
  acceptBtn: true
}

const TimExample = (function () {

  require('./style/chat.scss');

  let instance;
  let liveInstance;
  let TRTCCALLINGInstance;

  function init() {
    /*
    创建TIM实例
    */
    const tim = TIM.create({ SDKAppID: appId[process.env.VUE_APP_MODE] });

    tim.setLogLevel(4);

    /*
    页面发起聊天请求
    */
    tim.setChatPartnerId = function (data) {
      window.chatExample.chatPartnerUserId = data.userId;
      window.chatExample.chatPartnerUserName = data.userName;
      window.chatExample.conversationId = `C2C${data.userId}`;
      /*
      执行所有回调
      */
      for (let key in window.chatExample.INITIATE_CHAT_CALLBACKS) {
        const callback = window.chatExample.INITIATE_CHAT_CALLBACKS[key];
        callback.fn();
      }
    };

    // 登录成功后回调
    tim.callBacks = [];
    // 结束通话的回调
    tim.cancelCallbacks = [];

    // 创建音视频承载容器
    tim.createCallContainer = function(type) {
      if(!document.getElementById('callAudioVideoContainer')) {
        //  创建音视频容器
        const callAudioVideoContainer = document.createElement('div');
        callAudioVideoContainer.id = 'callAudioVideoContainer';
        callAudioVideoContainer.className = 'lonch-chat-call-video-mask';
        
        if(type === 2 || type === '2') {
          const lonchCallLocalView = document.createElement('div');
          lonchCallLocalView.id = 'lonchCallLocalView';
          lonchCallLocalView.className = 'lonch-chat-call-video-local';
          callAudioVideoContainer.appendChild(lonchCallLocalView);
        }
  
        const lonchCallRemoteView = document.createElement('div');
        lonchCallRemoteView.id = 'lonchCallRemoteView';
        lonchCallRemoteView.className = 'lonch-chat-call-video-remote';
        callAudioVideoContainer.appendChild(lonchCallRemoteView);
  
        document.body.appendChild(callAudioVideoContainer);
      }
    }
    // 清除音视频承载容器
    tim.clearCallContainer = function() {
      if(document.getElementById('callAudioVideoContainer')) {
        document.getElementById('callAudioVideoContainer').remove();
      }
    }

    // 响铃
    tim.callWait = function() {
      let audio = document.getElementById('audio_div');
      if(audio) {
        // audio.currentTime = 0;
        audio.play();
      } else {
        audio = document.createElement('audio');
        audio.src = require('../../accsets/audio/wait.mp3');
        audio.id = 'audio_div';
        audio.loop = true;
        audio.style.display = 'none';
        document.body.appendChild(audio);
        audio.play();
      }
    }
    // 停止响铃
    tim.cancelCallWait = function() {
      let audio = document.getElementById('audio_div');
      if(audio) {
        audio.pause();
        audio.remove();
      }
    }
    // 按钮
    tim.createButton = function(userType) {
      // 先判断视频DOM存不存在
      if(document.getElementById('callAudioVideoContainer')) {
        // 按钮容器
        const callAudioVideoButton = document.getElementById('callAudioVideoButton');
        if(!callAudioVideoButton) {
          // 没有按钮容器才需要创建按钮
          const btns = document.createElement('div');
          btns.id = 'callAudioVideoButton';
          btns.className = 'lonch-chat-call-opbtn';
          
          if(userType === 'call') {
            // 拨号方
            const hangupBtn = document.createElement('div');
            hangupBtn.id = 'cancelBtn';
            hangupBtn.className = 'lonch-chat-call-opbtn-cancel';
            hangupBtn.textContent = '取消';
            btns.appendChild(hangupBtn);
          } else if(userType === 'callee') {
            // 被呼叫者
            // 拒绝按钮
            const rejectBtn = document.createElement('div');
            rejectBtn.id = 'rejectBtn';
            rejectBtn.className = 'lonch-chat-call-opbtn-cancel';
            rejectBtn.textContent = '拒绝';
            btns.appendChild(rejectBtn);
            //接听按钮
            const acceptBtn = document.createElement('div');
            acceptBtn.id = 'acceptBtn';
            acceptBtn.className = 'lonch-chat-call-opbtn-accept';
            acceptBtn.textContent = '接听';
            btns.appendChild(acceptBtn);
          }
  
          // 按钮事件
          btns.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'cancelBtn') {
              if(btnStatus.cancelBtn) {
                btnStatus.cancelBtn = false;
                // 取消通话
                TRTCCALLINGInstance.hangup().then(() => {
                  tim.clearCallContainer();
                  tim.cancelCallWait();
                  tim.runCallBacksClear(true);
                });
              }
            }
            if (event.target && event.target.id === 'rejectBtn') {
              if(btnStatus.rejectBtn) {
                btnStatus.rejectBtn = false;
                // 拒绝
                TRTCCALLINGInstance.reject().then(() => {
                  tim.clearCallContainer();
                  tim.cancelCallWait();
                  // tim.runCallBacksClear(true);
                }).catch(() => {
                  tim.clearCallContainer();
                  tim.cancelCallWait();
                  // tim.runCallBacksClear(true);
                });
              }
            }
            if (event.target && event.target.id === 'hangupBtn') {
              if(btnStatus.hangupBtn) {
                btnStatus.hangupBtn = false;
                // 挂断
                TRTCCALLINGInstance.hangup().then(() => {
                  tim.clearCallContainer();
                  tim.cancelCallWait();
                  tim.runCallBacksClear();
                });
              }
            }
            if (event.target && event.target.id === 'acceptBtn') {
              if(btnStatus.acceptBtn) {
                btnStatus.acceptBtn = false;
                console.clear();
                console.log('TRTCCALLINGInstance:', TRTCCALLINGInstance)
                // 接听通话
                TRTCCALLINGInstance.accept().then((res) => {
                  console.log(res)
                  console.log('%c接听电话', 'padding:20px; font-size: 100px;')
                  // 关闭铃声
                  tim.cancelCallWait();
                  // 切换按钮状态
                  tim.changeCallStatus();
                }).catch(() => {
                  console.log('接听失败');
                  this.$toast('无法建立连接，请稍后再试');
                  setTimeout(() => {
                    tim.runCallBacksClear();
                  }, 1000)
                });
              }
            }
          });
          const callAudioVideoContainer = document.getElementById('callAudioVideoContainer');
          callAudioVideoContainer.appendChild(btns);
        }
      }
    }

    // 执行通话失败的回调
    tim.runCallBacksClear = function(force) {
      tim.cancelCallbacks.forEach(item => {
        if(item && typeof item === 'function') {
          item(force);
        }
      })
      tim.cancelCallbacks = [];
    }

    // 切换通话成状态
    tim.changeCallStatus = function() {     
      // 清除掉需要清除的按钮
      const needClearBtns = ['rejectBtn', 'acceptBtn', 'cancelBtn'];
      needClearBtns.forEach(btn => {
        const btnDom = document.getElementById(btn);
        if (btnDom && btnDom.parentNode) {
          btnDom.parentNode.removeChild(btnDom);
        }
      });

      // 创建挂断按钮
      if(!document.getElementById('hangupBtn')) {
        const hangupBtn = document.createElement('div');
        hangupBtn.id = 'hangupBtn';
        hangupBtn.className = 'lonch-chat-call-opbtn-cancel';
        hangupBtn.textContent = '挂断';
        const callAudioVideoButton = document.getElementById('callAudioVideoButton');
        callAudioVideoButton.appendChild(hangupBtn);
      }
    }

    // 设置为语音call
    tim.setVoiceCall = function() {
      const lonchCallRemoteView = document.getElementById('lonchCallRemoteView');
      console.log('设置样式')
      if(lonchCallRemoteView) {
        lonchCallRemoteView.classList.add('lonch-chat-call-video-remote2voice');
      }
    }

    // 重置按钮为可点
    tim.resetBtnClick = function() {
      btnStatus.cancelBtn = true;
      btnStatus.rejectBtn = true;
      btnStatus.hangupBtn = true;
      btnStatus.acceptBtn = true;
    }

    return tim;
  }
  /**
   * 初始化音视频通话
   * @param userId
   * @param userSig
   * @returns {Promise<void>}
   */
  function initTRTCCalling() {
    /* eslint-disable */
    const client = TUICALLENGINE.TUICallEngine.createInstance({
      SDKAppID: appId[process.env.VUE_APP_MODE],
      // tim: TIM
    });
    console.log('%cTUICALL', 'font-size: 100px;padding: 10px;background:#ff0000;')
    console.log('option:', {SDKAppID: appId[process.env.VUE_APP_MODE],
      tim: TIM})
    console.log(client);
    client.setLogLevel(4);
    return client;
  }

  return {
    // 获取当前运行环境的APPID
    getAppId: function() {
      return appId[process.env.VUE_APP_MODE];
    },
    // 获取TIM实例
    getInstance: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
    getTuiCallInstance: function (chat) {
      console.log('chat:', chat)
      if (!TRTCCALLINGInstance) {
        TRTCCALLINGInstance = initTRTCCalling();
      }
      return TRTCCALLINGInstance;
    }
  };
})();

export default TimExample;
//外部需要使用appId，均从此文件获取
export {
  appId
}