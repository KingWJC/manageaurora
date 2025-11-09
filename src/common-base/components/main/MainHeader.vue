<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-09-07 14:05:57
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 22:39:13
 * @FilePath: \manage\src\common-base\components\main\MainHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    class="viewport-header viewport-header-padded viewport-header-l flex flex-column flex-content-center">
    <div class="flex flex-content-between flex-items-center">
      <div class="flex flex-content-start flex-items-center">
        <div @click="toggleLeftSide">
          <span>{{leftSideStatus?'':'菜单'}}</span>
          <span style="padding: 10px;padding-left: 0px;padding-right: 0px;"
                :class="leftSideStatus?'el-icon-d-arrow-left':'el-icon-d-arrow-right'">
            </span>
          <span>{{leftSideStatus?'菜单':''}}</span>
        </div>
        <!-- <div v-if="!isInApp" class="ml10 flex flex-content-start flex-items-center">
          <el-button type="text"><i class="el-icon-sort" style="transform: rotate(90deg);"></i><span style="margin-left: 2px;">切换身份</span></el-button>
          <el-menu :default-active="dataOwnerOrgId"
                   mode="horizontal"
                   menu-trigger="hover"
                   text-color="#333"
                   class="menu-org"
                   @select="handleOrgSelect">
            <el-submenu>
              <template slot="title">
                <div class="inline-block">
                  <span class="el-icon-sort" style="transform: rotate(90deg);"></span><span>{{currentOrg.name}}</span>
                </div>
              </template>
              <el-menu-item v-for="item in orgList" :index="item.id" :key="item.id">
                <div class="flex flex-content-between flex-items-center"
                     :class="{'current': item.id==dataOwnerOrgId}"><span>{{item.name}}</span></div>
              </el-menu-item>
              <el-menu-item index="ADD-A-ORG">+ 创建自定义组织</el-menu-item>
            </el-submenu>
          </el-menu>
        </div> -->
        <!--<span class="ml10 p10" @click="scanCode">-->
        <!--扫码-->
        <!--</span>-->
      </div>
      <div>
        <div class="flex flex-items-center" v-if="!isInApp">
          <ChatMessage v-if="isEnableChat"></ChatMessage>
          <span  class="mr10 link scanIcon" v-if="showScanIcon" @click="scanCodeMin"> <i class="el-icon-camera"></i></span>
          <span>您好，{{userInfo.name | formatEmpty('朗致用户')}}</span>
          <span class="avatar avatar-mini ml10 pointer" v-if="CFG.domainName === 'manage'" @click="onShowPersonDrawer"><img class="avatar avatar-mini" :src="avatar" alt="" srcset=""></span>
          <span class="email-setting-icon ml10 pointer" v-if="CFG.domainName === 'manage'" @click="toSettingMaill"><img class="email-setting-icon" src="https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/18/0a1ef607151a44efb23d55a88d07398b20250718230118.png" alt="" srcset=""></span>
          <span class="ml10 link" @click="isShowDialog=true" v-else>修改密码</span>
          <span class="ml10 link" v-if="globalData.domainName === 'platform'" @click="showUpdateLog()">更新日志</span>
          <span class="ml10 link" v-if="!CFG.client.isMiniprogram" @click="quit">{{CFG.client.isWxwork? '刷新' : '退出'}}</span>
        </div>
        <div v-if="isShowShare">
          <span class="flex flex-items-center" style="margin: 10px;" @click="share">
            <i class="icon-share" style="width: 1rem;height: 1rem;"></i>
            <i>分享</i>
          </span>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :modal-append-to-body="false"
      :visible.sync="isShowDialog"
      width="400px"
      height="500px"
      center>
      <v-modify-password v-if="isShowDialog" @status="modifyPasswordStatus"></v-modify-password>
    </el-dialog>
    <el-drawer
      :title="drawerTitle"
      direction="rtl"
      :append-to-body="true"
      :size="viewportWidth > 768 ? '50%' : '100%'"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :visible.sync="updateLog"
      :before-close="handleClose">
      <div class="log-box">
        <div class="textarea-box-top">
          <!-- <el-input
            class="full-width full-height"
            size="small"
            type="textarea"
            resize="none"
            style="height: 100%"
            readonly
            :autofocus="false"
            :validate-event="false"
            v-model="latelyLog.content">
          </el-input> -->
          <div class="full-width full-height pl10 pr10 pt5; box-contianer" contenteditable="false">
            {{latelyLog.content}}
          </div>
        </div>
        <div class="textarea-box">
          <SearchForm :formConfig="searchCols" :searchParams="searchParams" ref="serch" />
          <div class="flex-flex-auto panel" ref="viewBody" style="flex: 1">
            <div class="panel-content table-content-view full-height">
              <tableView v-if="isMounted" :list="list" :cols="cols" :height="'100%'"></tableView>
            </div>
          </div>
          <div class="p5 ofa tac full-width page-box">
            <el-pagination
              background
              layout="total, prev, pager, next"
              @current-change="currentPager"
              :page-size="searchParams.rowCount"
              :current-page="searchParams.current"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <el-dialog
          title="新增日志"
          :modal-append-to-body="false"
          :close-on-click-modal="true"
          :modal="false"
          :visible.sync="isAddUpdateLog"
          :width="viewportWidth > 768 ? '50%' : '320px' "
          height="500px"
          center>
          <formView :formConfig="formConfig"></formView>
          <div class="lc-row lc-space20">
            <div class="lc-col-6">
              <el-button
                class="full-width"
                @click="addData()"
                native-type="submit">保存
              </el-button>
            </div>
            <div class="lc-col-6">
              <el-button type="primary"
                        class="full-width"
                        @click="()=>{isAddUpdateLog = false;this.addDatatype = 1}">
                返回
              </el-button>
            </div>
          </div>
      </el-dialog>
    </el-drawer>
    <el-drawer
      title="我的"
      ref="personDrawerRef"
      :direction="viewportWidth > 768 ? 'rtl' : 'ttb'"
      :append-to-body="true"
      :size="'75%'"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :visible.sync="isPersonDrawerShow"
      :beforeClose="onPersonDrawerClose">
      <div class="person-drawer-box-0" v-if="personDrawerShowIndex === 0">
        <div class="header mb10">
          <div class="header-content">
            <span class="avatar" @click="toChangeHead"><img class="avatar" :src="avatar" alt="" srcset=""></span>
            <div class="flex-flex-auto flex flex-content-between flex-items-center">
              <div class="user-name-box">
                <span>
                  <span class="user-name">{{userInfo.name}}</span>
                  <!-- <el-tag class="ml5 mr5" size="mini" :type="userInfo.authStatus === '1' ? 'success' : 'warning'">{{ userInfo.authStatus === '1' ? '已认证' : '未认证' }}</el-tag> -->
                  <!-- 非小程序环境，且未实名认证的时候，展示去实名认证入口 -->
                  <!-- <span v-if="userInfo.authStatus !== '1'" class="link" @click=toRZH()>去实名认证</span> -->
                  <HumanAuth
                    type="tagTitle"
                    :authStatus="userInfo.authStatus"
                    :humanId="CFG.userInfo.id"
                    @toRZH="onPersonDrawerClose"
                  />
                </span>
                <span class="user-name-phone">{{phoneNumber}}</span>
              </div>
            </div>
            <div class="p10" @click="onClickSwitch">
              <img class="switch-icon iconfont" :src="switchIcon" alt="" srcset=""/>
            </div>
          </div>
        </div>
        <div class="content" v-show="!showSubMenu">
          <YfCard ref="yfCardRef" @toRZH="onPersonDrawerClose"></YfCard>
        </div>
        <div @click="openSubMenu('realname')" class="footer-li flex flex-content-between">
          <div class="flex flex-items-center">
            <div>实名认证</div>
            <div class="ml5 footer-li-icon">
              <icon :name="showSubMenu === 'realname' ? 'down' : 'up'" width="0.6em" height="0.6em"></icon>
            </div>
          </div>
          <icon name="realname" width="1em" height="1em" color="#888"></icon>
        </div>
        <!--实名认证卡片-->
        <div v-show="showSubMenu === 'realname'" class="content">
          <AuthenticationCard></AuthenticationCard>
        </div>
        <div @click="openSubMenu('collaboration')" class="footer-li flex flex-content-between">
          <div class="flex flex-items-center">
            <div>我的协同流程</div>
            <div class="ml5 footer-li-icon">
              <icon :name="showSubMenu === 'collaboration' ? 'down' : 'up'" width="0.6em" height="0.6em"></icon>
            </div>
          </div>
          <icon name="collaboration" width="1em" height="1em" color="#888"></icon>
        </div>
        <!--我的协同流程内容区-->
        <div v-show="showSubMenu === 'collaboration'" class="content">
          <div class="footer-ul pl20">
            <div class="footer-li flex flex-content-between flex-items-center" @click="toBps()">
              <div>我的协同流程</div>
              <icon name="right" width="0.6em" height="0.6em" color="#888"></icon>
            </div>
            <div class="footer-li flex flex-content-between flex-items-center" @click="toOnlinePay()">
              <div>在线收款</div>
              <icon name="right" width="0.6em" height="0.6em" color="#888"></icon>
            </div>
          </div>
        </div>
        <!--
        <div @click="toSettingMaill" class="footer-li flex flex-content-between">
          <div>邮箱管理</div>
          <icon name="mailsetting" width="1em" height="1em" color="#888"></icon>
        </div>
        -->
        <div @click="personDrawerShowIndex = 1" class="footer-li flex flex-content-between">
          <span class="footer-li-text">设置</span>
          <icon name="setting" width="1em" height="1em" color="#aaa"></icon>
        </div>
        <!--
        <div class="footer">
          <div class="footer-item-wrapper" @click="personDrawerShowIndex = 1">
            <div class="footer-item">
              设置
            </div>
            <i class="el-icon-s-tools"></i>
          </div>
        </div>
        -->
      </div>
      <div class="person-drawer-box-1" v-if="personDrawerShowIndex === 1">
        <div class="header">
          <i class="el-icon-arrow-left" @click="personDrawerShowIndex = 0"></i><span class="header-text">设置</span>
        </div>
        <div class="content">
           <ul>
              <li @click="onModifyPasswordInPersonDrawer">修改密码</li>
              <li @click="toAbout">
                关于
              </li>
            </ul>
        </div>
      </div>
      <div class="person-drawer-box-iframe full-width full-height" v-if="personDrawerShowIndex === 2">
        <div class="header">
          <i class="el-icon-arrow-left" @click="afterHeadChangedBack"></i><span class="header-text">更换头像</span>
        </div>
        <div class="content full-width">
          <iframe name="appbar-uploadHead" class="full-width full-height" :src="changeHeadUrl"></iframe>
        </div>
      </div>
      <div class="person-drawer-box-iframe full-width full-height" v-if="personDrawerShowIndex === 3">
        <div class="header">
          <i class="el-icon-arrow-left" @click="aboutBack"></i><span class="header-text">关于</span>
        </div>
        <div class="content full-width">
          <iframe name="appbar-about" class="full-width full-height" :src="aboutUrl"></iframe>
        </div>
      </div>
    </el-drawer>
    <!--邮箱管理-->
    <el-dialog
      title="邮箱管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-if="maillSetting.visible"
      :visible.sync="maillSetting.visible"
      custom-class="mail-seeting-dialog"
      center>
      <Email @close="maillSetting.visible = false"></Email>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import login from '../../login/login';
