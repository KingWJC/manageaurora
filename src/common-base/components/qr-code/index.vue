<template>
  <div class="qr-code" :style="isShowImg?qrCodeStyle:''">
    <canvas ref="qrCodeRef" style="display: none;"></canvas>
    <img :src="qrCodeUrl" v-if="isShowImg" crossorigin="qr-code-img" style="display: block;" alt=""/>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QrCode',
  props: {
    size: {
      type: Number,
      default: 128
    },
    qtext: {
      type: String,
      default: ''
    },
    isShowImg: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      qrCodeUrl: ''
    };
  },
  mounted () {
    this.getQrCodeUrl();
  },
  computed: {
    qrCodeStyle: function () {
      let styles = [];
      styles.push('width:' + this.size + 'px;');
      styles.push('height:' + this.size + 'px;');
      return styles.join('');
    }
  },
  methods:{
    getQrCodeUrl(){
      let that = this;
      QRCode.toDataURL(this.$refs.qrCodeRef, this.qtext, {
        version: 'auto',
        errorCorrectionLevel: 'H',
        margin: '2',
        width: this.size,
        height: this.size,
        type: 'image/jpeg',
        color: {
          light: '#ffffff',
          dark: '#000000'
        }
      }, function (error, url) {
        if (error) {
          console.error(error);
        } else {
          that.$emit('change', url);
          that.qrCodeUrl = url;
        }
      });
    }
  },
  watch:{
    qtext: function () {
      this.getQrCodeUrl();
    }
  }
};
</script>

<style lang="scss" type="text/scss">
  .qr-code {
    display: block;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>

