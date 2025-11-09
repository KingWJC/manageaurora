<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-13 17:54:17
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-18 22:41:18
 * @FilePath: \lonch-appbar\src\components\common\yfCard\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div v-if="isLoading">
      <div v-if="maillSettingForm.emailAccount">
        <el-form :label-position="'top'" :rules="maillSettingRules" ref="ruleMailSettingForm" :model="maillSettingForm">
          <el-form-item label="邮箱地址" class="full-width">
            <el-input v-model="maillSettingForm.emailAccount" :disabled="true" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱密码" prop="password" class="full-width">
            <el-input v-model="maillSettingForm.password" type="password" size="small" :maxlength="18"></el-input>
            <div class="mail-seeting-dialog-tips">
              1.密码长度 12-18位<br />
              2.包含大小写字母、数字、符号
            </div>
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPassword" class="full-width">
            <el-input v-model="maillSettingForm.repeatPassword" type="password" size="small" :maxlength="18"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="pt20">
            <el-button @click="close" size="small">取消</el-button>
            <el-button type="primary" @click="submitEditMaillPassword" size="small">确定</el-button>
          </div>
        </span>
      </div>
      <div class="mail-seeting-dialog-img" v-else>
        <div class="flex flex-content-center flex-items-center">
          <img src="https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/19/535f1a9ee7ee490baf445f63b2e2796720250719030540.png" alt="" />
        </div>
        <div class="pt20 pb20 tac red">您的账号未开通邮箱服务</div>
        <span slot="footer" class="dialog-footer">
          <div class="flex flex-content-center flex-items-center">
            <el-button @click="close" type="primary" size="small">知道了</el-button>
          </div>
        </span>
      </div>
    </div>
    <div v-else>
      <div v-loading="true" class="p20"></div>
    </div>
  </div>
</template>

<script>
// 接口配置
import commonApi from "@/common-base/config/common-api-config.js";
export default {
  data() {
    return {
      // 用户邮箱信息是否加载完成？
      isLoading: false,
      // 修改邮箱密码表单配置
      maillSettingForm: {
        emailAccount: '',
        password: '',
      },
      // 邮箱表单校验规则
      maillSettingRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 12, max: 18, message: '密码长度在12-18位之间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W_]{12,18}$/;
              if (!pattern.test(value)) {
                callback(new Error('密码必须包含大小写字母、数字和符号'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        repeatPassword: [
          {
            required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.maillSettingForm.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    // 打开组件时打开配置
    this.openMaillSetting();
  },
  methods: {
    /**
     * 保存后关闭弹窗
     */
    close() {
      this.$emit('close');
    },
    /**
     * 打开邮箱设置
     */
    openMaillSetting() {
      this.maillSettingForm.emailAccount = '';
      this.maillSettingForm.emailPassword = '';
      this.API.send(commonApi.email.queryMailByHumanId, {},
        (res) => {
          const result = res && res.data || {};
          this.maillSettingForm.emailAccount = result.emailAccount;
          this.isLoading = true;
        }, () => {
          this.isLoading = true;
        }, this, true);
    },
    /**
     * 提交密码修改
     */
    submitEditMaillPassword() {
      this.$refs['ruleMailSettingForm'].validate((valid) => {
        if (valid) {
          const args = {
            humanId: this.CFG.userInfo.id,
            emailAccount: this.maillSettingForm.emailAccount,
            password: this.maillSettingForm.password,
          };
          this.API.send(commonApi.email.resetPassword, args,
            () => {
              this.$toast({text: '邮箱密码修改成功'});
              this.$emit('close');
            }, () => {
            }, this, true);
        }
      });
    }
  },
}
</script>

<style scoped lang="scss">
.manage-card {
  &-frame {
    img {
      margin: 0 auto;
      display: block;
      width: 80%;
      max-width: 368px;
    }
  }
}
// 图片放大弹窗样式
// 弹窗背景透明
// 遮罩正常显示
.manage-card-img-preview-dialog {
  box-shadow: none;
  background-color: transparent;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.mail-seeting-dialog {
  width: 90%;
  max-width: 480px;
  &-tips {
    color: #ff9900;
    line-height: 1em;
  }
  &-img {
    img {
      width: 100px;
    }
  }
}
::v-deep .el-form .el-form-item {
  margin-bottom: 22px !important;
}
::v-deep .el-form-item__error {
  position: static;
}
::v-deep .el-form-item__label {
  line-height: 1em;
}
</style>