import VModifyPassword from './ModifyPassword';
import tableView from '@/common-base/components/pubComponents/tableView';
import SearchForm from '@/common-base/components/pubComponents/searchForm';
import YfCard from '@/common-base/components/common/card/yfCard';
import formView from '@/common-base/components/pubComponents/form';
import { setPermissionAction } from '@/common-base/api/permission';
import ChatMessage from '../chat/message.vue'
import portrait from '@/common-base/accsets/images/portrait.png';
import switchIcon from '@/common-base/accsets/images//switch-icon.svg';
import HumanAuth from '@/common-base/components/humanAuth';
// 邮箱管理
import Email from '@/common-base/components/common/card/yfCard/email'
// 实名认证卡片
import AuthenticationCard from '@/common-base/components/common/authenticationCard'

export default {
  components: {
    VModifyPassword,
    SearchForm,
    tableView,
    formView,
    ChatMessage,
    YfCard,
    HumanAuth,
    Email,
    AuthenticationCard,
  },
  props: {
    // 当前组织id
    dataOwnerOrgId: {
      type: String,
      default: ''
    },
    // 组织列表
    orgList: {
      type: Array,
      default () {
        return [];
      }
    },
    userInfo: {
      type: Object,
      default () {
        return {};
      }
    },
    leftSideStatus: {
      type: Boolean,
      default: true
    },
    showScanIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      moduleCode: '',
      permissions: {
        codes: {},
        names: {}
      },
      isShowDialog: false,
      isShowOrgDialog: false,
      isInApp: false,
      isShowShare: false,
      updateLog: false,
      searchCols: {},
      isMounted: false,
      switchIcon,
      personDrawerShowIndex: 0,
      isPersonDrawerShow: false,
      changedHead: false,
      changeHeadUrl: '',
      aboutUrl: '',
      formConfig: [],
      list: [], // 表格行数据
      cols: [], // 表格列配置数据
      total: 0,
      drawerTitle: '最近更新日志',
      current: 1,
      pageSize: 20,
      isAddUpdateLog: false,
      addDatatype: 1,//新增还是修改 1为新增, 0 为编辑
      form: {
        content: '',
        issueTime: '',
        title: ''
      },
      pageList: [],
      searchParams: {
        current: 1,
        rowCount: 20
      },
      latelyLog: {
        content: ''
      },
      viewportWidth: window.document.body.clientWidth,
      //wxConfig: {
      //  beta: true,
      //  debug: true,
      //  appId: 'ww98055e27dd1e67fd',
      //  nonceStr: 'Wm3WZYTPz0wzccnW',
      //  timestamp: '1586355960',
      //  signature: '64887fb5c58838cf8bb2a31ae6d45b1a01b454ba',
      //  jsApiList: ['scanQRCode']
      //}
      // 邮箱设置
      maillSetting: {
        visible: false,
        url: '',
        top: undefined,
      },
      // 展示的子菜单
      showSubMenu: '',
    };
  },
  created () {
    this.isInApp = LonchJsApi.isInApp();
    this.isShowShare = LonchJsApi.isInIosApp() || LonchJsApi.isInAndroidApp();
    if(this.globalData.domainName === 'platform'){
      this.initJournalData();
    }
  },
  methods: {
    /**
     * 设置屏幕宽度
     *
     */
    handleResizeViewportWidth() {
      this.viewportWidth = window.document.body.clientWidth;
    },
    /**
     * 点击 switch 按钮
     */
    onClickSwitch() {
      this.$toast({ text: "努力开发中~" })
    },
    /**
     * 获取用户信息
     */
    getOperationInfo() {
      return new Promise((resolve, reject) => {
        this.API.send({
          module: 'ca',
          url: '/employee/viewLzEmployeeByHumanId',
          method: 'POST',
          comment: '获取用户信息'
        }, {
          id: this.CFG.userInfo.id,
        }, (res) => {
          const result = res?.data;
          if(result) {
            resolve(result);
          } else {
            reject();
          }
        }, () => {
          reject()
        }, this, true);
      });
    },
    checkHeadChanged() {
      if (this.changedHead) {
        this.API.send(
          this.CFG.services.sy.selectHumanByToken,
          {},
          (res) => {
            if (res.opFlag) {
              res = res.serviceResult;
              this.CFG.userInfo.portrait = res.portrait;
              this.userInfo.portrait = res.portrait;
              this.changedHead = false;
            }
          },
          () => {},
          this,
          true
        );
      }
    },
    afterHeadChangedBack() {
      this.checkHeadChanged();
      this.personDrawerShowIndex = 0;
    },
    toChangeHead() {
      const product = this.CFG.origins.find(v => v.name === 'appbar');
      let url = this.utils.transformationMachedVersion(product.domain, this.CFG.versionConfig);
      this.changeHeadUrl = `${url}/#/uploadHead?appName=manage&token=${this.CFG.token}`;
      this.personDrawerShowIndex = 2;
      this.changedHead = true;
    },
    toAbout() {
      const product = this.CFG.origins.find(v => v.name === 'appbar');
      let url = this.utils.transformationMachedVersion(product.domain, this.CFG.versionConfig);
      this.aboutUrl = `${url}/#/about?hideBar=true&appName=manage&token=${this.CFG.token}`;
      this.personDrawerShowIndex = 3;
    },
    aboutBack() {
      this.personDrawerShowIndex = 1;
    },
    onPersonDrawerClose(done) {
      this.isPersonDrawerShow = false;
      this.personDrawerShowIndex = 0;
      this.checkHeadChanged();
      if(done && typeof done === 'function') {
        done();
      }
    },
    onShowPersonDrawer() {
      this.isPersonDrawerShow = true;
    },
    onModifyPasswordInPersonDrawer() {
      this.$refs.personDrawerRef.closeDrawer();
      this.isShowDialog = true;
    },
    // 实名认证
    // toRZH(){
    //   this.$refs.personDrawerRef.closeDrawer();
    //   if (this.CFG.client.isMiniprogram) {
    //     LonchJsApi.openUrl({
    //       originName: 'manage',
    //       routePath:'/admin/eContract/certificationPersonalTencent',
    //       query: {
    //         moduleCode: '140310',
    //         isback: 'true',
    //         appName: 'manage'
    //       }
    //     });
    //   } else {
    //     LonchJsApi.openUrl({
    //       originName: 'manage',
    //       routePath:'/admin/eContract/certificationPersonal',
    //       query: {
    //         moduleCode: '140300',
    //         isback: 'true',
    //         appName: 'manage'
    //       }
    //     });
    //   }
    // },
    //scanCode () {
    //  jweixin.config(this.wxConfig)
    //  jweixin.ready(function() {
    //    alert('--jweixin ready--')
    //    jweixin.scanQRCode({
    //      desc: 'scanQRCode desc',
    //      needResult: 0, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
    //      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
    //      success: function() {
    //        // 回调
    //      },
    //      error: function(res) {
    //        if (res.errMsg.indexOf('function_not_exist') > 0) {
    //          alert('版本过低请升级')
    //        }
    //      }
    //    })
    //  })
    //  jweixin.error(function () {
    //    //alert('--wx error--')
    //  })
    //},

    /**  小程序端扫码入口 **/
    scanCodeMin() {
      this.$emit('scanCodeMin');
    },
    /**
     * 分享
     */
    share () {
      let shareUrl = this.utils.url2sharePathByMachedVersion(window.location.href, this.CFG.versionConfig);
      if (/\/admin\/multiFrames/.test(shareUrl)) {
        let shareParams = this.utils.getParams(shareUrl);
        if (shareParams && shareParams.url) {
          let subUrl = decodeURIComponent(window.atob(decodeURIComponent(shareParams.url)));
          subUrl = this.utils.url2sharePathByMachedVersion(subUrl, this.CFG.versionConfig);
          subUrl = window.btoa(encodeURIComponent(subUrl));
          shareUrl = this.utils.makeUrl(shareUrl, {url: subUrl});
        }
      }
      let args = {
        shareType: 'web',
        webpageUrl: shareUrl,
        title: document.title,
        description: '朗致·理想国-因梦想而联接',
        thumbImage: 'https://resources.lonch.com.cn/bi/img-library/icon_lonchf.png',
        //hdImage:'https://resources.lonch.com.cn/bi/14de138033be7943489a5c3c612bdbf2.png'
      };
      this.API.send(
        {command: 'shareToOtherApp'},
        args,
        function () {
        },
        function () {
        },
        this, true
      );
    },
    toView (row) {
      this.latelyLog = row;
      this.drawerTitle = row.issueTime + ' ' + row.title;
    },
    toDelete (row) {
      this.API.send(this.CFG.services.universalreport.issuesDelete, {id: row.id}, function () {
        this.getData(this.searchParams);
      }, function () {
      }, this);
    },
    toUpdate (row) {
      this.addDatatype = 0;
      this.isAddUpdateLog = true;
      this.form.title = row.title;
      this.form.content = row.content;
      this.form.issueTime = row.issueTime;
      this.form.id = row.id;
    },
    addView () {
      this.addDatatype = 1;
      this.form.title = '';
      this.form.content = '';
      this.form.issueTime = '';
      this.isAddUpdateLog = true;
    },
    //setCurrentPageData () {
    //
    //  let begin = (this.current - 1) * this.pageSize;
    //  let end = this.current * this.pageSize;
    //  this.list = this.pageList.slice(
    //    begin,
    //    end
    //  );
    //},
    currentPager (p) {
      this.searchParams.current = p;
      this.getData(this.searchParams);
    },

    showUpdateLog () {
      this.updateLog = true;
      this.getData(this.searchParams);
      this.$nextTick(() => {
        // this.gridHeight = window.innerHeight - (window.innerHeight * 0.25) - 200 + 'px';
        this.isMounted = true;
      });
    },
    searchUniversalreport(){
      this.searchParams.current = 1;
      this.getData(this.searchParams);
    },
    /**
     * 查询表格数据
     * @param args 查询参数
     */
    getData (args) {
      let data = {...args};
      if (data.begin) {
        data.begin = this.utils.formatDate(data.begin, 'yyyy-MM-dd hh:mm:ss');
      }
      if (data.end) {
        data.end = this.utils.formatDate(data.end, 'yyyy-MM-dd') + ' 23:59:59';
      }

      this.API.send(this.CFG.services.universalreport.issuesList, data, function (res) {
        let result = res.serviceResult;
        if (result.newest) {
          let newest = result.newest;
          this.drawerTitle = newest.issueTime + ' ' + newest.title;
          this.latelyLog = newest;
        }
        let pageList = result.pageList;
        this.list = pageList.rows||[];
        this.total = pageList.total || this.total;
        //this.setCurrentPageData();
      }, function () {
      }, this);
    },
    /**
     * 验证必填字段
     */
    isMustKeys () {
      let flag = true;
      this.formConfig.forEach(i => {
        if (flag && i.required && !this.form[i.id]) {
          this.$toast({text: i.placeholder});
          flag = false;
        }
      });
      return flag;
    },
    addData () {
      if (!this.isMustKeys()) {
        return;
      }
      let config;
      let args = {...this.form};
      if (this.addDatatype) {
        config = this.CFG.services.universalreport.issuesSave;
        delete this.form.id;
      } else {
        config = this.CFG.services.universalreport.issuesUpdate;
      }
      args.issueTime = this.utils.formatDate(args.issueTime, 'yyyy-MM-dd hh:mm:ss');
      this.API.send(config, args, function () {
        this.isAddUpdateLog = false;
        this.getData(this.searchParams);
      }, function () {
      }, this);
    },
    handleClose () {
      this.updateLog = false;
    },
    closeOrgDialog () {
      this.isShowOrgDialog = false;
    },
    getOrgById (id) {
      for (let item of this.orgList) {
        if (item.id === id) {
          return item;
        }
      }
      return null;
    },
    onOrganizationCreated: function (org) {
      this.closeOrgDialog();
      //this.$emit('org-created')
      this.changeOrg(org);
    },
    handleOrgSelect: function (key) {
      if (key === 'ADD-A-ORG') {
        this.isShowOrgDialog = true;
      } else {
        let org = this.getOrgById(key);
        this.changeOrg(org);
      }
    },
    modifyPasswordStatus: function (status) {
      if (status) {
        this.isShowDialog = false;
      }
    },
    quit: function () {
      login.toLogOut();
    },
    changeOrg (org) {
      this.$emit('org-change', org);
    },
    toggleLeftSide () {
      this.$emit('toggle-left-side');
    },
    initActions (moduleCode) {
      let codes = {};
      let names = {};
      let actions = this.getActionsByModuleCode(moduleCode);
      for (let action of actions) {
        let code = action.code;
        if (action.permissionType !== 'data' && code.length > 6) {
          code = code.substring(6);
        }
        codes[code] = action.name;
        names[action.actionName] = code;
      }
      this.permissions.codes = codes;
      this.permissions.names = names;
    },
    getActionsByModuleCode (moduleCode) {
      let actions = [];
      let permissions = this.utils.matchedData(this.CFG.permissions, 'code', moduleCode, true);
      for (let item of permissions) {
        if (item.actions && item.actions.length > 0) {
          actions = Array.prototype.concat.call(actions, item.actions);
        }
      }
      return actions;
    },
    initJournalData () {
      const _self = this;
      _self.$nextTick(async () => {
        _self.moduleCode = '150100';
        await setPermissionAction(_self.moduleCode );
        if (_self.moduleCode) {
          _self.initActions(_self.moduleCode);
        }
      });
      this.searchCols = {
        form: [
          {
            label: '开始日期', id: 'begin', width: '150', isSearch: true, type: 'date'
          },
          {
            label: '结束日期', id: 'end', width: '150', isSearch: true, type: 'date'
          }
        ],
        searBths: [
          {
            name: '查询', click: () => {
              this.searchUniversalreport();
            }
          },
          {
            name: '新增', click: () => {
              this.addView();
            }, condition: () => {
              return this.permissions.names.add;
            }
          }
        ]
      };
      this.cols = [
        {
          label: '日期', id: 'issueTime', width: '110', type: 'date'
        },
        {
          label: '标题', id: 'title', width: '150', type: 'text'
        },
        {
          label: '操作', width: '140', btns: [
            {
              name: '详情', click: (row) => {
                _self.toView(row);
              }
            },
            {
              name: '修改', click: (row) => {
                _self.toUpdate(row);
              },
              condition: () => {
                return this.permissions.names.modify;
              }
            },
            {
              name: '删除', click: (row) => {
                this.$confirm({
                  title: '提示',
                  text: '您确认删除该数据吗？',
                  buttons: [
                    {
                      text: '取消',
                      type: 'follow'
                    },
                    {
                      text: '确定',
                      type: 'primary',
                      callback: () => {
                        _self.toDelete(row);
                      }
                    }
                  ]
                });
              }, condition: () => {
                return this.permissions.names.delete;
              }
            }
          ]
        }
      ];
      this.formConfig = [
        {
          label: '日期',
          id: 'issueTime',
          placeholder: '请选择日期',
          format: 'yyyy-MM-dd HH:mm:ss',
          dateType: 'datetime',
          mwidth: '80px',
          lg: 24, xl: 24, md: 24,
          type: 'date',
          w100: true,
          required: true,
          model: this.form
        },
        {
          label: '标题',
          id: 'title',
          mwidth: '80px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.form,
          required: true
        },
        {
          label: '日志内容',
          required: true,
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入日志内容',
          id: 'content',
          mwidth: '80px',
          type: 'textarea',
          w100: true,
          model: this.form,
          rows: 10,
          maxlength: 5000
        }
      ];
    },
    /**
     * 打开邮箱管理页面
     */
    toSettingMaill() {
      // 老逻辑
      // this.maillSetting.visible = true;
      // 修改为打开邮箱管理页面
      LonchJsApi.openUrl({
        originName: 'chart',
        routePath:'/main/lonchEmail',
        query: {
          moduleCode: '310400',
          isback: 'true',
          appName: 'manage'
        }
      });
    },
    /**
     * 打开子菜单
     */
    openSubMenu(type) {
      if(this.showSubMenu === type) {
        this.showSubMenu = '';
      } else {
        this.showSubMenu = type;
      }
    },
    /**
     * 跳转我的协同流程
     */
    toBps() {
      this.isPersonDrawerShow = false;
      LonchJsApi.openUrl({
        originName: 'workflow',
        routePath:'/bps/approveEntry',
        query: {
          moduleCode: '196001',
          isback: 'true',
          appName: 'manage'
        }
      });
    },
    /**
     * 跳转在线收款
     */
    toOnlinePay() {
      this.isPersonDrawerShow = false;
      LonchJsApi.openUrl({
        originName: 'manage',
        routePath:'/onlinePay',
        query: {
          moduleCode: '567936',
          isback: 'true',
          appName: 'manage'
        }
      });
    },
  },
  computed: {
    phoneNumber() {
      if (!this.userInfo.cellphone) {
        return;
      }
      if (this.userInfo.cellphone === this.userInfo.name) {
        return;
      }
      if (String(this.userInfo.cellphone).length > 4) {
        return this.userInfo.cellphone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }
      return this.userInfo.cellphone;
    },
    avatar() {
      const avatar = this.userInfo?.portrait || portrait;
      if (/^https?:\/\//i.test(avatar) && avatar.includes('lonch.oss')) {
        return `${avatar}?x-oss-process=image/format,jpg/resize,limit_0,m_fill,w_60,h_60`;
      }
      return avatar;
    },
    currentOrg () {
      return this.getOrgById(this.dataOwnerOrgId) || {};
    },
    isEnableChat() {
      return !!this.$TIM
    },
  },
  mounted () {
    window.addEventListener('resize', this.handleResizeViewportWidth);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResizeViewportWidth);
  }
};
</script>
<style lang="scss" scoped>
.log-box{
  display: flex;
  flex-direction: column;
  height: 100% ;

  .box-contianer{
    white-space: pre-wrap;
    overflow: auto;
    border: 1px solid #f1f1f1
  }

  .textarea-box-top{
    height: 200px;
  }
  .textarea-box{
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: calc(100% - 200px);
    .page-box {
      height: 50px; flex-shrink: 0;
    }
  }

}
.box-contianer{
  white-space: pre-wrap;
  overflow: auto;
  border: 1px solid rgb(241, 241, 241);
  line-height: 22px;
  height: 100%;
}
.scanIcon{
  font-size: 1.5rem;
}
.avatar {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 25px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &-mini {
    width: 20px;
    height: 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
.email-setting-icon {
  width: 20px;
  height: 20px;
}
.person-drawer-box-0 {
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    padding: 12px;
    border: 1px solid #dcdee2;
    border-radius: 5px;
    &-content {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .content {
    height: 0;
    flex-grow: 1;
    overflow-y: auto;
  }
  .footer {
    padding: 0 20px;
    &-item-wrapper {
      padding: 20px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 16px;
      border-top: 1px solid #dadada;
      &-item {
        font-size: 16px;
        font-weight: 500;
      }
    }

  }
  .footer-ul {
    border-top: 1px solid #dadada;
  }
  .footer-li {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid #dadada;
    &:first-child {
      border-top: none;
    }
  }
}
.person-drawer-box-1 {
  width: 100%;
  .header {
    height: 50px;
    padding-left: 20px;
    padding-right: 40px;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #dadada;
    border-top: 1px solid #dadada;
    display: flex;
    font-size: 16px;
  }
  .header-text {
    flex: 1;
    text-align: center;
  }
  .content {
    flex: 1;
  }
  li {
    list-style: none;
    padding: 0 20px;
    font-size: 15px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #dadada;
    color: #7b90de;
  }
}
.person-drawer-box-iframe {
  width: 100%;
  .header {
    height: 50px;
    padding-left: 20px;
    padding-right: 40px;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #dadada;
    border-top: 1px solid #dadada;
    display: flex;
    font-size: 16px;
  }
  .header-text {
    flex: 1;
    text-align: center;
  }
  .content {
    height: calc(100% - 50px);
  }
}
.user-name {
  font-weight: 600;
  font-size: 20px;
  &-box {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
  &-phone {
    margin-top: 5px;
    font-size: 14px;
  }
}
</style>
