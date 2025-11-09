<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-09-22 21:08:41
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-09-22 21:08:41
 * @FilePath: /manageaurora/src/components/admin/authVerify/merchantBusinessPreference/Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <FormView
    :params="params"
    :auditType="auditType"
    :config="COMPONENT_CONFIG"
  />
</template>
<script>
// 表单组件
import FormView from '@/common-base/components/commonForm/FormView';
// 组件配置
import { COMPONENT_CONFIG } from '@/components/admin/authVerify/merchantBusinessPreference/data';

export default {
  components: { FormView },
  props: ['params', 'auditType'],
  data() {
    return { COMPONENT_CONFIG };
  }
};
</script>
