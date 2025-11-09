<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-09-22 21:08:30
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-09-22 21:08:30
 * @FilePath: /manageaurora/src/views/admin/authVerify/merchantBusinessPreference/modify/Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <FormView
    :permissions="permissions"
    :params="$route.query"
    key="modify"
    auditType="modify"
  ></FormView>
</template>

<script>
// 渲染组件 FormView
import FormView from '@/components/admin/authVerify/merchantBusinessPreference/Form';
// 权限 mixins
import permissionsMixin from '@/common-base/mixins/permissions';
export default {
  mixins: [permissionsMixin],
  components: { FormView }
};
</script>
