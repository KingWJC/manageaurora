<!--
 * @Date: 2024-04-06 14:47:14
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-06-12 15:40:11
 * @FilePath: \lonch-rxv-fe\src\common-base\components\chat\message.vue
 * @Description: 
-->
<template>
  <div id="lonchChatMessageEntry" class="chat-message-box">
    <!--
      头部消息入口
    -->
    <div class="mr10 lonch-chat-entry" @click="openChatWindow()">
      <div class="lonch-chat-entry-logo" v-if="unreadMessageCount > 0">
        <!--
          消息大于99的话，显示99+
        -->
        {{ unreadMessageCount > 99 ? '99+' : unreadMessageCount }}
      </div>
      <i class="el-icon-chat-dot-square lonch-chat-entry-icon"></i>
    </div>
    <div
      id="lonchChatMessagePopup"
      class="chat-message-list-frame"
      v-if="isOpenMore"
    >
      <div class="chat-message-list-box-border">
        <div class="chat-message-list-box">
          <div class="full-height" v-if="showDiv">
            <!--
              聊天界面
            -->
            <Chat
              :params="{}"
              @back="showDiv = false"
              @close="isOpenMore = false;showDiv = false"
            ></Chat>
          </div>
          <div v-else>
            <!--
              会话列表
            -->
            <div class="chat-message-list">
              <div class="lonch-chat-header">
                <div class="flex-flex-auto">聊天记录</div>
                <div class="lonch-chat-header-btn-right secondary" @click="isOpenMore = false">关闭</div>
              </div>
              <div
                class="chat-message-list-item"
                v-for="item in conversation"
                :key="item.sender"
                @click="setMessageForUser(item)"
              >
                <!--
                  头像
                -->
                <Head :userId="item.sender"></Head>
                <div class="flex-flex-auto ml10 ofh">
                  <div
                    class="chat-message-list-item-unread-message-count"
                    v-if="item.unreadCount > 0"
                  >
                    {{ item.unreadCount }}
                  </div>
                  <div class="flex flex-content-between">
                    <!--
                      聊天对象姓名
                    -->
                    <div>
                      {{ item.nickName }}
                    </div>
                    <!--
                      消息时间
                    -->
                    <div class="secondary">
                      {{ chatUtils('renderLastMessageTime', item) }}
                    </div>
                  </div>
                  <!--
                    最后一条消息内容
                  -->
                  <div class="secondary ellipsis">
                    {{ renderMessage(item.lastMessage) || '--' }}
                  </div>
                </div>
              </div>
              <!--
                空消息提示
              -->
              <div class="p50 tac secondary" v-if="conversation.length === 0">
                没有消息
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
聊天界面组件
*/
import Chat from './chat';
/*
头像组件
*/
import Head from './components/head';
/*
聊天样式
*/
import './style/common.scss';
/*
聊天工具类
*/
import WebChatUtils from './webChat'

