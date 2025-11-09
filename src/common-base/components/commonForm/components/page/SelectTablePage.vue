<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-07 00:38:03
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-31 11:20:45
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\components\page\SelectTablePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-fixed bg-white z10">
    <crumbs-bar
      :title="title"
      :isCustomerBackEvent="true"
      @back="$emit('update:visible', false)"
    ></crumbs-bar>
    <div
      class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar"
    >
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="search"
        :page-size="searchParams.rowCount"
        :current-page="searchParams.current"
        :total="total"
      ></el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel pl15 pr15 pt10">
          <div
            class="search-bar flex flex-content-start flex-items-center flex-wrap"
          >
            <div
              class="search-bar-item"
              v-for="item in getSearchCols()"
              :key="item.id"
            >
              <el-input
                v-if="item.type === 'text' || item.type === 'textarea'"
                v-model="searchParams[item.id]"
                size="small"
                :placeholder="item.label"
                :maxlength="item.maxlength"
                clearable
              />
              <el-select
                v-else-if="item.type === 'select'"
                v-model="searchParams[item.id]"
                size="small"
                :placeholder="item.label"
                filterable
                :clearable="!item.searchRequired"
              >
                <el-option
                  v-for="option in getItemOptions(item)"
                  :label="
                    option[item.field.labelKey] || item.field.labelRenderer(option)
                  "
                  :key="option[item.field.valueKey]"
                  :value="option[item.field.valueKey]"
                >
                </el-option>
              </el-select>
            </div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="search(1)"
                >查询</el-button
              >
              <el-button size="small" type="primary" @click="onReset()"
                >重置</el-button
              >
              <el-button v-if="editConfig.add" size="small" type="primary" @click="editTableModel()"
                >新增</el-button
              >
              <el-button v-if="multiple" size="small" type="primary" @click="onConfirm()">确定</el-button>
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <tableView
              ref="tableView"
              v-if="isMounted"
              :rowKey="rowKey"
              :list="list"
              :cols="tableCols"
              :height="gridHeight"
              :selection="multiple"
              :canSelection="canSelection"
              :checkedChange="handleSelectionChange"
            >
            </tableView>
          </div>
        </div>
      </div>
    </div>
    <FormEditDialog
      v-if="tableFormDialog.visible"
      :visible.sync="tableFormDialog.visible"
      :width="tableFormDialog.width"
      :title="tableFormDialog.title"
      :model="tableFormDialog.model"
      :auditType="auditType"
      :config="tableFormDialog.config"
      :options="options"
      :cols="tableFormDialog.cols"
      :oss="oss"
      @confirm="tableFormDialog.onConfirm"
    />
  </div>
</template>
<script>
import tableView from '@/common-base/components/pubComponents/tableView';
import crumbsBar from '@/common-base/components/crumbs-bar';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import FormEditDialog from '@/common-base/components/commonForm/FormEditDialog';

export default {
  components: {
    tableView,
    crumbsBar,
    FormEditDialog,
  },
  mixins: [formDataMixin],
  props: {
    searchParamsRequired: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rowKey: {
      type: String,
      default() {
        return 'id';
      }
    },
    additional: {
      type: Boolean,
      default() {
        return false;
      }
    },
    checked: {
      type: Array
    },
    title: {
      type: String,
      default() {
        return '请选择';
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    canSelection: {
      type: Function,
      // canSelection(row, index)
      default: () => {
        return true;
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    apiModule: {
      type: Object,
      default() {
        return {};
      }
    },
    apiKey: {
      type: Object,
      default() {
        return {};
      }
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    immediate: {
      type: Boolean,
      default() {
        return false;
      }
    },
    cols: {
      type: Array,
      default() {
        return [];
      }
    },
    beforeConfirm: {
      type: Function,
      default() {
        return true;
      }
    },
    editConfig: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      options: this.getDefaultOptions('LIST_VIEW'),
      gridHeight: 500,
      isMounted: false,
      total: 0,
      list: [],
      searchParams: {
        current: 1,
        rowCount: 15,
        ...this.getDefaultSearchParams(),
      },
      selection: [],
      tableFormDialog: { visible: false },
    };
  },
  created() {
    this.initCols();
    if (this.immediate) {
      this.getData();
    }
    if (this.checked) {
      this.selection = [...this.checked];
    }
    this.initOptions('LIST_VIEW');
  },
  mounted() {
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + 'px';
    this.isMounted = true;
  },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
      }
    }
  },
  methods: {
    initCols() {
      this.tableCols = [
        ...this.getListViewCols(),
        !this.multiple
          ? {
              label: '操作',
              fixed: 'right',
              width: '100',
              btns: [
                {
                  name: '选择',
                  isDisabled: (row) => {
                    return !this.canSelection(row);
                  },
                  click: (row) => {
                    this.onConfirm(row);
                  }
                }
              ]
            }
          : null
      ].filter(Boolean);
    },
    getData() {
      if (this.checkHasSearchParams()) {
        this.API.send(
          this.CFG.services[this.apiModule][this.apiKey],
          {
            ...this.searchParams,
            ...this.params
          },
          (res) => {
            res = res.serviceResult || res;
            this.list = res.rows || res;
            this.total = res.total >= 0 ? res.total : this.total;
            if (this.rowKey && this.multiple) {
              this.isCheckingTable = true;
              this.$nextTick(() => {
                this.list.forEach((row) => {
                  if (this.selection.map(v => v[this.rowKey]).includes(row[this.rowKey])) {
                    this.$refs.tableView.toggleRowSelection(row, true);
                  }
                });
                this.isCheckingTable = false;
              });
            }
          },
          () => {},
          this
        );
      }
    },
    // 重置
    onReset() {
      this.searchParams = {
        ...this.searchParams,
        ...this.getDefaultSearchParams(),
        current: 1,
      };
      if (this.searchParamsRequired) {
        this.list = [];
        this.total = 0;
      } else {
        this.getData(true);
      }
    },
    /**
     * 查询表格数据
     * @param pager 查询目标分页
     */
    search(pager) {
      this.searchParams.current = pager || 1;
      this.getData();
    },
    handleSelectionChange(val) {
      if (this.additional && this.rowKey) {
        if (!this.isCheckingTable) {
          this.selection = [
            ...this.selection.filter(
              (v) =>
                !this.list.map((row) => row[this.rowKey]).includes(v[this.rowKey])
            ),
            ...val
          ];
        }
      } else {
        this.selection = val;
      }
    },
    onCancel() {
      this.$emit('update:visible', false);
      this.$refs.tableView.clearSelected();
    },
    onConfirm(row) {
      const changed = row || [...this.selection];
      if (typeof this.beforeConfirm === 'function') {
        if (this.beforeConfirm(changed)) {
          this.$emit('confirm', changed);
          this.onCancel();
        }
        return;
      }
      this.$emit('confirm', changed);
      this.onCancel();
    },
    editTableModel(row, rowIndex) {
      const item = {
       ...this.editConfig,
       cols: this.cols,
      };
      const initRow = typeof item.initRow === 'function' ? item.initRow(row, rowIndex, this) : item.initRow;
      const rowItem = row ? { ...row, _selfTable: undefined } : null;
      const model = initRow ? {
        ...(rowItem || {}),
       ...initRow,
      } : rowItem;
      this.tableFormDialog = {
        visible: true,
        title: row ? `编辑` : `新增`,
        width: item.rowField?.width,
        model,
        config: item,
        options: this.options,
        oss: item.oss,
        onConfirm: () => {
          this.getData();
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.w180 {
  width: 180px;
  max-width: 180px;
}
.z10 {
  z-index: 10;
}
</style>
