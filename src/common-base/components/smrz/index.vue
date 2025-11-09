<!-- 此实名认证组件失效，直接跳转 manage 自然人实名认证申请单页面 -->
<template>
  <!--
  <el-dialog title="实名认证" :modal-append-to-body="false" :visible.sync="isShowBindMobileDialog" :closeOnClickModal="false" center>
    <div class="flex flex-content-start flex-items-center mt0">
      <label class="form-label tar smrz-form-label"><span class="red">*</span>认证证件类型:</label>
      <div class="flex-flex-auto">
        <el-select size="small" class="full-width" readonly :disabled="isInMiniprogram()" @focus="fixIOSKeyboard()" v-model="identityType" placeholder="认证证件类型">
          <el-option label="身份证" :value="0"></el-option>
          <el-option label="护照" :value="1"></el-option>
          <el-option label="港澳居民来往内地通行证" :value="2"></el-option>
          <el-option label="台湾居民来往大陆通行证" :value="3"></el-option>
        </el-select>
      </div>
    </div>
    <div class="flex flex-content-start flex-items-center mt15 pt0">
      <label class="form-label tar smrz-form-label"><span class="red">*</span>人员姓名:</label>
      <div class="flex-flex-auto">
        <el-input v-model.trim="infoConfig.data.name" class="full-width" placeholder="请输入内容" size="small"> </el-input>
      </div>
    </div>
    <div class="flex flex-content-start flex-items-center mt15 pt0">
      <label class="form-label tar smrz-form-label"><span class="red">*</span>手机号:</label>
      <div class="flex-flex-auto">
        <el-input v-model.trim="infoConfig.data.cellphone" class="full-width" placeholder="请输入内容" size="small"> </el-input>
      </div>
    </div>
    <div class="mt15 flex flex-content-start flex-items-center">
      <div class="flex-flex-auto tac">
        <button class="btn btn-xl ml20" @click="isShowBindMobileDialog = false">取消</button>
        <button @click="confim()" class="btn btn-primary btn-xl ml10">去认证</button>
      </div>
    </div>
  </el-dialog>
  -->
</template>

