<template>
  <div class="">
    <div class="banner-info">
      <form @submit="bindMobileNumber">
        <div>
          <input v-model="formdata.phone"
                 type="text"
                 maxlength="11"
                 class="login-input"
                 placeholder="请输入手机号" />
        </div>
        <div class="flex mt20">
          <div class="flex-flex-auto">
            <input v-model="formdata.smsCode"
                   type="password"
                   maxlength="6"
                   class="login-input"
                   placeholder="请输入验证码" />
          </div>
          <div class="ml10 flex flex-column flex-content-center tac" style="width: 120px">
            <span :class="{link: !isSmsLocked}" @click="sendSms" ref='smsButton'>获取验证码</span>
          </div>
        </div>
        <div class="mt30 btn-group flex">
          <div class="flex-flex-auto">
            <button type="submit" class="btn btn-primary btn-block btn-xxl">确定</button>
          </div>
        </div>
      </form>
    </div>
    <el-dialog
      title="账号确认"
      :modal-append-to-body="false"
      :visible.sync="isShowConfirmDialog"
      width="600px"
      height="500px"
      center>
      <div class="" v-if="isShowConfirmDialog">
        <div>
          该手机号已存在"{{existAccountName}}"账号，请确认是否为你的账号
        </div>
        <div class="mt20">
          <el-button class="full-width" size="mini" @click="confirmByPhone(1)">是我的，立刻登录</el-button>
        </div>
        <div class="mt20">
          <el-button class="full-width" size="mini" @click="confirmByPhone(0)">不是我的，使用手机号注册</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import '../../accsets/login.css';
import mixinLogin from '../../mixins/login';

let timer;
let times;
export default {
  name: 'BindMobileNumber',
  mixins: [mixinLogin],
  data () {
    return {
      smsButtonText: '获取验证码',
      isSmsLocked: false,
      isShowConfirmDialog: false,
      formdata: {
        unionid: '',
        phone: '',
        smsCode: ''
      },
      existAccountName: ''
    };
  },
  created () {
    this.formdata.unionid = this.$route.query.unionid;
  },
  methods: {
    startTimer: function () {
      let that = this;
      timer = setTimeout(function () {
        times--;
        if (times > 0) {
          that.$refs.smsButton.innerHTML = times + '秒后重新获取';
          that.startTimer();
        } else {
          that.$refs.smsButton.innerHTML = '获取验证码';
          that.isSmsLocked = false;
        }
      }, 1000);
    },
    showConfirmDialog () {
      this.isShowConfirmDialog = true;
    },
    closeConfirmDialog () {
      this.isShowConfirmDialog = false;
    },
    sendSms: function () {
      if (this.isSmsLocked) {
        return;
      }
      if (!this.formdata.phone) {
        this.$toast({text: '请输入手机号'});
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formdata.phone)) {
        this.$toast({'text': '请输入正确的手机号'});
        return false;
      }
      this.isSmsLocked = true;
      this.API.send({module: 'mserver', url: '/user/sendSms4login', method: 'POST'}, {phone: this.formdata.phone}, function (res) {
          if (res.opFlag) {
            times = 60;
            this.isSmsLocked = true;
            this.startTimer();
            this.$toast({text: '发送验证码成功，请注意查收'});
          } else {
            this.isSmsLocked = false;
            this.$toast({text: res.error});
          }
        }, function () {
          this.isSmsLocked = false;
          this.$toast({text: '对不起，发送验证码失败'});
        },
        this
      );
    },
    bindMobileNumber: function (event) {
      event.preventDefault();
      if (!this.formdata.phone) {
        this.$toast({text: '请输入手机号'});
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formdata.phone)) {
        this.$toast({'text': '请输入正确的手机号'});
        return false;
      }
      if (!this.formdata.smsCode) {
        this.$toast({text: '请输入验证码'});
        return;
      }
      // 游客绑定手机号
      this.API.send(this.CFG.services.common.sendSms4Linkmanlogin, this.formdata, function (res) {
          if (res.opFlag && res.serviceResult.code === '0000') {
            this.mixinLogin(res.serviceResult);
          } else if (res.serviceResult.code === '0011') {
            this.existAccountName = res.serviceResult.realName;
            this.showConfirmDialog();
          } else {
            this.$toast({text: res.serviceResult.msg});
          }
        }, function () {
          this.isSmsLocked = false;
          this.$toast({text: '对不起，绑定失败'});
        },
        this
      );
    },
    // 确认绑定
    confirmByPhone: function (confirmStatus) {
      event.preventDefault();
      this.closeConfirmDialog();
      let args = Object.assign({}, {...this.formdata});
      args.confirmStatus = confirmStatus;
      this.API.send(this.CFG.services.common.confirm4Linkmanlogin, args, function (res) {
          if (res.opFlag && res.serviceResult.code === '0000') {
            //this.mixinLogin(res.serviceResult);
          } else if (res.opFlag && res.serviceResult.code === '0006') {
            //console.log('提示')
            this.$confirm({
              text: '绑定失败，如有疑问请联系客服:400-620-9199',
              buttons: [
                {
                  text: '确定',
                  type: 'primary'
                }
              ]
            });
          } else {
            this.$toast({text: res.serviceResult.msg});
          }
        }, function () {
          this.isSmsLocked = false;
          this.$toast({text: '对不起，绑定失败'});
        },
        this
      );
    }

  },
  beforeDestroy () {
    if (timer) {
      clearTimeout(timer);
    }
  }
};
</script>
