<!--
 * @Date: 2024-04-12 15:36:41
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-04-12 15:48:41
 * @FilePath: \common-base\components\chat\components\sysEdin.vue
 * @Description: 
-->
<!--系统通知-->
<template>
  <div class="tac">
    <!-- <pre>{{data}}</pre> -->
    <div v-if="data && data.type">
      <div v-if="data.type === 3">
        {{renderUserName()}}退出群聊
      </div>
      <div v-else-if="data.type === 7">
        {{renderUserName()}}修改了群资料
      </div>
    </div>
    <div v-else-if="data.groupTipsElem">
      <div v-if="data.groupTipsElem.type === 3">
        {{renderUserName()}}退出群聊
      </div>
      <div v-else-if="data.groupTipsElem.type === 7">
        {{renderUserName()}}修改了群资料
      </div>
    </div>
  </diV>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: ['data'],
  computed: {
    ...mapGetters(['getAllmanInfo'])
  },
  methods: {
    // 根据用户ID渲染用户名
    /**
     * @description: 
     * @return {*}
     */
    renderUserName() {
      let id = '';
      if(this.data.groupTipsElem && this.data.groupTipsElem.opMember && this.data.groupTipsElem.opMember.userId) {
        id = this.data.groupTipsElem.opMember.userId;
      } else if(this.data && this.data.lastMessage && this.data.lastMessage.opMember) {
        id = this.data.lastMessage.opMember;
      }
      return this.getAllmanInfo[id] ? (this.getAllmanInfo[id].nickName || this.getAllmanInfo[id].showName || '有人') : '有人'
    }
  }
}
</script>