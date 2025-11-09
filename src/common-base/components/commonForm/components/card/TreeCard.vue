<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-02-20 17:24:55
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-26 21:56:41
 * @FilePath: \lonch-rxv-fe\src\common-base\components\commonForm\components\card\TreeCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-02-20 17:24:55
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-24 18:15:29
 * @FilePath: \lonch-rxv-fe\src\common-base\components\commonForm\components\card\TreeCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="card card-shadow card-wrapper">
    <div class="card-body">
      <div class="card-header" v-if="title">
        <strong>{{ title }}</strong>
      </div>
      <div class="card-content-padded">
        <div
          class="search-bar flex flex-content-start flex-items-center flex-wrap"
        >
          <div class="search-bar-item">
            <el-input
              v-model="filterText"
              size="small"
              :placeholder="`输入名称进行过滤`"
              clearable
            />
          </div>
          <div class="search-bar-item-auto">
            <el-button size="small" type="primary" @click.stop="onReset()"
              >重置</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="!disabled"
              :disabled="disabledTreeNode('addRoot')"
              @click.stop="onEditTreeNode()"
              >新增</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="treeConfig.previewCard"
              @click.stop="onPreviewTree()"
              >预览</el-button
            >
          </div>
        </div>
        <div :class="`full-height flex flex-nowrap mt5 tree-card-wrapper`">
          <div class="left-box p10 full-height">
            <el-tree
              @node-click="onCheckTreeNode"
              ref="treeRef"
              class="full-width el-tree"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :data="treeData"
              :render-content="renderTreeContent"
              :filter-node-method="filterNode"
              :emptyText="treeConfig.treePlaceholder || `暂无数据`"
              :props="{
                children: treeConfig.field.childrenKey || 'children',
                label: treeConfig.field.labelKey || 'name',
                isLeaf: treeConfig.field.isLeafKey || 'children',
              }"
              :nodeKey="treeConfig.field.nodeKey"
              >
            </el-tree>
          </div>
          <div class="full-height right-box" v-if="treeNodeData">
            <div class="card-wrapper" v-for="item in treeNodeCards"
            :key="item.ref">
              <BasicCard
                v-if="conditionCard(item, 'if')"
                v-show="conditionCard(item, 'show')"
                :key="item.ref"
                :ref="item.ref || item.title"
                :title="item.title"
                :auditType="auditType"
                :disabled="disabled || getItemDisabled(item)"
                :options.sync="item.options"
                :formData.sync="treeNodeData"
                :config="config"
                :oss="oss"
                :cols="item.cols"
                @tagListDialogShow="(result) => $emit('tagListDialogShow', result)"
                @selectTableShow="(result) => $emit('selectTableShow', result)"
                @sealPageShow="(result) => emit('sealPageShow', result)"
                @ootListPageShow="(result) => $emit('ootListPageShow', result)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <FormEditDialog
      v-if="formEditDialog.visible"
      :visible.sync="formEditDialog.visible"
      :title="formEditDialog.title"
      :width="formEditDialog.width"
      :model="formEditDialog.model"
      :options="formEditDialog.options"
      :config="formEditDialog.config"
      :cols="formEditDialog.cols"
      :oss="config.oss"
      :auditType="auditType"
      @confirm="formEditDialog.onConfirm"
    />
    <PreviewCardDialog
      :treeData="previewCardDialog.treeData"
      :previewCard="treeConfig.previewCard"
      :visible.sync="previewCardDialog.visible"
      v-if="previewCardDialog.visible">
    </PreviewCardDialog>
  </div>
</template>
<script>
import BasicCard from '@/common-base/components/commonForm/components/card/BasicCard';
import PreviewCardDialog from '@/common-base/components/commonForm/components/dialog/PreviewCardDialog';
import FormEditDialog from '@/common-base/components/commonForm/FormEditDialog';

