<template>
    <form @submit="confirmModifyPassword">
        <div class="">
            <input
                    v-model="pwd"
                    type="password" placeholder="请输入原密码"
                    @input="pwdChanging"
                    class="login-input" />
        </div>
        <div class="mt30">
            <input
                    v-model="newPwd"
                    type="password" placeholder="请输入新密码"
                    @input="newPwdChanging"
                    class="login-input" />
        </div>
        <div class="mt10 orange password-tips">
          <ol>
            <li>8-16位，只能包含大小写字母、数字以及特殊符号（!@#$%^&*）</li>
            <li class="mt5">其中字母、数字和特殊符号至少包含2种</li>
          </ol>
        </div>
        <div class="mt30">
            <input
                    v-model="newPwdCon"
                    type="password" placeholder="请再次输入新密码"
                    @input="newPwdConChanging"
                    class="login-input" />
        </div>
        <div class="mt30">
            <button type="submit" class="btn btn-primary btn-block btn-xxl">
                确认
            </button>
        </div>
        <!-- <pre>{{ formdata }}</pre> -->
    </form>
</template>

<script>
import MD5 from 'md5'
import { checkWeakPassword } from '@/common-base/utils/regular'

export default {
  name: 'ModifyPassword',
  data () {
    return {
      formdata: {
        pwd: '',
        newPwd: '',
        newPwdCon: ''
      },
      pwd: '',
      newPwd: '',
      newPwdCon: ''
    }
  },
  methods: {
    pwdChanging: function () {
      // this.formdata.pwd = this.pwd ? MD5(this.pwd) : ''
      this.formdata.pwd = this.pwd;
    },
    newPwdChanging: function () {
      // this.formdata.newPwd = this.newPwd ? MD5(this.newPwd) : ''
      this.formdata.newPwd = this.newPwd;
    },
    newPwdConChanging: function () {
      // this.formdata.newPwdCon = this.newPwdCon ? MD5(this.newPwdCon) : ''
      this.formdata.newPwdCon = this.newPwdCon;
    },
    confirmModifyPassword: function (event) {
      event.preventDefault()
      if (!this.formdata.pwd) {
        this.$toast({text: '请输入原密码'})
        return
      }
      if (!this.formdata.newPwd) {
        this.$toast({text: '请输入新密码'})
        return
      }
      if(!checkWeakPassword(this.formdata.newPwd)) {
        console.log('this.formdata.newPwd:', this.formdata.newPwd)
        this.$confirm({
          title: '提示',
          text: '密码格式要求：8-16位，只能包含大小写字母、数字以及特殊符号（!@#$%^&*）；其中字母、数字和特殊符号至少包含2种。',
          buttons: [
            {
              text: '确定',
              type: 'primary'
            }
          ]
        })
        return;
      }
      if (!this.formdata.newPwdCon) {
        this.$toast({text: '重复密码不能为空'})
        return
      }
      if (this.formdata.newPwd !== this.formdata.newPwdCon) {
        this.$toast({text: '两次密码不一致'})
        return
      }
      if (this.formdata.pwd === this.formdata.newPwd) {
        this.$toast({text: '新密码与老密码不能一样'})
        return
      }
      const args = {
        pwd: MD5(this.formdata.pwd),
        newPwd: MD5(this.formdata.newPwd),
        newPwdCon: MD5(this.formdata.newPwdCon)
      }
      this.API.send(this.CFG.services.common.modifyLoginPwd, args, function () {
        this.$toast({text: '修改密码成功'})
        this.$emit('status', true)
      }, function () {
      }, this)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    input[type=text],
    input[type=password] {
        box-sizing: border-box;
        width: 100%;
        border-radius: 4px;
        border-width: 1px;
        line-height: 45px;
        height: 45px;
        border: 1px solid #A3B1BF;
        padding: 0 24px;
        font-size: 14px;
        color: #021241;
    }
.password-tips {
  margin-left: 2em;
}
</style>