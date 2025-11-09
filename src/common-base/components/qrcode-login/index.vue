<template>
  <div class="qrcode-box" :class="{'qrcode-hide': isClose, 'qrcode-show': !isClose}">
    <div class="full-width full-height flex flex-column flex-items-center">
      <div class="flex-1 flex flex-column flex-content-center flex-items-center">
        <div class="logo flex flex-content-center flex-items-center">
          <img src="https://resources.lonch.com.cn/ybd/image/ilogo-512.png" />
        </div>
        <div class="fs-lg b mt40">朗致APP登录确认</div>
      </div>
      <div class="wp40" v-if="isQrcode">
        <el-button :disabled="!isQrcode" type="primary" class="full-width" @click="toLogin(2)">登录</el-button>
        <div class="mt20 pb50 wp40">
          <el-button :disabled="!isQrcode" type="text" class="full-width" @click="toLogin(3)">取消登录</el-button>
        </div>
      </div>
      <div v-else class="pb50 b4">
        请稍候...
      </div>
    </div>
  </div>
</template>

<script>
let timer;
let timer2;
export default {
  props: ['value'],
  data () {
    return {
      isQrcode: false,
      isClose: false
    };
  },
  methods: {
    toLogin (type) {
      const _self = this;
      let data = {};
      try {
        data = JSON.parse(_self.value);
      } catch (e) {
        console.log(e);
        _self.$message({message: '扫码失败'});
        _self.closePopup();
        return;
      }
      if (data.qrCode && type) {
        const args = {
          qrCode: data.qrCode,
          qrCodeState: type
        };
        this.API.send(
          this.CFG.services.userAccount.updateQrCodeStatelog,
          args,
          function () {
            _self.isQrcode = true;
            if (type === 2 || type === 3) {
              _self.isClose = true;
              _self.closePopup();
            }
          },
          function () {
            _self.isQrcode = false;
            _self.closePopup();
          },
          this,
          true
        );
      } else {
        _self.isQrcode = false;
        _self.$message({message: '未能识别二维码，请再试一次'});
        _self.closePopup();
      }
    },
    // 关闭二维码弹窗方法
    closePopup () {
      const _self = this;
      timer = setTimeout(() => {
        clearTimeout(timer);
        _self.isClose = true;
      }, 1000);
      timer2 = setTimeout(() => {
        clearTimeout(timer2);
        _self.$emit('setQrCodeOver');
      }, 1500);
    }
  },
  mounted () {
    // 进入扫码页面默认要调一次
    this.toLogin(1);
  },
  beforeDestroy () {
    if (timer) {
      clearTimeout(timer);
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
  @keyframes bounceoutT {
    from {
      bottom: -300px;
      opacity: 0;
    }
    to {
      bottom: 0;
      opacity: 1;
    }
  }

  @keyframes fadeoutB {
    from {
      bottom: 0;
      opacity: 1;
    }
    to {
      bottom: -300px;
      opacity: 0;
    }
  }

  .qrcode-box {
    z-index: 999;
    position: fixed;
    right: 0;
    left: 0;
    height: 100%;
    background: #fff;
    &.qrcode-show {
      animation: bounceoutT 0.1s ease 0s alternate forwards;
    }
    &.qrcode-hide {
      animation: fadeoutB 0.5s ease 0s alternate forwards;
    }
  }

  .logo {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
    img {
      display: block;
      width: 80%;
      height: 80%;
    }
  }
</style>
