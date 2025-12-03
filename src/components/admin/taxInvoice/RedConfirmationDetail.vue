<template>
  <div class="viewport-fixed">
    <crumbs-bar></crumbs-bar>
    <div
      class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
      v-if="!readonly"
    >
      <div class="flex flex-content-center">
        <button
          class="btn btn-primary btn-xl"
          type="button"
          @click="submit"
          :disabled="saving"
        >
          保存
        </button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded">
          <h2>
            {{
              readonly
                ? '红字确认单 - 查看'
                : isEditMode
                ? '销方红字确认单 - 编辑'
                : '销方红字确认单 - 新增'
            }}
          </h2>
          <!-- 基础信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>基础信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>销售方纳税人识别号:</label
                      >
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.xsfnsrsbh"
                          size="small"
                          class="full-width"
                          placeholder="请输入销售方纳税人识别号"
                          :disabled="readonly || true"
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
                          :disabled="readonly || true"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">购买方纳税人识别号:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.gmfnsrsbh"
                          size="small"
                          class="full-width"
                          placeholder="请输入购买方纳税人识别号"
                          :disabled="readonly || true"
                        />
                      </div>
                    </div>
                  </div>
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
                          :disabled="readonly || true"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"
                        ><span class="red">*</span>红字发票冲红原因代码:</label
                      >
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.chyyDm"
                          size="small"
                          class="full-width"
                          :disabled="readonly"
                        >
                          <el-option label="开票有误" value="01" />
                          <el-option label="销货退回" value="02" />
                          <el-option label="服务中止" value="03" />
                          <el-option label="销售折让" value="04" />
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 蓝字发票信息 -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header"><strong>蓝字发票信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票号码:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.lzfphm"
                          size="small"
                          class="full-width"
                          placeholder="请输入蓝字发票号码"
                          :disabled="readonly || true"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">发票标志:</label>
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.sfzzfpbz"
                          size="small"
                          class="full-width"
                          :disabled="readonly || true"
                        >
                          <el-option label="纸质发票" value="Y" />
                          <el-option label="电子发票" value="N" />
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票开票日期:</label>
                      <div class="flex-flex-auto">
                        <el-date-picker
                          v-model="form.lzkprq"
                          type="datetime"
                          size="small"
                          class="full-width"
                          placeholder="选择蓝字发票开票日期"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :disabled="readonly || true"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票合计金额:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.lzhjje"
                          size="small"
                          class="full-width"
                          placeholder="蓝字发票合计金额"
                          :disabled="readonly || true"
                        >
                          <template slot="prepend">¥</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票合计税额:</label>
                      <div class="flex-flex-auto">
                        <el-input
                          v-model="form.lzhjse"
                          size="small"
                          class="full-width"
                          placeholder="蓝字发票合计税额"
                          :disabled="readonly || true"
                        >
                          <template slot="prepend">¥</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票票种类型:</label>
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.lzfppzDm"
                          size="small"
                          class="full-width"
                          :disabled="readonly || true"
                        >
                          <el-option label="增值税专用发票" value="01" />
                          <el-option label="普通发票" value="02" />
                          <el-option label="机动车统一销售发票" value="03" />
                          <el-option label="二手车统一销售发票" value="04" />
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">蓝字发票特定要素类型:</label>
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.lzfpTdyslxDm"
                          size="small"
                          class="full-width"
                          :disabled="readonly || true"
                        >
                          <el-option label="成品油发票" value="01" />
                          <el-option label="稀土发票" value="02" />
                          <el-option label="建筑服务发票" value="03" />
                          <el-option label="货物运输服务发票" value="04" />
                          <el-option label="不动产销售服务发票" value="05" />
                          <el-option label="不动产租赁服务发票" value="06" />
                          <el-option label="代收车船税" value="07" />
                          <el-option label="通行费" value="08" />
                          <el-option label="旅客运输服务发票" value="09" />
                        </el-select>
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
                        ><el-input-number
                          v-model="row.sl"
                          @change="onRowChange(row)"
                          :max="0"
                          :step="-1"
                          size="small"
                          class="full-width power-minw90"
                          :disabled="readonly" /></template
                    ></el-table-column>
                    <el-table-column prop="dj" label="单价(含税)" width="150"
                      ><template slot-scope="{ row }"
                        ><el-input-number
                          v-model="row.dj"
                          @change="onRowChange(row)"
                          :precision="2"
                          :step="0.01"
                          :min="0"
                          size="small"
                          class="full-width power-minw90"
                          :disabled="readonly" /></template
                    ></el-table-column>
                    <el-table-column prop="je" label="金额(含税)" width="150">
                      <template slot-scope="{ row }"
                        >¥{{ formatMoney(row.je) }}</template
                      >
                    </el-table-column>
                    <el-table-column
                      prop="slv"
                      label="增值税税率/征收率"
                      width="150"
                    >
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.slv"
                          @change="onRowChange(row)"
                          :precision="4"
                          :step="0.01"
                          :min="0"
                          :max="1"
                          size="small"
                          class="full-width power-minw90"
                          :disabled="isViewMode"
                        />
                      </template>
                    </el-table-column>
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
                        ><el-input-number
                          v-model="row.kce"
                          :precision="2"
                          :step="0.01"
                          :min="0"
                          size="small"
                          class="full-width"
                          :disabled="readonly" /></template
                    ></el-table-column>
                    <el-table-column
                      prop="sphfwssflhbbm"
                      label="商品和服务税收分类合并编码"
                      min-width="220"
                      ><template slot-scope="{ row }"
                        ><span>{{ row.sphfwssflhbbm }}</span></template
                      ></el-table-column
                    >
                    <el-table-column prop="yhzcbs" label="优惠政策" width="180">
                      <template slot-scope="{ row }">
                        <el-select
                          v-if="!readonly"
                          v-model="row.yhzcbs"
                          @change="onPreferentialPolicyChange(row)"
                          size="small"
                          class="full-width"
                          :disabled="isViewMode"
                          clearable
                          placeholder="请选择"
                        >
                          <el-option label="简易征收" value="01"></el-option>
                          <el-option label="稀土产品" value="02"></el-option>
                          <el-option label="免税" value="03"></el-option>
                          <el-option label="不征税" value="04"></el-option>
                          <el-option label="先征后退" value="05"></el-option>
                          <el-option
                            label="100%先征后退"
                            value="06"
                          ></el-option>
                          <el-option label="50%先征后退" value="07"></el-option>
                          <el-option
                            label="按3%简易征收"
                            value="08"
                          ></el-option>
                          <el-option
                            label="按5%简易征收"
                            value="09"
                          ></el-option>
                          <el-option
                            label="按5%简易征收减按1.5%计征"
                            value="10"
                          ></el-option>
                          <el-option label="即征即退30%" value="11"></el-option>
                          <el-option label="即征即退50%" value="12"></el-option>
                          <el-option label="即征即退70%" value="13"></el-option>
                          <el-option
                            label="即征即退100%"
                            value="14"
                          ></el-option>
                          <el-option
                            label="超税负3%即征即退"
                            value="15"
                          ></el-option>
                          <el-option
                            label="超税负8%即征即退"
                            value="16"
                          ></el-option>
                          <el-option
                            label="超税负12%即征即退"
                            value="17"
                          ></el-option>
                          <el-option
                            label="超税负6%即征即退"
                            value="18"
                          ></el-option>
                        </el-select>
                        <span v-else>{{
                          getPreferentialPolicyText(row.yhzcbs)
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="80"
                      fixed="right"
                      v-if="!readonly"
                      ><template slot-scope="scope"
                        ><p>
                          <span
                            class="link"
                            @click="deleteDetailRow(scope.$index)"
                            >删除</span
                          >
                        </p></template
                      ></el-table-column
                    >
                  </el-table>
                  <div class="mt10 darkgray">
                    <p class="mt5">
                      合计金额： {{ formatMoney(form.hzcxje) }}（元）
                    </p>
                    <p class="mt5">
                      合计税额： {{ formatMoney(form.hzcxse) }}（元）
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
              <div class="card-header"><strong>其他信息</strong></div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
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
                          :disabled="readonly"
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
export default {
  components: {
    crumbsBar: () => import('@/common-base/components/crumbs-bar')
  },
  data() {
    return {
      saving: false,
      form: {
        id: '',
        uuid: '',
        taxpayerId: '',
        blueInvoiceId: '',
        hzfpxxqrdbh: '',
        lrfsf: '0',
        lrrq: '',
        xsfnsrsbh: '',
        xsfmc: '',
        gmfnsrsbh: '',
        gmfmc: '',
        lzfpdm: '',
        lzfphm: '',
        sfzzfpbz: 'N',
        lzkprq: '',
        lzhjje: '',
        lzhjse: '',
        lzfppzDm: '02',
        lzfpTdyslxDm: '',
        chyyDm: '01',
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
    const blueInvoiceId = this.$route.query.blueInvoiceId ;
    if (blueInvoiceId) {
      this.form.blueInvoiceId = blueInvoiceId;
      this.fetchBlueInvoiceDetail(blueInvoiceId);
    }
    this.recalcTotals();
  },
  methods: {
    // 获取蓝字发票完整详情
    fetchBlueInvoiceDetail(invoiceId) {
      if (!invoiceId) return;
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceQuery,
        { invoiceId },
        (res) => {
          if (res && res.data) {
            this.fillFormFromBlueInvoiceDetail(res.data);
          } else {
            this.$message.warning('获取蓝字发票详情失败');
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
      // 基础信息
      if (detail.gmfmc) this.$set(this.form, 'gmfmc', detail.gmfmc);
      if (detail.xsfmc) this.$set(this.form, 'xsfmc', detail.xsfmc);
      if (detail.xsfnsrsbh) this.form.xsfnsrsbh = detail.xsfnsrsbh;
      if (detail.gmfnsrsbh) this.form.gmfnsrsbh = detail.gmfnsrsbh;

      // 蓝字发票信息
      if (detail.fpdm) {
        this.$set(this.form, 'lzfpdm', detail.fpdm);
      }
      if (detail.fphm) {
        this.$set(this.form, 'lzfphm', detail.fphm);
      }
      if (detail.fppz) {
        this.form.lzfppzDm = detail.fppz;
      }
      if (detail.kprq) {
        this.form.lzkprq = this.formatDateTime(detail.kprq);
      }
      if (detail.hjje !== null && detail.hjje !== undefined) {
        this.form.lzhjje = String(detail.hjje);
      }
      if (detail.hjse !== null && detail.hjse !== undefined) {
        this.form.lzhjse = String(detail.hjse);
      }
      if (detail.tdyslxDm) {
        this.form.lzfpTdyslxDm = detail.tdyslxDm;
      }

      // 开票详细信息
      const details = Array.isArray(detail.fpmxList) ? detail.fpmxList : [];
      if (details.length > 0) {
        this.form.fpmxList = details.map((item, index) => {
          const BN = this.BigNumber;
          const je = BN(item.je || 0).negated();
          const se = BN(item.se || 0).negated();
          const hsje = BN(item.hsje || 0).negated();
          return {
            lzmxxh: item.mxxh || index + 1,
            xmmc: item.xmmc || '',
            ggxh: item.ggxh || '',
            dw: item.dw || '',
            sl: Number(-item.sl || 0),
            dj: Number(item.dj || 0),
            je: Number(je),
            slv: Number(item.slv || 0),
            se: Number(se),
            hsje: Number(hsje),
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
      const BN = this.BigNumber;
      const qty = BN(row.sl || 0);
      const price = BN(row.dj || 0);
      const rate = BN(row.slv || 0);
      // 金额 = 数量 * 单价
      const amount = qty.multipliedBy(price);
      // 税额 = 金额 * 税率
      const tax = amount.multipliedBy(rate);
      // 含税金额 = 金额 + 税额
      const amountWithTax = amount.plus(tax);
      row.je = amount;
      row.se = tax;
      row.hsje = amountWithTax;
    },
    // 合计计算
    recalcTotals() {
      const BN = this.BigNumber;
      let totalAmount = BN(0);
      let totalTax = BN(0);
      (this.form.fpmxList || []).forEach((item) => {
        const amt = BN(item.je || 0);
        const tax = BN(item.se || 0);
        totalAmount = totalAmount.plus(amt);
        totalTax = totalTax.plus(tax);
      });
      this.form.hzcxje = totalAmount;
      this.form.hzcxse = totalTax;
      // 价税合计 = 合计金额 + 合计税额
      const jshj = BN(this.form.hzcxje).plus(BN(this.form.hzcxse));
      this.form.jshj = jshj;
    },
    onPreferentialPolicyChange(row) {
      const yhzcbs = row.yhzcbs;
      let newSlv = 0.13;

      // 根据优惠政策限制税率
      if (yhzcbs === '03') {
        // 免税：税率为0
        newSlv = 0;
      } else if (yhzcbs === '04') {
        // 不征税：税率为0
        newSlv = 0;
      } else if (yhzcbs === '08') {
        // 按3%简易征收：税率限制为3%
        newSlv = 0.03;
      } else if (yhzcbs === '09') {
        // 按5%简易征收：税率限制为5%
        newSlv = 0.05;
      } else if (yhzcbs === '10') {
        // 按5%简易征收减按1.5%计征：税率限制为1.5%
        newSlv = 0.015;
      }

      this.$set(row, 'slv', newSlv);
      this.onRowChange(row);
    },
    onRowChange(row) {
      const BN = this.BigNumber;
      const sl = BN(row.sl || 0);
      const dj = BN(row.dj || 0);

      let slv = BN(0);
      if (row.slv !== null && row.slv !== undefined && row.slv !== '') {
        const slvNum = BN(row.slv);
        if (!slvNum.isNaN()) {
          slv = slvNum;
        }
      }
      // 使用 BigNumber 进行运算：金额 = 单价 * 数量
      const je = dj.multipliedBy(sl);
      // 税额 = 金额 * 税率
      const se = je.multipliedBy(slv);
      row.je = je;
      row.se = se;
      // 含税金额 = 金额 + 税额
      const hsje = BN(row.je).plus(BN(row.se));
      row.hsje = hsje;
      this.recalcTotals();
    },
    toFixedNumber(val, digits = 2) {
      const BN = this.BigNumber;
      const num = BN(val || 0);
      if (num.isNaN()) return 0;
      return Number(num.toFixed(digits));
    },
    formatMoney(val) {
      const n = this.toFixedNumber(val, 2);
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
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
          if (res && res.data) {
            const data = res.data;
            const detail =
              Array.isArray(data.rows) && data.rows.length > 0
                ? data.rows[0]
                : data;
            this.applyDetailToForm(detail);
          } else {
            this.$message.warning(message || '加载详情失败');
            this.$router.go(-1);
          }
        },
        () => {
          this.saving = false;
          this.$message.error('加载详情失败，请重试');
          this.$router.go(-1);
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

      // 基础信息
      this.form.id = detail.id;
      this.form.uuid = detail.uuid || '';
      this.form.taxpayerId = detail.taxpayerId || '';
      this.form.blueInvoiceId = detail.blueInvoiceId || '';
      this.form.hzfpxxqrdbh = detail.hzfpxxqrdbh || '';
      this.form.lrfsf = detail.lrfsf || '';
      this.form.lrrq = this.formatDateTime(detail.lrrq);
      this.form.xsfnsrsbh = detail.xsfnsrsbh || '';
      this.form.xsfmc = detail.xsfmc || '';
      this.form.gmfnsrsbh = detail.gmfnsrsbh || '';
      this.form.gmfmc = detail.gmfmc || '';

      // 蓝字发票信息
      this.form.lzfpdm = detail.lzfpdm || '';
      this.form.lzfphm = detail.lzfphm || '';
      this.form.sfzzfpbz = detail.sfzzfpbz || '';
      this.form.lzkprq = this.formatDateTime(detail.lzkprq);
      this.form.lzhjje =
        detail.lzhjje !== null && detail.lzhjje !== undefined
          ? String(detail.lzhjje)
          : '';
      this.form.lzhjse =
        detail.lzhjse !== null && detail.lzhjse !== undefined
          ? String(detail.lzhjse)
          : '';
      this.form.lzfppzDm = detail.lzfppzDm || '02';
      this.form.lzfpTdyslxDm = detail.lzfpTdyslxDm || '';
      this.form.chyyDm = detail.chyyDm || '01';

      // 开票详情信息
      this.form.fpmxList = detailList;
      const BN = this.BigNumber;
      this.form.hzcxje = Number(BN(detail.hzcxje || 0));
      this.form.hzcxse = Number(BN(detail.hzcxse || 0));
      // 价税合计 = 合计金额 + 合计税额
      const jshj = BN(this.form.hzcxje).plus(BN(this.form.hzcxse));
      this.form.jshj = Number(jshj);
      this.form.bz = detail.remark || detail.bz || '';
      this.recalcTotals();
    },
    formatDateTime(dateTime) {
      return this.utils.formatDate(dateTime);
    },
    validateForm() {
      if (!this.form.chyyDm || this.form.chyyDm === '') {
        return '请选择开具红字发票原因';
      }
      if (!this.form.blueInvoiceId && !this.form.lzfphm) {
        return '请选择蓝字发票';
      }
      if (
        !Array.isArray(this.form.fpmxList) ||
        this.form.fpmxList.length === 0
      ) {
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
          fpspsl: String(item.sl || 0),
          je: Number(item.je || 0),
          sl1: Number(item.slv || 0),
          se: Number(item.se || 0),
          yhzcbs: item.yhzcbs || ''
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
      // 防暴击：如果正在保存，直接返回
      if (this.saving) {
        return;
      }

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
          if (res && res.data) {
            this.$message.success(this.isEditMode ? '更新成功' : '保存成功');
            this.$router.go(-2);
          } else {
            this.$message.warning('保存失败');
          }
        },
        () => {
          this.saving = false;
          this.$message.error('保存失败，请重试');
        },
        this
      );
    },
    // 将优惠政策标识代码转换为描述
    getPreferentialPolicyText(code) {
      if (!code) {
        return '-';
      }
      const policyMap = {
        '01': '简易征收',
        '02': '稀土产品',
        '03': '免税',
        '04': '不征税',
        '05': '先征后退',
        '06': '100%先征后退',
        '07': '50%先征后退',
        '08': '按3%简易征收',
        '09': '按5%简易征收',
        10: '按5%简易征收减按1.5%计征',
        11: '即征即退30%',
        12: '即征即退50%',
        13: '即征即退70%',
        14: '即征即退100%',
        15: '超税负3%即征即退',
        16: '超税负8%即征即退',
        17: '超税负12%即征即退',
        18: '超税负6%即征即退'
      };
      return policyMap[code] || code;
    }
  }
};
</script>

<style scoped>
</style>



