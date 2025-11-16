<template>
  <div>
    <div class="viewport-fixed">
      <!-- 顶部返回面包屑 -->
      <crumbs-bar></crumbs-bar>
      <!-- 底部保存按钮 -->
      <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center" v-if="!isViewMode">
        <div class="flex flex-content-center">
          <button class="btn btn-primary btn-xl" type="button" @click="submit">保存</button>
        </div>
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <div class="panel-content-padded ">
              <h2>数电发票开具申请单（蓝字）-{{ pageTitle }}</h2>
              <!-- 基本信息 -->
              <div class="card card-shadow">
                <div class="card-body">
                  <div class="card-header"><strong>基本信息</strong></div>
                  <div class="card-content-padded">
                    <div class="lc-row lc-space16">
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购货单位类型:</label><div class="flex-flex-auto"><el-select v-model="form.gmfzrrbz" size="small" class="full-width" :disabled="isViewMode"><el-option label="自然人" value="Y" /><el-option label="组织" value="N" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6">
                        <div class="flex flex-content-start flex-items-center">
                          <label class="nowrap"><span class="red">*</span>购买方名称:</label>
                          <div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" :disabled="isViewMode" />
                          </div>
                          <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addBuyer" v-if="!isViewMode"></span>
                        </div>
                      </div>
                      <div class="lc-col-12 lc-col-xs6">
                        <div class="flex flex-content-start flex-items-center">
                          <label class="nowrap"><span class="red">*</span>发票票种:</label>
                          <div class="flex-flex-auto"><el-select v-model="form.fppz" size="small" placeholder="请选择" class="full-width" :disabled="isViewMode"><el-option label="数电专票" value="01" /><el-option label="数电普票" value="02" /></el-select></div>
                        </div>
                      </div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">展示销方银行账号标签:</label><div class="flex-flex-auto"><el-select v-model="form.sfzxsfyhzhbq" size="small" class="full-width" :disabled="isViewMode"><el-option label="否" value="0" /><el-option label="是" value="1" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">展示购方银行账号标签:</label><div class="flex-flex-auto"><el-select v-model="form.sfzsgmfyhzhbq" size="small" class="full-width" :disabled="isViewMode"><el-option label="否" value="0" /><el-option label="是" value="1" /></el-select></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">特定要素:</label><div class="flex-flex-auto"><el-input v-model="form.tdys" size="small" class="full-width" placeholder="请输入特定要素" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">增值税即征即退代码:</label><div class="flex-flex-auto"><el-input v-model="form.zzsjzjtDm" size="small" class="full-width" placeholder="请输入增值税即征即退代码" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">收款银行名称:</label><div class="flex-flex-auto"><el-input v-model="form.skyhmc" size="small" class="full-width" placeholder="请输入收款银行名称" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">收款银行账号:</label><div class="flex-flex-auto"><el-input v-model="form.skyhzh" size="small" class="full-width" placeholder="请输入收款银行账号" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">结算方式:</label><div class="flex-flex-auto"><el-input v-model="form.jsfs" size="small" class="full-width" placeholder="请输入结算方式" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">应税行为发生地:</label><div class="flex-flex-auto"><el-input v-model="form.ysxwfsd" size="small" class="full-width" placeholder="请输入应税行为发生地" :disabled="isViewMode" /></div></div></div>
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
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方税号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfnsrsbh" size="small" class="full-width" placeholder="请输入销售方纳税人识别号" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>销售方名称:</label><div class="flex-flex-auto"><el-input v-model="form.xsfmc" size="small" class="full-width" placeholder="请输入销售方名称" :disabled="isViewMode" /></div></div></div>                     
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdz" size="small" class="full-width" placeholder="请输入销售方地址" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfdh" size="small" class="full-width" placeholder="请输入销售方电话" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.xsfkhh" size="small" class="full-width" placeholder="请输入销售方开户行" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">销售方账号:</label><div class="flex-flex-auto"><el-input v-model="form.xsfzh" size="small" class="full-width" placeholder="请输入销售方账号" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">差额征税类型:</label><div class="flex-flex-auto"><el-input v-model="form.cezzslx" size="small" class="full-width" placeholder="请输入差额征税类型" :disabled="isViewMode" /></div></div></div>
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
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>购买方名称:</label><div class="flex-flex-auto"><el-input v-model="form.gmfmc" size="small" class="full-width" placeholder="请输入购买方名称" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方税号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfnrsbh" size="small" class="full-width" placeholder="开具专票时必填" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">地址:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdz" size="small" class="full-width" placeholder="请输入购买方地址" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">手机号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfdh" size="small" class="full-width" placeholder="请输入购买方电话" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方开户行:</label><div class="flex-flex-auto"><el-input v-model="form.gmfkhh" size="small" class="full-width" placeholder="请输入购买方开户行" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap">购买方账号:</label><div class="flex-flex-auto"><el-input v-model="form.gmfzh" size="small" class="full-width" placeholder="请输入购买方账号" :disabled="isViewMode" /></div></div></div>
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
                          <div class="flex-flex-auto"><el-date-picker v-model="form.kprq" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" class="full-width" placeholder="选择开票日期" :disabled="isViewMode" /></div>
                        </div>
                      </div>
                      <div class="lc-col-12 lc-col-xs6"><div class="flex flex-content-start flex-items-center"><label class="nowrap"><span class="red">*</span>开票人:</label><div class="flex-flex-auto"><el-input v-model="form.kpr" size="small" class="full-width" placeholder="请输入开票人" :disabled="isViewMode" /></div></div></div>
                      <div class="lc-col-12"><div class="flex flex-content-start flex-items-center"><label class="nowrap">备注:</label><div class="flex-flex-auto"><el-input type="textarea" v-model="form.bz" :rows="3" size="small" class="full-width" placeholder="请输入备注" :disabled="isViewMode" /></div></div></div>
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
                        <div class="flex flex-content-start flex-items-center mb10" v-if="!isViewMode">
                          <el-button size="small" type="primary" @click="openSelectGoods">添加明细</el-button>
                        </div>
                          <el-table :data="form.fpmxList" border style="width:100%">
                            <el-table-column prop="xmmc" label="项目名称" min-width="140"><template slot-scope="{row}"><span>{{ row.xmmc }}</span></template></el-table-column>
                            <el-table-column prop="ggxh" label="规格型号" width="120"><template slot-scope="{row}"><span>{{ row.ggxh }}</span></template></el-table-column>
                            <el-table-column prop="dw" label="单位" width="90"><template slot-scope="{row}"><span>{{ row.dw }}</span></template></el-table-column>
                            <el-table-column prop="sl" label="数量" width="150"><template slot-scope="{row}"><el-input-number v-model="row.sl" @change="onRowChange(row)" :min="0" :step="1" size="small" class="full-width power-minw90" :disabled="isViewMode" /></template></el-table-column>
                            <el-table-column prop="dj" label="单价(含税)" width="150"><template slot-scope="{row}"><el-input-number v-model="row.dj" @change="onRowChange(row)" :precision="6" :step="0.01" :min="0" size="small" class="full-width power-minw90" :disabled="isViewMode" /></template></el-table-column>
                            <el-table-column prop="je" label="金额(含税)" width="150">
                              <template slot-scope="{row}">¥{{ formatMoney(row.je) }}</template>
                            </el-table-column>
                            <el-table-column prop="slv" label="增值税税率/征收率" width="150"><template slot-scope="{row}"><span>{{ Number(row.slv || 0).toFixed(4) }}</span></template></el-table-column>
                            <el-table-column prop="se" label="税额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.se) }}</template></el-table-column>
                            <el-table-column prop="hsje" label="含税金额" width="150"><template slot-scope="{row}">¥{{ formatMoney(row.hsje) }}</template></el-table-column>
                            <el-table-column prop="kce" label="扣除额" width="150"><template slot-scope="{row}"><el-input-number v-model="row.kce" :precision="2" :step="0.01" :min="0" size="small" class="full-width" :disabled="isViewMode" /></template></el-table-column>
                            <el-table-column prop="sphfwssflhbbm" label="商品和服务税收分类合并编码" min-width="220"><template slot-scope="{row}"><span>{{ row.sphfwssflhbbm }}</span></template></el-table-column>
                            <el-table-column prop="fphxz" label="发票行性质" width="130"><template slot-scope="{row}"><span>{{ row.fphxz }}</span></template></el-table-column>
                            <el-table-column prop="yhzcbs" label="优惠政策标识" width="140"><template slot-scope="{row}"><el-input v-model="row.yhzcbs" class="full-width" :disabled="isViewMode" /></template></el-table-column>
                            <el-table-column label="操作" width="80" fixed="right" v-if="!isViewMode"><template slot-scope="scope"><p><span class="link" @click="deleteDetailRow(scope.$index)">删除</span></p></template></el-table-column>
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
    <!-- 商品/服务选择组件 -->
    <div class="viewport-fixed bg-white power-zi101" v-if="ootListConfig.show">
      <ootListChoice :ootListConfig="ootListConfig"></ootListChoice>
    </div>
  </div>
