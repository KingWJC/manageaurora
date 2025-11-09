<template>
  <div class="loading-box">
    <div class="loading flex flex-content-center flex-items-center" :style="`width: ${width};height: ${height};${border};`">
      <img class="icon" :src="heartbeat" />
    </div>
    <img class="icon2" :src="heartbeat" />
    <img class="icon3" :src="heartbeat" />
  </div>
</template>

<script>
import Heartbeat from './heartbeat.png'

export default {
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    border: {
      type: String,
      default: 'none'
    },
    isOver: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      heartbeat: Heartbeat
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}
@keyframes floatAway2 {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 0;
  }
  80% {
    transform: rotate(-25deg) translate(35px, -35px);
    opacity: 0.8;
  }
  100% {
    transform: rotate(-25deg) translate(40px, -40px);
    opacity: 0;
  }
}
@keyframes floatAway3 {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 0;
  }
  80% {
    transform: rotate(-25deg) translate(40px, -40px);
    opacity: 0.5;
  }
  100% {
    transform: rotate(-25deg) translate(45px, -45px);
    opacity: 0;
  }
}
.loading {
  width: 48px;
  height: 48px;
  z-index: 3;
  position: relative;
  animation: heartbeat 1.5s ease infinite;
  &-box {
    position: relative;
    z-index: 1;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.icon {
  display: block;
  font-size: 24px;
}
.icon2 {
  display: block;
  font-size: 24px;
  width: 16px;
  height: 16px;
  position: absolute;
  z-index: 1;
  top: 50%;
  right: -0%;
  animation: floatAway2 3s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
}
.icon3 {
  display: block;
  font-size: 24px;
  width: 8px;
  height: 8px;
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 50%;
  animation: floatAway3 2.5s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
  animation-delay: 0.5s;
}
.text {
  padding: 20px 0;
  text-align: center;
  color: #888888;
}
</style>
