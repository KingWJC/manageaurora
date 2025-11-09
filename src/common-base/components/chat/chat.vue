<template>
  <div class="chat-box flex flex-column flex-content-between">
    <div class="lonch-chat-header">
      <div class="lonch-chat-header-btn secondary" @click="back">返回</div>
      <div
        class="lonch-chat-header-btn-right secondary"
        @click="closeChatWindow()"
      >
        关闭
      </div>
      <div class="flex-flex-auto">
        {{ renderUserName() }}
      </div>
    </div>
    <div
      class="chat-content ofh"
      @click="clickContent"
      ref="chatContent"
      style="
        background: url('https://resources.lonch.com.cn/ybd/image/20240409-chat-bg-01.png?v=3');
        background-size: 50%;
      "
    >
      <Chat ref="chat" :chats="message"></Chat>
    </div>
    <!--
      没有客服
    -->
    <!--
      <div class="chat-footer-btns flex p10" v-if="params.id !== 'servicenotice'">
        <div v-if="getIsSelect" class="flex flex-1">
          <div class="chat-footer-btns-btn btn-red flex flex-items-center fs-m mr10" @click="toDelChat">
            <van-icon name="delete-o" class="mr5" />
            删除记录
          </div>
          <div class="chat-footer-btns-btn flex flex-items-center fs-m" @click="changSelect(false)">
            取消
          </div>
        </div>
        <div v-else class="flex">
        <div class="chat-footer-btns-btn fs-m" @click="isShowServicer = true" v-if="!groupId && userId && userId !== 'administrator'">
          <i class="iconfont icon-al-kefu fs-sm" />
          申请客服介入
        </div>
        </div>
      </div>
    -->
    <div class="chat-footer" v-if="params.id !== 'servicenotice'">
      <div class="chat-footer-inp flex flex-content-between flex-items-center">
        <!-- +号不打开 -->
        <!--
        <div class="more-box flex flex-content-center flex-items-center">
          <div class="icon flex flex-content-center flex-items-center" :class="[isAnim && moreType === '' ? (isShowMore ? 'anim-rotate-show': 'anim-rotate-hide') : '']" @click="showMore">
            <i class="iconfont icon-al-jia" />
          </div>
        </div>
        -->
        <div class="inp-box flex flex-items-center ml10">
          <div class="inp">
            <input
              type="text"
              ref="chatInp"
              @click="onClkInp"
              @blur="onBlurInp"
              @keyup="messageSendlisten"
            />
          </div>
          <div class="mr10">
            <el-popover
              v-model="isCallVisible"
              placement="bottom"
              width="200"
              trigger="click">
              <div>
                <el-button class="full-width" icon="el-icon-phone-outline" @click="callUser(1)">音频通话</el-button>
              </div>
              <div class="mt5">
                <el-button class="full-width" icon="el-icon-video-camera" @click="callUser(2)">视频通话</el-button>
              </div>
              <div slot="reference">
                <img
                  src="https://resources.lonch.com.cn/ybd/image/20240612-videoicon.png?v=101"
                />
              </div>
            </el-popover>
          </div>
          <!--
          <i class="iconfont" :class="[isShowMore && moreType === 'expression' ? 'icon-al-jianpan' : 'icon-al-biaoqing']" @click="showExpression" />
          -->
          <Upload
            :bucket="oss.bucket"
            :basePath="oss.basePath"
            :region="oss.region"
            :dir-name="oss.dirName"
            :maxSize="104857600"
            label="+选择文件"
            @uploaded="fileUploader"
          >
            <img
              src="https://resources.lonch.com.cn/ybd/image/chat-filesuffix-setfile.png"
            />
          </Upload>
        </div>
        <div class="send-box flex" v-if="inpContext || true">
          <div
            class="btn flex flex-content-center flex-items-center"
            @click="send"
          >
            发送
          </div>
        </div>
        <!--其它按钮也先隐藏-->
        <!--
        <div class="file-box flex" v-else>
          <div class="icon">
            <i class="iconfont icon-al-paizhao" />
          </div>
          <div class="icon">
            <i class="iconfont icon-al-yuyin" />
          </div>
        </div>
        -->
      </div>
      <div
        class="chat-footer-more flex flex-wrap"
        :class="[isHideMoreAnmia ? 'anim-hide' : 'anim-show']"
        v-if="isShowMore"
      >
        <!--更多选项-->
        <!--
        <div
          class="chat-footer-more-emoji flex flex-wrap"
          v-if="moreType === 'expression'"
        >
          <div
            class="chat-footer-more-emoji-item flex flex-content-center"
            v-for="item in Array.from({ length: 40 }, (v, k) => k)"
            :key="item"
          >
            <img
              src="https://emoji.emojipic.cn/pic/72/apple/grinning-face_1f600.png"
            />
          </div>
        </div>
        -->
        <!-- 表情 -->
        <!--
        <div class="chat-footer-more-box flex flex-wrap" v-else>
          <div
            class="chat-footer-more-box-item flex flex-column flex-content-center flex-items-center"
            v-for="item in iconList"
            :key="item.name"
          >
            <div
              class="icon flex flex-content-center flex-items-center"
              @click="item.click(this)"
            >
              <i
                class="iconfont"
                :class="[item.source]"
                :style="{ color: item.color }"
              >
              </i>
            </div>
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
        -->
      </div>
      <van-popup v-model="isShowServicer" position="bottom">
        <!-- <Service @onSet="setService" /> -->
      </van-popup>
    </div>
  </div>
