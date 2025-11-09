<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-03 21:53:23
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-23 17:33:15
 * @FilePath: \lonch-rxv-fe\src\common-base\components\commonForm\components\card\ScaleItemsCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="card card-shadow">
    <div class="card-body">
      <div class="card-header" v-if="title">
        <strong>{{ title }}</strong>
      </div>
      <div class="card-content-padded">
        <ItemTree
          v-if="itemsTreeData.length"
          :treeData="{ children: itemsTreeData }"
          :recordItems.sync="formData[`recordItems_${fieldId}`]"
          :disabled="disabled"
          :oss="oss"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ItemTree from '@/common-base/components/commonForm/components/tree/ItemTree';
import { getRecordItemsListFromRecordItems } from '@/common-base/components/commonForm/utils/scaleItemsUtils';

export default {
  components: { ItemTree },
  props: [
    'title',
    'formData',
    'disabled',
    'cols',
    'config',
    'options',
    'recordItemsConfig',
    'options',
    'oss'
  ],
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true
    }
  },
  computed: {
    fieldId() {
      return this.recordItemsConfig.fieldId;
    },
    itemsListKey() {
      return `${this.fieldId}_itemsList`;
    },
    itemsTreeData() {
      const result = this.utils.array2tree(
        this.options[this.itemsListKey] || [],
        'id',
        'parentId'
      );
      return result;
    }
  },
  methods: {
    async validateForm() {
      return await new Promise((resolve, reject) => {
        // result 始终是 Array
        const result = getRecordItemsListFromRecordItems(
          this.formData[`recordItems_${this.fieldId}`],
          this.options[this.itemsListKey]
        );
        const value = { recordItemsList: result };
        if (this.recordItemsConfig.fieldKey) {
          resolve({ [this.recordItemsConfig.fieldKey]: { ...value, scaleId: this.fieldId } });
        } else {
          resolve(value);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.plus-icon-wrapper {
  color: #3f9eff;
  font-size: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-radio-group label.el-radio {
  margin-right: 10px;
}
</style>
