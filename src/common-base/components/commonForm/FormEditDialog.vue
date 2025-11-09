<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-07-18 13:40:03
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-06 21:51:43
 * @FilePath: \lonch-rxv-fe\src\components\admin\bizDic\components\dialog\BizDicEditDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      :width="dialogWidth"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      center
    >
      <el-form :model="formData" :rules="formRules" ref="formDom">
        <div class="lc-row lc-space16 full-width">
          <FormItem
            v-for="item in formCols"
            :key="item.id"
            :item="item"
            :auditType="auditType"
            :formData.sync="formData"
            :config="config"
            :disabled="disabled"
            :options="options"
            :oss="oss"
            layout="full"
            @tagListDialogShow="onTagListDialogShow"
            @selectTableShow="onSelectTableShow"
            @sealPageShow="onSealPageShow"
          >
          </FormItem>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button @click="$emit('update:visible', false)"> 取消 </el-button>
        <el-button type="primary" @click="onConfirm"> 确定 </el-button>
      </div>
    </el-dialog>
    <SelectTableDialog
      v-if="selectTableDialog && selectTableDialog.visible"
      :visible.sync="selectTableDialog.visible"
      :title="selectTableDialog.title"
      :rowKey="selectTableDialog.rowKey"
      :additional="selectTableDialog.additional"
      :checked="selectTableDialog.checked"
      :canSelection="selectTableDialog.canSelection"
      :multiple="selectTableDialog.multiple"
      :params="selectTableDialog.params"
      :immediate="selectTableDialog.immediate"
      :cols="selectTableDialog.cols"
      :searchBarItems="selectTableDialog.searchBarItems"
      :apiModule="selectTableDialog.apiModule"
      :apiKey="selectTableDialog.apiKey"
      :searchParamsRequired="selectTableDialog.searchParamsRequired"
      @confirm="onSelectTableDialogConfirm"
    ></SelectTableDialog>
    <TagListDialog
      v-if="tagListDialog && tagListDialog.visible"
      :visible.sync="tagListDialog.visible"
      :field="tagListDialog.field"
      :model="tagListDialog.model"
      @confirm="onTagListDialogConfirm"
    />
  </div>
</template>
<script>
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';

export default {
  props: [
    'visible',
    'width',
    'model',
    'config',
    'title',
    'auditType',
    'disabled',
    'cols',
    'options',
    'oss'
  ],
  mixins: [formDataMixin],
  beforeCreate() {
    this.$options.components.FormItem = () => import('@/common-base/components/commonForm/FormItem.vue');
    this.$options.components.SelectTableDialog = () => import('@/common-base/components/commonForm/components/dialog/SelectTableDialog');
    this.$options.components.TagListDialog = () => import('@/common-base/components/commonForm/components/dialog/TagListDialog');
  },
  components: { FormItem: () => import('@/common-base/components/commonForm/FormItem.vue') },
  data() {
    return {
      formData: { ...this.getInitFormData() },
      selectTableDialog: {
        visible: false,
      },
      selectTablePage: {
        visible: false,
      },
      sealPage: {
        show: false,
      },
      tagListDialog: {
        visible: false,
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.title || (this.model ? '编辑' : '新增');
    },
    dialogWidth() {
      return this.width || '400px';
    }
  },
  watch: {
    visible(value) {
      this.$emit('update:visible', value);
    },
    formCols: {
      handler() {
        this.$nextTick(() => {
          this.$refs.formDom.clearValidate();
        });
      },
    }
  },
  methods: {
    onSelectTableShow(tableConfig) {
      this[tableConfig.type] = {
        ...tableConfig,
        visible: true,
      }
    },
    onTagListDialogShow(tagListConfig) {
      this.tagListDialog = {
        ...tagListConfig,
        visible: true,
      };
    },
    onSealPageShow(sealPage) {
      this.sealPage.show = true;
      this.sealPage.okFn = (pngBase64) => {
        sealPage.onChange({
          type: 'image/png',
          base64Data: pngBase64
        }, this);
      }
    },
    onTagListDialogConfirm(tagList) {
      if (typeof this.tagListDialog.onConfirm === 'function') {
        this.tagListDialog.onConfirm(tagList, this);
      }
    },
    onSelectTableDialogConfirm(item) {
      if (typeof this.selectTableDialog.onConfirm === 'function') {
        this.selectTableDialog.onConfirm(item, this);
      }
    },
    onSelectTablePageConfirm(item) {
      if (typeof this.selectTablePage.onConfirm === 'function') {
        this.selectTablePage.onConfirm(item, this);
      }
    },
    getInitFormData() {
      if (this.model) {
        return { ...this.model };
      }
      const data = this.getColsDefaultValue(this.getFormCols());
      return data;
    },
    async onConfirm() {
      try {
        await this.validateForm();
        if (this.config.module) {
          let apiParams = this.model ? this.config.updateParams : this.config.createParams;
          if (typeof apiParams === 'function') {
            apiParams = apiParams(this);
          }
          this.API.send(
            this.CFG.services[this.config.module][
              this.model ? this.config.update : this.config.create
            ],
            { 
              ...this.formData,
              ...(apiParams || {}),
              ...this.config.params
            },
            () => {
              this.$emit('confirm');
              this.$emit('update:visible', false);
            },
            () => {},
            this
          );
        } else {
          this.$emit('confirm', { ...this.formData });
          this.$emit('update:visible', false);
        }
      } catch (error) {
        this.$toast({ text: error });
      }
    }
  }
};
</script>
