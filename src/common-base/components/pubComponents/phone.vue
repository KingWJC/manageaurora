<template>
  <div>
    <div style="line-height: 30px;" class="flex flex-content-between mb5"
    v-for="(phone, i) in phoneList" :key="i">
      <div class="full-width flex" style="width: 130px">
        <el-input class="full-width" size="small"
        v-model="phone.phone"
        @blur="blur(phone)"
        placeholder="请输入电话号码"></el-input>
      </div>
      <span>
        <el-button v-if="phone.phoneType == 0" size="mini" @click="setClick(phoneList, phone, i)">设置为登录账户</el-button>
        <el-button v-else size="mini" type="primary">已为登录账户</el-button>
        <span class="icon-self" style="background: red" @click="delClick(phoneList, i)">
          <i :class="'el-icon-delete'"></i>
        </span>
      </span>
    </div>
    <el-button size="mini" class="full-width" @click="addClick()">添加</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'phoneComponent',
  props: ['phoneList'],
  data () {
    return {
    }
  },
  created () {
    if (!this.phoneList) {
      this.phoneList = [];
    }
  },
  mounted () {
  },
  methods: {
    blur(phone) {
      if (!phone.phone) {
        this.$toast({ text: '请输入手机号' });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(phone.phone)) {
        this.$toast({ text: '请输入正确的手机号' });
        return;
      }
    },
    /**
     * 添加电话号码
     */
    addClick() {
      let flag = true;
      this.phoneList.forEach(i => {
        if (!i.phone) {
          flag = false;
          return;
        }
      });
      if (!flag) {
        this.$toast({ text: '已有未输入电话号码输入框' });
        return;
      }
      this.phoneList.push({
        phone: '',
        phoneType: this.phoneList.length == 0 ? 1 : 0
      });
    },

    /**
     * 设置电话号码为主登录账号
     * @param list 电话号码列表
     * @param phone 当前电话号码对象
     * @param i 当前电话号码对象下标
     */
    setClick(list, phone, i) {
      if (!phone.phone) {
        this.$toast({ text: '请填写电话号码' });
        return;
      }
      if (list[i].phoneType == 0) {
        list.forEach((item, index) => {
          if (index == i) {
            item.phoneType = 1;
          } else {
            item.phoneType = 0;
          }
        });
      }
    },

    /**
     * 删除电话号码
     * @param list 电话号码列表
     * @param i 当前电话号码对象下标
     */
    delClick: (list, i) => {
      if (list[i].phoneType == 1) {
        if (list.length > 1) {
          list[0].phoneType = 1;
        }
      }
      list.splice(i, 1);
    }
  }
}
</script>
<style lang="scss" type="text/scss">
  .el-form-item {
    margin-bottom: 4px;
  }
  .icon-self {
    display: inline-block;
    width: 20px;
    margin: 5px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
  }
  .btn-self {
    display: inline-block;
    margin: 5px;
    text-align: center;
    line-height: 20px;
    padding: 2px 5px;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
  }
  .close {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 22px;
    background: #a7a7a7;
    border-radius: 50%;
    color: #fff;
  }
</style>
