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
              <el-table
                :data="rows"
                v-loading="loading"
                style="width: 100%"
                border
              >
                <el-table-column
                  prop="nsrsbh"
                  label="纳税人识别号"
                  min-width="220"
                />
                <el-table-column
                  prop="nsrmc"
                  label="纳税人名称"
                  min-width="220"
                />
                <el-table-column
                  prop="isInit"
                  label="是否已初始化"
                  min-width="140"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{ scope.row.isInit ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="initTime"
                  label="初始化时间"
                  min-width="140"
                />
                <el-table-column
                  prop="updateTime"
                  label="更新时间"
                  min-width="140"
                />
                <el-table-column label="操作" min-width="120" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span
                        :class="[
                          'link',
                          {
                            disabled: actionLoading || isInitialized(scope.row)
                          }
                        ]"
                        @click="
                          actionLoading || isInitialized(scope.row)
                            ? null
                            : initPreprocess(scope.row)
                        "
                        >初始化</span
                      >
                      <span
                        :class="[
                          'link',
                          'ml10',
                          {
                            disabled: actionLoading || !isInitialized(scope.row)
                          }
                        ]"
                        @click="
                          actionLoading || !isInitialized(scope.row)
                            ? null
                            : updatePreprocess(scope.row)
                        "
                        >更新</span
                      >
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      actionLoadingInstance: null
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
    
    parseServiceResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const list = payload && Array.isArray(payload.data) ? payload.data : [];
      return {
        success: success !== false,
        message: reason || payload?.errorMsg || '',
        list
      };
    },
    getRecords() {
      this.loading = true;
      const demand = {
        current: this.pager.current,
        size: this.pager.size,
        nsrsbh: this.form.nsrsbh,
        nsrmc: this.form.nsrmc
      };
      this.API.send(
        this.CFG.services.kailing.queryPreprocess,
        demand,
        (res) => {
          this.loading = false;
          const { success, message, list } = this.parseServiceResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = list;
          this.pager.total = list.length;
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
        isInit: row.isInit
      };
      this.API.send(
        this.CFG.services.kailing.executePreprocess,
        payload,
        (res) => {
          this.closeActionLoading();
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success(`${actionLabel}任务已触发`);
            this.getRecords();
          } else {
            this.$message.error(message || `${actionLabel}任务触发失败`);
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


