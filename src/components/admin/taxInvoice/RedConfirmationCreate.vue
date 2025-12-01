<template>
  <div class="viewport-fixed">
    <crumbs-bar></crumbs-bar>
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center" v-if="!readonly">
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="button" @click="submit">保存</button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded ">
          <h2>{{ readonly ? '红字确认单 - 查看' : (isEditMode ? '销方红字确认单 - 编辑' : '销方红字确认单 - 新增') }}</h2>
          <!-- 基本信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>基础信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销方单位:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销方单位" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>蓝字发票号码:</label><div class="flex-flex-auto"><el-input v-model="form.lzfphm" size="small" class="full-width" placeholder="请输入蓝字发票号码" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购货单位类型:</label><div class="flex-flex-auto"><el-select v-model="form.gmfzrrbz" size="small" class="full-width" :disabled="readonly || true"><el-option label="自然人" value="0" /><el-option label="组织" value="1" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购货单位:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购货单位" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>发票类型:</label><div class="flex-flex-auto"><el-select v-model="form.lzfppzDm" size="small" class="full-width" :disabled="readonly || true"><el-option label="增值税专用发票" value="01" /><el-option label="普通发票" value="02" /><el-option label="机动车统一销售发票" value="03" /><el-option label="二手车统一销售发票" value="04" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>开具红字发票原因:</label><div class="flex-flex-auto"><el-select v-model="form.chyyDm" size="small" class="full-width" :disabled="readonly"><el-option label="开票有误" value="01" /><el-option label="销货退回" value="02" /><el-option label="服务中止" value="03" /><el-option label="销售折让" value="04" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">特定要素:</label><div class="flex-flex-auto"><el-input v-model="form.tdys" size="small" class="full-width" placeholder="请输入特定要素" :disabled="readonly || true" /></div></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 销售方信息 -->
          <div class="card card-shadow">
                <div class="card-body">
                  <div class="card-header"><strong>销售方信息</strong></div>
                  <div class="card-content-padded">
                    <div class="lc-row lc-space16">
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方税号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfnsrsbh" size="small" class="full-width" placeholder="请输入销售方纳税人识别号" :disabled="readonly || true" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" :disabled="readonly || true" /></div></div></div>                     
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdz" size="small" class="full-width" placeholder="请输入销售方地址" :disabled="readonly || true" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdh" size="small" class="full-width" placeholder="请输入销售方电话" :disabled="readonly || true" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.xsfkhh" size="small" class="full-width" placeholder="请输入销售方开户行" :disabled="readonly || true" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方账号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfzh" size="small" class="full-width" placeholder="请输入销售方账号" :disabled="readonly || true" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">差额征税类型:</label><div class="flex-flex-auto"><el-input v-model="form.cezzslx" size="small" class="full-width" placeholder="请输入差额征税类型" :disabled="readonly || true" /></div></div></div>
                    </div>
                  </div>
                </div>
          </div>

          <!-- 购买方信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>购买方信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购买方名称:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方税号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfnsrsbh" size="small" class="full-width" placeholder="开具专票时必填" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdz" size="small" class="full-width" placeholder="请输入购买方地址" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdh" size="small" class="full-width" placeholder="请输入购买方电话" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.gmfkhh" size="small" class="full-width" placeholder="请输入购买方开户行" :disabled="readonly || true" /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方账号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfzh" size="small" class="full-width" placeholder="请输入购买方账号" :disabled="readonly || true" /></div></div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>开票详情信息</strong>
              </div>
              <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                      <el-table :data="form.fpmxList" border style="width:100%">
                        <el-table-column prop="xmmc" label="项目名称" min-width="140"><template slot-scope="{row}"><span>{{ row.xmmc }}</span></template></el-table-column>
                        <el-table-column prop="ggxh" label="规格型号" width="120"><template slot-scope="{row}"><span>{{ row.ggxh }}</span></template></el-table-column>
                        <el-table-column prop="dw" label="单位" width="90"><template slot-scope="{row}"><span>{{ row.dw }}</span></template></el-table-column>
                        <el-table-column prop="sl" label="数量" width="150"><template slot-scope="{row}"><el-input-number v-model="row.sl" @change="onRowChange(row)" :min="0" :step="1" size="small" class="full-width power-minw90" :disabled="readonly" /></template></el-table-column>
                        <el-table-column prop="dj" label="单价(含税)" width="150"><template slot-scope="{row}"><el-input-number v-model="row.dj" @change="onRowChange(row)" :precision="6" :step="0.01" :min="0" size="small" class="full-width power-minw90" :disabled="readonly" /></template></el-table-column>
                        <el-table-column prop="je" label="金额(含税)" width="150">
                          <template slot-scope="{row}">¥{{ formatMoney(row.je) }}</template>
                        </el-table-column>
                        <el-table-column prop="slv" label="增值税税率/征收率" width="150"><template slot-scope="{row}"><span>{{ Number(row.slv || 0).toFixed(4) }}</span></template></el-table-column>
                        <el-table-column prop="se" label="税额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.se) }}</template></el-table-column>
                        <el-table-column prop="hsje" label="含税金额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.hsje) }}</template></el-table-column>
                        <el-table-column prop="kce" label="扣除额" width="150"><template slot-scope="{row}"><el-input-number v-model="row.kce" :precision="2" :step="0.01" :min="0" size="small" class="full-width" :disabled="readonly" /></template></el-table-column>
                        <el-table-column prop="sphfwssflhbbm" label="商品和服务税收分类合并编码" min-width="220"><template slot-scope="{row}"><span>{{ row.sphfwssflhbbm }}</span></template></el-table-column>
                        <el-table-column prop="fphxz" label="发票行性质" width="130"><template slot-scope="{row}"><span>{{ row.fphxz }}</span></template></el-table-column>
                        <el-table-column prop="yhzcbs" label="优惠政策标识" width="140"><template slot-scope="{row}"><el-input v-model="row.yhzcbs" class="full-width" :disabled="readonly" /></template></el-table-column>
                        <el-table-column label="操作" width="80" fixed="right" v-if="!readonly"><template slot-scope="scope"><p><span class="link" @click="deleteDetailRow(scope.$index)">删除</span></p></template></el-table-column>
                      </el-table>
                      <div class="mt10 darkgray">
                        <p class="mt5">合计金额： {{ formatMoney(form.hzcxje) }}（元）</p>
                        <p class="mt5">合计税额： {{ formatMoney(form.hzcxse) }}（元）</p>
                        <p class="mt5">价税合计： {{ formatMoney(form.jshj) }}（元）</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <!-- 发票信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>其他信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12"><div class="flex flex-content-start flex-items-center"><label class="nowrap">备注:</label><div class="flex-flex-auto"><el-input type="textarea" v-model="form.bz" :rows="3" size="small" class="full-width" placeholder="请输入备注" :disabled="readonly" /></div></div></div>
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
  data() {
    return {
      saving: false,
      form: {
        id: '', uuid: '', taxpayerId: '', blueInvoiceId: '', hzfpxxqrdbh: '',
        xsfmc: '', lzfphm: '', gmfzrrbz: '1', gmfmc: '', lzfppzDm: '02', chyyDm: '01', tdys: '',
        xsfnsrsbh: '', xsfdz: '', xsfdh: '', xsfkhh: '', xsfzh: '', cezzslx: '',
        gmfnsrsbh: '', gmfdz: '', gmfdh: '', gmfkhh: '', gmfzh: '',
        fpmxList: [],
        hzcxje: 0,
        hzcxse: 0,  
        jshj: 0,
        bz: ''
      }
    };
  },
  computed: {
    isEditMode() {
      const query = this.$route && this.$route.query;
      return !!(query && query.id && query.mode !== 'view');
    },
    confirmId() {
      const query = this.$route && this.$route.query;
      return query && (query.id || query.confirmId);
    },
    isViewMode() {
      const query = this.$route && this.$route.query;
      return query && query.mode === 'view';
    },
    readonly() {
      return this.isViewMode;
    }
  },
  mounted() {
    if (this.confirmId) {
      this.fetchDetail();
      return;
    }
    
    // 从蓝字发票查询带入数据
    try {
      const json = sessionStorage.getItem('taxInvoice.selectedBlueInvoice');
      if (json) {
        const inv = JSON.parse(json) || {};
        if (inv.id) {
          this.form.blueInvoiceId = inv.id;
          this.fetchBlueInvoiceDetail(inv.id);
        } 
      }
    } catch (e) {
      console.error('读取蓝字发票数据失败:', e);
    }

    if (!this.readonly && !this.isEditMode) {
      this.restoreFormData();
      this.fillSelectedGoods();
    }
    this.recalcTotals();
  },
  methods: {
    // 获取蓝字发票完整详情
    fetchBlueInvoiceDetail(invoiceId) {
      if (!invoiceId) return;
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.digitalInvoiceQuery;
      if (!svc) {
        this.$message.warning('查询接口未配置');
        return;
      }
      this.API.send(
        svc,
        { invoiceId },
        (res) => {
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            this.fillFormFromBlueInvoiceDetail(data);
          } else {
            this.$message.warning(message || '获取蓝字发票详情失败');
          }
        },
        () => {
          this.$message.error('获取蓝字发票详情失败，请重试');
        },
        this
      );
    },
    // 从蓝字发票详情回填表单
    fillFormFromBlueInvoiceDetail(detail = {}) {
      console.log('蓝字发票详情:', detail);
      if (detail.fphm) {
        this.$set(this.form, 'lzfphm', detail.fphm);
      }
      if (detail.gmfmc) this.$set(this.form, 'gmfmc', detail.gmfmc);
      if (detail.xsfmc) this.$set(this.form, 'xsfmc', detail.xsfmc);
      if (detail.fppz || detail.fplxDm) {
        const fppz = detail.fppz || detail.fplxDm;
        if (fppz) this.form.lzfppzDm = fppz;
      }
      if (detail.gmfzrrbz) {
        this.form.gmfzrrbz = detail.gmfzrrbz;
      }
      
      // 销售方信息
      if (detail.xsfnsrsbh) this.form.xsfnsrsbh = detail.xsfnsrsbh;
      if (detail.xsfdz) this.form.xsfdz = detail.xsfdz;
      if (detail.xsfdh) this.form.xsfdh = detail.xsfdh;
      if (detail.xsfkhh) this.form.xsfkhh = detail.xsfkhh;
      if (detail.xsfzh) this.form.xsfzh = detail.xsfzh;
      if (detail.cezzslx) this.form.cezzslx = detail.cezzslx;
      
      // 购买方信息
      if (detail.gmfnsrsbh) this.form.gmfnsrsbh = detail.gmfnsrsbh;
      if (detail.gmfdz) this.form.gmfdz = detail.gmfdz;
      if (detail.gmfdh) this.form.gmfdh = detail.gmfdh;
      if (detail.gmfkhh) this.form.gmfkhh = detail.gmfkhh;
      if (detail.gmfzh) this.form.gmfzh = detail.gmfzh;
      
      // 开票详细信息
      const details = Array.isArray(detail.fpmxList) ? detail.fpmxList : [];
      if (details.length > 0) {
        this.form.fpmxList = details.map((item, index) => {
          const je = Number(item.je || 0);
          const se = Number(item.se  || 0);
          const hsje = Number(item.hsje || (je + se));
          return {
            lzmxxh: item.mxxh || (index + 1),
            xmmc: item.xmmc || '',
            ggxh: item.ggxh || '',
            dw: item.dw || item.unit || '',
            sl: Number(item.sl || 0),
            dj: Number(item.dj || 0),
            je:  je,
            slv: Number(item.slv  || 0),
            se:  se,
            hsje: hsje,
            kce: Number(item.kce || 0),
            sphfwssflhbbm: item.sphfwssflhbbm || '',
            hwhyslwfwmc: item.hwhyslwfwmc || '',
            spfwjc: item.spfwjc || '',
            yhzcbs: item.yhzcbs || '',
            fphxz: item.fphxz || '00'
          };
        });
        // 重新计算合计
        this.recalcTotals();
      }
    },
    // 删除明细行
    deleteDetailRow(index) {
      if (this.readonly) return;
      if (index >= 0 && index < this.form.fpmxList.length) {
        this.form.fpmxList.splice(index, 1);
        this.recalcTotals();
      }
    },
    onRowChange(row) {
      if (this.readonly) return;
      this.recalcRow(row);
      this.recalcTotals();
    },
    recalcRow(row) {
      const qty = this.toFixedNumber(row.sl, 6);
      const price = this.toFixedNumber(row.dj, 6);
      const rate = this.toFixedNumber(row.slv, 6);
      const amount = this.toFixedNumber(qty * price, 2);
      const tax = this.toFixedNumber(amount * rate, 2);
      const amountWithTax = this.toFixedNumber(amount + tax, 2);
      row.je = amount;
      row.se = tax;
      row.hsje = amountWithTax;
    },
    // 合计计算
    recalcTotals() {
      let totalAmount = 0;
      let totalTax = 0;
      (this.form.fpmxList || []).forEach(item => {
        const amt = this.toFixedNumber(item.je, 2);
        const tax = this.toFixedNumber(item.se, 2);
        totalAmount += amt;
        totalTax += tax;
      });
      this.form.hzcxje = this.toFixedNumber(totalAmount, 2);
      this.form.hzcxse = this.toFixedNumber(totalTax, 2);
      this.form.jshj = this.toFixedNumber(this.form.hzcxje + this.form.hzcxse, 2);
    },

    fillSelectedGoods() {
      if (this.readonly) return;
      try {
        const listJson = sessionStorage.getItem('taxInvoice.selectedGoodsList');
        const oneJson = sessionStorage.getItem('taxInvoice.selectedGoods');
        const added = [];
        if (listJson) {
          const arr = JSON.parse(listJson) || [];
          arr.forEach(it => added.push(it));
          sessionStorage.removeItem('taxInvoice.selectedGoodsList');
        }
        if (oneJson) {
          const it = JSON.parse(oneJson) || null;
          if (it) added.push(it);
          sessionStorage.removeItem('taxInvoice.selectedGoods');
        }
        if (added.length) {
          added.forEach(item => this.addGoodsRowFromItem(item));
        }
      } catch (e) {
        console.error('回填商品数据失败:', e);
        if (this.$message) this.$message.error('加载商品数据失败');
      }
    },
    addGoodsRowFromItem(item) {
      console.log(item);
      const row = {
        xmmc: item.name || '',
        ggxh: item.spec || item.model || '',
        dw: item.packSpec || item.unit || '',
        sl: 1,
        dj: 0,
        je: 0,
        slv: 0,
        se: 0,
        hsje: 0,
        kce: 0,
        sphfwssflhbbm: item.code || '',
        fphxz: '0',
        yhzcbs: ''
      };
      this.recalcRow(row);
      this.form.fpmxList.push(row);
    },
    toFixedNumber(val, digits = 2) {
      const n = Number(val);
      if (isNaN(n)) return 0;
      return Number(n.toFixed(digits));
    },
    formatMoney(val) {
      const n = this.toFixedNumber(val, 2);
      return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    fetchDetail() {
      if (!this.confirmId) return;
      this.saving = true;
      const payload = {
        confirmId: this.confirmId
      };
      this.API.send(
        this.CFG.services.kailing.queryRedConfirmDetail,
        payload,
        (res) => {
          this.saving = false;
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            const detail = Array.isArray(data.rows) && data.rows.length > 0 ? data.rows[0] : data;
            this.applyDetailToForm(detail);
          } else {
            this.$message.warning(message || '加载详情失败');
            this.$router.push({ name: 'taxInvoiceRedSellerList' });
          }
        },
        () => {
          this.saving = false;
          this.$message.error('加载详情失败，请重试');
          this.$router.push({ name: 'taxInvoiceRedSellerList' });
        },
        this
      );
    },
    applyDetailToForm(detail = {}) {
      const detailList = (detail.detailList || []).map((item, index) => ({
        id: item.id || '', 
        lzmxxh: item.lzmxxh,
        xh: item.xh || index + 1,
        xmmc: item.xmmc || '',
        ggxh: item.ggxh || '',
        dw: item.dw || '',
        sl: Number(item.fpspsl || 0),
        dj: Number(item.fpspdj || 0),
        je: Number(item.je || 0),
        slv: Number(item.sl1 || 0),
        se: Number(item.se || 0),
        kce: Number(item.kce || 0),
        sphfwssflhbbm: item.sphfwssflhbbm || '',
        hwhyslwfwmc: item.hwhyslwfwmc || '',
        spfwjc: item.spfwjc || '',
        yhzcbs: item.yhzcbs || ''
      }));
      
      this.form.id = detail.id;
      this.form.uuid = detail.uuid;
      this.form.taxpayerId = detail.taxpayerId || '';
      this.form.blueInvoiceId = detail.blueInvoiceId || '';
      this.form.hzfpxxqrdbh = detail.hzfpxxqrdbh;
      this.form.xsfmc = detail.xsfmc || '';
      this.form.lzfphm = detail.lzfphm || '';
      this.form.gmfzrrbz = detail.gmfzrrbz || '1';
      this.form.gmfmc = detail.gmfmc || '';
      this.form.lzfppzDm = detail.lzfppzDm || '02';
      this.form.chyyDm = detail.chyyDm || '01';
      this.form.tdys = detail.lzfpTdyslxDm || '';
      this.form.xsfnsrsbh = detail.xsfnsrsbh || '';
      this.form.xsfdz = detail.xsfdz || '';
      this.form.xsfdh = detail.xsfdh || '';
      this.form.xsfkhh = detail.xsfkhh || '';
      this.form.xsfzh = detail.xsfzh || '';
      this.form.cezzslx = detail.cezzslx || '';
      this.form.gmfnsrsbh = detail.gmfnsrsbh || '';
      this.form.gmfdz = detail.gmfdz || '';
      this.form.gmfdh = detail.gmfdh || '';
      this.form.gmfkhh = detail.gmfkhh || '';
      this.form.gmfzh = detail.gmfzh || '';
      this.form.fpmxList = detailList;
      this.form.hzcxje = Number(detail.hzcxje || 0);
      this.form.hzcxse = Number(detail.hzcxse || 0);
      this.form.jshj = Number(this.form.hzcxje + this.form.hzcxse);
      this.form.bz = detail.remark || detail.bz || '';
      this.recalcTotals();
    },
    validateForm() {
      if (!this.form.chyyDm || this.form.chyyDm === '') {
        return '请选择开具红字发票原因';
      }
      if (!this.form.blueInvoiceId && !this.form.lzfphm) {
        return '请选择蓝字发票';
      }
      if (!Array.isArray(this.form.fpmxList) || this.form.fpmxList.length === 0) {
        return '请添加至少一条明细';
      }
      if (this.form.hzcxje >= 0) {
        return '合计金额必须为负数';
      }
      return '';
    },
    buildSubmitPayload() {
      const detailList = (this.form.fpmxList || []).map((item, index) => {
        const detailItem = {
          id: item.id || '', 
          lzmxxh: item.lzmxxh,
          xh: item.xh || index + 1,
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          hwhyslwfwmc: item.hwhyslwfwmc || '',
          spfwjc: item.spfwjc || '',
          xmmc: item.xmmc || '',
          ggxh: item.ggxh || '',
          dw: item.dw || '',
          fpspdj: String(item.dj || 0),
          fpspsl: String(-item.sl || 0),
          je: Number(item.je || 0),
          sl1: Number(item.slv || 0),
          se: Number(item.se || 0)
        };
        if (!detailItem.id) {
          delete detailItem.id;
        }
        return detailItem;
      });
      
      const payload = {
        id: this.form.id || '', 
        taxpayerId: this.form.taxpayerId || '', 
        blueInvoiceId: this.form.blueInvoiceId || '',
        lrfsf: '0', 
        xsfnsrsbh: this.form.xsfnsrsbh,
        xsfmc: this.form.xsfmc,
        gmfnsrsbh: this.form.gmfnsrsbh || '', 
        gmfmc: this.form.gmfmc,
        hzcxje: Number(this.form.hzcxje || 0),
        hzcxse: Number(this.form.hzcxse || 0),
        chyyDm: this.form.chyyDm,
        detailList: detailList
      };

      return payload;
    },
    submit() {
      if (this.readonly) return;
      
      const validationMsg = this.validateForm();
      if (validationMsg) {
        this.$message.warning(validationMsg);
        return;
      }
      
      this.saving = true;
      const payload = this.buildSubmitPayload();
      this.API.send(
        this.CFG.services.kailing.addRedConfirm,
        payload,
        (res) => {
          this.saving = false;
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success(this.isEditMode ? '更新成功' : '保存成功');
            try {
              sessionStorage.removeItem('taxInvoice.redSellerCreate.form');
            } catch (e) {
              console.error('清理表单数据失败:', e);
            }
            this.$router.push({ name: 'taxInvoiceRedSellerList' });
          } else {
            this.$message.warning(message || '保存失败');
          }
        },
        () => {
          this.saving = false;
          this.$message.error('保存失败，请重试');
        },
        this
      );
    },
    parseServiceResult(payload = {}) {
      if (payload && payload.serviceResult) {
        payload = payload.serviceResult;
      }
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.errorMsg : '';
      const data = payload && (payload.data || payload.result || payload.records || payload) || {};
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        data
      };
    }
  }
};
</script>

<style scoped>
</style>



