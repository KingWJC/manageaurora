<template>
  <div id="lonchLoading" class="lonch-loading flex flex-column flex-content-center flex-items-center" :style="background ? `background-color: ${background}` : ''">
    <lonchLoading />
    <span class="text mt20" v-if="text" :style="color ? `color: ${color}` : ''">{{text || '加载中...'}}</span>
  </div>
</template>

<script>
import lonchLoading from './loading'

export default {
  components: {
    lonchLoading,
  },
  data() {
    return {
      // 配置loading文案
      text: '',
      // 配置遮罩背景
      background: '',
      // 配置文字颜色
      color: '',
      duration: 30000,
      type: '',
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.$el.parentNode.removeChild(this.$el);
    // }, this.duration);
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
    transition: all 3s;
  }
}
.lonch-loading {
  z-index: 99998;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.01);
  .icon {
    width: 0.32rem;
    height: 0.32rem;
    animation: spin 3s linear infinite;
  }
  .text {
    // max-width: 2rem;
    word-break: break-all;
    font-size: 0.12rem;
  }
}
</style>
