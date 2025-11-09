<template>
    <div class="limit-img-box">
        <img :src="ratioImg" alt=""/>
        <div class="flex flex-column flex-content-center">
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import square from './square.jpg'
export default {
  props:{
    aspectRatioType: {
      type: String,
      default: 'square'
    }
  },
  data () {
    return {
        ratioImg: square
    }
  },
  created () {
    if(this.aspectRatioType === 'square'){
      this.ratioImg = square
    }
  }
};
</script>

<style lang="scss" type="text/scss">
    .limit-img-box{
        position: relative;
        & > img {
            display: block;width: 100%;height: auto;
        }
        & > div{
            position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;
            text-align: center;
            & > img{
                display: block;
                width: 100%;
                height: auto;
            }
        }
    }
</style>
