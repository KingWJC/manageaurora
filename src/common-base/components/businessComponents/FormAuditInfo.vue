<template>
  <el-collapse
    :class="styleClass"
    v-model="active"
    :accordion="true"
    @change="handleChange"
  >
    <el-collapse-item :name="true">
      <!-- 标题 -->
      <template slot="title">
        单据信息
        <span class="sub-title"
          >（{{ active ? '点击收起' : '点击展开' }}）</span
        >
      </template>
      <!-- 表单 -->
      <formView
        v-if="showForm"
        :formConfig="formConfig"
        :model="form"
      ></formView>
      <!-- 列表 -->
      <tableView
        v-if="showList && type !== 'add'"
        :list="listData"
        :cols="cols"
      ></tableView>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import formView from '../pubComponents/form';
import tableView from '../pubComponents/tableView.vue';
import { formatEmpty } from '@/static/js/utils.js';
import config from '@/config/index.js';

export default {
  components: {
    formView,
    tableView
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    // 单据id
    id: {
      type: String || Number,
      default: ''
    },
    // 请求详情接口的配置
    detailUrl: {
      type: Object,
      default: config.services.ca.formGetAuditInfo
    },
    /**
     * 风格 空或card
     */
    styleClass: {
      type: String,
      default: ''
    },
    /**
     * 表单类型
     * add - 新增
     * edit - 编辑
     * details|其它 - 查看
     */
    type: {
      type: String,
      default: 'details'
    },
    /**
     * 请求接口需要的参数
     */
    getDetailParam: {
      type: Object,
      default: {}
    },
    /**
     * 默认是否显示
     */
    defaultActive: {
      type: Boolean,
      default: true
    },
    /**
     * 显示表单
     */
    showForm: {
      type: Boolean,
      default: true
    },
    /**
     * 显示列表
     */
    showList: {
      type: Boolean,
      default: true
    },
    // 屏幕宽度<768的栅格宽度
    xs: {
      type: Number,
      default: 24
    },
    // 屏幕宽度>=768的栅格宽度
    sm: {
      type: Number,
      default: 24
    },
    // 屏幕宽度>=992的栅格宽度
    md: {
      type: Number,
      default: 12
    },
    // 屏幕宽度>=1200的栅格宽度
    lg: {
      type: Number,
      default: 8
    },
    // 屏幕宽度>=1920的栅格宽度
    xl: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      active: this.defaultActive,
      formConfig: [],
      form: {
        id: '',
        formId: '',
        creatorName: '',
        formCreateTime: '',
        finalEditorName: '',
        finalEditTime: ''
      },
      listData: [],
      cols: [
        /**
         * 审核人
         */
        {
          label: '审核人',
          id: 'auditorName',
          width: '100',
          render: (row) => formatEmpty(row.auditorName)
        },
        /**
         * 审核时间
         */
        {
          label: '审核时间',
          type: 'date',
          id: 'auditorTime',
          width: '100',
          format: 'yyyy-MM-dd hh:mm:ss'
        },
        /**
         * 审核结果
         */
        {
          label: '审核结果',
          id: 'auditorAction',
          width: '100',
          render: (row) => ['申请中', '审核通过', '已驳回'][row.auditorAction]
        },
        /**
         * 审核备注
         */
        {
          label: '审核备注',
          id: 'auditorComment',
          width: '200',
          render: (row) => formatEmpty(row.auditorComment)
        }
      ]
    };
  },
  watch: {
    value() {
      this.formConfig.forEach((el) => {
        if (el.model) {
          el.model = this.value;
        }
      });
    }
  },
  methods: {
    /**
     * 设置表单配置
     */
    setFormConfig() {
      // 产品列表
      const sourceList = this.CFG.projects.map((el) => ({
        c: el.id,
        n: el.title
      }));
      const formConfig = [
        /**
         * 单据来源
         */
        {
          label: '单据来源',
          id: 'source',
          type: 'select',
          placeholder: '',
          model: this.value,
          options: sourceList
        }
      ];

      if (this.type !== 'add') {
        formConfig.push(
          ...[
            /**
             * 单据ID
             */
            {
              label: '单据ID',
              id: 'id',
              type: 'text',
              placeholder: ''
            },
            /**
             * 来源单据ID
             */
            {
              label: '来源单据ID',
              id: 'formId',
              type: 'text',
              placeholder: ''
            },
            /**
             * 制单人
             */
            {
              label: '制单人',
              id: 'creatorName',
              type: 'text',
              placeholder: ''
            },
            /**
             * 制单时间
             */
            {
              label: '制单时间',
              id: 'formCreateTime',
              type: 'date',
              format: 'yyyy-MM-dd HH:mm:ss',
              placeholder: ''
            },
            /**
             * 最后修改人
             */
            {
              label: '最后修改人',
              id: 'finalEditorName',
              type: 'text',
              placeholder: ''
            },
            /**
             * 最后修改时间
             */
            {
              label: '最后修改时间',
              id: 'finalEditTime',
              type: 'date',
              format: 'yyyy-MM-dd HH:mm:ss',
              placeholder: ''
            }
          ]
        );
      }
      /**
       * 单据备注
       */
      formConfig.push({
        label: '单据备注',
        id: 'formRemark',
        type: 'textarea',
        placeholder: '',
        model: this.value,
        disabled: !['add', 'edit'].includes(this.type),
        rows: 4,
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24
      });

      /**
       * 设置通用属性
       */
      formConfig.forEach((el) => {
        // 屏幕宽度<768的栅格宽度
        if ([undefined, null].includes(el.xs)) {
          el.xs = this.xs;
        }
        // 屏幕宽度>=768的栅格宽度
        if ([undefined, null].includes(el.sm)) {
          el.sm = this.sm;
        }
        // 屏幕宽度>=992的栅格宽度
        if ([undefined, null].includes(el.md)) {
          el.md = this.md;
        }
        // 屏幕宽度>=1200的栅格宽度
        if ([undefined, null].includes(el.lg)) {
          el.lg = this.lg;
        }
        // 屏幕宽度>=1920的栅格宽度
        if ([undefined, null].includes(el.xl)) {
          el.xl = this.xl;
        }
        // 默认禁用
        if ([undefined, null].includes(el.disabled)) {
          el.disabled = true;
        }
        // 宽度
        if ([undefined, null].includes(el.mWidth)) {
          el.mWidth = '90px';
        }
      });

      this.formConfig = formConfig;
    },
    /**
     * 设置表单内容
     */
    setForm() {
      if (!this.id) {
        return;
      }
      const params = {
        id: this.id,
        ...this.getDetailParam
      };

      /**
       * 获取数据接口
       */
      this.API.send(
        this.detailUrl,
        params,
        function (res) {
          const success = res.success;

          /**
           * 接口返回成功
           */
          if (success) {
            this.form = res.data || {};
            this.listData = this.form.auditInfoList || [];

            this.value.source = this.form.source; // 单据来源
            this.value.formRemark = this.form.formRemark; // 单据备注
          }
        },
        function () {},
        this
      );
    }
  },
  mounted() {
    if (this.type === 'add') {
      this.value.source = this.CFG.project.id;
    }
    this.setFormConfig();
    this.setForm();
  }
};
</script>
<style lang="scss" scoped>
.el-collapse {
  clear: both;
  padding: 0;
  border-bottom: 0;
  &.card {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    ::v-deep .el-collapse-item__header {
      border-radius: 2px 2px 0 0;
      padding: 0 10px 0 15px;
      border-bottom: 1px solid #fff;
      &.is-active {
        border-bottom: 1px solid #dcdee2;
      }
    }
    ::v-deep .el-collapse-item__content {
      padding: 15px;
    }
    // padding: 10px 16px;
  }
}
::v-deep .el-collapse-item__header {
  font-weight: bold;
  border-bottom: 0;
}
.sub-title {
  color: #909399;
  font-weight: normal;
}
::v-deep .el-collapse-item__wrap {
  border-bottom: 0;
}
</style>
