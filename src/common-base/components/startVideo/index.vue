<template>
  <div ref="startVideoContext" class="start-video-context" :class="{'start-video-context-black' : isHaveAd}">
    <div class="start-video-countdown flex flex-content-end" v-if="isHaveAd">
      <div class="start-video-countdown-btn" @click.stop="switchSound">
        <img src="https://resources.lonch.com.cn/ybd/image/20250807-icon-volumecross.png" alt="" v-if="isMute" />
        <img src="https://resources.lonch.com.cn/ybd/image/20250807-icon-volumehigh.png" alt="" v-else />
      </div>
      <div class="start-video-countdown-btn" @click.stop="close">跳过 {{ remainder }} s</div>
    </div>
    <!-- Swiper 容器 -->
    <div class="swiper-container">
      <div class="swiper-wrapper" v-if="videoList && videoList.length">
        <!-- 每个 Slide 是一个视频 -->
        <swiper-item
          v-for="(video, index) in videoList" :key="index"  class="swiperslide swiper-slide my-swiper-container">
          <div class="video-container" >
            <!-- 使用 vue-video-player 播放视频 -->
            <video-player
              class="video-player vjs-custom-skin"
              :ref="'videoPlayer' + index"
              :options="playerOptions"
              :playsinline="true"
              :loop="false"
              @ready="onPlayerReady($event, index)"
              @ended="onPlayerEnded(index)"
              @timeupdate="onPlayerTimeupdate($event)"
              v-if="currentIndex > index - 2 && currentIndex < index + 2"
            ></video-player>
          </div>
          <div class="video-model" @click="toLink(video)"></div>
        </swiper-item>
      </div>
    </div>
    <!--二维码-->
    <div class="video-model-qrcode" v-if="showQrcode">
      <img class="video-model-qrcode-img" :src="showQrcode" alt="" srcset="">
      <div class="video-model-qrcode-close" @click="closeQrCode">
        <icon name="close"></icon>
      </div>
    </div>
  </div>
</template>

<script>
// 接口配置
import commonApiConfig from '../../config/common-api-config';
// 轮播图
import Swiper from 'swiper/bundle';
// 轮播图样式
// import 'swiper/css/swiper.css'; // Swiper 5.x 的样式文件
// Vue 2 的 video-player 组件
import { videoPlayer } from 'vue-video-player';
// video-player样式
import 'video.js/dist/video-js.css'

