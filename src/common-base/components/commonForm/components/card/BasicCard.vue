<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 17:52:22
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-25 12:03:26
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\BasicCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div v-if="formCols.length === 1 && formCols[0].type === 'table'">
    <el-form
      ref="formDom"
      :model="formData"
      :rules="formRules"
      class="mobile-form"
    >
      <div class="lc-row full-width">
        <FormItem
          v-for="item in formCols"
          :key="item.id"
          :item="{...item, title: getTableCardTitle(item)}"
          :auditType="auditType"
          :formData.sync="formData"
          :config="config"
          :disabled="disabled"
          :options.sync="options"
          :oss="oss"
          @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
          @selectTableShow="(result) => $emit('selectTableShow', result)"
          @sealPageShow="(result) => $emit('sealPageShow', result)"
          @ootListPageShow="(result) => $emit('ootListPageShow', result)"
        >
        </FormItem>
      </div>
    </el-form>
  </div>
  <div v-else-if="formCols.length === 1 && formCols[0].type === 'tabs'">
    <el-form
      ref="formDom"
      :model="formData"
      :rules="formRules"
      class="mobile-form"
    >
      <div class="full-width">
        <el-tabs
          v-model="formData[formCols[0].id]"
          :type="formCols[0].tabsType"
          :position="formCols[0].position || 'top'"
          class="full-width"
        >
          <el-tab-pane
            v-for="tab in formCols[0].tabs"
            :key="tab.id || tab.label"
            :name="tab.id || tab.label"
          >
            <span class="nowrap" slot="label"><i v-if="tab.icon" :class="`mr5 ${tab.icon}`"></i> {{tab.label}}</span>
            <div class="lc-row full-width">
              <FormItem
                v-for="tabItem in tab.children"
                :key="tabItem.id"
                :item="tabItem"
                :auditType="auditType"
                :formData.sync="formData"
                :config="config"
                :disabled="disabled"
                :options.sync="options"
                :oss="oss"
                @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
                @selectTableShow="(result) => $emit('selectTableShow', result)"
                @sealPageShow="(result) => $emit('sealPageShow', result)"
                @ootListPageShow="(result) => $emit('ootListPageShow', result)"
              >
              </FormItem>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
  <div class="card card-shadow" v-else>
    <div class="card-body">
      <div class="card-header flex flex-row flex-items-center" v-if="title">
        <strong class="flex-flex-auto mr10">{{ title }}</strong>
        <slot name="titleRight"></slot>
      </div>
      <div class="card-content-padded">
        <el-form
          ref="formDom"
          :model="formData"
          :rules="formRules"
          class="mobile-form"
        >
          <div class="lc-row lc-space16 full-width">
            <FormItem
              v-for="item in formCols"
              :key="item.id"
              :item="item"
              :auditType="auditType"
              :formData.sync="formData"
              :config="config"
              :disabled="disabled"
              :options.sync="options"
              :oss="oss"
              @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
              @selectTableShow="(result) => $emit('selectTableShow', result)"
              @sealPageShow="(result) => $emit('sealPageShow', result)"
              @ootListPageShow="(result) => $emit('ootListPageShow', result)"
            >
            </FormItem>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import FormItem from '@/common-base/components/commonForm/FormItem';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';


export default {
  props: [
    'title',
    'auditType',
    'formData',
    'disabled',
    'cols',
    'config',
    'options',
    'oss'
  ],
  components: { FormItem },
  mixins: [formDataMixin],
  watch: {
    options: {
      handler(newValue) {
        this.$emit('update:options', newValue);
      },
      deep: true
    },
    formData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true
    },
    formCols: {
      handler() {
        this.$nextTick(() => {
          this.$refs.formDom.clearValidate();
        });
      }
    }
  },
  methods: {
    getTableCardTitle(item) {
      return this.title || item?.title;
    }
  }
};
</script>
