<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 17:52:22
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-07 13:41:05
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
        >
        </FormItem>
      </div>
    </el-form>
  </div>
  <div class="card card-shadow" v-else>
    <div class="card-body">
      <div class="card-header" v-if="title">
        <strong>{{ title }}</strong>
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
              :config.sync="config"
              :disabled="disabled"
              :options.sync="options"
              :oss="oss"
              @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
              @selectTableShow="(result) => $emit('selectTableShow', result)"
              @sealPageShow="(result) => emit('sealPageShow', result)"
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
import { getFieldsObject } from '@/common-base/components/commonForm/utils/objectUtils';
export default {
  props: [
    'title',
    'auditType',
    'formData',
    'disabled',
    'cols',
    'config',
    'options',
    'oss',
    'previewConfig',
  ],
  components: { FormItem },
  mixins: [formDataMixin],
  computed: {
    formCols() {
      if (typeof this.previewConfig?.cols === 'function') {
        return this.previewConfig.cols(this.options, this);
      }
      if (this.previewConfig?.cols?.length) {
        return this.previewConfig.cols;
      }
      if (this.config?.[this.previewConfig?.colsKey]?.length) {
        return this.config[this.previewConfig.colsKey];
      }
      if (this.options?.[this.previewConfig?.colsKey]?.length) {
        return this.options[this.previewConfig.colsKey];
      }
      return [];
    } 
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
    },
    async validateForm() {
      const formFields = this.$refs.formDom.fields.map((v) => v.prop);
      const errorMessages = [];
      return await new Promise((resolve, reject) => {
        this.$refs.formDom.validateField(formFields, (errorMessage) => {
          errorMessages.push(errorMessage);
          if (errorMessages.length === formFields.length) {
            const realErrorMessages = errorMessages.filter(Boolean);
            if (realErrorMessages.length) {
              reject(realErrorMessages[0]);
            } else {
              const formResult = getFieldsObject(this.formData, formFields);
              const result = this.convertFormResult(formResult);
              const fieldId = this.previewConfig?.fieldId;
              if (fieldId) {
                result.questionnaireId = fieldId;
              }
              resolve(result);
            }
          }
        });
      });
    },
    convertFormResult: (result) => {
      const answerListMap = {};
      const removeObject = {};
      Object.keys(result).forEach(key => {
        const [id, type] = key.split('_');
        if (/^\$(text|number|date)\$\d+$/.test(type)) {
          answerListMap[id] = answerListMap[id] || [];
          answerListMap[id].push(result[key]); 
        } else if (Array.isArray(result[key])) {
          if (/\_\$splitCondition\$$/.test(key) && result[key].length) {
            // 如果该 key 用 $splitCondition$ 分割, 不去赋值
          } else if (result[key].length) {
            answerListMap[id] = {
              answerOptionId: result[key],
            };
          }
        } else if (result[key]) {
          answerListMap[id] = {
            answerOptionId: result[key],
          };
        }
        removeObject[key] = undefined;
      });
      const answerList = [];
      Object.entries(answerListMap).forEach(([key, value]) => {
       if (Array.isArray(value)) {
          answerList.push({
            questionId: key,
            answerContent: JSON.stringify(value),
          });
        } else if (Array.isArray(value.answerOptionId)) {
          value.answerOptionId.forEach(item => {
            answerList.push({
              questionId: key,
              answerOptionId: item,
            });
          })
        } else {
          answerList.push({
            questionId: key,
            ...value,
          });
        }
      });
      return { answerList, ...removeObject };
    }
  }
};
</script>
