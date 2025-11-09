<template>
    <transition name="modal-fade">
        <div v-if="show" class="toast">
            <div v-if="mask" class="toast-mask">
            </div>
            <div ref="toastContent" :style="styles" :class="contentClass" class="toast-content">
                <div v-if="text" class="toast-text">
                    <i v-if="loading" class="loading rotating"></i>
                    <span>{{ text }}</span>
                    <i v-if="closable" class="toast-close-icon" @click="closeToast"></i>
                </div>
                <i v-if="closable" class="toast-close-icon" @click="closeToast"></i>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'Toast',
  data () {
    return {
      show: true,
      mask: false,
      closable: false,
      loading: false,
      text: '提示',
      type: 'normal',
      position: 'center', // center top bottom
      duration: 2000,
      callback: null,
      styles: ''
    }
  },
  computed: {
    /* styles: function () {
      let width = this.$refs.toastContent ? this.$refs.toastContent.offsetWidth : 0
      let height = this.$refs.toastContent ? this.$refs.toastContent.offsetHeight : 0
      let styles = []
      styles.push('margin-left:' + (-1) * width / 2 + 'px;')
      switch (this.position) {
        case 'top':
          styles.push('top: 0')
          break
        case 'bottom':
          styles.push('bottom: 0')
          break
        default:
          styles.push('top: 50%')
          styles.push('margin-top:' + (-1) * height / 2 + 'px')
          break
      }
      return styles.join('')
    }, */
    contentClass () {
      return this.position ? 'toast-content-' + this.position : 'toast-content-center'
    }
  },
  created () {
  },
  mounted () {
    if (this.duration > 0) {
      setTimeout(() => {
        this.closeToast()
      }, this.duration)
    }
    // this.$nextTick(() => {
    //  this.cstyles()
    // })
  },
  destroyed: function () {
    // 删除dom节点
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    closeToast () {
      this.show = false
      if (typeof this.callback === 'function') {
        this.callback()
      }
      this.$destroy()
    },
    showToast () {
      this.show = true
      this.$nextTick(() => {
        this.cstyles()
      })
    },
    cstyles () {
      let width = this.$refs.toastContent ? this.$refs.toastContent.offsetWidth : 0
      let height = this.$refs.toastContent ? this.$refs.toastContent.offsetHeight : 0
      let styles = []
      styles.push('margin-left:' + (-1) * width / 2 + 'px;')
      switch (this.position) {
        case 'top':
          styles.push('top: 0')
          break
        case 'bottom':
          styles.push('bottom: 0')
          break
        default:
          styles.push('top: 50%')
          styles.push('margin-top:' + (-1) * height / 2 + 'px')
          break
      }
      this.styles = styles.join('')
    }
  }
}
</script>
<style scoped>
.toast {
  position: relative;
  z-index: 10000;
}
.toast-mask {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
}
.toast-content {
  position: fixed;
  left: 50%;
  margin-left: -50px;
  display: inline-block;
  max-width: 300px;
  padding: 16px;
  line-height: 24px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, .95);
  color: #ffffff;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
}
.toast-content-top {
  top: 0;
}
.toast-content-center {
  top: 50%;
}
.toast-content-bottom {
  bottom: 0;
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