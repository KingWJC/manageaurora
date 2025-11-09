<template>
  <div class="viewport-fixed">
    <crumbs-bar title="机构曾用名新增申请单"></crumbs-bar>
    <!-- 功能按钮: 保存/立即生效 -->
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center" v-if="pageType !== 'details'">
      <div class="flex flex-content-center">
        <!-- 保存 -->
        <span class="btn btn-primary" @click="save">
          保存
        </span>
      </div>
    </div>
    <div class="viewport-view" v-if="!showSelect">
      <div class="viewport-view-body flex flex-column">
        <div class="flex-flex-auto panel p15 mt5" ref="viewBody">
          <div class="panel-table-content">
            <!-- 状态: 审核中 -->
            <el-alert v-if="pageType === 'details' && formData.auditStatus === '1'" :title="'审核中'" :type="'warning'" :closable="false" show-icon> </el-alert>
            <!-- 状态: 审核通过 -->
            <el-alert v-if="pageType === 'details' && formData.auditStatus === '2'" :title="'审核通过'" :type="'success'" :closable="false" show-icon> </el-alert>
              <!-- 状态: 驳回 -->
            <el-alert v-if="pageType === 'details' && formData.auditStatus === '3'" :title="'审核不通过'" :type="'warning'" :closable="false" show-icon> </el-alert>
            <!-- 商户信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">
                  机构信息
                </div>
                <div class="card-content-padded" ref="viewBody">
                  <formView :formConfig='formMerchantConfig' :oss='oss' ref="form"></formView>
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
    <div class="viewport-fixed bg-white power-zi101" v-if="showSelect">
      <generalSelection :mode="generalSelectionModel" @close="closeGeneralSelection"></generalSelection>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import crumbsBar from '@/common-base/components/crumbs-bar';
