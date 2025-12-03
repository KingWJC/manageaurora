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
                <el-input v-model="search.fphm" size="small" placeholder="发票号码" :maxlength="30" />
              </div>
              <div class="search-bar-item">
                <el-input v-model="search.gmfmc" size="small" placeholder="购方名称" :maxlength="50" />
              </div>
              <div class="search-bar-item">
                <el-select v-model="search.status" size="small" placeholder="上传状态" clearable>
                  <el-option label="未提交" value="00" />
                  <el-option label="开票中" value="01" />
                  <el-option label="成功" value="02" />
                  <el-option label="失败" value="03" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-date-picker
                  v-model="search.kprqRange"
                  type="daterange"
                  unlink-panels
                  size="small"
                  start-placeholder="开票日期起"
                  end-placeholder="开票日期止"
                  value-format="yyyy-MM-dd"
                />
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                <el-button size="small" type="primary" @click="reset">重置</el-button>
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table :data="rows" v-loading="loading" style="width:100%" border>
                <el-table-column prop="id" label="单据ID" min-width="130"></el-table-column>
                <el-table-column prop="fphm" label="发票号码" min-width="130"></el-table-column>
                <el-table-column prop="fppz" label="票种" min-width="80">
                  <template slot-scope="scope">
                    {{ scope.row.fppz === '01' ? '数电专' : scope.row.fppz === '02' ? '数电普' : scope.row.fppz }}
                  </template>
                </el-table-column>
                <el-table-column prop="dylzfphm" label="对应蓝字发票号码" min-width="130"></el-table-column>
                <el-table-column prop="hzqrxxdbh" label="红字确认信息单编号" min-width="130"></el-table-column>
                <el-table-column prop="xsfmc" label="销方名称" min-width="150"></el-table-column>
                <el-table-column prop="gmfmc" label="购方名称" min-width="150"></el-table-column>
                <el-table-column prop="hjje" label="合计金额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.hjje || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="hjse" label="合计税额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.hjse || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="jshj" label="价税合计" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.jshj || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="kpr" label="开票人" min-width="140"></el-table-column>
                <el-table-column prop="kprq" label="开票日期" min-width="140">
                  <template slot-scope="scope">
                    <span>{{ formatDateTime(scope.row.kprq) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="taskStatus" label="状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.taskStatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fhrxm"
                  label="审核人"
                  min-width="140"
                ></el-table-column>
                <el-table-column prop="reviewTime" label="审核时间" min-width="140">
                  <template slot-scope="scope">{{
                    formatDateTime(scope.row.reviewTime)
                  }}</template>
                </el-table-column>
                <el-table-column prop="reviewStatus" label="审核状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ auditStatusText(scope.row.reviewStatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="140" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="viewRow(scope.row)">查看</span>
                      <span class="link ml10" @click="previewRow(scope.row)">预览</span>
                    </p>
                    <p>
                      <span class="link" @click="auditRow(scope.row)">审核</span>
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
import taxInvoiceUtils from './taxInvoiceUtils';

export default {
  props: { permissions: Object, params: Object },
  data() {
    return { 
      loading: false, 
      search: { 
        fphm: '', 
        gmfmc: '', 
        status: '',
        kprqRange: []
      }, 
      rows: [], 
      pager: { current: 1, size: 10, total: 0 } 
    };
  },
  mounted() { this.getData(); },
  activated() {
    this.getData();
  },
  methods: {
    onSearch() { this.pager.current = 1; this.getData(); },
    reset() { 
      this.search = { 
        fphm: '', 
        gmfmc: '', 
        status: '',
        kprqRange: []
      }; 
      this.pager.current = 1; 
      this.getData(); 
    },
    onPage(p) { this.pager.current = p; this.getData(); },
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1,
        rowCount: this.pager.size
      };
      const { fphm, status, gmfmc, kprqRange } = this.search;
      if (fphm) payload.fphm = fphm.trim();
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (status) payload.taskStatus = status;
      if (Array.isArray(kprqRange) && kprqRange.length === 2) {
        const { kprqStart, kprqEnd } = taxInvoiceUtils.formatDateRangeToTimestamp(kprqRange);
        payload.kprqStart = kprqStart;
        payload.kprqEnd = kprqEnd;
      }
      // 只查询蓝字发票
      payload.lzfpbz = '1';
      return payload;
    },
    getData() {
      this.loading = true;
      const payload = this.buildQueryPayload();
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceList,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(
            res || {}
          );
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records || [];
          this.pager.total = total || this.rows.length;
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    viewRow(row) {
      this.$router.push({
        name: 'taxInvoiceRedDetail',
        query: { id: row.id || row.sllsh, mode: 'view' }
      });
    },
    previewRow(row) {
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceQuery,
        { invoiceId: row.id },
        (res) => {
          const { success, message, data } = this.parseServiceResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          const invoiceData = success && data ? data : row || {};
          this.$alert(`预览红票：${invoiceData.fphm || '-'}`, '预览', { confirmButtonText: '关闭' });
        },
        () => {
          this.$alert(`预览红票：${row.fphm || '-'}`, '预览', { confirmButtonText: '关闭' });
        },
        this
      );
    },
    parseServiceResult(payload = {}) {
      let body = payload;
      if (body && body.serviceResult) {
        body = body.serviceResult;
      }
      const successFlag = body && body.success !== undefined ? body.success : undefined;
      const code = body && (body.code !== undefined ? body.code : payload.code);
      const success = successFlag !== false && (code === undefined || code === null || code === '0');
      const message = body && (body.msg || body.message || body.reason || body.errorMsg) || payload.msg || payload.message || '';
      const data = body && (body.data !== undefined ? body.data : body.result || body.record || body.entity) || {};
      return { success, message, data };
    },
    statusText(v) {
      if (v === '00') return '未提交';
      if (v === '01') return '开票中';
      if (v === '02') return '成功';
      if (v === '03') return '失败';
      return v || '';
    },
    auditStatusText(v) {
      if (v === '00') return '待审核';
      if (v === '01') return '审核通过';
      if (v === '02') return '审核退回';
      return v || '';
    },
    sendAuditRequest(svc, row, auditStatus, reviewRemark) {
      if (!row || !row.id) {
        this.$message.warning('缺少发票ID，无法审核');
        return;
      }
      const payload = {
        invoiceId: row.id,
        reviewer: this.CFG.userinfo.name,
        reviewStatus: auditStatus,
        reviewRemark: reviewRemark || ''
      };
      this.loading = true;
      this.API.send(
        svc,
        payload,
        (res) => {
          this.loading = false;
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success('审核成功');
            this.getData();
          } else {
            this.$message.warning(message);
          }
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    auditRow(row) {
      let inputValue = '';
      this.$prompt('请输入审核意见（可选）', '审核发票', {
        confirmButtonText: '审核通过',
        cancelButtonText: '审核退回',
        showCancelButton: true,
        distinguishCancelAndClose: true,
        inputType: 'textarea',
        inputPlaceholder: '请输入审核意见',
        closeOnClickModal: false,
        inputValidator: (value) => {
          inputValue = value || '';
          return true;
        }
      })
        .then(({ value }) => {
          // 审核通过：reviewStatus = '01'
          this.sendAuditRequest(
            this.CFG.services.kailing.digitalInvoiceAudit,
            row,
            '01',
            value || ''
          );
        })
        .catch((action) => {
          if (action === 'cancel') {
            // 审核退回：reviewStatus = '02'
            this.sendAuditRequest(
              this.CFG.services.kailing.digitalInvoiceAudit,
              row,
              '02',
              inputValue || ''
            );
          }
        });
    },
    parsePagedResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.error : '';
      let records = [];
      let total = 0;
      if (payload && payload.serviceResult) {
        records = payload.serviceResult.rows || [];
        total = payload.serviceResult.total || 0;
      }
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        records,
        total
      };
    },
    formatDateTime(value) {
      return taxInvoiceUtils.formatDateTime(value);
    }
  }
};
</script>

<style scoped>
</style>


