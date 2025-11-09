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
                <el-select v-model="search.status" size="small" placeholder="上传状态" clearable>
                  <el-option label="未提交" value="00" />
                  <el-option label="开票中" value="01" />
                  <el-option label="成功" value="02" />
                  <el-option label="失败" value="03" />
                </el-select>
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
                <el-table-column prop="sllsh" label="单据ID" min-width="130"></el-table-column>
                <el-table-column prop="fphm" label="发票号码" min-width="130"></el-table-column>
                <el-table-column prop="fppz" label="票种" min-width="80">
                  <template slot-scope="scope">
                    {{ scope.row.fppz === '01' ? '数电专' : scope.row.fppz === '02' ? '数电普' : scope.row.fppz }}
                  </template>
                </el-table-column>
                <el-table-column prop="fphm" label="对应蓝字发票号码" min-width="130"></el-table-column>
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
                <el-table-column prop="status" label="状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="zdr" label="制单人" min-width="140"></el-table-column>
                <el-table-column prop="zdrq" label="申请日期" min-width="140"></el-table-column>
                <el-table-column prop="shr" label="审核人" min-width="140"></el-table-column>
                <el-table-column prop="shrq" label="审核时间" min-width="140"></el-table-column>
                <el-table-column prop="shstatus" label="审核状态" min-width="100">
                  <template>
                    <el-tag type="success" size="small">审核通过</el-tag>
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
    return { loading: false, search: { fphm: '', status: '' }, rows: [], pager: { current: 1, size: 10, total: 0 } };
  },
  mounted() { this.getData(); },
  methods: {
    onSearch() { this.pager.current = 1; this.getData(); },
    reset() { this.search = { fphm: '', status: '' }; this.pager.current = 1; this.getData(); },
    onPage(p) { this.pager.current = p; this.getData(); },
    toCreate() { /* 红票一般由确认单开票生成，这里保留 */ this.$message.info('请在销方红字确认单列表中执行“开票”'); },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.pageRedlqadapters;
      if (!svc) { this.useMock(); return; }
      const demand = { ...this.search, pageNum: this.pager.current, pageSize: this.pager.size };
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
      this.$router.push({ name: 'taxInvoiceRedDetail', query: { sllsh: row.sllsh } });
    },
    editRow(row) { this.$message.info('红票一般不允许编辑，若需修改请按规则红冲/重开'); },
    previewRow(row) { this.$alert(`预览红票：${row.fphm || '-'}`, '预览', { confirmButtonText: '关闭' }); },
    statusText(v) {
      if (v === '00') return '未提交';
      if (v === '01') return '开票中';
      if (v === '02') return '成功';
      if (v === '03') return '失败';
      return v || '';
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
        kprq: this.formatDateTime(row.kprq),
        zdrq: this.formatDateTime(row.zdrq),
        shrq: this.formatDateTime(row.shrq)
      };
    },
    useMock() {
      this.loading = false;
      const now = this.utils.formatDate(new Date().getTime());
      this.rows = [
        { sllsh: 'RSL0001', fphm: 'RH000001', fppz: '02', kprq: now, xsfnsrsbh: '9133X1X1X1', xsfmc: '销方A', gmfnrsbh: '9133Y2Y2Y2', gmfmc: '购方A', hjje: -1000, hjse: -90, jshj: -1090, status: '02' }
      ];
      this.rows = this.rows.map(item => this.normalizeRow(item));
      this.pager.total = this.rows.length;
    }
  }
};
</script>

<style scoped>
</style>


