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
                <el-button size="small" type="primary" @click="toCreate">新增</el-button>
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
                <el-table-column prop="chyy" label="红字发票冲红原因" min-width="140"></el-table-column>
                <el-table-column prop="lrfsf" label="录入方身份" min-width="140"></el-table-column>
                <el-table-column prop="lrrq" label="录入日期" min-width="160"></el-table-column>
                <el-table-column prop="lrrq" label="开票失败原因" min-width="160"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="130" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'">作废(发起方已撤销)</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="handleView(scope.row)">查看</span>
                      <span class="link ml10" @click="confirmRow(scope.row, 'Y')">确认</span>
                    </p>
                    <p>
                      <span class="link" @click="submitRow(scope.row)">提交</span>
                      <span class="link ml10" @click="confirmRow(scope.row, 'C')">撤销</span>
                    </p>
                    <p>
                      <span class="link" @click="toRedInvoice(scope.row)">开票</span>
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
    toCreate() { this.$router.push({ name: 'taxInvoiceBlueInvoiceQuery', query: { next: 'taxInvoiceRedSellerCreate' } }); },
    handleView(row) {
      this.$alert(`红字确认单编号：${row.hzqrxxdbh || '-'}\n蓝字发票：${row.dylzfphm || '-'}`, '查看', { confirmButtonText: '知道了' });
    },
    submitRow(row) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.applyRedConfirm;
      if (!svc) { this.$message.success('提交成功（Mock）'); return; }
      const demand = {
        lrfsf: '0',
        xsfnsrsbh: row.xsfnsrsbh,
        xsfmc: row.xsfmc,
        gmfnsrsbh: row.gmfnsrsbh,
        gmfmc: row.gmfmc,
        lzfphm: row.dylzfphm,
        lzhjje: row.lzhjje,
        lzhjse: row.lzhjse,
        chyyDm: row.chyyDm || '01',
        lzmxxh: 1,
        xh: 1,
        sphfwssflhbbm: row.sphfwssflhbbm || '3040501',
        hwhyslwfwmc: row.hwhyslwfwmc || '技术服务',
        spfwjc: row.spfwjc || '技术',
        xmmc: row.xmmc || '服务',
        je: row.je || 0,
        sl1: row.sl1 || 0,
        se: row.se || 0
      };
      this.API.send(
        svc,
        demand,
        (res) => {
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success('提交成功');
            this.getData();
          } else {
            this.$message.warning(message || '提交成功');
          }
        },
        () => { this.$message.success('提交成功（Mock）'); },
        this
      );
    },
    confirmRow(row, qrlx) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.confirmRedConfirm;
      if (!svc) { this.$message.success((qrlx === 'Y' ? '确认' : '撤销') + '成功（Mock）'); return; }
      const demand = { xsfnsrsbh: row.xsfnsrsbh, uuid: row.uuid || row.sllsh, hzqrdbh: row.hzqrxxdbh, qrlx };
      this.API.send(
        svc,
        demand,
        (res) => {
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success((qrlx === 'Y' ? '确认' : '撤销') + '成功');
            this.getData();
          } else {
            this.$message.warning(message || ((qrlx === 'Y' ? '确认' : '撤销') + '结果未知'));
          }
        },
        () => { this.$message.success((qrlx === 'Y' ? '确认' : '撤销') + '成功（Mock）'); },
        this
      );
    },
    toRedInvoice(row) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.createRedlqadapter;
      if (!svc) { this.$message.success('开票成功（Mock）'); return; }
      const demand = {
        dylzfphm: row.dylzfphm,
        hzqrdbh: row.hzqrxxdbh,
        uuid: row.uuid,
        xsfnsrsbh: row.xsfnsrsbh,
        gmfnsrsbh: row.gmfnsrsbh
      };
      this.API.send(
        svc,
        demand,
        (res) => {
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success('开票成功');
            this.$router.push({ name: 'taxInvoiceRedList', query: { lzfphm: row.dylzfphm, uuid: row.uuid } });
          } else {
            this.$message.warning(message || '开票结果未知');
          }
        },
        () => { this.$message.success('开票成功（Mock）'); },
        this
      );
    },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const demand = { 
        yhjslx: '0', // 0销方
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
        { sllsh: 'SSL0001', hzqrxxdbh: 'HZQRD0001', dylzfphm: '00000001', xsfmc: '销方A', gmfmc: '购方A', lrrq: now, status: '02' },
        { sllsh: 'SSL0002', hzqrxxdbh: 'HZQRD0002', dylzfphm: '00000002', xsfmc: '销方B', gmfmc: '购方B', lrrq: now, status: '02' }
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
        lrrq: this.formatDateTime(row.lrrq),
        createTime: this.formatDateTime(row.createTime),
        updateTime: this.formatDateTime(row.updateTime)
      };
    }
  }
};
</script>

<style scoped>
</style>


