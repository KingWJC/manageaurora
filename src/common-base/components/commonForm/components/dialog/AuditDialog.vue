<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-01-18 01:30:27
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-01-03 14:51:29
 * @FilePath: \lonch-rxv-fe\src\components\common\dialog\AuditDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    center
  >
    <div>
      <div class="card-content-padded">
        <formView :formConfig="formConfig" :model="form"></formView>
      </div>
      <div class="mt20 tac">
        <el-button size="small" @click="onCancel">关闭</el-button>
        <el-button
          size="small"
          type="primary"
          class="ml10"
          @click="saveFormData"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import formView from '@/common-base/components/pubComponents/form';

export default {
  components: {
    formView
  },
  props: {
    passedValue: {
      type: String,
      default() {
        return '1';
      }
    },
    title: {
      type: String,
      default() {
        return '审核';
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    apiModule: {
      type: String,
      default() {
        return '';
      }
    },
    apiKey: {
      type: String,
      default() {
        return '';
      }
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
        if (newValue) {
          this.initForm();
        }
      }
    }
  },
  data() {
    return {
      form: {},
      formConfig: []
    };
  },
  methods: {
    initForm() {
      this.form = {
        auditAction: this.passedValue,
        auditComment: ''
      };
      this.formConfig = [
        {
          label: '状态',
          id: 'auditAction',
          required: true,
          lg: 24,
          xl: 24,
          md: 24,
          mWidth: '80px',
          type: 'radio',
          placeholder: '',
          options: [
            { c: this.passedValue, n: '通过' },
            { c: '2', n: '驳回' }
          ],
          change: (value) => {
            if (value === '2') {
              this.formConfig[1].required = true;
            } else {
              this.formConfig[1].required = false;
            }
            this.formConfig = [...this.formConfig];
          }
        },
        {
          label: `${this.title}备注`,
          id: 'auditComment',
          lg: 24,
          xl: 24,
          md: 24,
          mWidth: '80px',
          type: 'textarea',
          maxlength: 250,
          placeholder: '请填写内容'
        }
      ];
    },
    onCancel() {
      this.$emit('cancel');
      this.visible = false;
      this.initForm();
    },
    saveFormData() {
      const args = {
        ...this.form,
        ...this.params
      };
      if (args.auditAction === '2' && !args.auditComment) {
        this.$toast({ text: `请填写${this.title}备注！` });
      } else {
        this.API.send(
          this.CFG.services[this.apiModule][this.apiKey],
          args,
          () => {
            this.$emit('confirm');
            this.onCancel();
          },
          () => {},
          this
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-radio-group label.el-radio {
  margin-right: 10px;
}
</style>
