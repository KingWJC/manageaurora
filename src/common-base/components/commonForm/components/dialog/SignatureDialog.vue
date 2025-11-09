<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-29 03:14:19
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 13:52:32
 * @FilePath: \manageaurora\src\common-base\components\commonForm\components\dialog\SignatureDialog.vue
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
    <Signature v-if="visible" @change="onChange" :oss="oss"></Signature>
  </el-dialog>
</template>
<script>
import Signature from '@/common-base/components/signature';
export default {
  props: ['visible', 'oss', 'title', 'center'],
  components: { Signature },
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