export default {
  components: { BasicCard, PreviewCardDialog, FormEditDialog },
  props: ['params', 'cols', 'auditType', 'config', 'treeConfig', 'title', 'options', 'formData', 'disabled'],
  computed:{
    propsTreeData() {
      if (this.formData?.[this.treeConfig?.field?.treeDataKey]) {
        return this.formData[this.treeConfig.field.treeDataKey];
      }
      return undefined;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    },
    propsTreeData(val) {
      if (val) {
        this.treeData = val;
      }
    },
  },
  data() {
   return {
      filterText: '',
      treeData: [],
      treeNodeData: {},
      treeNodeCards: [],
      formData: {},
      previewCardDialog: {
        visible: false,
        treeData: [],
      },
      formEditDialog: {
        visible: false,
        title: '',
        width: '500px',
        model: {},
        options: {},
        config: {},
        cols: []
      }
    };
  },
  methods: {
    onPreviewTree() {
      const treeData = this.utils.deepCopy(this.treeData);
      if (treeData.length === 0) {
        return this.$toast({ text: '暂无数据预览' });
      }

      this.previewCardDialog = {
        visible: true,
        treeData,
      };
    },
    disabledTreeNode(type, node) {
      if (this.disabled) {
        return true;
      }
      if (typeof this.treeConfig.disabled === 'function') {
        return this.treeConfig.disabled(type, node, this);
      }
      return false;
    },
    renderTreeContent(h, { data, node }) {
      return (
        <span class="custom-tree-node pr10">
          <span>{this.getTreeNodeLabel(data, node)}</span>
          <span>
            {this.disabled ? null : <el-button disabled={this.disabledTreeNode('addChild', node)} class="el-icon-plus ml10" type="text" on-click={
              (e) => {
                e.stopPropagation();
                this.onEditTreeNode(data, node, true)
              }}></el-button>}
            {this.disabled ? null : <el-button disabled={this.disabledTreeNode('edit', node)} class="el-icon-edit-outline ml5" style="font-size:16px;" type="text" on-click={ (e) => {
              e.stopPropagation();
              this.onEditTreeNode(data, node);
            } }></el-button>}
            {this.disabled || this.disabledUpDownNode(data, node, 'down') ? null : <el-button disabled={this.disabledTreeNode('down', node)} class="el-icon-bottom ml5" style="font-size:16px;" type="text" on-click={ (e) => {
              e.stopPropagation();
              this.onUpDownTreeNode(data, node, 'down');
            } }></el-button>}
            {this.disabled || this.disabledUpDownNode(data, node, 'up') ? null : <el-button disabled={this.disabledTreeNode('up', node)} class="el-icon-top ml5" style="font-size:16px;" type="text" on-click={ (e) => {
              e.stopPropagation();
              this.onUpDownTreeNode(data, node, 'up');
            } }></el-button>}
            {this.disabled ? null : <el-button class="el-icon-delete ml5" disabled={this.disabledTreeNode('delete', node)} style="font-size:16px;" type="text" on-click={ (e) => {
              e.stopPropagation();
              this.onDeleteTreeNode(data, node);
            } }></el-button>}
          </span>
        </span>
      );
    },
    getTreeNodeLabel(data, node) {
      if (typeof this.treeConfig.field.labelRenderer === 'function') {
        return this.treeConfig.field.labelRenderer(data, node, this);
      }
      if (node?.label) {
        return node.label;
      }
      if (this.treeConfig.field.labelKey) {
        return data?.[this.treeConfig.field.labelKey];
      }
      return data?.name;
    },
    disabledUpDownNode(data, node, type) {
      const nodeKey = this.treeConfig.field.nodeKey || 'id';
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const currentIndex = children.findIndex(d => d[nodeKey] === data[nodeKey]);
      if (type === 'down') {
        return currentIndex === children.length - 1;
      }
      return currentIndex === 0;
    },
    /**
     * 同级切换 treeNode 顺序
     */
    onUpDownTreeNode(data, node, type) {
      const nodeKey = this.treeConfig.field.nodeKey || 'id';
      const parent = node.parent;
      let children = parent.data.children || parent.data;
      const currentIndex = children.findIndex(d => d[nodeKey] === data[nodeKey]);
      const currentData = children[currentIndex];
      // 下移动
      if (type === 'down') {
        const nextIndex = currentIndex + 1;
        children.splice(currentIndex, 1);

        this.$nextTick(() => {
          children.splice(nextIndex, 0, currentData);
        });
        // 上移动
      } else {
        const lastIndex = currentIndex - 1;
        const lastData = children[lastIndex];
        children.splice(lastIndex, 1);
        this.$nextTick(() => {
          children.splice(currentIndex, 0, lastData);
        });
      }
    },
    /**
     * 编辑 treeNode 节点
     * @param data 节点数据
     * @param node 节点
     * @param isParent 是否是父节点
     */
    onEditTreeNode(data, node, isParent) {
      const parentNodeKey = this.treeConfig.field.parentNodeKey || 'parentId';
      const parentNodeNameKey = this.treeConfig.field.parentNodeNameKey || 'parentName';
      const label = this.getTreeNodeLabel(data, node);
      const nodeKey = this.treeConfig.field.nodeKey || 'id';
      const model = isParent ? {
        [parentNodeKey]: data[nodeKey], [parentNodeNameKey]: label
      } : data;
      this.formEditDialog = {
        visible: true,
        model,
        cols: this.cols,
        title: `${isParent || !data ? '新增' : '编辑'}${this.treeConfig.nodeTitle}`,
        config: {...this.config, module: undefined },
        onConfirm: (item) => {
          item[nodeKey] = item[nodeKey] || this.utils.UUID();
          // 新增根节点
          if (!data) {
            this.treeData.push(item);
            this.$nextTick(() => {
              this.onCheckTreeNode(this.treeData[this.treeData.length - 1]);
            });
          } else if (isParent) {
            // 新增子节点
            this.$set(data, 'children', [
              ...(data.children || []),
              item
            ]);
            this.$nextTick(() => {
              this.onCheckTreeNode(node.childNodes[node.childNodes.length - 1].data, node.childNodes[node.childNodes.length - 1]);
            });
          } else {
            // 编辑节点
            Object.keys(item).forEach(key => {
              this.$set(data, key, item[key]);
            });
          }
        }
      }
    },
    /**
     * 删除 treeNode 节点
     * @param data 节点数据
     * @param node 节点
     */
    onDeleteTreeNode(data, node) {
      const nodeKey = this.treeConfig.field.nodeKey || 'id';
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d[nodeKey] === data[nodeKey]);
      if (this.treeNodeData?.[nodeKey] === data[nodeKey]) {
        this.treeNodeData = null;
      }
      children.splice(index, 1);
    },
    onCheckTreeNode(data, node) {
      const nodeKey = this.treeConfig.field.nodeKey || 'id';
      if (data?.[nodeKey] === this.treeNodeData?.[nodeKey]) {
        return;
      }
      this.treeNodeData = data;
      this.treeNodeCards = this.getTreeNodeCards(data, node);
    },
    getTreeNodeCards(data, node) {
      if (typeof this.treeConfig.nodeCards === 'function') {
        return this.treeConfig.nodeCards(data, node, this);
      }
      return this.treeConfig.nodeCards || [];
    },
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
    getItemDisabled(item) {
      if (!item) {
        return false;
      }
      if (typeof item.disabled === 'function') {
        return item.disabled(this);
      }
      if (item.disabled === undefined) {
        return false;
      }
      return !!item.disabled;
    },
    filterNode(value, data) {
      if (!value) return true;
      if (typeof this.treeConfig.filterNode === 'function') {
        return this.treeConfig.filterNode(value, data, this);
      }
      return this.getTreeNodeLabel(data).indexOf(value) !== -1;
    },
    async validateForm() {
      return await this.treeConfig.validateForm(this.treeData, this);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-wrapper:not(:first-child) {
  margin-top: 10px;
}
.left-box{
  border: 1px solid #dddddd;
  width: 33%;
  overflow: auto;
}
.right-box{
 flex-grow: 1;
}
.tree-card-wrapper {
  gap: 10px;
  flex-direction: row;
}
::v-deep .el-tree .el-tree-node>.el-tree-node__children {
  overflow: visible !important;
}
@media screen and (max-width: 768px) {
  .left-box {
    width: 100%;
  }
  .tree-card-wrapper {
    gap: 10px;
    flex-direction: column;
  }
}
</style>
