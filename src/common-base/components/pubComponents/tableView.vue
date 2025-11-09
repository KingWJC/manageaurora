<template>
  <div class="full">
    <template v-if="isTreeTable()">
      <el-table
        :data="list"
        :height="height"
        :max-height="maxHeight"
        :span-method="defaultSpanMethod"
        :lazy="treeConfig.lazy"
        :load="treeConfig.load"
        :row-key="treeConfig.rowKey || 'bind$_@_$Key'"
        :tree-props="{
          children: treeConfig.childrenKey,
          hasChildren: 'hasChildren'
        }"
        :default-expand-all="treeConfig.defaultExpandAll"
        @selection-change="handleSelectionChange"
        @select="rowSelect"
        @select-all="selectAll"
        @expand-change="expandChange"
        @sort-change="sortChange"
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :headerCellStyle="headerCellStyle"
        :header-cell-class-name="headerCellClassName"
        stripe
        width="100%"
        border
        ref="gridTable"
      >
        <el-table-column
          v-if="selection"
          :reserve-selection="true"
          type="selection"
          align="center"
          width="55"
          :selectable="selectInit"
          fixed="left"
        ></el-table-column>
        <template v-for="(item, index) in cols">
          <tableTd
            :key="index"
            :tdData="item"
            :list="list"
            :showFileConfig="showFileConfig"
            v-if="isShow(item)"
          ></tableTd>
        </template>
      </el-table>
    </template>

    <template v-else>
      <el-table
        :data="list"
        :height="height"
        :max-height="maxHeight"
        :span-method="defaultSpanMethod"
        :row-key="'bind$_@_$Key'"
        @selection-change="handleSelectionChange"
        @select="rowSelect"
        @select-all="selectAll"
        @expand-change="expandChange"
        @sort-change="sortChange"
        :default-expand-all="defaultExpandAll"
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :headerCellStyle="headerCellStyle"
        :header-cell-class-name="headerCellClassName"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        stripe
        width="100%"
        border
        ref="gridTable"
      >
        <el-table-column
          v-if="selection"
          :reserve-selection="true"
          type="selection"
          align="center"
          width="55"
          :selectable="selectInit"
        ></el-table-column>
        <el-table-column v-if="expand" type="expand">
          <template slot-scope="props">
            <slot name="expand" :data="props"></slot>
          </template>
        </el-table-column>
        <template v-for="(item, index) in cols">
          <tableTd
            :key="'cols' + index"
            :tdData="item"
            :list="list"
            :showFileConfig="showFileConfig"
            v-if="isShow(item)"
          ></tableTd>
        </template>
        <template #append>
          <slot name="append"></slot>
        </template>
      </el-table>
    </template>

    <showFiles :showFileConfig="showFileConfig"></showFiles>
  </div>
</template>
<script type="text/ecmascript-6">
import showFiles from './showFiles';
import tableTd from './tableTd';
export default {
  name: 'tableView',
  components: { tableTd, showFiles },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    cols: {
      type: Array,
      default() {
        return [];
      }
    },
    treeConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: [String, Number],
      default: undefined
    },
    maxHeight: {
      type: [String, Number],
      default: undefined
    },
    checkedChange: {
      type: Function,
      default: () => {}
    },
    spanMethod: {
      type: Function,
      default: () => {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    expand: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    canSelection: {
      type: Function,
      default: () => {
        return true;
      }
    },
    rowSelect: {
      type: Function,
      default: () => {}
    },
    expandChange: {
      type: Function,
      default: () => {}
    },
    sortChange: {
      type: Function,
      default: () => {}
    },
    selectAll: {
      type: Function,
      default: () => {}
    },
    setRowClass: {
      type: Function,
      default: () => {
        return '';
      }
    },
    /**
     * 设置单元格的className
     */
    setCellClass: {
      type: Function,
      default: () => {
        return '';
      }
    },
    headerCellStyle: {
      type: Function,
      default: () => {}
    },
    /**
     * 表头单元格的设置类名
     */
    headerCellClassName: {
      type: Function,
      default: () => []
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function,
      default: () => {}
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowRealCostInfo: false,
      currentRealCostId: -1,
      isShowTargetCostInfo: false,
      currentTargetCostId: -1,
      column: [],
      multipleSelection: [],
      showFileConfig: {
        show: false,
        title: false,
        type: null,
        fileData: null
      }
      //isEnableFixedCol: true
    };
  },
  created() {
    //this.isEnableFixedCol = this.globalData.viewportWidth > 768 ? true : false
  },
  mounted() {},
  watch: {
    list(val) {
      this.initBindKey(val);
      this.clearSelected();
    }
  },
  methods: {
    clearSelected() {
      this.$refs.gridTable.clearSelection();
    },
    rowClassName({ row, index }) {
      return this.setRowClass(row, index);
    },

    /**
     * 单元格的className
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return this.setCellClass({ row, column, rowIndex, columnIndex });
    },
    initBindKey(list, ind) {
      list.forEach((i, index) => {
        if (!i.hasOwnProperty('bind$_@_$Key')) {
          if (ind) {
            i['bind$_@_$Key'] = ind + '-' + (index + 1);
          } else {
            i['bind$_@_$Key'] = index + 1;
          }
        }
        if (i.children) {
          this.initBindKey(i.children, i['bind$_@_$Key']);
        }
      });
    },
    isTreeTable() {
      const result = Boolean(this.treeConfig.childrenKey);
      return result;
    },
    defaultSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.spanMethod) {
        return this.spanMethod({ row, column, rowIndex, columnIndex });
      }
    },
    /**
     * 判断复选框是否可以勾选
     * @param row 表格行数据
     * @param index 表格行下标值
     */
    selectInit(row, index) {
      return this.canSelection(row, index);
    },
    /**
     * 是否显示列
     * @param config 列配置对象
     */
    isShow(config) {
      if (typeof config.hide === 'function') {
        return !config.hide();
      }
      return !config.hide;
    },
    /**
     * 设置表格勾选数据
     */
    setChecked() {
      this.setCheckedData(this.multipleSelection);
    },
    toggleRowSelection(row, selected) {
      this.$nextTick(() => {
        this.$refs.gridTable.toggleRowSelection(row, selected);
      });
    },
    /**
     * 选中值发生改变
     * @param val 选中值列表
     */
    handleSelectionChange(val) {
      this.list.forEach((i) => {
        let flag = false;
        val.forEach((tiem) => {
          if (tiem === i) {
            flag = true;
          }
        });
        if (flag) {
          i.checked = true;
        } else {
          i.checked = false;
        }
      });
      this.multipleSelection = val;
      if (this.checkedChange) {
        this.checkedChange(val);
      }
    },
    getSelectionData(key) {
      if (this.multipleSelection.length === 0) {
        return [];
      }
      const ARR = [];
      this.multipleSelection.forEach((i) => {
        if (key) {
          ARR.push(i[key]);
        } else {
          ARR.push(i);
        }
      });
      return ARR;
    }
  }
};
</script>
