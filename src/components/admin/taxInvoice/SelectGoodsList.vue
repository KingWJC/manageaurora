<template>
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
            <div class="search-bar-item"><el-input v-model="search.keyword" size="small" placeholder="商品/服务名称" /></div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="onSearch">查询</el-button>
              <el-button size="small" type="primary" class="ml10" @click="addSelected" :disabled="!multipleSelection.length">添加所选</el-button>
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <el-tabs v-model="activeMain" tab-position="left" class="nav-wrap">
              <el-tab-pane label="商品" name="goods">
                <el-tabs v-model="activeGoods" type="border-card">
                  <el-tab-pane label="药品" name="drug">
                    <el-table :data="pagedDrug" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'drug')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="药品名称" min-width="160" />
                      <el-table-column prop="spec" label="规格" min-width="120" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="approvalNo" label="批准文号" min-width="140" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="mholder" label="上市许可持有人" min-width="160" />
                      <el-table-column prop="rxType" label="处方分类" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column prop="expire" label="有效期" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="器械" name="device">
                    <el-table :data="pagedDevice" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'device')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="产品名称" min-width="160" />
                      <el-table-column prop="goodsType" label="商品类型" min-width="120" />
                      <el-table-column prop="classType" label="医疗器械分类" min-width="140" />
                      <el-table-column prop="model" label="规格型号" min-width="140" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="regNo" label="注册证号/备案号" min-width="160" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column prop="expire" label="有效期" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="食品" name="food">
                    <el-table :data="pagedFood" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'food')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="产品名称" min-width="160" />
                      <el-table-column prop="goodsType" label="商品类型" min-width="120" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column prop="expire" label="有效期" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="消毒用品" name="disinfect">
                    <el-table :data="pagedDisinfect" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'disinfect')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="产品名称" min-width="160" />
                      <el-table-column prop="goodsType" label="商品类型" min-width="120" />
                      <el-table-column prop="dosage" label="剂型" min-width="120" />
                      <el-table-column prop="spec" label="规格" min-width="120" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="regNo" label="注册证号/备案号" min-width="160" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column prop="expire" label="有效期" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="化妆品" name="cosmetic">
                    <el-table :data="pagedCosmetic" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'cosmetic')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="产品名称" min-width="160" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="regNo" label="注册证号/备案号" min-width="160" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column prop="expire" label="有效期" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="其它" name="other">
                    <el-table :data="pagedOther" v-loading="loading" style="width:100%" :height="tableHeight" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'other')">
                      <el-table-column type="selection" width="50" :reserve-selection="true" />
                      <el-table-column prop="name" label="产品名称" min-width="160" />
                      <el-table-column prop="goodsType" label="商品类型" min-width="120" />
                      <el-table-column prop="model" label="型号" min-width="120" />
                      <el-table-column prop="spec" label="规格" min-width="120" />
                      <el-table-column prop="packSpec" label="包装规格" min-width="120" />
                      <el-table-column prop="manufacturer" label="生产企业" min-width="160" />
                      <el-table-column prop="barcode" label="69码" min-width="120" />
                      <el-table-column prop="brand" label="商标" min-width="120" />
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
              <el-tab-pane label="服务" name="service" body-style="padding: 0">
                <el-table :data="pagedService" v-loading="loading" style="width:100%" border row-key="_uniqueId" @selection-change="val=>onSelectionChange(val,'service')">
                  <el-table-column type="selection" width="50" :reserve-selection="true" />
                  <el-table-column prop="name" label="服务名称" min-width="160" />
                  <el-table-column prop="type" label="服务类型" min-width="120" />
                  <el-table-column prop="spec" label="规格" min-width="120" />
                  <el-table-column prop="vendor" label="服务供应商" min-width="160" />
                  <el-table-column prop="barcode" label="69码" min-width="120" />
                  <el-table-column prop="brand" label="商标" min-width="120" />
                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope"><p><span class="link" @click="viewDetail(scope.row)">详情</span></p></template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
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
      search: { keyword: '' },
      activeMain: 'goods',
      activeGoods: 'drug',
      multipleSelection: [],
      selectionMap: {}, // 存储每个分类的选中项
      pager: { current: 1, size: 10, total: 0 },
      tableHeight: 480,
      // data sets per tab
      rowsService: [],
      rowsDrug: [], rowsDevice: [], rowsFood: [], rowsDisinfect: [], rowsCosmetic: [], rowsOther: []
    };
  },
  mounted() { this.getData(); this.updateTableHeight(); window.addEventListener('resize', this.updateTableHeight); },
  beforeDestroy() { window.removeEventListener('resize', this.updateTableHeight); },
  watch: {
    activeMain() { this.pager.current = 1; this.updatePagerTotal(); this.updateTableHeight(); },
    activeGoods() { this.pager.current = 1; this.updatePagerTotal(); this.updateTableHeight(); }
  },
  computed: {
    pagedDrug() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsDrug || []).slice(start, start + (this.pager.size || 10));
    },
    pagedDevice() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsDevice || []).slice(start, start + (this.pager.size || 10));
    },
    pagedFood() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsFood || []).slice(start, start + (this.pager.size || 10));
    },
    pagedDisinfect() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsDisinfect || []).slice(start, start + (this.pager.size || 10));
    },
    pagedCosmetic() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsCosmetic || []).slice(start, start + (this.pager.size || 10));
    },
    pagedOther() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsOther || []).slice(start, start + (this.pager.size || 10));
    },
    pagedService() {
      const start = ((this.pager.current || 1) - 1) * (this.pager.size || 10);
      return (this.rowsService || []).slice(start, start + (this.pager.size || 10));
    }
  },
  methods: {
    updateTableHeight() {
      this.$nextTick(() => {
        const body = this.$refs.viewBody;
        if (body && body.offsetHeight) {
          let h = body.offsetHeight - 24;
          if (this.activeMain === 'goods') {
            const headers = this.$el && this.$el.querySelectorAll('.nav-wrap .el-tabs__header');
            if (headers && headers.length > 1) {
              const subHeader = headers[headers.length - 1];
              if (subHeader && subHeader.offsetHeight) {
                h -= (subHeader.offsetHeight + 12);
              }
            }
          }
          this.tableHeight = h > 300 ? h : 300;
        }
      });
    },
    updatePagerTotal() {
      this.$nextTick(() => {
        const current = this.activeMain === 'service' ? this.rowsService
          : (this.activeGoods === 'drug' ? this.rowsDrug
          : this.activeGoods === 'device' ? this.rowsDevice
          : this.activeGoods === 'food' ? this.rowsFood
          : this.activeGoods === 'disinfect' ? this.rowsDisinfect
          : this.activeGoods === 'cosmetic' ? this.rowsCosmetic : this.rowsOther);
        this.pager.total = (current || []).length;
      });
    },
    onSearch() { this.getData(); },
    onSelectionChange(val, key) {
      // 存储当前分类的选中项
      this.$set(this.selectionMap, key, val || []);
      // 合并所有分类的选中项
      const allSelected = [];
      Object.keys(this.selectionMap).forEach(k => {
        if (this.selectionMap[k] && Array.isArray(this.selectionMap[k])) {
          allSelected.push(...this.selectionMap[k]);
        }
      });
      this.multipleSelection = allSelected;
    },
    getData() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        let globalIndex = 0;
        const addUniqueId = (arr, category) => {
          return (arr || []).map((item, index) => ({ ...item, _uniqueId: category + '_' + (globalIndex++) + '_' + (item.barcode || '') + '_' + index }));
        };
        globalIndex = 0;
        this.rowsService = addUniqueId([
          { name: '上门维护', type: '售后', spec: '2小时', vendor: '朗致服务', barcode: '6900001', brand: 'LZ' },
          { name: '远程支持', type: '在线', spec: '1次', vendor: '乐企服务', barcode: '6900002', brand: 'LQ' }
        ], 'service');
        this.rowsDrug = addUniqueId([
          { name: '盐酸曲马多片', spec: '50mg*10片', packSpec: '盒', manufacturer: 'XX制药', approvalNo: '国药准字H2000XXXX', barcode: '6901001', mholder: 'XX制药', rxType: '处方药', brand: 'XX', expire: '2027-12-31' },
          { name: '盐酸曲马多片', spec: '50mg*10片', packSpec: '盒', manufacturer: 'XX制药', approvalNo: '国药准字H2000XXXX', barcode: '6901001', mholder: 'XX制药', rxType: '处方药', brand: 'XX', expire: '2027-12-31' },
          { name: '盐酸曲马多片', spec: '50mg*10片', packSpec: '盒', manufacturer: 'XX制药', approvalNo: '国药准字H2000XXXX', barcode: '6901001', mholder: 'XX制药', rxType: '处方药', brand: 'XX', expire: '2027-12-31' },
          { name: '盐酸曲马多片', spec: '50mg*10片', packSpec: '盒', manufacturer: 'XX制药', approvalNo: '国药准字H2000XXXX', barcode: '6901001', mholder: 'XX制药', rxType: '处方药', brand: 'XX', expire: '2027-12-31' }
        ], 'drug');
        this.rowsDevice = addUniqueId([
          { name: '一次性注射器', goodsType: '医用', classType: 'II类', model: '5ml', packSpec: '盒', manufacturer: 'XX医疗', regNo: '国械注准2019XXXX', barcode: '6902001', brand: 'XX', expire: '2028-06-30' }
        ], 'device');
        this.rowsFood = addUniqueId([
          { name: '营养粉', goodsType: '食品', packSpec: '罐', manufacturer: 'XX食品', barcode: '6903001', brand: 'XX', expire: '2026-01-01' }
        ], 'food');
        this.rowsDisinfect = addUniqueId([
          { name: '酒精消毒液', goodsType: '消毒用品', dosage: '液体', spec: '500ml', packSpec: '瓶', manufacturer: 'XX日化', regNo: '消字2020XXXX', barcode: '6904001', brand: 'XX', expire: '2026-12-31' }
        ], 'disinfect');
        this.rowsCosmetic = addUniqueId([
          { name: '保湿面霜', packSpec: '50g', manufacturer: 'XX化妆品', regNo: '国妆特字G2020XXXX', barcode: '6905001', brand: 'XX', expire: '2026-09-30' }
        ], 'cosmetic');
        this.rowsOther = addUniqueId([
          { name: '一次性口罩', goodsType: '防护', model: '成人', spec: '三层', packSpec: '盒', manufacturer: 'XX工厂', barcode: '6906001', brand: 'XX' }
        ], 'other');
        this.updatePagerTotal();
      }, 300);
    },
    viewDetail(row) {
      this.$alert(JSON.stringify(row, null, 2), '详情', { confirmButtonText: '知道了' });
    },
    add(row) {
      try {
        sessionStorage.setItem('taxInvoice.selectedGoods', JSON.stringify(row || {}));
      } catch (e) {
        console.error('保存选中商品失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      const from = this.$route.query && this.$route.query.from;
      if (from) { this.$router.back(); } else { this.$message.success('已添加：' + (row && (row.name || row.xmmc))); }
    },
    addSelected() {
      if (!this.multipleSelection.length) { this.$message.info('请选择要添加的明细'); return; }
      try {
        sessionStorage.setItem('taxInvoice.selectedGoodsList', JSON.stringify(this.multipleSelection || []));
      } catch (e) {
        console.error('保存选中商品失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      const from = this.$route.query && this.$route.query.from;
      if (from) { this.$router.back(); } else { this.$message.success('已添加 ' + this.multipleSelection.length + ' 条'); }
    },
    onPage(p) {
      this.pager.current = p;
    }
  }
};
</script>

<style scoped>
</style>


