/* eslint-disable */
// import { Base64 } from 'js-base64';

// 因为ios、android、pc返回的数据格式不对，所以需要适配器

// client: iosApp macApp windowApp androidApp

// 判断是不是新版的app
/**
 * @description: 
 * @param {*} _self
 * @return {*}
 */
const isNew = (_self) => {
  if(_self && _self.CFG.client && _self.CFG.client && _self.CFG.client.clientInfo && _self.CFG.client.clientInfo.bigVersion) {
    return true
  } else {
    return false
  }
}

/**
 * @description: 
 * @param {*} data
 * @return {*}
 */
const dataRecivedConversationChanged = (data) => {
  return data
}

// 格式化会话列表数据
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataMessageList = (data, _self) => {
  if(isNew(_self)) {
    return data.list
  }
  console.log('会话记录 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
      return data.list.map(v => {
        return {
          original: v,
          conversationId: v.conversationID,
          showName: v.showName,
          groupId: v.groupID,
          userId: v.userID,
          faceUrl: v.faceUrl,
          lastMessage: (v.lastMessage && v.lastMessage.textElem && v.lastMessage.textElem.text) || '',
          timestamp: (v.lastMessage && v.lastMessage.timestamp) || '',
          unreadCount: v.unreadCount
        }
      })
    } else if (_self.CFG.client.appType === 'androidApp') {
      return data.conversationList.map(v => {
        return {
          original: v,
          conversationId: v.conversationID,
          showName: v.showName,
          groupId: v.groupID,
          userId: v.userID,
          faceUrl: v.faceUrl,
          lastMessage: (v.lastMessage && v.lastMessage.textElem && v.lastMessage.textElem.text) || '',
          timestamp: (v.lastMessage && v.lastMessage.timestamp) || '',
          unreadCount: v.unreadCount
        }
      })
    } else if (_self.CFG.client.appType === 'windowApp') {
      return data.list.map(v => {
        return {
          original: v,
          ...v
        }
      })
    } else {
      return data
    }
  } catch (e) {
    console.log(e)
    return data
  }
}

