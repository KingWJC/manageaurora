<template>
  <div class="viewport-fixed">
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel pl15 pr15 pt10">
          <div class="mt30">
            <h1>未连接到互联网</h1>
            <dl>
              <dt>请试试以下办法：</dt>
              <dd>检查网线、调制解调器和路由器</dd>
              <dd>重新连接到 Wi-Fi 网络</dd>
            </dl>
          </div>
          <div class="mt20"><span @click="getNetworkStatus">重试</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'NetWorkError',
  mounted () {
    LonchJsApi.bindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged
    });
  },
  beforeDestroy () {
    LonchJsApi.unBindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged
    });
  },
  methods: {
    onNetStatusChanged (result) {
      if (result.status === 1) {
        this.$router.go(-1);
      }
    },
    getNetworkStatus () {
      this.API.send({command: 'queryNetStatus'}, {},
        function (res) {
          if(res.serviceResult.status === 1){
            this.$router.go(-1);
          }else {
            this.$toast({text: '请检查网络再重试'});
          }
        },
        function () {
          this.$toast({text: '请检查网络再重试'});
        },
        this
      );
    },
    goBack () {
      if (LonchJsApi.isInMacApp()) {
        LonchJsApi.callApp({command: 'cmdAppBack'});
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
