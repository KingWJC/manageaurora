<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" pageType="details"></index>
</template>

<script type="text/ecmascript-6">
/**
 * 导入doctorPartnerDetail组件和permissionsMixin混入。
 * 
 * 为页面或组件提供具体的UI实现和权限控制功能。
 * 
 */
import index from '../../../components/admin/institutionName/institutionNameDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 诊所合伙人申请详情
 */
export default {
  // 混入权限控制
  mixins: [permissionsMixin],
  // 注册组件
  components: {
    index
  },
  data () {
    return {

    };
  }
};
</script>
