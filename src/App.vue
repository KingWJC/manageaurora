<!--
 * @Author: tuWei
 * @Date: 2022-02-10 13:08:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-21 17:04:28
-->
<template>
  <div id="app">
    <router-view v-if="isInitialized" />
  </div>
</template>

<script>
import client from '@/common-base/mixins/client';
import initAppMixin from '@/common-base/mixins/init-app';

export default {
  name: 'app',
  components: {},
  mixins: [client, initAppMixin],
  data () {
    return {
      isShowLeftSide: true,
      webWorker: null
    };
  },
  created () {
    window.vm = this;
    // this.API.send(this.CFG.services.sy.areaslog, {}, function (res) {
    //   res = res.serviceResult;
    //   console.log(res);
    // }, function () {
    // }, this)
  },
  updated () {
    if (this.$route.meta.name) {
      document.title = this.$route.meta.name;
    }
  },
  mounted () {
    // if (typeof window.closeWaitLoading === 'function') {
    //   window.closeWaitLoading();
    // }
    // this.viewportWidth = document.body.offsetWidth;
    // this.CFG.viewportWidth = this.viewportWidth;
  },
  methods: {
    // 判断微信环境
    isWX () {
      let ua = navigator.userAgent.toLowerCase();
      return Boolean(/micromessenger/.test(ua));
    },
    // 初始化配置完成回调
    onConfigedInitialized () {
      if (this.CFG.token || LonchJsApi.isInApp()) {
        // 微信签名
        if (this.isWX()) {
          // this.wxSignature();
        }
      }
    },
    // 进行微信jssdk签名
    wxSignature () {
      let option = {};
      if(process.env.VUE_APP_MODE === 'production') {
        option = {
          appId: '',
          agentId: ''
        };
      } else {
        option = {
          appId: 'ww98055e27dd1e67fd',
          agentId: '1000057'
        };
      }
      if (this.isWX()) {
        console.log('----  环境检测成功  ----');
        const that = this;
        const args = {
          // url: 'https://www.baidu.com',
          // url: window.location.href,
          url: encodeURIComponent(window.location.href.split('#')[0]),
          // url: encodeURIComponent('https://test-portal.lo
          // url: encodeURIComponent(window.location.href.split('#')[0]),
          // url: encodeURIComponent('https://test-portal.lonch.com.cn/index.html'),
          agentId: option.agentId,
          appId: option.appId,
        };
        console.log(args);
        console.log('----  签名信息请求成功  ----');
        const CFG = {
          beta: true,
          debug: true,
          appId: 'wxf65b27d6fede2a31',
          timestamp: '1656427842',
          nonceStr: 'test',
          signature: '55cc97d602904d03b8915af7b1bb624d5ce07276',
          jsApiList: ['shareAppMessage']
        };
        window.wx.config(CFG);
        console.log('----  参数注入成功  ----', CFG);
        window.wx.ready(function () {
          console.log('----  ready成功  ----');
          window.wx.error(function (err) {
            that.isWXweb = false;
            console.log('----  准备失败  ----', err);
          });
          that.isWXweb = true;
        });
        // this.API.send(this.CFG.services.tec.cgiGetWorkWeixinBusSign, args, function (res) {
        //   if (res && res.serviceResult) {
        //     console.log('----  签名信息请求成功  ----');
        //     const result = res.serviceResult;
        //     const CFG = {
        //       beta: true,
        //       debug: true,
        //       appId: result.appId,
        //       timestamp: result.timestamp,
        //       nonceStr: result.noncestr,
        //       signature: result.signStr,
        //       jsApiList: ['shareAppMessage']
        //     };
        //     window.wx.config(CFG);
        //     console.log('----  参数注入成功  ----', CFG);
        //     window.wx.ready(function () {
        //       console.log('----  ready成功  ----');
        //       window.wx.error(function (err) {
        //         that.isWXweb = false;
        //         console.log('----  准备失败  ----', err);
        //       });
        //       that.isWXweb = true;
        //     });
        //   }
        // }, function () {
        // }, this, true);
      }
    }
  }
};
</script>
