<template>
    <div v-if="message.elemType === 1" v-html="normalMessage(message.lastMessage || (message.textElem && message.textElem.text))"
      ontouchstart="return false"
      @mousedown="aeDown($event, 'pc')"
      @touchstart="aeDown($event, 'mobile')"
      @mouseup="aeEnd($event, 'pc')"
      @touchend="aeEnd($event, 'mobile')"
    ></div>
    <div v-else-if="message.elemType === 2" 
      ontouchstart="return false"
      @mousedown="aeDown($event, 'pc')"
      @touchstart="aeDown($event, 'mobile')"
      @mouseup="aeEnd($event, 'pc')"
      @touchend="aeEnd($event, 'mobile')"
    >
        <div v-if="message.lastMessage">
            <!--消息日期-->
            <div class="gray mb10" v-if="message.lastMessage.sendTime">{{formatDate(message.lastMessage.sendTime)}}</div>
            <!--文本内容-->
            <div v-if="message.lastMessage.desc" v-html="normalMessage(message.lastMessage.desc)"></div>
            <!--消息内显示的订单号-->
            <div class="flex" v-if="message.lastMessage.type && message.lastMessage.businessNo">
                <div v-if="message.lastMessage.type === '0010'">物流服务单号：</div>
                <div v-else>订单号：</div>
                <div>{{message.lastMessage.businessNo}}</div>
            </div>
            <!--机构名称-->
            <div v-if="message.lastMessage.data && message.lastMessage.data.orgName">
                机构名：{{message.lastMessage.data.orgName}}
            </div>
            <!--跳转按钮-->
            <div class="mt10" v-if="message.lastMessage.type">
                <div class="btn" v-if="msgConfig[message.lastMessage.type]" @click="toMessageLink(message.lastMessage.type, message.lastMessage.data)">{{msgConfig[message.lastMessage.type].title}}</div>
            </div>
        </div>
        <div v-else-if="message.customElem">
            <!--消息日期-->
            <div class="gray mb10" v-if="formatCustomMessage(message).sendTime">{{formatDate(formatCustomMessage(message).sendTime)}}</div>
            <!--文本内容-->
            <div v-html="formatCustomMessage(message).desc"></div>
            <!--订单号-->
            <div v-if="formatCustomMessage(message).data" class="flex">
              <div v-if="formatCustomMessage(message).type === '0010'">物流服务单号：</div>
              <div v-else>订单号：</div>
              <div>{{formatCustomMessage(message).data.businessNo}}</div>
            </div>
            <!--机构名-->
            <div v-if="formatCustomMessage(message).orgName">
              机构名：{{formatCustomMessage(message).orgName}}
            </div>
            <div class="mt10" v-if="formatCustomMessage(message).type">
              <div class="btn" v-if="msgConfig[formatCustomMessage(message).type]" @click="toMessageLink(formatCustomMessage(message).type, formatCustomMessage(message).data)">{{msgConfig[formatCustomMessage(message).type].title}}</div>
            </div>
        </div>
      </div>
      <!--
        TIM音视频通话
      -->
      <div v-else-if="message.elemType === 'TIMCustomElem'">
        {{renderTimData(message.lastMessage)}}
      </div>
</template>

<script>
import {openPage} from "./customerUtils";
import { api as viewerApi } from "v-viewer"

let startTouchTimer;
import msgConfig from '@/common-base/mixins/msg-config'

