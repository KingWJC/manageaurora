<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-09-22 21:08:40
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-09-22 21:08:40
 * @FilePath: /manageaurora/src/components/admin/authVerify/merchantBusinessPreference/List.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <ListView
    :config="COMPONENT_CONFIG"
    :permissions="permissions"
    :params="params"
    :auditType="auditType"
  />
</template>
<script>
// 列表组件
import ListView from '@/common-base/components/commonForm/ListView';
// 组件配置
import { COMPONENT_CONFIG } from '@/components/admin/authVerify/merchantBusinessPreference/data';

export default {
  components: { ListView },
  props: ['permissions', 'params', 'auditType'],
  data() {
    return { COMPONENT_CONFIG };
  }
};
</script>
