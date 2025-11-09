<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-18 12:09:05
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-31 15:14:40
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\components\dialog\TagListDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    title="添加/删除标签"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    center
    :before-close="onClose"
  >
    <div class="tag-group-title">已有标签</div>
    <div class="tag-group-content">
      <el-tag
        v-for="(tag, index) in localTags"
        :key="tag.id"
        closable
        type="success"
        class="mr10 mb10"
        @close="removeLocalTag(index)"
      >
        {{ tag.name }}
      </el-tag>
      <div v-if="localTags.length === 0">
        <div class="secondary tac pt20 p20">没有标签</div>
      </div>
    </div>
    <div class="tag-group-title">
      <div class="flex flex-content-between flex-items-center">
        <div>待选标签</div>
        <div class="flex">
          <el-input
            size="mini"
            class="mr10 tag-group-addtag-inp"
            v-model.trim="tagName"
            :maxlength="20"
          ></el-input>
          <el-button size="mini" @click="addRemoteTag()">新增标签</el-button>
        </div>
      </div>
    </div>
    <div class="tag-group-content">
      <el-tag
        v-for="tag in remoteTags"
        :key="tag.id"
        closable
        type="info"
        @close="deleteRemoteTag(tag)"
        @click="addToLocalTags(tag)"
        class="mr10 mb10"
      >
        {{ tag.name }}
      </el-tag>
      <div v-if="remoteTags.length === 0">
        <div class="secondary tac pt20 p20">没有标签</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['visible', 'field', 'model'],
  data() {
    return {
      localTags: [],
      remoteTags: [],
      current: 1,
      rowCount: 100,
      tagName: undefined
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
      }
    }
  },
  created() {
    this.onOpen();
  },
  methods: {
    onOpen() {
      // 把页面上的标签回显到弹框已有标签
      this.localTags = (this.model || []).map((item) => {
        return {
          id: item[this.field.modelValueKey],
          name: item[this.field.modelLabelKey]
        };
      });
      this.getRemoteTags();
    },
    getRemoteTags() {
      this.API.send(
        this.CFG.services.tag.dataQueryTagsInGroup,
        {
          current: this.current,
          rowCount: this.rowCount,
          group: { tagGroupId: this.field.groupId }
        },
        (res) => {
          this.remoteTags = res.serviceResult?.list || [];
        },
        () => {},
        this
      );
    },
    onClose() {
      this.$emit('update:visible', false);
      this.$emit(
        'confirm',
        this.localTags.map((tag) => {
          return {
            [this.field.modelValueKey]: tag.id,
            [this.field.modelLabelKey]: tag.name
          };
        })
      );
    },
    // 删除标签 上
    removeLocalTag(index) {
      this.localTags.splice(index, 1);
    },
    // 添加到上
    addToLocalTags(tag) {
      const result = this.localTags.find((item) => item.id === tag.id);
      if (!result) {
        this.localTags.push(tag);
      }
    },
    // 新增标签 下
    addRemoteTag() {
      // 给分组加标签
      if (!this.tagName) {
        return this.$toast({ text: '请填写标签' });
      }
      this.API.send(
        this.CFG.services.tag.addTagToGroup,
        {
          tag: {
            tagName: this.tagName
          },
          tagGroup: {
            tagGroupId: this.field.groupId
          }
        },
        () => {
          this.getRemoteTags();
          this.tagName = '';
        },
        () => {},
        this
      );
    },
    // 删除标签 下
    deleteRemoteTag(tag) {
      // 给分组删标签
      this.API.send(
        this.CFG.services.tag.delDelTagFromGroup,
        {
          tag: {
            tagId: tag.id
          },
          tagGroup: {
            tagGroupId: this.field.groupId
          }
        },
        function () {
          this.getRemoteTags();
        },
        function () {},
        this
      );
    }
  }
};
</script>
<style lang="scss" scoped>
// 标签
.tag-group-title {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 5px 10px;
}

.tag-group-content {
  margin-bottom: 20px;
  padding: 10px 0;
}
.tag-group-addtag-inp {
  max-width: 150px;
}
</style>