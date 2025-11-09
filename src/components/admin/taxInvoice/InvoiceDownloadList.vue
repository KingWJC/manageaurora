<template>
  <div>
    <div class="viewport-fixed">
      <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
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
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <div class="search-bar-item">
                <el-input v-model="search.nsrsbh" size="small" placeholder="纳税人识别号" :maxlength="20" />
              </div>
              <div class="search-bar-item">
                <el-date-picker v-model="search.range" size="small" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" />
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                <el-button size="small" type="primary" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="openApply">申请下载</el-button>
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table :data="rows" v-loading="loading" style="width:100%" border>
                <el-table-column prop="nsrsbh" label="纳税人识别号" width="180"></el-table-column>
                <el-table-column label="日期范围" width="200">
                  <template slot-scope="scope">{{ scope.row.kprqq }} ~ {{ scope.row.kprqz }}</template>
                </el-table-column>
                <el-table-column prop="fplx" label="发票类型" width="150"></el-table-column>
                <el-table-column prop="sjlx" label="数据类型" width="100"></el-table-column>
                <el-table-column prop="packageno" label="包号" width="100"></el-table-column>
                <el-table-column prop="packagecount" label="总包数" width="100"></el-table-column>
                <el-table-column prop="packageno" label="发票数量" width="100"></el-table-column>
                <el-table-column prop="packagecount" label="已处理数量" width="100"></el-table-column>
                <el-table-column prop="status" label="任务状态" width="120" align="center">
                  <template slot-scope="scope"><span>{{ dlStatusText(scope.row.status) }}</span></template>
                </el-table-column>
                <el-table-column prop="downloadResult" label="执行时间" width="160"></el-table-column>
                <el-table-column prop="downloadResult" label="完成时间" width="160"></el-table-column>
                <el-table-column prop="errorMsg" label="错误信息" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 申请下载 弹窗 -->
          <el-dialog title="申请下载发票" :visible.sync="dialog.apply" :close-on-click-modal="false" :append-to-body="true" width="520px">
            <div class="panel-content-padded">
              <div class="lc-row lc-space16">
                <div class="lc-col-12">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"><span class="red">*</span>纳税人识别号:</label>
                    <div class="flex-flex-auto"><el-input v-model="apply.nsrsbh" size="small" class="full-width" placeholder="统一社会信用代码/纳税人识别号" /></div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"><span class="red">*</span>开票日期起:</label>
                    <div class="flex-flex-auto"><el-date-picker v-model="apply.kprqq" type="date" size="small" value-format="yyyy-MM-dd" class="full-width" placeholder="选择日期" /></div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"><span class="red">*</span>开票日期止:</label>
                    <div class="flex-flex-auto"><el-date-picker v-model="apply.kprqz" type="date" size="small" value-format="yyyy-MM-dd" class="full-width" placeholder="选择日期" /></div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"><span class="red">*</span>发票类型:</label>
                    <div class="flex-flex-auto">
                      <el-select v-model="apply.fplx" size="small" class="full-width" placeholder="请选择">
                        <el-option label="增值税专用发票" value="01" />
                        <el-option label="货物运输业增值税专用发票" value="02" />
                        <el-option label="机动车销售统一发票" value="03" />
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"><span class="red">*</span>数据类型:</label>
                    <div class="flex-flex-auto">
                      <el-select v-model="apply.sjlx" size="small" class="full-width" placeholder="请选择">
                        <el-option label="进项票" value="1" />
                        <el-option label="销项票" value="2" />
                        <el-option label="自然人推送" value="3" />
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialog.apply=false">取消</el-button>
              <el-button size="small" type="primary" :loading="saving" @click="submitApply">提交</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: { permissions: Object, params: Object },
  data() {
    return { loading: false, saving: false, dialog: { apply: false }, apply: { nsrsbh: '', kprqq: '', kprqz: '', fplx: '', sjlx: '' }, search: { nsrsbh: '', range: [] }, rows: [], pager: { current: 1, size: 10, total: 0 } };
  },
  mounted() { this.getData(); },
  methods: {
    onSearch() { this.pager.current = 1; this.getData(); },
    reset() { this.search = { nsrsbh: '', range: [] }; this.pager.current = 1; this.getData(); },
    openApply() { this.apply = { nsrsbh: this.search.nsrsbh, kprqq: '', kprqz: '', fplx: '', sjlx: '' }; this.dialog.apply = true; },
    dlStatusText(v) {
      if (v === 'success' || v === '02' || v === '成功') return '成功';
      if (v === 'processing' || v === '01' || v === '处理中') return '处理中';
      if (v === 'fail' || v === '03' || v === '失败') return '失败';
      return v || '';
    },
    submitApply() {
      const req = this.apply || {};
      const required = [ ['nsrsbh','请填写纳税人识别号'], ['kprqq','请选择开票日期起'], ['kprqz','请选择开票日期止'], ['fplx','请选择发票类型'], ['sjlx','请选择数据类型'] ];
      for (const [k,m] of required) { if (!req[k]) { this.$message.warning(m); return; } }
      this.saving = true;
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.applyInvoiceDownload;
      if (!svc) {
        // mock success
        setTimeout(() => { this.saving = false; this.dialog.apply = false; this.$message.success('申请已提交'); this.getData(); }, 500);
        return;
      }
      this.API.send(
        svc,
        req,
        (res) => {
          this.saving = false;
          this.dialog.apply = false;
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success('申请已提交');
            this.getData();
          } else {
            this.$message.warning(message || '申请已提交');
          }
        },
        () => {
          this.saving = false;
          this.$message.error('申请失败');
        },
        this
      );
    },
    onPage(p) { this.pager.current = p; this.getData(); },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const demand = { ...this.search, beginDate: this.search.range && this.search.range[0], endDate: this.search.range && this.search.range[1], current: this.pager.current, size: this.pager.size };
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.pagelqadapterDownloads;
      if (!svc) { this.useMock(); return; }
      this.API.send(
        svc,
        demand,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records.map(item => this.normalizeRow(item));
          this.pager.total = total || this.rows.length;
        },
        () => {
          this.useMock();
        },
        this
      );
    },
    formatDateTime(value) {
      if (!value) {
        return '-';
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    },
    normalizeRow(row = {}) {
      return {
        ...row,
        downloadStartTime: this.formatDateTime(row.downloadStartTime),
        downloadEndTime: this.formatDateTime(row.downloadEndTime)
      };
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
        total
      };
    },
    useMock() {
      this.loading = false;
      this.rows = [
        { nsrsbh: '9133MOCK001', kprqq: '2025-10-01', kprqz: '2025-10-31', fplx: '数电发票', sjlx: '明细', packageno: 'PKG001', packagecount: 3, status: '成功', downloadResult: '2025-10-20 10:00:00', errorMsg: '' },
        { nsrsbh: '9133MOCK002', kprqq: '2025-10-01', kprqz: '2025-10-31', fplx: '数电发票', sjlx: '汇总', packageno: 'PKG002', packagecount: 1, status: '处理中', downloadResult: '2025-10-20 11:00:00', errorMsg: '' }
      ];
      this.rows = this.rows.map(item => this.normalizeRow(item));
      this.pager.total = this.rows.length;
    }
  }
};
</script>

<style scoped>
</style>


