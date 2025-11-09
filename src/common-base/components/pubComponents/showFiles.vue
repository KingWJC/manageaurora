<template>
  <el-drawer
    :title="showFileConfig.title"
    :visible.sync="showFileConfig.show"
    direction="rtl"
    :size="globalData.viewportWidth > 768 ? '30%' : '300px'"
    :modal-append-to-body="false"
    :before-close="handleClose">
      <span class="red msg">点击文件展开</span>
      <div class="img-content" style="padding: 0 20px">
        <div v-for="(fileSrc, index) in showFileConfig.fileData" :key="index">
          <a :href="fileSrc" target="_blank">
            <img width="100%" v-if="isImg(fileSrc)" :src="fileSrc" alt="">
            <video width="100%" v-else-if="isMp4(fileSrc)" :src="fileSrc"></video>
            <span v-else>{{fileSrc}}</span>
          </a>
        </div>
      </div>
  </el-drawer>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'RocksListComp',
  components: {},
  props: ['showFileConfig'],
  data () {
    return {
    }
  },
  created(){
  },
  methods: {
    isImg(src) {
      const sub = src.substring(src.length, src.lastIndexOf('.') + 1);
      if (sub == 'png' || sub == 'jpg' || sub == 'jpeg' || sub == 'gif' || sub == 'svg') {
        return true;
      }
      return false;
    },
    isMp4(src) {
      const sub = src.substring(src.length, src.lastIndexOf('.') + 1);
      if (sub == 'mp4') {
        return true;
      }
      return false;
    },
    handleClose(done) {
      this.showFileConfig.fileData = [];
      done();
    }
  }
}
</script>
<style scoped>
  .el-drawer.rtl {
    min-width: 250px;
  }
  .el-drawer__header {
    margin-bottom: 0px;
  }
  .msg {
    margin: 10px 20px;
    display: block;
  }
  img {
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid #f5f5f5;
  }
  .img-content {
    padding: 0px 20px;
    height: calc(100vh - 78px);
    overflow: auto;
    border: 1px solid #f5f5f5;
  }
</style>
