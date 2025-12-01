<template>
  <div class="viewport-fixed">
    <crumbs-bar></crumbs-bar>
    <div
      class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
      v-if="!isViewMode"
    >
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="button" @click="submit">
          保存
        </button>
      </div>
    </div>
    <div
      class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
      v-if="isViewMode"
    >
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="button" @click="auditRow">
          审核
        </button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded">
          <h2>数电红字发票 - {{ pageTitle }}</h2>
          <!-- 基本信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>基础信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>销方单位:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfmc"
                          size="small"
                          class="full-width"
                          placeholder="请输入销方单位"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>蓝字发票号码:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.lzfphm"
                          size="small"
                          class="full-width"
                          placeholder="请输入蓝字发票号码"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>购货单位类型:</label
                      >
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.gmfzrrbz"
                          size="small"
                          class="full-width"
                          disabled
                          ><el-option label="自然人" value="0" /><el-option
                            label="组织"
                            value="1"
                        /></el-select>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>购货单位:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfmc"
                          size="small"
                          class="full-width"
                          placeholder="请输入购货单位"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>发票类型:</label
                      >
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.lzfppzDm"
                          size="small"
                          class="full-width"
                          disabled
                          ><el-option
                            label="增值税专用发票"
                            value="01" /><el-option
                            label="普通发票"
                            value="02" /><el-option
                            label="机动车统一销售发票"
                            value="03" /><el-option
                            label="二手车统一销售发票"
                            value="04"
                        /></el-select>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>开具红字发票原因:</label
                      >
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.chyyDm"
                          size="small"
                          class="full-width"
                          :disabled="isViewMode || isFromRedConfirm"
                          ><el-option label="开票有误" value="01" /><el-option
                            label="销货退回"
                            value="02" /><el-option
                            label="服务中止"
                            value="03" /><el-option label="销售折让" value="04"
                        /></el-select>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">特定要素:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.tdys"
                          size="small"
                          class="full-width"
                          placeholder="请输入特定要素"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
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
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>销售方税号:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfnsrsbh"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方纳税人识别号"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>销售方名称:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfmc"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方名称"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">地址:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfdz"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方地址"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">手机号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfdh"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方电话"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">销售方开户行:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfkhh"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方开户行"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">销售方账号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfzh"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方账号"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">差额征税类型:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.cezzslx"
                          size="small"
                          class="full-width"
                          placeholder="请输入差额征税类型"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
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
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>购买方名称:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfmc"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方名称"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">购买方税号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfnsrsbh"
                          size="small"
                          class="full-width"
                          placeholder="开具专票时必填"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">地址:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfdz"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方地址"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">手机号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfdh"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方电话"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">购买方开户行:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfkhh"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方开户行"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">购买方账号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfzh"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方账号"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
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
                  <el-table :data="form.fpmxList" border style="width: 100%">
                    <el-table-column
                      prop="xmmc"
                      label="项目名称"
                      min-width="140"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.xmmc }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="ggxh" label="规格型号" width="120"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.ggxh }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="dw" label="单位" width="90"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.dw }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="sl" label="数量" width="150"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.sl || 0 }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="dj" label="单价(含税)" width="150"
                      ><template slot-scope="{ row }"
                        ><span>{{
                          Number(row.dj || 0).toFixed(6)
                        }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="je" label="金额(含税)" width="150">
                      <template slot-scope="{ row }"
                        >¥{{ formatMoney(row.je) }}</template
                      >
                    </el-table-column>
                    <el-table-column
                      prop="slv"
                      label="增值税税率/征收率"
                      width="150"
                      ><template slot-scope="{ row }"
                        ><span>{{
                          Number(row.slv || 0).toFixed(4)
                        }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="se" label="税额" width="150"
                      ><template slot-scope="{ row }"
                        >¥{{ formatMoney(row.se) }}</template
                      ></el-table-column
                    >
                    <el-table-column prop="hsje" label="含税金额" width="150"
                      ><template slot-scope="{ row }"
                        >¥{{ formatMoney(row.hsje) }}</template
                      ></el-table-column
                    >
                    <el-table-column prop="kce" label="扣除额" width="150"
                      ><template slot-scope="{ row }"
                        ><span>{{
                          Number(row.kce || 0).toFixed(2)
                        }}</span></template
                      ></el-table-column
                    >
                    <el-table-column
                      prop="sphfwssflhbbm"
                      label="商品和服务税收分类合并编码"
                      min-width="220"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.sphfwssflhbbm }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="fphxz" label="发票行性质" width="130"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.fphxz }}</span></template
                      ></el-table-column
                    >
                    <el-table-column
                      prop="yhzcbs"
                      label="优惠政策标识"
                      width="140"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.yhzcbs || '-' }}</span></template
                      ></el-table-column
                    >
                  </el-table>
                  <div class="mt10 darkgray">
                    <p class="mt5">
                      合计金额： {{ formatMoney(form.hjjc) }}（元）
                    </p>
                    <p class="mt5">
                      合计税额： {{ formatMoney(form.hjs) }}（元）
                    </p>
                    <p class="mt5">
                      价税合计： {{ formatMoney(form.jshj) }}（元）
                    </p>
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
                      <label class="nowrap"
                        ><span class="red">*</span>开票日期:</label
                      >
                      <div class="flex-flex-auto">
                        <el-date-picker
                          v-model="form.kprq"
                          size="small"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          class="full-width"
                          placeholder="选择开票日期"
                          :disabled="isViewMode || isFromRedConfirm"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>开票人:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.kpr"
                          size="small"
                          class="full-width"
                          placeholder="请输入开票人"
                          :disabled="isViewMode || isFromRedConfirm"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">备注:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          type="textarea"
                          v-model="form.bz"
                          :rows="3"
                          size="small"
                          class="full-width"
                          placeholder="请输入备注"
                          :disabled="isViewMode || isFromRedConfirm"
                        />
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
  components: {
    crumbsBar: () => import('@/common-base/components/crumbs-bar')
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      saving: false,
      isViewMode: false,
      isFromRedConfirm: false, // 是否从红字确认单跳转过来
      form: {
        // 基础信息
        xsfmc: '',
        lzfphm: '',
        gmfzrrbz: '',
        gmfmc: '',
        lzfppzDm: '02',
        chyyDm: '01',
        tdys: '',
        // 销售方信息
        xsfnsrsbh: '',
        xsfdz: '',
        xsfdh: '',
        xsfkhh: '',
        xsfzh: '',
        cezzslx: '',
        // 购买方信息
        gmfnsrsbh: '',
        gmfdz: '',
        gmfdh: '',
        gmfkhh: '',
        gmfzh: '',
        // 明细与合计
        fpmxList: [],
        hjjc: 0, // 合计金额
        hjs: 0, // 合计税额
        jshj: 0, // 价税合计
        taxInvoiceNo: '',
        // 红字确认单相关信息
        hzqrxxdbh: '', // 红字确认信息单编号
        hzqrduuid: '', // 红字确认单UUID
        // 发票信息
        kprq: '', // 开票日期
        kpr: '', // 开票人
        // 其他信息
        bz: ''
      }
    };
  },
  mounted() {
    // 判断是否为查看模式
    this.isViewMode =
      this.$route && this.$route.query && this.$route.query.mode === 'view';
    const query = (this.$route && this.$route.query) || {};

    // 如果是红字发票查看，根据发票id查询发票详情
    if (this.isViewMode && query.id) {
      this.fetchInvoiceDetail(query.id);
      return;
    }

    // 如果从红字确认单跳转，查询红字确认单详情和蓝字发票详情
    const confirmId = query.confirmId;
    if (confirmId && !this.isViewMode) {
      this.fetchRedConfirmDetail(confirmId);
      return;
    }
  },
  computed: {
    pageTitle() {
      return this.isViewMode ? '查看' : '新增';
    }
  },
  methods: {
    // 查询红字确认单详情并回填到表单
    fetchRedConfirmDetail(confirmId) {
      if (!confirmId) return;
      this.isFromRedConfirm = true;
      this.API.send(
        this.CFG.services.kailing.queryRedConfirmDetail,
        { confirmId },
        (res) => {
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            const detail =
              Array.isArray(data.rows) && data.rows.length > 0
                ? data.rows[0]
                : data;
            this.applyRedConfirmDetailToForm(detail);

            const blueInvoiceId = detail.blueInvoiceId;
            if (blueInvoiceId) {
              this.fetchBlueInvoiceForRedConfirm(blueInvoiceId);
            }
          } else {
            this.$message.warning(message || '加载红字确认单详情失败');
          }
        },
        () => {
          this.$message.error('加载红字确认单详情失败，请重试');
        },
        this
      );
    },
    // 查询蓝字发票详情
    fetchBlueInvoiceForRedConfirm(blueInvoiceId) {
      const queryParam = { invoiceId: blueInvoiceId };
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceQuery,
        queryParam,
        (res) => {
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            const invoiceDetail =
              Array.isArray(data.rows) && data.rows.length > 0
                ? data.rows[0]
                : data;
            this.applyBlueInvoiceInfoToForm(invoiceDetail);
          } else {
            console.warn('查询蓝字发票详情失败:', message);
          }
        },
        () => {
          console.error('查询蓝字发票详情失败，请重试');
        },
        this
      );
    },
    applyBlueInvoiceInfoToForm(invoiceDetail = {}) {
      if (invoiceDetail.gmfzrrbz) this.form.gmfzrrbz = invoiceDetail.gmfzrrbz;
      // 销售方信息
      if (invoiceDetail.xsfnsrsbh)
        this.form.xsfnsrsbh = invoiceDetail.xsfnsrsbh;
      if (invoiceDetail.xsfmc) this.form.xsfmc = invoiceDetail.xsfmc;
      if (invoiceDetail.xsfdz) this.form.xsfdz = invoiceDetail.xsfdz;
      if (invoiceDetail.xsfdh) this.form.xsfdh = invoiceDetail.xsfdh;
      if (invoiceDetail.xsfkhh) this.form.xsfkhh = invoiceDetail.xsfkhh;
      if (invoiceDetail.xsfzh) this.form.xsfzh = invoiceDetail.xsfzh;
      if (invoiceDetail.cezzslx) this.form.cezzslx = invoiceDetail.cezzslx;

      // 购买方信息
      if (invoiceDetail.gmfnsrsbh)
        this.form.gmfnsrsbh = invoiceDetail.gmfnsrsbh;
      if (invoiceDetail.gmfmc) this.form.gmfmc = invoiceDetail.gmfmc;
      if (invoiceDetail.gmfdz) this.form.gmfdz = invoiceDetail.gmfdz;
      if (invoiceDetail.gmfdh) this.form.gmfdh = invoiceDetail.gmfdh;
      if (invoiceDetail.gmfkhh) this.form.gmfkhh = invoiceDetail.gmfkhh;
      if (invoiceDetail.gmfzh) this.form.gmfzh = invoiceDetail.gmfzh;

      if (invoiceDetail.kprq)
        this.form.kprq = taxInvoiceUtils.formatTimestampToDate(
          invoiceDetail.kprq
        );
      if (invoiceDetail.kpr) this.form.kpr = invoiceDetail.kpr;
      if (invoiceDetail.bz) this.form.bz = invoiceDetail.bz;
    },
    applyRedConfirmDetailToForm(detail = {}) {
      // 基础信息
      if (detail.lzfphm) this.form.lzfphm = detail.lzfphm;
      if (detail.lzfppzDm) this.form.lzfppzDm = detail.lzfppzDm;
      if (detail.chyyDm) this.form.chyyDm = detail.chyyDm;
      if (detail.tdys || detail.lzfpTdyslxDm)
        this.form.tdys = detail.tdys || detail.lzfpTdyslxDm || '';

      // 红字确认单相关信息
      if (detail.hzfpxxqrdbh) this.form.hzqrxxdbh = detail.hzfpxxqrdbh;
      if (detail.uuid) this.form.hzqrduuid = detail.uuid;

      // 明细列表
      const detailList = detail.detailList || [];
      if (detailList && detailList.length > 0) {
        this.form.fpmxList = detailList.map((item, index) => {
          const je = Number(item.je || 0);
          const se = Number(item.se || 0);
          const sl = Number(item.fpspsl || 0);
          const dj = Number(item.fpspdj || 0);
          const slv = Number(item.sl1 || 0);
          const hsje = je + se;
          return {
            mxxh: item.mxxh || index + 1,
            dylzfpmxxh: item.dylzfpmxxh || 0,
            xmmc: item.xmmc || '',
            spfwjc: item.spfwjc || '',
            ggxh: item.ggxh || '',
            dw: item.dw || '',
            sl: sl,
            dj: dj,
            je: je,
            slv: slv,
            se: se,
            hsje: hsje,
            kce: Number(item.kce || 0),
            sphfwssflhbbm: item.sphfwssflhbbm || '',
            fphxz: item.fphxz || '00',
            yhzcbs: item.yhzcbs || ''
          };
        });
        // 重新计算合计
        this.recalcTotals();
      } else {
        console.warn('红字确认单详情中未找到明细列表数据');
      }
    },
    fetchInvoiceDetail(invoiceId) {
      if (!invoiceId) {
        return;
      }
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
      if (detail.lzfphm) this.form.lzfphm = detail.lzfphm;
      if (detail.gmfmc) this.form.gmfmc = detail.gmfmc;
      if (detail.xsfmc) this.form.xsfmc = detail.xsfmc;
      if (detail.fppz || detail.lzfppzDm)
        this.form.lzfppzDm = detail.fppz || detail.lzfppzDm;
      if (detail.xsfnsrsbh) this.form.xsfnsrsbh = detail.xsfnsrsbh;
      if (detail.xsfdz) this.form.xsfdz = detail.xsfdz;
      if (detail.xsfdh) this.form.xsfdh = detail.xsfdh;
      if (detail.xsfkhh) this.form.xsfkhh = detail.xsfkhh;
      if (detail.xsfzh) this.form.xsfzh = detail.xsfzh;
      if (detail.gmfnsrsbh) this.form.gmfnsrsbh = detail.gmfnsrsbh;
      if (detail.gmfdz) this.form.gmfdz = detail.gmfdz;
      if (detail.gmfdh) this.form.gmfdh = detail.gmfdh;
      if (detail.gmfkhh) this.form.gmfkhh = detail.gmfkhh;
      if (detail.gmfzh) this.form.gmfzh = detail.gmfzh;
      if (detail.kprq)
        this.form.kprq = taxInvoiceUtils.formatTimestampToDate(detail.kprq);
      if (detail.kpr) this.form.kpr = detail.kpr;
      if (detail.bz) this.form.bz = detail.bz;
      if (detail.hjje !== undefined) this.form.hjjc = Number(detail.hjje);
      if (detail.hjse !== undefined) this.form.hjs = Number(detail.hjse);
      if (detail.jshj !== undefined) this.form.jshj = Number(detail.jshj);

      // 应用明细
      const details = Array.isArray(detail.fpmxList) ? detail.fpmxList : [];
      if (details.length) {
        this.form.fpmxList = details.map((item, index) => ({
          mxxh: item.mxxh || index + 1,
          dylzfpmxxh: item.dylzfpmxxh || 0,
          xmmc: item.xmmc || '',
          spfwjc: item.spfwjc || '',
          ggxh: item.ggxh || '',
          dw: item.dw || '',
          sl: Number(item.sl || 0),
          dj: Number(item.dj || 0),
          je: Number(item.je || 0),
          slv: Number(item.slv || 0),
          se: Number(item.se || 0),
          hsje: Number(item.hsje || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          fphxz: item.fphxz || '00',
          yhzcbs: item.yhzcbs || ''
        }));
        this.recalcTotals();
      }
    },
    toFixedNumber(val, digits = 2) {
      const n = Number(val);
      if (isNaN(n)) return 0;
      return Number(n.toFixed(digits));
    },
    formatMoney(val) {
      const n = this.toFixedNumber(val, 2);
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    validateForm() {
      if (!this.form.chyyDm || this.form.chyyDm === '') {
        return '请选择开具红字发票原因';
      }
      if (!this.form.kprq) {
        return '请选择开票日期';
      }
      if (!this.form.kpr) {
        return '请填写开票人';
      }
      if (!Array.isArray(this.form.fpmxList) || !this.form.fpmxList.length) {
        return '请添加至少一条开票明细';
      }
      return '';
    },
    buildAddPayload() {
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
          hsje: Number(item.hsje || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          fphxz: item.fphxz || '00',
          yhzcbs: item.yhzcbs || ''
        };
      });
      if (!this.form.taxInvoiceNo) {
        this.form.taxInvoiceNo = this.utils.UUID(32, 16);
      }
      const payload = {
        id: this.form.id || '',
        taxInvoiceNo: this.form.taxInvoiceNo || '',
        lzfpbz: '1', // 红字发票
        fppz: this.form.lzfppzDm || this.form.fppz || '02',
        gmfzrrbz: this.form.gmfzrrbz || '',
        tdys: this.form.tdys || '',
        cezslxDm: this.form.cezslxDm || '',
        sgfplxDm: this.form.sgfplxDm || '',
        ckywyszczDm: this.form.ckywyszczDm || '',
        zzsjzjtDm: this.form.zzsjzjtDm || '',
        xsfnsrsbh: this.form.xsfnsrsbh || '',
        xsfmc: this.form.xsfmc || '',
        xsfdz: this.form.xsfdz || '',
        xsfdh: this.form.xsfdh || '',
        xsfkhh: this.form.xsfkhh || '',
        xsfzh: this.form.xsfzh || '',
        gmfnsrsbh: this.form.gmfnsrsbh || '',
        gmfmc: this.form.gmfmc || '',
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
        kpr: this.form.kpr || '',
        kprzjhm: this.form.kprzjhm || '',
        kprzjlx: this.form.kprzjlx || '',
        kprq: this.form.kprq
          ? taxInvoiceUtils.formatDateToTimestamp(this.form.kprq)
          : Math.floor(Date.now() / 1000),
        dylzfphm: this.form.lzfphm || '',
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
        payload.fjysList = this.form.fjysList.map((item) => ({
          fjysmc: item.fjysmc || '',
          fjyslx: item.fjyslx || '',
          fjysz: item.fjysz || ''
        }));
      }
      if (Array.isArray(this.form.cekcList) && this.form.cekcList.length) {
        payload.cekcList = this.form.cekcList.map((item) => ({
          xh: item.xh || 0,
          pzlx: item.pzlx || '',
          fpdm: item.fpdm || '',
          fphm: item.fphm || '',
          cezphm: item.cezphm || '',
          kjrq: item.kjrq
            ? taxInvoiceUtils.formatDateToTimestamp(item.kjrq)
            : Math.floor(Date.now() / 1000),
          pzhjje: Number(item.pzhjje || 0),
          bckcje: Number(item.bckcje || 0),
          bz: item.bz || ''
        }));
      }
      return payload;
    },
    submit() {
      const validationMessage = this.validateForm();
      if (validationMessage) {
        this.$toast
          ? this.$toast({ text: validationMessage })
          : this.$message.warning(validationMessage);
        return;
      }
      this.recalcTotals();
      this.saving = true;
      const payload = this.buildAddPayload();
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceAdd,
        payload,
        (res) => {
          this.saving = false;
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success) {
            const invoiceId = data && data.id;
            const fphm = data && data.fphm;
            const resultMessage = data && data.message;
            if (invoiceId || fphm) {
              const info =fphm && `发票号码: ${fphm}`;
              this.$message.success(`保存成功，${info}`);
            } else if (resultMessage) {
              this.$message.success(resultMessage);
            } else {
              this.$message.success('保存成功');
            }
            this.$router.push({ name: 'taxInvoiceRedList' });
          } else {
            this.$message.warning(message);
          }
        },
        () => {
          this.saving = false;
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
      const data =
        (payload &&
          (payload.data || payload.result || payload.records || payload)) ||
        {};
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        data
      };
    },
    sendAuditRequest(svc, row, auditStatus, reviewRemark) {
      const payload = {
        invoiceId: row.id,
        reviewStatus: auditStatus,
        reviewRemark: reviewRemark || ''
      };
      this.saving = true;
      this.API.send(
        svc,
        payload,
        (res) => {
          this.saving = false;
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success('审核成功');
            this.$router.push({ name: 'taxInvoiceRedList' });
          } else {
            this.$message.warning(message);
          }
        },
        () => {
          this.saving = false;
        },
        this
      );
    },
    auditRow() {
      const invoiceId =
        this.$route && this.$route.query && this.$route.query.id;
      if (!invoiceId) {
        this.$message.warning('缺少发票ID，无法审核');
        return;
      }
      const row = { id: invoiceId };
      let inputValue = '';
      this.$prompt('请输入审核意见（可选）', '审核发票', {
        confirmButtonText: '审核通过',
        cancelButtonText: '审核退回',
        showCancelButton: true,
        distinguishCancelAndClose: true,
        inputType: 'textarea',
        inputPlaceholder: '请输入审核意见',
        closeOnClickModal: false,
        inputValidator: (value) => {
          inputValue = value || '';
          return true;
        }
      })
        .then(({ value }) => {
          // 审核通过：reviewStatus = '01'
          this.sendAuditRequest(
            this.CFG.services.kailing.digitalInvoiceAudit,
            row,
            '01',
            value || ''
          );
        })
        .catch((action) => {
          if (action === 'cancel') {
            // 审核退回：reviewStatus = '02'
            this.sendAuditRequest(
              this.CFG.services.kailing.digitalInvoiceAudit,
              row,
              '02',
              inputValue || ''
            );
          }
        });
    }
  }
};
</script>

<style scoped>
</style>


