/*
 * @Date: 2024-04-02 11:35:46
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-04-10 14:49:57
 * @FilePath: \lonch-rxv-fe\src\common-base\components\chat\webChat.js
 * @Description:
 */

import utils from '@/common-base/utils/utils';

/**
 * @description: 过滤关键词
 * @return {*}
 */
function filterText(text, sensitiveWords) {
  if (sensitiveWords && text) {
    if (sensitiveWords.length > 0) {
      sensitiveWords.map((v) => {
        text = text.replace(new RegExp(v, 'g'), '****');
      });
    }
  }
  return text;
}

/**
 * @description: chat的工具方法
 * @return {*}
 */
const chatUtils = {
  /**
   * @description: 过滤消息（此处会收到很多消息，只接收当前聊天对象发过来的消息）
   * @return {*}
   */
  filterMessage: (event, userId) => {
    if (event.data && event.data.length > 0) {
      if(userId) {
        return event.data.filter(v => v.sender === userId);
      } else {
        return event.data;
      }
    } else {
      return [];
    }
  },
  /**
   * @description: 将IM收到的消息，转为我们定义好的格式
   * @return {*}
   */
  formatMessage: (data, sensitiveWords) => {
    /*
    拼装返回的报文数据格式
    （与APP返回的一致）
    */
    const messagePayload = {
      serviceResult: []
    };
    const msg = {
      serviceResult: {}
    };
    /*
    遍历消息
    （只取第一个，其它的消息抛弃）
    （与APP一致，因为收到的消息都是一条一条的）
    */
    data.forEach((element) => {
      if (element && element.payload && element.payload.text) {
        // 消息体的文本
        msg.conversationId = element.conversationID;
        msg.elemType = 1;
        // 群展示的id是接收方
        msg.groupId = element.conversationType === 'GROUP' ? element.to : '';
        // 个人展示的id是发送方
        msg.userId = element.conversationType === 'C2C' ? element.from : '';
        msg.sender = element.from;
        msg.isSelf = false;
        msg.lastMessage = filterText(
          element.payload.text,
          sensitiveWords
        );
        msg.nickName = element.nick;
        msg.userName = element.name || element.nick;
        messagePayload.serviceResult.push(msg);
      }
    });
    return messagePayload;
  },
  /**
   * @description: 渲染消息时间
   * @param {*} item
   * @return {*}
   */
  renderLastMessageTime(item) {
    try {
      let timestamp = '';
      // 新的im协议，第一次发版还需要兼容老的
      if(item.lastMessage && item.lastMessage.timestamp) {
        timestamp = item.lastMessage.timestamp;
      } else {
        timestamp = item.timestamp;
      }
      if (!timestamp) {
        return '--'
      }
      let _timer;
      if(timestamp < 2524579200) {
        _timer = new Date(1000 * timestamp);
      } else {
        _timer = new Date(1* timestamp);
      }
      const _now_date = new Date();
      if (_now_date.getTime() - _timer.getTime() < 180000) {
        // 3分钟以内
        return '刚刚'
      } else if (_now_date.getFullYear() === _timer.getFullYear() && _now_date.getMonth() === _timer.getMonth() && _now_date.getDate() === _timer.getDate()) {
        // 今天
        return utils.formatDate(_timer, 'hh:mm')
      } else if (_now_date.getFullYear() === _timer.getFullYear() && _now_date.getMonth() === _timer.getMonth() && _now_date.getDate() - _timer.getDate() === 1) {
        // 昨天
        return `昨天 ${utils.formatDate(_timer, 'hh:mm')}`
      } else if (_now_date.getFullYear() === _timer.getFullYear()) {
        // 今年
        return utils.formatDate(_timer, 'MM月dd日 hh:mm')
      } else {
        // 往年
        return utils.formatDate(_timer, 'yy年MM月dd日')
      }
    } catch (e) {
      console.log(e)
      console.log(item)
      return '--';
    }
  }
};
export default chatUtils;
