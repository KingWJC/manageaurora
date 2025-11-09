<template>
  <div class="viewport-fixed">
    <!-- 返回按钮 -->
    <crumbs-bar title="商户管家解除申请单"></crumbs-bar>
    <!-- 保存和审核按钮 -->
    <!-- <div
      v-if="!generalSelectionModel.show && pageType !== 'details'"
      class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
    >
      <div class="flex flex-content-center">
        <span
          v-if="pageType === 'examine'"
          class="btn btn-primary"
          @click="showAudit"
        >
          审核
        </span>
      </div>
    </div> -->
    <div class="viewport-view" v-if="!generalSelectionModel.show">
      <div class="viewport-view-body flex flex-column">
        <div class="flex-flex-auto panel p15 mt5" ref="viewBody">
          <div class="panel-table-content">
            <!-- 审核状态 -->
            <!-- 审核中 -->
            <!-- 审核通过 -->
            <!-- 驳回 -->
            <!-- <el-alert v-if="pageType === 'details'" :title="formData.status === 2 ? ('审核不通过 ' + formData.auditComment) : '审核通过'" :type="formData.status === 2 ? 'warning' : 'success'" :closable="false" show-icon> </el-alert> -->
            <el-alert
              v-if="pageType === 'details' && formData.auditStatus === '1'"
              :title="'审核中'"
              :type="'warning'"
              :closable="false"
              show-icon
            >
            </el-alert>
            <el-alert
              v-if="pageType === 'details' && formData.auditStatus === '2'"
              :title="'审核通过'"
              :type="'success'"
              :closable="false"
              show-icon
            >
            </el-alert>
            <el-alert
              v-if="pageType === 'details' && formData.auditStatus === '3'"
              :title="'审核不通过'"
              :type="'warning'"
              :closable="false"
              show-icon
            >
            </el-alert>
            <!-- 致医优氧合作协议管家信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">
                  <label class="label">商户管家信息</label>
                  <!-- <el-button :disabled="formData.subjectCertificationId === ''" v-if="finalAuditStatus !== 1" size="small" class="fr mr10" type="primary" @click="certificationDetails">认证信息详情</el-button> -->
                </div>
                <div class="card-content-padded" ref="viewBody">
                  <formView
                    :formConfig="formMerchantConfig"
                    :oss="oss"
                    ref="form"
                  ></formView>
                </div>
              </div>
            </div>
            <!-- 签约业务员信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">签约业务员信息</div>
                <div class="card-content-padded" ref="viewBody">
                  <formView
                    :formConfig="signMarketingConfig"
                    :oss="oss"
                    ref="form"
                  ></formView>
                </div>
              </div>
            </div>
            <!-- 履约业务员信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">履约业务员信息</div>
                <div class="card-content-padded" ref="viewBody">
                  <formView
                    :formConfig="performMarketingConfig"
                    :oss="oss"
                    ref="form"
                  ></formView>
                </div>
              </div>
            </div>
            <!-- 单据信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">
                  单据信息
                </div>
                <div class="card-content-padded" ref="viewBody">
                  <formView :formConfig='formConfig' :oss='oss' ref="form"></formView>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择组件 -->
    <div
      class="viewport-fixed bg-white power-zi101"
      v-if="generalSelectionModel.show"
    >
      <generalSelection :mode="generalSelectionModel"></generalSelection>
    </div>
    <!-- 审核弹框 -->
    <el-dialog
      :title="auditTitle"
      :visible.sync="auditModel"
      width="500px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :center="true"
    >
      <div class="tac mb20">您对次变更申请的审核意见是？</div>
      <div class="tac full-width flex">
        <label class="label mt10"> {{ auditTitle }}意见 : </label>
        <el-input
          v-model="auditRemark"
          size="small"
          rows="2"
          type="textarea"
          :placeholder="auditTitle + '意见'"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="approvalSpu(2)">审核不通过</el-button>
        <el-button size="small" type="primary" @click="approvalSpu(1)"
          >审核通过</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import crumbsBar from '@/common-base/components/crumbs-bar';
