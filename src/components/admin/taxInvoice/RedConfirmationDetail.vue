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
                        ><span class="red">*</span>冲红原因:</label
                      >
                      <div class="flex-flex-auto">
                        <el-select
                          v-model="form.chyyDm"
                          size="small"
                          class="full-width"
                          :disabled="readonly"
                          @change="onChyyDmChange"
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
                          :disabled="
                            readonly || isQuantityDisabled
                          " /></template
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
                          :disabled="readonly || isPriceDisabled" /></template
                    ></el-table-column>
                    <el-table-column prop="je" label="金额(含税)" width="150">
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-if="(isSalesDiscount || isServiceTermination) && !readonly"
                          v-model="row.je"
                          @change="onAmountChange(row)"
                          :precision="2"
                          :step="0.01"
                          :max="0"
                          :controls="false"
                          size="small"
                          class="full-width power-minw90"
                          placeholder="请输入折让金额（负数）"
                        />
                        <span v-else>¥{{ formatMoney(row.je) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="slv"
                      label="增值税税率/征收率"
                      width="150"
                    >
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.slv"
                          @change="onTaxRateChange(row)"
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
      originalBlueInvoice: null, // 保存蓝字发票原始数据，用于校验
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
    },
    isSalesDiscount() {
      // 当红冲原因为"销售折让"（04）时，返回true
      return this.form.chyyDm === '04';
    },
    isInvoiceError() {
      // 当红冲原因为"开票有误"（01）时，返回true
      return this.form.chyyDm === '01';
    },
    isGoodsReturn() {
      // 当红冲原因为"销货退回"（02）时，返回true
      return this.form.chyyDm === '02';
    },
    isServiceTermination() {
      // 当红冲原因为"服务中止"（03）时，返回true
      return this.form.chyyDm === '03';
    },
    // 是否禁用单价输入框
    isPriceDisabled() {
      // 销售折让：禁用
      // 开票有误：禁用（必须和蓝字发票一致）
      // 销货退回：禁用（不允许修改）
      // 服务中止：禁用（不允许修改）
      return (
        this.isSalesDiscount ||
        this.isInvoiceError ||
        this.isGoodsReturn ||
        this.isServiceTermination
      );
    },
    // 是否禁用数量输入框
    isQuantityDisabled() {
      // 销售折让：禁用
      // 开票有误：禁用（必须和蓝字发票一致）
      return this.isSalesDiscount || this.isInvoiceError;
    }
  },
  watch: {
    'form.chyyDm'(newVal, oldVal) {
      // 当选择"销售折让"时，清空所有明细行的单价和数量
      if (newVal === '04') {
        this.clearPriceAndQuantity();
      }
      // 当选择"开票有误"时，恢复蓝字发票的原始数据
      if (newVal === '01' && this.originalBlueInvoice) {
        this.restoreBlueInvoiceData();
      }
    }
  },
  mounted() {
    if (this.confirmId) {
      this.fetchDetail();
      return;
    }

    // 从蓝字发票查询带入数据
    const blueInvoiceId = this.$route.query.blueInvoiceId;
    if (blueInvoiceId) {
      this.form.blueInvoiceId = blueInvoiceId;
      this.fetchBlueInvoiceDetail(blueInvoiceId);
    }
    this.recalcTotals();
  },
  methods: {
    // 当红冲原因改变时的处理
    onChyyDmChange(value) {
      // 当选择"销售折让"时，清空所有明细行的单价和数量
      if (value === '04') {
        this.clearPriceAndQuantity();
      }
    },
    // 清空所有明细行的单价和数量
    clearPriceAndQuantity() {
      if (Array.isArray(this.form.fpmxList)) {
        this.form.fpmxList.forEach((row) => {
          this.$set(row, 'sl', null);
          this.$set(row, 'dj', null);
        });
        // 重新计算合计
        this.recalcTotals();
      }
    },
    // 当金额改变时的处理（用于"销售折让"场景）
    onAmountChange(row) {
      if (this.readonly || !this.isSalesDiscount) return;

      // 根据金额和税率重新计算税额和含税金额
      this.recalcRowFromAmount(row);
      // 重新计算合计
      this.recalcTotals();
    },
    // 当税率改变时的处理（用于"销售折让"场景）
    onTaxRateChange(row) {
      if (this.readonly) return;

      // 如果是"销售折让"，根据金额和税率重新计算税额和含税金额
      if (this.isSalesDiscount) {
        this.recalcRowFromAmount(row);
        this.recalcTotals();
      } else {
        // 其他场景使用原有的计算逻辑
        this.onRowChange(row);
      }
    },
    // 根据金额和税率重新计算税额和含税金额（用于"销售折让"场景）
    recalcRowFromAmount(row) {
      const BN = this.BigNumber;
      const je = BN(row.je || 0);
      const slv = BN(row.slv || 0);

      // 税额 = 金额 * 税率
      const se = je.multipliedBy(slv);
      row.se = Number(se);

      // 含税金额 = 金额 + 税额
      const hsje = je.plus(se);
      row.hsje = Number(hsje);
    },
    // 恢复蓝字发票原始数据（用于"开票有误"场景）
    restoreBlueInvoiceData() {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return;
      }
      const BN = this.BigNumber;
      const originalDetails = this.originalBlueInvoice.fpmxList;

      // 恢复每个明细行的单价、数量、金额
      this.form.fpmxList.forEach((row, index) => {
        const originalRow = originalDetails[index];
        if (originalRow) {
          // 恢复单价和数量（保持负数）
          this.$set(row, 'dj', Number(originalRow.dj || 0));
          this.$set(row, 'sl', Number(-(originalRow.sl || 0)));
          // 恢复金额、税额、含税金额（保持负数）
          const je = BN(originalRow.je || 0).negated();
          const se = BN(originalRow.se || 0).negated();
          const hsje = BN(originalRow.hsje || 0).negated();
          row.je = Number(je);
          row.se = Number(se);
          row.hsje = Number(hsje);
        }
      });
      // 重新计算合计
      this.recalcTotals();
    },
    // 获取蓝字发票完整详情
    fetchBlueInvoiceDetail(invoiceId) {
      if (!invoiceId) return;
      this.API.send(
        this.CFG.services.taxinvoice.digitalInvoiceQuery,
        { invoiceId },
        (res) => {
          if (res && res.data) {
            // 保存蓝字发票原始数据
            this.originalBlueInvoice = JSON.parse(JSON.stringify(res.data));
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

      // 根据不同的红冲原因进行校验和限制
      const validationError = this.validateRowChange(row);
      if (validationError) {
        this.$message.warning(validationError);
        // 恢复该行的原始值
        this.restoreRowValue(row);
        return;
      }

      this.recalcRow(row);
      this.recalcTotals();
    },
    // 校验行数据变更
    validateRowChange(row) {
      const chyyDm = this.form.chyyDm;

      // "开票有误"：单价、金额、数量必须和蓝字发票保持一致
      if (chyyDm === '01') {
        return this.validateInvoiceError(row);
      }

      // "销货退回"：只允许修改数量，不允许修改单价
      if (chyyDm === '02') {
        return this.validateGoodsReturn(row);
      }

      // "服务中止"：允许修改总金额和数量，不允许修改单价
      if (chyyDm === '03') {
        return this.validateServiceTermination(row);
      }

      // "销售折让"：单价、数量必须为空
      if (chyyDm === '04') {
        if (row.sl !== null && row.sl !== undefined && row.sl !== '') {
          return '当红冲原因为"销售折让"时，数量必须为空';
        }
        if (row.dj !== null && row.dj !== undefined && row.dj !== '') {
          return '当红冲原因为"销售折让"时，单价必须为空';
        }
      }

      return '';
    },
    // 校验"开票有误"场景
    validateInvoiceError(row) {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '';
      }

      // 找到对应的蓝字发票明细行
      const rowIndex = this.form.fpmxList.indexOf(row);
      const originalRow = this.originalBlueInvoice.fpmxList[rowIndex];

      if (!originalRow) {
        return '';
      }

      const BN = this.BigNumber;
      const originalSl = Math.abs(Number(originalRow.sl || 0));
      const originalDj = Number(originalRow.dj || 0);
      const originalJe = Math.abs(Number(originalRow.je || 0));

      const currentSl = Math.abs(Number(row.sl || 0));
      const currentDj = Number(row.dj || 0);
      const currentJe = Math.abs(Number(row.je || 0));

      // 校验数量必须一致（绝对值）
      if (Math.abs(currentSl - originalSl) > 0.0001) {
        return `"开票有误"时，数量必须和蓝字发票保持一致（蓝字发票数量：${originalSl}）`;
      }

      // 校验单价必须一致
      if (Math.abs(currentDj - originalDj) > 0.01) {
        return `"开票有误"时，单价必须和蓝字发票保持一致（蓝字发票单价：${originalDj}）`;
      }

      // 校验金额必须一致（绝对值）
      if (Math.abs(currentJe - originalJe) > 0.01) {
        return `"开票有误"时，金额必须和蓝字发票保持一致（蓝字发票金额：${originalJe}）`;
      }

      return '';
    },
    // 校验"销货退回"场景
    validateGoodsReturn(row) {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '';
      }

      const rowIndex = this.form.fpmxList.indexOf(row);
      const originalRow = this.originalBlueInvoice.fpmxList[rowIndex];

      if (!originalRow) {
        return '';
      }

      const originalDj = Number(originalRow.dj || 0);
      const currentDj = Number(row.dj || 0);

      // 不允许修改单价
      if (Math.abs(currentDj - originalDj) > 0.01) {
        return '"销货退回"时，不允许修改单价';
      }

      return '';
    },
    // 校验"服务中止"场景
    validateServiceTermination(row) {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '';
      }

      const rowIndex = this.form.fpmxList.indexOf(row);
      const originalRow = this.originalBlueInvoice.fpmxList[rowIndex];

      if (!originalRow) {
        return '';
      }

      const originalDj = Number(originalRow.dj || 0);
      const currentDj = Number(row.dj || 0);

      // 不允许修改单价
      if (Math.abs(currentDj - originalDj) > 0.01) {
        return '"服务中止"时，不允许修改单价';
      }

      return '';
    },
    // 恢复行的原始值
    restoreRowValue(row) {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return;
      }

      const rowIndex = this.form.fpmxList.indexOf(row);
      const originalRow = this.originalBlueInvoice.fpmxList[rowIndex];

      if (!originalRow) {
        return;
      }

      const BN = this.BigNumber;

      // 恢复单价和数量
      if (this.form.chyyDm === '01') {
        // "开票有误"：恢复原始值
        this.$set(row, 'dj', Number(originalRow.dj || 0));
        this.$set(row, 'sl', Number(-(originalRow.sl || 0)));
      } else if (this.form.chyyDm === '02' || this.form.chyyDm === '03') {
        // "销货退回"或"服务中止"：只恢复单价
        this.$set(row, 'dj', Number(originalRow.dj || 0));
      }

      // 重新计算金额、税额等
      this.recalcRow(row);
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
        this.CFG.services.taxinvoice.queryRedConfirmDetail,
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

      // 如果有蓝字发票ID，获取蓝字发票原始数据用于校验
      if (detail.blueInvoiceId) {
        this.fetchBlueInvoiceDetail(detail.blueInvoiceId);
      }
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
    // 校验"开票有误"场景：必须全额红冲，并且明细单价、金额、数量必须和蓝字发票保持一致
    validateFullRedInvoice() {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '无法获取蓝字发票原始数据，无法进行校验';
      }

      const BN = this.BigNumber;
      const originalDetails = this.originalBlueInvoice.fpmxList;

      // 检查是否全额红冲
      const originalTotalJe = originalDetails.reduce((sum, item) => {
        return sum.plus(BN(Math.abs(item.je || 0)));
      }, BN(0));

      const currentTotalJe = this.form.fpmxList.reduce((sum, item) => {
        return sum.plus(BN(Math.abs(item.je || 0)));
      }, BN(0));

      // 必须全额红冲（金额绝对值必须相等）
      if (Math.abs(Number(originalTotalJe) - Number(currentTotalJe)) > 0.01) {
        return `"开票有误"时必须全额红冲，蓝字发票合计金额：${originalTotalJe.toFixed(
          2
        )}，当前红冲金额：${currentTotalJe.toFixed(2)}`;
      }

      // 检查每条明细的单价、金额、数量是否一致
      for (let i = 0; i < this.form.fpmxList.length; i++) {
        const row = this.form.fpmxList[i];
        const originalRow = originalDetails[i];

        if (!originalRow) {
          continue;
        }

        const originalSl = Math.abs(Number(originalRow.sl || 0));
        const originalDj = Number(originalRow.dj || 0);
        const originalJe = Math.abs(Number(originalRow.je || 0));

        const currentSl = Math.abs(Number(row.sl || 0));
        const currentDj = Number(row.dj || 0);
        const currentJe = Math.abs(Number(row.je || 0));

        if (Math.abs(currentSl - originalSl) > 0.0001) {
          return `第${
            i + 1
          }行：数量必须和蓝字发票保持一致（蓝字发票：${originalSl}，当前：${currentSl}）`;
        }

        if (Math.abs(currentDj - originalDj) > 0.01) {
          return `第${
            i + 1
          }行：单价必须和蓝字发票保持一致（蓝字发票：${originalDj}，当前：${currentDj}）`;
        }

        if (Math.abs(currentJe - originalJe) > 0.01) {
          return `第${
            i + 1
          }行：金额必须和蓝字发票保持一致（蓝字发票：${originalJe}，当前：${currentJe}）`;
        }
      }

      // 农产品加计扣除的特殊校验逻辑
      // 根据蓝字发票的"增值税优惠用途标签"进行校验
      // 字段名可能是：zzsytytbq、zzsytytbqDm、zzsytytbqMc 等，需要根据实际接口返回确认
      const zzsytytbq =
        this.originalBlueInvoice.zzsytytbq ||
        this.originalBlueInvoice.zzsytytbqDm ||
        '';

      if (zzsytytbq) {
        // "待农产品全额加计扣除"或"已用于农产品全额加计扣除"：必须全额红冲
        if (
          zzsytytbq === '待农产品全额加计扣除' ||
          zzsytytbq === '已用于农产品全额加计扣除' ||
          zzsytytbq === '01' ||
          zzsytytbq === '02'
        ) {
          // 已经在上面校验了全额红冲，这里不需要额外校验
        }
        // "待农产品部分加计扣除"或"已用于农产品部分加计扣除"：需要校验红冲次数
        else if (
          zzsytytbq === '待农产品部分加计扣除' ||
          zzsytytbq === '已用于农产品部分加计扣除' ||
          zzsytytbq === '03' ||
          zzsytytbq === '04'
        ) {
          // TODO: 需要查询该蓝字发票已经开具的红字发票数量
          // 如果是第一次红冲：只能对未加计部分全额冲红或对这张蓝票全额红冲
          // 如果是第二次红冲：仅允许对剩余部分（即已加计部分）全额红冲
          // 这个逻辑需要后端提供接口查询已开具的红字发票，暂时跳过详细校验
        }
      }

      return '';
    },
    // 校验"销货退回"场景：不允许修改单价
    validateGoodsReturnAll() {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '';
      }

      const originalDetails = this.originalBlueInvoice.fpmxList;

      for (let i = 0; i < this.form.fpmxList.length; i++) {
        const row = this.form.fpmxList[i];
        const originalRow = originalDetails[i];

        if (!originalRow) {
          continue;
        }

        const originalDj = Number(originalRow.dj || 0);
        const currentDj = Number(row.dj || 0);

        if (Math.abs(currentDj - originalDj) > 0.01) {
          return `第${
            i + 1
          }行："销货退回"时不允许修改单价（蓝字发票单价：${originalDj}）`;
        }
      }

      return '';
    },
    // 校验"服务中止"场景：不允许修改单价
    validateServiceTerminationAll() {
      if (
        !this.originalBlueInvoice ||
        !Array.isArray(this.originalBlueInvoice.fpmxList)
      ) {
        return '';
      }

      const originalDetails = this.originalBlueInvoice.fpmxList;

      for (let i = 0; i < this.form.fpmxList.length; i++) {
        const row = this.form.fpmxList[i];
        const originalRow = originalDetails[i];

        if (!originalRow) {
          continue;
        }

        const originalDj = Number(originalRow.dj || 0);
        const currentDj = Number(row.dj || 0);

        if (Math.abs(currentDj - originalDj) > 0.01) {
          return `第${
            i + 1
          }行："服务中止"时不允许修改单价（蓝字发票单价：${originalDj}）`;
        }
      }

      return '';
    },
    validateForm() {
      console.log(this.form.fpmxList);
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

      // 当红冲原因为"开票有误"时，必须全额红冲，并且明细单价、金额、数量必须和蓝字发票保持一致
      if (this.form.chyyDm === '01') {
        const errorMsg = this.validateFullRedInvoice();
        if (errorMsg) {
          return errorMsg;
        }
      }

      // 当红冲原因为"销货退回"时，不允许修改单价
      if (this.form.chyyDm === '02') {
        const errorMsg = this.validateGoodsReturnAll();
        if (errorMsg) {
          return errorMsg;
        }
      }

      // 当红冲原因为"服务中止"时，不允许修改单价
      if (this.form.chyyDm === '03') {
        const errorMsg = this.validateServiceTerminationAll();
        if (errorMsg) {
          return errorMsg;
        }
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

        if (this.form.chyyDm === '04') {
          delete detailItem.fpspdj;
          delete detailItem.fpspsl;
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
        this.CFG.services.taxinvoice.addRedConfirm,
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



