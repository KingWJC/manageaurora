<template>
  <div>
    <div class="viewport-fixed">
      <div
        class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar"
      >
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="onPage"
          :page-size="pager.size"
          :current-page="pager.current"
          :total="pager.total"
        />
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <div class="panel pl15 pr15 pt10">
            <div
              class="search-bar flex flex-content-start flex-items-center flex-wrap"
            >
              <div class="search-bar-item">
                <el-input
                  v-model="form.nsrsbh"
                  size="small"
                  placeholder="纳税人识别号"
                  :maxlength="20"
                />
              </div>
              <div class="search-bar-item">
                <el-input
                  v-model="form.nsrmc"
                  size="small"
                  placeholder="纳税人名称"
                  :maxlength="20"
                />
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch"
                  >查询</el-button
                >
                <el-button size="small" type="primary" @click="reset"
                  >重置</el-button
                >
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <tableView
                v-loading="loading"
                :list="rows"
                :cols="tableCols"
              ></tableView>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tableView from '@/common-base/components/pubComponents/tableView';

export default {
  components: {
    tableView
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      loading: false,
      form: {
        nsrsbh: '',
        nsrmc: ''
      },
      rows: [],
      pager: { current: 1, size: 10, total: 0 },
      actionLoading: false,
      actionLoadingInstance: null,
      tableCols: [
        { label: '纳税人识别号', id: 'nsrsbh', width: '220' },
        { label: '纳税人名称', id: 'nsrmc', width: '220' },
        {
          label: '是否已初始化',
          id: 'isInit',
          width: '140',
          align: 'center',
          render: (row) => {
            return row.isInit ? '是' : '否';
          }
        },
        {
          label: '初始化时间',
          id: 'initTime',
          width: '140',
          render: (row) => {
            return this.formatDateTime(row.initTime);
          }
        },
        {
          label: '更新时间',
          id: 'updateTime',
          width: '140',
          render: (row) => {
            return this.formatDateTime(row.updateTime);
          }
        },
        {
          label: '操作',
          width: '120',
          fixed: 'right',
          btns: [
            {
              name: '初始化',
              click: (row) => {
                this.initPreprocess(row);
              },
              condition: () => {
                return true;
              },
              isDisabled: (row) => {
                return this.actionLoading || this.isInitialized(row);
              }
            },
            {
              name: '更新',
              click: (row) => {
                this.updatePreprocess(row);
              },
              condition: () => {
                return true;
              },
              isDisabled: (row) => {
                return this.actionLoading || !this.isInitialized(row);
              }
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    onSearch() {
      this.pager.current = 1;
      this.getRecords();
    },
    reset() {
      this.form = {
        nsrsbh: '',
        nsrmc: ''
      };
      this.pager.current = 1;
      this.getRecords();
    },
    onPage(p) {
      this.pager.current = p;
      this.getRecords();
    },
    isInitialized(row) {
      const v = row && row.isInit;
      return v === true;
    },
    getRecords() {
      this.loading = true;
      const args = {
        current: this.pager.current,
        size: this.pager.size,
        nsrsbh: this.form.nsrsbh,
        nsrmc: this.form.nsrmc
      };
      this.API.send(
        this.CFG.services.taxinvoice.queryPreprocess,
        args,
        (res) => {
          this.loading = false;
          if (res && res.data) {
            this.rows = res.data;
            this.pager.total = res.data.length;
          }

        },
        () => {
          this.loading = false;
          this.rows = [];
          this.pager.total = 0;
        },
        this,
        true
      );
    },
    formatDateTime(v) {
      return this.utils.formatDate(v);
    },
    executePreprocess(row, actionLabel) {
      if (!row || !row.nsrsbh) {
        this.$message.warning('缺少纳税人识别号，无法执行任务');
        return;
      }
      if (this.actionLoading) {
        return;
      }
      this.actionLoading = true;
      if (typeof this.$loading === 'function') {
        this.actionLoadingInstance = this.$loading({
          lock: true,
          text: `${actionLabel}执行中，请稍候…`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      }
      const payload = {
        nsrsbh: row.nsrsbh,
        isInit: !row.isInit
      };
      this.API.send(
        this.CFG.services.taxinvoice.executePreprocess,
        payload,
        (res) => {
          this.closeActionLoading();
          if (res && res.data) {
            this.$message.success(`${actionLabel}任务已触发`);
            this.getRecords();
          } else {
            this.$message.error( `${actionLabel}任务触发失败`);
          }
        },
        () => {
          this.closeActionLoading();
          this.$message.error(`${actionLabel}任务触发失败`);
        },
        this,
        true
      );
    },
    closeActionLoading() {
      this.actionLoading = false;
      if (this.actionLoadingInstance && typeof this.actionLoadingInstance.close === 'function') {
        this.actionLoadingInstance.close();
      }
      this.actionLoadingInstance = null;
    },
    initPreprocess(row) {
      this.executePreprocess(row, '初始化');
    },
    updatePreprocess(row) {
      this.executePreprocess(row, '更新');
    }
  }
};
</script>

<style scoped>
.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  pointer-events: none;
}
</style>