export default {
    props: ['message'],
    data() {
        return {
            msgConfig: msgConfig,
            images: []
        }
    },
    methods: {
      // 鼠标长按事件
      /**
       * @description: 
       * @return {*}
       */
      aeDown() {
        startTouchTimer = new Date().getTime();
      },
      //鼠标释放时候的函数
      /**
       * @description: 
       * @param {*} event
       * @param {*} client
       * @return {*}
       */
      aeEnd(event, client) {
        if(((LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2() || LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2()) && client === 'mobile') || ((LonchJsApi.isInCef() || LonchJsApi.isInCefV2() || LonchJsApi.isInMacApp() || LonchJsApi.isInMacAppV2()) && client === 'pc')) {
          if(new Date().getTime() - startTouchTimer > 500) {
            this.changSelect();
          } else {
            this.previewImg(event, this.message);
          }
        } else {
          const lastMessage = this.message.lastMessage || '';
          const patterns = [
            { regex: /\[img_lz_s](.*?)\[img_lz_e]/, type: 'image' },
            { regex: /\[video_lz_s](.*?)\[video_lz_e]/, type: 'video' },
            { regex: /\[audio_lz_s](.*?)\[audio_lz_e]/, type: 'audio' },
            { regex: /\[doc_lz_s](.*?)\[doc_lz_e]/, type: 'doc' }
          ];

          for (const pattern of patterns) {
            const match = lastMessage.match(pattern.regex);
            if (match && match[1]) {
              if(pattern.type === 'image') {
                viewerApi({
                  images: [match[1]]
                })
              } else {
                this.openFileUrl(match[1]);
              }
              break;
            }
          }
        }
      },
      openFileUrl(_fileUrl){
        if(_fileUrl) {
          const a = document.createElement('a');
          a.href = _fileUrl + '?_=.zip';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          this.$toast({text: '文件不存在'});
        }
      },
      /**
       * @description: 
       * @param {*} timer
       * @return {*}
       */
      formatDate(timer) {
          return this.utils.formatDate(timer, 'yyyy年MM月dd日 hh:mm')
      },
      // 普通文本消息
      /**
       * @description: 
       * @param {*} text
       * @return {*}
       */
      normalMessage(text) {
        // console.log('text................', text)
        try {
          if(text) {
            text = text.toString();
            text = text.replace(new RegExp(/\[img_lz_s](.*?)\[img_lz_e]/,'g'), '<img src="$1" class="play-img" />');
            text = text.replace(new RegExp(/\[video_lz_s](.*?)\[video_lz_e]/,'g'), `<div class="play-video" data-url="$1">点击播放视频</div>`);
            text = text.replace(new RegExp(/\[audio_lz_s](.*?)\[audio_lz_e]/,'g'), '<div class="play-audio" data-url="$1">点击播放声音</div>');
            text = text.replace(new RegExp(/\[file_lz_s](.*?)\[file_lz_e]/,'g'), '<div class="play-file" data-url="$1">点击下载文件</div>');
            text = text.replace(new RegExp(/\[doc_lz_s](.*?)\[doc_lz_e]/,'g'), '<div class="play-doc" data-url="$1">点击预览文档</div>');
            text = text.replace(new RegExp(/\<a(.*)href=('|")(.*?)('|")\>(.*?)<\/a\>/,'g'), "<a onclick=\"vm.$openLink('$3')\">[$5]</a>");
            return text
          } else {
            return ''
          }
        } catch(e) {
          console.log(e);
          console.log(text)
          return ''
        }
      },
      // 自定义消息
      /**
       * @description: 
       * @param {*} data
       * @return {*}
       */
      formatCustomMessage(data) {
        try {
          let message = data.customElem.data;
          message = JSON.parse(message);
          return message
        } catch(e) {
          console.log(e);
          return {}
        }
      },
      // 预览图片
      // 20230602 IM改造后，这里不仅仅是图片了，还会有链接和400电话
      // 20230602之前之依据class判断链接类型，20230602之后会根据data-来判断链接类型
      /**
       * @description: 
       * @param {*} event
       * @param {*} message
       * @return {*}
       */
      previewImg($event, message) {
        const type = $event.target.className;
        const dataset = $event.target.dataset;
        const url = $event.target.getAttribute('data-url');
        let msg = '';
        if(message.lastMessage) {
          msg = message.lastMessage;
        } else if(message.textElem) {
          msg = message.textElem.text || '';
        }
        if(type === 'play-img') {
          if(msg) {
            const regex = new RegExp(/\[img_lz_s](.*?)\[img_lz_e]/,'g');
            const imgs = msg.match(regex);
            if(imgs && imgs.length > 0) {
                const arr = [];
                imgs.map(v => {
                  arr.push(v.replace(new RegExp(/\[img_lz_s](.*?)\[img_lz_e]/,'g'), '$1'));  
                });
                // ImagePreview(arr);
                console.log(arr);
            }
          }
        } else if(type === 'play-video') {
          this.openFile(2, url);
        } else if(type === 'play-audio') {
          this.openFile(1, url);
        } else if(type === 'play-file') {
          this.openFile(3, url);
        } else if(type === 'play-doc') {
          this.openFile(3, url);
        } else if(dataset.phone) {
          if(LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2 || LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2){
            const _args = {
              phone: dataset.phone
            };
            this.API.send(this.CFG.services.im.callTel, _args, function () {
            }, function () {
            }, this, true)
          }
        } else if(dataset.link) {
          this.openUrl(dataset.link, $event.target.innerText);
        }
      },
      // 打开文件
      /**
       * @description: 
       * @param {*} type
       * @param {*} url
       * @return {*}
       */
      openFile(type, url) {
        const _self = this;
        _self.API.send(_self.CFG.services.im.openChatFile, {
          type: type,
          fileUrl: url
        }, function () {
        }, function () { }, _self, true)
      },
      // 去修改密码
      /**
       * @description: 
       * @param {*} url
       * @param {*} name
       * @return {*}
       */
      openUrl(url, name) {
        if(url) {
          const domain = this.getSubDomain(url);
          const path = this.getPath(url);
          if(domain && path) {
            openPage(this, domain, `${path}?appName=`+ this.CFG.project.name +'&showTBar=1', '{}', (name || ''), true, true);
          }
        }
      },
      // 获取domain
      /**
       * @description: 
       * @param {*} url
       * @return {*}
       */
      getSubDomain(url) {
        const regex = /https?:\/\/([^\.]+)\./g;
        const result = regex.exec(url);
        return result[1];
      },
      // 获取path
      /**
       * @description: 
       * @param {*} url
       * @return {*}
       */
      getPath(url) {
        const urlArr = url.split("#");
        return urlArr[1]
      },
      // 跳转系统消息链接
      /**
       * @description: 
       * @param {*} type
       * @param {*} data
       * @return {*}
       */
      toMessageLink(type, data) {
        let url = msgConfig[type].url;
        const title = msgConfig[type].title;
        if(data && data.id) {
          url = url.replace(/\$\{.*\}/g, data.id);
        }
        let toUrl = this.utils.transformationMachedVersion(url, this.CFG.versionConfig);
        if(LonchJsApi.clientType === 'windowApp') {
            location.href = `${url}`;
        } else {
            this.API.send(this.CFG.services.im.cmdAppOpenUrl, { 
              url: toUrl,
              title: title,
              query: {},
              isBackTitleBar: true,
              config: {
                  isBackTitleBar: true,
                  animated: false
              }
            }, function () { }, function () { }, this, true);
        }
      },
      /**
       * 音视频
       */
      renderTimData(lastMessage) {
        try {
          const message = JSON.parse(lastMessage);
          const data = JSON.parse(message.data);
          if(data.call_type === 2) {
            if(data.data.cmd === 'hangup') {
              return '[结束视频通话]';
            } else if(message.actionType === 1) {
              return '[拨打视频通话]';
            } else if(message.actionType === 2) {
              return '[取消通话]';
            } else if(message.actionType === 3) {
              return '[接听视频通话]';
            } else if(message.actionType === 4) {
              return '[拒绝视频通话]';
            } else if(message.actionType === 5) {
              return '[超时未接听]';
            } else {
              return '[未知]';
            }
          } else {
            if(data.data.cmd === 'hangup') {
              return '[结束音频通话]';
            } else if(message.actionType === 1) {
              return '[拨打音频通话]';
            } else if(message.actionType === 2) {
              return '[取消通话]';
            } else if(message.actionType === 3) {
              return '[接听音频通话]';
            } else if(message.actionType === 4) {
              return '[拒绝音频通话]';
            } else if(message.actionType === 5) {
              return '[超时未接听]';
            } else {
              return '[未知]';
            }
          }
        } catch(e) {
          return '[未知]';
        }
      }
    }
}
</script>

<style lang="scss">
.lonch-i-message {
  //color: #3a65ab;
}
.lonch-i-message-btns {
  display: flex;
}
.lonch-i-message-link {
  margin-right: 10px;
  color: #3a65ab;
}
</style>