// 引入通用选择组件
import generalSelection from "./common/generalSelection";
// 引入Form表单组件
import formView from '@/common-base/components/pubComponents/form';
// 合并属性
const listAssign = (arrA, arrB) => Object.keys(arrA).forEach(key => {
  // arrA[key] = arrB[key] === null ? '' : arrB[key] === false ? arrB[key] : arrB[key] || arrA[key]
  if(arrB[key] === null){
    arrA[key] = ''
  }else if(arrB[key] === false){
    arrA[key] = arrB[key]
  }else{
    arrA[key] = arrB[key] || arrA[key]
  }
})
export default {
  name: "changeApplyDetail",
  // 注册组件
  components: {
    crumbsBar,
    formView,
    generalSelection
  },
  // 定义父组件传过来的参数
  props: {
    permissions: { // 权限
      type: Object,
      default() {
        return {
          codes: {},
          names: {},
        };
      },
    },
    pageType: { // 页面类型
      type: String,
      default() {
        return "";
      },
    },
    params: { // 参数
      type: Object,
      default() {
        return {};
      },
    }
  },
  // 列表数据
  data() {
    return {
      // 通用选择组件
      generalSelectionModel: {
        show: false,
        data: {},
        setting: {
          url: "",
          formConfig: [],
          cols: [],
        },
      },
      // 商户信息
      formMerchantConfig: [],
      // 签约业务员信息
      signMarketingConfig: [],
      // 履约业务员信息
      performMarketingConfig: [],
      // 履约业务员信息
      newPerformMarketingConfig: [],
      // 单据信息
      formConfig: [],
      // 数据集合
      formData: {
        id: '',
        // clinicPartnerOrgName: '', // 机构名称
        merchantName: '', // 机构名称
        merchantTypeName: '', // 机构ID
        categoryName: '',
        // clinicPartnerOrgAddress: '', // 注册地址
        orgAddress: '', // 注册地址
        linkmanName: '', // 联系人
        linkmanPhone: '', // 联系人电话
        clinicPartnerOrgProvinceCode: '', //  省编码
        clinicPartnerOrgCityCode: '', // 市编码
        clinicPartnerOrgDistrictCode: '', // 区县编码
        signMarketingHumanId: null, // 签约业务员id
        signMarketingName: '', // 签约业务员姓名
        signMarketingIdentificationNumber: '', // 签约业务员身份证号码
        signMarketingCellphone: '', // 签约业务员手机号码
        signMarketingStatus: 0, // 签约业务员状态
        signStartDate: '', // 业务启计时间
        signEndDate: '', // 业务终止时间
        performMarketingHumanId: null, // 履约业务员id
        performMarketingName: '', // 履约业务员姓名
        performMarketingIdentificationNumber: '', // 履约业务员身份证号码
        performMarketingCellphone: '', // 履约业务员手机号码
        performMarketingStatus: 0, // 履约业务员状态
        performStartDate: '', // 履约业务启计时间
        performEndDate: '', // 履约业务终止时间
        auditStatus: '',// 审核状态
        auditComment: '',// 审核备注
        subjectCertificationId: '',
        applicantName: '',
        applicationDate: '',
        auditorName: '',
        auditDate: '',
      },
      newFormData: {
        id: '',
        newPerformMarketingHumanId: null, // 履约业务员id
        newPerformMarketingName: '', // 履约业务员姓名
        newPerformMarketingIdentificationNumber: '', // 履约业务员身份证号码
        newPerformMarketingCellphone: '', // 履约业务员手机号码
        newPerformStartDate: '', // 履约业务启计时间
        newPerformEndDate: '', // 履约业务终止时间
        modifyPerformDateReason: '',
        modifyPerformMarketingReason: ''
      },
      baseGeneralPeopleSetting: {
        // 人员选择框数据
        url: this.CFG.services.sy.originatorMarketingApplyGetMarketingList,
        noPaging: false,
        // 表单配置
        formConfig: [
          // 表单项: 姓名
          { paramMark: "姓名", param: "marketingPersonnelName", paramType: "text" },
          // 表单项: 手机号
          { paramMark: "手机号", param: "marketingPersonnelCellphone", paramType: "text" },
        ],
        // 表格配置
        cols: [
          // 表格列: 姓名
          { label: "姓名", id: "marketingPersonnelName" },
          // 表格列: 手机号
          // { label: "手机号", id: "marketingPersonnelCellphone", render: (row) => this.maskPhoneNumber(row.marketingPersonnelCellphone) },
          { label: "手机号", id: "marketingPersonnelCellphone" },
          // 表格列: 身份证号
          { label: "身份证号", id: "marketingIdentificationNumber", width: '160px' },
        ],
      },
      auditModel: false,
      auditStage: -1, //是否显示审核按钮
      auditRemark: '', //审核意见
    };
  },
  created() {
    this.initForm();
    // 获取数据详情
    this.loadData()
  },
  methods: {
    initForm() {
      this.formData.source = this.CFG.project.title;
      this.formMerchantConfig = [
        {
          disabled: true,
          label: '商户名称',
          id: 'merchantName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true,
        },
        {
          disabled: true,
          label: '商户类型',
          id: 'merchantTypeName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择商户类型',
          type: 'text',
          options: this.shopTypeOptions,
          w100: true,
          model: this.formData
        },
        {
          disabled: true,
          label: '商户分类',
          id: 'categoryName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          options: this.categoryOptions,
          w100: true,
          model: this.formData
        },
      ];
      this.signMarketingConfig = [
        {
          disabled: true,
          label: '姓名',
          id: 'signMarketingName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text-btn',
          w100: true,
          model: this.formData,
          required: true,
        },
        {
          disabled: true,
          label: '手机号',
          id: 'signMarketingCellphone',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '身份证号',
          id: 'signMarketingIdentificationNumber',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务员状态',
          id: 'signMarketingStatus',
          mWidth: '100px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'radio',
          options: [
            {
              n: '正常',
              c: 0
            },
            {
              n: '离职',
              c: 1
            },
          ],
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务启计时间',
          id: 'signStartDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务终止时间',
          id: 'signEndDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
      ];
      this.performMarketingConfig = [
        {
          disabled: true,
          label: '姓名',
          id: 'performMarketingName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true,
        },
        {
          disabled: true,
          label: '手机号',
          id: 'performMarketingCellphone',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '身份证号',
          id: 'performMarketingIdentificationNumber',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务员状态',
          id: 'performMarketingStatus',
          mWidth: '100px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择业务员状态',
          type: 'radio',
          options: [
            {
              n: '正常',
              c: 0
            },
            {
              n: '离职',
              c: 1
            },
          ],
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务启计时间',
          id: 'performStartDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务终止时间',
          id: 'performEndDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
      ];
      this.newPerformMarketingConfig = [
        {
          disabled: true,
          label: '姓名',
          id: 'newPerformMarketingName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text-btn',
          w100: true,
          model: this.formData,
          required: true,
          showAdd: this.pageType !== 'details',
          click: () => {
            this.addNewPerformMarketing();
          }
        },
        {
          disabled: true,
          label: '手机号',
          id: 'newPerformMarketingCellphone',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '身份证号',
          id: 'newPerformMarketingIdentificationNumber',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'text',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: true,
          label: '业务员状态',
          id: 'newPerformMarketingStatus',
          mWidth: '100px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择业务员状态',
          type: 'radio',
          options: [
            {
              n: '正常',
              c: 0
            },
            {
              n: '离职',
              c: 1
            },
          ],
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: this.pageType === 'details',
          label: '履约业务员变更时间情况说明',
          id: 'modifyPerformMarketingReason',
          mwidth: '150px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入标题',
          type: 'textarea',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: this.pageType === 'details',
          label: '业务启计时间',
          id: 'newPerformStartDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: this.pageType === 'details',
          label: '业务终止时间',
          id: 'newPerformEndDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入标题',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
        {
          disabled: this.pageType === 'details',
          label: '履约业务员变更时间情况说明',
          id: 'modifyPerformDateReason',
          mwidth: '150px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入标题',
          type: 'textarea',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: true
        },
      ];
      this.formConfig = [
        {
          disabled: true,
          label: '注册来源',
          id: 'source',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入注册来源',
          type: 'text',
          w100: true,
          model: this.formData,
        },
        {
          disabled: true,
          label: '单据ID',
          id: 'id',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入单据ID',
          type: 'text',
          w100: true,
          model: this.formData,
        },
        {
          disabled: true,
          label: '制单人',
          id: 'applicantName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入制单人',
          type: 'text',
          w100: true,
          model: this.formData,
        },
        {
          disabled: true,
          label: '申请时间',
          id: 'applicationDate',
          mWidth: '100px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择申请时间',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
        },
        {
          disabled: true,
          label: '审核人',
          id: 'auditorName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请输入审核人',
          type: 'text',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
        },
        {
          disabled: true,
          label: '审核时间',
          id: 'auditDate',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择审核时间',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
        },
        // {
        //   disabled: true,
        //   label: '备注',
        //   id: 'formRemark',
        //   mwidth: '80px',
        //   lg: 24, xl: 24, md: 24,
        //   placeholder: '请输入标题',
        //   type: 'textarea',
        //   dateType: 'datetime',
        //   w100: true,
        //   model: this.formData,
        // },
      ];
    },
    // 获取数据详情
    loadData() {
      const that = this
      const args = {
        id: this.params.id
      }
      // 发送请求
      that.API.send(this.CFG.services.crmapi.merchantManagerCancelApplyDetail, args, function(res) {
        const result = res && res.data || {};
        listAssign(that.formData, result);
        if(res.applicant === 'system') {
          this.formData.applicantName = '系统自动';
        }
        if(res.auditor === 'system') {
          this.formData.auditorName = '系统自动';
        }
      }, function() {}, that)
    },
    // 点击返回
    back() {
      this.$router.go(-1);
    },
    // 数据校验
    validate() {
      const that = this;
      const _refs = that.$refs;
      const refList = [];
      for (const key in _refs) {
        if (
          typeof _refs[key] !== "undefined" &&
          typeof _refs[key].length !== "number"
        ) {
          refList.push(_refs[key]);
        } else if (
          typeof _refs[key] !== "undefined" &&
          typeof _refs[key].length === "number"
        ) {
          _refs[key].forEach((item) => {
            refList.push(item);
          });
        }
      }
      const state = [];
      refList.forEach((item) => {
        if (typeof item.refsEvent !== "undefined") {
          const listRef = item.refsEvent();
          for (const key in listRef) {
            if (typeof listRef[key].length === "undefined") {
              listRef[key].validate((valid) => {
                state.push(valid);
              });
            }
          }
        }
      });
      return state.indexOf(false) <= -1;
      // if (state.indexOf(false) > -1) {
      //   return false;
      // } else {
      //   return true;
      // }
    },
    /**
     * 审核按钮点击，弹出审核意见弹框
     */
    showAudit() {
      this.auditRemark = '';
      this.auditTitle = '审核';
      this.auditModel = true;
    },
    /**
     * 审核 通过/不通过 按钮点击
     */
    approvalSpu(status) {
      // 准备请求参数
      const args ={
        auditAction: status,
        auditComment: this.auditRemark,
        id: this.formData.id
      }
      // 准备请求协议
      const url = this.CFG.services.crmapi.merchantManagerCancelApplyDetail;
      //发送请求
      this.API.send(
        url,
        args,
        function (res) { //成功的回调函数
          this.$toast({ text: res.serviceResult || "审核成功" });
          this.$router.go(-1);
        },
        function () {}, //失败的回调函数
        this
      );
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .tac {
    .label {
      text-align: right;
      width: 130px;
    }
  }
}
</style>
