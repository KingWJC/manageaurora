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
                <el-input v-model="search.fphm" size="small" placeholder="红字确认单编码" :maxlength="30" />
              </div>
              <div class="search-bar-item">
                <el-input v-model="search.fphm" size="small" placeholder="蓝字发票号码" :maxlength="30" />
              </div>
              <div class="search-bar-item">
                <el-select v-model="search.status" size="small" placeholder="状态" clearable>
                  <el-option label="未提交" value="00" />
                  <el-option label="开票中" value="01" />
                  <el-option label="销方录入待购方确认" value="02" />
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
                <el-table-column prop="hzqrxxdbh" label="红字确认单编号" min-width="130"></el-table-column>
                <el-table-column prop="dylzfphm" label="蓝字发票号码" min-width="130"></el-table-column>
                <el-table-column prop="hzqrxxdbh" label="红字发票号码" min-width="130"></el-table-column>
                <el-table-column prop="xsfmc" label="销方名称" min-width="150"></el-table-column>
                <el-table-column prop="gmfmc" label="购方名称" min-width="150"></el-table-column>
                <el-table-column prop="lzhjje" label="蓝字发票合计金额" min-width="140">
                  <template slot-scope="scope">¥{{ (scope.row.hjje || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="lzhjse" label="蓝字发票合计税额" min-width="140">
                  <template slot-scope="scope">¥{{ (scope.row.hjse || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="lzjshj" label="蓝字发票价税合计" min-width="140">
                  <template slot-scope="scope">¥{{ (scope.row.jshj || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="hzcxje" label="红字冲销金额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.hjse || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="hzcxse" label="红字冲销税额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.jshj || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="chyy" label="红字发票冲红原因" min-width="140"></el-table-column>
                <el-table-column prop="lrfsf" label="录入方身份" min-width="140"></el-table-column>
                <el-table-column prop="lrrq" label="录入日期" min-width="160"></el-table-column>
                <el-table-column prop="qrrq" label="确认日期" min-width="160"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="120" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="140" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="handleView(scope.row)">查看</span>
                      <span class="link ml10" @click="confirmRow(scope.row, 'Y')">确认</span>
                    </p>
                    <p>
                      <span class="link" @click="confirmRow(scope.row, 'N')">拒绝</span>
                      <span class="link ml10" @click="confirmRow(scope.row, 'N')">开票</span>
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
      search: { fphm: '', status: '' }, 
      rows: [], 
      pager: { current: 1, size: 10, total: 0 }
    };
  },
  mounted() { this.getData(); },
  methods: {
    onSearch() { this.pager.current = 1; this.getData(); },
    reset() { this.search = { fphm: '', status: '' }; this.pager.current = 1; this.getData(); },
    onPage(p) { this.pager.current = p; this.getData(); },
    handleView(row) {
      // 将行数据转换为表单数据格式并保存到 sessionStorage
      const formData = {
        // 基础信息
        xsfmc: row.xsfmc || '',
        lzfphm: row.dylzfphm || '',
        gmfzrrbz: row.gmfzrrbz || '1',
        gmfmc: row.gmfmc || '',
        lzfppzDm: row.lzfppzDm || '02',
        chyyDm: row.chyyDm || row.chyy || '01',
        tdys: row.tdys || '',
        // 销售方信息
        xsfnsrsbh: row.xsfnsrsbh || '',
        xsfdz: row.xsfdz || '',
        xsfdh: row.xsfdh || '',
        xsfkhh: row.xsfkhh || '',
        xsfzh: row.xsfzh || '',
        cezzslx: row.cezzslx || '',
        // 购买方信息
        gmfnrsbh: row.gmfnrsbh || '',
        gmfdz: row.gmfdz || '',
        gmfdh: row.gmfdh || '',
        gmfkhh: row.gmfkhh || '',
        gmfzh: row.gmfzh || '',
        // 明细与合计
        fpmxList: row.fpmxList || [],
        hjjc: row.hjje || row.lzhjje || 0,
        hjs: row.hjse || row.lzhjse || 0,
        jshj: row.jshj || row.lzjshj || 0,
        // 其他信息
        bz: row.bz || ''
      };
      try {
        sessionStorage.setItem('taxInvoice.redBuyerConfirmDetail', JSON.stringify(formData));
      } catch (e) {
        console.error('保存选中自然人失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      this.$router.push({ name: 'taxInvoiceRedBuyerDetail', query: { sllsh: row.sllsh } });
    },
    statusText(v) {
      if (v === '00') return '未提交';
      if (v === '01') return '开票中';
      if (v === '02') return '销方录入待购方确认';
      if (v === '03') return '失败';
      return v || '';
    },
    confirmRow(row, qrlx) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.confirmRedConfirm;
      if (!svc) { this.$message.success((qrlx === 'Y' ? '确认' : '拒绝') + '成功（Mock）'); return; }
      const demand = { xsfnsrsbh: row.xsfnsrsbh, uuid: row.uuid || row.sllsh, hzqrdbh: row.hzqrxxdbh, qrlx };
      this.API.send(
        svc,
        demand,
        (res) => {
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success((qrlx === 'Y' ? '确认' : '拒绝') + '成功');
            this.getData();
          } else {
            this.$message.warning(message || ((qrlx === 'Y' ? '确认' : '拒绝') + '结果未知'));
          }
        },
        () => { this.$message.success((qrlx === 'Y' ? '确认' : '拒绝') + '成功（Mock）'); },
        this
      );
    },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const demand = {
        yhjslx: '1', // 1购方
        lzfphm: this.search.fphm || undefined,
        hzqrxztDm: this.search.status || undefined,
        pageNum: this.pager.current,
        pageSize: this.pager.size
      };
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.pageRedConfirmList;
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
        () => { this.useMock(); },
        this
      );
    },
    useMock() {
      this.loading = false;
      const now = this.utils.formatDate(new Date().getTime());
      this.rows = [
        { sllsh: 'SSL1001', hzqrxxdbh: 'HZQRD1001', dylzfphm: '00010001', xsfmc: '销方X', gmfmc: '购方X', lrrq: now, qrrq: now, status: '02' },
        { sllsh: 'SSL1002', hzqrxxdbh: 'HZQRD1002', dylzfphm: '00010002', xsfmc: '销方Y', gmfmc: '购方Y', lrrq: now, qrrq: now, status: '02' }
      ];
      this.rows = this.rows.map(item => this.normalizeRow(item));
      this.pager.total = this.rows.length;
    },
    parsePagedResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.errorMsg : '';
      const listWrapper = payload.hzqrxxList || payload;
      let records = [];
      let total = 0;
      if (Array.isArray(listWrapper?.data)) {
        records = listWrapper.data;
        total = listWrapper.total || listWrapper.count || listWrapper.data.length || 0;
      } else if (Array.isArray(listWrapper?.records)) {
        records = listWrapper.records;
        total = listWrapper.total || listWrapper.count || listWrapper.records.length || 0;
      } else if (Array.isArray(listWrapper?.list)) {
        records = listWrapper.list;
        total = listWrapper.total || listWrapper.count || listWrapper.list.length || 0;
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
    },
    normalizeRow(row = {}) {
      return {
        ...row,
        lrrq: this.formatDateTime(row.lrrq),
        qrrq: this.formatDateTime(row.qrrq),
        createTime: this.formatDateTime(row.createTime),
        updateTime: this.formatDateTime(row.updateTime)
      };
    }
  }
};
</script>

<style scoped>
</style>


