<template>
  <div class="viewport-fixed" id="app" ref="app">
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-content-start">
        <left-side
          v-if="CFG.client.isApp || CFG.token"
          ref="leftSide"
          :isHideDefaultSide="isHideDefaultSide"
          :permissions="permissions"
          :data-owner-org-id="dataOwnerOrgId"
          :is-show="isShowLeftSide"
          :is-auto-close-left-side="viewportWidth < 768 ? true : false"
          @close-left-side="hiddeLeftSide"
        >
        <template #leftSide>
          <slot name="leftSide"></slot>
        </template>
        </left-side>

        <div class="main-content">
          <div class="viewport-fixed">
            <main-header
              v-if="isShowMainHeader"
              :user-info="userInfo"
              :data-owner-org-id="userInfo.dataOwnerOrgId"
              :org-list="
                userInfo.dataOwnerOrgList ? userInfo.dataOwnerOrgList : []
              "
              :left-side-status="isShowLeftSide"
              :showScanIcon="showScanIcon"
              @scanCodeMin="scanCodeMin"
              @org-change="onOrgChange"
              @org-created="updateUserInfo"
              @toggle-left-side="toggleLeftSide"
            >
            </main-header>
            <title-bar :title="$route.meta.name"></title-bar>
            <div class="viewport-view">
              <div class="viewport-view-body">
                <keep-alive>
                  <router-view
                    v-if="$route.meta.keepAlive && CFG.isInitialized"
                  />
                </keep-alive>
                <router-view
                  v-if="!$route.meta.keepAlive && CFG.isInitialized"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 右下角角标 -->
        <suspensionFrame
          v-if="
            isShowMainHeader && suspensionFrameShow && isShowSuspensionFrame
          "
        />
      </div>
    </div>
    <el-dialog
      title="补全身份信息"
      append-to-body
      :modal-append-to-body="false"
      :visible.sync="isShowDialog"
      width="360px"
      center
    >
      <v-form
        v-if="isShowDialog"
        :entity="userInfo"
        @cancel="closeEditDialog"
      ></v-form>
    </el-dialog>
    <!--游客绑定手机号-->
    <!--<el-dialog-->
    <!--title="绑定手机号"-->
    <!--append-to-body-->
    <!--:modal-append-to-body="false"-->
    <!--:visible.sync="isShowBindMobileDialog"-->
    <!--:show-close="false"-->
    <!--:close-on-click-modal="false"-->
    <!--:close-on-press-escape="false"-->
    <!--width="360px"-->
    <!--center>-->
    <!--<v-bind-mobile v-if='isShowBindMobileDialog' @cancel="closeEditDialog"></v-bind-mobile>-->
    <!--</el-dialog>-->
    <!-- 实名认证组件取消，直接跳转 manage 自然人实名认证申请单页面  -->
    <!-- <smrz v-if="isShowBindMobileDialog" :id="userInfo.id"></smrz> -->
  </div>
</template>

<script type="text/ecmascript-6">
import login from '../../login/login';
import suspensionFrame from '../common/suspensionFrame';
// import smrz from '../smrz';
import TitleBar from '../title-bar';
import VBindMobile from '../user/BindMobileNumber';
import LeftSide from './LeftSide';
import MainHeader from './MainHeader';
import VForm from './UserInfoForm';

