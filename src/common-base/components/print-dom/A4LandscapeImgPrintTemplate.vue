<template>
  <div class="a4-landscape">
    <div class="print-a4-box">
      <div class="img-box" :class="direction" ref="imgBox">
        <img :src="imgUrl" @load="handlerImgLoad" ref="img">
      </div>
    </div>
  </div>
</template>

<script>
import './a4-landscape.scss';

export default {
  name: 'A4LandscapeImgPrintTemplate',
  props: {
    imgUrl: {
      type: String
    }
  },
  data () {
    return {
      isLoaded: false,
      direction: 'vertical' // vertical 垂直, horizontal 水平
    };
  },
  methods: {
    handlerImgLoad (evt) {
      this.isLoaded = true;
      let img = this.$refs.img || evt.currentTarget;
      let imgBox = this.$refs.imgBox;
      let imgWidth = img.clientWidth || img.naturalWidth;
      let imgHeight = img.clientHeight || img.naturalHeight;
      if (imgWidth > imgHeight) {
        this.direction = 'horizontal';
      } else {
        imgBox.style = 'transform: rotate(-90deg);transform-origin: 0 0;top: 100%;';
      }
      this.$emit('loaded')
    }
  }
};
</script>
<style lang="scss" type="text/scss">
  .print-a4-box {
    position: relative;
    display: block;
    overflow: hidden;
    width: 1063px;
    height: 733px;
    text-align: left;
    & img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: auto;
    }
    & .img-box {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      text-align: left;
    }
    & .img-box.horizontal {
      width: 1063px;
      height: 733px;
    }
    & .img-box.vertical {
      width: 733px;
      height: 1063px;
      & img {
        height: 100%;
        width: auto;
      }
    }
  }
</style>
