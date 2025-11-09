<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" pageType="edit" ></index>
</template>

<script type="text/ecmascript-6">
// 引入组件
import index from '../../../components/admin/institutionName/changeApplyDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 致医优氧合作协议管家变更-编辑
 */
export default {
  // 权限控制
  mixins: [permissionsMixin],
  // 组件
  // 引入组件
  components: {
    index
  },
  data () {
    return {

    };
  }
};
</script>
