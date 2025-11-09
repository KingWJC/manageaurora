<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-30 23:15:16
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-08 22:19:26
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-23 02:00:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-12-10 16:39:36
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 17:36:01
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-29 22:00:12
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-21 15:36:03
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-18 01:30:41
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex flex-column flex-items-center">
    <div class="card-wrapper" v-for="(item, itemIndex) in arrayList">
      <component
        :is="componentName || 'BasicCard'"
        :key="getItemTitle(item, itemIndex)"
        :ref="getItemTitle(item, itemIndex)"
        :title="getItemTitle(item, itemIndex)"
        :auditType="auditType"
        :disabled="disabled"
        :options.sync="options"
        :formData="item"
        @update:formData="(result) => onUpdateItem(result, itemIndex)"
        :config="config"
        :oss="oss"
        :cols="arrayConfig.cols"
        :treeConfig="treeConfig"
        :previewConfig="previewConfig"
        @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
        @selectTableShow="(result) => $emit('selectTableShow', result)"
        @sealPageShow="(result) => $emit('sealPageShow', result)"
      >
        <template #titleRight>
          <el-button size="small" v-if="arrayList.length > (arrayConfig.min || 0) && !disabled" icon="el-icon-delete" type="danger" @click="onRemoveCard(itemIndex)">移除</el-button>
        </template>
      </component>
    </div>
    <div class="flex flex-content-center card-wrapper">
      <el-button icon="el-icon-plus" type="success" size="small" v-if="!disabled" :disabled="arrayList.length >= arrayConfig.max" @click="onAddCard">添加{{ getItemTitle() }}</el-button>
    </div>
  </div>
</template>
<script>
import BasicCard from '@/common-base/components/commonForm/components/card/BasicCard';
import TreeCard from '@/common-base/components/commonForm/components/card/TreeCard';
import PreviewCard from '@/common-base/components/commonForm/components/card/PreviewCard';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import { leftPad } from '@/common-base/components/commonForm/utils/stringUtils';

export default {
  components: {
    BasicCard,
    TreeCard,
    PreviewCard,
  },
  mixins: [formDataMixin],
  props: [
    'title',
    'auditType',
    'formData',
    'disabled',
    'cols',
    'config',
    'options',
    'oss',
    'componentName',
    'treeConfig',
    'previewConfig',
    'arrayConfig'
  ],
  computed: {
    arrayList() {
      if (Array.isArray(this.formData?.[this.cols?.[0]])) {
        return this.formData[this.cols[0]];
      }
      return [];
    },
    refNames() {
      if (this.arrayList?.length) {
        return this.arrayList.map((item, itemIndex) => this.getItemTitle(item, itemIndex));
      }
      return [];
    },
  },
  mounted() {
    if (this.formData?.[this.cols?.[0]]?.length === 0 && this.arrayConfig.min > 0) {
      for (let index = 0; index < this.arrayConfig.min; index++) {
        this.onAddCard();
      }
    }
  },
  methods: {
    getItemTitle(item, itemIndex) {
      if (!item) {
        return typeof this.arrayConfig.title === 'function' ? this.arrayConfig.title() : this.title; ;
      }
      if (typeof this.arrayConfig.title === 'function') {
        return this.arrayConfig.title(item, itemIndex); 
      }
      return `${this.title} ${leftPad(itemIndex + 1, 2, '0')}`;
    },
    onAddCard() {
      const initItem = typeof this.arrayConfig.initItem === 'function' ? this.arrayConfig.initItem(this.formData, this) : {};
      this.$emit('update:formData', {
      ...this.formData,
        [this.cols[0]]: [
          ...this.arrayList,
          initItem,
        ],
      });
    },
    onUpdateItem(item, itemIndex) {
      this.arrayList[itemIndex] = item;
      this.$emit('update:formData', {
      ...this.formData,
        [this.cols[0]]: this.arrayList,
      });
    },
    onRemoveCard(index) {
      this.arrayList.splice(index, 1);
      this.$emit('update:formData', {
       ...this.formData,
        [this.cols[0]]: tableList,
      });
    },
    async validateForm() {
      await Promise.all(
        [
          ...this.refNames.map(refName => {
            if (Array.isArray(this.$refs[refName])) {
              return this.$refs[refName]?.[0]?.validateForm();
            }
            if (this.$refs[refName]) {
              return this.$refs[refName]?.validateForm();
            }
          }),
        ].filter(Boolean)
      );
      return { [this.cols[0]]: this.arrayList }
    }
  }
};
</script>
<style lang="scss" scoped>
.card-wrapper:not(:first-child) {
  margin-top: 10px;
}
</style>
