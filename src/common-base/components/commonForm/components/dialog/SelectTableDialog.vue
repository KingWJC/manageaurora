<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-01-18 01:30:27
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-25 01:19:49
 * @FilePath: \lonch-rxv-fe\src\components\common\dialog\SelectTableDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="800px"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="onCancel"
  >
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
        </div>
      </div>
    </div>
    <div class="flex-flex-auto panel p15" ref="viewBody">
      <div class="panel-table-content">
        <tableView
          ref="tableView"
          :rowKey="rowKey"
          :list="list"
          :cols="tableCols"
          height="40vh"
          :selection="multiple"
          :canSelection="canSelection"
          :checkedChange="handleSelectionChange"
        >
        </tableView>
      </div>
    </div>
    <div class="tar">
      <el-pagination
        v-if="total !== null"
        background
        layout="total, prev, pager, next"
        @current-change="search"
        :page-size="searchParams.rowCount"
        :current-page="searchParams.current"
        :total="total"
      ></el-pagination>
    </div>
    <div v-if="multiple" slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onConfirm()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import tableView from '@/common-base/components/pubComponents/tableView';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';

export default {
  components: {
    tableView
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
    }
  },
  data() {
    return {
      options: this.getDefaultOptions('LIST_VIEW'),
      total: 0,
      list: [],
      searchParams: {
        current: 1,
        rowCount: 15,
        ...this.getDefaultSearchParams(),
      },
      selection: [],
      tableCols: [],
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
                  if (
                    this.selection
                      .map((v) => v[this.rowKey])
                      .includes(row[this.rowKey])
                  ) {
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
                !this.list
                  .map((row) => row[this.rowKey])
                  .includes(v[this.rowKey])
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
          return;
        }
      }
      this.$emit('confirm', changed);
      this.onCancel();
    }
  }
};
</script>
<style lang="scss" scoped>
.w180 {
  width: 180px;
  max-width: 180px;
}
</style>
