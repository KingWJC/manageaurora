<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-04-01 13:12:12
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 13:13:26
 * @FilePath: \manageaurora\src\common-base\components\commonForm\components\dialog\AuthenticationDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    :title="title"
    :center="center"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <Authentication v-if="visible" @change="onChange" :oss="oss"></Authentication>
  </el-dialog>
</template>
<script>
import Authentication from '@/common-base/components/authentication';
export default {
  props: ['visible', 'oss', 'title', 'center'],
  components: { Authentication },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
      }
    }
  },
  methods: {
    onChange(result) {
      this.$emit('change', result);
      this.$emit('update:visible', false);
    },
  },
};
</script>