export default {
  components: {
    Chat,
    Head
  },
  data() {
    return {
      // 是否打开了聊天弹窗
      isOpenMore: false,
      // 会话列表
      conversation: [],
      // 聊天对象用户ID
      chatPartnerUserId: '',
      showDiv: false,
      // 未读消息数
      unreadMessageCount: 0
    };
  },
  watch: {
    showDiv(newValue) {
      if (!newValue && window.chatExample.isReady) {
        this.queryConversation();
      }
    }
  },
  methods: {
    /**
     * 打开聊天弹窗，并申请摄像头权限
     */
    openChatWindow() {
      this.isOpenMore = true;
      if(LonchJsApi.isInSimpleApp()) {
        const args = {
          permissionList: ['android.permission.CAMERA']
        };
        this.API.send(
          {'command': 'cmdApplySystemPermission'},
          args,
          function () {},
          function () {},
          this,
          true
        );
      }
    },
    /**
     * @description: 聊天工具类操作
     * @param {*} action 要执行的操作
     * @param {*} item 会话
     * @return {*}
     */
    chatUtils(action, item) {
      if(WebChatUtils[action]) {
        return WebChatUtils[action](item);
      } else {
        return 'The function is empty.';
      }
    },
    /**
     * @description: 消息里如果收到特殊标签的消息，因为无法展示，怎么转成文字
     * @param {*} text
     * @return {*}
     */
    renderMessage(text) {
      if(text && typeof text === 'string') {
        text = text.replace(new RegExp(/\[img_lz_s](.*?)\[img_lz_e]/,'g'), '[图片]');
        text = text.replace(new RegExp(/\[video_lz_s](.*?)\[video_lz_e]/,'g'), `[视频]`);
        text = text.replace(new RegExp(/\[audio_lz_s](.*?)\[audio_lz_e]/,'g'), '[声音]');
        text = text.replace(new RegExp(/\[file_lz_s](.*?)\[file_lz_e]/,'g'), '[文件]');
        text = text.replace(new RegExp(/\[doc_lz_s](.*?)\[doc_lz_e]/,'g'), '[文件]');
      }
      return text || '';
    },
    /**
     * @description: 选中聊天对象
     * @return {*}
     */
    setMessageForUser(item) {
      // 聊天对象用户ID
      window.chatExample.chatPartnerUserId = item.sender;
      // 聊天对象昵称
      window.chatExample.chatPartnerUserName = item.nickName;
      // 存储会话ID
      window.chatExample.conversationId = item.conversationId;
      /*
      设置跳转到聊天界面
      */
      this.showDiv = true;
      // 将某会话下所有未读消息已读上报
      this.$TIM.setMessageRead({ conversationID: item.conversationId });
    },
    /**
     * @description: 获取会话列表
     * @return {*}
     */
    queryConversation() {
      if(window.chatExample.isReady) {
        const _self = this;
        let promise = this.$TIM.getConversationList();
        promise
          .then(function (imResponse) {
            const conversationList = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
            // const isSyncCompleted = imResponse.data.isSyncCompleted; // 从云端同步会话列表是否完成
            // console.log('会话列表:', conversationList);
            let total = 0;
            _self.conversation = conversationList.map((v) => {
              total = total + v.unreadCount || 0;
              return {
                // 发送方userId
                sender: v.userProfile.userID,
                // 会话ID
                conversationId: v.conversationID,
                // 聊天对象姓名
                nickName: v.userProfile.nick,
                // 最后一条消息的发送时间
                timestamp:  v.lastMessage.lastTime,
                // 最后一条消息内容
                lastMessage: v.lastMessage.payload.text,
                // 未读消息数量
                unreadCount: v.unreadCount,
              };
            });
            _self.unreadMessageCount = total;
          })
          .catch(function (imError) {
            console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
          });
      }
    },
    /**
     * @description: 获取未读数量
     * @return {*}
     */
    queryUnreadMessageCount() {
      let totalUnreadCount = this.$TIM.getTotalUnreadMessageCount();
      console.log('totalUnreadCount:::', totalUnreadCount);
    },
    /**
     * @description: 初始化聊天
     * @return {*}
     */
    initChat() {
      this.queryConversation();
      // this.queryUnreadMessageCount();
    }
  },
  created() {
    const _self = this;
    // TIM是否已准备好？
    if (window.chatExample.isReady) {
      // TIM已准备好，就可以拉取会话列表，和未读总数
      this.initChat();
    } else {
      // TIM未准备好，则将拉取会话列表和未读总数的方法放到回调里面
      window.chatExample.READY_CALLBACKS[LonchJsApi.UUID()] = {
        fn: this.initChat,
        that: this,
        params: null
      }
    }
    // 未读消息回调
    window.chatExample.UNREADMESSAGECOUNT_CALLBACKS[LonchJsApi.UUID()] = {
      fn: function(data) {
        // 写未读消息数
        _self.unreadMessageCount = data;
        // 更新会话列表
        _self.queryConversation();
      },
      that: this,
      params: null
    }
    // 发起聊天回调
    window.chatExample.INITIATE_CHAT_CALLBACKS[LonchJsApi.UUID()] = {
      fn: function() {
        _self.isOpenMore = true;
        _self.showDiv = true;
      },
      that: this,
      params: null
    }
  },
  mounted() {
    const _self = this;
    // 添加点击事件监听器到整个页面
    // document.addEventListener(
    //   'click',
    //   function (event) {
    //     // 获取弹层元素
    //     const chatPopup = document.getElementById('lonchChatMessagePopup');
    //     const chatEntry = document.getElementById('lonchChatMessageEntry');
    //     // 检查点击的元素是否在弹层之外
    //     if (
    //       chatPopup &&
    //       event.target !== chatPopup &&
    //       !chatPopup.contains(event.target) &&
    //       event.target !== chatEntry &&
    //       !chatEntry.contains(event.target) &&
    //       !event.target.closest('#lonchChatMessagePopup')
    //     ) {
    //       _self.isOpenMore = false;
    //     }
    //   },
    //   true
    // );
  }
};
</script>

<style lang="scss" scoped>
.chat-message-box {
  z-index: 1;
  position: relative;
}
.chat-message-list {
  &-frame {
    z-index: 1;
    position: fixed;
    top: 0px;
    right: 0;
    width: 480px;
    max-width: 100%;
    height: 100%;
  }
  &-box {
    width: 100%;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.24);
    border-radius: 8px;
    &-border {
      padding: 10px;
      height: 100%;
      background-color: rgba(0,0,0,0.15);
    }
  }
  &-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: #ddd 1px solid;
    line-height: 25px;
    z-index: 1;
    position: relative;
    &:hover {
      background: #f9f9f9;
    }
    &-unread-message-count {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 40px;
      color: #ffffff;
      background: #ff0000;
      font-size: 14px;
      font-weight: bold;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      line-height: 24px;
      text-align: center;
      user-select: none;
      box-shadow: 0 0 6px rgba(255, 0, 0, 0.25);
      transform: scale(0.5);
    }
  }
}
</style>
