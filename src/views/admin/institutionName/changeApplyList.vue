<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision"></index>
</template>

<script type="text/ecmascript-6">
// 引入组件
import index from '../../../components/admin/institutionName/changeApply';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 致医优氧合作协议管家变更-列表
 */
export default {
  // 权限控制
  mixins: [permissionsMixin],
  // 注册组件
  components: {
    index
  },
  data() {
    return {};
  }
};
</script>
