<template>
  <div v-if="isShow" class="viewport-header viewport-header-padded flex flex-column flex-content-center">
    <div class="flex flex-content-between flex-items-center">
      <div v-if="isShowBack" class="flex flex-items-start">
        <i class="icon-back" @click="back"></i>
      </div>
      <div v-if="title" class="tac flex-flex-auto">
        <span class="fs-l">{{title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrumbsBar',
  props: {
    // 是否显示后退
    isShowBack: {
      type: Boolean,
      default: true
    },
    isCustomerBackEvent: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: false
    };
  },
  created () {
    this.initBar();
  },
  watch: {
    $route: function () {
      this.initBar();
    }
  },
  methods: {
    initBar () {
      this.$nextTick(() => {
        if (/^yaoFaCai$/i.test(this.CFG.projectName) || /^xiaoke$/i.test(this.CFG.projectName)) {
          // 来自药发采/销客不显示
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      });
    },
    back () {
      if (this.isCustomerBackEvent) {
        this.$emit('back');
      } else {
        //this.$router.go(-1);
        this.$router.goBack();
      }
    }
  }
};
</script>