</template>

<script>
import taxInvoiceUtils from './taxInvoiceUtils';

export default {
  components: { 
    crumbsBar: () => import('@/common-base/components/crumbs-bar'),
    ootListChoice: () => import('@/common-base/components/pubComponents/ootListChoice')
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      saving: false,
      isViewMode: false, // 是否为查看模式
      ootListConfig: {
        show: false,
        selection: true, // 支持多选
        categoryList: [1, 3], // 1=商品，3=服务
        ptypes: ['101', '102', '103', '104', '105', '199'], // 商品类型：药品、器械、食品、消毒用品、化妆品、其他
        ootCategory: '1', // 默认显示商品
        ootType: '101', // 默认显示药品
        noDetails: false, // 显示详情按钮
        okFn: (selectedItems) => {
          this.handleGoodsSelected(selectedItems);
        }
      },
      form: {
        id: '', taxInvoiceNo: '', fphm: '', ptbh: '', fppz: '', kprq: '', qyDm: '', lzfpbz: '0',
        xsfnsrsbh: '', xsfmc: '', xsfdz: '', xsfdh: '', xsfkhh: '', xsfzh: '', cezzslx: '',
        gmfnrsbh: '', gmfmc: '', gmfdz: '', gmfdh: '', gmfkhh: '', gmfzh: '',
        gmfzrrbz: '', // 购货单位类型：Y:购买方是自然人，N:购买方非自然人（前后端统一使用Y/N格式）
        sfzxsfyhzhbq: '', // 是否展示销方银行账号标签
        sfzsgmfyhzhbq: '', // 是否展示购方银行账号标签
        tdys: '',
        cezslxDm: '', sgfplxDm: '', ckywyszczDm: '',
        zzsjzjtDm: '',
        skyhmc: '', skyhzh: '', jsfs: '', ysxwfsd: '',
        gmfjbr: '', jbrsfzjhm: '', gmfbrlxdh: '',
        kprzjhm: '', kprzjlx: '',
        dylzfphm: '', hzqrxxdbh: '', hzqrduuid: '',
        hjjc: 0, hjs: 0, jshj: 0,
        fpmxList: [ { mxxh: 1, dylzfpmxxh: 0, xmmc: '', spfwjc: '', ggxh: '', dw: '', sl: '', dj: '', je: 0, slv: 0, se: 0, hsje: 0, kce: 0, sphfwssflhbbm: '', fphxz: '', yhzcbs: '' } ],
        fjysList: [],
        cekcList: [],
        kpr: '', skrxm: '', fhrxm: '', bz: ''
      }
    };
  },
  computed: {
    // 页面标题：根据路由参数判断是新建、编辑还是查看
    pageTitle() {
      const query = this.$route && this.$route.query;
      if (!query) {
        return '新增';
      }
      if (query.mode === 'view') {
        return '查看';
      }
      if (query.id) {
        return '编辑';
      }
      return '新增';
    }
  },
  mounted() {
    this.isViewMode = this.$route && this.$route.query && this.$route.query.mode === 'view';
    // 恢复保存的表单数据
    this.restoreFormData();
    this.fillSelectedData();
    if (this.$route && this.$route.query && this.$route.query.id) {
      this.fetchInvoiceDetail(this.$route.query.id);
    }
  },
  methods: {
    fetchInvoiceDetail(invoiceId) {
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceQuery,
        { invoiceId },
        (res) => {
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            this.applyInvoiceDetail(data);
          } else if (message) {
            this.$message.warning(message);
          }
        },
        () => {},
        this
      );
    },
    applyInvoiceDetail(detail = {}) {
      const assigns = [
        ['id', detail.id],
        ['invoice_id', detail.taxInvoiceNo],
        ['fphm', detail.fphm],
        ['fppz', detail.fppz],
        ['kprq', taxInvoiceUtils.formatTimestampToDate(detail.kprq)],
        ['kpr', detail.kpr],
        ['xsfnsrsbh', detail.xsfnsrsbh],
        ['xsfmc', detail.xsfmc],
        ['xsfdz', detail.xsfdz],
        ['xsfdh', detail.xsfdh],
        ['xsfkhh', detail.xsfkhh],
        ['xsfzh', detail.xsfzh],
        ['gmfnrsbh', detail.gmfnrsbh],
        ['gmfmc', detail.gmfmc],
        ['gmfdz', detail.gmfdz],
        ['gmfdh', detail.gmfdh],
        ['gmfkhh', detail.gmfkhh],
        ['gmfzh', detail.gmfzh],
        ['gmfzrrbz', detail.gmfzrrbz],
        ['tdys', detail.tdys],
        ['cezslxDm', detail.cezslxDm],
        ['sgfplxDm', detail.sgfplxDm],
        ['ckywyszczDm', detail.ckywyszczDm],
        ['zzsjzjtDm', detail.zzsjzjtDm],
        ['gmfjbr', detail.gmfjbr],
        ['jbrsfzjhm', detail.jbrsfzjhm],
        ['gmfbrlxdh', detail.gmfbrlxdh],
        ['kprzjhm', detail.kprzjhm],
        ['kprzjlx', detail.kprzjlx],
        ['dylzfphm', detail.dylzfphm],
        ['hzqrxxdbh', detail.hzqrxxdbh],
        ['hzqrduuid', detail.hzqrduuid],
        ['skyhmc', detail.skyhmc],
        ['skyhzh', detail.skyhzh],
        ['jsfs', detail.jsfs],
        ['ysxwfsd', detail.ysxwfsd],
        ['sfzxsfyhzhbq', detail.sfzxsfyhzhbq],
        ['sfzsgmfyhzhbq', detail.sfzsgmfyhzhbq],
        ['skrxm', detail.skrxm],
        ['fhrxm', detail.fhrxm],
        ['bz', detail.bz || detail.remark],
        ['hjjc', detail.hjje !== undefined ? Number(detail.hjje) : this.form.hjjc],
        ['hjs', detail.hjse !== undefined ? Number(detail.hjse) : this.form.hjs],
        ['jshj', detail.jshj !== undefined ? Number(detail.jshj) : this.form.jshj]
      ];
      assigns.forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'gmfzrrbz') {
            this.$set(this.form, key, value);
          } else {
            this.form[key] = value;
          }
        }
      });
      // 确保 gmfzrrbz 字段在 DOM 更新后也能正确显示
      if (detail.gmfzrrbz !== undefined && detail.gmfzrrbz !== null && detail.gmfzrrbz !== '') {
        this.$nextTick(() => {
          // 再次确保值被正确设置，解决可能的时序问题
          if (this.form.gmfzrrbz !== detail.gmfzrrbz) {
            this.$set(this.form, 'gmfzrrbz', detail.gmfzrrbz);
          }
        });
      }
      if (detail.lzfpbz !== undefined && detail.lzfpbz !== null) {
        this.form.lzfpbz = detail.lzfpbz;
      }
      // 处理发票明细列表
      const details = Array.isArray(detail.fpmxList)
        ? detail.fpmxList
        : Array.isArray(detail.invoiceDetailList)
          ? detail.invoiceDetailList
          : [];
      if (details.length) {
        this.form.fpmxList = details.map((item, index) => ({
          mxxh: item.mxxh || index + 1,
          dylzfpmxxh: item.dylzfpmxxh || 0,
          xmmc: item.xmmc || item.itemName || '',
          spfwjc: item.spfwjc || '',
          ggxh: item.ggxh || item.spec || '',
          dw: item.dw || item.unit || '',
          sl: Number(item.sl || item.quantity || 0),
          dj: Number(item.dj || item.price || 0),
          je: Number(item.je || item.amount || 0),
          slv: Number(item.slv || item.rate || 0),
          se: Number(item.se || item.tax || 0),
          hsje: Number(item.hsje || item.amountWithTax || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || item.taxCode || '',
          fphxz: item.fphxz || item.lineNature || '00',
          yhzcbs: item.yhzcbs || ''
        }));
        this.recalcTotals();
      }
      // 处理附加要素列表
      if (Array.isArray(detail.fjysList) && detail.fjysList.length) {
        this.form.fjysList = detail.fjysList.map(item => ({
          fjysmc: item.fjysmc || '',
          fjyslx: item.fjyslx || '',
          fjysz: item.fjysz || ''
        }));
      }
      // 处理差额扣除列表
      if (Array.isArray(detail.cekcList) && detail.cekcList.length) {
        this.form.cekcList = detail.cekcList.map(item => ({
          xh: item.xh || 0,
          pzlx: item.pzlx || '',
          fpdm: item.fpdm || '',
          fphm: item.fphm || '',
          cezphm: item.cezphm || '',
          kjrq: taxInvoiceUtils.formatTimestampToDate(item.kjrq) || '',
          pzhjje: Number(item.pzhjje || 0),
          bckcje: Number(item.bckcje || 0),
          bz: item.bz || ''
        }));
      }
    },
    activated() {
      // keep-alive 激活时也检查恢复和回填
      // 更新查看模式状态
      this.isViewMode = this.$route && this.$route.query && this.$route.query.mode === 'view';
      this.restoreFormData();
      this.fillSelectedData();
      if (this.$route && this.$route.query && this.$route.query.id) {
        this.fetchInvoiceDetail(this.$route.query.id);
      }
    },
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
        // 适配 ootListChoice 组件返回的数据结构
        // ootListChoice 返回的商品数据字段：productName, specification, packingSpecification, barcode 等
        // 服务数据字段：productName, type, specification, vendor, barcode 等
        const newRow = {
          mxxh: (this.form.fpmxList.length || 0) + 1,
          dylzfpmxxh: 0,
          xmmc: g.productName || g.name || g.xmmc || '', // 商品/服务名称
          spfwjc: '',
          ggxh: g.specification || g.specificationAndModel || g.spec || g.ggxh || '', // 规格型号
          dw: g.packingSpecification || g.packSpec || g.dw || '', // 单位（包装规格）
          sl: Number(g.sl) || 1,
          dj: Number(g.dj) || 0,
          je: 0,
          slv: Number(g.slv) || 0,
          se: 0,
          hsje: 0,
          kce: 0,
          sphfwssflhbbm: g.sphfwssflhbbm || g.taxCode || '',
          fphxz: g.fphxz || '00',
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
      if (type === 'Y') {
        this.$router.push({ name: 'taxInvoiceSelectPerson', query: { from: 'taxInvoiceBlueDetail' } });
        return;
      }
      if (type === 'N') {
        this.$router.push({ name: 'taxInvoiceSelectOrg', query: { from: 'taxInvoiceBlueDetail' } });
        return;
      }
      this.$message.info('请先选择购货单位类型');
    },
    openSelectGoods() {
      // 跳转前保存表单数据
      this.saveFormData();
      // 显示商品/服务选择组件
      this.ootListConfig.show = true;
    },
    handleGoodsSelected(selectedItems) {
      // 处理选择的商品/服务
      if (!selectedItems) {
        return;
      }
      // 如果是数组（多选），批量添加
      if (Array.isArray(selectedItems)) {
        if (selectedItems.length > 0) {
          this.appendGoodsRows(selectedItems);
        }
      } else {
        // 如果是单个对象（单选），单个添加
        this.appendGoodsRows([selectedItems]);
      }
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
    validateForm() {
      const required = [
        ['xsfnsrsbh', '请填写销售方税号'],
        ['xsfmc', '请填写销售方名称'],
        ['gmfmc', '请填写购买方名称'],
        ['fppz', '请选择发票票种'],
        ['kprq', '请选择开票日期'],
        ['kpr', '请填写开票人']
      ];
      for (const [key, msg] of required) {
        const value = this.form[key];
        if (value === '' || value === null || value === undefined) {
          return msg;
        }
      }
      if (!Array.isArray(this.form.fpmxList) || !this.form.fpmxList.length) {
        return '请添加至少一条开票明细';
      }
      if (!Number.isFinite(Number(this.form.hjjc))) {
        return '请填写合计金额';
      }
      if (!Number.isFinite(Number(this.form.hjs))) {
        return '请填写合计税额';
      }
      if (!Number.isFinite(Number(this.form.jshj))) {
        return '请填写价税合计';
      }
      return '';
    },
    buildAddPayload() {
      // 根据 API 文档构建请求参数
      const detailList = (this.form.fpmxList || []).map((item, index) => {
        const quantity = Number(item.sl || 0);
        const price = Number(item.dj || 0);
        const amount = Number(item.je || 0);
        const tax = Number(item.se || 0);
        return {
          mxxh: item.mxxh || index + 1,
          dylzfpmxxh: item.dylzfpmxxh || 0,
          xmmc: item.xmmc || '',
          spfwjc: item.spfwjc || '',
          ggxh: item.ggxh || '',
          dw: item.dw || '',
          sl: Number.isFinite(quantity) ? quantity.toString() : '0',
          dj: Number.isFinite(price) ? price.toString() : '0',
          je: Number.isFinite(amount) ? amount : 0,
          slv: Number(item.slv || 0),
          se: Number.isFinite(tax) ? tax : 0,
          hsje: Number(item.hsje || amount + tax || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          fphxz: item.fphxz || '00',
          yhzcbs: item.yhzcbs || ''
        };
      });
      const payload = {
        id: this.form.id || '',
        taxInvoiceNo: this.form.taxInvoiceNo || '',
        lzfpbz: '0', // 蓝字发票
        fppz: this.form.fppz,
        gmfzrrbz: this.form.gmfzrrbz || '',
        tdys: this.form.tdys || '',
        cezslxDm: this.form.cezslxDm || '',
        sgfplxDm: this.form.sgfplxDm || '',
        ckywyszczDm: this.form.ckywyszczDm || '',
        zzsjzjtDm: this.form.zzsjzjtDm || '',
        xsfnsrsbh: this.form.xsfnsrsbh,
        xsfmc: this.form.xsfmc,
        xsfdz: this.form.xsfdz || '',
        xsfdh: this.form.xsfdh || '',
        xsfkhh: this.form.xsfkhh || '',
        xsfzh: this.form.xsfzh || '',
        gmfnrsbh: this.form.gmfnrsbh || '',
        gmfmc: this.form.gmfmc,
        gmfdz: this.form.gmfdz || '',
        gmfdh: this.form.gmfdh || '',
        gmfkhh: this.form.gmfkhh || '',
        gmfzh: this.form.gmfzh || '',
        gmfbrlxdh: this.form.gmfbrlxdh || '',
        gmfjbr: this.form.gmfjbr || '',
        jbrsfzjhm: this.form.jbrsfzjhm || '',
        hjje: Number(this.form.hjjc || 0),
        hjse: Number(this.form.hjs || 0),
        jshj: Number(this.form.jshj || 0),
        skyhmc: this.form.skyhmc || '',
        skyhzh: this.form.skyhzh || '',
        jsfs: this.form.jsfs || '',
        ysxwfsd: this.form.ysxwfsd || '',
        kpr: this.form.kpr,
        kprzjhm: this.form.kprzjhm || '',
        kprzjlx: this.form.kprzjlx || '',
        kprq: this.form.kprq ? taxInvoiceUtils.formatDateToTimestamp(this.form.kprq) : Math.floor(Date.now() / 1000),
        dylzfphm: this.form.dylzfphm || '',
        hzqrxxdbh: this.form.hzqrxxdbh || '',
        hzqrduuid: this.form.hzqrduuid || '',
        bz: this.form.bz || '',
        sfzxsfyhzhbq: this.form.sfzxsfyhzhbq || '',
        sfzsgmfyhzhbq: this.form.sfzsgmfyhzhbq || '',
        skrxm: this.form.skrxm || '',
        fhrxm: this.form.fhrxm || '',
        fpmxList: detailList
      };
      if (Array.isArray(this.form.fjysList) && this.form.fjysList.length) {
        payload.fjysList = this.form.fjysList.map(item => ({
          fjysmc: item.fjysmc || '',
          fjyslx: item.fjyslx || '',
          fjysz: item.fjysz || ''
        }));
      }
      if (Array.isArray(this.form.cekcList) && this.form.cekcList.length) {
        payload.cekcList = this.form.cekcList.map(item => ({
          xh: item.xh || 0,
          pzlx: item.pzlx || '',
          fpdm: item.fpdm || '',
          fphm: item.fphm || '',
          cezphm: item.cezphm || '',
          kjrq: item.kjrq ? taxInvoiceUtils.formatDateToTimestamp(item.kjrq) : Math.floor(Date.now() / 1000),
          pzhjje: Number(item.pzhjje || 0),
          bckcje: Number(item.bckcje || 0),
          bz: item.bz || ''
        }));
      }
      return payload;
    },
    parseServiceResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.error : '';
      const data = payload && (payload.data !== undefined ? payload.data : {});
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        data
      };
    },
    submit() {
      const validationMessage = this.validateForm();
      if (validationMessage) {
        this.$toast ? this.$toast({ text: validationMessage }) : this.$message.warning(validationMessage);
        return;
      }
      this.recalcTotals();
      if (!this.form.taxInvoiceNo) {
        this.form.taxInvoiceNo = this.utils.UUID(32, 16);
      }
      if (!this.form.kprq) {
        // 如果没有开票日期，设置为当前日期时间
        this.form.kprq = taxInvoiceUtils.getCurrentDateTime();
      }
      this.saving = true;
      const payload = this.buildAddPayload();
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceAdd,
        payload,
        (res) => {
          this.saving = false;
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success) {
            // 根据 API 文档，返回 data 中包含 id, taxInvoiceNo, fphm, kprq, uploadStatus, message
            const invoiceId = data && data.id;
            const taxInvoiceNo = data && data.taxInvoiceNo;
            const fphm = data && data.fphm;
            const uploadStatus = data && data.uploadStatus;
            const resultMessage = data && data.message;
            if (invoiceId || taxInvoiceNo || fphm) {
              const info = [invoiceId && `ID: ${invoiceId}`, taxInvoiceNo && `税票号: ${taxInvoiceNo}`, fphm && `发票号码: ${fphm}`].filter(Boolean).join(', ');
              this.$message.success(`上传成功，${info}`);
            } else if (resultMessage) {
              this.$message.success(resultMessage);
            } else {
              this.$message.success('上传完成');
            }
            try {
              sessionStorage.removeItem('taxInvoice.formData');
            } catch (e) {
              console.error('清理表单数据失败:', e);
            }
            // 返回列表页
            this.$router.push({ name: 'taxInvoiceBlueList' });
          } else {
            this.$message.warning(message || '上传结果未知');
          }
        },
        () => {
          this.saving = false;
        },
        this
      );
    }
  }
};
</script>

<style scoped>
</style>


