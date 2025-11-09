<script>
export default {
  data() {
    return {
      callTimer: null,
      // 重试次数
      retryCount: 0
    }
  },
  methods: {
    /**
     * 给某个用户打电话
     * 不知道对方是不是手机接的，所以只要拨号，就需要重试
     */
     callUser(type, callUserId) {
      if(!window.chatExample.isVideCall) {
        this.$toast({text: '设备故障，无法进行音视频通话'});
      }
      this.callTimer = setInterval(() => {
        // 重试3次就不再重试了
        if(this.retryCount >= 3) {
          clearInterval(this.callTimer);
          this.callTimer = null;
        }
        this.retryCount = this.retryCount + 1;
        // 查看呼叫状态
        this.API.send({module: 'im', url: '/trtc/callStatus'},
        {
          invitorId: window.chatExample.meInfo.userId,
          inviteeId: callUserId || window.chatExample.chatPartnerUserId
        },
        function (res) {
          // console.log('呼叫状态：：：：：', res, this.$TUICALL._callStatus)
          // 呼叫是否成功??
          if(!res.data) {
            // 连接状态才有重试，都没有连接，还重试啥
            // if(['connected'].includes(this.$TUICALL._callStatus)) {
            //   // 呼叫不成功，挂了之后再打！
            //   console.log(
            //     '%c拨号无应答，即将取消后重拨!!',
            //     'color: #fff; padding: 20px; font-size: 32px; background-color: #D40F0F;'
            //   );
            //   console.log(res);
            //   this.$TUICALL.hangup().then(() => {
            //     this.callUserFunc(type, callUserId);
            //   });
            // }
          } else {
            console.log(
                '%c对方收到拨号，即将关闭定时器',
                'color: #fff; padding: 20px; font-size: 32px; background-color: green;'
              );
            // 呼叫成功清除定时器
            clearInterval(this.callTimer);
            this.callTimer = null;
          }
        },
        function () {},
        this,
        true
        );

      }, 5000);
      // 记录拨号数据
      this.API.send({module: 'im', url: '/trtc/startCall'},
        {
          invitorId: window.chatExample.meInfo.userId,
          inviteeId: callUserId || window.chatExample.chatPartnerUserId
        },
        function () {
          this.callUserFunc(type, callUserId);
        },
        function () {},
        this,
        true
      );
    },
    /**
     * 拨号
     * @param {*} type 1 音频 2 视频
     * @param {*} callUserId 给哪个用户打
     */
    callUserFunc(type, callUserId) {
      console.log('呼叫：', {type, callUserId: callUserId || window.chatExample.chatPartnerUserId})
      this.isCalling = true;
      this.$TUICALL
        .call({
          userID: callUserId || window.chatExample.chatPartnerUserId,
          type: type,
          offlinePushInfo: {
            title: '邀请通话',
            description: this.CFG.userInfo.name + '邀请您进行视频通话',
            extension: this.CFG.userInfo.name + '邀请您进行视频通话',
            androidOPPOChannelID: ''
          }
        })
        .then((res) => {
          console.log(
            '%c已拨号，等待对方接听',
            'color: #fff; padding: 20px; font-size: 32px; background-color: green;'
          );
          console.log(res);
          // 重置按钮状态
          this.$TIM.resetBtnClick();
          this.isCallVisible = false;
          // 拨打电话时，出现己方等待画面
          this.$TIM.createCallContainer(type);
          this.$TIM.createButton('call');
          this.$TIM.callWait();
          // this.$TUICALL.startLocalView({
          //   userID: window.chatExample.meInfo.userId,
          //   videoViewDomID: 'lonchCallLocalView'
          // });
          this.$TUICALL.openCamera('lonchCallLocalView');
        })
        .catch((res) => {
          console.error('拨号失败！！！！！！！！！！', res);
        //   this.$toast({text: '拨号失败，请再试一次'});
        //   setTimeout(() => {
        //     this.$TIM.runCallBacksClear();
        //   }, 1000);
        });
    }
  }
}
</script>