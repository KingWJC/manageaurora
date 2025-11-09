<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" pageType="details" functionType="manage"></index>
</template>

<script type="text/ecmascript-6">
// 引入组件
import index from '../../../components/admin/institutionName/institutionNameDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 诊所合伙人申请详情
 */
export default {
  // 权限控制
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
