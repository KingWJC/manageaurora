<template>
  <div class="verify-human-box">
    <slot></slot>
    <div :class="{'verify-human-box-img-box-mask': isRelative}" v-if="isInitVerifyHuman">
      <div class="verify-human-box-img-box" :class="{'verify-human-box-img-box-relative': isRelative, 'verify-human-box-img-box-absolute': isAbsolute}">
        <!--
          标题
        -->
        <div class="verify-human-box-title">
          <span>安全验证</span>
          <div class="verify-human-box-title-close" @click="closeVerifyHuman()">
            关闭
          </div>
          <div class="verify-human-box-title-refresh" @click="getCode()">
            <img
              src="https://resources.lonch.com.cn/ybd/image/20240728-icon-refresh.svg"
            />
          </div>
        </div>
        <div class="verify-human-box-img">
          <div class="verify-human-box-slider" id="verifyhumanSlider">
            <img
              :src="`data:image/png;base64,${jigsawImageBase64}`"
              draggable="false"
              v-if="jigsawImageBase64"
            />
          </div>
          <div>
            <img
              :src="`data:image/png;base64,${originalImageBase64}`"
              draggable="false"
              v-if="originalImageBase64"
            />
            <span v-else>loading...</span>
          </div>
        </div>
        <div class="verify-human-box-tips">
          <div class="verify-human-box-tips-slider" id="verifyHumanSlider"></div>
          <span>向右滑动完成验证</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isRelative', 'isAbsolute'],
  data() {
    return {
      // 是否展示验证码
      isInitVerifyHuman: false,
      callback: null,
      isDragging: false,
      currentX: 0,
      initialX: 0,
      token: '',
      jigsawImageBase64: '',
      originalImageBase64: '',
      errorCode: {
        '0000': '验证成功',
        6110: '验证码已失效，请重新获取',
        6111: '验证失败'
      }
    };
  },
  watch: {
    isInitVerifyHuman(val) {
      if (val) {
        this.$nextTick(() => {
          this.initDraggable();
        });
      } else {
        this.clearDraggable();
      }
    }
  },
  methods: {
    /**
     * 验证验证码
     */
    check(callback) {
      this.callback = callback;
      this.isInitVerifyHuman = true;
      this.getCode();
    },
    /**
     * 关闭校验
     */
    closeVerifyHuman() {
      this.isInitVerifyHuman = false;
      this.callback({code: 2, token: ''});
    },
    /**
     * 获取验证码图片
     */
    getCode() {
      this.jigsawImageBase64 = '';
      this.originalImageBase64 = '';
      this.token = '';
      const args = {
        captchaType: 'blockPuzzle',
        clientUid: this.utils.UUID()
      };
      this.API.send(
        { module: 'uaapi', url: '/captcha2/get', method: 'POST' },
        args,
        function (res) {
          const result = res && res.data;
          if (result) {
            this.jigsawImageBase64 = result.jigsawImageBase64;
            this.originalImageBase64 = result.originalImageBase64;
            this.token = result.token;
          } else {
            this.$toast({ text: '获取验证码频率过快，请稍后再试' });
            this.isInitVerifyHuman = false;
            let timer = setTimeout(() => {
              this.callback({code: 1, token: ''});
              clearTimeout(timer);
              timer = null;
            }, 2000);
          }
        },
        function (res) {
          console.log(res);
        },
        this,
        true
      );
    },
    /**
     * 校验是否是人类
     */
    checkCode() {
      const args = {
        captchaType: 'blockPuzzle',
        pointJson: JSON.stringify({ x: this.currentX, y: 5 }),
        token: this.token
      };
      this.API.send(
        { module: 'uaapi', url: '/captcha2/check', method: 'POST' },
        args,
        function (res) {
          const result = res && res.data;
          if (result) {
            if (result.repCode === '0000') {
              // 验证通过，执行回调
              this.callback({code: 0, token: result.repData});
              // 关闭人机验证显示
              this.isInitVerifyHuman = false;
              // 清空图片展示
              this.jigsawImageBase64 = '';
              this.originalImageBase64 = '';
              this.token = '';
            } else {
              // 验证不通过，重新获取验证码，并提示用户
              this.getCode();
              this.$toast({ text: result.repMsg });
            }
          }
        },
        function (res) {
          console.log(res);
          this.callback({code: 1, token: ''});
        },
        this,
        true
      );
    },
    /**
     * 初始化监听
     */
    initDraggable() {
      // let draggableDiv = document.getElementById('verifyHumanSlider');
      let draggableDiv = document.body;
      // PC端长按事件
      draggableDiv.addEventListener('mousedown', this.dragMouseDown);
      draggableDiv.addEventListener('mousemove', this.elementDrag);
      draggableDiv.addEventListener('mouseup', this.closeDragElement);
      // 绑定触摸事件（移动端）
      draggableDiv.addEventListener('touchstart', this.dragMouseDown);
      draggableDiv.addEventListener('touchmove', this.elementDrag);
      draggableDiv.addEventListener('touchend', this.closeDragElement);
    },
    /**
     * 清除监听
     */
    clearDraggable() {
      // let draggableDiv = document.getElementById('verifyHumanSlider');
      let draggableDiv = document.body;
      // PC端长按事件
      draggableDiv.removeEventListener('mousedown', this.dragMouseDown);
      draggableDiv.removeEventListener('mousemove', this.elementDrag);
      draggableDiv.removeEventListener('mouseup', this.closeDragElement);
      // 绑定触摸事件（移动端）
      draggableDiv.removeEventListener('touchstart', this.dragMouseDown);
      draggableDiv.removeEventListener('touchmove', this.elementDrag);
      draggableDiv.removeEventListener('touchend', this.closeDragElement);
    },
    /**
     * 开始按住
     */
    dragMouseDown(e) {
      const domBtn = e.target || e.srcElement;
      if(e && domBtn && domBtn.id === 'verifyHumanSlider') {
        e.preventDefault();
        this.isDragging = true;
        // 获取鼠标或触摸点的位置
        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX;
        } else {
          this.initialX = e.clientX;
        }
      }
    },
    /**
     * 拖动中
     * @param {*} e 
     */
    elementDrag(e) {
      e.preventDefault();
      let draggableDiv = document.getElementById('verifyHumanSlider');
      if (this.isDragging) {
        // 计算新的位置
        if (e.type === 'touchmove') {
          this.currentX = e.touches[0].clientX - this.initialX;
        } else {
          this.currentX = e.clientX - this.initialX;
        }
        // 设置div的新位置
        this.setTranslate(this.currentX, draggableDiv);
      }
    },
    /**
     * 按住（触摸）停止事件
     */
    closeDragElement() {
      let verifyhumanSlider = document.getElementById('verifyhumanSlider');
      const offsetLeft = verifyhumanSlider.offsetLeft;
      if (offsetLeft > 1) {
        this.checkCode();
      }
      this.isDragging = false;
      // 滑块DOM
      let verifyHumanSliderDiv = document.getElementById('verifyHumanSlider');
      // 释放时滑块归零
      this.setTranslate(0, verifyHumanSliderDiv);
    },
    /**
     * 滑动时设置滑块位置
     * @param {*} xPos 
     * @param {*} el 
     */
    setTranslate(xPos, el) {
      // 获取滑动DOM
      let verifyhumanSlider = document.getElementById('verifyhumanSlider');
      // 获取滑块宽度（为保证不会将滑块滑出范围）
      const verifyhumanSliderWidth = verifyhumanSlider.offsetWidth;
      if (verifyhumanSlider && xPos >= 0 && xPos < 310 - 40) {
        el.style.left = xPos + 'px';
        // 拼图比滑块要宽，所以这里是减去拼图宽度
        if (xPos < 310 - verifyhumanSliderWidth) {
          verifyhumanSlider.style.left = xPos + 'px';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.verify-human-box {
  flex-shrink: 0;
  user-select: none;
  touch-action: manipulation;
  z-index: 99;
  // position: relative;
  &-title {
    z-index: 1;
    position: relative;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    margin-bottom: 8px;
    &-close {
      cursor: pointer;
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 1rem;
      color: #cc3300;
    }
    &-refresh {
      cursor: pointer;
      width: 32px;
      height: 32px;
      z-index: 1;
      position: absolute;
      top: 4px;
      right: 0;
      img {
        display: block;
        width: 100%;
        color: #888;
      }
    }
  }
  &-img {
    width: 310px;
    height: 155px;
    z-index: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    background: #f0f0f0;
    &-box {
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      background: #fff;
      padding: 8px;
      // z-index: 1;
      // position: absolute;
      // top: 0;
      &-mask {
        z-index: 11;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      // &-relative {
      //   top: 50%;
      //   left: 50%;
      //   transform: translate(-50%, -50%);
      // }
      // &-absolute {
      //   top: 50%;
      //   right: 0;
      //   transform: translateY(-50%);
      // }
      img {
        display: block;
      }
    }
  }
  &-slider {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  &-tips {
    color: #ccc;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    background: #f0f0f0;
    margin-top: 8px;
    z-index: 1;
    position: relative;
    &-slider {
      border: #ccc 1px solid;
      background: #fff;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      cursor: pointer;
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border: 2px solid #ccc;
        transform: translate(-20%, -50%) rotate(45deg);
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border: 2px solid #ccc;
        transform: translate(-100%, -50%) rotate(45deg);
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }
    }
  }
}
</style>
