<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-30 23:15:16
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-31 01:46:42
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormViewCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-23 02:00:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-12-10 16:39:36
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormViewCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 17:36:01
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-29 22:00:12
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormViewCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-21 15:36:03
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormViewCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-18 01:30:41
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormViewCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-view">
    <div class="panel-content-padded">
      <div v-if="formData">
        <div class="card-wrapper" v-for="item in detailCards"
          :key="item.ref">
          <component
            :is="item.componentName || 'BasicCard'"
            v-if="(item.children && item.cols || !item.children) && conditionCard(item, 'if')"
            v-show="(item.children && item.cols || !item.children) && conditionCard(item, 'show')"
            :key="item.ref"
            :ref="item.ref"
            :title="item.title"
            :auditType="auditType"
            :disabled="item.disabled ? disabledCard(item) : disabled"
            :options.sync="options"
            :formData.sync="formData"
            :config="config"
            :oss="oss"
            :cols="item.cols"
            :treeConfig="item.treeConfig"
            :previewConfig="item.previewConfig"
            :arrayConfig="item.arrayConfig"
            :recordItemsConfig="item.recordItemsConfig"
            @tagListDialogShow="onTagListDialogShow"
            @selectTableShow="onSelectTableShow"
            @sealPageShow="onSealPageShow"
          />
          <div class="card card-shadow" v-if="item.children">
            <div class="card-body">
              <div class="card-header" v-if="item.title">
                <strong>{{ item.title }}</strong>
              </div>
              <div class="card-content-padded" v-for="child in item.children" :key="child.ref">
                <component
                  :is="child.componentName || 'BasicCard'"
                  v-if="conditionCard(child, 'if')"
                  v-show="conditionCard(child, 'show')"
                  :key="child.ref"
                  :ref="child.ref"
                  :title="child.title"
                  :auditType="auditType"
                  :disabled="child.disabled ? disabledCard(child) : disabled"
                  :options.sync="options"
                  :formData.sync="formData"
                  :config="config"
                  :oss="oss"
                  :cols="child.cols"
                  :treeConfig="child.treeConfig"
                  :previewConfig="child.previewConfig"
                  :arrayConfig="child.arrayConfig"
                  :recordItemsConfig="child.recordItemsConfig"
                  @tagListDialogShow="onTagListDialogShow"
                  @selectTableShow="onSelectTableShow"
                  @sealPageShow="onSealPageShow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <SelectTableDialog
        v-if="selectTableDialog.visible"
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
        :editConfig="selectTableDialog.editConfig"
        @confirm="onSelectTableDialogConfirm"
      ></SelectTableDialog>
      <SelectTablePage
        v-if="selectTablePage.visible"
        :visible.sync="selectTablePage.visible"
        :title="selectTablePage.title"
        :rowKey="selectTablePage.rowKey"
        :additional="selectTablePage.additional"
        :checked="selectTablePage.checked"
        :canSelection="selectTablePage.canSelection"
        :multiple="selectTablePage.multiple"
        :params="selectTablePage.params"
        :immediate="selectTablePage.immediate"
        :cols="selectTablePage.cols"
        :searchBarItems="selectTablePage.searchBarItems"
        :apiModule="selectTablePage.apiModule"
        :apiKey="selectTablePage.apiKey"
        :searchParamsRequired="selectTablePage.searchParamsRequired"
        :editConfig="selectTablePage.editConfig"
        @confirm="onSelectTablePageConfirm"
      ></SelectTablePage>
      <div class="viewport-fixed bg-white power-zi101" v-if="sealPage.show">
        <Seal ref="seal" v-if="sealPage.show" :sealConfig="sealPage"></Seal>
      </div>
      <TagListDialog
        v-if="tagListDialog.visible"
        :visible.sync="tagListDialog.visible"
        :field="tagListDialog.field"
        :model="tagListDialog.model"
        @confirm="onTagListDialogConfirm"
      />
    </div>
</template>
<script>
import BasicCard from '@/common-base/components/commonForm/components/card/BasicCard';
import TreeCard from '@/common-base/components/commonForm/components/card/TreeCard';
import PreviewCard from '@/common-base/components/commonForm/components/card/PreviewCard';
import ArrayCard from '@/common-base/components/commonForm/components/card/ArrayCard';
import ScaleItemsCard from '@/common-base/components/commonForm/components/card/ScaleItemsCard';
import { mergeArrayObject } from '@/common-base/components/commonForm/utils/objectUtils';
import SelectTableDialog from '@/common-base/components/commonForm/components/dialog/SelectTableDialog';
import TagListDialog from '@/common-base/components/commonForm/components/dialog/TagListDialog';
import SelectTablePage from '@/common-base/components/commonForm/components/page/SelectTablePage';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import Seal from '@/common-base/components/seal';

export default {
  components: {
    SelectTableDialog,
    SelectTablePage,
    TagListDialog,
    BasicCard,
    TreeCard,
    PreviewCard,
    ArrayCard,
    ScaleItemsCard,
    Seal,
  },
  mixins: [formDataMixin],
  props: [
    'title',
    'auditType',
    'formData',
    'disabled',
    'cols',
    'config',
    'options'
  ],
  data() {
    const oss = this.config.oss ? {
      ...this.OSSCFG,
      basePath: 'bi',
      ...(this.config.oss || {})
    } : undefined;
    return {
      oss,
      recordItems: {},
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
    detailCards() {
      const loop = (items) => {
        items.forEach(item => {
          if (item.children) {
            loop(item.children);
          } else {
            item.ref = item.ref || item.title || this.utils.UUID();
          }
        });
      }
      loop(this.config.detailCards);
      return this.config.detailCards;
    },
  },
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
  },
  created() {
    this.getDefaultOptions('FORM_VIEW');
    this.initOptions('FORM_VIEW');
    this.initQuestionnaireDataCols();
    this.initScaleItemsCols();
  },
  methods: {
    conditionCard(item, conditionKey) {
      if (typeof item.validator === 'function' && item.validatorKey === conditionKey) {
        return item.validator(this);
      }
      return true;
    },
    disabledCard(item) {
      if (typeof item.disabled === 'function') {
        return item.disabled(this);
      }
      if (typeof item.disabled === 'boolean') {
        return item.disabled;
      }
    },
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
    async save() {
      const params = await Promise.all(
        [
          ...Object.keys(this.$refs).map(refKey => {
            if (Array.isArray(this.$refs[refKey])) {
              return this.$refs[refKey]?.[0]?.validateForm();
            }
            if (this.$refs[refKey]) {
              return this.$refs[refKey]?.validateForm();
            }
          }),
        ].filter(Boolean)
      );
      let sendParams = this.getUpdateParams(mergeArrayObject(params));
      if (typeof this.config.beforeUpdate === 'function') {
        await this.config.beforeUpdate(sendParams, this);
      }
      return sendParams;
    },
    getUpdateParams(sendParams) {
      let params = {
        ...sendParams,
      };
      if (typeof this.config.updateParams === 'function') {
        return this.config.updateParams(this, params) || params;
      }
      return {
        ...params,
        ...(this.config.updateParams || {}),
      };
    },
  }
};
</script>
<style lang="scss" scoped>
.card-wrapper:not(:first-child) {
  margin-top: 10px;
}
</style>
