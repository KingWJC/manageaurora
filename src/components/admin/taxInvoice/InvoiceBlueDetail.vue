<template>
  <div>
    <div class="viewport-fixed">
      <!-- 顶部返回面包屑 -->
      <crumbs-bar></crumbs-bar>
      <!-- 底部保存按钮 -->
      <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center">
        <div class="flex flex-content-center">
          <button class="btn btn-primary btn-xl" type="button" @click="submit">保存</button>
        </div>
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <div class="panel-content-padded ">
              <h2>数电发票开具申请单（蓝字）-新增</h2>
              <!-- 基本信息 -->
              <div class="card card-shadow">
                <div class="card-body">
                  <div class="card-header"><strong>基本信息</strong></div>
                  <div class="card-content-padded">
                    <div class="lc-row lc-space16">
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购货单位类型:</label><div class="flex-flex-auto"><el-select v-model="form.gmfzrrbz" size="small" class="full-width"><el-option label="自然人" value="0" /><el-option label="组织" value="1" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6">
                        <div class="flex flex-content-start flex-items-center">
                          <label class="nowrap"><span class="red">*</span>购买方名称:</label>
                          <div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" />
                          </div>
                          <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addBuyer"></span>
                        </div>
                      </div>
                      <div class="lc-col-12 lc-col-xs6">
                        <div class="flex flex-content-start flex-items-center">
                          <label class="nowrap"><span class="red">*</span>发票票种:</label>
                          <div class="flex-flex-auto"><el-select v-model="form.fppz" size="small" placeholder="请选择" class="full-width"><el-option label="数电专票" value="01" /><el-option label="数电普票" value="02" /></el-select></div>
                        </div>
                      </div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">展示销方银行账号标签:</label><div class="flex-flex-auto"><el-select v-model="form.sfzxsfyhzhbq" size="small" class="full-width"><el-option label="否" value="0" /><el-option label="是" value="1" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">展示购方银行账号标签:</label><div class="flex-flex-auto"><el-select v-model="form.sfzsgmfyhzhbq" size="small" class="full-width"><el-option label="否" value="0" /><el-option label="是" value="1" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">特定要素:</label><div class="flex-flex-auto"><el-input v-model="form.tdys" size="small" class="full-width" placeholder="请输入特定要素" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">增值税即征即退代码:</label><div class="flex-flex-auto"><el-input v-model="form.zzsjzjtDm" size="small" class="full-width" placeholder="请输入增值税即征即退代码" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">收款银行名称:</label><div class="flex-flex-auto"><el-input v-model="form.skyhmc" size="small" class="full-width" placeholder="请输入收款银行名称" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">收款银行账号:</label><div class="flex-flex-auto"><el-input v-model="form.skyhzh" size="small" class="full-width" placeholder="请输入收款银行账号" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">结算方式:</label><div class="flex-flex-auto"><el-input v-model="form.jsfs" size="small" class="full-width" placeholder="请输入结算方式" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">应税行为发生地:</label><div class="flex-flex-auto"><el-input v-model="form.ysxwfsd" size="small" class="full-width" placeholder="请输入应税行为发生地" /></div></div></div>
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
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方税号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfnsrsbh" size="small" class="full-width" placeholder="请输入销售方纳税人识别号" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" /></div></div></div>                     
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdz" size="small" class="full-width" placeholder="请输入销售方地址" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdh" size="small" class="full-width" placeholder="请输入销售方电话" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.xsfkhh" size="small" class="full-width" placeholder="请输入销售方开户行" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方账号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfzh" size="small" class="full-width" placeholder="请输入销售方账号" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">差额征税类型:</label><div class="flex-flex-auto"><el-input v-model="form.cezzslx" size="small" class="full-width" placeholder="请输入差额征税类型" /></div></div></div>
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
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购买方名称:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方税号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfnrsbh" size="small" class="full-width" placeholder="开具专票时必填" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdz" size="small" class="full-width" placeholder="请输入购买方地址" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdh" size="small" class="full-width" placeholder="请输入购买方电话" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.gmfkhh" size="small" class="full-width" placeholder="请输入购买方开户行" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方账号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfzh" size="small" class="full-width" placeholder="请输入购买方账号" /></div></div></div>
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

              <!-- 开票详情信息 -->
              <div class="card card-shadow">
                <div class="card-body">
                  <div class="card-header">
                    <strong>开票详情信息</strong>
                  </div>
                  <div class="card-content-padded">
                      <div class="lc-row lc-space16">
                        <div class="flex flex-content-start flex-items-center mb10">
                          <el-button size="small" type="primary" @click="openSelectGoods">添加明细</el-button>
                        </div>
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
        taxInvoiceNo: '', fphm: '', ptbh: '', fppz: '', kprq: '', qyDm: '', lzfpbz: '0',
        xsfnsrsbh: '', xsfmc: '', xsfdz: '', xsfdh: '', xsfkhh: '', xsfzh: '', cezzslx: '',
        gmfnrsbh: '', gmfmc: '', gmfdz: '', gmfdh: '', gmfkhh: '', gmfzh: '',
        gmfzrrbz:'',
        // 其它信息（与表单控件一致）
        sfzxsfyhzhbq: '', // 是否展示销方银行账号标签/购货单位类型
        sfzsgmfyhzhbq: '', // 是否展示购方银行账号标签
        tdys: '',
        zzsjzjtDm: '',
        skyhmc: '', skyhzh: '', jsfs: '', ysxwfsd: '',
        hjjc: 0, hjs: 0, jshj: 0,
        fpmxList: [ { mxxh: 1, xmmc: '', spfwjc: '', ggxh: '', dw: '', sl: '', dj: '', je: 0, slv: 0, se: 0, hsje: 0, kce: 0, sphfwssflhbbm: '', fphxz: '', yhzcbs: '' } ],
        kpr: '', skrxm: '', fhrxm: '', bz: ''
      }
    };
  },
  mounted() {
    // 先恢复保存的表单数据，再回填选择的数据（仅填充空值）
    this.restoreFormData();
    this.fillSelectedData();
  },
  activated() {
    // keep-alive 激活时也检查恢复和回填
    this.restoreFormData();
    this.fillSelectedData();
  },
  methods: {
    // 回填选择的数据（仅填充空值）
    fillSelectedData() {
      try {
        const orgJson = sessionStorage.getItem('taxInvoice.selectedOrg');
        if (orgJson) {
          const org = JSON.parse(orgJson) || {};
          if (!this.form.gmfmc && org.mc) this.form.gmfmc = org.mc;
          if (!this.form.gmfnrsbh && org.nsrsbh) this.form.gmfnrsbh = org.nsrsbh;
          if (!this.form.gmfdz) {
            if (org.address) {
              this.form.gmfdz = org.address;
            } else if (org.province || org.city || org.county) {
              this.form.gmfdz = [org.province, org.city, org.county].filter(Boolean).join('');
            }
          }
          sessionStorage.removeItem('taxInvoice.selectedOrg');
        }
        const perJson = sessionStorage.getItem('taxInvoice.selectedPerson');
        if (perJson) {
          const per = JSON.parse(perJson) || {};
          if (!this.form.gmfmc && per.name) this.form.gmfmc = per.name;
          if (!this.form.gmfdh && per.cellphone) this.form.gmfdh = per.cellphone;
          if (!this.form.gmfnrsbh && per.idno) this.form.gmfnrsbh = per.idno;
          sessionStorage.removeItem('taxInvoice.selectedPerson');
        }
        // 处理批量商品选择
        const goodsListJson = sessionStorage.getItem('taxInvoice.selectedGoodsList');
        if (goodsListJson) {
          const list = JSON.parse(goodsListJson) || [];
          if (Array.isArray(list) && list.length) this.appendGoodsRows(list);
          sessionStorage.removeItem('taxInvoice.selectedGoodsList');
        }
      } catch (e) {
        console.error('回填选择数据失败:', e);
        if (this.$message) this.$message.error('加载数据失败，请重试');
      }
    },
    appendGoodsRows(list) {
      (list || []).forEach((g) => {
        const newRow = {
          mxxh: (this.form.fpmxList.length || 0) + 1,
          xmmc: g.name || g.xmmc || '', // 统一使用 name 字段作为项目名称
          spfwjc: '',
          ggxh: g.spec || g.ggxh || '', // 规格型号
          dw: g.packSpec || g.dw || '', // 单位（包装规格）
          sl: Number(g.sl) || 1,
          dj: Number(g.dj) || 0,
          je: 0,
          slv: Number(g.slv) || 0,
          se: 0,
          hsje: 0,
          kce: 0,
          sphfwssflhbbm: g.sphfwssflhbbm || '',
          fphxz: g.fphxz || '',
          yhzcbs: g.yhzcbs || ''
        };
        this.form.fpmxList.push(newRow);
        this.onRowChange(newRow);
      });
    },
    // 明细
    deleteDetailRow(i) { this.form.fpmxList.splice(i, 1); this.recalcTotals(); },
    onRowChange(row) {
      const sl = Number(row.sl) || 0;
      const dj = Number(row.dj) || 0;
      const slv = Number(row.slv) || 0;
      const je = dj * sl;
      const se = je * slv;
      row.je = this.toFixedNumber(je, 2);
      row.se = this.toFixedNumber(se, 2);
      row.hsje = this.toFixedNumber(row.je + row.se, 2);
      this.recalcTotals();
    },
    recalcTotals() {
      const sum = this.form.fpmxList.reduce((acc, r) => {
        acc.je += Number(r.je) || 0;
        acc.se += Number(r.se) || 0;
        acc.hs += Number(r.hsje) || 0;
        return acc;
      }, { je: 0, se: 0, hs: 0 });
      this.form.hjjc = this.toFixedNumber(sum.je, 2);
      this.form.hjs = this.toFixedNumber(sum.se, 2);
      this.form.jshj = this.toFixedNumber(sum.hs, 2);
    },
    toFixedNumber(v, p) { return Number((v || 0).toFixed(p)); },
    formatMoney(v) {
      const n = Number(v || 0).toFixed(8);
      return n;
    },
    addBuyer() {
      // 跳转前保存表单数据
      this.saveFormData();
      const type = this.form.gmfzrrbz;
      if (type === '0') {
        this.$router.push({ name: 'taxInvoiceSelectPerson', query: { from: 'taxInvoiceBlueDetail' } });
        return;
      }
      if (type === '1') {
        this.$router.push({ name: 'taxInvoiceSelectOrg', query: { from: 'taxInvoiceBlueDetail' } });
        return;
      }
      this.$message.info('请先选择购货单位类型');
    },
    openSelectGoods() {
      // 跳转前保存表单数据
      this.saveFormData();
      this.$router.push({ name: 'taxInvoiceSelectGoods', query: { from: 'taxInvoiceBlueDetail' } });
    },
    saveFormData() {
      try {
        sessionStorage.setItem('taxInvoice.formData', JSON.stringify(this.form || {}));
      } catch (e) {
        console.error('保存表单数据失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
    },
    restoreFormData() {
      try {
        const saved = sessionStorage.getItem('taxInvoice.formData');
        if (saved) {
          const savedData = JSON.parse(saved) || {};
          // 恢复表单数据，保留已有值
          Object.keys(savedData).forEach(key => {
            if (savedData[key] !== null && savedData[key] !== undefined && savedData[key] !== '') {
              if (Array.isArray(savedData[key])) {
                this.form[key] = savedData[key];
              } else if (typeof savedData[key] === 'object') {
                this.form[key] = { ...this.form[key], ...savedData[key] };
              } else {
                this.form[key] = savedData[key];
              }
            }
          });
          sessionStorage.removeItem('taxInvoice.formData');
        }
      } catch (e) {
        console.error('恢复表单数据失败:', e);
      }
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
    },
    submit() {
      const requiredPairs = [
        ['taxInvoiceNo', '请填写发票请求流水号'],
        ['fppz', '请选择发票票种'],
        ['ptbh', '请填写平台编号'],
        ['qyDm', '请填写区域代码'],
        ['kprq', '请选择开票日期'],
        ['xsfnsrsbh', '请填写销售方税号'],
        ['xsfmc', '请填写销售方名称'],
        ['gmfmc', '请填写购买方名称'],
        ['hjjc', '请填写合计金额'],
        ['hjs', '请填写合计税额'],
        ['jshj', '请填写价税合计'],
        ['fphm', '请填写发票号码'],
        ['kpr', '请填写开票人']
      ];
      for (const [key, msg] of requiredPairs) {
        if (this.form[key] === '' || this.form[key] === null || this.form[key] === undefined) {
          this.$toast ? this.$toast({ text: msg }) : this.$message.warning(msg);
          return;
        }
      }
      this.saving = true;
      const payload = [{ ...this.form }];
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.uploadlqadapters;
      if (!svc) {
        setTimeout(() => {
          this.saving = false;
          this.$message.success('上传成功（Mock）');
          this.$router.push({ name: 'taxInvoiceBlueList' });
        }, 500);
        return;
      }
      this.API.send(
        svc,
        payload,
        (res) => {
          this.saving = false;
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success) {
            const sslsh = data && (data.sslsh || data.sllsh);
            if (sslsh) {
              this.$message.success('上传成功，受理流水号：' + sslsh);
            } else {
              this.$message.success('上传完成');
            }
            try { sessionStorage.removeItem('taxInvoice.formData'); } catch (e) {
              console.error('清理表单数据失败:', e);
            }
            this.$router.push({ name: 'taxInvoiceBlueList' });
          } else {
            this.$message.warning(message || '上传结果未知');
          }
        },
        () => { this.saving = false; },
        this
      );
    }
  }
};
</script>

<style scoped>
</style>


