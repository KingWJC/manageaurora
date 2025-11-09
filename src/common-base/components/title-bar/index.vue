<template>
  <div v-if="isShow" class="viewport-header viewport-header-padded flex flex-column flex-content-center shadow">
    <div class="flex flex-content-between flex-items-center">
      <div v-if="isShowBack" class="flex flex-items-start">
        <i class="icon-back" @click="goBack"></i>
      </div>
      <div v-if="title" class="tac flex-flex-auto">
        <span class="fs-l">{{title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
  props: {
    // 是否显示后退
    isShowBack: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: ''
    }

  },
  data () {
    return {
      isShow: true
    };
  },
  created () {
    if (this.$route && this.$route.query && this.$route.query.showTBar) {
      // 增加路由参数, 用来控制是否显示顶栏
      const showTBar = this.$route.query.showTBar;
      if (showTBar === '0') {
        this.isShow = false;
      } else if (showTBar === '1') {
        this.isShow = true;
      }
    } else if (LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2()) {
      // 在移动端app中，不显示顶栏
      this.isShow = false;
    } else if(window.self != window.top) {
      // 在iframe中，不显示顶栏
      this.isShow = false;
    } else {
      if ((/^yaofacai$/i.test(this.CFG.projectName) && this.CFG.defaultName !== 'yaofacai')) {
        // 在药发采网关，并且当前项目不是药发采时，显示顶栏
        this.isShow = true;
      } else if (/^xiaoke$/i.test(this.CFG.projectName) && this.CFG.defaultName !== 'xiaoke') {
        // 在销客网关，并且当前项目不是销客时，显示顶栏
        this.isShow = true;
      } else if (/^oxygentherapy$/i.test(this.CFG.projectName) && this.CFG.defaultName !== 'oxygentherapy') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  },
  methods: {
    goBack () {
      this.$router.goBack();
    }
  }
};
</script>