// 适配新会话
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataRecivedNewConversation = (data, _self) => {
  try {
    if(LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
      if(isNew(_self)) {
        return data
      }
      if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp' || _self.CFG.client.appType === 'androidApp') {
        return data.map(v => {
          return {
            conversationId: v.conversationID,
            showName: v.showName,
            groupId: v.groupID,
            userId: v.userID,
            faceUrl: v.faceUrl,
            lastMessage: (v.lastMessage && v.lastMessage.textElem && v.lastMessage.textElem.text) || '',
            timestamp: (v.lastMessage && v.lastMessage.timestamp) || '',
            unreadCount: v.unreadCount
          }
        })
      } else if (_self.CFG.client.appType === 'windowApp') {
        return data.map(v => {
          return {
            conversationId: v.conv_id,
            showName: (v.message_sender_profile && v.message_sender_profile.user_profile_nick_name) || '',
            groupId: v.conv_type === 2 ? v.conv_id : '',
            userId: v.conv_type === 1 ? v.conv_id : '',
            faceUrl: '',
            lastMessage: (v.conv_last_msg && v.conv_last_msg.message_elem_array && v.conv_last_msg.message_elem_array[v.conv_last_msg.message_elem_array.length - 1].text_elem_content) || '',
            timestamp: (v.conv_last_msg.message_server_time) || '',
            unreadCount: v.conv_unread_num
          }
        })
      } else {
        return data
      }
    } else {
      return data.map(v => {
        return {
          unreadCount: v.unreadCount,
          conversationId: v.conversationID,
          userId: v.userProfile && v.userProfile.userID || '',
          userName: v.userProfile && v.userProfile.nick || '',
          groupId: v.groupProfile && v.groupProfile.groupID || '',
          groupName: v.groupProfile && v.groupProfile.name || '',
          faceUrl: '',
          timestamp: v.lastMessage && v.lastMessage.lastTime ? v.lastMessage.lastTime * 1000 : '',
          lastMessage: {
            textElem: {
              text: v.lastMessage && v.lastMessage.payload && v.lastMessage.payload.text || ''
            }
          }
        }
      })
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 适配会话新关键信息
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataUpdateConversations = (data, _self) => {
  if(isNew(_self)) {
    return data.list
  }
  console.log('会话关键信息 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp' || _self.CFG.client.appType === 'androidApp') {
      data = data.list;
      return data.map(v => {
        return {
          conversationId: v.conversationID,
          showName: v.showName,
          groupId: v.groupID,
          userId: v.userID,
          faceUrl: v.faceUrl,
          lastMessage: (v.lastMessage && v.lastMessage.textElem && v.lastMessage.textElem.text) || '',
          timestamp: (v.lastMessage && v.lastMessage.timestamp) || '',
          unreadCount: v.unreadCount
        }
      })
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}

// 格式化群信息
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataGroupsInfo = (data, _self) => {
  console.log('群信息 [原始]：', typeof data, data);
  try {
    if(LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
      if(isNew(_self)) {
        return data.list
      }
      if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
        data = data.groupResultList;
        return data.map(v => {
          return {
            id: v.info.groupID,
            showName: v.info.groupName,
            faceUrl: v.info.faceURL
          }
        })
      } else if (_self.CFG.client.appType === 'androidApp') {
        data = data.groupResultList;
        return data.map(v => {
          return {
            id: v.groupInfo.groupID,
            showName: v.groupInfo.groupName,
            faceUrl: v.groupInfo.faceUrl
          }
        })
      } else if (_self.CFG.client.appType === 'windowApp') {
        data = JSON.parse(data);
        return data.map(v => {
          return {
            id: v.get_groups_info_result_info.group_base_info_group_id,
            showName: v.get_groups_info_result_info.group_base_info_group_name,
            faceUrl: v.get_groups_info_result_info.group_base_info_face_url
          }
        })
      } else {
        return data
      }
    } else {
      // web环境
      return data.map(v => {
        console.log('群组信息：', v);
        return {
          id: v.group.groupID,
          showName: v.group.name,
          faceUrl: v.group.faceUrl
        }
      })
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 格式化单人信息
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataUsersInfo = (data, _self) => {  console.log('单人信息 [原始]：', data);
  try {
    if(LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
      if(isNew(_self)) {
        return data.list
      }
      if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
        data = data.list;
        return data.map(v => {
          return {
            id: v.userID,
            showName: v.nickName,
            faceUrl: v.faceURL
          }
        })
      } else if (_self.CFG.client.appType === 'androidApp') {
        data = data.list;
        return data.map(v => {
          return {
            id: v.userID,
            showName: v.nickName,
            faceUrl: v.faceUrl
          }
        })
      } else if (_self.CFG.client.appType === 'windowApp') {
        if (Array.isArray(data)) {
          return data.map(v => {
            return {
              id: v.user_profile_identifier,
              showName: v.user_profile_nick_name,
              faceUrl: v.user_profile_face_url
            }
          })
        } else {
          return []
        }
      } else {
        return data
      }
    } else {
      // web环境
      return data.map(v => {
        return {
          id: v.userID,
          showName: v.nick,
          faceUrl: v.avatar
        }
      })
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 格式化单聊聊天记录
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataC2CHistoryMessageList = (data, _self) => {
  if(isNew(_self)) {
    return data.list
  }
  console.log('单聊消息列表 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
      data = data.msgs;
      return data.map(v => {
        if (v.elemType === 1) {
          return {
            original: v,
            checked: false,
            elemType: 1,
            userId: v.userID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceURL,
            isSelf: v.isSelf,
            lastMessage: (v.textElem && v.textElem.text) || ''
          }
        } else if (v.elemType === 2) {
          // 2021.11.1版之前，数据以JSON返回至extension
          // 2021.11.1版之后，数据以base64加密码返回至data和extension
          let str = '';
          if (v.customElem) {
            if(v.customElem.data) {
              // 如果data节点有内容，说明是新的数据格式，需要解密
              try {
                // str = JSON.parse(Base64.decode(v.customElem.data));
                str = v.customElem.data;
              } catch (e) {
                str = (v.customElem && v.customElem.data) || '';
                console.log('这是一条非预想格式的信息：', str);
              }
            } else if(v.customElem.extension) {
              // 否则则是老版本的数据格式，直接JSON.parse转就行了
              try {
                str = JSON.parse(v.customElem.extension);
              } catch (e) {
                console.log('这是一条非预想格式的信息：', str);
              }
            }
          }
          return {
            original: v,
            elemType: 2,
            userId: v.userID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceURL,
            isSelf: v.isSelf,
            lastMessage: str
          }
        }
      })
    } else if (_self.CFG.client.appType === 'androidApp') {
      data = data.msgs;
      return data.map(v => {
        if (v.elemType === 1) {
          return {
            original: v,
            checked: false,
            elemType: 1,
            userId: v.userID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceUrl,
            isSelf: v.self,
            lastMessage: v.textElem.text
          }
        } else if (v.elemType === 2) {
          let str = '';
          try {
            if (v.customElem && v.customElem.data) {
              // str = JSON.parse(Base64.decode(v.customElem.data));
              str = v.customElem.data;
            }
          } catch (e) {
            str = (v.customElem && v.customElem.data) || '';
            console.log('这是一条非预想格式的信息：', str);
          }
          return {
            original: v,
            elemType: 2,
            userId: v.userID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceUrl,
            isSelf: v.isSelf,
            lastMessage: str
          }
        }
      })
    } else if (_self.CFG.client.appType === 'windowApp') {
      const list = [];
      data.map(v => {
        v.message_elem_array.map(child => {
          if(child.elem_type === 3) {
            list.push({
              original: v,
              elemType: 2,
              message_unique_id: v.message_unique_id,
              userId: v.message_conv_id,
              sender: v.message_sender,
              isSelf: v.message_is_from_self,
              lastMessage: JSON.parse(child.custom_elem_data)
            })
          } else {
            list.push({
              original: v,
              checked: false,
              elemType: 1,
              message_unique_id: v.message_unique_id,
              userId: v.message_conv_id,
              sender: v.message_sender,
              isSelf: v.message_is_from_self,
              lastMessage: child.text_elem_content
            })
          }
        })
      })
      return list
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 格式化群聊聊天记录
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataGroupHistoryMessageList = (data, _self) => {
  if(isNew(_self)) {
    return data.list
  }
  console.log('群聊消息列表 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
      data = data.msgs;
      return data.map(v => {
        if(v.elemType === 9) {
          // 9是群内通知
          return {
            original: v,
            elemType: 9,
            type: v.groupTipsElem && v.groupTipsElem.type,
            userId: v.userID,
            groupId: v.groupID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceURL,
            isSelf: v.isSelf,
            lastMessage: {
              opMember: v.groupTipsElem && v.groupTipsElem.opMember && v.groupTipsElem.opMember.userID
            }
          }
        } else {
          return {
            original: v,
            elemType: 1,
            userId: v.userID,
            groupId: v.groupID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceURL,
            isSelf: v.isSelf,
            lastMessage: v.textElem && v.textElem.text
          }
        }
      })
    } else if (_self.CFG.client.appType === 'androidApp') {
      data = data.msgs;
      return data.map(v => {
        if(v.elemType === 9) {
          // 区分通知种类
          return {
            original: v,
            elemType: 9,
            type: v.groupTipsElem && v.groupTipsElem.type,
            userId: v.userID,
            groupId: v.groupID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceUrl,
            isSelf: v.self,
            lastMessage: {
              opMember: v.groupTipsElem && v.groupTipsElem.opMember && v.groupTipsElem.opMember.userID
            }
          }
        } else {
          return {
            original: v,
            elemType: 1,
            userId: v.userID,
            groupId: v.groupID,
            sender: v.sender,
            showName: v.nickName,
            faceUrl: v.faceUrl,
            isSelf: v.self,
            lastMessage: v.textElem && v.textElem.text
          }
        }
      })
    } else if (_self.CFG.client.appType === 'windowApp') {
      const list = [];
      data.map(v => {
        v.message_elem_array.map(child => {
          if(child.elem_type === 5) {
            let type = '';
            if(child.group_tips_elem_tip_type === 2) {
              // 群信息修改提示
              type = 3;
            } else if(child.group_tips_elem_tip_type === 6) {
              // 群信息修改提示
              type = 7;
            }
            list.push({
              original: v,
              elemType: 9,
              type,
              message_unique_id: v.message_unique_id,
              groupId: v.message_conv_id,
              sender: v.message_sender,
              isSelf: v.message_is_from_self,
              lastMessage: {
                opMember: child.group_tips_elem_op_group_memberinfo && child.group_tips_elem_op_group_memberinfo.group_member_info_identifier
              }
            })
          } else {
            list.push({
              original: v,
              elemType: 1,
              message_unique_id: v.message_unique_id,
              groupId: v.message_conv_id,
              sender: v.message_sender,
              isSelf: v.message_is_from_self,
              lastMessage: child.text_elem_content
            })
          }
        })
      })
      return list
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 格式化新消息来到
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataRecivedC2CTextMessage = (data, _self) => {
  if(isNew(_self)) {
    return data
  }
  console.log('新消息来到 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
      return [{
        original: {
          msgID: data.msgID
        },
        elemType: 1,
        userId: data.info && data.info.userID,
        sender: data.info && data.info.userID,
        isSelf: false,
        lastMessage: data.text
      }]
    } else if (_self.CFG.client.appType === 'androidApp') {
      if (data.customElem) {
        // 自定义消息
        let msg = '';
        try {
          if (data.customElem && data.customElem.data) {
            // msg = JSON.parse(Base64.decode(data.customElem.data));
            msg = data.customElem.data;
          }
        } catch (e) {
          msg = (data.customElem && data.customElem.data) || '';
        }
        return [{
          elemType: 2,
          userId: data.sender.userID,
          sender: data.sender.userID,
          isSelf: false,
          lastMessage: msg
        }]
      } else {
        // 普通消息
        return [{
          original: {
            msgID: data.msgID
          },
          elemType: 1,
          userId: data.sender.userID,
          sender: data.sender.userID,
          isSelf: false,
          lastMessage: data.text
        }]
      }
    } else if (_self.CFG.client.appType === 'windowApp') {
      return data.message_elem_array.map(v => {
        if(v.elem_type === 3) {
          return {
            original: data,
            elemType: 2,
            userId: data.message_sender,
            sender: data.message_sender,
            isSelf: data.message_is_from_self,
            lastMessage: JSON.parse(v.custom_elem_data)
          }
        } else {
          return {
            original: data,
            elemType: 1,
            userId: data.message_sender,
            sender: data.message_sender,
            isSelf: data.message_is_from_self,
            lastMessage: v.text_elem_content
          }
        }
      })
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}
// 格式化群聊新消息
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataRecivedGroupTextMessage = (data, _self) => {
  if(isNew(_self)) {
    return [data]
  }
  console.log('群聊新消息来到 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp' || _self.CFG.client.appType === 'androidApp') {
      return [{
        elemType: 1,
        groupId: data.groupID,
        sender: data.info && data.info.userID,
        isSelf: false,
        nickName: data.info.nickName,
        lastMessage: data.text
      }]
    } else if (_self.CFG.client.appType === 'windowApp') {
      return data.message_elem_array.map(v => {
        // widnows app的elemType比较特殊，所以转成跟ios、android一样，1是普通消息，2是自定义消息
        let type = '';
        if(v.elem_type === 0) {
          type = 1
        } else if(v.elem_type === 5) {
          type = 5
        }
        return {
          elemType: type,
          groupId: data.message_conv_id,
          sender: data.message_sender,
          isSelf: data.message_is_from_self,
          nickName: (data.message_sender_profile && data.message_sender_profile.user_profile_nick_name) || '',
          lastMessage: v.text_elem_content
        }
      })
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}

// 格式化创建群结果
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataCreateGroupWithMemberList = (data, _self) => {
  if(isNew(_self)) {
    return data
  }
  console.log('创建群结果 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp' || _self.CFG.client.appType === 'androidApp' || _self.CFG.client.appType === 'windowApp') {
      return {
        groupId: data.groupID
      }
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}

// 格式化发送群消息结果
/**
 * @description: 
 * @param {*} data
 * @param {*} msg
 * @param {*} _self
 * @return {*}
 */
const formatDataseSdGroupTextMessage = (data, msg, _self) => {
  if(isNew(_self)) {
    return {
      ...data,
      textElem: {
        text: msg
      }
    }
  }
  console.log('发送群消息结果 [原始]：', data);
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
      return [{
        elemType: 1,
        isSelf: true,
        nickName: data.info.nickName || '',
        msgID: new Date().getTime() + parseInt(Math.random() * 1000000),
        lastMessage: msg
      }]
    } else if (_self.CFG.client.appType === 'androidApp') {
      return [{
        elemType: 1,
        isSelf: true,
        nickName: data.nickName || '',
        msgID: new Date().getTime() + parseInt(Math.random() * 1000000),
        lastMessage: msg
      }]
    } else if (_self.CFG.client.appType === 'windowApp') {
      return data.map(v => {
        return {
          elemType: 1,
          isSelf: true,
          nickName: (v.message_sender_profile && v.message_sender_profile.user_profile_nick_name) || '',
          msgID: new Date().getTime() + parseInt(Math.random() * 1000000),
          lastMessage: msg
        }
      })
    } else {
      return data
    }
  } catch (e) {
    console.log('拼装数组出错了：')
    console.log(e)
    return data
  }
}

// 格式化群成员表
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataGroupMemberList = (data, _self) => {
  try {
    if(LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
      if(isNew(_self)) {
        return data
      }
      console.log('群成员列表[原始]', data);
      if(typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp') {
        return {
          nextSeq: data.nextSeq,
          list: data.groupResultList.map(v => {
            return {
              role: v.role,
              userId: v.userID,
              nickName: v.nickName,
              faceUrl: v.faceURL
            }
          })
        }
      } else if (_self.CFG.client.appType === 'androidApp') {
        return {
          nextSeq: data.nextSeq,
          list: data.memberInfoList.map(v => {
            return {
              userId: v.userID,
              nickName: v.nickName,
              faceUrl: v.faceUrl
            }
          })
        }
      } else if (_self.CFG.client.appType === 'windowApp') {
        return {
          nextSeq: data.group_get_memeber_info_list_result_next_seq,
          list: data.group_get_memeber_info_list_result_info_array.map(v => {
            return {
              userId: v.group_member_info_identifier || '',
              nickName: v.group_member_info_nick_name || '',
              faceUrl: v.group_member_info_face_url || '',
            }
          })
        }
      } else {
        return data
      }
    } else {
      return data.map(v => {
        return {
          ...v,
          nickName: v.nick || ''
        }
      });
    }
  } catch (e) {
    console.log('格式化群成员列表数据出现错误')
    console.log(e)
    return data
  }
}
// 格式化发送消息后
/**
 * @description: 
 * @param {*} data
 * @param {*} _self
 * @return {*}
 */
const formatDataSendMessage = (data, _self) => {
  if(isNew(_self)) {
    return data
  }
  try {
    if (_self.CFG.client.appType === 'macApp' || _self.CFG.client.appType === 'iosApp' || _self.CFG.client.appType === 'androidApp') {
      return {
        msgId: data.msgID
      }
    } else if (_self.CFG.client.appType === 'windowApp') {
      if(data && data.length > 0) {
        return {
          ...data[0],
          msgId: data[0].message_conv_id
        }
      } else {
        return {}
      }
    } else {
      return data
    }
  } catch (e) {
    console.log('格式化发送消息数据出现错误')
    console.log(e)
    return data
  }
}

export {
  // 会话列表新消息
  dataRecivedConversationChanged,
  // 格式化会话列表数据
  formatDataMessageList,
  // 格式化新会话
  formatDataRecivedNewConversation,
  // 格式化会话新消息
  formatDataUpdateConversations,
  formatDataGroupsInfo,
  formatDataUsersInfo,
  // 格式化单聊聊天记录
  formatDataC2CHistoryMessageList,
  // 格式化群聊聊天记录
  formatDataGroupHistoryMessageList,
  // 格式新消息来到
  formatDataRecivedC2CTextMessage,
  // 群聊新消息
  formatDataRecivedGroupTextMessage,
  // 格式化创建群结果
  formatDataCreateGroupWithMemberList,
  // 格式化发送群消息幸结果
  formatDataseSdGroupTextMessage,
  // 格式化群成员列表
  formatDataGroupMemberList,
  // 格式化发送消息返回数据
  formatDataSendMessage
}