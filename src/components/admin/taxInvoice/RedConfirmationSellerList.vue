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
                <el-input v-model="search.gmfmc" size="small" placeholder="购方名称" :maxlength="50" />
              </div>
              <div class="search-bar-item">
                <el-input v-model="search.lzfphm" size="small" placeholder="蓝字发票号码" :maxlength="30" />
              </div>
              <div class="search-bar-item">
                <el-select v-model="search.hzqrxxztDm" size="small" placeholder="状态" clearable>
                  <el-option label="无需确认" value="01" />
                  <el-option label="销方录入待购方确认" value="02" />
                  <el-option label="购方录入待销方确认" value="03" />
                  <el-option label="已确认" value="04" />
                  <el-option label="已撤销" value="08" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-date-picker
                  v-model="search.lrrqRange"
                  type="daterange"
                  unlink-panels
                  size="small"
                  start-placeholder="录入日期起"
                  end-placeholder="录入日期止"
                  value-format="yyyy-MM-dd"
                />
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="toCreate">新增</el-button>
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table :data="rows" v-loading="loading" style="width:100%" border>
                <el-table-column prop="id" label="单据ID" min-width="130"></el-table-column>
                <el-table-column prop="hzfpxxqrdbh" label="红字确认单编号" min-width="150"></el-table-column>
                <el-table-column prop="lzfphm" label="蓝字发票号码" min-width="130"></el-table-column>
                <el-table-column prop="xsfmc" label="销方名称" min-width="150"></el-table-column>
                <el-table-column prop="gmfmc" label="购方名称" min-width="150"></el-table-column>
                <el-table-column prop="hzcxje" label="红字冲销金额" min-width="120">
                  <template slot-scope="scope">
                    <span :class="{ 'text-red': Number(scope.row.hzcxje || 0) < 0 }">
                      ¥{{ Number(scope.row.hzcxje || 0) < 0 ? Number(scope.row.hzcxje || 0).toFixed(2) : (-Number(scope.row.hzcxje || 0)).toFixed(2) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="hzcxse" label="红字冲销税额" min-width="120">
                  <template slot-scope="scope">
                    <span :class="{ 'text-red': Number(scope.row.hzcxse || 0) < 0 }">
                      ¥{{ Number(scope.row.hzcxse || 0) < 0 ? Number(scope.row.hzcxse || 0).toFixed(2) : (-Number(scope.row.hzcxse || 0)).toFixed(2) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="chyyDm" label="冲红原因" min-width="120">
                  <template slot-scope="scope">{{ chyyText(scope.row.chyyDm) }}</template>
                </el-table-column>
                <el-table-column prop="lrfsf" label="录入方身份" min-width="120">
                  <template slot-scope="scope">{{ lrfsfText(scope.row.lrfsf) }}</template>
                </el-table-column>
                <el-table-column prop="lrrq" label="录入日期" min-width="160">
                  <template slot-scope="scope">{{ formatDateTime(scope.row.lrrq) }}</template>
                </el-table-column>
                <el-table-column prop="hzqrxxztDm" label="状态" min-width="140" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.hzqrxxztDm) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="handleView(scope.row)">查看</span>
                      <span 
                        class="link ml10" 
                        :class="{ 'link-disabled': !canEdit(scope.row) }"
                        @click="canEdit(scope.row) && handleEdit(scope.row)"
                      >编辑</span>
                    </p>
                    <p>
                      <span 
                        class="link" 
                        :class="{ 'link-disabled': !canSubmit(scope.row) }"
                        @click="canSubmit(scope.row) && submitRow(scope.row)"
                      >提交</span>
                      <span 
                        class="link ml10" 
                        :class="{ 'link-disabled': !canCancel(scope.row) }"
                        @click="canCancel(scope.row) && cancelRow(scope.row)"
                      >撤销</span>
                    </p>
                    <p>
                      <span 
                        class="link" 
                        :class="{ 'link-disabled': !canInvoice(scope.row) }"
                        @click="canInvoice(scope.row) && toRedInvoice(scope.row)"
                      >开票</span>
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
        gmfmc: '', 
        lzfphm: '', 
        hzqrxxztDm: '',
        lrrqRange: []
      }, 
      rows: [], 
      pager: { current: 1, size: 10, total: 0 }
    };
  },
  mounted() { 
    this.getData(); 
  },
  activated() {
    this.getData();
  },
  methods: {
    onSearch() { 
      this.pager.current = 1; 
      this.getData(); 
    },
    reset() { 
      this.search = { 
        gmfmc: '', 
        lzfphm: '', 
        hzqrxxztDm: '',
        lrrqRange: []
      }; 
      this.pager.current = 1; 
      this.getData(); 
    },
    onPage(p) { 
      this.pager.current = p; 
      this.getData(); 
    },
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1, 
        rowCount: this.pager.size,
        lrfsf: '0' // 购方：1，销方：0
      };
      const { gmfmc, lzfphm, hzqrxxztDm, lrrqRange } = this.search;
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (lzfphm) payload.lzfphm = lzfphm.trim();
      if (hzqrxxztDm) payload.hzqrxxztDm = hzqrxxztDm;
      if (Array.isArray(lrrqRange) && lrrqRange.length === 2) {
        const { lrrqStart, lrrqEnd } = taxInvoiceUtils.formatDateRangeToTimestamp(lrrqRange);
        if (lrrqStart !== undefined) payload.lrrqStart = String(lrrqStart);
        if (lrrqEnd !== undefined) payload.lrrqEnd = String(lrrqEnd);
      }
      return payload;
    },
    toCreate() { 
      this.$router.push({ 
        name: 'taxInvoiceBlueInvoiceQuery', 
        query: { next: 'taxInvoiceRedConfirmationDetail' } 
      }); 
    },
    handleView(row) {
      this.$router.push({
        name: 'taxInvoiceRedConfirmationDetail',
        query: { id: row.id , mode: 'view' }
      });
    },
    handleEdit(row) {
      this.$router.push({
        name: 'taxInvoiceRedConfirmationDetail',
        query: { id: row.id , mode: 'edit' }
      });
    },
    canEdit(row) {
      // 只有状态为"00"未提交时才能编辑
      return row.hzqrxxztDm === '00';
    },
    canSubmit(row) {
      // 只有状态为为"00"未提交时才能提交
      return row.hzqrxxztDm === '00';
    },
    canCancel(row) {
      // 只有状态为"01无需确认"、"02销方录入待购方确认"或"04已确认"时才能撤销
      // 且必须是销方发起的（lrfsf='0'）
      return (row.hzqrxxztDm === '01' || row.hzqrxxztDm === '02' || row.hzqrxxztDm === '04') && row.lrfsf === '0';
    },
    canInvoice(row) {
      // 只有状态为"01无需确认"、"04购销双方已确认"且未开具红字发票时才能开票
      return (row.hzqrxxztDm === '01' || row.hzqrxxztDm === '04') && !row.redInvoiceId;
    },
    submitRow(row) {
      this.$confirm({
        title: '提示',
        text: '确定要提交此红字确认单吗？',
        buttons: [
          {
            text: '取消',
            type: 'follow',
            callback: () => {
            }
          },
          {
            text: '确定',
            type: 'primary',
            callback: () => {
              const payload = {
                id: row.id
              };
              this.loading = true;
              this.API.send(
                this.CFG.services.kailing.applyRedConfirm,
                payload,
                (res) => {
                  this.loading = false;
                  const { success, message } = this.parseServiceResult(res || {});
                  if (success) {
                    this.$message.success('提交成功');
                    this.getData();
                  } else {
                    this.$message.warning(message || '提交失败');
                  }
                },
                () => {
                  this.loading = false;
                  this.$message.error('提交失败，请重试');
                },
                this
              );
            }
          }
        ]
      });
    },
    cancelRow(row) {
      const actionText = '撤销';
      this.$confirm({
        title: '提示',
        text: `确定要${actionText}此红字确认单吗？`,
        buttons: [
          {
            text: '取消',
            type: 'follow',
            callback: () => {
            }
          },
          {
            text: '确定',
            type: 'primary',
            callback: () => {
              const payload = {
                confirmationId: row.id,
                xsfnsrsbh: row.xsfnsrsbh,
                qrlx: 'C' // C: 撤销
              };
              this.loading = true;
              this.API.send(
                this.CFG.services.kailing.confirmRedConfirm,
                payload,
                (res) => {
                  this.loading = false;
                  const { success, message } = this.parseServiceResult(res || {});
                  if (success) {
                    this.$message.success(`${actionText}成功`);
                    this.getData();
                  } else {
                    this.$message.warning(message || `${actionText}失败`);
                  }
                },
                () => {
                  this.loading = false;
                  this.$message.error(`${actionText}失败，请重试`);
                },
                this
              );
            }
          }
        ]
      });
    },
    toRedInvoice(row) {
      // 跳转到红字发票开具页面，传递红字确认单信息
      this.$router.push({
        name: 'taxInvoiceRedDetail',
        query: {
          confirmId: row.id || row.uuid,
          hzfpxxqrdbh: row.hzfpxxqrdbh,
          lzfphm: row.lzfphm
        }
      });
    },
    statusText(v) {
      const statusMap = {
        '00': '未提交',
        '01': '无需确认',
        '02': '销方录入待购方确认',
        '03': '购方录入待销方确认',
        '04': '已确认',
        '08': '已撤销',
        '09': '作废(确认后撤销)',
        '10': '作废(异常凭证)'
      };
      return statusMap[v] || v || '';
    },
    chyyText(v) {
      const chyyMap = {
        '01': '开票有误',
        '02': '销货退回',
        '03': '服务中止',
        '04': '销售折让'
      };
      return chyyMap[v] || v || '';
    },
    lrfsfText(v) {
      return v === '0' ? '销方' : v === '1' ? '购方' : v || '';
    },
    getData() {
      this.loading = true;
      const payload = this.buildQueryPayload();
      this.API.send(
        this.CFG.services.kailing.pageRedConfirmList,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records;
          this.pager.total = total || 0;
        },
        () => {
          this.loading = false;
          this.$message.error('查询失败，请重试');
        },
        this
      );
    },
    parsePagedResult(payload = {}) {
      const serviceResult = payload && payload.serviceResult;

      const successFlag = serviceResult && serviceResult.success !== undefined ? serviceResult.success : undefined;
      const reason = serviceResult && (serviceResult.reason || serviceResult.errorMsg || serviceResult.errorCode) || '';
      let records = [];
      let total = 0;
      if (serviceResult) {
        records = serviceResult.rows || [];
        total = serviceResult.total !== undefined ? serviceResult.total : 0;
      } 
      return {
        success: successFlag !== false,
        message: reason || '',
        records,
        total
      };
    },
    parseServiceResult(payload = {}) {
      const serviceResult = payload && payload.serviceResult;
      const success = serviceResult ? serviceResult.success : undefined;
      const reason = serviceResult ? serviceResult.reason : '';
      const errorMsg = serviceResult ? serviceResult.errorCode : '';
      return {
        success: success !== false,
        message: reason || errorMsg || ''
      };
    },
    formatDateTime(value) {
      return taxInvoiceUtils.formatDateTime(value);
    }
  }
};
</script>

<style scoped>
.link-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  text-decoration: none;
}
.link-disabled:hover {
  color: #c0c4cc;
  text-decoration: none;
}
.text-red {
  color: #f56c6c;
}
</style>