<script>
import toRZHMixin from '@/common-base/components/humanAuth/toRZHMixin';
import commonApi from "@/common-base/config/common-api-config.js";
export default {
  name: 'smrz',
  mixins: [toRZHMixin],
  props: ['id'],
  data() {
    return {
      isShowBindMobileDialog: false,
      sendFlag: true,
      identityType: 0,
      isMin: false,
      infoConfig: {
        data: {
          name: '',
          cellphone: '',
          id: this.id
        }
      }
    };
  },
  created() {
    // this.initUserDate();
    // if (this.id) {
    //   this.isShowBindMobileDialog = true;
    // }
    if(this.CFG.userInfo.authStatus !== '1') {
      this.$confirm({
        title: '提示',
        text: '您尚未实名认证，是否去认证？',
        buttons: [
          {
            text: '取消',
            type: 'follow'
          },
          {
            text: '去认证',
            type: 'primary',
            callback: () => {
              this.toRZHFunction(this.CFG.userInfo.id);
            }
          }
        ]
      });
    }
  },
  methods: {
    confim() {
      if (!this.infoConfig.data.name) {
        this.$toast('请输入姓名');
        return;
      }
      if (/\d/.test(this.infoConfig.data.name)) {
        this.$toast({ text: '检测到您的姓名存在异常，请您更新后去认证' });
        return;
      }
      if (!this.infoConfig.data.cellphone) {
        this.$toast('请输入手机号');
        return;
      }
      if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(this.infoConfig.data.cellphone)) {
        this.$toast('请输入zh正确的手机号');
        return;
      }
      let args =  {
        "humanType": "4c07e9e6601d464297b44e023f4f11f8",
        "isAuto": 1,
        "type": 2,
        "source": this.CFG.project.id,
        ...this.infoConfig.data
      };
      // 云服中字典
      // 1        居民身份证
      // 2        其他
      // 3        护照
      // 4:港澳居民来往内地通行证,
      // 5:台湾居民来往大陆通行证
      if(this.identityType === 0){
        args.identificationTypeCode = 1;
      }else if(this.identityType === 1){
        args.identificationTypeCode = 3;
      }else if(this.identityType === 2){
        args.identificationTypeCode = 4;
      }else if(this.identityType === 3){
        args.identificationTypeCode = 5;
      }
      this.API.send(
        commonApi.ca.systemHumanApplyCreate,
        args,
        function (res) {
          if (res.opFlag) {
            this.closeBindMobileDialog = false;
            this.infoConfig.show = false;
            this.queryCertification();
          }
        },
        function () {},
        this
      );
    },
     // 判断是否在小程序环境中
    isInMiniprogram() {
      let userAgent = window.navigator.userAgent;
      return /.*Micromessenger.*/i.test(userAgent) && /.*miniProgram.*/i.test(userAgent)
    },
    //获取用户信息
    initUserDate(){
      this.API.send(
        this.CFG.services.common.queryPersonTencentAuthByHuman, {},
        function (res) {
          if (res.opFlag) {
            let result = res.serviceResult || {};
            this.infoConfig.data.name = result.name;
            this.infoConfig.data.description = result.description;
            this.infoConfig.data.identificationNumber = result.idNum;
            this.infoConfig.data.humanId = result.humanId;
            this.infoConfig.data.cellphone = result.cellphone;
            if (result.status !== 1) {
              this.isShowBindMobileDialog = true;
            }else{
              this.isShowBindMobileDialog = false;
            }
          }
        },
        function () {},
        this
      );
    },
    /**
     * 去tencent认证
     */
    personTencentAuth() {
      let args = {
        sourceType: 1,
      }
      let params = this.utils.getParams();
      if (!this.sendFlag) {
        return;
      }
      this.sendFlag = false;
      if (params.hasOwnProperty('sourceType')) {
        args.sourceType = params.sourceType || 1;
      }
      if (/^1[23456789]\d{9}$/.test(this.infoConfig.data.name)) {
        this.$toast({ text: '检测到您的姓名存在异常，请您更新后去认证' });
        return;
      }
      this.API.send(
        this.CFG.services.common.personTencentAuth,
        args,
        (res) => {
          res = res.serviceResult;
          if(res.flag){
            this.isShowBindMobileDialog = false;
            this.$toast({ text: '实名认证成功'})
          }else{
            this.$toast({ text: res.reason + '，认证失败', duration: 3000 });
          }
        },
        function () {
          this.infoConfig.show = false;
          this.sendFlag = true;
        },
        this
      );
    },
    queryCertification() {
      if(this.isInMiniprogram()){
        this.personTencentAuth();
      }else{
        this.$toast({ text: '正在努力加载认证页面~' });
        this.goToManCert({ clientType: 1 });
      }
    },
    fixIOSKeyboard() {
      document.activeElement.blur();
    },
    goToManCert(args) {
      let params = this.utils.getParams();
      if (!this.sendFlag) {
        return;
      }
      this.sendFlag = false;
      if (params.hasOwnProperty('sourceType')) {
        //1 云服 2 云药房 //3要发采
        args.sourceType = params.sourceType || 1;
      }
      args.identityType = this.identityType;
      // 2023528 此接口配合后端修改，增加入参name
      args.name = this.infoConfig.data.name;
      this.API.send(
        this.CFG.services.econtract.queryCertification1,
        args,
        res => {
          this.isShowBindMobileDialog = false;
          res = res.serviceResult;
          if (args.clientType == 2) {
            this.url = res.urlLong;
          } else {
            this.url = res.url;
          }
          this.sendFlag = true;
          if (typeof LonchJsApi === 'object' && LonchJsApi.isInApp()) {
            this.API.send(
              { command: 'cmdAppOpenUrl', module: 'yfcapi' },
              {
                url: this.url,
                title: '实名认证',
                config: {
                  type: 'externalSystem',
                  isBackTitleBar: true
                }
              },
              () => {},
              () => {},
              this,
              true
            );
          } else {
            window.location.href = this.url;
          }
        },
        function () {
          this.sendFlag = true;
        },
        this
      );
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  max-width: 400px;
  width: 90%;
}
.smrz-form-label {
  display: inline-block;
  width: 100px;
}
</style>