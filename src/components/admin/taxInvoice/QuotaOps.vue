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
                  width="220"
                />
                <el-table-column prop="nsrmc" label="纳税人名称" width="220" />
                <el-table-column
                  prop="ztsxbz"
                  label="暂停赋额标志"
                  width="140"
                />
                <el-table-column
                  prop="bysxed"
                  label="本月发票额度"
                  min-width="120"
                >
                  <template slot-scope="scope"
                    >¥{{ formatCurrency(scope.row.bysxed) }}</template
                  >
                </el-table-column>
                <el-table-column
                  prop="kysyed"
                  label="可用剩余额度"
                  min-width="120"
                >
                  <template slot-scope="scope"
                    >¥{{ formatCurrency(scope.row.kysyed) }}</template
                  >
                </el-table-column>
                <el-table-column
                  prop="yxzed"
                  label="已下载额度"
                  min-width="120"
                >
                  <template slot-scope="scope"
                    >¥{{ formatCurrency(scope.row.yxzed) }}</template
                  >
                </el-table-column>
                <el-table-column
                  prop="yxzwsyed"
                  label="已下载未使用额度"
                  min-width="140"
                >
                  <template slot-scope="scope"
                    >¥{{ formatCurrency(scope.row.yxzwsyed) }}</template
                  >
                </el-table-column>
                <el-table-column prop="sq" label="属期" width="140" />
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="openDownload(scope.row)"
                        >下载</span
                      >
                      <span class="link ml10" @click="openReturn(scope.row)"
                        >退回</span
                      >
                    </p>
                    <p>
                      <span class="link" @click="dialog.adjust = true"
                        >调整有效期</span
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

    <!-- 下载/退回 弹窗 -->
    <el-dialog
      :title="op.sqlx === '0' ? '下载发票额度' : '退回发票额度'"
      :visible.sync="dialog.drVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="480px"
    >
      <div class="panel-content-padded">
        <div class="lc-row lc-space16">
          <div class="lc-col-12">
            <div class="flex flex-content-start flex-items-center">
              <label class="nowrap">申请额度:</label>
              <div class="flex-flex-auto">
                <el-input-number
                  v-model="op.sqed"
                  :precision="2"
                  :min="0"
                  size="small"
                  class="full-width"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDownloadReturn">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="saving"
          @click="submitDownloadReturn"
          >提交</el-button
        >
      </span>
    </el-dialog>

    <!-- 调整有效期 -->
    <el-dialog
      title="调整发票额度有效期"
      :visible.sync="dialog.adjust"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="480px"
    >
      <div class="panel-content-padded">
        <div class="lc-row lc-space16">
          <div class="lc-col-12">
            <div class="flex flex-content-start flex-items-center">
              <label class="nowrap">额度属期(yyyyMM):</label>
              <div class="flex-flex-auto">
                <el-date-picker
                  v-model="adj.sxedsq"
                  type="month"
                  value-format="yyyyMM"
                  size="small"
                  placeholder="选择年月"
                  class="full-width"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog.adjust = false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="saving"
          @click="submitAdjust"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: { permissions: Object, params: Object },
  data() {
    return {
      loading: false,
      loadingQuota: false,
      saving: false,
      form: {
        nsrsbh: '',
        nsrmc: ''
      },
      quotaInfo: null,
      rows: [],
      pager: { current: 1, size: 10, total: 0 },
      dialog: { drVisible: false, adjust: false, query: false },
      op: { nsrsbh: '', sqlx: '0', sqed: 0 },
      adj: { xsfnsrsbh: '', sxedsq: '' }
    };
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    formatCurrency(val) {
      const num = Number(val);
      if (Number.isFinite(num)) {
        return num.toFixed(2);
      }
      return '0.00';
    },
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
      this.quotaInfo = null;
      this.getRecords();
    },
    onPage(p) {
      this.pager.current = p;
      this.getRecords();
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
        this.CFG.services.kailing.pageQuotaRecords,
        demand,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(
            res || {}
          );
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records;
          this.pager.total = total || this.rows.length;
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    openAdjust(row) {
      this.adj.xsfnsrsbh = row.nsrsbh;
      this.dialog.adjust = true;
    },
    openDownload(row) {
      this.op.sqlx = '0';
      this.op.nsrsbh = row.nsrsbh;
      this.dialog.drVisible = true;
    },
    openReturn(row) {
      this.op.sqlx = '1';
      this.op.sxedsq = row.sxedsq;
      this.dialog.drVisible = true;
    },
    closeDownloadReturn() {
      this.dialog.drVisible = false;
      this.op.sqed = 0;
    },
    submitDownloadReturn() {
      if (!this.op.sqed || this.op.sqed <= 0) {
        this.$message.warning('请填写申请额度');
        return;
      }
      this.saving = true;
      const args = {
        nsrsbh: this.op.nsrsbh,
        sqlx: this.op.sqlx,
        sqed: this.op.sqed
      };
      this.API.send(
        this.CFG.services.kailing.operateQuota,
        args,
        (res) => {
          this.saving = false;
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.closeDownloadReturn();
            this.$message.success('提交成功');
            this.getRecords();
          } else {
            this.$message.warning(message || '提交结果未知');
          }
        },
        () => {
          this.saving = false;
        },
        this
      );
    },

    submitAdjust() {
      if (!this.adj.xsfnsrsbh) {
        this.$message.warning('请填写销售方纳税人');
        return;
      }
      if (!this.adj.sxedsq) {
        this.$message.warning('请填写额度属期');
        return;
      }
      this.saving = true;
      this.API.send(
        this.CFG.services.kailing.adjustQuotaExpire,
        { ...this.adj },
        (res) => {
          this.saving = false;
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.dialog.adjust = false;
            this.$message.success('调整成功');
          } else {
            this.$message.warning(message || '调整结果未知');
          }
        },
        () => {
          this.saving = false;
        },
        this
      );
    },
    parsePagedResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.errorMsg : '';
      let records = [];
      let total = 0;
      if (Array.isArray(payload.data)) {
        records = payload.data;
        total = payload.total || payload.count || payload.data.length || 0;
      } else if (Array.isArray(payload.records)) {
        records = payload.records;
        total = payload.total || payload.count || payload.records.length || 0;
      } else if (Array.isArray(payload.list)) {
        records = payload.list;
        total = payload.total || payload.count || payload.list.length || 0;
      }
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        records,
        total,
        data: payload && payload.data ? payload.data : payload
      };
    }
  }
};
</script>

<style scoped>
</style>


