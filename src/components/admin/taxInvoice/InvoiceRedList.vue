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
                <el-table-column prop="kprq" label="开票日期" min-width="140"></el-table-column>
                <el-table-column prop="taskStatus" label="状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.taskStatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="zdr" label="制单人" min-width="140"></el-table-column>
                <el-table-column prop="zdrq" label="申请日期" min-width="140"></el-table-column>
                <el-table-column prop="shr" label="审核人" min-width="140"></el-table-column>
                <el-table-column prop="shrq" label="审核时间" min-width="140"></el-table-column>
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
    toCreate() { /* 红票一般由确认单开票生成，这里保留 */ this.$message.info('请在销方红字确认单列表中执行"开票"'); },
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1, // API 使用 0-based 索引
        rowCount: this.pager.size
      };
      const { fphm, status, gmfmc, kprqRange } = this.search;
      if (fphm) payload.fphm = fphm.trim();
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (status) payload.taskStatus = status;
      if (Array.isArray(kprqRange) && kprqRange.length === 2) {
        // 转换为时间戳格式
        const { kprqStart, kprqEnd } = taxInvoiceUtils.formatDateRangeToTimestamp(kprqRange);
        payload.kprqStart = kprqStart;
        payload.kprqEnd = kprqEnd;
      }
      return payload;
    },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.digitalInvoiceList;
      if (!svc) { this.useMock(); return; }
      const payload = this.buildQueryPayload();
      this.API.send(
        svc,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          // 过滤红票（lzfpbz === '1'）
          const redInvoices = (records || []).filter(item => item.lzfpbz === '1' || item.lzfpbz === 1);
          this.rows = redInvoices.map(item => this.normalizeRow(item));
          this.pager.total = total || this.rows.length;
        },
        () => { this.useMock(); },
        this
      );
    },
    viewRow(row) {
      // 保存行数据到 sessionStorage，供详情页使用
      try {
        sessionStorage.setItem('taxInvoice.redInvoiceDetail', JSON.stringify(row));
      } catch (e) {
        console.error('保存红字发票详情失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      this.$router.push({ name: 'taxInvoiceRedDetail', query: { id: row.id || row.sllsh } });
    },
    editRow(row) { this.$message.info('红票一般不允许编辑，若需修改请按规则红冲/重开'); },
    previewRow(row) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.digitalInvoiceQuery;
      if (!svc || !row || !row.id) {
        this.$alert(`预览红票：${row.fphm || '-'}`, '预览', { confirmButtonText: '关闭' });
        return;
      }
      this.API.send(
        svc,
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
      if (v === '00' || v === 'PENDING') return '待审核';
      if (v === '01' || v === 'PROCESSING') return '审核中';
      if (v === '02' || v === 'APPROVED') return '审核通过';
      if (v === '03' || v === 'REJECTED') return '审核拒绝';
      return v || '';
    },
    parsePagedResult(payload = {}) {
      let body = payload;
      if (body && body.serviceResult) {
        body = body.serviceResult;
      }
      const successFlag = body && body.success !== undefined ? body.success : undefined;
      const code = body && (body.code !== undefined ? body.code : payload.code);
      const success = successFlag !== false && (code === undefined || code === null || code === '0');
      const message = body && (body.msg || body.message || body.reason || body.errorMsg) || payload.msg || payload.message || '';

      // 根据 API 文档，数据在 serviceResult.data 中
      let data = body && body.data !== undefined ? body.data : undefined;
      if (data && data.data) {
        data = data.data;
      }
      // API 返回的 rows 在 data.rows 中
      const records = data && (data.rows || data.records || data.list || data.data) || [];
      // API 返回的 total 在 data.total 中
      const total = data && (data.total !== undefined ? data.total : (data.count !== undefined ? data.count : records.length || 0));
      return { success, message, records, total };
    },
    formatDateTime(value) {
      return taxInvoiceUtils.formatDateTime(value);
    },
    normalizeRow(row = {}) {
      // 根据 API 文档，taskStatus 表示任务状态，reviewStatus 表示审核状态
      const status = row.taskStatus !== undefined && row.taskStatus !== null ? String(row.taskStatus).padStart(2, '0') : (row.status !== undefined && row.status !== null ? String(row.status).padStart(2, '0') : '');
      const auditStatus = row.reviewStatus !== undefined && row.reviewStatus !== null ? String(row.reviewStatus) : (row.shstatus !== undefined && row.shstatus !== null ? String(row.shstatus).padStart(2, '0') : '');
      const hjje = Number(row.hjje || row.totalAmount || 0);
      const hjse = Number(row.hjse || row.totalTax || 0);
      const jshj = Number(row.jshj || row.totalWithTax || hjje + hjse);
      return {
        ...row,
        id: row.id || row.sllsh, // 兼容旧字段
        status: status || row.taskStatus,
        shstatus: auditStatus || row.reviewStatus,
        hjje,
        hjse,
        jshj,
        kprq: this.formatDateTime(row.kprq || row.invoiceDate),
        zdrq: this.formatDateTime(row.createTime || row.zdrq),
        shrq: this.formatDateTime(row.updateTime || row.shrq)
      };
    },
    useMock() {
      this.loading = false;
      const now = this.utils.formatDate(new Date().getTime());
      this.rows = [
        { 
          id: 'RSL0001', 
          sllsh: 'RSL0001', 
          fphm: 'RH000001', 
          lzfpbz: '1',
          fppz: '02', 
          dylzfphm: 'BL000001',
          hzqrxxdbh: 'HZQR001',
          kprq: now, 
          xsfnsrsbh: '9133X1X1X1', 
          xsfmc: '销方A', 
          gmfnrsbh: '9133Y2Y2Y2', 
          gmfmc: '购方A', 
          hjje: -1000, 
          hjse: -90, 
          jshj: -1090, 
          taskStatus: '02',
          reviewStatus: 'APPROVED',
          kpr: '开票人A',
          createTime: now,
          updateTime: now
        }
      ];
      this.rows = this.rows.map(item => this.normalizeRow(item));
      this.pager.total = this.rows.length;
    }
  }
};
</script>

<style scoped>
</style>


