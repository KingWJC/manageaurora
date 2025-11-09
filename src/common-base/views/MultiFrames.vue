
<template>
  <div v-if="isMounted">
    <!-- iframe父元素， 用于移动 iframe -->
    <div v-show="currentOriginPath" class="iframe-area" ref="iframeDom">
      <iframe
        class="iframe"
        v-for="item in frameItems"
        :key="item.originPath"
        :id="item.id"
        :name="item.originPath"
        :src="item.url"
        :title="item.frameName"
        v-show="item.originPath == currentOriginPath"
        :ref="item.origin"
        sandbox="allow-popups allow-downloads allow-modals allow-pointer-lock allow-scripts allow-same-origin allow-forms allow-popups-to-escape-sandbox allow-orientation-lock allow-presentation allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation allow-downloads-without-user-activation"
        allow="microphone *;camera *;display-capture"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiFrames',
  data() {
    return {
      url: '',
      originList: [],
      isMounted: false,
      params: {},
      frameItems: [],
      currentOriginPath: null,
      // 打开iframe计数器
      counter: 0,
      timer: null
    };
  },
  mounted() {
    // 绑定消息监听
    let that = this;
    LonchJsApi.ready(function () {
      that.isMounted = true;
      // 初始化iframe的DOM位置
      that.$nextTick(() => {
        that.initIframeDomPosition();
      });
      let url = that.$route.query.url;
      if (url) {
        that.openUrlWithFrame(url);
      } else {
        that.currentOriginPath = null;
        that.CFG.activatedOrigin = null;
      }
    });
  },
  watch: {
    $route: function () {
      let params = this.$route.query;
      if (params.url) {
        this.openUrlWithFrame(params.url);
      } else {
        this.currentOriginPath = null;
        this.CFG.activatedOrigin = null;
      }
    }
  },
  methods: {
    /**
     * 初始化iframe的DOM位置
     */
    initIframeDomPosition() {
      const $iframeDom = this.$refs.iframeDom;

      // 不存在，退出
      if (!$iframeDom) {
        return;
      }

      // 移动DOM位置在父元素后
      $iframeDom.parentElement.after($iframeDom);

    },
    /**
     * 变更iframe访问地址
     * @param {*} src
     */
    openUrlWithFrame(src) {
      // 增加计数器
      this.counter++;
      if(this.counter > 10) {
        console.log('iframe计数超过阈值，清除iframe');
        this.counter = 0;
        this.frameItems = [];
        if(this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.openUrlWithFrameFunc(src);
        }, 300)
      } else {
        this.openUrlWithFrameFunc(src);
      }
    },
    openUrlWithFrameFunc(src) {
      let url = decodeURIComponent(window.atob(decodeURIComponent(src)));
      url = this.utils.transformationMachedVersion(url, this.CFG.versionConfig);
      let currentUrl = new URL(url);
      let originPath = currentUrl.origin + currentUrl.pathname;
      let currentFrameData = this.getCurrentFrameByOrigin(originPath);
      if (currentFrameData) {
        currentFrameData.url = url;
      } else {
        this.frameItems.push({
          id: LonchJsApi.UUID(32, 16),
          url: url,
          originPath: originPath,
          frameName: originPath
        });
      }
      this.currentOriginPath = originPath;
      this.CFG.activatedOrigin = originPath;
    },
    getCurrentFrameByOrigin(originPath) {
      for (let i in this.frameItems) {
        let item = this.frameItems[i];
        if (item.originPath === originPath) {
          return item;
        }
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
/**
 * iframe 父元素 样式
 */
.iframe-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/**
 * iframe 样式
 */
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
