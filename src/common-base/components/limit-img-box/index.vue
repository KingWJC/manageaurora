<!--
 * @Author: tuWei
 * @Date: 2022-03-21 14:22:35
 * @LastEditors: 
 * @LastEditTime: 2022-03-24 15:15:29
-->
<template>
  <div class="limit-img-box">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" :width="width" :height="height"></svg>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LimitBox',
  props: {
    width: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 1
    }
  }
};
</script>
<style type="text/scss" lang="scss">
  .limit-img-box {
    position: relative;
    width: 100%;
    height: 100%;
    & > img, > svg {
      display: block;
      width: 100%;
      height: auto;
    }
    & > div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      & > img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
  }
</style>