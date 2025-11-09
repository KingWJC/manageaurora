<template>
  <div class="viewport-fixed">
    <div class="viewport-header">
      <div class="viewport-header viewport-header-padded flex flex-column flex-content-center shadow"
           style="color:#333;">
        <div class="flex flex-content-between flex-items-center">
          <div class="flex flex-items-start flex-items-center">
            <div @click="goBack" class="flex flex-items-center">
              <i class="icon-back"></i>
            </div>
          </div>
          <div class="tac flex-flex-auto">
            <span class="fs-l">{{$route.query.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel p15">
          <div class="flex pt40">
            <div>
              <span class="el-icon-info fs-lg orange"></span>
            </div>
            <div class="ml5 flex-flex-auto flex flex-column flex-content-center">
              <h1 class="">该页面未授权访问!</h1>
              <dl class="mt15">
                <dt>请联系人工客服，客服电话：4006209199</dt>
              </dl>
              <div class="mt20"><span @click="goHome">返回首页</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'NoAccessError',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    route: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  created () {
    this.webLog.customLog({
      sourceName: this.CFG.projectName,
      sourceType: typeof LonchJsApi === 'object' ? LonchJsApi.clientType : 'web-app',
      appVer: LonchJsApi && LonchJsApi.isInApp() ? this.CFG.client.clientInfo.version : '',
      curPageUrl: this.$route.query.path,
      curPageTitle: this.$route.query.title,
      reqParam: JSON.stringify(this.$route.query),
      errCode: 'WEBAPP050000',
      errLevel: 'info',
      errMsg: '***NoAccessError：该页面无权限访问***',
      userAgent: window.navigator.userAgent
    });
  },
  methods: {
    goBack () {
      this.$router.go(-2);
    },
    goHome () {
      this.$router.push({path: '/'});
    }
  }
};
</script>
