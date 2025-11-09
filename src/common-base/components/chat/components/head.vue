<!--
 * @Date: 2024-04-06 23:12:05
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-04-12 15:38:51
 * @FilePath: \common-base\components\chat\components\head.vue
 * @Description: 
-->
<template>
  <div class="char-head">
    <img alt="头像" :src="defaultHead" />
  </div>
</template>

<script>
export default {
  props: ['userId'],
  data() {
    return {
      // 默认头像地址
      defaultHead: 'https://resources.lonch.com.cn/chat/head.svg'
    };
  },
  methods: {
    /**
     * @description: 通过TIM SDK拉取用户头像
     * @return {*}
     */
    getHead() {
      let promise = this.$TIM.getUserProfile({
        // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
        userIDList: [this.userId]
      });
      promise
        .then(function (imResponse) {
          const data = imResponse.data;
          /*
          获取到用户头像
          */
          if(data && data[0] && data[0].avatar) {
            _self.defaultHead = data[0].avatar;
          }
        })
        .catch(function () {
        });
    }
  },
  mounted() {
    this.getHead();
  }
};
</script>

<style lang="scss" scoped>
.char-head {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 50px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
