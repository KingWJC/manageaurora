<template>
  <div>
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
              <div class="search-bar-item">
                <el-input v-model="search.fphm" size="small" placeholder="发票号码" :maxlength="30" />
              </div>
              <div class="search-bar-item">
                <el-select v-model="search.status" size="small" placeholder="状态" clearable>
                  <el-option label="未提交" value="00" />
                  <el-option label="开票中" value="01" />
                  <el-option label="成功" value="02" />
                  <el-option label="失败" value="03" />
                </el-select>
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch">查询</el-button>
                <el-button size="small" type="primary" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="toCreate">新增</el-button>
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table :data="rows" v-loading="loading" style="width:100%" border>
                <el-table-column prop="sllsh" label="单据ID" min-width="130"></el-table-column>
                <el-table-column prop="fphm" label="发票号码" min-width="130"></el-table-column>
                <el-table-column prop="fppz" label="票种" min-width="80">
                  <template slot-scope="scope">
                    {{ scope.row.fppz === '01' ? '数电专' : scope.row.fppz === '02' ? '数电普' : scope.row.fppz }}
                  </template>
                </el-table-column>
                <el-table-column prop="xsfmc" label="销方名称" min-width="150"></el-table-column>
                <el-table-column prop="gmfmc" label="购方名称" min-width="150"></el-table-column>
                <el-table-column prop="hjje" label="合计金额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.hjje || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="hjse" label="合计税额" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.hjse || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="jshj" label="价税合计" min-width="120">
                  <template slot-scope="scope">¥{{ (scope.row.jshj || 0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="kpr" label="开票人" min-width="140"></el-table-column>
                <el-table-column prop="kprq" label="开票日期" min-width="140"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ statusText(scope.row.status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="zdr" label="制单人" min-width="140"></el-table-column>
                <el-table-column prop="zdrq" label="申请日期" min-width="140"></el-table-column>
                <el-table-column prop="shr" label="审核人" min-width="140"></el-table-column>
                <el-table-column prop="shrq" label="审核时间" min-width="140"></el-table-column>
                <el-table-column prop="shstatus" label="审核状态" min-width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ auditStatusText(scope.row.shstatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100" fixed="right">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="viewRow(scope.row)">查看</span>
                      <span class="link ml10" @click="editRow(scope.row)">编辑</span>
                    </p>
                    <p>
                      <span class="link" @click="previewRow(scope.row)">预览</span>
                      <span class="link ml10" @click="auditRow(scope.row)">审核</span>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="发票预览" center="true" :visible.sync="dialog.preview" :close-on-click-modal="false" :append-to-body="true" width="1200px">
      <div class="flex flex-content-start flex-items-center">
        <div class="invoice-info bg-white">
          <div class="invoice-info-header">
            <div class="fl invoice-info-header__type">
              <span class="pt20 inline-block darkgray">发票预览仅作概览,以实际发票为准</span>
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
                  <span class="invoice-info__color invoice-main__header--label"> 购买方信息 </span>
                </div>
                <div class="invoice-main__header--container">
                  <div class="invoice-main__header--content">
                    <p class="invoice-main__header--name">
                      <label class="invoice-info__color invoice-main__header--content_label">名称：</label>
                      <span>{{ (previewData && previewData.gmfmc) || '-' }}</span>
                    </p>
                    <p>
                      <label class="invoice-info__color">统一社会信用代码/纳税人识别号：</label>
                      <span>{{ (previewData && previewData.gmfnrsbh) || '-' }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="fl">
                <div class="invoice-main__header__lab left-border">
                  <span class="invoice-info__color invoice-main__header--label"> 销售方信息 </span>
                </div>
                <div class="invoice-main__header--container">
                  <div class="invoice-main__header--content">
                    <p class="invoice-main__header--name">
                      <label class="invoice-info__color invoice-main__header--content_label">名称：</label>
                      <span>{{ (previewData && previewData.xsfmc) || '-' }}</span>
                    </p>
                    <p>
                      <label class="invoice-info__color">统一社会信用代码/纳税人识别号：</label>
                      <span>{{ (previewData && previewData.xsfnsrsbh) || '-' }}</span>
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
                  <tr v-for="(mx, i) in (previewData && previewData.fpmxList) || []" :key="i">
                    <td>{{ mx.xmmc || '-' }}</td>
                    <td>{{ mx.ggxh || '-' }}</td>
                    <td>{{ mx.dw || '-' }}</td>
                    <td>{{ mx.sl }}</td>
                    <td>{{ (mx.dj || 0).toFixed(8) }}</td>
                    <td>{{ (mx.je || 0).toFixed(2) }}</td>
                    <td>{{ mx.slv != null ? (mx.slv * 100).toFixed(0) + '%' : '-' }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="invoice-total-row">
                <div class="fl ml20 mb20">合计</div>
                <div class="fr">
                  <span class="mr20">¥{{ ((previewData && previewData.hjje) || 0).toFixed(2) }}</span>
                </div>
              </div>
              <div class="invoice-amount-row">
                <div class="fl">
                  <label class="invoice-info__color">价税合计（大写）</label>
                  <span class="ml10">{{ numberToChinese(((previewData && previewData.jshj) || 0)) }}</span>
                </div>
                <div class="fr">
                  <label class="invoice-info__color">（小写）</label>
                  <span>¥{{ ((previewData && previewData.jshj) || 0).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div class="invoice-info--footer">
              <div class="invoice-info-footer--body remark-size">
                <div class="invoice-info-footer__lab">
                  <span class="invoice-info__color invoice-info-footer--label invoice-info-footer--remark">备注</span>
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
export default {
  props: { permissions: Object, params: Object },
  data() {
    return { 
      loading: false, 
      search: { fphm: '', status: '' }, 
      rows: [], 
      pager: { current: 1, size: 10, total: 0 }, 
      dialog: { preview: false },
      previewData: null
    };
  },
  mounted() { this.getData(); },
  methods: {
    onSearch() { this.pager.current = 1; this.getData(); },
    reset() { this.search = { fphm: '', status: '' }; this.pager.current = 1; this.getData(); },
    onPage(p) { this.pager.current = p; this.getData(); },
    toCreate() { this.$router.push({ name: 'taxInvoiceBlueDetail' }); },
    statusText(v) {
      if (v === '00') return '未提交';
      if (v === '01') return '开票中';
      if (v === '02') return '成功';
      if (v === '03') return '失败';
      return v || '';
    },
    auditStatusText(v) {
      if (v === '00') return '待审核';
      if (v === '01') return '审核中';
      if (v === '02') return '审核通过';
      if (v === '03') return '审核拒绝';
      return v || '';
    },
    viewRow(row) { this.$router.push({ name: 'taxInvoiceBlueDetail', query: { id: row.sllsh, mode: 'view' } }); },
    editRow(row) { this.$router.push({ name: 'taxInvoiceBlueDetail', query: { id: row.sllsh, mode: 'edit' } }); },
    previewRow(row) {
      // 模拟获取发票详情数据（包括明细）
      this.previewData = {
        ...row,
        fphm: row.fphm || '',
        fplxDm: row.fppz === '01' ? '增值税专用发票' : row.fppz === '02' ? '增值税普通发票' : '增值税普通发票',
        kprq: row.kprq || this.utils.formatDate(new Date().getTime()),
        xsfnsrsbh: row.xsfnsrsbh || '',
        gmfnrsbh: row.gmfnrsbh || '',
        fpmxList: [
          {
            xmmc: '*化学药品制剂*甲硝唑氯己定洗剂',
            ggxh: '50毫升/瓶*5瓶/盒*60盒',
            dw: '盒',
            sl: 1,
            dj: 53.09734513,
            je: 53.09,
            slv: 0.13,
            se: 6.90
          }
        ],
        bz: '',
        kpr: row.kpr || '史海影'
      };
      this.dialog.preview = true;
    },
    auditRow(row) {
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.auditBluelqadapter;
      if (!svc) { this.$message.success('审核成功（Mock）'); return; }
      const demand = { sllsh: row.sllsh, fphm: row.fphm };
      this.API.send(
        svc,
        demand,
        (res) => {
          const { success, message } = this.parsePagedResult(res || {});
          if (success) {
            this.$message.success('审核成功');
            this.getData();
          } else {
            this.$message.warning(message || '审核结果未知');
          }
        },
        () => { this.$message.success('审核成功（Mock）'); },
        this
      );
    },
    getData() {
      this.loading = true;
      if (process.env.VUE_APP_USE_MOCK !== 'false') { this.useMock(); return; }
      const demand = { ...this.search, current: this.pager.current, size: this.pager.size };
      const svc = this.CFG && this.CFG.services && this.CFG.services.kailing && this.CFG.services.kailing.pagelqadapterUploads;
      if (!svc) { this.useMock(); return; }
      this.API.send(
        svc,
        demand,
        (res) => {
          this.loading = false;
          const { success, message, records, total } = this.parsePagedResult(res || {});
          if (!success && message) {
            this.$message.warning(message);
          }
          this.rows = records.map(item => this.normalizeRow(item));
          this.pager.total = total || this.rows.length;
        },
        () => { this.useMock(); },
        this
      );
    },
    useMock() {
      this.loading = false;
      const now = this.utils.formatDate(new Date().getTime());
      this.rows = [
        { 
          sllsh: 'SSL0001', fphm: '25362000000074741457', lzfpbz: '0', fppz: '02', kprq: now, 
          xsfnsrsbh: '91360782MA35HKRR7A', xsfmc: '朗致集团江西医药有限公司', 
          gmfnrsbh: '91530926772695105E', gmfmc: '云南东昌一生堂药业有限公司', 
          hjje: 53.10, hjse: 6.90, jshj: 60.00, status: '02', kpr: '史海影', shstatus: '02'
        },
        { 
          sllsh: 'SSL0002', fphm: '00000002', lzfpbz: '1', fppz: '01', kprq: now, 
          xsfnsrsbh: '9133X1X1X2', xsfmc: '销方B', 
          gmfnrsbh: '9133Y2Y2Y3', gmfmc: '购方B', 
          hjje: 200, hjse: 18, jshj: 218, status: '00', kpr: '开票人B', shstatus: '00'
        }
      ];
      this.rows = this.rows.map(item => this.normalizeRow(item));
      this.pager.total = this.rows.length;
    },
    parsePagedResult(payload = {}) {
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.errorMsg : '';
      let records = [];
      let total = 0;
      if (Array.isArray(payload.data)) {
        records = payload.data;
        total = payload.total || payload.count || payload.data.length || 0;
      } else if (Array.isArray(payload.records)) {
        records = payload.records;
        total = payload.total || payload.count || payload.records.length || 0;
      } else if (Array.isArray(payload.list)) {
        records = payload.list;
        total = payload.total || payload.count || payload.list.length || 0;
      }
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        records,
        total
      };
    },
    formatDateTime(value) {
      if (!value) {
        return '-';
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    },
    normalizeRow(row = {}) {
      return {
        ...row,
        kprq: this.formatDateTime(row.kprq),
        zdrq: this.formatDateTime(row.zdrq),
        shrq: this.formatDateTime(row.shrq)
      };
    },
    numberToChinese(num) {
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
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
      
      // 添加圈码标记（简化处理，使用②）
      if (result.length > 2) {
        return '② ' + result;
      }
      return result;
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
.invoice-info-header::after { content: ''; display: block; clear: both; }
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
.invoice-main__header > .fl { width: 50%; box-sizing: border-box; }

.invoice-main__table {
    position: relative;
}

.invoice-table { width: 100%; border-collapse: collapse; min-height: 300px; }
.invoice-table th, .invoice-table td { border: #a15f3b; padding: 6px 8px; text-align: center; }
/* 让项目信息行内内容靠上显示 */
.invoice-table td { vertical-align: top; }
.invoice-total-row { border-left: #a15f3b; border-bottom: 2px solid #a15f3b; padding: 6px 12px; overflow: hidden; }
.invoice-amount-row { border-left: #a15f3b; border-bottom: 2px solid #a15f3b; padding: 6px 12px; overflow: hidden; }
.invoice-amount-row .ml10 { margin-left: 10px; }
.invoice-total-row .mr20 { margin-right: 100px; }

.invoice-info-footer--body {
    position: relative;
    display: table;
    width: 100%
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