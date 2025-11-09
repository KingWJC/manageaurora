<template>
  <div class="viewport-fixed">
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel pl15 pr15 pt10">
          <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
            <div class="search-bar-item"><el-input v-model="search.keyword" size="small" placeholder="组织名称/税号" /></div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="onSearch">查询</el-button>
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <el-table :data="rows" v-loading="loading" style="width:100%" border>
              <el-table-column prop="nsrsbh" label="纳税人识别号" min-width="160" />
              <el-table-column prop="mc" label="名称" min-width="200" />
              <el-table-column prop="province" label="省" min-width="120" />
              <el-table-column prop="city" label="市" min-width="120" />
              <el-table-column prop="county" label="县" min-width="120" />
              <el-table-column prop="address" label="地址" min-width="200" />
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <p><span class="link" @click="choose(scope.row)">选择</span></p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { permissions: Object, params: Object },
  data() { return { loading: false, search: { keyword: '' }, rows: [] }; },
  mounted() { this.getData(); },
  methods: {
    onSearch() { this.getData(); },
    getData() {
      this.loading = true;
      // mock
      setTimeout(() => {
        this.loading = false;
        this.rows = [
          { nsrsbh: '9133X1X1X1', mc: '朗致科技', province: '北京市', city: '北京市', county: '朝阳区', address: '朝阳区某某街道123号' },
          { nsrsbh: '9133Y2Y2Y2', mc: '乐企科技', province: '上海市', city: '上海市', county: '浦东新区', address: '浦东新区某某路456号' }
        ];
      }, 300);
    },
    choose(row) {
      try {
        sessionStorage.setItem('taxInvoice.selectedOrg', JSON.stringify(row || {}));
      } catch (e) {
        console.error('保存选中组织失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      const from = this.$route.query && this.$route.query.from;
      if (from) { this.$router.back(); } else { this.$message.success('已选择：' + (row && row.mc)); }
    }
  }
};
</script>

<style scoped>
</style>