export default {
  components: {
    videoPlayer,
  },
  data() {
    return {
      // 是否在播放开屏广告？是的话背景是黑色的
      isHaveAd: false,
      // 当前是否静音
      isMute: true,
      // 短视频列表
      videoList: [],
      defaultPayBg: "",
      swiper: null,
      playerOptions: {
        // 禁止自动播放（iOS 限制）
        autoplay: false,
        // 是否显示控件
        controls: false,
        controlBar: {
            remainingTimeDisplay: false,
            fullscreenToggle: false  //全屏按钮
        },
        muted: true, 
        playsinline: true, // iOS 内联播放
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      },
      // 当前播放的视频索引
      currentIndex: 0,
      // 已经播放结束的视频索引
      playEndIndex: 0,
      currentPage: 1,
      isLoading: false,
      // 请求接口数据页码
      page: {
        current: 1,
        rowCount: 10,
      },
      // 定时器sn
      timer: '',
      // 二维码
      showQrcode: '',
      // 当前记录的播放记录
      historyPlayRecordId: null,
      // 倒计时
      remainder: '',
      startCountdownTimer: null,
      // 各产品的开屏广告频道列表
      productChannelId: {
        production: {
          // 药发采
          yaofacai: '17556714632880000000099416000001',
          // 朗致销客
          xiaoke: '17556608513770000000099411000001',
          // 第二药房S
          secondpharmacys: '17556608532680000000099416000001',
          // 朗致云服
          manage: '17556608549830000000099411000001',
          // 致医优氧
          oxygentherapy: '17556608564950000000099411000001',
          // 逆时舱
          reversetimecapsule: '17556608581890000000099416000001',
          // 致医EDC
          edc: '17556608601450000000099411000001',
          // 云屏S
          telescreen: '17556608625320000000099411000001',
          // 致医云诊室S
          angelswings: '17556608646620000000099411000001',
          // 致医云管家S
          cloudsteward: '17556608665580000000099411000001',
        },
        test: {
          // 药发采
          yaofacai: '17540325132170000000025673000001',
          // 朗致销客
          xiaoke: '17543871360890000000025673000001',
          // 第二药房S
          secondpharmacys: '17543871580390000000025673000001',
          // 朗致云服
          manage: '17543872457350000000025673000001',
          // 致医优氧
          oxygentherapy: '17543872474800000000025673000001',
          // 逆时舱
          reversetimecapsule: '17543872902060000000025673000001',
          // 致医EDC
          edc: '17543873125840000000025673000001',
          // 云屏S
          telescreen: '17543873441720000000025673000001',
          // 致医云诊室S
          angelswings: '17543873879770000000025673000001',
          // 致医云管家S
          cloudsteward: '17543874126640000000025673000001',
        },
      }
    };
  },
  mounted() {
    //绑定app消息通知事件
    LonchJsApi.bindMsgHandlers({
      appSendDataToH5: this.handleMsgFromApp,
    });
    // 先判断需不需要展示开屏广告
    if(LonchJsApi.isInApp() && LonchJsApi.isInAppV2()) {
      this.fullStartVideo(() => {
        // 初始获取短视频列表
        this.getDataVideos(true);
      });
    } else {
      // 非APP环境下直接退出
      this.close();
    }
  },
  beforeDestroy() {
    LonchJsApi.timeout.destroyTimeout(this.timer);
    //解绑消息监听
    LonchJsApi.unBindMsgHandlers({
      appSendDataToH5: this.handleMsgFromApp,
    });
  },
  methods: {
    /**
     * 键盘事件
     */
    handleMsgFromApp(res) {
      const result = res && res.serviceResult || {};
      const type = result.type;
      const msg = result.msg;
      if(type === '2001') {
        const keyword = Number(msg);
        if(keyword === 6) {
          // 返回
          this.close();
        }
        if(keyword === 1) {
          // 上
          if(this.swiper) {
            this.swiper.slidePrev();
          }
        }
        if(keyword === 2) {
          // 下
          if(this.swiper) {
            this.swiper.slideNext();
          }
        }
      }
    },
    /**
     * 当前频道ID
     */
    channelId() {
      const environment = this.productChannelId[this.CFG.env.VUE_APP_MODE] || this.productChannelId.test;
      return environment[this.CFG.appName] || '';
    },
    /**
     * 获取缓存的状态
     */
    getCacheData(key) {
      return new Promise((resolve) => {
        this.utils.getDataCache(key, (res) => {
          resolve(res || '');
        }, this.CFG, this);
      })
    },
    /**
     * 是否展示全屏广告
     * 每个自然日只展示一次，通过localstorage获取
     */
    async fullStartVideo(callback) {
      const key = `${this.CFG.appName}StartAdVideoLast`;
      let startAdVideoLast;
      // 获取localStorage存储的时间戳
      if(LonchJsApi.isInCef() || LonchJsApi.isInCefV2()) {
        startAdVideoLast = await this.getCacheData(key);
      } else {
        startAdVideoLast = window.localStorage.getItem(key);
      }
      // 将时间戳转换成为数字
      const startAdVideoLastTimer = Number(startAdVideoLast);
      if(new Date().getTime() - startAdVideoLastTimer > 24 * 60 * 60 * 1000) {
        this.isShowFullStartVideo = true;

        if(LonchJsApi.isInCef() || LonchJsApi.isInCefV2()) {
          this.utils.setDataCache(key, new Date(new Date().toLocaleDateString()).getTime());
        } else {
          window.localStorage.setItem(key, new Date(new Date().toLocaleDateString()).getTime());
        }

        if(callback && typeof callback === 'function') {
          callback();
        }
      } else {
        this.close();
      }
    },
    /**
     * 关闭开屏广告
     */
    close() {
      this.$emit('close');
    },
    /**
     * 切换声音显示
     */
    switchSound() {
      this.isMute = !this.isMute;
      const currentPlayer = this.$refs['videoPlayer' + this.currentIndex][0].player;
      if(currentPlayer) {
        currentPlayer.muted(this.isMute);
      }
    },
    /**
     * 去SaaS周边详情页
     * @param item 
     */
    toLink(item) {
      const _self = this;
      // 判断是否是网页的正则
      const urlRegex = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
      if(item.externalWechatApp && item.externalWechatCode) {
        if (LonchJsApi.isInApp() && LonchJsApi.isInAppV2()) {
          if(LonchJsApi.isInMacApp() || LonchJsApi.isInMacAppV2() || LonchJsApi.isInCef() || LonchJsApi.isInCefV2()){
            // 桌面端展示二维码
            this.showQrcode = item.externalWechatCode;
            this.playPause();
          } else {
            this.API.send({command: 'appPay'}, {type: 'getDeviceInfo'}, function (res) {
              let deviceInfo = res.serviceResult;
              //判断是否安装微信,或者在小程序中
              if (deviceInfo.isWXAppInstalled) {
                let args = {
                  type: "doAppPay",
                  payType: "5",
                  userName: item.externalWechatApp,
                  path: item.externalLink
                }
                this.API.send({command: 'appPay'}, args, function () {}, function () {}, this);
                // 关闭开屏广告
                this.close();
              } else {
                this.$dialog.alert({
                  message: '跳转微信小程序失败，原因您未安装微信。',
                  confirmButtonText: '知道了'
                });
              }
            }, function () {
            }, this, true);
            // 关闭开屏广告
            this.close();
          }
        } else if (this.CFG.client.isMiniprogram && item.externalWechatApp && item.externalLink) {
          wx.miniProgram.navigateTo({
            url: `/pages/transitjump/transitjump?appId=${item.externalWechatApp}&path=${encodeURIComponent(item.externalLink)}&miniprogramName=${encodeURIComponent(item.miniprogramName)}`,
            success: function () {
            }
          })
          // 关闭开屏广告
          this.close();
        } else {
          this.showQrcode = item.externalWechatCode;
          this.playPause();
        }
      } else if(item.externalLink) {
        let url = item.externalLink;
        if(urlRegex.test(url)) {
          // 是http地址则打开新页面
          if(_self.CFG.versionConfig && _self.CFG.versionConfig.length > 0){
            url = _self.utils.transformationMachedVersion(url, _self.CFG.versionConfig)
          }
          if (LonchJsApi.isInApp() && LonchJsApi.isInAppV2()) {
            const args = {
                url,
                title: '',
                query: {},
                isBackTitleBar: true,
                config: {
                    isBackTitleBar: true
                }
            };
            _self.API.send({command: 'cmdAppOpenUrl'}, args, function () { }, function () { }, _self, true);
          } else {
            window.open(url);
            // 关闭开屏广告
            this.close();
          }
        } else if(item.externalLink) {
          // 非http地址则是路由跳转
          this.$router.push({
            path: item.externalLink
          })
          // 关闭开屏广告
          this.close();
        }
      }
    },
    /**
     * 关闭
     */
    closeQrCode() {
      this.showQrcode = '';
      this.togglePlayPause();
    },
    /**
     * 更新播放状态事件
     * @param e 
     */
    onPlayerTimeupdate(e) {
      // 计算剩余时间
      // 为了避免出现0秒，所以多加了1秒钟
      this.remainder = Math.floor(e.cache_.duration - e.cache_.currentTime) + 1;
    },
    /**
     * 视频播放完成事件
     * @param index 
     */
    onPlayerEnded(index) {
      if(index >= this.videoList.length - 1) {
        this.close();
      } else {
        this.swiper.slideNext();
      }
    },
    /**
     * 视频播放器准备就绪事件
     * @param e 
     * @param index 
     */
    onPlayerReady(e, index) {
      let videoPlayer = this.$refs['videoPlayer' + index];
      if(this.videoList[index] && videoPlayer){
        let player = this.$refs['videoPlayer' + index][0].player;
        if(player){
          // 设置视频源
          player.src(this.videoList[index].materialFileUrl); 
          // 设置海报
          player.poster = this.videoList[index].showPicture || this.defaultPayBg;
          if(index === 0){
            player.muted(true);
            player.play();
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: '初始化视频失败，请重试！'
        })
      }
    },
    // 切换播放状态
    togglePlayPause() {
      let videoPlayer = this.$refs['videoPlayer' + this.currentIndex];
      if(videoPlayer){
        let player = videoPlayer[0].player;
        if (player.paused()) {
          player.play(); // 如果暂停，则播放
          player.muted(this.isMute);
        } else {
          player.pause(); // 如果播放，则暂停
        }
      }
    },
    // 暂停播放
    playPause() {
      let videoPlayer = this.$refs['videoPlayer' + this.currentIndex];
      if(videoPlayer) {
        // 暂停播放
        let player = videoPlayer[0].player;
        player.pause();
      }
    },
    // 初始化 Swiper
    initSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        direction: 'vertical', // 垂直滑动
        slidesPerView: 1, // 每次显示一个幻灯片
        mousewheel: true, // 启用鼠标滚轮滑动
        on: {
          slideChange: () => {
            this.onSlideChange();
          },
          // 滑动到底部时加载更多视频
          reachEnd: () => {
            this.getDataVideos();
          },
        },
      });
    },
    // Swiper 切换时触发
    onSlideChange() {
      if(!this.swiper){
        return
      }
      const previousIndex = this.currentIndex;
      const currentIndex = this.swiper.activeIndex;
      
      // 暂停上一个视频
      if(this.$refs['videoPlayer' + previousIndex]) {
        const previousPlayer = this.$refs['videoPlayer' + previousIndex][0].player;
        previousPlayer.pause();
      }

      // 播放当前视频
      if(this.$refs['videoPlayer' + currentIndex]) {
        const currentPlayer = this.$refs['videoPlayer' + currentIndex][0].player;
        currentPlayer.play();
        currentPlayer.muted(this.isMute);
      }
      this.currentIndex = currentIndex;
    },
    /**
     * 查询表格数据
     * @param isInit 是否第一次加载？第一次的话要初始化swiper，否则更新swiper
     */
    getDataVideos (isInit = false) {
      const _self = this;
      if(this.channelId()) {
        // 防止重复加载
        if (this.isLoading) {
          return;
        }
        this.isLoading = true;
        let args = { 
          channelId: this.channelId(),
          current: this.page.current,
          rowCount: this.page.rowCount,
        }
        this.API.send(commonApiConfig.ad.adServingApiListAllAdServingByChannel, args, (res)=> {
          let result = res && res.data || [];
          // 第一页
          if(args.current === 1) {
            if(result.length === 0) {
              // 没有数据，直接关掉开屏广告
              this.close();
            } else {
              // 有数据，则需要让开屏广告变成黑色背景
              this.isHaveAd = true;
            }
          }
          if(this.swiper) {
            const currentIndex = this.swiper.activeIndex;
            // 因为加了一张占位，所有索引不用减1
            if(currentIndex >= this.videoList.length) {
              this.$emit('settingBgColor', 'transparent');
            }
          }
  
          this.page.current++;
          this.isLoading = false;
          if(result.length) {
            // 只播放短视频
            const fileType4List = result.filter(v => v.fileType === '4');
            this.videoList = [...this.videoList, ...fileType4List];
            LonchJsApi.timeout.destroyTimeout(this.timer);
            this.timer = '';
            this.timer = LonchJsApi.timeout.addTimeout({
              context: _self,
              callback: () => {
                this.$nextTick(()=>{
                  // 只执行一次的定时器，需要在回调函数里清除缓存按定时器uuid
                  this.timer = '';
                  if(isInit) {
                    // 初始化Swiper
                    this.initSwiper();  
                  } else {
                    // 更新Swiper
                    this.swiper.update();
                  }
                  // 播放当前视频
                  if(this.$refs['videoPlayer' + this.currentIndex]) {
                    const currentPlayer = this.$refs['videoPlayer' + this.currentIndex][0].player;
                    currentPlayer.play();
                    currentPlayer.muted(false);
                  }
                })
              },
              describe: '获取短视频后刷新swiper',
              count: 1,
              time: 1000,  
              run: true
            })
          }
        }, ()=> {
          this.isLoading = false;
        }, this)
      } else {
        this.close();
      }
    },
  },
};
</script>


