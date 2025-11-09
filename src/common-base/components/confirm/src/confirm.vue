<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="confirm">
      <div
        v-if="mask"
        class="confirm-mask">
      </div>
      <div
        ref="root"
        class="confirm-content">
        <div
          v-if="title"
          class="confirm-title">
          <span>{{ title }}</span>
          <i
            v-if="closable"
            class="confirm-close-icon"
            @click="closeConfirm">
            <span class="el-icon-circle-close"></span>
            <!-- <svg-icon
              width="0.34"
              height="0.34"
              name="close-white"></svg-icon> -->
          </i>
        </div>
        <div class="confirm-body">
          <div
            v-if="text"
            class="confirm-text">
            {{ text }}
          </div>
          <div
            v-if="html"
            class="confirm-html" v-html="html">
          </div>
          <slot />
        </div>
        <div v-show="buttons && buttons.length" class="confirm-buttons">
          <button
            v-for="(item, index) in buttons"
            :key="index"
            :class="buttonClasses[index]"
            class="btn btn-limit-2"
            @click="closeConfirm(item)">{{ item.text }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Confirm',
  data () {
    return {
      show: false,
      mask: true,
      closable: false,
      width: 240,
      title: '',
      text: '',
      html: '',
      buttons: []
    }
  },
  computed: {
    buttonClasses () {
      let arr = []
      for (let item in this.buttons) {
        arr.push('btn-' + this.buttons[item].type)
      }
      return arr
    }
  },
  created() {
  },
  destroyed () {
  },
  methods: {
    closeConfirm (item) {
      this.show = false
      if (typeof item.callback === 'function') {
        item.callback()
      }
      if (typeof this.close === 'function') {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .confirm {
    position: fixed;
    z-index: 10000;
    &-mask {
      position: fixed;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .5);
    }
    &-content {
      position: fixed;
      top: 50%;
      left: 50%;
      // margin-left: -180px;
      // margin-top: -100px;
      transform: translate(-50%, -50%);
      display: inline-block;
      width: 360px;
      max-width: 90%;
      border-radius: 6px;
      background-color: #ffffff;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
    }
    &-title {
      height: 55px;
      line-height: 55px;
      text-align: center;
    }
    &-close-icon {
      display: inline-block;
      width: 34px;
      height: 34px;
      position: absolute;
      right: 6px;
      top: 0px;
      font-size: 22px;
    }
    &-body {
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, .1);
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      padding: 60px 20px;
      text-align: center;
      color: #666666;

      .confirm-html {
        max-height: 100px;
        overflow: hidden;
        overflow-y: auto;
      }
    }
    &-buttons {
      text-align: center;
      padding: 10px 0;
      & .btn {
        margin: 0 11px;
      }
    }
  }

  .modal-fade-enter, .modal-fade-leave-to {
    transform: scale(0);
  }

  .modal-fade-enter-active {
    animation: fade-in 300ms;
  }

  .modal-fade-leave-active {
    animation: fade-in 300ms reverse;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