</template>

<script>
import TIM from 'tim-js-sdk';
import { mapMutations } from 'vuex';
import BScroll from 'better-scroll';
// import { throttle } from '@/lonchComponents/scroll/util'
import { iconList } from './base';
import Chat from './components/index.vue';
import Upload from '../upload';
// import Service from '@/components/pubComponents/service'
import Dial from './components/dial.vue'
import {
  formatDataUsersInfo,
  formatDataC2CHistoryMessageList,
  formatDataGroupHistoryMessageList,
  formatDataRecivedC2CTextMessage,
  formatDataRecivedGroupTextMessage,
  formatDataCreateGroupWithMemberList,
  formatDataSendMessage
} from './data.js';
export default {
  mixins: [Dial],
  components: {
    Chat,
    Upload
    // Service
  },
  props: ['params'],
  data() {
    const _self = this;
    return {
      isMounted: false,
      // 进入页面的时候，不要显示动画，展开过更多后，才显示动画
      isAnim: false,
      isHideMoreAnmia: false,
      // 是否打开更多
      isShowMore: false,
      // 更多类型？表情or操作
      moreType: '',
      timerSage: null,
      height: 0,
      // 定时器
      timer: null,
      iconList: iconList(this),
      // 消息列表容器
      scroll: null,
      // 输入中
      isInping: false,
      // 输入文字
      inpContext: '',
      // 聊天
      detail: {},
      // 会话ID
      id: _self.params.id || '',
      // 聊天对象用户ID
      userId: _self.params.userId || '',
      groupId: _self.params.groupId || '',
      name: _self.params.name || '',
      // 群ID
      oss: Object.assign(
        {
          dirName: '/message'
        },
        this.OSSCFG
      ),
      isShowServicer: false,
      tim: null,
      toUserId: '',
      sensitiveWords: '',
      message: [],
      isCallVisible: false,
    };
  },
  computed: {},
  methods: {
    ...mapMutations([
      'unshiftChats',
      'pushChats',
      'addReadyFuns',
      'setUserInfo',
      'setAllmanInfo',
      'deleteChat',
      'changSelect'
    ]),
    /**
     * @description:
     * @return {*}
     */
    renderUserName() {
      return window.chatExample.chatPartnerUserName;
    },
    /**
     * @description:
     * @return {*}
     */
    back() {
      this.$emit('back');
    },
    /**
     * @description: 关闭聊天窗口
     * @return {*}
     */
    closeChatWindow() {
      this.$emit('close');
    },
    // 底部弹层
    /**
     * @description:
     * @return {*}
     */
    showFooterModal() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.isShowMore) {
        this.isHideMoreAnmia = true;
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.isShowMore = false;
          this.refreshChat();
        }, 300);
      } else {
        this.isAnim = true;
        this.isHideMoreAnmia = false;
        this.isShowMore = true;
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.refreshChat();
        }, 300);
      }
    },
    // 打开更多
    /**
     * @description:
     * @return {*}
     */
    showMore() {
      if (this.moreType === 'expression') {
        this.moreType = '';
        if (!this.isShowMore) {
          this.showFooterModal();
        }
      } else {
        this.showFooterModal();
      }
      this.$nextTick(() => {
        this.refreshChat();
      });
    },
    // 打开表情
    /**
     * @description:
     * @return {*}
     */
    showExpression() {
      if (this.moreType === '') {
        this.moreType = 'expression';
        if (!this.isShowMore) {
          this.showFooterModal();
        }
      } else {
        this.showFooterModal();
      }
      this.$nextTick(() => {
        this.refreshChat();
      });
    },
    /**
     * @description:
     * @return {*}
     */
    clickContent() {
      // 点击内容区时收起「更多」
      // 并刷新滚动区域
      this.isShowMore = false;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    /**
     * @description:
     * @return {*}
     */
    onClkInp() {
      const _self = this;
      _self.isInping = true;
      _self.$nextTick(() => {
        _self.scroll.refresh();
        _self.scroll.scrollTo(0, _self.scroll.maxScrollY, 300);
      });
    },
    /**
     * @description:
     * @return {*}
     */
    onBlurInp() {
      this.isInping = false;
    },
    /**
     * @description:
     * @param {*} e
     * @return {*}
     */
    messageSendlisten(e) {
      if (e.keyCode === 13) {
        this.send();
      } else {
        this.inpContext = this.$refs.chatInp.value;
      }
    },
    // 初始化/刷新信息列表，并决定要不要滚动到最底部
    /**
     * @description:
     * @param {*} type
     * @return {*}
     */
    refreshChat(type = '') {
      const _self = this;
      if (!_self.scroll) {
        // 初始化scroll
        _self.scroll = new BScroll(_self.$refs.chatContent, {
          scrollbar: true,
          click: true,
          // mouseWheel: _self.CFG.client.appType == "windowApp" || _self.CFG.client.appType == "webApp" || _self.CFG.client.appType == "macApp",
          mouseWheel: true,
          pullDownRefresh: true
        });
        _self.scroll.on('scrollEnd', () => {
          _self.scroll.refresh();
        });
        _self.scroll.on('pullingDown', () => {
          _self.getMessageList();
        });
        _self.scroll.scrollTo(0, _self.scroll.maxScrollY, 300);
      } else {
        // 刷新scroll
        _self.scroll.refresh();
        if (type === 'last') {
          _self.scroll.scrollTo(0, _self.scroll.maxScrollY, 300);
        }
      }
    },
    // 发送消息
    /**
     * @description:
     * @return {*}
     */
    send() {
      if (!this.$refs.chatInp.value) {
        return;
      }
      const _message = this.$refs.chatInp.value;
      this.inpContext = '';
      this.$refs.chatInp.value = '';
      this.sendMessage(_message);
    },
    // 发送消息
    /**
     * @description:
     * @param {*} text
     * @return {*}
     */
    sendMessage(text = '') {
      const _self = this;
      if (!text) {
        return;
      }
      if (!LonchJsApi.isInApp()) {
        let message = this.$TIM.createTextMessage({
          to: window.chatExample.chatPartnerUserId,
          conversationType: TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text
          },
          // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
          needReadReceipt: true
          // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
          // cloudCustomData: 'your cloud custom data'
        });
        this.$TIM.sendMessage(message);

        const _obj = {
          original: {
            to: window.chatExample.chatPartnerUserId,
            conversationType: TIM.TYPES.CONV_C2C,
            // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
            // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
            // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
            payload: {
              text
            },
            // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
            needReadReceipt: true
            // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
            // cloudCustomData: 'your cloud custom data'
          },
          elemType: 1,
          sender: _self.params.userId,
          userID: _self.params.userId,
          isSelf: true,
          msgID: `${new Date().getTime()}${parseInt(Math.random() * 1000000)}`,
          lastMessage: text,
          timestamp: new Date().getTime()
        };
        _self.message.push(_obj);
        _self.$nextTick(() => {
          // 发送消息后，刷新消息布局
          this.refreshChat('last');
        });

        return;
      }
      const _alone_arg = {
        userID: _self.userId,
        text
      };
      const _group_arg = {
        groupID: _self.groupId,
        text
      };
      const _arg = _self.groupId ? _group_arg : _alone_arg;
      const _url = _self.groupId
        ? this.CFG.services.im.sendGroupTextMessage
        : this.CFG.services.im.sendC2CTextMessage;
      _self.API.send(
        _url,
        { ..._arg },
        function (res) {
          // console.log('发送成功', res.serviceResult)
          const data = formatDataSendMessage(res.serviceResult, _self);
          // console.log('发送成功（格式化）', data)
          // 将发送的消息拼装并插入到消息列表最后一条
          const _obj = {
            original: {
              ...data,
              msgID: data.msgId
            },
            elemType: 1,
            sender: _self.getUserInfo.userId,
            userID: _arg.userID,
            isSelf: true,
            msgID: `${new Date().getTime()}${parseInt(
              Math.random() * 1000000
            )}`,
            lastMessage: text,
            timestamp: new Date().getTime()
          };
          console.log('消息发送成功：', JSON.stringify(_obj));
          _self.unshiftChats([_obj]);
          _self.$nextTick(() => {
            // 发送消息后，刷新消息布局
            this.refreshChat('last');
          });
        },
        function (e) {
          console.log(e);
          this.$message({
            type: 'info',
            message: '消息发送产生错误'
          });
        },
        this,
        true
      );
    },
    // 获取消息列表
    /**
     * @description:
     * @param {*} type
     * @return {*}
     */
    getMessageList(type = '') {
      if (this.params.groupId) {
        this.getGroupHistoryMessageList(type);
      } else {
        this.getHistoryMessageList(type);
      }
    },
    // 获取单聊消息列表
    /**
     * @description:
     * @param {*} type
     * @return {*}
     */
    getHistoryMessageList(type = '') {
      const _self = this;
      if (LonchJsApi.isInApp()) {
        const _arg = {
          conversationID: _self.id,
          userID: _self.userId,
          userId: _self.userId,
          count: 20,
          lastMsg:
            _self.getChats[0] && _self.getChats[0].original
              ? _self.getChats[0].original
              : _self.getChats[0] || {}
        };
        console.log('准备去获取单聊记录...', _arg);
        this.API.send(
          this.CFG.services.im.getC2CHistoryMessageList,
          { ..._arg },
          function (res) {
            res = res.serviceResult;
            const list = formatDataC2CHistoryMessageList(res, _self);
            console.log('单聊消息列表 [格式化]：', list);
            // 获取聊天记录里的用户信息
            _self.getConversationInfo(list);
            _self.pushChats(list.filter((v) => v.userId === _self.userId));
            _self.$nextTick(() => {
              // 创建scroll实例 或 刷新scroll视图
              _self.refreshChat(type);
              // 继续可以下拉刷新、上拉加载
              _self.scroll && _self.scroll.finishPullDown();
            });
          },
          function () {},
          this,
          true
        );
      } else {
        let promise = this.$TIM.getMessageList({
          conversationID: window.chatExample.conversationId
        });
        promise.then(function (imResponse) {
          const messageList = imResponse.data.messageList; // 消息列表。
          // const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          // const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
          console.log('messageList:', messageList);
          _self.message = messageList.map((v) => {
            if(v.type === "TIMCustomElem") {
              return {
                elemType: 'TIMCustomElem',
                sender: v.from,
                isSelf: v.from !== window.chatExample.chatPartnerUserId,
                nickName: v.nick,
                lastMessage: v.payload.data
              };
            } else {
              return {
                elemType: 1,
                sender: v.from,
                isSelf: v.from !== window.chatExample.chatPartnerUserId,
                nickName: v.nick,
                lastMessage: v.payload.text
              };
            }
          });
          _self.$nextTick(() => {
            /*
            刷新scroll，并滑动到最底部
            */
            _self.refreshChat('last');
          });
        });
      }
    },
    // 获取群聊消息列表
    /**
     * @description:
     * @param {*} type
     * @return {*}
     */
    getGroupHistoryMessageList(type = '') {
      const _self = this;
      const _arg = {
        groupID: _self.params.groupId,
        count: 20,
        lastMsg:
          _self.getChats[0] && _self.getChats[0].original
            ? _self.getChats[0].original
            : _self.getChats[0] || {}
      };
      this.API.send(
        this.CFG.services.im.getGroupHistoryMessageList,
        { ..._arg },
        function (res) {
          res = res.serviceResult;
          const list = formatDataGroupHistoryMessageList(res, _self);
          console.log('群聊消息列表 [格式化]：', list);
          _self.getConversationInfo(list);
          _self.pushChats(
            list.filter((v) => v.groupId === _self.params.groupId)
          );
          _self.$nextTick(() => {
            // 创建scroll实例 或 刷新scroll视图
            _self.refreshChat(type);
            // 继续可以下拉刷新、上拉加载
            _self.scroll && _self.scroll.finishPullDown();
          });
        },
        function (e) {
          console.log(e);
        },
        this,
        true
      );
    },
    // 获取本地用户数据
    /**
     * @description:
     * @return {*}
     */
    getLocalUserInfo() {
      const _self = this;
      _self.API.send(
        _self.CFG.services.im.getLocalUserInfo,
        {},
        async function (res) {
          res = res.serviceResult;
          if (res.userId) {
            console.log('获取到我的信息：', JSON.stringify(res));
            console.log('获取到的用户ID：', res.userId);
            // 记录我自己的信息
            _self.setUserInfo(res);
            // 以我自己的id去查询详情用户信息，存到store里面
            _self.getUsersInfo(res.userId);
          }
        },
        function () {},
        _self,
        true
      );
    },
    // 根据userId获取用户信息
    /**
     * @description:
     * @param {*} id
     * @return {*}
     */
    getUsersInfo(id) {
      const _self = this;
      if (_self.getAllmanInfo[id]) {
        return;
      }
      const _arg = {
        userIDList: Array.isArray(id) ? id : [id]
      };
      _self.API.send(
        _self.CFG.services.im.getUsersInfo,
        { ..._arg },
        function (res) {
          res = res.serviceResult;
          const list = formatDataUsersInfo(res, _self);
          if (list) {
            _self.setAllmanInfo(list);
          }
        },
        function () {
          console.log('获取这个ID报错了：', id);
        },
        _self,
        true
      );
    },
    /**
     * @description:
     * @param {*} list
     * @return {*}
     */
    getConversationInfo(list) {
      const _self = this;
      const argsUser = {
        userIDList: []
      };
      list.map((v) => {
        // 获取发送人ID
        if (!_self.getAllmanInfo[v.sender]) {
          if (!argsUser.userIDList.includes(v.sender)) {
            argsUser.userIDList.push(v.sender);
          }
        }
        // 获取系统通知操作人
        if (v.lastMessage && v.lastMessage.opMember) {
          if (!_self.getAllmanInfo[v.lastMessage.opMember]) {
            if (!argsUser.userIDList.includes(v.lastMessage.opMember)) {
              argsUser.userIDList.push(v.lastMessage.opMember);
            }
          }
        }
      });
      if (argsUser.userIDList.length > 0) {
        _self.API.send(
          _self.CFG.services.im.getUsersInfo,
          argsUser,
          function (res) {
            try {
              res = res.serviceResult;
              const list = formatDataUsersInfo(res, _self);
              console.log('单人信息 [格式化]：', list);
              if (list) {
                _self.setAllmanInfo(list);
              }
            } catch (e) {
              console.log(e);
            }
          },
          function () {},
          _self
        );
      }
    },
    // windowApp的个人资料是通过监听返回的
    /**
     * @description:
     * @param {*} payload
     * @return {*}
     */
    windowGetUsersInfo(payload) {
      const res = payload.serviceResult;
      this.setAllmanInfo(formatDataUsersInfo(res, this));
    },
    /**
     * @description:
     * @param {*} event
     * @return {*}
     */
    fileUploader($event) {
      const fileNameArr = $event.Location.split('.');
      const suffix = fileNameArr[fileNameArr.length - 1].toLowerCase();
      if (
        [
          'mp4',
          'mkv',
          'mpg',
          'avi',
          'mov',
          'qt',
          'asf',
          'rm',
          'ogg',
          'mod'
        ].includes(suffix)
      ) {
        this.sendMessage(`[video_lz_s]${$event.Location}[video_lz_e]`);
      } else if (
        ['mp3', 'acm', 'aif', 'aif', 'aiff', 'asp', 'asx', 'au'].includes(
          suffix
        )
      ) {
        this.sendMessage(`[audio_lz_s]${$event.Location}[audio_lz_e]`);
      } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(suffix)) {
        this.sendMessage(`[img_lz_s]${$event.Location}[img_lz_e]`);
      } else if (['rar', 'zip', '7z'].includes(suffix)) {
        this.$message({ message: '不支持这种格式的文件' });
        // this.sendMessage(`[file_lz_s]${$event.Location}[file_lz_e]`);
      } else {
        this.sendMessage(`[doc_lz_s]${$event.Location}[doc_lz_e]`);
      }
    },
    // 创建群聊
    /**
     * @description:
     * @param {*} data
     * @return {*}
     */
    async createGroupWithMemberList(data) {
      // console.log('缓存所有人资料', this.getAllmanInfo)
      // console.log('创建群的用户：', data);
      const _self = this;
      // _self.$loading();
      // 群头像
      let faceURL = '';
      // 群名称
      let groupName = '';
      // 群成员列表
      const _users = [];
      // 群成员名称列表
      const _names = [];
      try {
        // 成员信息
        data.map((v) => {
          _users.push({
            role: 0,
            userID: v.userId
          });
          _names.push(v.showName);
        });
        // [我]的信息
        _users.push({
          role: 0,
          userID: _self.getUserInfo.userId
        });
        _names.unshift(
          _self.getAllmanInfo[_self.getUserInfo.userId].showName ||
            _self.getAllmanInfo[_self.getUserInfo.userId].nickName ||
            ''
        );
        groupName = _names.join(',');
        if (groupName.length > 10) {
          groupName = groupName.substr(0, 10);
        }
      } catch (e) {
        console.log(e);
      }
      try {
        faceURL = await createHead(
          this,
          _names.map((item) => {
            if (item === '客服') {
              return item;
            } else if (item) {
              return item.charAt(0);
            } else {
              return '';
            }
          })
        );
      } catch (e) {
        console.log(e);
      }
      console.log('头像url:::', faceURL);
      const _arg = {
        info: {
          faceURL: '',
          groupID: '',
          groupType: 'Work',
          groupName,
          Introduction: ''
        },
        memberList: _users
      };
      _self.API.send(
        _self.CFG.services.im.createGroupWithMemberList,
        { ..._arg },
        function (res) {
          res = res.serviceResult;
          console.log('创建群 [原始]:', res);
          const groupInfo = formatDataCreateGroupWithMemberList(res, _self);
          _self.$message({ message: '已创建群聊' });
          _self.isShowServicer = false;
          // id要变成群id
          _self.id = `group_${groupInfo.groupId}`;
          _self.userId = '';
          _self.groupId = groupInfo.groupId;
          _self.name = groupName;
          _self.$loading.hide();
          // _self.clearChats();
        },
        function () {
          _self.$loading.hide();
          _self.$message({
            type: 'error',
            message: '创建群失败'
          });
          console.log('创建群的参数：', _arg);
        },
        _self,
        true
      );
    },
    // 返回
    /**
     * @description:
     * @return {*}
     */
    appback() {
      console.log('侦测到返回');
      this.$routerHistory.goBack(this);
    },
    // 滚动到页面最底部
    /**
     * @description:
     * @return {*}
     */
    toLastScroll() {
      setTimeout(() => {
        console.log('即将滚动到最底部');
        this.refreshChat('last');
      }, 1000);
    },
    // 选中客服
    /**
     * @description:
     * @return {*}
     */
    // setService() {
    //   // console.log(item)
    //   const arr = [];
    //   // 当前聊天对象的id
    //   arr.push({
    //     userId: this.params.userId,
    //     showName: this.params.name
    //   });
    //   // 选择的客服id
    //   arr.push({
    //     // userId: item.id,
    //     // showName: '客服'
    //     userId: 'administrator',
    //     showName: '小i服务'
    //   });
    //   // throttle(this.createGroupWithMemberList, 300, arr);
    // },
    // 设置消息已读
    /**
     * @description:
     * @return {*}
     */
    readMessage() {
      const _self = this;
      const _args = {
        userID: _self.userId
      };
      console.log('设置消息已读：', _args);
      _self.API.send(
        _self.CFG.services.im.markC2CMessageAsRead,
        { ..._args },
        function () {},
        function () {},
        _self,
        true
      );
    },
    // 去群资料
    /**
     * @description:
     * @return {*}
     */
    toGroupInfo() {
      this.$router.push({
        path: '/main/groupInfo',
        query: {
          id: this.id,
          groupId: this.groupId
        }
      });
    },
    // 删除聊天
    /**
     * @description:
     * @return {*}
     */
    toDelChat() {
      const _self = this;
      const messages = [];
      if (this.getChats && Array.isArray(this.getChats)) {
        this.getChats.map((v) => {
          if (v.checked) {
            messages.push(v.original || v);
          }
        });
      }
      // console.log('准备删除这些：', messages)
      const args = {
        conversationId: this.params.id,
        conversationType: this.params.groupId ? 2 : 1,
        messages
      };
      _self.API.send(
        this.CFG.services.im.deleteMessages,
        args,
        function (res) {
          if (res && res.serviceResult) {
            this.$message({ message: '已删除聊天记录' });
            this.deleteChat();
            this.changSelect(false);
            this.$nextTick(() => {
              this.refreshChat();
            });
          }
        },
        function (e) {
          console.log(e);
          this.$message({ message: '删除失败' });
        },
        this
      );
    },
    // 向用户下发服务消息
    /**
     * @description:
     * @return {*}
     */
    giveUserServiceInfo() {
      if (this.userId === 'servicenotice') {
        this.unshiftChats([
          {
            msgId: LonchJsApi.UUID(32, 16),
            elemType: 1,
            isSelf: false,
            sender: 'servicenotice',
            textElem: {
              text: `<div class="lonch-i-message">
                    <div class="lonch-i-message-hello">您好，在线人工客服工作时间为 8:00 - 22:00。</div>
                        <div class="lonch-i-message-btns">
                          <div class="lonch-i-message-link" data-link="https://woacs.lonch.com.cn/index.html#/signfor/index">物流查询</div>
                          <div class="lonch-i-message-link" data-link="https://customer-service.lonch.com.cn/index.html#/main/forgetPassword">重置密码</div>
                        </div>
                        <div class="lonch-i-phone">客服电话：<span data-phone="4006209199">4006209199</span></div>
                    </div>`
            }
          }
        ]);
        this.$nextTick(() => {
          this.scroll.scrollTo(0, this.scroll.maxScrollY - 10, 300);
        });
      }
    },
    // 去聊天对象的个人信息
    /**
     * @description:
     * @return {*}
     */
    goPersonInfo() {
      this.$router.push({
        path: '/main/singleInfo',
        query: {
          id: this.params.id,
          userId: this.params.userId,
          // notMe表示是对方的个人信息，可以删除这个聊天
          type: 'notMe'
        }
      });
    },
    // 监听
    // 单聊监听
    /**
     * @description:
     * @param {*} payload
     * @return {*}
     */
    recivedC2CTextMessage(payload) {
      const _self = this;
      const list = formatDataRecivedC2CTextMessage(
        payload.serviceResult,
        _self
      );
      console.log('新消息来到 [格式化]：', list);
      // 清除未读消息
      if (this.$refs['chatContent']) {
        this.$TIM.setMessageRead({
          conversationID: window.chatExample.conversationId
        });
      }
      /*
      if (Array.isArray(list)) {
        _self.readMessage();
        _self.getConversationInfo(list);
        _self.unshiftChats(
          list.filter((v) => v.userId === _self.params.userId)
        );
      } else {
        if (list.userId === _self.params.userId) {
          _self.unshiftChats([list]);
        }
      }
      */
      if (Array.isArray(list)) {
        list.forEach((v) => {
          this.message.push(v);
        });
      }
      _self.$nextTick(() => {
        _self.refreshChat('last');
      });
    },
    // 群聊监听
    /**
     * @description:
     * @param {*} payload
     * @return {*}
     */
    recivedGroupTextMessage(payload) {
      console.log('新群聊消息：', payload);
      const _self = this;
      const list = formatDataRecivedGroupTextMessage(
        payload.serviceResult,
        _self
      );
      console.log('群聊新消息来到 [格式化]：', list);
      _self.getConversationInfo(list);
      _self.unshiftChats(
        list.filter((v) => v.groupId === _self.params.groupId)
      );
      _self.$message({
        type: 'success',
        message: '您有新的消息'
      });
      _self.$nextTick(() => {
        _self.refreshChat('last');
      });
    },
    renderOptions() {
      if (
        this.CFG.env.VUE_APP_MODE === 'dev' ||
        this.CFG.env.VUE_APP_MODE === 'test'
      ) {
        return this.devOptions;
      } else {
        return this.options;
      }
    },
    // 获取敏感词
    /**
     * @description:
     * @return {*}
     */
    getSensitiveWords() {
      this.API.send(
        this.CFG.services.appClient.broadcastQuerySensitiveWords,
        {},
        function (res) {
          if (res && res.data) {
            const result = res.data;
            if (result.sensitiveWords) {
              this.sensitiveWords = result.sensitiveWords.split(',');
            }
          }
        },
        function () {},
        this
      );
    },
  },
  created() {
    const _self = this;
    console.log('进入聊天界面，地址栏参数：', JSON.stringify(_self.params));
    _self.userId = window.chatExample.chatPartnerUserName;
    if (LonchJsApi.isInApp()) {
      // 监听
      LonchJsApi.bindMsgHandlers({
        cmdAppBack: _self.appback,
        keyboardChange: _self.toLastScroll,
        recivedC2CTextMessage: _self.recivedC2CTextMessage,
        recivedGroupTextMessage: _self.recivedGroupTextMessage,
        getUsersInfo: _self.windowGetUsersInfo
      });
    } else {
      window.chatExample.MESSAGE_RECEIVED_CALLBACKS[LonchJsApi.UUID()] = {
        fn: _self.recivedC2CTextMessage,
        that: _self,
        params: null
      };
    }
  },
  async mounted() {
    const _self = this;
    console.log('当前是：', _self.params.groupId ? '群聊' : '单聊');
    // 清空聊天内容
    // _self.clearChats();
    // 刷新滚动视图
    this.refreshChat();
    /*
    // 获取[我]的用户信息
    _self.getLocalUserInfo();
    // 获取对方的信息
    if(!this.params.groupId && (this.params.id || this.params.userId)) {
      _self.getUsersInfo(this.params.userId || this.params.id);
    }
    _self.isMounted = true;
    */
    _self.getMessageList('last');
    /*
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.giveUserServiceInfo();
    }, 600);
    */
    /*
    if(!LonchJsApi.isInApp()) {
      this.getSensitiveWords();
    }
    */
  },
  beforeDestroy() {
    const _self = this;
    // _self.readMessage();
    // android返回键监听
    LonchJsApi.unBindMsgHandlers({
      cmdAppBack: _self.appback,
      keyboardChange: _self.toLastScroll,
      recivedC2CTextMessage: _self.recivedC2CTextMessage,
      recivedGroupTextMessage: _self.recivedGroupTextMessage
    });
  }
};
</script>

