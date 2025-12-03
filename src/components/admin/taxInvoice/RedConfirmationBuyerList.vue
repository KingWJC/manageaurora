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
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table :data="rows" v-loading="loading" style="width:100%" border>
                <el-table-column prop="id" label="单据ID" min-width="130"></el-table-column>
                <el-table-column prop="hzfpxxqrdbh" label="红字确认单编号" min-width="150"></el-table-column>
                <el-table-column prop="lzfphm" label="蓝字发票号码" min-width="130"></el-table-column>
                <el-table-column prop="redInvoiceId" label="红字发票ID" min-width="130" v-if="false"></el-table-column>
                <el-table-column prop="xsfmc" label="销方名称" min-width="150"></el-table-column>
                <el-table-column prop="gmfmc" label="购方名称" min-width="150"></el-table-column>
                <el-table-column prop="lzhjje" label="蓝字发票合计金额" min-width="140">
                  <template slot-scope="scope">¥{{ Number(scope.row.lzhjje || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="lzhjse" label="蓝字发票合计税额" min-width="140">
                  <template slot-scope="scope">¥{{ Number(scope.row.lzhjse || 0).toFixed(2) }}</template>
                </el-table-column>
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
                <el-table-column prop="qrrq" label="确认日期" min-width="160">
                  <template slot-scope="scope">{{ formatDateTime(scope.row.qrrq) }}</template>
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
                      <span class="link ml10" :class="{ 'link-disabled': !canConfirm(scope.row) }" @click="confirmRow(scope.row, 'Y')">确认</span>
                    </p>
                    <p>
                      <span class="link" :class="{ 'link-disabled': !canReject(scope.row) }" @click="confirmRow(scope.row, 'N')">拒绝</span>
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
        lrfsf: '1' // 购方：1，销方：0
      };
      const { gmfmc, lzfphm, hzqrxxztDm, lrrqRange } = this.search;
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (lzfphm) payload.lzfphm = lzfphm.trim();
      if (hzqrxxztDm) payload.hzqrxxztDm = hzqrxxztDm;
      if (Array.isArray(lrrqRange) && lrrqRange.length === 2) {
        payload.lrrqStart = new Date(lrrqRange[0] + 'T00:00:00').getTime();
        payload.lrrqEnd = new Date(lrrqRange[1] + 'T23:59:59').getTime();
      }
      return payload;
    },
    handleView(row) {
      this.$router.push({
        name: 'taxInvoiceRedConfirmationDetail',
        query: { id: row.id , mode: 'view' }
      });
    },
    
    canConfirm(row) {
      // 只有状态为"02销方录入待购方确认"时才能确认
      return row.hzqrxxztDm === '02';
    },
    canReject(row) {
      // 只有状态为"02销方录入待购方确认"时才能拒绝
      return row.hzqrxxztDm === '02';
    },

    confirmRow(row, qrlx) {
      const actionText = qrlx === 'Y' ? '确认' : '拒绝';

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
                qrlx: qrlx
              };
              this.loading = true;
              this.API.send(
                this.CFG.services.kailing.confirmRedConfirm,
                payload,
                (res) => {
                  this.loading = false;
                  if (res && res.data) {
                    this.$message.success(`${actionText}成功`);
                    this.getData();
                  } else {
                    this.$message.warning(`${actionText}失败`);
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
    statusText(v) {
      const statusMap = {
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
    formatDateTime(value) {
      return this.utils.formatDate(value);
    }
  }
};
</script>

<style scoped>
.text-red {
  color: #f56c6c;
}
</style>
