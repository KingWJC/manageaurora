<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" functionType="manage"></index>
</template>

<script type="text/ecmascript-6">
// 引入组件
import index from '../../../components/admin/institutionName/institutionName';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 诊所合伙人管理列表
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
