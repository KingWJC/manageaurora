/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-27 00:22:52
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-02 01:00:09
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\formDataMixin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  get as ObjectGet,
  set as ObjectSet,
  getFieldsObject
} from '@/common-base/components/commonForm/utils/objectUtils';
import { findTreeNodeById, setQuestionnaireDataCols } from '@/common-base/components/commonForm/utils/treeUtils';

export default {
  computed: {
    formCols() {
      return this.getFormCols();
    },
    formRules() {
      const rules = {};
      const triggerBlurTypes = ['text', 'textarea', 'number', 'table'];
      function pushRules(item) {
        if (item.id) {
          if (item.required) {
            rules[item.id] = rules[item.id] || [];
            const label = typeof item.label === 'function'
            ? item.label(this)
              : item.label;
            const placeholder = typeof item.placeholder === 'function'
            ? item.placeholder(this)
              : item.placeholder;
            const message = triggerBlurTypes.includes(item.type)
              ? `${
                  (label ? `请输入${label}` : placeholder) || ''
                }`
              : `${
                  (label ? `请选择${label}` : placeholder) || ''
                }`;
              const title = item.title ? `请添加${item.title}` : '';
            if (message || title) {
              rules[item.id].push({
                required: true,
                message: message || title,
                trigger: triggerBlurTypes.includes(item.type)
                  ? 'blur'
                  : 'change'
              });
            }
            if (item.rules?.length) {
              rules[item.id].push(...item.rules);
            }
            /**
             * 添加自定义规则
             * @description: 支持函数返回rules
             */
            if (typeof item.rules === 'function') {
              rules[item.id].push(...item.rules(this)); 
            }
          }
          /**
           * 支持自定义校验规则
           */
          if (item.rules?.length) {
            rules[item.id] = rules[item.id] || [];
            rules[item.id].push(...item.rules);
          }
        }
      }
      function loop(item) {
        if (item.children?.length) {
          item.children.forEach((pItem) => {
            loop(pItem);
          });
        } else {
          pushRules(item);
        }
      }
      loop({ children: this.formCols });
      return rules;
    }
  },
  methods: {
    checkHasSearchParams(cols) {
      if (this.searchParamsRequired) {
        const searchParamsArray = Object.keys(this.getDefaultSearchParams(cols));
        let pass = false;
        for (let i = 0; i < searchParamsArray.length; i++) {
          const key = searchParamsArray[i];
          if (this.searchParams[key]) {
            pass = true;
            break;
          }
        }
        if (!pass) {
          this.$toast({ text: '请输入查询条件' });
        }
        return pass;
      }
      return true;
    },
    getItemOptions(item) {
      if (Array.isArray(item.field?.options)) {
        return item.field?.options || [];
      }
      if (this.options) {
        return this.options[item.field?.options] || [];
      }
      return this[item.field?.options] || [];
    },
    initOptions(type) {
      const loop = (item) => {
        if (item.children?.length) {
          item.children.forEach((pItem) => {
            loop(pItem);
          });
        } else if (
          item.api &&
          item.field?.options &&
          (type === 'LIST_VIEW' || type === 'FORM_VIEW')
        ) {
          const params =
            (typeof item.api.params === 'function'
              ? item.api.params(this)
              : item.api.params) || {};
          this.API.send(
            this.CFG.services[item.api.module][item.api.key],
            params,
            (res) => {
              const options =
                res.serviceResult?.rows || res.serviceResult || [];
              if (this.options) {
                this.options[item.field.options] = options;
              } else {
                this[item.field.options] = options;
              }
            },
            () => {},
            this
          );
        }
      };
      const cols =
        type === 'LIST_VIEW' ? this.getListViewCols() : this.getFormViewCols();
      loop({ children: cols });
    },
    initQuestionnaireDataCols() {
      const loop = (items = []) => {
        items.forEach((item) => {
          if (item.children) {
            loop(item.children);
          } else if (item.componentName === 'PreviewCard' && item.previewConfig?.colsKey) {
            // id 为 questionnaireId (previewConfig 里的 fieldId)
            const id = item.previewConfig.fieldId;
            // colsKey 为 questionnaireDataCols (previewConfig 里的 colsKey) 此时也为 parentId
            const colsKey = item.previewConfig.colsKey;
            const parentId = item.previewConfig.colsKey;
            let treeData = [];
            if (this.options?.[id]) {
              // treeData 已存在, 则直接赋值, 不再查询
              treeData = this.options?.[id];
              if (parentId) {
                const treeNode = findTreeNodeById(treeData, parentId);
                this.$set(this.options, colsKey, setQuestionnaireDataCols(treeNode.children, this, colsKey));
              } else {
                this.$set(this.options, colsKey, setQuestionnaireDataCols(treeData, this, colsKey));
              }
            } else {
              // 首次查询 treeData
              this.API.send(
                this.CFG.services.rxv.questionnaireView,
                { id },
                (res) => {
                  treeData = this.utils.array2tree(res.serviceResult.questionList, 'id', 'parentId');
                  this.$set(this.options, id, treeData);
                  if (parentId) {
                    const treeNode = findTreeNodeById(treeData, parentId);
                    this.$set(this.options, colsKey, setQuestionnaireDataCols(treeNode.children, this, colsKey));
                  } else {
                    this.$set(this.options, colsKey, setQuestionnaireDataCols(treeData, this, colsKey));
                  }
                },
                () => {},
                this
              );
            }
          }
        });
      }
      loop(this.config?.detailCards);
    },
    initScaleItemsCols() {
      const loop = (items = []) => {
        items.forEach((item) => {
          if (item.children) {
            loop(item.children);
          } else if (item.componentName === 'ScaleItemsCard' && item.recordItemsConfig?.fieldId) {
            const id = item.recordItemsConfig.fieldId;
            this.API.send(
              this.CFG.services.rxv.scaleScaleView,
              { id },
              (res) => {
                if (res.serviceResult) {
                  this.formData = {
                    ...this.formData,
                    ...res.serviceResult,
                    recordId: id,
                    id: undefined,
                  }
                  this.$set(this.options, `${id}_itemsList`, res.serviceResult.itemsList);
                }
              },
              () => {},
              this
            );
          }
        });
      }
      loop(this.config?.detailCards);
    },
    getDefaultOptions(type) {
      const options = {};
      const loop = (item) => {
        if (item.children?.length) {
          item.children.forEach((pItem) => {
            loop(pItem);
          });
        } else if (
          item.api &&
          item.field?.options &&
          typeof item.field?.options === 'string' &&
          (type === 'LIST_VIEW' || type === 'FORM_VIEW')
        ) {
          options[item.field?.options] = [];
        }
      };
      const cols =
        type === 'LIST_VIEW' ? this.getListViewCols() : this.getFormViewCols();
      loop({ children: cols });
      return options;
    },
    getDefaultSearchParams(cols) {
      const searchParams = {};
      const loop = (item) => {
        if (item.children?.length) {
          item.children.forEach((pItem) => {
            loop(pItem);
          });
        } else if (item.searchable && item.id) {
          const defaultValue =
            typeof item.defaultValue === 'function'
              ? item.defaultValue(this)
              : item.defaultValue;
          searchParams[item.id] = defaultValue;
        }
      };
      loop({ children: cols || this.getListViewCols() });
      return searchParams;
    },
    getListViewCols() {
      const cols = this.config?.cols || this.cols;
      const result = (typeof cols === 'function'? cols(this) : cols) || [];
      const resultCols = this.config?.cols ? result.filter((v) => v.listable) : result.filter(v => v.label && v.listable !== false);
      return resultCols
        .map((v) => ({
          ...v,
          label: `${v.label}${v.unit ? `（${v.unit}）` : ''}`,
          children: null
        }));
    },
    getSearchCols() {
      const cols = this.config?.cols || this.cols;
      const result = typeof cols === 'function'? cols(this) : cols;
      return result?.filter((v) => v.searchable) || [];
    },
    getFormViewCols() {
      const result = [];
      function loop(items = []) {
        items.forEach((item) => {
          if (item.children) {
            loop(item.children);
          } else if (item.cols) {
              result.push(
                ...item.cols.filter((col) => {
                  if (!col) {
                    return false;
                  }
                  return !result.includes(col);
                })
              );
            }
        });
      }
      loop(this.config?.detailCards);
      const cols = typeof this.config?.cols === 'function' ? this.config.cols(this) : this.config?.cols;
      if (result.length) {
        return result
          .map((id) => cols.find((v) => v.id === id))
          .filter(Boolean);
      }

      return cols?.filter((v) => v.editable);
    },
    getColsDefaultValue(cols) {
      const formData = {};
      const loop = (item) => {
        if (item.children?.length) {
          item.children.forEach((pItem) => {
            loop(pItem);
          });
        } else if (item.id) {
          let defaultValue =
            typeof item.defaultValue === 'function'
              ? item.defaultValue(this)
              : item.defaultValue;
          // if (['checkbox', 'checkboxButton'].includes(item.type)) {
          //   defaultValue = defaultValue || [];
          // }
          ObjectSet(formData, item.id, defaultValue);
        }
      };
      loop({ children: cols });
      return formData;
    },
    getFormCols() {
      const configCols = typeof this.config?.cols === 'function' ? this.config.cols(this) : this.config?.cols;
      const cols = typeof this.cols === 'function'? this.cols(this) : this.cols;
      if (Array.isArray(cols)) {
        return cols
          .map((id) => configCols.find((v) => v.id === id))
          .filter(Boolean);
      }
      return configCols.filter((v) => v.editable);
    },
    getFormDataItemModel(item) {
      const ids = item.id.split('.').filter(Boolean);
      return ids.reduce((model, id) => {
        return model[id];
      }, this.formData);
    },
    getFormDataItemValue(item) {
      return ObjectGet(this.formData, item.id);
    },
    setFormDataItemValue(item, value) {
      if (item.id && this.formData) {
        ObjectSet(this.formData, item.id, value);
      }
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
              resolve(getFieldsObject(this.formData, formFields));
            }
          }
        });
      });
    }
  }
};
