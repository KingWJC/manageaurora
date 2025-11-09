<template>
  <div class="">
    <form @submit="submit">
      <div class="lc-row lc-space16">
        <div class="lc-col-12">
          <div class="flex flex-content-start flex-items-center">
            <label class="nowrap">手机:</label>
            <div class="flex-flex-auto">
              <el-input v-model="formdata.cellphone"
                        :disabled="isDisabledCellphone"
                        class="full-width"
                        size="small">
              </el-input>
            </div>
          </div>
        </div>
        <div class="lc-col-12">
          <div class="flex flex-content-start flex-items-center">
            <label class="nowrap">姓名:</label>
            <div class="flex-flex-auto">
              <el-input v-model="formdata.name"
                        class="full-width"
                        size="small">
              </el-input>
            </div>
          </div>
        </div>
        <div class="lc-col-12">
          <div class="flex flex-content-start flex-items-center">
            <label class="nowrap">身份证号:</label>
            <div class="flex-flex-auto">
              <el-input v-model="formdata.identificationNumber"
                        class="full-width"
                        size="small">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="pt20">让小i为您更好的服务,请补齐您的身份信息（支持港澳台身份证和护照）</div>
      <div class="mt20">
        <div class="flex-flex-auto tac">
          <button type="submit" class="btn btn-primary btn-block btn-xl">
            确定
          </button>
        </div>
        <div class="flex-flex-auto tac mt10">
          <button @click="cancel" class="btn btn-block btn-xl">
            暂不补全
          </button>
        </div>
      </div>
      <div class="info-tips">收集手机号和身份证仅用于身份验证，我们依照隐私政策保护您的个人信息</div>
    </form>

  </div>
</template>

<script>
import commonApi from "@/common-base/config/common-api-config.js";

export default {
  name: 'UserInfoComplementForm',
  components: {},
  props: {
    entity: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      formdata: {}
    };
  },
  created () {
    this.formdata = Object.assign({}, {...this.entity});
  },
  computed: {
    isDisabledName: function () {
      return this.entity.name ? true : false;
    },
    isDisabledCellphone: function () {
      return this.entity.cellphone ? true : false;
    }
  },
  methods: {
    validate () {
      if (!this.formdata.cellphone) {
        this.$toast({text: '请填写手机号'});
        return false;
      }
      if (!this.formdata.cellphone && !/^1[23456789]\d{9}$/.test(this.formdata.cellphone)) {
        this.$toast({
          text: '手机号格式不正确'
        });
        return false;
      }
      if (!this.formdata.name) {
        this.$toast({
          text: '请填写姓名'
        });
        return false;
      }
      if (!this.formdata.identificationNumber) {
        this.$toast({text: '请填写身份证号(支持港澳台和护照)'});
        return false;
      }
      // 内地 ^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9xX])$
      // 香港身份证号码校验 开头一位或两位大写字母，然后接上6-10位数字，最后一位数字或字母校验 ^[a-zA-Z]{1,2}[0-9]{6,10}[0-9a-zA-Z]?(\([0-9a-zA-Z]\))?$
      // 澳门身份证号码校验 开头数字1或者5或者7，然后接上6位数字，再接上一位数字或者大写字母校验
      // 台湾身份证号码校验 开头一位小写或者大写字母，接上9位数字
      // 中国护照 ^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$
      if (!/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9xX])$|^[a-zA-Z]{1,2}[0-9]{6,10}[0-9a-zA-Z]?(\([0-9a-zA-Z]\))?$|^[1|5|7][0-9]{6}[0-9a-zA-Z]$|^[a-zA-Z][0-9]{9}$|^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/.test(this.formdata.identificationNumber)) {
        this.$toast({
          text: '身份证号格式不正确'
        });
        return false;
      }
      return true;
    },
    cancel(){
      this.$emit('cancel');
    },
    submit (event) {
      event.preventDefault();
      if (this.validate()) {
        let args = {
          humanId: this.formdata.id,
          identificationNumber: this.formdata.identificationNumber,
          name: this.formdata.name,
          humanType: "4c07e9e6601d464297b44e023f4f11f8",
          isAuto: 1,
          type: 2,
          source: this.CFG.project.id,
          cellphone: this.formdata.cellphone
        };
        // 如果没有手机号，使用输入手机号
        if (!this.entity.cellphone) {
          args.cellphone = this.formdata.cellphone;
        }
        if(!this.formdata.id){
          this.$toast({
            text: '数据同步异常，请您退出重试'
          });
          return
        }
        this.updateHu(args);
      }
    },
    updateHu (args) {
      this.API.send(commonApi.ca.systemHumanApplyCreate, args, function () {
        // res = res.serviceResult;
        this.$toast({text: '保存成功'});
        this.CFG.userInfo.name = args.name;
        this.$emit('cancel');
      }, function () {
      }, this);
    }
  }
};
</script>

<style lang="scss">
.info-tips {
  margin-top: 10px;
  border: #dfba81 1px solid;
  background: #fff2de;
  padding: 8px;
  color: #81715a;
}
</style>
