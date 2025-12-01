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
                  v-model="search.downloadLsh"
                  size="small"
                  placeholder="下载流水号"
                  :maxlength="50"
                />
              </div>
              <div class="search-bar-item">
                <el-input
                  v-model="search.nsrsbh"
                  size="small"
                  placeholder="纳税人识别号"
                  :maxlength="20"
                />
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.downloadType"
                  size="small"
                  placeholder="下载类型"
                  clearable
                >
                  <el-option label="批量下载" value="batch" />
                  <el-option label="单张下载" value="single" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.fplx"
                  size="small"
                  placeholder="发票类型"
                  clearable
                >
                  <el-option label="增值税专用发票" value="01" />
                  <el-option label="货物运输业增值税专用发票" value="02" />
                  <el-option label="机动车销售统一发票" value="03" />
                  <el-option label="增值税普通发票" value="04" />
                  <el-option label="增值税电子专用发票" value="08" />
                  <el-option label="增值税电子普通发票" value="10" />
                  <el-option label="卷式发票" value="11" />
                  <el-option label="通行费发票" value="14" />
                  <el-option label="二手车销售统一发票" value="15" />
                  <el-option label="电子发票(增值税专用发票)" value="81" />
                  <el-option label="电子发票(普通发票)" value="82" />
                  <el-option label="纸质发票(增值税专用发票)" value="85" />
                  <el-option label="纸质发票(普通发票)" value="86" />
                  <el-option label="电子发票(铁路电子客票)" value="51" />
                  <el-option label="电子发票(航空运输客票电子行程单)" value="61" />
                  <el-option label="机动车销售电子统一发票" value="83" />
                  <el-option label="二手车销售电子统一发票" value="84" />
                  <el-option label="纸质发票(机动车销售统一发票)" value="87" />
                  <el-option label="纸质发票(二手车销售统一发票)" value="88" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.sjlx"
                  size="small"
                  placeholder="数据类型"
                  clearable
                >
                  <el-option label="进项票" value="1" />
                  <el-option label="销项票" value="2" />
                  <el-option label="自然人推送" value="3" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.taskStatus"
                  size="small"
                  placeholder="任务状态"
                  clearable
                >
                  <el-option label="待处理" value="00" />
                  <el-option label="处理中" value="01" />
                  <el-option label="成功" value="02" />
                  <el-option label="失败" value="03" />
                </el-select>
              </div>
              <div class="search-bar-item">
                <el-select
                  v-model="search.cljg"
                  size="small"
                  placeholder="处理结果"
                  clearable
                >
                  <el-option label="成功" value="success" />
                  <el-option label="失败" value="fail" />
                </el-select>
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="onSearch"
                  >查询</el-button
                >
                <el-button size="small" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="openApply"
                  >申请下载</el-button
                >
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <el-table
                :data="rows"
                v-loading="loading"
                style="width: 100%"
                border
              >
                <el-table-column
                  prop="downloadLsh"
                  label="下载流水号"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  prop="nsrsbh"
                  label="纳税人识别号"
                  min-width="150"
                ></el-table-column>
                <el-table-column prop="fplx" label="发票类型" min-width="120">
                  <template slot-scope="scope">
                    {{ fplxText(scope.row.fplx) }}
                  </template>
                </el-table-column>
                <el-table-column prop="sjlx" label="数据类型" min-width="100">
                  <template slot-scope="scope">
                    {{ sjlxText(scope.row.sjlx) }}
                  </template>
                </el-table-column>
                <el-table-column label="开票日期范围" min-width="200">
                  <template slot-scope="scope">
                    {{ scope.row.kprqq }} ~ {{ scope.row.kprqz }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="processedPackages"
                  label="已处理包数"
                  min-width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="totalPackages"
                  label="总包数"
                  min-width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="processedCount"
                  label="已处理数量"
                  min-width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="invoiceCount"
                  label="发票数量"
                  min-width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="taskStatus"
                  label="任务状态"
                  min-width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ dlStatusText(scope.row.taskStatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cljg"
                  label="处理结果"
                  min-width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ cljgText(scope.row.cljg) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="executeTime"
                  label="执行时间"
                  min-width="160"
                >
                  <template slot-scope="scope">
                    {{ formatDateTime(scope.row.executeTime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="completeTime"
                  label="完成时间"
                  min-width="160"
                >
                  <template slot-scope="scope">
                    {{ formatDateTime(scope.row.completeTime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="retryCount"
                  label="重试次数"
                  min-width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="errorMessage"
                  label="错误信息"
                  min-width="200"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 申请下载 弹窗 -->
          <el-dialog
            title="申请下载发票"
            :visible.sync="dialog.apply"
            :close-on-click-modal="false"
            :append-to-body="true"
            width="520px"
          >
            <div class="panel-content-padded">
              <div class="lc-row lc-space16">
                <div class="lc-col-12">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"
                      ><span class="red">*</span>纳税人识别号:</label
                    >
                    <div class="flex-flex-auto">
                      <el-input
                        v-model="apply.nsrsbh"
                        size="small"
                        class="full-width"
                        placeholder="统一社会信用代码/纳税人识别号"
                      />
                    </div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"
                      ><span class="red">*</span>开票日期起:</label
                    >
                    <div class="flex-flex-auto">
                      <el-date-picker
                        v-model="apply.kprqq"
                        type="date"
                        size="small"
                        value-format="yyyy-MM-dd"
                        class="full-width"
                        placeholder="选择日期"
                      />
                    </div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"
                      ><span class="red">*</span>开票日期止:</label
                    >
                    <div class="flex-flex-auto">
                      <el-date-picker
                        v-model="apply.kprqz"
                        type="date"
                        size="small"
                        value-format="yyyy-MM-dd"
                        class="full-width"
                        placeholder="选择日期"
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
                        v-model="apply.fplx"
                        size="small"
                        class="full-width"
                        placeholder="请选择"
                      >
                        <el-option label="增值税专用发票" value="01" />
                        <el-option
                          label="货物运输业增值税专用发票"
                          value="02"
                        />
                        <el-option label="机动车销售统一发票" value="03" />
                        <el-option label="增值税普通发票" value="04" />
                        <el-option label="增值税电子专用发票" value="08" />
                        <el-option label="增值税电子普通发票" value="10" />
                        <el-option label="卷式发票" value="11" />
                        <el-option label="通行费发票" value="14" />
                        <el-option label="二手车销售统一发票" value="15" />
                        <el-option
                          label="电子发票(增值税专用发票)"
                          value="81"
                        />
                        <el-option label="电子发票(普通发票)" value="82" />
                        <el-option
                          label="纸质发票(增值税专用发票)"
                          value="85"
                        />
                        <el-option label="纸质发票(普通发票)" value="86" />
                        <el-option label="电子发票(铁路电子客票)" value="51" />
                        <el-option
                          label="电子发票(航空运输客票电子行程单)"
                          value="61"
                        />
                        <el-option
                          label="机动车销售电子统一发票"
                          value="83"
                        />
                        <el-option
                          label="二手车销售电子统一发票"
                          value="84"
                        />
                        <el-option
                          label="纸质发票(机动车销售统一发票)"
                          value="87"
                        />
                        <el-option
                          label="纸质发票(二手车销售统一发票)"
                          value="88"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="lc-col-12 lc-col-xs6">
                  <div class="flex flex-content-start flex-items-center">
                    <label class="nowrap"
                      ><span class="red">*</span>数据类型:</label
                    >
                    <div class="flex-flex-auto">
                      <el-select
                        v-model="apply.sjlx"
                        size="small"
                        class="full-width"
                        placeholder="请选择"
                      >
                        <el-option label="进项票" value="1" />
                        <el-option label="销项票" value="2" />
                        <el-option label="自然人推送" value="3" />
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialog.apply = false"
                >取消</el-button
              >
              <el-button
                size="small"
                type="primary"
                :loading="saving"
                @click="submitApply"
                >提交</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import taxInvoiceUtils from './taxInvoiceUtils';

export default {
  props: { permissions: Object, params: Object },
  data() {
    return {
      loading: false,
      saving: false,
      dialog: { apply: false },
      apply: { nsrsbh: '', kprqq: '', kprqz: '', fplx: '', sjlx: '' },
      search: {
        downloadLsh: '',
        nsrsbh: '',
        downloadType: '',
        fplx: '',
        sjlx: '',
        taskStatus: '',
        cljg: ''
      },
      rows: [],
      pager: { current: 1, size: 10, total: 0 }
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
        downloadLsh: '',
        nsrsbh: '',
        downloadType: '',
        fplx: '',
        sjlx: '',
        taskStatus: '',
        cljg: ''
      };
      this.pager.current = 1;
      this.getData();
    },
    openApply() {
      this.apply = {
        nsrsbh: this.search.nsrsbh || '',
        kprqq: '',
        kprqz: '',
        fplx: '',
        sjlx: ''
      };
      this.dialog.apply = true;
    },
    buildQueryPayload() {
      const payload = {
        current: this.pager.current - 1,
        rowCount: this.pager.size,
        start: (this.pager.current - 1) * this.pager.size
      };
      const {
        downloadLsh,
        nsrsbh,
        downloadType,
        fplx,
        sjlx,
        taskStatus,
        cljg
      } = this.search;
      if (downloadLsh) payload.downloadLsh = downloadLsh.trim();
      if (nsrsbh) payload.nsrsbh = nsrsbh.trim();
      if (downloadType) payload.downloadType = downloadType;
      if (fplx) payload.fplx = fplx;
      if (sjlx) payload.sjlx = sjlx;
      if (taskStatus) payload.taskStatus = taskStatus;
      if (cljg) payload.cljg = cljg;
      return payload;
    },
    dlStatusText(v) {
      if (v === '02' || v === '成功') return '成功';
      if (v === '01' || v === '处理中') return '处理中';
      if (v === '03' || v === '失败') return '失败';
      if (v === '00' || v === '待处理') return '待处理';
      return v || '';
    },
    cljgText(v) {
      if (v === 'success' || v === '成功') return '成功';
      if (v === 'fail' || v === '失败') return '失败';
      return v || '-';
    },
    fplxText(v) {
      const map = {
        '01': '增值税专用发票',
        '02': '货物运输业增值税专用发票',
        '03': '机动车销售统一发票',
        '04': '增值税普通发票',
        '08': '增值税电子专用发票',
        '10': '增值税电子普通发票',
        '11': '卷式发票',
        '14': '通行费发票',
        '15': '二手车销售统一发票',
        '81': '电子发票(增值税专用发票)',
        '82': '电子发票(普通发票)',
        '85': '纸质发票(增值税专用发票)',
        '86': '纸质发票(普通发票)',
        '51': '电子发票(铁路电子客票)',
        '61': '电子发票(航空运输客票电子行程单)',
        '83': '机动车销售电子统一发票',
        '84': '二手车销售电子统一发票',
        '87': '纸质发票(机动车销售统一发票)',
        '88': '纸质发票(二手车销售统一发票)'
      };
      return map[v] || v || '';
    },
    sjlxText(v) {
      if (v === '1') return '进项票';
      if (v === '2') return '销项票';
      if (v === '3') return '自然人推送';
      return v || '';
    },
    submitApply() {
      const req = this.apply || {};
      const required = [
        ['nsrsbh', '请填写纳税人识别号'],
        ['kprqq', '请选择开票日期起'],
        ['kprqz', '请选择开票日期止'],
        ['fplx', '请选择发票类型'],
        ['sjlx', '请选择数据类型']
      ];
      for (const [k, m] of required) {
        if (!req[k]) {
          this.$message.warning(m);
          return;
        }
      }
      // 日期格式转换为 YYYYMMDD
      const payload = {
        nsrsbh: req.nsrsbh.trim(),
        kprqq: req.kprqq.replace(/-/g, ''),
        kprqz: req.kprqz.replace(/-/g, ''),
        fplx: req.fplx,
        sjlx: req.sjlx
      };
      this.saving = true;
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceDownloadApply,
        payload,
        (res) => {
          this.saving = false;
          this.dialog.apply = false;
          const { success, message } = this.parseServiceResult(res || {});
          if (success) {
            this.$message.success('申请已提交');
            this.getData();
          } else {
            this.$message.warning(message || '申请失败');
          }
        },
        () => {
          this.saving = false;
          this.$message.error('申请失败');
        },
        this
      );
    },
    onPage(p) {
      this.pager.current = p;
      this.getData();
    },
    getData() {
      this.loading = true;
      const payload = this.buildQueryPayload();
      this.API.send(
        this.CFG.services.kailing.pageInvoiceDownloadList,
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
    formatDateTime(v) {
      return taxInvoiceUtils.formatDateTime(v);
    },
    parsePagedResult(payload = {}) {
      console.log('parsePagedResult', payload);
      const success = payload ? payload.success : undefined;
      const reason = payload ? payload.reason : '';
      const errorMsg = payload ? payload.error : '';
      let records = [];
      let total = 0;
      if (payload && payload.serviceResult && payload.serviceResult.data) {
        records = payload.serviceResult.data.rows || [];
        total = payload.serviceResult.data.total || 0;
      }
      return {
        success: success !== false,
        message: reason || errorMsg || '',
        records,
        total
      };
    },
    parseServiceResult(payload = {}) {
      let body = payload;
      if (body && body.serviceResult) {
        body = body.serviceResult;
      }
      const successFlag =
        body && body.success !== undefined ? body.success : undefined;
      const code =
        body && (body.code !== undefined ? body.code : payload.code);
      const success =
        successFlag !== false &&
        (code === undefined || code === null || code === '0');
      const message =
        (body &&
          (body.msg || body.message || body.reason || body.errorMsg)) ||
        payload.msg ||
        payload.message ||
        '';
      const data =
        (body &&
          (body.data !== undefined
            ? body.data
            : body.result || body.record || body.entity)) ||
        {};
      return { success, message, data };
    }
  }
};
</script>

<style scoped>
</style>


