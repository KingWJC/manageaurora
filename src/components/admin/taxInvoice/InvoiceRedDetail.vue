<template>
  <div class="viewport-fixed">
    <crumbs-bar></crumbs-bar>
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center">
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="button" @click="submit">保存</button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded ">
          <h2>数电红字发票 - 详情</h2>
          <!-- 基本信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>基础信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销方单位:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销方单位" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>蓝字发票号码:</label><div class="flex-flex-auto"><el-input v-model="form.lzfphm" size="small" class="full-width" placeholder="请输入蓝字发票号码" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购货单位类型:</label><div class="flex-flex-auto"><el-select v-model="form.gmfzrrbz" size="small" class="full-width" disabled><el-option label="自然人" value="0" /><el-option label="组织" value="1" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购货单位:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购货单位" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>发票类型:</label><div class="flex-flex-auto"><el-select v-model="form.lzfppzDm" size="small" class="full-width" disabled><el-option label="增值税专用发票" value="01" /><el-option label="普通发票" value="02" /><el-option label="机动车统一销售发票" value="03" /><el-option label="二手车统一销售发票" value="04" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>开具红字发票原因:</label><div class="flex-flex-auto"><el-select v-model="form.chyyDm" size="small" class="full-width"><el-option label="开票有误" value="01" /><el-option label="销货退回" value="02" /><el-option label="服务中止" value="03" /><el-option label="销售折让" value="04" /></el-select></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">特定要素:</label><div class="flex-flex-auto"><el-input v-model="form.tdys" size="small" class="full-width" placeholder="请输入特定要素" disabled /></div></div></div>
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
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方税号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfnsrsbh" size="small" class="full-width" placeholder="请输入销售方纳税人识别号" disabled /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" disabled /></div></div></div>                     
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdz" size="small" class="full-width" placeholder="请输入销售方地址" disabled /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdh" size="small" class="full-width" placeholder="请输入销售方电话" disabled /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.xsfkhh" size="small" class="full-width" placeholder="请输入销售方开户行" disabled /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方账号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfzh" size="small" class="full-width" placeholder="请输入销售方账号" disabled /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">差额征税类型:</label><div class="flex-flex-auto"><el-input v-model="form.cezzslx" size="small" class="full-width" placeholder="请输入差额征税类型" disabled /></div></div></div>
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
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购买方名称:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方税号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfnrsbh" size="small" class="full-width" placeholder="开具专票时必填" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdz" size="small" class="full-width" placeholder="请输入购买方地址" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdh" size="small" class="full-width" placeholder="请输入购买方电话" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.gmfkhh" size="small" class="full-width" placeholder="请输入购买方开户行" disabled /></div></div></div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方账号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfzh" size="small" class="full-width" placeholder="请输入购买方账号" disabled /></div></div></div>
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
                        <el-table-column prop="sl" label="数量" width="150"><template slot-scope="{row}"><el-input-number v-model="row.sl" @change="onRowChange(row)" :min="0" :step="1" size="small" class="full-width power-minw90" /></template></el-table-column>
                        <el-table-column prop="dj" label="单价(含税)" width="150"><template slot-scope="{row}"><el-input-number v-model="row.dj" @change="onRowChange(row)" :precision="6" :step="0.01" :min="0" size="small" class="full-width power-minw90" /></template></el-table-column>
                        <el-table-column prop="je" label="金额(含税)" width="150">
                          <template slot-scope="{row}">¥{{ formatMoney(row.je) }}</template>
                        </el-table-column>
                        <el-table-column prop="slv" label="增值税税率/征收率" width="150"><template slot-scope="{row}"><span>{{ Number(row.slv || 0).toFixed(4) }}</span></template></el-table-column>
                        <el-table-column prop="se" label="税额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.se) }}</template></el-table-column>
                        <el-table-column prop="hsje" label="含税金额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.hsje) }}</template></el-table-column>
                        <el-table-column prop="kce" label="扣除额" width="150"><template slot-scope="{row}"><el-input-number v-model="row.kce" :precision="2" :step="0.01" :min="0" size="small" class="full-width" /></template></el-table-column>
                        <el-table-column prop="sphfwssflhbbm" label="商品和服务税收分类合并编码" min-width="220"><template slot-scope="{row}"><span>{{ row.sphfwssflhbbm }}</span></template></el-table-column>
                        <el-table-column prop="fphxz" label="发票行性质" width="130"><template slot-scope="{row}"><span>{{ row.fphxz }}</span></template></el-table-column>
                        <el-table-column prop="yhzcbs" label="优惠政策标识" width="140"><template slot-scope="{row}"><el-input v-model="row.yhzcbs" class="full-width" /></template></el-table-column>
                        <el-table-column label="操作" width="80" fixed="right"><template slot-scope="scope"><p><span class="link" @click="deleteDetailRow(scope.$index)">删除</span></p></template></el-table-column>
                      </el-table>
                      <div class="mt10 darkgray">
                        <p class="mt5">合计金额： {{ formatMoney(form.hjjc) }}（元）</p>
                        <p class="mt5">合计税额： {{ formatMoney(form.hjs) }}（元）</p>
                        <p class="mt5">价税合计： {{ formatMoney(form.jshj) }}（元）</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <!-- 发票信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>发票信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>开票日期:</label>
                      <div class="flex-flex-auto"><el-date-picker v-model="form.kprq" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" class="full-width" placeholder="选择开票日期" /></div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>开票人:</label><div class="flex-flex-auto"><el-input v-model="form.kpr" size="small" class="full-width" placeholder="请输入开票人" /></div></div></div>
                  <div class="lc-col-12"><div class="flex flex-content-start flex-items-center"><label class="nowrap">备注:</label><div class="flex-flex-auto"><el-input type="textarea" v-model="form.bz" :rows="3" size="small" class="full-width" placeholder="请输入备注" /></div></div></div>
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
  props: { permissions: Object, params: Object },
  data() {
    return {
      saving: false,
      form: {
        // 基础信息
        xsfmc: '', lzfphm: '', gmfzrrbz: '1', gmfmc: '', lzfppzDm: '02', chyyDm: '01', tdys: '',
        // 销售方信息
        xsfnsrsbh: '', xsfdz: '', xsfdh: '', xsfkhh: '', xsfzh: '', cezzslx: '',
        // 购买方信息
        gmfnrsbh: '', gmfdz: '', gmfdh: '', gmfkhh: '', gmfzh: '',
        // 明细与合计
        fpmxList: [],
        hjjc: 0, // 合计金额
        hjs: 0,  // 合计税额
        jshj: 0, // 价税合计
        // 其他信息
        bz: ''
      }
    };
  },
  mounted() {
    // 从蓝字发票查询带入数据
    try {
      const json = sessionStorage.getItem('taxInvoice.selectedBlueInvoice');
      if (json) {
        const inv = JSON.parse(json) || {};
        // 基础信息
        if (inv.fphm && !this.form.lzfphm) this.form.lzfphm = inv.fphm;
        if (inv.gmfmc && !this.form.gmfmc) this.form.gmfmc = inv.gmfmc;
        if (inv.xsfmc && !this.form.xsfmc) this.form.xsfmc = inv.xsfmc;
        if (inv.fplxDm && !this.form.lzfppzDm) this.form.lzfppzDm = inv.fplxDm;
        // 销售方信息
        if (inv.xsfnsrsbh && !this.form.xsfnsrsbh) this.form.xsfnsrsbh = inv.xsfnsrsbh;
        if (inv.xsfdz && !this.form.xsfdz) this.form.xsfdz = inv.xsfdz;
        if (inv.xsfdh && !this.form.xsfdh) this.form.xsfdh = inv.xsfdh;
        if (inv.xsfkhh && !this.form.xsfkhh) this.form.xsfkhh = inv.xsfkhh;
        if (inv.xsfzh && !this.form.xsfzh) this.form.xsfzh = inv.xsfzh;
        // 购买方信息
        if (inv.gmfnrsbh && !this.form.gmfnrsbh) this.form.gmfnrsbh = inv.gmfnrsbh;
        if (inv.gmfdz && !this.form.gmfdz) this.form.gmfdz = inv.gmfdz;
        if (inv.gmfdh && !this.form.gmfdh) this.form.gmfdh = inv.gmfdh;
        if (inv.gmfkhh && !this.form.gmfkhh) this.form.gmfkhh = inv.gmfkhh;
        if (inv.gmfzh && !this.form.gmfzh) this.form.gmfzh = inv.gmfzh;
        sessionStorage.removeItem('taxInvoice.selectedBlueInvoice');
      }
    } catch (e) {
      console.error('读取蓝字发票数据失败:', e);
    }

    // 恢复表单与回填所选商品
    this.restoreFormData();
    this.fillSelectedGoods();
    this.recalcTotals();
  },
  methods: {
    // 选择商品/服务
    openSelectGoods() {
      this.saveFormData();
      this.$router.push({ name: 'taxInvoiceSelectGoods', query: { from: 'taxInvoiceRedSellerCreate' } });
    },
    // 删除明细行
    deleteDetailRow(index) {
      if (index >= 0 && index < this.form.fpmxList.length) {
        this.form.fpmxList.splice(index, 1);
        this.recalcTotals();
      }
    },
    // 行变更，重算单行与合计
    onRowChange(row) {
      this.recalcRow(row);
      this.recalcTotals();
    },
    // 单行计算：金额(含税)=数量*单价；税额=金额*税率；含税金额=金额+税额
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
      this.form.hjjc = this.toFixedNumber(totalAmount, 2);
      this.form.hjs = this.toFixedNumber(totalTax, 2);
      this.form.jshj = this.toFixedNumber(this.form.hjjc + this.form.hjs, 2);
    },
    // 从会话回填所选商品（支持单个与多个）
    fillSelectedGoods() {
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
      const row = {
        xmmc: item.name || '',
        ggxh: item.spec || item.model || '',
        dw: item.packSpec || item.unit || '',
        sl: 1,
        dj: 0,
        je: 0,
        slv: this.defaultTaxRate(item),
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
    defaultTaxRate(item) {
      // 简单默认税率：若有 rate 字段用之，否则 0.13
      const r = Number(item.rate);
      if (!isNaN(r) && r >= 0) return this.toFixedNumber(r, 6);
      return 0.13;
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
    // 表单持久化：在跨路由选择场景保留用户输入
    saveFormData() {
      try {
        sessionStorage.setItem('taxInvoice.redSellerCreate.form', JSON.stringify(this.form));
      } catch (e) {
        console.error('保存表单数据失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
    },
    restoreFormData() {
      try {
        const json = sessionStorage.getItem('taxInvoice.redSellerCreate.form');
        if (json) {
          const saved = JSON.parse(json) || {};
          // 仅在当前值为空时回填，避免覆盖最新输入
          Object.keys(saved).forEach(k => {
            const cur = this.form[k];
            if (cur === '' || cur === null || (Array.isArray(cur) && cur.length === 0)) {
              this.form[k] = saved[k];
            }
          });
        }
      } catch (e) {
        console.error('恢复表单数据失败:', e);
      }
    },
    submit() {
      // 只验证可编辑的必填字段
      if (!this.form.chyyDm || this.form.chyyDm === '') {
        this.$message.warning('请选择开具红字发票原因');
        return;
      }
      this.saving = true;
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.applyRedConfirm;
      const payload = { ...this.form };
      if (!svc) {
        this.saving = false;
        this.$message.success('保存成功（Mock）');
        this.$router.push({ name: 'taxInvoiceRedSellerList' });
        return;
      }
      this.API.send(
        svc,
        payload,
        (res) => {
          this.saving = false;
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success('保存成功');
            this.$router.push({ name: 'taxInvoiceRedSellerList' });
          } else {
            this.$message.warning(message || '保存结果未知');
          }
        },
        () => {
          this.saving = false;
          this.$message.success('保存成功（Mock）');
          this.$router.push({ name: 'taxInvoiceRedSellerList' });
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


