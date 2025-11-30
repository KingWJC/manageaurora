<template>
  <div class="viewport-fixed">
    <!-- 顶部返回面包屑 -->
    <crumbs-bar></crumbs-bar>
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
        <div class="panel-content-padded">
          <h2>蓝字发票查询</h2>

          <div class="flex-flex-auto panel p15">
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header"><strong>发票单据查询</strong></div>
                <div class="card-content-padded">
                  <div class="panel pr15 pt10">
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                      <div class="search-bar-item">
                        <el-input v-model="search.fphm" size="small" placeholder="蓝字发票号码" :maxlength="30"/>
                      </div>
                      <div class="search-bar-item">
                        <el-input v-model="search.gmfmc" size="small" placeholder="购方名称" :maxlength="50"/>
                      </div>
                      <div class="search-bar-item-auto">
                        <el-date-picker
                          v-model="search.kprqRange"
                          type="daterange"
                          unlink-panels
                          style="width:210px;"
                          size="small"
                          start-placeholder="开票日期起"
                          end-placeholder="开票日期止"
                          value-format="yyyy-MM-dd"
                        />
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="lc-row lc-space5">
                    <div v-for="(item, index) in resultList" :key="index" class="card card-shadow mt15 lc-col-12 lc-col-xs12">
                      <div class="card-body">
                        <div class="card-content-padded">
                          <div class="lc-row lc-space16">
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销方名称:</label><div class="flex-flex-auto"><span>{{ item.xsfmc || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">发票类型:</label><div class="flex-flex-auto"><span>{{ fppzText(item.fppz) }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">蓝字发票号码:</label><div class="flex-flex-auto"><span>{{ item.fphm || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购方单位:</label><div class="flex-flex-auto"><span>{{ item.gmfmc || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购方单位企业税号:</label><div class="flex-flex-auto"><span>{{ item.gmfnsrsbh || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">开票日期:</label><div class="flex-flex-auto"><span>{{ formatDateTime(item.kprq) }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">合计金额（含税）:</label><div class="flex-flex-auto"><span>¥{{ Number(item.hjje || 0).toFixed(2) }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">合计税额:</label><div class="flex-flex-auto"><span>¥{{ Number(item.hjse || 0).toFixed(2) }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">价税合计:</label><div class="flex-flex-auto"><span>¥{{ Number(item.jshj || 0).toFixed(2) }}</span></div></div></div>
                          </div>
                        </div>
                        <div class="card-footer">
                          <span class="black">是否要选择此票据进行红字确认：</span>
                          <el-button size="small" type="link" @click="chooseAndNext(item)">确定</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
  components: { crumbsBar: () => import('@/common-base/components/crumbs-bar') },
  data() { 
    return { 
      loading: false,
      search: { 
        fphm: '', 
        gmfmc: '',
        kprqRange: []
      }, 
      resultList: [], 
      pager: { current: 1, size: 10, total: 0 } 
    }; 
  },
  methods: {
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1,
        rowCount: this.pager.size
      };
      const { fphm, gmfmc, kprqRange } = this.search;
      if (fphm) payload.fphm = fphm.trim();
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (Array.isArray(kprqRange) && kprqRange.length === 2) {
        const { kprqStart, kprqEnd } = taxInvoiceUtils.formatDateRangeToTimestamp(kprqRange);
        payload.kprqStart = kprqStart;
        payload.kprqEnd = kprqEnd;
      }
      // 只查询蓝字发票
      payload.lzfpbz = '0';
      return payload;
    },
    onSearch() {
      // 验证至少有一个查询条件
      const { fphm, gmfmc, kprqRange } = this.search;
      const hasFphm = fphm && fphm.trim();
      const hasGmfmc = gmfmc && gmfmc.trim();
      const hasDateRange = Array.isArray(kprqRange) && kprqRange.length === 2;
      
      if (!hasFphm && !hasGmfmc && !hasDateRange) {
        this.$message.warning('请至少输入一个查询条件');
        return;
      }
      
      this.pager.current = 1;
      this.getData();
    },
    reset() { 
      this.search = { 
        fphm: '', 
        gmfmc: '',
        kprqRange: []
      }; 
      this.pager.current = 1;
      this.resultList = [];
      this.pager.total = 0;
    },
    onPage(p) {
      this.pager.current = p;
      this.getData();
    },
    getData() {
      this.loading = true;
      const payload = this.buildQueryPayload();
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceList,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          this.resultList = records || [];
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
      const success = serviceResult ? serviceResult.success : undefined;
      const reason = serviceResult ? serviceResult.reason : '';
      const errorMsg = serviceResult ? serviceResult.errorCode : '';
      let records = [];
      let total = 0;
      if (serviceResult) {
        records = serviceResult.rows || [];
        total = serviceResult.total || 0;
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
    fppzText(v) {
      return v === '01' ? '数电专票' : v === '02' ? '数电普票' : v || '-';
    },
    chooseAndNext(item) {
      try {
        // 保存选中的蓝字发票信息
        const blueInvoiceData = {
          id: item.id,
          fphm: item.fphm,
          gmfmc: item.gmfmc,
          xsfmc: item.xsfmc,
          fplxDm: item.fppz,
          kprq: item.kprq,
          gmfnsrsbh: item.gmfnsrsbh,
          hjjc: item.hjje,
          hjs: item.hjse,
          jshj: item.jshj
        };
        sessionStorage.setItem('taxInvoice.selectedBlueInvoice', JSON.stringify(blueInvoiceData));
      } catch (e) {
        console.error('保存选中蓝字发票失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
        return;
      }
      const next = this.$route.query && this.$route.query.next;
      if (next) {
        this.$router.push({ name: next });
      }
    }
  }
};
</script>

<style scoped>
</style>
