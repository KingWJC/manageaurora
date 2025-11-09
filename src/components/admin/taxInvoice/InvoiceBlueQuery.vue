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
        <div class="panel-content-padded ">
          <h2>销方红字确认单-新增</h2>

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
                        <el-input v-model="search.gfdw" size="small" placeholder="购方单位" :maxlength="30"/>
                      </div>
                      <div class="search-bar-item">
                        <el-date-picker v-model="search.kprq" type="date" size="small" placeholder="开票日期" />
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                        <el-button size="small" type="primary" @click="reset">重置</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="lc-row lc-space5">
                    <div v-for="(item, index) in getPaged(resultList)" :key="index" class="card card-shadow mt15 lc-col-12 lc-col-xs12">
                      <div class="card-body">
                        <div class="card-content-padded">
                          <div class="lc-row lc-space16">
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销方名称:</label><div class="flex-flex-auto"><span>{{ item.xsfmc || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">发票类型:</label><div class="flex-flex-auto"><span>{{ item.fplxDm || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">蓝字发票号码:</label><div class="flex-flex-auto"><span>{{ item.fphm || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购方单位:</label><div class="flex-flex-auto"><span>{{ item.gmfmc || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购方单位企业税号:</label><div class="flex-flex-auto"><span>{{ item.gmfnsrsbh || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">开票日期:</label><div class="flex-flex-auto"><span>{{ item.kprq || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">合计金额（含税）:</label><div class="flex-flex-auto"><span>{{ item.hjjc || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">合计税额:</label><div class="flex-flex-auto"><span>{{ item.hjs || '-' }}</span></div></div></div>
                            <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">价税合计:</label><div class="flex-flex-auto"><span>{{ item.jshj || '-' }}</span></div></div></div>
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
export default {
  components: { crumbsBar: () => import('@/common-base/components/crumbs-bar') },
  data() { return { search: { fphm: '', gfdw: '' }, resultList: [], pager: { current: 1, size: 10, total: 0 } }; },
  methods: {
    onSearch() {
      // Mock 数据：返回多条记录
      this.resultList = [
        {
          fphm: this.search.fphm || '00000001',
          gmfmc: this.search.gfdw || '购方A',
          xsfmc: '销方A',
          fplxDm: '01',
          kprq: '2024-01-01',
          gmfnsrsbh: '123456789012345',
          hjjc: '1000.00',
          hjs: '130.00',
          jshj: '1130.00'
        },
        {
          fphm: this.search.fphm || '00000002',
          gmfmc: this.search.gfdw || '购方B',
          xsfmc: '销方B',
          fplxDm: '02',
          kprq: '2024-01-15',
          gmfnsrsbh: '123456789012346',
          hjjc: '2000.00',
          hjs: '260.00',
          jshj: '2260.00'
        },
        {
          fphm: this.search.fphm || '00000003',
          gmfmc: this.search.gfdw || '购方C',
          xsfmc: '销方C',
          fplxDm: '01',
          kprq: '2024-02-01',
          gmfnsrsbh: '123456789012347',
          hjjc: '3000.00',
          hjs: '390.00',
          jshj: '3390.00'
        }
      ];
      this.pager.total = this.resultList.length;
    },
    reset() { this.search = { fphm: '', gfdw: '' }; this.resultList = []; this.pager.total = 0; },
    getPaged(list) {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (list || []).slice(start, start + (this.pager.size || 10));
    },
    onPage(p) {
      this.pager.current = p;
    },
    chooseAndNext(item) {
      try {
        sessionStorage.setItem('taxInvoice.selectedBlueInvoice', JSON.stringify(item || {}));
      } catch (e) {
        console.error('保存选中蓝字发票失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      const next = this.$route.query && this.$route.query.next;
      if (next) this.$router.push({ name: next });
    }
  }
};
</script>



