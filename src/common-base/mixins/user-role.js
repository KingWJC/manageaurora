import login from '@/common-base/login/login'
import EmptPermissionTip from '@/common-base/accsets/images/empty_permission_tip.jpg'

export default {
  methods: {
    /**
     * 校验用户是否是空的权限
     */
    checkUserPermission(callback) {
      // 在iframe里，不用查询角色列表
      // 版本控制不加载权限
      // 版本控制不加载用户信息
      if (this.CFG.isNonPermissions || this.CFG.isNonUserInfo || window.self !== window.top) {
        callback();
      } else {
        if(this.CFG.isNonCompulsoryLogin) {
          callback();
          LonchJsApi.unBindMsgHandlers({
            //解绑app消息推送事件
            appSendDataToH5: this.handleMsgFromApp,
          });
        } else {
          let url = {'module': 'uaapi','url': '/user/queryAccountRoleMessage', 'comment': '查询用户当前角色'};
          // 云诊室s 项目 app场景下（支持离线操作），支持 /user/queryAccountRoleMessage 接口本地缓存
          if(/^angelswings$/i.test(this.CFG.projectName) && LonchJsApi.isInApp()) {
            url = {...url, ...{cache: true, networkFirst: true,}}
          }
          this.API.send(
            url,
            {
              humanId: this.CFG.userInfo.id
            },
            function (res) {
              const result = res && res.data || [];
              if(result.length === 0) {
                this.showRegisteredPopup(this.assignUserRole, callback);
              } else {
                // 在CFG缓存用户角色
                this.CFG.userRoles = result;
                callback();
                LonchJsApi.unBindMsgHandlers({
                  //解绑app消息推送事件
                  appSendDataToH5: this.handleMsgFromApp,
                });
              }
            },
            function () {
            },
            this
          );
        }
      }
    },
    /**
     * 给用户增加当前产品的朗致星角色
     */
    assignUserRole() {
      this.API.send(
        {'module': 'uaapi','url': '/user/addUserBaseRole', 'comment': '给用户添加朗致星角色'},
        {
          humanId: this.CFG.userInfo.id
        },
        function (res) {
          const result = res && res.data || {};
          if(result) {
            this.utils.clearCache(null, this.addRoleToReloadPage);
          }
        },
        function () {
        },
        this
      );
    },
    /**
     * 打开是否开通的弹窗
     * @param {*} assignUserRole 
     */
    showRegisteredPopup(assignUserRole) {
      const emptyRoleRegistered = document.getElementById('emptyRoleRegistered');

      // 判断弹窗是否存
      if(emptyRoleRegistered) {
        emptyRoleRegistered.removeEventListener('click', this.nextIsRegistered);
        emptyRoleRegistered.parentNode.removeChild(emptyRoleRegistered);
      }
      const registeredPopup = document.createElement('div');
      registeredPopup.id = 'emptyRoleRegistered';
      registeredPopup.style = `position: fixed;z-inedx:9999;top:0;right:0;bottom:0;left:0;width:100%;height:100%;background:#e0ebf6;display:flex;align-items:center;justify-content:center;`;
      registeredPopup.innerHTML = `
        <div id="popup" style="text-align:center;background:#fff url(${EmptPermissionTip}) left top no-repeat;background-size:100% auto;border-radius:20px;overflow:hidden;width:240px;height:auto;align-items:center;box-shadow: 0 0 6px rgba(0, 0, 0, 0.18);">
          <div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:16px;line-height:24px;color:#666;">
            <div style="padding-top:160px;padding-bottom:20px;">
              您还未开通“${this.CFG.project.title}”<br />是否开通？
            </div>
          </div>
          <div style="height:110px;padding-bottom:20px;width: 100px;margin:0 auto;">
            <button style="cursor: pointer;margin-bottom:10px;background: linear-gradient(to bottom, #57c1fc, #17b0fe);color:white;border:none;border-radius:40px;width:100%;height:40px;box-shadow: 0 0 6px rgba(0, 180, 255, 0.25);" id="registeredPopupConfirmBtn">是</button>
            <button style="cursor: pointer;box-size:border;border:#ddd 1px solid;background:#fff;border-radius:40px;width:100%;line-height:40px;color:#666;box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);" id="registeredPopupCancelBtn">否</button>
          <div>
        </div>
      `;
      // 添加弹窗事件监听
      registeredPopup.addEventListener('click', (event) => {
        this.nextIsRegistered(event, assignUserRole);
      })
      document.body.appendChild(registeredPopup);
    },
    /**
     * 选择：注册，还是退出
     * @param {*} event 
     * @param {*} callback 
     */
    nextIsRegistered(event, assignUserRole) {
      const target = event.target || event.srcElement;
      if(target.id === 'registeredPopupConfirmBtn') {
        // 用户同意，刷新页面
        assignUserRole();
      } else if(target.id === 'registeredPopupCancelBtn') {
        // 用户不同意，退出登录
        login.toLogOut();
      }
    },
    /**
     * 添加朗致星后
     * 要重载页面
     */
    addRoleToReloadPage() {
      const url = window.location.href;
      let nohashdUrl = url.split('#')[0];
      if(nohashdUrl.includes('?')) {
        window.location.replace(url.replace('#', '&time='+(new Date()).getTime()+'#'));
      } else {
        window.location.replace(url.replace('#', '?time='+(new Date()).getTime()+'#'));
      }
    },
    handleMsgFromApp(res) {
      const {type, msg} = res && res.serviceResult || {};
      if (type === '2001') {
        const keyword = Number(msg);
        switch (keyword) {
          // 确定
          case 4:
            this.assignUserRole();
            break;
          // 取消
          case 6:
            login.toLogOut();
            break;
          default:
            break;
        }
      }
    }
  },
  mounted() {
    if(this.CFG.projectName === 'telescreen') {
      LonchJsApi.bindMsgHandlers({
        //绑定app消息推送事件
        appSendDataToH5: this.handleMsgFromApp,
      });
    }
  }
}