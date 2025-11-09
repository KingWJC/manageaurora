<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-07 16:31:15
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-12 23:25:25
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\components\tree\ItemTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- questionType 标题 0 /单选 1/多选 2/判断 3 传得分/简答 4/画图 5 传 url-->
<!-- 单选/多选 有 selectionList -->
<template>
  <div :class="`pb10 ${treeData.questionType === '0' ? 'more-table' : ''}`">
    <div
      :class="`pt20 pb10 strong ${
        treeData.questionType === '0' ? `fs-ml` : ''
      }`"
      v-if="treeData.itemName"
    >
      <span class="red">*</span>{{ treeData.itemName
      }}{{
        itemScore &&
        `（${
          typeof itemCalculateScore === 'number' ? `${itemCalculateScore}/` : ''
        }${itemScore}分）`
      }}
    </div>
    <div v-if="treeData.itemScoringRules" class="orange mb10">{{ treeData.itemScoringRules }}</div>
    <div
      v-if="treeData.itemContent"
      v-html="treeData.itemContent.replace(/\r\n/g, '<br/>')"
      class="mb10"
    ></div>
    <div v-if="treeData.selectionList">
      <el-radio-group
        v-if="treeData.questionType === '1'"
        class="radio-button-group"
        v-model="recordItems[treeData.id]"
        :disabled="disabled"
      >
        <el-radio-button
          v-for="selection in treeData.selectionList"
          :label="selection.id"
          :key="selection.id"
          >{{ selection.selectionName
          }}{{
            typeof selection.selectionScore === 'number'
              ? `（${selection.selectionScore}分）`
              : ''
          }}</el-radio-button
        >
      </el-radio-group>
      <el-checkbox-group
        v-else-if="treeData.questionType === '2'"
        class="checkbox-button-group"
        v-model="recordItems[treeData.id]"
        :disabled="disabled"
      >
        <el-checkbox-button
          v-for="selection in treeData.selectionList"
          :label="selection.id"
          :key="selection.id"
          >{{ selection.selectionName
          }}{{
            typeof selection.selectionScore === 'number'
              ? `（${selection.selectionScore}分）`
              : ''
          }}</el-checkbox-button
        >
      </el-checkbox-group>
      <el-input
        class="mt10"
        size="small"
        v-model="recordItems[selection.id]"
        v-for="selection in treeData.selectionList.filter(
          (item) => item.isNeedExplain && recordItems[treeData.id] === item.id
        )"
        :disabled="disabled"
        placeholder="请输入解释"
        :key="selection.id"
      />
    </div>
    <div v-if="treeData.questionImageUrl">
      <viewer
        :images="[treeData.questionImageUrl]"
        class="lc-row lc-space15 full-width mb10"
      >
        <div
          v-for="item in [treeData.questionImageUrl]"
          class="lc-col-12 lc-col-xs3 form-item-image-wrapper"
          :key="item"
        >
          <img :src="item" alt="" />
        </div>
      </viewer>
    </div>
    <div v-if="treeData.questionType === '3'">
      <el-radio-group class="" v-model="recordItems[treeData.id]" :disabled="disabled">
        <el-radio-button
          :class="`judgement-button-${selection.value}`"
          v-for="selection in [
            { label: '正确', value: '1' },
            { label: '错误', value: '0' }
          ]"
          :label="selection.value"
          :key="selection.value"
          >{{ selection.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <div v-if="treeData.questionType === '4'">
      <el-input size="small" v-model="recordItems[treeData.id]" :disabled="disabled"/>
    </div>
    <div v-if="treeData.questionType === '5'" class="flex flex-column">
      <div class="flex flex-row mb10" v-if="!recordItems[treeData.id]">
        <el-button
          type="primary"
          size="small"
          class="mr10"
          :disabled="disabled"
          @click="onDraw(treeData)"
        >
          点击画图
        </el-button>
        <oss-upload
          v-if="!disabled"
          :bucket="oss.bucket"
          :basePath="oss.basePath"
          :region="oss.region"
          :dir-name="oss.dirName"
          :maxSize="oss.maxSize"
          multiple
          :accept="['.jpg', '.png']"
          @uploaded="(data) => fileListImgUploaded(data, treeData.id)"
        >
          <el-button size="small" :disabled="disabled">+ 上传图片</el-button>
        </oss-upload>
        <el-button v-else size="small" :disabled="disabled"
          >+ 上传图片</el-button
        >
      </div>
      <viewer
        v-if="recordItems[treeData.id]"
        :images="[recordItems[treeData.id]]"
        class="lc-row lc-space15 full-width mb10"
      >
        <div
          v-for="item in [recordItems[treeData.id]]"
          class="lc-col-12 lc-col-xs4 form-item-image-wrapper"
          :key="item"
        >
          <img :src="item" alt="" />
          <span
            v-if="!disabled"
            class="close"
            @click="fileListDeleteImage(treeData.id)"
          >
            <i class="el-icon-close"></i>
          </span>
        </div>
      </viewer>
    </div>
    <div
      v-if="treeData.children"
      :class="`${treeData.isSubInline ? 'flex-inline' : ''}`"
    >
      <ItemTree
        v-for="item in treeData.children"
        :treeData="item"
        :key="item.id"
        :recordItems.sync="recordItems"
        :disabled="disabled"
        :oss="oss"
      />
    </div>
    <el-dialog
      :visible.sync="draw.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <ImageDraw
        :oss="oss"
        :imageSrc="draw.imageSrc"
        :imagePos="draw.imagePos"
        v-if="draw.visible"
        @uploadFin="onUploadFin"
      ></ImageDraw>
    </el-dialog>
  </div>
</template>
<script>
import ImageDraw from '@/common-base/components/commonForm/components/draw/ImageDraw';
import OssUpload from '@/common-base/components/upload';
import { calculateScore } from '@/common-base/components/commonForm/utils/scaleItemsUtils';

export default {
  name: 'ItemTree',
  components: { ImageDraw, OssUpload },
  props: {
    treeData: {
      type: Object,
      default: function () {
        return {};
      }
    },
    recordItems: {
      type: Object,
      default: function () {
        return {};
      }
    },
    oss: {
      type: Object,
      default: function () {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      }
    }
  },
  computed: {
    itemScore() {
      if (this.treeData.isShowScore && this.treeData.itemScore) {
        return this.treeData.itemScore;
      }
      return '';
    },
    isCalculateScore() {
      return this.itemScore && ['0', '5'].includes(this.treeData.questionType);
    },
    itemCalculateScore() {
      if (this.isCalculateScore) {
        const score = calculateScore(this.treeData, this.recordItems);
        return score;
      }
      return '';
    }
  },
  data() {
    return {
      draw: {
        visible: false
      }
    };
  },
  watch: {
    recordItems: {
      handler(newValue) {
        this.$emit('update:recordItems', newValue);
      },
      deep: true
    },
    itemCalculateScore: {
      handler(newValue) {
        if (
          this.isCalculateScore &&
          typeof newValue === 'number'
        ) {
          if (this.treeData.questionType === '0') {
            this.recordItems[this.treeData.id] = newValue;
          } else if (this.treeData.questionType === '5') {
            this.recordItems[`${this.treeData.id}.itemScore`] = newValue;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    onDraw(treeData) {
      this.draw = {
        visible: true,
        id: treeData.id,
        imageSrc: treeData.questionImageUrl,
        imagePos: treeData.questionImagePos
      };
    },
    onUploadFin(url) {
      const result = {
        ...this.recordItems,
        [this.draw.id]: url
      };
      this.$emit('update:recordItems', result);
      this.draw = { visible: false };
    },
    fileListImgUploaded(data, id) {
      const fileList = `${this.oss.resourcesLocation + data.Key}`;
      this.$emit('update:recordItems', {
        ...this.recordItems,
        [id]: fileList
      });
    },
    fileListDeleteImage(id) {
      this.$emit('update:recordItems', {
        ...this.recordItems,
        [id]: ''
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.more-table {
  border: 1px solid #ddd;
  border-top: 4px solid #85a5ff;
  border-radius: 8px;
  padding: 0 10px 10px 10px;
  margin-top: 25px;
}
.flex-inline {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}

::v-deep .el-dialog {
  width: 800px; // 默认宽度，对于大于等于 800px 的屏幕
}
.close {
  position: absolute;
  top: 0;
  right: -10px;
  font-size: 22px;
  background: #a7a7a7;
  border-radius: 50%;
  color: #fff;
  width: 22px;
  height: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.el-radio-button.is-active.judgement-button-0::v-deep .el-radio-button__inner {
  background-color: #909399;
  border-color: #909399;
  box-shadow: -1px 0 0 0 #909399;
}

::v-deep .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
  color: #ffffff;
  background-color: #b3d8ff;
  border-color: #b3d8ff;
  box-shadow: none;
}
.el-radio-button.is-active.is-disabled.judgement-button-0::v-deep .el-radio-button__inner {
  color: #ffffff;
  background-color: #d3d4d6;
  border-color: #d3d4d6;
}
@media (max-width: 800px) {
  ::v-deep .el-dialog {
    width: 100%; // 在小于 800px 的屏幕上设置宽度为 100%
  }
}

/* 针对 Element UI（Vue 2）的样式 */
.radio-button-group {
  /* 确保父容器是块级，支持换行 */
  display: inline-block;
  /* 保留组件原有外层边框（可选，根据需求调整） */
  // border: 1px solid #dcdfe6;
  border-radius: 4px; /* 与组件默认圆角一致 */
  padding: 2px; /* 父容器内边距，避免按钮贴边 */
}

/* 修复换行后第一列按钮的左侧边框 */
.radio-button-group .el-radio-button {
  /* 关键：让按钮支持换行（Element UI 默认可能是 inline，需改为 inline-block） */
  display: inline-block;
  margin: 2px 0; /* 可选：增加上下间距，优化换行后的视觉效果 */
}

/* 核心：定位“换行后第一列”的按钮，显示左侧边框 */
.radio-button-group .el-radio-button:not(:first-child):nth-child(1n) {
  /* 覆盖默认的 border-left: none，显示左侧边框 */
  border-left: 1px solid #dcdfe6 !important; /* 颜色与组件默认边框一致 */
}

/* 保留相邻按钮的右侧边框（原逻辑，避免重复） */
.radio-button-group .el-radio-button + .el-radio-button {
  border-left: none !important; /* 相邻按钮仍隐藏左侧边框，只显示分割线 */
}

/* 针对 Element UI（Vue 2）的样式 */
.checkbox-button-group {
  /* 确保父容器是块级，支持换行 */
  display: inline-block;
  /* 保留组件原有外层边框（可选，根据需求调整） */
  // border: 1px solid #dcdfe6;
  border-radius: 4px; /* 与组件默认圆角一致 */
  padding: 2px; /* 父容器内边距，避免按钮贴边 */
}

/* 修复换行后第一列按钮的左侧边框 */
.checkbox-button-group .el-checkbox-button {
  /* 关键：让按钮支持换行（Element UI 默认可能是 inline，需改为 inline-block） */
  display: inline-block;
  margin: 2px 0; /* 可选：增加上下间距，优化换行后的视觉效果 */
}

/* 核心：定位“换行后第一列”的按钮，显示左侧边框 */
.checkbox-button-group .el-checkbox-button:not(:first-child):nth-child(1n) {
  /* 覆盖默认的 border-left: none，显示左侧边框 */
  border-left: 1px solid #dcdfe6 !important; /* 颜色与组件默认边框一致 */
}

/* 保留相邻按钮的右侧边框（原逻辑，避免重复） */
.checkbox-button-group .el-checkbox-button + .el-checkout-button {
  border-left: none !important; /* 相邻按钮仍隐藏左侧边框，只显示分割线 */
}
</style>
