<!--
 * @Date: 2024-04-05 23:54:43
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-06-14 14:18:02
 * @FilePath: \lonch-chat\src\common-base\components\chat\init.vue
 * @Description: 
-->
<script>
import TIM from 'tim-js-sdk';
import TUICALLENGINE from 'tuicall-engine-webrtc';

import WebChatUtils from './webChat';
export default {
  data() {
    return {
      // 当前用户userId
      userId: '',
      // 当前用户登录IM的sign
      userSig: ''
    };
  },
  methods: {
    /**
     * @description: 开始初始化TIM
     * @return {*}
     */
    initTim() {
      if(this.CFG.token) {
        this.getImUserId(this.CFG.userInfo.id, true);
      }
    },
    /**
     * 获取登录用户资料
     * @param args
     * @param callback
     */
    getUserByTokenMixin2(args, callback) {
      this.API.send(
        {
          module: 'mserver',
          url: '/human/selectHumanByToken',
          method: 'POST',
          cache: true,
          networkFirst: true,
          expire: 0
        },
        args,
        function (res) {
          if (res.opFlag) {
            let serviceResult = res.serviceResult;
            if (typeof callback === 'function') {
              callback.call(this, serviceResult);
            } else {
              // this.CFG.userInfo = serviceResult;
              // this.isUserInfoInitialized = true;
              // this.updateInitStatus();
            }
          }
        },
        function () { },
        this
      );
    },
    /**
     * @description: 获取当前用户的TIM userId和sig
     * @param {*} humanId
     * @param {*} self
     * @return {*}
     */
    getImUserId(humanId, self) {
      const _self = this;
      this.getUserByTokenMixin2({}, function (res) {
        console.log('res:', res.id);
        const arg = {
          appId: _self.$TIM.appId,
          humanId: res.id
        };
        _self.API.send(
          {
            module: 'im',
            url: '/userSig/v2/getUserSig',
            method: 'POST',
            comment: '根据humanId获取accountId'
          },
          arg,
          function (res) {
            const result = (res && res.data) || {};
            if (self && result.userId) {
              // 记录我方id
              window.chatExample.meInfo.userId = result.userId;
              _self.userId = result.userId;
              _self.userSig = result.userSig;
              _self.timLogin();
              // 是否不开启tuicall
              if(!_self.disabledTuicall) {
                _self.tuicallLogin(result);
              }
            }
          },
          function () { },
          _self
        );
      });
    },
    /**
     * @description: 登录TIM
     * @return {*}
     */
    timLogin() {
      const _self = this;
      /*
      TIM准备好了
      */
      this.$TIM.on(TIM.EVENT.SDK_READY, function () {
        window.chatExample.isReady = true;
        /*
        执行所有回调
        */
        for (let key in window.chatExample.READY_CALLBACKS) {
          const callback = window.chatExample.READY_CALLBACKS[key];
          callback.fn();
        }
      });
      /*
      TIM收到新消息
      */
      this.$TIM.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
        if (event.name === 'onMessageReceived') {
          // 过滤属于当前用户的消息
          const data = WebChatUtils.filterMessage(event, '');
          // 格式化消息
          const messageData = WebChatUtils.formatMessage(data, '');
          // 提取用户姓名
          const user =
            (messageData.serviceResult &&
              messageData.serviceResult[0] &&
              messageData.serviceResult[0].nickName) ||
            '';
          // 提取用户发送的消息
          let text =
            (messageData.serviceResult &&
              messageData.serviceResult[0] &&
              messageData.serviceResult[0].lastMessage) ||
            '';
          text = text.replace(
            new RegExp(/\[img_lz_s](.*?)\[img_lz_e]/, 'g'),
            '[图片]'
          );
          text = text.replace(
            new RegExp(/\<img(.*?)\>/, 'g'),
            '[图片]'
          );
          text = text.replace(
            new RegExp(/\[video_lz_s](.*?)\[video_lz_e]/, 'g'),
            `[视频]`
          );
          text = text.replace(
            new RegExp(/\[audio_lz_s](.*?)\[audio_lz_e]/, 'g'),
            '[声音]'
          );
          text = text.replace(
            new RegExp(/\[file_lz_s](.*?)\[file_lz_e]/, 'g'),
            '[文件]'
          );
          text = text.replace(
            new RegExp(/\[doc_lz_s](.*?)\[doc_lz_e]/, 'g'),
            '[文件]'
          );
          if (text) {
            _self.$toast({ text: `${user}给您发了消息：${text}` });
            window.chatExample.message = messageData;
          }
          /*
          执行所有回调
          */
          for (let key in window.chatExample.MESSAGE_RECEIVED_CALLBACKS) {
            const callback = window.chatExample.MESSAGE_RECEIVED_CALLBACKS[key];
            callback.fn(messageData);
          }
        }
      });
      /*
      TIM未读总数变化
      */
      this.$TIM.on(
        TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
        function (event) {
          /*
        执行所有回调
        */
          for (let key in window.chatExample.UNREADMESSAGECOUNT_CALLBACKS) {
            const callback =
              window.chatExample.UNREADMESSAGECOUNT_CALLBACKS[key];
            callback.fn(event.data);
          }
        }
      );
      // 登录TIM
      setTimeout(() => {
        this.$TIM.login({ userID: this.userId, userSig: this.userSig });
      }, 300);
    },
    /**
     * @description: 登录TIM
     * @return {*}
     */
     tuicallLogin(result) {
      // 音视频通话报错了
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.ERROR,
        function (event) {
          console.log(
            `%通话报错', 'color: blue; font-size: 100px; background-color: yellow;`
          );
          console.log(event);
          if(event.code < 0) {
            if(event.code === -1101 || event.code === '-1101') {
              this.$toast({text: '未获取麦克风、摄像头权限，无法通话'});
            } else if(event.code === 5100 || event.code === '5100') {
              this.$toast({text: '获取摄像头失败，对方将无法看见您的画面'});
            } else {
              this.$toast({text: '线路忙，请稍后再试'});
            }
            setTimeout(() => {
              this.$TIM.runCallBacksClear();
            }, 1000)
          }
        },
        this
      );
      // SDK准备完成
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.SDK_READY,
        function () {
          console.log(
            '%cSDK READY',
            'color: #fff; padding: 20px; font-size: 32px; background-color: green;'
          );
        }
      );
      // 通话接通(双方都会收到)
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.ON_CALL_BEGIN,
        function (event) {
          console.log(
            '%c通话接通',
            'color: #fff; padding: 20px; font-size: 32px; background-color: green;'
          );
          this.$TIM.cancelCallWait();
          this.$TIM.changeCallStatus();
          // 记录本次通话录像
          this.API.send(
            {
              module: 'im',
              url: '/trtc/startRecord',
              method: 'POST',
              comment: '音视频通话开始时调用'
            },
            {
              roomId: event.roomID,
              invitorId: this.$TUICALL._inviterID,
              inviteeId: this.$TUICALL._inviteeID
            },
            function () { },
            function () { },
            this
          );
        },
        this
      );
      // console.log('TUICALLENGINE:', TUICALLENGINE)
      // 收到一个新的来电请求事件
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.ON_CALL_RECEIVED,
        function (event) {
          // 重置按钮状态
          this.$TIM.resetBtnClick();

          // 变成待接听界面
          this.$TIM.createCallContainer(event.callMediaType || 2);
          this.$TIM.createButton('callee');
          this.$TIM.callWait();
          // 打开我方摄像头
          this.$TUICALL.openCamera('lonchCallLocalView');

          // 回应我已收到call
          // 找到拨打我的用户
          console.log('event:', event)
          const calleeIdList = event.calleeIdList;
          this.respondCall(calleeIdList && calleeIdList[0]);          
        },
        this
      );
      // 远端用户开启/关闭了摄像头
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.USER_VIDEO_AVAILABLE,
        function (event) {
          console.log(
            '%cUSER_VIDEO_AVAILABLE事件',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #aa6600;'
          );
          const { userID, isVideoAvailable } = event;
          if(isVideoAvailable) {
            console.log('拉远程摄像头');
            this.$TUICALL.startRemoteView({
              userID: userID,
              videoViewDomID: 'lonchCallRemoteView',
              options: {
                objectFit: 'contain'
              }
            });
          }
          if (this.$TUICALL._callType === 1 || this.$TUICALL._callType === '1') {
            this.$TIM.setVoiceCall();
          }
        },
        this
      );
      // 对方接听
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.USER_ACCEPT,
        function () {
          console.log(
            '%c对方接听',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          this.$TIM.cancelCallWait();
          this.$TIM.changeCallStatus();
        },
        this
      );
      // 用户进入
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.USER_ENTER,
        function () {
          console.log(
            '%c用户ENTER',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          console.log('this.$TUICALL:', this.$TUICALL)
          // if(this.$TUICALL._callType === 2 || this.$TUICALL._callType === '2') {
          // type = 2:视频通话
          // 视频通话才需要开关一下摄像头
          // }
          // 通用接口存储此次roomId
          setTimeout(() => {
            this.$TUICALL.closeCamera('lonchCallLocalView').then(() => {
              setTimeout(() => {
                this.$TUICALL.openCamera('lonchCallLocalView').then(() => {
                  // 设置视频质量为 720p
                  this.$TUICALL.setVideoQuality('480p');
                  if (this.$TUICALL._callType === 1 || this.$TUICALL._callType === '1') {
                    // type = 1:视频通话
                    // 音频通话才需要关->开->关一下视频
                    setTimeout(() => {
                      this.$TUICALL.closeCamera('lonchCallLocalView');
                    }, 600)
                  }
                });
              }, 900)
            });
          }, 300)
        },
        this
      );
      // 对方无应答（邀请方会收到）
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.CALLING_TIMEOUT,
        function () {
          console.log(
            '%c对方无应答（邀请方会收到）',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          this.$toast({ text: '对方无应答' });
          this.$TIM.cancelCallWait();
          this.$TIM.clearCallContainer();
          this.$TIM.runCallBacksClear();
        },
        this
      );
      // 拒绝（邀请方收到）
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.REJECT,
        function () {
          console.log(
            '%c对方拒绝通话',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          this.$toast({ text: '对方忙' });
          this.$TIM.cancelCallWait();
          this.$TIM.clearCallContainer();
          this.$TIM.runCallBacksClear();
        },
        this
      );
      // 邀请方忙线
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.LINE_BUSY,
        function () {
          console.log(
            '%c占线',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          this.$toast({ text: '线路忙，请您稍后再拨' });
          this.$TIM.cancelCallWait();
          this.$TIM.clearCallContainer();
          this.$TIM.runCallBacksClear();
        },
        this
      );
      // 通话未建立
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.ON_CALL_CANCELED,
        function () {
          console.log(
            '%c通话未建立',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          this.$TIM.cancelCallWait();
          this.$TIM.clearCallContainer();
          // this.$toast({text: '通话失败'});
          this.$TIM.runCallBacksClear();
        },
        this
      );
      // 通话结束
      this.$TUICALL.on(
        TUICALLENGINE.TUICallEvent.CALLING_END,
        function () {
          console.log(
            '%c通话结束',
            'color: #fff; padding: 20px; font-size: 32px; background-color: #ff9900;'
          );
          // this.$toast({text: '通话结束'});
          this.$TIM.cancelCallWait();
          this.$TIM.clearCallContainer();
          this.$TIM.runCallBacksClear();
        },
        this
      );
      // 初始化TRTCCALLING
      this.$TUICALL
        .login({
          userID: result.userId,
          userSig: result.userSig
        })
        .then((res) => {
          console.log(
            '%c登录TRTC CALLING成功',
            'color: #fff; padding: 20px; font-size: 32px; background-color: green;'
          );
          console.log(res);
          // trtccalling登录成功
          this.$TIM.callBacks.forEach((v) => {
            v();
          });
        }).catch((e) => {
          // this.$message({message: '暂时无法发起通话，请稍等一会'});
          console.log(e);
          setTimeout(() => {
            this.$TIM.runCallBacksClear();
          }, 1000);
          // this.$TIM.callBacks.forEach((v) => {
          //   v();
          // });
        });
    },
    /**
     * 回应已收到
     */
    respondCall(userId) {
      // 回应
      // this.isRespondCall = true;
      this.API.send(
        { module: 'im', url: '/trtc/receiveCall' },
        {
          // 邀请者
          invitorId: userId,
          // 受邀者
          inviteeId: window.chatExample.meInfo.userId
        },
        function () {
          // 在app中，如果我收到了邀请，那就得让取消按钮能挂断了
          if (this.needRetry) {
            this.needRetry = false;
          }
        },
        function () { },
        this,
        true
      );
    }
  },
  mounted() {
    // 判断当前项目是否已准备好
    // 准备好了的话，直接初始化TIM
    if (!LonchJsApi.isInApp() || (LonchJsApi.isInApp() && this.initializeTim)) {
      if (!!this.$TIM) {
        if (this.CFG.isInitialized) {
          this.initTim();
        } else {
          this.CFG.initializedCallBacks.push({
            context: this,
            params: {},
            fn: this.initTim
          });
        }
      }
    }
  },
  beforeDestroy() {
    // 退出TIM登录
    if (!LonchJsApi.isInApp() && !!this.$TIM) {
      this.$TIM.logout();
    }
  }
};
</script>
