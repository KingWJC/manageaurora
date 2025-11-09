<template>
  <div>
    <div v-if="!isMobile && (cornerMarker.yunCall || cornerMarker.customerService) && (CFG.token || CFG.client.clientInfo.token)" class="m_cornerMarker">
      <ul class="m_cornerMarker_list" v-drag>
        <li v-if="yunCall.openWbShow && !isMobile" class="m_cornerMarker_list_li flex flex-column flex-items-center" :class="{ 'is_bottom': cornerMarker.customerService }">
          <div class="callDiv">
            <div @click="openYunCall()" class="mini-workbench">
              <img v-show="!yunCall.openStatus" style="width: 36px; height: 36px" src="https://resources.lonch.com.cn/bi/crm/2020/11/26/yunhu2020112618051320201126181448.png" alt="">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="m_title">呼叫中心</div>
        </li>
        <li v-if="customerService.openWbShow && !isMobile" class="m_cornerMarker_list_li flex flex-column flex-items-center">
          <div class="callDiv">
            <div @click="openCustomerService()" class="mini-workbench">
              <img v-show="!customerService.openStatus" style="width: 36px; height: 36px" src="https://resources.lonch.com.cn/bi-dev/crm/2021/01/08/mmexport160751392228120210108193720.jpg">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="m_title">在线客服</div>
        </li>
      </ul>
    </div>
    <!-- <div class="m_cornerMarker">
      <ul class="m_cornerMarker_list" v-drag>
        <li class="m_cornerMarker_list_li flex flex-column flex-items-center" :class="{ 'is_bottom': cornerMarker.customerService }">
          <div class="callDiv">
            <div @click="openYunCall()" class="mini-workbench">
              <img v-show="!yunCall.openStatus" style="width: 36px; height: 36px" src="https://resources.lonch.com.cn/bi/crm/2020/11/26/yunhu2020112618051320201126181448.png" alt="">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="m_title">呼叫中心</div>
        </li>
        <li class="m_cornerMarker_list_li flex flex-column flex-items-center">
          <div class="callDiv">
            <div @click="openCustomerService()" class="mini-workbench">
              <img v-show="!customerService.openStatus" style="width: 36px; height: 36px" src="https://resources.lonch.com.cn/bi-dev/crm/2021/01/08/mmexport160751392228120210108193720.jpg">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="m_title">在线客服</div>
        </li>
      </ul>
    </div> -->
    <!-- 增加 氧舱设备检修中浮窗-->
    <!-- 
      如果当前登录人有氧舱运维工程师角色
      且同时该人下有氧舱正在检修
      才会显示此图标
     -->
    <div class="m_cornerMarker fixedO" v-if="isOption && isHave">
      <ul class="m_cornerMarker_list" v-drag>
        <li class="m_cornerMarker_list_li flex flex-column flex-items-center" @click="openOxygenCabin()">
          <div class="callDiv power-cursorPointer">
            <div class="mini-workbench">
              <img style="width: 36px; height: 36px" src="https://resources.lonch.com.cn/ybd/image/20240419-OxygenCabinOverhaul-logo-01.png">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="m_title tac power-cursorPointer">氧舱设备检修中</div>
        </li>
      </ul>
    </div>
    <div v-if="!isMobile && (cornerMarker.yunCall || cornerMarker.customerService) && (CFG.token || CFG.client.clientInfo.token)">
      <template v-if="cornerMarker.yunCall">
        <DefaultFrames v-show="yunCall.openStatus" ref="yunCall" name="yuncall" :url-list="urlCheck(globalData.yuncallService + '/main/controlPanel')" />
      </template>
      <template v-if="cornerMarker.customerService">
        <DefaultFrames v-show="customerService.openStatus" ref="customerService" name="customerService" :url-list="urlCheck(globalData.yuncallService + '/main/customerServiceControlPanel')" />
      </template>
    </div>
    <div id="dragbtn" style="display:none"></div>
  </div>
</template>