export default {
  components: {
    LeftSide,
    //VModifyPassword,
    MainHeader,
    TitleBar,
    // smrz,
    VForm,
    VBindMobile,
    suspensionFrame
  },
  props: {
    isShowSuspensionFrame: {
      type: Boolean,
      default: false
    },
    /**
     * 是否隐藏默认左侧菜单
     */
    isHideDefaultSide: {
      type: Boolean,
      default: false
    },
    showScanIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewportWidth: '',
      isShowLeftSide: false,
      isShowDialog: false,
      isShowMainHeader: false,
      isShowTitleBar: false,
      suspensionFrameShow: false,
      dataOwnerOrgId: '',
      userId: '',
      commonParams: {},
      permissions: [],
      userInfo: {},
      // isShowBindMobileDialog: false
    };
  },
  created() {
    this.viewportWidth = this.CFG.viewportWidth;
    this.permissions = this.CFG.permissions;
    this.updateMainLayoutByAppName(this.CFG.projectName);
    if (window.self === window.top) {
      this.checkUserInfo();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.suspensionFrameShow = true;
    });
  },
  methods: {
    showEditDialog() {
      this.isShowDialog = true;
    },
    closeEditDialog() {
      this.isShowDialog = false;
    },
    // showBindMobileDialog() {
    //   this.isShowBindMobileDialog = true;
    // },
    // closeBindMobileDialog() {
    //   this.isShowBindMobileDialog = false;
    // },
    updateUserInfo() {
      this.getUserByToken({});
    },
    updateMainLayoutByAppName() {
      let isShowMainHeader = true;
      let isShowLeftSide = this.CFG.isShowLeftSide;
      const query = this.$route.query;
      if (window.self != window.top) {
        // 在iframe中，不显示顶栏
        this.isShowMainHeader = false;
        this.isShowLeftSide = false;
      } else if (this.$route.query.isShowMainHeaderLeftSide === '0') {
        // 如果路由参数含有 isShowMainHeaderLeftSide === 0 时，不显示顶栏和左侧菜单
        this.isShowMainHeader = false;
        this.isShowLeftSide = false;
      } else {
        if (
          /^yaofacai$/i.test(this.CFG.projectName) &&
          this.CFG.defaultName !== 'yaofacai'
        ) {
          // 在药发采网关，并且当前项目不是药发采时，不显示菜单栏
          this.isShowMainHeader = false;
          this.isShowLeftSide = false;
        } else if (
          /^xiaoke$/i.test(this.CFG.projectName) &&
          this.CFG.defaultName !== 'xiaoke'
        ) {
          // 在销客网关，并且当前项目不是销客时，不显示菜单栏
          this.isShowMainHeader = false;
          this.isShowLeftSide = false;
        } else if (
          /^oxygentherapy$/i.test(this.CFG.projectName) &&
          this.CFG.defaultName !== 'oxygentherapy'
        ) {
          // 在氧疗网关，并且当前项目不是氧疗时，不显示菜单栏
          this.isShowMainHeader = false;
          this.isShowLeftSide = false;
        } else if (
          /^angelswings$/i.test(this.CFG.projectName) &&
          this.CFG.defaultName !== 'angelswings' &&
          (!this.utils.isEmpty(query.isShowMainHeader) || !this.utils.isEmpty(query.isShowLeftSide))
        ) {
          // 在云诊室网关，并且存在isShowMainHeader 和 isShowLeftSide 参数时，设置isShowMainHeader 和 isShowLeftSide 的值
          this.isShowMainHeader = query.isShowMainHeader === 'true' ? true : false;
          this.isShowLeftSide = query.isShowLeftSide === 'true' ? true : false;
        } else if (
          /^cloudsteward$/i.test(this.CFG.projectName) &&
          this.CFG.defaultName !== 'cloudsteward'
        ) {
          // 在云管家网关，并且当前项目不是云管家时，不显示菜单栏
          this.isShowMainHeader = false;
          this.isShowLeftSide = false;
        } else {
          this.isShowMainHeader = isShowMainHeader;
          this.isShowLeftSide = isShowLeftSide;
        }
      }
    },
    onOrgChange(org) {
      let args = {
        dataOwnerOrgId: org.id
      };
      this.API.send(
        this.CFG.services.common.refreshToken,
        args,
        function (res) {
          res = res.serviceResult;
          try {
            login.refreshToken(res);
            this.$nextTick(() => {
              window.location.href = window.location.href.split('#')[0];
            });
          } catch (e) {
            console.log(e);
          }
        },
        function () {},
        this
      );
    },
    toggleLeftSide() {
      this.isShowLeftSide = !this.isShowLeftSide;
    },
    showLeftSide() {
      this.isShowLeftSide = true;
    },
    hiddeLeftSide() {
      this.isShowLeftSide = false;
    },
    modifyPasswordStatus: function (status) {
      if (status) {
        this.isShowDialog = false;
      }
    },
    quit: function () {
      login.logOut();
    },
    checkUserInfo() {
      this.userInfo = this.CFG.userInfo || {};
      if (this.userInfo.personnelType === '3') {
        // this.showBindMobileDialog();
        // 药发采使用
        // 去实名认证
        this.$confirm({
            title: '提示',
            text: '您尚未实名认证，是否去认证？',
            buttons: [
              {
                text: '取消',
                type: 'follow'
              },
              {
                text: '去认证',
                type: 'primary',
                callback: () => {
                  this.toRZHFunction(this.userInfo.id);
                }
              }
            ]
          });
      } else if (
        !this.userInfo.cellphone ||
        !this.userInfo.name ||
        !this.userInfo.identificationNumber
      ) {
        // 游客不提示修改手机号和身份证号码
        this.showEditDialog();
      }
    },
    /**  小程序端扫码入口 **/
    scanCodeMin(){
      this.$emit('scanCodeMin');
    },
    //getUserByToken (args) {
    //  this.API.send(this.CFG.services.sy.selectHumanByToken, args, function (res) {
    //    if (res.opFlag) {
    //      let result = res.serviceResult;
    //      this.userInfo = result;
    //      this.CFG.userInfo = result;
    //      this.userId = result.id;
    //      if (result.personnelType === '3') {
    //        // 绑定手机号
    //        this.showBindMobileDialog();
    //      } else if (!result.cellphone || !result.name || !result.identificationNumber) {
    //        // 游客不提示修改手机号和身份证号码
    //        this.showEditDialog();
    //      }
    //    }
    //  }, function () {
    //  }, this);
    //}
  }
};
</script>