// 引入通用选择组件
import generalSelection from "./common/generalSelection";
// 引入Form表单组件
import formView from '@/common-base/components/pubComponents/form';
// 属性赋值
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
  name: "applyDetail", //组件名
  components: { //注册组件
    crumbsBar,
    generalSelection,
    formView
  },
  props: {
    // 权限控制信息
    permissions: {
      type: Object,
      default() {
        return {
          codes: {},
          names: {},
        };
      },
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    pageType: { //页面类别
      type: String,
      default() {
        return "";
      },
    },
    functionType: { //功能类别
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      // 通用选择组件
      generalSelectionModel: {
        show: false, // 控制
        data: {},
        setting: {
          url: "",
          formConfig: [],
          cols: [],
        },
      },
      // 商户信息
      formMerchantConfig: [],
      // 履约业务员信息
      performMarketingConfig: [],
      // 签约业务员信息
      signMarketingConfig: [],
      // 单据信息
      formConfig: [],
      // 通用选择
      showSelect: false,
      // 签约业务员信息
      // 数据集合
      formData: {
        id: '',
        orgId: '',
        oldName: '',
        newName: '',
        beginTime: '',
        changeTime: '',
        auditStatus: '', //状态
        applicantName: '',
        applicationDate: '',
        auditorName: '',
        auditDate: '',
        formRemark: '',
      },
      // 商户类型
      shopTypeOptions: [],
      // 商户类型
      categoryOptions: [
        {code: '1', name: '私域商城', c: '1', n: '私域商城'},
        {code: '2', name: '云药房', c: '2', n: '云药房'},
        {code: '3', name: '云诊室', c: '3', n: '云诊室'},
        {code: '4', name: '药发采', c: '4', n: '药发采'},
        {code: '5', name: '云氧疗', c: '5', n: '云氧疗'},
        {code: '6', name: '云药房S', c: '6', n: '云药房S'},
        {code: '7', name: '逆时舱', c: '7', n: '逆时舱'},
      ],
    };
  },
  created() {
    this.initForm();
    if(this.params.id) {
      this.loadData();
    }
  },
  methods: {
    /**
     * 初始化表单
     */
    initForm() {
      this.formData.source = this.CFG.project.title;
      this.formMerchantConfig = [
        {
          disabled: this.pageType === 'details',
          label: '机构',
          id: 'newName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择机构',
          type: 'text-btn',
          w100: true,
          model: this.formData,
          required: true,
          showAdd: this.pageType !== 'details',
          click: () => {
            this.addOrg();
          }
        },
        {
          disabled: this.pageType === 'details',
          required: true,
          label: '曾用名',
          id: 'oldName',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请填写曾用名',
          type: 'text',
          w100: true,
          model: this.formData
        },
        {
          disabled: this.pageType === 'details',
          label: '开始使用时间',
          id: 'beginTime',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择开始使用时间',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          pickerOptions: () => {
            return {
              disabledDate: (time) => {
                return time.getTime() > Date.now();
              }
            }
          }
        },
        {
          disabled: this.pageType === 'details',
          label: '结束使用时间',
          id: 'changeTime',
          mwidth: '80px',
          lg: 12, xl: 12, md: 24,
          placeholder: '请选择结束使用时间',
          type: 'date',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          pickerOptions: () => {
            return {
              disabledDate: (time) => {
                return time.getTime() < Date(this.formData.beginTime);
              }
            }
          }
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
        {
          disabled: this.pageType === 'details',
          label: '备注',
          id: 'formRemark',
          mwidth: '80px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入备注',
          type: 'textarea',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
        },
      ];
    },
    /**
     * 关闭弹窗
     */
    closeGeneralSelection() {
      this.showSelect = false;
    },
    /**
     * 手机号隐藏中间四位
     * @param phoneNumber 
     */
    maskPhoneNumber(phoneNumber) {
      // 检查输入是否为有效的11位数字
      if (phoneNumber && typeof phoneNumber === 'string' && /^\d{11}$/.test(phoneNumber)) {
        return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
      } else {
        return phoneNumber;
      }
    },
    /**
     * 选择商户
     */
    addOrg() {
      const that = this;
      // 打开选择框
      this.showSelect = true;
      const modelOptions = {
        // 人员选择框数据
        url: this.CFG.services.ca.organizeSearchOrgsByPage,
        noPaging: false,
        // 表单配置
        formConfig: [
          // 手机号
          { paramMark: "机构名称", param: "name", paramType: "text" },
        ],
        cols: [ //列配置
          // 姓名
          { label: "机构名称", id: "name" },
          { label: "省", id: "district" },
          { label: "市", id: "city" },
          { label: "县", id: "district" },
          { label: "地址", id: "address" },
          { label: "联系人", id: "linkmanName" },
          { label: "联系人电话", id: "linkmanPhone", render: (row) => this.maskPhoneNumber(row.linkmanPhone) },
          {
            label: "操作",
            fixed: "right",
            width: "120",
            btns: [
              {
                name: "选择",
                click: (row) => {
                  const { id: id, name: name } = row;
                  this.showSelect = false;
                  this.formData.orgId = id;
                  this.formData.oldName = '';
                  this.formData.newName = name;
                },
              }
            ],
          }
        ]
      };
      that.generalSelectionModel.setting = modelOptions;
    },
    /**
     * 获取下拉数据
     */
    loadOptions() {
      this.API.send(this.CFG.services.shopType.list, {}, function(res) {
        const result = res && res.data && res.data.rows || [];
        this.shopTypeOptions = result.map(v => {
          return { code: v.code, name: v.name, c: v.code, n: v.name }
        });
        this.initForm();
      }, function() {}, this)
    },
    // 获取数据详情
    loadData() {
      const args = {
        id: this.params.id
      };
      let url = this.CFG.services.ca.nameChangeApplyView;
      //发请求
      this.API.send(url, args, function(res) {
        res = res.serviceResult || {};
        // 数据填充赋值
        listAssign(this.formData, res);
        if(res.applicant === 'system') {
          this.formData.applicantName = '系统自动';
        }
        if(res.auditor === 'system') {
          this.formData.auditorName = '系统自动';
        }
      }, function() {}, this)
    },
    // 点击返回
    back() {
      this.$router.go(-1);
    },
    // 数据校验
    validate() {
      if(!this.formData.orgId) {
        this.$toast({text: '机构不能为空'});
        return true;
      }
      if(!this.formData.oldName) {
        this.$toast({text: '请填写曾用名'});
        return true;
      }
    },
    // 点击保存按钮
    save() {
      const that = this;
      // 校验表单
      if(this.validate()) {
        return;
      }
      const args = {
        orgId: this.formData.orgId,
        oldName: this.formData.oldName,
        newName: this.formData.newName,
        beginTime: new Date(this.formData.beginTime).getTime(),
        changeTime: new Date(this.formData.changeTime).getTime(),
        formRemark: this.formData.formRemark,
      };
      let url = that.CFG.services.ca.nameChangeApplyCreate;
      if(this.pageType === 'add') {
        args.source = this.CFG.project.id;
      }
      if(this.pageType === 'edit') {
        url = that.CFG.services.ca.nameChangeApplyUpdate;
        args.id = this.formData.id;
      }
      // 发送请求
      that.API.send(
        url,
        args,
        function (res) {
          const result = res && res.data;
          that.$toast({ text: result.reason || "保存成功" });
          that.$router.go(-1);
        },
        function () {},
        that
      );
    },
  },
};
</script>

