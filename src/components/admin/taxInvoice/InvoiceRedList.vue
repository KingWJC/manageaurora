<template>
  <div>
    <div class="viewport-fixed">
      <div
        class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar"
      >
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
            <div
              class="search-bar flex flex-content-start flex-items-center flex-wrap"
            >
              <div class="search-bar-item">
                <el-input
                  v-model="search.fphm"
                  size="small"
                  placeholder="发票号码"
                  :maxlength="30"
                />
              </div>
              <div class="search-bar-item">
                <el-input
                  v-model="search.gmfmc"
                  size="small"
                  placeholder="购方名称"
                  :maxlength="50"
                />
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.status"
                  size="small"
                  placeholder="上传状态"
                  clearable
                >
                  <el-option label="未提交" value="00" />
                  <el-option label="开票中" value="01" />
                  <el-option label="成功" value="02" />
                  <el-option label="失败" value="03" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-date-picker
                  v-model="search.kprqRange"
                  type="daterange"
                  unlink-panels
                  size="small"
                  start-placeholder="开票日期起"
                  end-placeholder="开票日期止"
                  value-format="yyyy-MM-dd"
                />
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch"
                  >查询</el-button
                >
                <el-button size="small" type="primary" @click="reset"
                  >重置</el-button
                >
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <tableView
                v-loading="loading"
                :list="rows"
                :cols="tableCols"
              ></tableView>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="发票预览"
      center="true"
      :visible.sync="dialog.preview"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="1200px"
    >
      <div class="flex flex-content-start flex-items-center">
        <div class="invoice-info bg-white">
          <div class="invoice-info-header">
            <div class="fl invoice-info-header__type">
              <span class="pt20 inline-block darkgray"
                >发票预览仅作概览,以实际发票为准</span
              >
            </div>
            <div class="fl invoice-info-header__title">
              <span>数电票(增值税普通发票)</span>
            </div>
            <div class="fr invoice-info-header__content">
              <p>
                <label class="invoice-info__color">发票号码：</label>
                <span>{{ (previewData && previewData.fphm) || '-' }}</span>
              </p>
              <p>
                <label class="invoice-info__color">开票日期：</label>
                <span>{{ (previewData && previewData.kprq) || '-' }}</span>
              </p>
            </div>
          </div>
          <div class="invoice-info--body">
            <div class="clearfix invoice-main__header">
              <div class="fl">
                <div class="invoice-main__header__lab">
                  <span class="invoice-info__color invoice-main__header--label">
                    购买方信息
                  </span>
                </div>
                <div class="invoice-main__header--container">
                  <div class="invoice-main__header--content">
                    <p class="invoice-main__header--name">
                      <label
                        class="invoice-info__color invoice-main__header--content_label"
                        >名称：</label
                      >
                      <span>{{
                        (previewData && previewData.gmfmc) || '-'
                      }}</span>
                    </p>
                    <p>
                      <label class="invoice-info__color"
                        >统一社会信用代码/纳税人识别号：</label
                      >
                      <span>{{
                        (previewData && previewData.gmfnsrsbh) || '-'
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="fl">
                <div class="invoice-main__header__lab left-border">
                  <span class="invoice-info__color invoice-main__header--label">
                    销售方信息
                  </span>
                </div>
                <div class="invoice-main__header--container">
                  <div class="invoice-main__header--content">
                    <p class="invoice-main__header--name">
                      <label
                        class="invoice-info__color invoice-main__header--content_label"
                        >名称：</label
                      >
                      <span>{{
                        (previewData && previewData.xsfmc) || '-'
                      }}</span>
                    </p>
                    <p>
                      <label class="invoice-info__color"
                        >统一社会信用代码/纳税人识别号：</label
                      >
                      <span>{{
                        (previewData && previewData.xsfnsrsbh) || '-'
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="invoice-main__table">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>规格型号</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                    <th>税率/征收率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(mx, i) in (previewData && previewData.fpmxList) ||
                    []"
                    :key="i"
                  >
                    <td>{{ mx.xmmc || '-' }}</td>
                    <td>{{ mx.ggxh || '-' }}</td>
                    <td>{{ mx.dw || '-' }}</td>
                    <td>{{ mx.sl }}</td>
                    <td>{{ Number(mx.dj || 0).toFixed(8) }}</td>
                    <td>{{ Number(mx.je || 0).toFixed(2) }}</td>
                    <td>
                      {{
                        mx.slv != null
                          ? Number(mx.slv * 100).toFixed(0) + '%'
                          : '-'
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="invoice-total-row">
                <div class="fl ml20 mb20">合计</div>
                <div class="fr">
                  <span class="mr20"
                    >¥{{
                      Number((previewData && previewData.hjje) || 0).toFixed(2)
                    }}</span
                  >
                </div>
              </div>
              <div class="invoice-amount-row">
                <div class="fl">
                  <label class="invoice-info__color">价税合计（大写）</label>
                  <span class="ml10">{{
                    numberToChinese((previewData && previewData.jshj) || 0)
                  }}</span>
                </div>
                <div class="fr">
                  <label class="invoice-info__color">（小写）</label>
                  <span
                    >¥{{
                      Number((previewData && previewData.jshj) || 0).toFixed(2)
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="invoice-info--footer">
              <div class="invoice-info-footer--body remark-size">
                <div class="invoice-info-footer__lab">
                  <span
                    class="invoice-info__color invoice-info-footer--label invoice-info-footer--remark"
                    >备注</span
                  >
                </div>
                <div class="fl invoice-info-footer__remak--content remark-size">
                  <span>{{ (previewData && previewData.bz) || '' }}</span>
                </div>
              </div>
            </div>
          </div>
          <p class="invoice-info__people">
            <label class="invoice-info__color">开票人：</label>
            <span>{{ (previewData && previewData.kpr) || '-' }}</span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableView from '@/common-base/components/pubComponents/tableView';

export default {
  components: {
    tableView
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      loading: false,
      search: {
        fphm: '',
        gmfmc: '',
        status: '',
        kprqRange: []
      },
      rows: [],
      dialog: { preview: false },
      pager: { current: 1, size: 10, total: 0 },
      tableCols: [
        { label: '单据ID', id: 'id', width: '130' },
        { label: '发票号码', id: 'fphm', width: '130' },
        {
          label: '票种',
          id: 'fppz',
          width: '80',
          render: (row) => {
            return row.fppz === '01'
              ? '数电专'
              : row.fppz === '02'
              ? '数电普'
              : row.fppz || '-';
          }
        },
        { label: '对应蓝字发票号码', id: 'dylzfphm', width: '130' },
        { label: '红字确认信息单编号', id: 'hzqrxxdbh', width: '130' },
        { label: '销方名称', id: 'xsfmc', width: '150' },
        { label: '购方名称', id: 'gmfmc', width: '150' },
        {
          label: '合计金额',
          id: 'hjje',
          width: '120',
          render: (row) => {
            return '¥' + Number(row.hjje || 0).toFixed(2);
          }
        },
        {
          label: '合计税额',
          id: 'hjse',
          width: '120',
          render: (row) => {
            return '¥' + Number(row.hjse || 0).toFixed(2);
          }
        },
        {
          label: '价税合计',
          id: 'jshj',
          width: '120',
          render: (row) => {
            return '¥' + Number(row.jshj || 0).toFixed(2);
          }
        },
        { label: '开票人', id: 'kpr', width: '140' },
        {
          label: '开票日期',
          id: 'kprq',
          width: '140',
          render: (row) => {
            return this.formatDateTime(row.kprq);
          }
        },
        {
          label: '状态',
          id: 'taskStatus',
          width: '100',
          align: 'center',
          render: (row) => {
            return this.statusText(row.taskStatus);
          }
        },
        { label: '审核人', id: 'fhrxm', width: '140' },
        {
          label: '审核时间',
          id: 'reviewTime',
          width: '140',
          render: (row) => {
            return this.formatDateTime(row.reviewTime);
          }
        },
        {
          label: '审核状态',
          id: 'reviewStatus',
          width: '100',
          align: 'center',
          render: (row) => {
            return this.auditStatusText(row.reviewStatus);
          }
        },
        {
          label: '操作',
          width: '140',
          fixed: 'right',
          btns: [
            {
              name: '查看',
              click: (row) => {
                this.viewRow(row);
              }
            },
            {
              name: '预览',
              click: (row) => {
                this.previewRow(row);
              }
            },
            {
              name: '审核',
              click: (row) => {
                this.auditRow(row);
              },
              isDisabled: (row) => {
                return this.canVerify(row);
              },
              condition: () => {
                return this.permissions.names.verify;
              },
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  activated() {
    this.getData();
  },
  methods: {
    onSearch() {
      this.pager.current = 1;
      this.getData();
    },
    reset() {
      this.search = {
        fphm: '',
        gmfmc: '',
        status: '',
        kprqRange: []
      };
      this.pager.current = 1;
      this.getData();
    },
    onPage(p) {
      this.pager.current = p;
      this.getData();
    },
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1,
        rowCount: this.pager.size
      };
      const { fphm, status, gmfmc, kprqRange } = this.search;
      if (fphm) payload.fphm = fphm.trim();
      if (gmfmc) payload.gmfmc = gmfmc.trim();
      if (status) payload.taskStatus = status;
      if (Array.isArray(kprqRange) && kprqRange.length === 2) {
        payload.kprqStart = new Date(kprqRange[0] + 'T00:00:00').getTime();
        payload.kprqEnd = new Date(kprqRange[1] + 'T23:59:59').getTime();
      }
      // 只查询蓝字发票
      payload.lzfpbz = '1';
      return payload;
    },
    getData() {
      this.loading = true;
      const payload = this.buildQueryPayload();
      this.API.send(
        this.CFG.services.taxinvoice.digitalInvoiceList,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(
            res || {}
          );
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records || [];
          this.pager.total = total || this.rows.length;
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    viewRow(row) {
      this.$router.push({
        name: 'taxInvoiceRedDetail',
        query: { id: row.id || row.sllsh, mode: 'view' }
      });
    },
    previewRow(row) {
      if (!row || !row.id) {
        this.$message.warning('缺少发票ID，无法预览');
        return;
      }
      this.dialog.preview = true;
      this.loading = true;
      this.API.send(
        this.CFG.services.taxinvoice.digitalInvoiceQuery,
        { invoiceId: row.id },
        (res) => {
          this.loading = false;
          if (res && res.data) {
            const formattedData = { ...res.data };
            if (formattedData.kprq) {
              formattedData.kprq = this.utils.formatDate(
                formattedData.kprq,
                'yyyy-MM-dd'
              );
            }
            this.previewData = formattedData;
          } else if (message) {
            this.$message.warning(message || '获取发票详情失败');
          }
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    statusText(v) {
      if (v === '00') return '未提交';
      if (v === '01') return '开票中';
      if (v === '02') return '开票成功';
      if (v === '03') return '开票失败';
      return v || '';
    },
    auditStatusText(v) {
      if (v === '00') return '待审核';
      if (v === '01') return '审核通过';
      if (v === '02') return '审核退回';
      return v || '';
    },
    sendAuditRequest(svc, row, auditStatus, reviewRemark) {
      if (!row || !row.id) {
        this.$message.warning('缺少发票ID，无法审核');
        return;
      }
      const payload = {
        invoiceId: row.id,
        reviewer: this.CFG.userInfo.name,
        reviewStatus: auditStatus,
        reviewRemark: reviewRemark || ''
      };
      this.loading = true;
      this.API.send(
        svc,
        payload,
        (res) => {
          this.loading = false;
          if (res && res.data) {
            this.$message.success('审核成功');
            this.getData();
          } else {
            this.$message.warning('审核失败');
          }
        },
        () => {
          this.loading = false;
        },
        this
      );
    },
    auditRow(row) {
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
            this.CFG.services.taxinvoice.digitalInvoiceAudit,
            row,
            '01',
            value || ''
          );
        })
        .catch((action) => {
          if (action === 'cancel') {
            // 审核退回：reviewStatus = '02'
            this.sendAuditRequest(
              this.CFG.services.taxinvoice.digitalInvoiceAudit,
              row,
              '02',
              inputValue || ''
            );
          }
        });
    },
    canVerify(row) {
      // 只有状态为审核通过，不能再进行审核
      return row.reviewStatus === '01';
    },
    numberToChinese(num) {
      const digits = [
        '零',
        '壹',
        '贰',
        '叁',
        '肆',
        '伍',
        '陆',
        '柒',
        '捌',
        '玖'
      ];
      const units = ['', '拾', '佰', '仟'];
      const bigUnits = ['', '万', '亿'];

      if (num === 0) return '零元整';

      const integerPart = Math.floor(num);
      const decimalPart = Math.round((num - integerPart) * 100);

      let result = '';

      // 处理整数部分
      if (integerPart > 0) {
        const intStr = integerPart.toString();
        const len = intStr.length;
        let zeroFlag = false;

        for (let i = 0; i < len; i++) {
          const digit = parseInt(intStr[i]);
          const pos = len - i - 1;

          if (digit === 0) {
            if (!zeroFlag && pos % 4 !== 0) {
              result += '零';
              zeroFlag = true;
            }
          } else {
            result += digits[digit] + units[pos % 4];
            zeroFlag = false;
          }

          if (pos % 4 === 0 && pos > 0) {
            result += bigUnits[Math.floor(pos / 4)];
            zeroFlag = false;
          }
        }
        result += '元';
      } else {
        result = '零元';
      }

      // 处理小数部分
      if (decimalPart > 0) {
        const jiao = Math.floor(decimalPart / 10);
        const fen = decimalPart % 10;
        if (jiao > 0) result += digits[jiao] + '角';
        if (fen > 0) result += digits[fen] + '分';
      } else {
        result += '整';
      }

      // 添加圈码标记
      if (result.length > 2) {
        return '② ' + result;
      }
      return result;
    },
    parsePagedResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.error : '';
      let records = [];
      let total = 0;
      if (payload && payload.serviceResult) {
        records = payload.serviceResult.rows || [];
        total = payload.serviceResult.total || 0;
      }
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        records,
        total
      };
    },
    formatDateTime(value) {
      return this.utils.formatDate(value);
    }
  }
};
</script>


<style scoped>
.invoice-info {
  width: 1080px;
  margin: 0 auto;
  font-family: SimSun, STSong;
}

.bg-white {
  background-color: #fff;
}

.invoice-info-header {
  margin-bottom: 16px;
}
.invoice-info-header::after {
  content: '';
  display: block;
  clear: both;
}
.invoice-info-header__type {
  width: 374px;
  height: 88px;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.pt20 {
  padding-top: 20px;
}

.inline-block {
  display: inline-block;
}

.darkgray {
  color: #a9a9a9;
}

.invoice-info__color {
  color: #a15f3b;
}

.invoice-info-header__title {
  position: relative;
  height: 80px;
  min-width: 300px;
}

.invoice-info-header__title span {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  height: 30px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 4px double #a15f3b;
  -webkit-transform: translate(-50%, -50%) scale(2);
  transform: translate(-50%, -50%) scale(2);
  font-size: 14px;
  color: #a15f3b;
}

.invoice-info-header__content {
  color: #333;
}

.invoice-info--body {
  border: 2px solid #a15f3b;
  margin-top: 0;
}

.invoice-info__people {
  padding: 16px 0 0 40px;
}

.invoice-main__header {
  display: table;
  width: 100%;
  border-bottom: 2px solid #a15f3b;
}
.invoice-main__header > .fl {
  width: 50%;
  box-sizing: border-box;
}

.invoice-main__table {
  position: relative;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  min-height: 300px;
}
.invoice-table th,
.invoice-table td {
  border: #a15f3b;
  padding: 6px 8px;
  text-align: center;
}

.invoice-table td {
  vertical-align: top;
}
.invoice-total-row {
  border-left: #a15f3b;
  border-bottom: 2px solid #a15f3b;
  padding: 6px 12px;
  overflow: hidden;
}
.invoice-amount-row {
  border-left: #a15f3b;
  border-bottom: 2px solid #a15f3b;
  padding: 6px 12px;
  overflow: hidden;
}
.invoice-amount-row .ml10 {
  margin-left: 10px;
}
.invoice-total-row .mr20 {
  margin-right: 100px;
}

.invoice-info-footer--body {
  position: relative;
  display: table;
  width: 100%;
}

.invoice-info-footer .remark-size {
  height: 190px;
}

.invoice-main__header .left-border {
  border-left: 2px solid #a15f3b;
}

.invoice-main__header--label {
  display: table-caption;
  width: 16px;
  line-height: 18px;
  text-align: center;
}

.invoice-main__header__lab {
  display: table-cell;
  width: 32px;
  height: 100px;
  padding: 0 8px;
  vertical-align: middle;
  border-right: 2px solid #a15f3b;
}

.invoice-main__header--container {
  display: table-cell;
  color: #333;
  vertical-align: middle;
  width: 506px;
  height: 100px;
}

.invoice-main__header .left-border {
  border-left: 2px solid #a15f3b;
}

.invoice-main__header--content {
  width: 100%;
  max-height: 100px;
  padding: 0 12px;
  overflow-y: auto;
}

.invoice-main__header--label {
  display: table-caption;
  width: 16px;
  line-height: 18px;
  text-align: center;
}

.invoice-main__header--content_label {
  width: 45px;
  white-space: nowrap;
}

.invoice-main__header--name {
  min-height: 38px;
}

.invoice-info-footer--body {
  position: relative;
  display: table;
  width: 100%;
}

.invoice-info-footer .remark-size {
  height: 190px;
}

.invoice-info-footer__lab {
  width: 32px;
  height: 190px;
  display: table-cell;
  padding: 0 8px;
  vertical-align: middle;
  border-right: 2px solid #a15f3b;
}

.invoice-info-footer--label {
  display: table-caption;
  width: 16px;
  line-height: 18px;
  text-align: center;
}

.invoice-info-footer__remark--content {
  width: 1042px;
  padding: 16px;
  overflow-y: auto;
}
</style>