<script>
import drag from '../drag/index.js';
import DefaultFrames from './iframe';
export default {
    name: 'suspensionFrame',
    components: {
      drag,
      DefaultFrames
    },
    props: {},
    data() {
      return {
        /**
         * 判断是否是氧舱运维角色
         */
        isOption: false,
        /**
         * 判断登录人下是否有正在检修的氧舱设备
         */
        isHave: false,
        cornerMarker: {   // 弹框按钮
          yunCall: false,
          customerService: false
        },
        isMobile: false,  // 是否为移动端
        yunCall: {
          openWbShow: false,  // 按钮显示
          openStatus: false   // 展开状态
        },
        customerService: {
          openWbShow: false,  // 按钮显示
          openStatus: false   // 展开状态
        }
      };
    },
    created() {
      const _self = this;
      // 1 手机 2 pc
      if(_self.CFG.client.isMobile || _self.CFG.client.isAndroid || _self.CFG.client.isIPhone || _self.CFG.client.isIPad) {
        _self.isMobile = true;
      } else {
        _self.isMobile = false;
      }
      /**
       * 判断当前登录人
       * 是否是氧舱运维工程师角色
       */
      if(/^manage$/i.test(this.CFG.projectName)){
        this.isCheckBarRuler();
      }
    },
    mounted() {
      // if(!(/^yaoFaCai$/i.test(this.CFG.client.appName)) && typeof(this.$route.query.showTBar) === 'undefined') {
      if(!this.CFG.client.isApp) {
        // 加载在线客服入口
        // this.onlineCustomerServicePortal();
      }
      // 非移动端设备，并且非外部项目引入的页面
      if(!this.isMobile && typeof this.$route.query.showTBar === 'undefined' && /^manage$/i.test(this.CFG.projectName)) {
        if(this.CFG.token || this.CFG.client.clientInfo.token) {
          // 加载组件
          this.componentLoading();
        }
      }
    },
    methods: {
      /**
       * 判断当前登录人
       * 是否是氧舱运维工程师角色
       */
      isCheckBarRuler(){
        let that = this;
        this.API.send(this.CFG.services.operation.viewByLoginUser, {id: this.CFG.userInfo.id}, function (res) {
          res = {...res.serviceResult};
          /**
           * 判断该人是否是氧舱运维工程师角色
           */
          this.isOption = res.id ? true : false;
          /**
           * 如果角色有氧舱运维工程师角色
           * 继续向下查有氧舱运维工程师角色的人下是否有氧舱正在检修
           */
          if(this.isOption){
            this.API.send(this.CFG.services.opsMaintenanceOrder.viewByLoginUser, {}, function (resA) {
              resA = {...resA.serviceResult};
              /**
               * 判断该人下是否有检修的氧舱设备
               */
              this.isHave = resA.deviceSn ? true : false;
            }, function () {}, this)
            /**
             * 检查是否有检修设备
             */
            setInterval(() => {
              that.toContinu();
            }, 60000);
          }
        }, function () {}, this)
      },
      /**
       * 检查是否有检修设备
       */
       toContinu(){
        this.API.send(this.CFG.services.opsMaintenanceOrder.viewByLoginUser, {id: this.CFG.userInfo.id}, function (resA) {
          resA = {...resA.serviceResult};
          /**
           * 判断该人下是否有检修的氧舱设备
           */
          this.isHave = resA.data ? true : false;
        }, function () {}, this)   
       },
      /**
       * 跳转氧舱检修详情页
       */
      openOxygenCabin(){
        this.$router.push({
          path: '/admin/OxygenCabinOverhaulTo'
        })
      },
      urlCheck(url) {
        url = url + '?token=' + this.CFG.token || this.CFG.client.clientInfo.token;
        if (this.CFG.versionConfig && this.CFG.versionConfig.length > 0) {
          url = this.utils.transformationMachedVersion(url, this.CFG.versionConfig);
        }
        return url;
      },
      // 判断是否为chrome
      isChrome() {
        const userAgent = window.navigator.userAgent;
        if(userAgent.indexOf('Chrome') > -1) {
          const start = userAgent.indexOf('Chrome');
          const end = userAgent.indexOf(' Safari');
          const temp = userAgent.substring(start, end);
          const broName = temp.replace('Chrome/', '');
          const code = Number(broName.substring(0, broName.indexOf('.')));
          if(code > 58) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      onlineCustomerServicePortal() {
        let div = document.getElementsByTagName('head')[0];
        let script = document.createElement("script");
        script.src="https://resources.lonch.com.cn/third-library/portal-guide.js";
        script.setAttribute("chat_url", this.globalData.customerService + "?token=" + this.globalData.token);
        script.setAttribute("logo_src", "https://resources.lonch.com.cn/bi-dev/crm/2021/02/08/cclogo20210208110510.png");
        script.setAttribute("logo_position", "rb");
        script.setAttribute("tntInstId", "lonch");
        div.appendChild(script);
      },
      openYunCall() {
        const _self = this;
        if(_self.isChrome()) {
          if(typeof navigator.getUserMedia !== 'undefined') {
            if(_self.customerService.openStatus) {_self.customerService.openStatus = !_self.customerService.openStatus;}
            _self.yunCall.openStatus = !_self.yunCall.openStatus;
          } else {
            _self.$toast({
              text: '您的浏览器不支持navigator.getUserMedia方法，请更换浏览器后重试。'
            });
          }
        } else {
          _self.$toast({
            text: '呼叫中心仅支持版本号为58+的chrome浏览器，请更换浏览器后重试。'
          });
        }
      },
      openCustomerService() {
        if(this.yunCall.openStatus) {this.yunCall.openStatus = !this.yunCall.openStatus;}
        this.customerService.openStatus = !this.customerService.openStatus;
      },
      // 组件加载
      componentLoading() {
        // 加载呼叫中心
        this.loadYuncall();
        // 加载在线客服
        this.loadOnlineCustomerService();
      },
      // 呼叫中心加载
      loadYuncall() {
        const _self = this;
        // 获取用户登录状态
        _self.API.send(_self.CFG.services.crm.aliyunRefresh, {}, function(res) {
          res = res.serviceResult;
          // 判断是否显示按钮
          if (res == false || res == 'false') {
            _self.yunCall.openWbShow = false;
          } else {
            // 用户有权限登录  显示云呼按钮
            _self.yunCall.openWbShow = true;
            // if(_self.isChrome() && typeof navigator.getUserMedia !== 'undefined') {
              _self.cornerMarker.yunCall = true;
            // }
          }
        }, function() {}, _self);
      },
      // 在线客服加载
      loadOnlineCustomerService() {
        const _self = this;
        // _self.API.send(_self.CFG.services.customerservice.apiCheckConsumner, {customerservice: 0}, function(res) {
        _self.API.send(_self.CFG.services.im.imsEatstIsSeats, {}, function(res) {
          res = res.serviceResult;
          // // 判断是否显示按钮
          if (res == false || res == 'false') {
            _self.customerService.openWbShow = false;
          } else {
            _self.cornerMarker.customerService = true;
            _self.customerService.openWbShow = true;
          }
        }, function() {}, _self);
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  ::v-deep.fixedO {
    bottom: 285px!important;
  }
  ::v-deep.m_cornerMarker {
    position: fixed;
    bottom: 185px;
    right: 10px;
    width: 58px;
    min-width: 58px;
    z-index: 11;

    ul.m_cornerMarker_list {
      position: absolute;
      z-index: 12;
      background: rgba(0,0,0,.5);
      overflow: hidden;
      border-radius: 5px;

      li.m_cornerMarker_list_li {
        list-style-type: none;
        margin: 5px;

        &.is_bottom {
          bottom: 0;
        }

        .callDiv {
          min-width: 58px;
          position: relative;
          // bottom: 68px;
          // right: 35px;
          z-index: 11;
          padding: 5px 0;

          .el-icon-close {
            color: #040000;
          }

          .mini-workbench {
            width: 36px;
            height: 36px;
            border-radius: 18px;
            overflow: hidden;
            background: #efefef;
            margin-left: 11px;

            &:hover {
              background: #efefef;
            }
          }

          div {
            font-size: 18px;
            color: #fff;
            text-align: center;
            line-height: 36px;
            cursor: pointer;
          }
        }

        .m_title {
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
</style>