<style scoped>
.anim-show {
  animation: show 0.3s ease 0s 1 normal;
  animation-fill-mode: forwards;
}
.anim-hide {
  animation: hide 0.3s ease 0s 1 normal;
  animation-fill-mode: forwards;
}
.anim-rotate-show {
  animation: rotate_show 0.3s ease 0.3s 1 normal;
  animation-fill-mode: forwards;
}
.anim-rotate-hide {
  animation: rotate_hide 0.6s ease 0s 1 normal;
  animation-fill-mode: forwards;
}
@keyframes show {
  0% {
    max-height: 0;
  }
  100% {
    max-height: 3rem;
  }
}
@keyframes hide {
  0% {
    max-height: 3rem;
  }
  100% {
    max-height: 0;
  }
}
@keyframes rotate_show {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(45deg);
  }
}
@keyframes rotate_hide {
  0% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

<style lang="scss" scoped>
.chat {
  &-box {
    height: 100%;
  }
  &-header {
    border-bottom: #dddddd 1px solid;
    background: #ffffff;
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: flex;
    &-btns {
      .icon {
        margin-right: 10px;
        width: 24px;
        i {
          font-size: 1.714285714285714rem;
        }
      }
    }
  }
  &-footer {
    border-top: #dddddd 1px solid;
    &-inp {
      height: 56px;
      &-more {
        border-top: #dddddd 1px solid;
        background: #f9f9f9;
        padding: 20px 0;
        &-item {
          width: 6.696428571428571rem;
          text-align: center;
        }
      }
      .more-box {
        margin: 0 10px;
        flex-shrink: 0;
        .icon {
          border-radius: 1rem;
          width: 24px;
          height: 24px;
          background: #96bfcf;
          i {
            color: #ffffff;
            font-size: 1rem;
          }
        }
      }
      .inp-box {
        flex: 1;
        border-radius: 8px;
        border: #ddd 1px solid;
        padding: 0 10px;
        height: 40px;
        .inp {
          flex: 1;
          overflow: hidden;
          input {
            width: 100%;
            height: 30px;
            border: 0;
            font-size: 1rem;
            outline: none;
          }
        }
        i {
          font-size: 24px;
        }
        img {
          display: block;
          width: 30px;
          height: 30px;
        }
      }
      // 多媒体按钮列表
      .file-box {
        margin-left: 10px;
        .icon {
          margin-right: 10px;
          width: 24px;
          i {
            font-size: 2rem;
          }
        }
      }
      // 发送按钮
      .send-box {
        margin: 10px;
        width: 58px;
        flex-shrink: 0;
        .btn {
          font-size: 1rem;
          flex: 1;
          background: #96bfcf;
          border-radius: 4px;
          border: none;
          color: #ffffff;
          height: 40px;
        }
      }
    }
    &-more {
      border-top: #ddd 0.01rem solid;
      background: #f9f9f9;
      overflow: hidden;
      &-emoji {
        padding: 10px 10px 0 10px;
        &-item {
          width: 2.535714285714286rem;
          padding-bottom: 10px;
          img {
            display: block;
            width: 24px;
            height: 24px;
          }
        }
      }
      &-box {
        padding-bottom: 20px;
        &-item {
          margin: 20px 0 0 0;
          width: 25%;
          text-align: center;
          font-size: 1rem;
          line-height: 2rem;
          .icon {
            width: 48px;
            height: 48px;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            background: #ffffff;
            i {
              font-size: 2rem;
            }
          }
          .text {
            margin-top: 10px;
            line-height: 20px;
          }
        }
      }
    }
  }
  &-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }
}
.service {
  &-frame {
    z-index: 9;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.15);
  }
  &-box {
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    width: 240px;
  }
  &-list {
    background: #fff;
    overflow-y: scroll;
    height: 240px;
    &-item {
      border-top: #eee 1px solid;
    }
  }
}
</style>
