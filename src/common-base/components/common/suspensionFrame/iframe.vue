<!--
 * @Author: gaopengfei
 * @Date: 2025-05-14 15:00:05
 * @Description: 文件描述~
 * @FilePath: /common-base/components/common/suspensionFrame/iframe.vue
 * @LastEditTime: 2025-05-18 00:27:13
 * @LastEditors: Do not edit
-->
<template>
  <div style="width: 100%;height: 100%" v-if="isMounted">
    <iframe :name="'crmFrames' + name" :src="urlList" allow="microphone; display-capture" style="width:100%;height:100%;border:0;position:fixed;left:0;right:0;z-index:10;" ref="iframe"></iframe>
  </div>
</template>

<script>

export default {
  name: 'crmFrames',
  props: {
    urlList: {
      type: String,
      default () {
        return ''
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      url: '',
      originList: [],
      isMounted: false,
      params: {}
    }
  },
  created () {
    this.originList = this.CFG.originList
    // this.url = decodeURIComponent(this.$route.query.url)
    // this.params = this.$route.query
  },
  mounted () {
    // 绑定消息监听
    let that = this
    LonchJsApi.ready(function () {
      that.isMounted = true
    })
  },
  // watch: {
  //   $route: function () {
  //     this.params = this.$route.query
  //     this.url = decodeURIComponent(this.params.url)
  //   }
  // }
}
</script>
