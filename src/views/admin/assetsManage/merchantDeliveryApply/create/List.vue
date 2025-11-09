<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-30 14:27:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-30 14:27:29
 * @FilePath: /manageaurora/src/views/admin/assetsManage/merchantDeliveryApply/create/List.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <ListView
    :permissions="permissions"
    :params="$route.query"
    key="create"
    auditType="create"
  ></ListView>
</template>

<script>
// 渲染组件 ListView
import ListView from '@/components/admin/assetsManage/merchantDeliveryApply/List';
// 权限 mixins
import permissionsMixin from '@/common-base/mixins/permissions';
export default {
  mixins: [permissionsMixin],
  components: { ListView }
};
</script>
