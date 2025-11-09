<template>
  <div class="viewport-fixed">
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel pl15 pr15 pt10">
          <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
            <div class="search-bar-item"><el-input v-model="search.keyword" size="small" placeholder="姓名/证件号" /></div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="onSearch">查询</el-button>
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <el-table :data="rows" v-loading="loading" style="width:100%" border>
              <el-table-column prop="name" label="姓名" min-width="120" />
              <el-table-column prop="cellphone" label="手机号" min-width="120" />
              <el-table-column prop="idno" label="证件号码" min-width="200" />
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
      setTimeout(() => {
        this.loading = false;
        this.rows = [
          { name: '张三', cellphone: '13800138000', idno: '110101199001010011' },
          { name: '李四', cellphone: '13800138001', idno: '110101199002020022' }
        ];
      }, 300);
    },
    choose(row) {
      try {
        sessionStorage.setItem('taxInvoice.selectedPerson', JSON.stringify(row || {}));
      } catch (e) {
        console.error('保存选中自然人失败:', e);
        if (this.$message) this.$message.error('保存数据失败，请重试');
      }
      const from = this.$route.query && this.$route.query.from;
      if (from) { this.$router.back(); } else { this.$message.success('已选择：' + (row && row.name)); }
    }
  }
};
</script>

<style scoped>
</style>


