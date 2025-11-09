<!--
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2024-07-16 13:32:03
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-07-24 13:44:41
 * @FilePath: \common-data-configc:\project\middleground\lonch-imsfe\src\common-base\components\businessComponents\FormAuditInfoDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    :visible="visible"
    :fullscreen="true"
    center
    append-to-body
    custom-class="form-audit-info-dialog"
    :before-close="beforeClose"
    :show-close="false"
  >
    <template #title>
      <crumbs-bar
        title="单据信息"
        isCustomerBackEvent
        @back="beforeClose"
      ></crumbs-bar>
    </template>
    <!-- 单据信息-->
    <FormAuditInfoVue
      v-if="visible"
      v-model="form"
      type="'details'"
      :id="data.id"
      :getDetailParam="getDetailParam"
      :detailUrl="detailUrl"
      styleClass="card"
    ></FormAuditInfoVue>
  </el-dialog>
</template>

<script>
import crumbsBar from '@/common-base/components/crumbs-bar';
// 单据信息
import FormAuditInfoVue from './FormAuditInfo.vue';
import config from '@/config/index.js';

export default {
  components: {
    crumbsBar,
    FormAuditInfoVue
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 请求接口需要的参数
     */
    getDetailParam: {
      type: Object,
      default: {},
    },
    /**
     * 数据
     */
    data: {
      type: Object,
      default: () => ({})
    },
    /**
     * 请求详情接口的配置
     */
    detailUrl: {
      type: Object,
      default: config.services.ca.formGetAuditInfo
    }
  },
  data() {
    return {
      form: {
        source: '',
        formRemark: ''
      }
    };
  },
  watch: {
    '$route.path'() {
      this.beforeClose();
    }
  },
  methods: {
    beforeClose() {
      this.$emit('update:visible', false);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
::v-deep .form-audit-info-dialog {
  max-width: 100%;
}
</style>
