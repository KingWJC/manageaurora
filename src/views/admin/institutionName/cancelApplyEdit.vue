<template>
  <index :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" pageType="edit" ></index>
</template>

<script type="text/ecmascript-6">
// 组件
import index from '../../../components/admin/institutionName/cancelApplyDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
/**
 * 致医优氧合作协议管家取消-编辑
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
