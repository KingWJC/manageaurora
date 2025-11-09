<template>
  <div>
    <formView :formConfig="formConfig" :oss="oss" ref="form"></formView>
    <div class="flex flex-content-center">
      <el-button size="small" type="primary" @click="save">提交</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入Form表单组件
import formView from '@/common-base/components/pubComponents/form';

export default {
  name: "audit",
  // 注册组件
  components: {
    formView
  },
  // 定义父组件传过来的参数
  props: {
    checkUrl: { // 页面类型
      type: Object,
      default() {
        return {};
      },
    },
    checkData: { // 参数
      type: Object,
      default() {
        return {};
      },
    }
  },
  // 列表数据
  data() {
    return {
      // 数据集合
      formData: {
        id: '',
        auditAction: '',
        auditComment: '',
      },
      auditModel: false,
      auditStage: -1, //是否显示审核按钮
      auditRemark: '', //审核意见
      // 单据信息
      formConfig: [],
    };
  },
  watch: {
    formData: {
      handler() {
        this.initForm();
      },
      deep: true // 启用深度监听
    }
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      this.formConfig = [
        {
          label: '审核意见',
          id: 'auditAction',
          mWidth: '100px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入标题',
          type: 'radio',
          options: [
            {
              n: '通过',
              c: '1'
            },
            {
              n: '不通过',
              c: '3'
            },
          ],
          w100: true,
          model: this.formData,
          required: true
        },
        {
          label: '备注',
          id: 'auditComment',
          mwidth: '80px',
          lg: 24, xl: 24, md: 24,
          placeholder: '请输入标题',
          type: 'textarea',
          dateType: 'datetime',
          w100: true,
          model: this.formData,
          required: this.formData.auditAction === '3'
        },
      ];
    },
    // 数据校验
    validate() {
      if(!this.formData.auditAction) {
        this.$toast({text: '请输入审核意见'});
        return true;
      }
      if(this.formData.auditAction === '3' && !this.formData.auditComment) {
        this.$toast({text: '请输入备注'});
        return true;
      }
    },
    /**
     * 审核 通过/不通过 按钮点击
     */
    save() {
      if (this.validate()) {
        return;
      }
      // 准备请求参数
      const args ={
        auditAction: this.formData.auditAction,
        auditComment: this.formData.auditComment,
        id: this.checkData.id
      }
      // 准备请求协议
      const url = this.checkUrl;
      //发送请求
      this.API.send(
        url,
        args,
        function (res) { //成功的回调函数
          this.$toast({ text: res.serviceResult || "审核成功" });
          this.$emit('close');
        },
        function () {}, //失败的回调函数
        this
      );
    },
  },
};
</script>
