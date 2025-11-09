export default {
  created () {
    let that = this;
    let userAgent = window.navigator.userAgent;
    let client = {
      userAgent: userAgent,
      isIOS: /.*Mac OS.*/i.test(userAgent),
      isAndroid: /.*Android.*/i.test(userAgent),
      isWindows: /.*windows.*/i.test(userAgent),
      isIE: /.*Trident.*/i.test(userAgent),
      isMobile: /.*Mobile.*/i.test(userAgent),
      isIPhone: /.*iPhone.*/i.test(userAgent),
      isIPad: /.*iPad.*/i.test(userAgent),
      isMicromessenger: /.*Micromessenger.*/i.test(userAgent) && !/.*wxwork.*/i.test(userAgent),
      isWxwork: /.*wxwork.*/i.test(userAgent),
      isMiniprogram: false,
      isApp: typeof LonchJsApi === 'object' && LonchJsApi.isInApp(),
      appType: '', // windowApp，androidApp，iosApp，macApp, webApp
      appName: this.utils.getParam('appName'),
      ip: this.utils.getClientIp() || '0.0.0.0',
      clientInfo: {}
      // {"deviceType" : "iosApp","appName" : "yaoFaCai","version" : "测试环境_v0.0.1.1","companyName" :""}
    };
    let os = userAgent.match(/(windows|Android|iPhone|iPad|Mac)(\s?OS\s?X|\s?nt)?(\s?\d+(\.\d+)*(_\d+(\.\d+)*)*)/i);
    if (os && os.length > 4) {
      client.os = {
        name: os[0],
        sys: os[1] || '',
        type: (os[2] || '').replace(/^\s/, ''),
        version: (os[3] || '').replace(/^\s/, '')
      };
    }
    if (client.isMicromessenger) {
      try {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            client.isMiniprogram = true;
            client.appType = 'miniprogram';
          } else {
            client.isMiniprogram = false;
          }
          Object.assign(that.CFG.client, client);
        });
      } catch (e) {
        console.log('clent', e);
      }
    }
    if (window.self === window.top) {
      if (typeof LonchJsApi === 'object' && (LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2())) {
        client.appType = 'iosApp';
      } else if (typeof LonchJsApi === 'object' && (LonchJsApi.isInMacApp() || LonchJsApi.isInMacAppV2())) {
        client.appType = 'macApp';
      } else if (typeof LonchJsApi === 'object' && (LonchJsApi.isInCef() || LonchJsApi.isInCefV2())) {
        client.appType = 'windowApp';
      } else if (typeof LonchJsApi === 'object' && (LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2())) {
        client.appType = 'androidApp';
      } else if (client.isMiniprogram) {
        client.appType = 'miniprogram';
      } else if (client.isWxwork) {
        client.appType = 'wxwork';
      } else if (client.isMicromessenger) {
        client.appType = 'micromessenger';
      } else {
        client.appType = 'webApp';
      }
    }
    Object.assign(this.CFG.client, client);
    if (typeof this.updateClient === 'function') {
      this.updateClient(client);
    }
  }
};
