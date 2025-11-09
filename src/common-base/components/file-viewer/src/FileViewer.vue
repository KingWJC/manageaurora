<template>
  <div>
    <viewer v-if="/\.(png|jpg|jpeg)$/.test(file[pathKey])" :images="[file]" class="viewer" ref="viewer">
      <div class="file-img-thumb flex flex-column flex-items-center flex-content-center">
        <img :src="file[pathKey]" />
      </div>
    </viewer>
    <a v-else style="margin:5px 0px;color:#409EFF;text-decoration: none;" :href="file[pathKey]+'?_=.zip'" target="_blank">{{file[nameKey]||defaultFileName}}</a>
  </div>
</template>

<script>
export default {
  name: 'FileViewer',
  props: {
    file: {
      type: Object,
      default () {
        return {};
      }
    },
    defaultFileName: {
      type: String,
      default: ''
    },
    pathKey: {
      type: String,
      default: 'filePath'
    },
    nameKey: {
      type: String,
      default: 'fileName'
    }
  },
  data () {
    return {};
  }
};
</script>
<style type="text/scss" lang="scss">
  .file-img-thumb {
    width: 3rem;
    height: 2rem;
    overflow: hidden;
    margin-top: 3px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .3);
    & img {
      display: block;
      max-width: 100%;
    }
  }
</style>
