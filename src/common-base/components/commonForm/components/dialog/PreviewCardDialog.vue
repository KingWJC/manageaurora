<template>
  <el-dialog
    :title="title"
    :modal-append-to-body="false"
    :visible.sync="visible"
    width="800px"
    center
    :before-close="onClose"
  >
    <div class="card-content-padded">
      <PreviewCard
        :auditType="auditType"
        :disabled="false"
        :options.sync="options"
        :formData="formData"
        :config="config"
        :oss="oss"
        :previewConfig="previewConfig"
        @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
        @selectTableShow="(result) => $emit('selectTableShow', result)"
        @sealPageShow="(result) => emit('sealPageShow', result)"
      />
    </div>
  </el-dialog>
</template>
<script>
import PreviewCard from '@/common-base/components/commonForm/components/card/PreviewCard';

export default {
  components: { PreviewCard },
  props: ['visible', 'treeData', 'previewCard'],
  computed: {
    title() {
      return this.previewCard.title;
    }
  },
  data() {
    return {
      config: {
        cols: []
      },
      formData: {},  
      previewConfig: {
        cols: []
      },    
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
      }
    },
  },
  created() {
    const result = this.previewCard.previewCols(this.treeData, this);
    this.previewConfig.cols = result;
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false);
    },
  }
};
</script>
