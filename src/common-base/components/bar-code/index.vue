<template>
  <div :style="canvasStyle" class="bar-code-img">
    <canvas ref="jsBarCodeRef" style="display:none;"></canvas>
    <img :src="barCodeUrl" alt=""/>
  </div>
</template>

<script type="text/ecmascript-6">
  import JsBarCode from 'jsbarcode'
  export default {
    name: 'BarCode',
    props: {
      size: {
        type: Number,
        default: 128
      },
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 60
      },
      code: {
        type: String
      },
      text: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        barCodeUrl: ''
      }
    },
    mounted() {
      JsBarCode(this.$refs.jsBarCodeRef, this.code, {
        format: "CODE128",
        text: this.code,
        margin: 0,
        width: 2,
        height: this.height,
        displayValue: false
      })
      this.$nextTick(()=>{
        this.barCodeUrl = this.$refs.jsBarCodeRef.toDataURL()
      })
    },
    computed: {
      canvasStyle () {
        let styles = []
        styles.push('display:inline-block')
        styles.push('width:'+ this.width + 'px')
        styles.push('height:'+ this.height + 'px')
        return styles.join(';')
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .bar-code-img{
    display: inline-block;
    & > img{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>
