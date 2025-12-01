<template>
  <div class="viewport-fixed">
    <crumbs-bar></crumbs-bar>
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center" v-if="canOperate">
      <div class="flex flex-content-center">
        <el-button type="primary" size="medium" @click="confirmRow('Y')" :loading="operating">确认</el-button>
        <el-button type="danger" size="medium" @click="confirmRow('N')" :loading="operating" class="ml10">拒绝</el-button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded">
          <h2>购方红字确认单 - 查看</h2>
          <div v-loading="loading">
            <RedConfirmationCreate :formData="formData" :readonly="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RedConfirmationCreate from './RedConfirmationCreate.vue';

export default {
  components: { 
    crumbsBar: () => import('@/common-base/components/crumbs-bar'),
    RedConfirmationCreate
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      loading: false,
      operating: false,
      formData: null,
      confirmId: null,
      currentStatus: ''
    };
  },
  computed: {
    canOperate() {
      // 只有状态为"02销方录入待购方确认"时才能操作
      return this.currentStatus === '02';
    }
  },
  mounted() {
    const query = this.$route && this.$route.query;
    if (query && query.confirmId) {
      this.confirmId = query.confirmId;
      this.fetchDetail();
    } else {
      this.$message.error('缺少确认单ID');
      this.$router.back();
    }
  },
  methods: {
    fetchDetail() {
      this.loading = true;
      const payload = {
        confirmId: this.confirmId
      };
      this.API.send(
        this.CFG.services.kailing.queryRedConfirmDetail,
        payload,
        (res) => {
          this.loading = false;
          const { success, message, data } = this.parseServiceResult(res || {});
          if (success && data) {
            const detail = Array.isArray(data.rows) && data.rows.length > 0 ? data.rows[0] : data;
            this.currentStatus = detail.hzqrxxztDm || '';
            this.formData = this.convertDetailToForm(detail);
          } else {
            this.$message.warning(message || '加载详情失败');
            this.$router.back();
          }
        },
        () => {
          this.loading = false;
          this.$message.error('加载详情失败，请重试');
          this.$router.back();
        },
        this
      );
    },
    convertDetailToForm(detail = {}) {
      const detailList = (detail.detailList || []).map((item, index) => ({
        id: item.id || '',
        lzmxxh: item.lzmxxh || index + 1,
        xh: item.xh || index + 1,
        xmmc: item.xmmc || '',
        ggxh: item.ggxh || '',
        dw: item.dw || '',
        sl: Number(item.fpspsl || item.sl || 0),
        dj: Number(item.fpspdj || item.dj || 0),
        je: Number(item.je || 0),
        slv: Number(item.sl1 || 0),
        se: Number(item.se || 0),
        kce: Number(item.kce || 0),
        sphfwssflhbbm: item.sphfwssflhbbm || '',
        hwhyslwfwmc: item.hwhyslwfwmc || '',
        spfwjc: item.spfwjc || '',
        yhzcbs: item.yhzcbs || ''
      }));
      
      return {
        // 基础信息
        id: detail.id,
        uuid: detail.uuid,
        taxpayerId: detail.taxpayerId || '',
        blueInvoiceId: detail.blueInvoiceId || '',
        hzfpxxqrdbh: detail.hzfpxxqrdbh,
        xsfmc: detail.xsfmc || '',
        lzfphm: detail.lzfphm || '',
        gmfzrrbz: detail.gmfzrrbz || '1',
        gmfmc: detail.gmfmc || '',
        lzfppzDm: detail.lzfppzDm || '02',
        chyyDm: detail.chyyDm || '01',
        tdys: detail.tdys || detail.lzfpTdyslxDm || '',
        // 销售方信息
        xsfnsrsbh: detail.xsfnsrsbh || '',
        xsfdz: detail.xsfdz || '',
        xsfdh: detail.xsfdh || '',
        xsfkhh: detail.xsfkhh || '',
        xsfzh: detail.xsfzh || '',
        cezzslx: detail.cezzslx || '',
        // 购买方信息
        gmfnsrsbh: detail.gmfnsrsbh || '',
        gmfdz: detail.gmfdz || '',
        gmfdh: detail.gmfdh || '',
        gmfkhh: detail.gmfkhh || '',
        gmfzh: detail.gmfzh || '',
        // 明细与合计
        fpmxList: detailList,
        hjjc: Number(detail.hzcxje || 0),
        hjs: Number(detail.hzcxse || 0),
        jshj: Number((detail.hzcxje || 0) + (detail.hzcxse || 0)),
        // 其他信息
        bz: detail.remark || detail.bz || ''
      };
    },
    confirmRow(qrlx) {
      const actionText = qrlx === 'Y' ? '确认' : '拒绝';
      this.$confirm(`确定要${actionText}此红字确认单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const payload = {
          confirmationId: this.confirmId,
          xsfnsrsbh: this.formData.xsfnsrsbh,
          qrlx: qrlx
        };
        this.operating = true;
        this.API.send(
          this.CFG.services.kailing.confirmRedConfirm,
          payload,
          (res) => {
            this.operating = false;
            const { success, message } = this.parseServiceResult(res || {});
            if (success) {
              this.$message.success(`${actionText}成功`);
              this.$router.push({ name: 'taxInvoiceRedBuyerList' });
            } else {
              this.$message.warning(message || `${actionText}失败`);
            }
          },
          () => {
            this.operating = false;
            this.$message.error(`${actionText}失败，请重试`);
          },
          this
        );
      }).catch(() => {
      });
    },
    parseServiceResult(payload = {}) {
      const serviceResult = payload && payload.serviceResult;
      const success = serviceResult ? serviceResult.success : undefined;
      const reason = serviceResult ? serviceResult.reason : '';
      const errorMsg = serviceResult ? serviceResult.errorCode : '';
      let data = null;
      if (serviceResult && serviceResult.data) {
        data = serviceResult.data;
      }
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

