export default {
  methods: {
    /**
     * 跳转实名认证
     *
     * @param {string} humanId 认证主体id
     * @param {string} issuePartyParams 认证主体参数
     */
    toRZHFunction(humanId, issuePartyParams){
      const isSelfAuth = this.CFG.userInfo.id === humanId ? '1' : '2';
      const issueParty = this.CFG.client.isInMiniprogram ? (issuePartyParams || '2') : issuePartyParams;
      /**
       * 小程序环境, 仅支持腾讯认证
       */
      if (this.CFG.client.isInMiniprogram && issueParty !== '2') {
        this.$toast({
          text: '微信仅支持腾讯进行实名认证，请更换 App 进行操作？',
        });
        return;
      }
      const url = {
        title: '实名认证',
        originName: 'manage',
        routePath: `/admin/eContract/realNameApply/create/form`,
        query: {
          moduleCode: '140110',
          issueParty,
          humanId,
          isSelfAuth,
          // 取当前项目的appName
          appName: this.CFG.appName,
          // 在APP中新开窗口时，不显示顶栏和侧栏
          isShowMainHeaderLeftSide: '0'
        },
      }
      /**
       * 自然人实名认证(认证人为自己)
       */
      if (isSelfAuth === '1') {
        LonchJsApi.openUrl(url);
      } else {
        /**
         * 自然人实名认证(认证人为他人, 代认证)
         */
        this.$confirm({
          title: '提示',
          text: '非本人操作，是否进行代认证？',
          buttons: [
            {
              text: '取消',
              type: 'follow'
            },
            {
              text: '确定',
              type: 'primary',
              callback: () => {
                LonchJsApi.openUrl(url);
              }
            }
          ]
        })
      }
    },
    /*
     * 查看实名认证证书
     *
     * @param {*} humanId 用户 ID
     * @param {*} issuePartyParams 用户认证主体参数 1: 法大大, 2: 腾讯
     */
    toViewRZHCert(humanId, issuePartyParams = '1') {
      humanId = humanId || this.CFG.userInfo.id;
      this.API.send(
        { module: 'ca', url: '/realName/queryAuthStatus', method: 'POST' },
        { humanId },
        res => {
          const result = res.serviceResult;
          const fddAuthStatus = result.fddAuthStatus;
          const tencentAuthStatus = result.tencentAuthStatus;
          if (issuePartyParams === '1' && fddAuthStatus === '1') {
            const url = {
              title: 'CA证书',
              originName: 'manage',
              routePath: `/admin/eContract/certificationPersonal`,
              isBackTitleBar: false,
              query: {
                moduleCode: '140110',
                showViewMode: 'show',
                isCertBack: LonchJsApi && (LonchJsApi.isInCef() || LonchJsApi.isInCefV2()) ? '0' : '1', // 是否返回
                humanId,
                // 取当前项目的appName
                appName: this.CFG.appName,
                // 在APP中新开窗口时，不显示顶栏和侧栏
                isShowMainHeaderLeftSide: '0',
                // 在APP中新开窗口时，不显示 titleBar
                showTBar: '0',
              },
            };
            LonchJsApi.openUrl(url);
          } else if (issuePartyParams === '2' && tencentAuthStatus === '1') {
            this.$toast({
              text: '腾讯实名认证不提供CA证书',
            });
          } else {
            this.toRZHFunction(humanId, issuePartyParams);
          }
        },
        () => {},
        this
      );
    },
  }
}