<style scoped lang="scss">
.start-video {
  &-context {
    overflow: hidden;
    z-index: 1;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    &-black {
      background: #000;
    }
    .video-model-qrcode {
      position: fixed;
      z-index: 4;
      width: 300px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .video-model-qrcode-img {
      width: 300px;
      height: 300px;
      border-radius: 20px;
    }
    .video-model-qrcode-close {
      color: #fff;
      margin-top: 20px;
      font-size: 14px;
      ::v-deep .my-icon .icon {
        cursor: pointer;
        width: 64px;
        height: 64px;
        fill: #fff;
      }
    }
  }
  &-countdown {
    z-index: 2;
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    &-btn {
      font-size: 12px;
      background: rgba(45,45,45, 0.5 );
      border-radius: 100px;
      padding: 6px 12px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 1em;
        height: 1em;
        display: block;
      }
    }
  }
}
/* Swiper 容器样式 */
.swiper-container {
  height: 100%;
  width: 100%;
  /* 视频容器样式 */
  .video-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  .my-swiper-container{
    position: relative;
    .my-video-title {
        position: absolute;
        color: #ffffff;
        z-index: 10;
        bottom: 60px;
        p,h4 {
          padding: 10px 25px;
        }
      }
    }
    .video-model{
      background-color: #fff;
      opacity: 0;
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      
    }
    .el-icon-shopping-cart-2 {
      font-size: 30px;
      color: #ffffff;
      position: absolute;
      bottom: 60px;
      z-index: 3;
      right: 20px;
      cursor: pointer;
      width: 64px;
      height: 64px;
      fill: #fff;
    }
  }
  .el-icon-shopping-cart-2 {
    font-size: 30px;
    color: #ffffff;
    position: absolute;
    bottom: 60px;
    z-index: 3;
    right: 20px;
    cursor: pointer;
  }
  .el-icon-shopping-cart-active{
    color: skyblue;
  }
</style>
<style>
.vjs-custom-skin{
  width: 100%;
  height: 100%;
}
.vjs-custom-skin > .video-js{
  height: 100%!important;
  width: 100%;
}
.vjs-fluid {
  padding-top: 0 !important;
}
.vjs-tech {
  width: 100%;
  height: 100%;
}
</style>