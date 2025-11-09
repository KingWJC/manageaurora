<template>
  <div ref="list" class="list">
    <div v-for="(item) in chats" :key="item.msgID">
      <div class="p20 tac gray" v-if="item.elemType === 9">
        <!--9:系统消息-->
        <!-- {{renderUserName(item)}}已退出群聊 -->
        <SysEdin :data="item" />
      </div>
      <div v-else>
        <!--
          渲染普通消息的时间
        -->
        <div v-if="renderTimestamp(item)" class="b8 tac fs-s mt20 secondary">{{renderTimestamp(item)}}</div>
        <div class="item flex flex-items-center">
          <!--普通消息-->
          <!-- <van-checkbox v-if="getIsSelect" v-model="item.checked"></van-checkbox> -->
          <div class="item flex-flex-auto flex flex-content-start flex-items-start" :class="[item.isSelf ? 'right' : 'left']">
            <!--
              用户头像
            -->
            <div class="head">
              <Head></Head>
            </div>
            <!--
              聊天气泡
            -->
            <div class="bubble">
              <!--
                聊天气泡箭头
              -->
              <span><em></em></span>
              <!--
                聊天气泡框
              -->
              <Message :message="item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
消息组件
*/
import Message from './message'
/*
系统消息组件
*/
import SysEdin from './sysEdin.vue'
/*
头像组件
*/
import Head from './head'
export default {
  components: {
    Message,
    SysEdin,
    Head
  },
  props: ['chats'],
  data() {
    return {
    }
  },
  computed: {
    renderHead() {
      return function(item) {
        if(item.sender && this.getAllmanInfo[item.sender] && this.getAllmanInfo[item.sender].faceUrl) {
          return `${this.getAllmanInfo[item.sender].faceUrl}?x-oss-process=image/format,jpg/resize,limit_0,m_fill,w_100,h_100`
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    /**
     * @description: 
     * @return {*}
     */
    getIsSelect() {
      return true
    },
    /**
     * @description: 
     * @return {*}
     */
    getAllmanInfo() {
      return true
    },
    // 根据用户ID渲染用户名
    /**
     * @description: 根据用户ID渲染用户名
     * @param {*} item
     * @return {*}
     */
    renderUserName(item) {
      const id = item.lastMessage.opMember;
      return this.getAllmanInfo[id] ? (this.getAllmanInfo[id].showName || '有人') : '有人'
    },
    // 渲染消息时间
    /**
     * @description: 
     * @param {*} item
     * @return {*}
     */
    renderTimestamp(item) {
      if(item && item.timestamp) {
        let timer = String(item.timestamp);
        return this.utils.formatDate(timer.length > 10 ? item.timestamp : item.timestamp * 1000, 'yyyy年MM月dd日 hh:mm:ss')
      } else {
        return ''
      }
    },
    /**
     * @description: 
     * @param {*} item
     * @return {*}
     */
    goPersonInfo(item) {
      const { sender, faceUrl, nickName } = item;
      this.$router.push({
        path: '/main/singleInfo',
        query: {
          userId: sender || '',
          faceUrl: faceUrl || '',
          nickName: nickName || '',
        },
      })
    },
    /**
     * @description: 
     * @param {*} type
     * @param {*} uri
     * @return {*}
     */
    view(type, uri) {
      if (type === 'image') {
        this.$imageView(uri);
      } else if (type === 'video') {
        this.$videoView(uri);
      } else if (type === 'audio') {
        this.$audioView(uri);
      } else if (type === 'redPacket') {
        this.$redPacket(uri)
      }
    },
    /**
     * @description: 
     * @param {*} item
     * @return {*}
     */
    renderMessageText(item) {
      try {
        if(item.lastMessage) {
          let _str = (item.lastMessage).replace(/ /g, '&nbsp;');
          const _reg = new RegExp('\\[img_lz_s].*\\[img_lz_e\\]$');
          _str = _str.replace(_reg, '');
          return _str
        } else {
          return '&nbsp;';
        }
      } catch(e) {
        return '&nbsp;';
      }
    },
    // 渲染时间
    /**
     * @description: 
     * @param {*} timer
     * @return {*}
     */
    renderLastMessageTime(timer) {
      try {
        if (!timer) {
          return '--'
        }
        const _timer = new Date(Number(timer));
        const _now_date = new Date();
        if (_now_date.getTime() - _timer.getTime() < 180000) {
          // 3分钟以内
          return '刚刚'
        } else if (_now_date.getFullYear() === _timer.getFullYear() && _now_date.getMonth() === _timer.getMonth() && _now_date.getDate() === _timer.getDate()) {
          // 今天
          return this.utils.formatDate(_timer, 'hh:mm')
        } else if (_now_date.getFullYear() === _timer.getFullYear() && _now_date.getMonth() === _timer.getMonth() && _now_date.getDate() - _timer.getDate() === 1) {
          // 昨天
          return `昨天 ${this.utils.formatDate(_timer, 'hh:mm')}`
        } else if (_now_date.getFullYear() === _timer.getFullYear()) {
          // 今年
          return this.utils.formatDate(_timer, 'MM月dd日 hh:mm')
        } else {
          // 往年
          return this.utils.formatDate(_timer, 'yy年MM月dd日')
        }
      } catch (e) {
        return '--';
      }
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss" scoped>
.list {
  overflow: hidden;
  .item {
    margin: 10px;
    &.left {
      .bubble {
        margin-left: 10px;
        background: #ede9e8;
        border: #ede9e8 1px solid;
        z-index: 1;
        position: relative;
        &.red {
          span {
            border-color: transparent #ff9900 transparent transparent;
          }
          em {
            border-color: transparent #ff9900 transparent transparent;
          }
        }
        span {
          display: block;
          width: 0;
          height: 0;
          border-width: 10px 10px 10px 0;
          border-style: solid;
          border-color: transparent #ede9e8 transparent transparent;
          position: absolute;
          top: 10px;
          left: 0;
          margin-left: -10px;
        }
        em {
          display: block;
          width: 0;
          height: 0;
          border-width: 10px 10px 10px 0;
          border-style: solid;
          border-color: transparent #ede9e8 transparent transparent;
          position: absolute;
          top: -10px;
          left: 1px;
        }
      }
    }
    &.right {
      flex-direction: row-reverse;
      justify-content: end;
      .bubble {
        margin-right: 10px;
        background: #9db5cf;
        border: #9db5cf 1px solid;
        color: #ffffff;
        z-index: 1;
        position: relative;
        &.red {
          span {
            border-color: transparent transparent transparent #ff9900;
          }
          em {
            border-color: transparent transparent transparent #ff9900;
          }
        }
        span {
          display: block;
          width: 0;
          height: 0;
          border-width: 10px 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent transparent #9db5cf;
          position: absolute;
          top: 10px;
          right: 0;
          margin-right: -10px;
        }
        em {
          display: block;
          width: 0;
          height: 0;
          border-width: 10px 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent transparent #9db5cf;
          position: absolute;
          top: -10px;
          right: 1px;
        }
      }
    }
    .bubble {
      word-break: break-all;
      padding: 10px;
      border-radius: 4px;
      line-height: 1.75em;
      min-width: 80px;
      min-height: 40px;
      &.red {
        color: #ffffff;
        background: #ff9900;
        border: none;
        i {
          color: #cc0000;
        }
        .text {
          margin-left: 10px;
        }
      }
      ::v-deep img {
        max-width: 160px;
        min-height: 2em;
        display: block;
      }
      .img {
        max-width: 150px;
        z-index: 1;
        position: relative;
        .iconfont {
          z-index: 1;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          font-size: 2rem;
        }
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    .head {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
</style>