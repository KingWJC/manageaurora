<template>
  <div class="viewport-fixed">
    <!-- 返回 -->
    <!-- <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
      <div class="flex flex-content-between">
        <div class="flex flex-items-start">
          <i class="icon-back" @click="close"></i>
        </div>
      </div>
    </div> -->
    <crumbs-bar title="请选择商户管家" :isCustomerBackEvent="true" @back="close"></crumbs-bar>
    <!-- 分页器 -->
    <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination background layout="total, prev, pager, next" @current-change="currentPager" :page-size="searchParams.rowCount" :current-page="searchParams.current" :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column" ref="box">
        <!-- 表格 -->
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <!-- 表格实体 -->
            <!-- <tableView v-if="isMounted" ref="tableView" :list="list" :cols="mode.setting.cols" :height="gridHeight">
            </tableView> -->
            
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header b">
                  查询商户管家
                </div>
                <div class="card-content-padded" ref="viewBody">
                  <div class="panel pr15 pt10" ref="serch">
                    <!-- 搜索条 -->
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                        <!-- 搜索条件: 机构名称 -->
                        <div class="search-bar-item">
                          <!-- <el-input v-model="searchParams.clinicPartnerOrgName" class="flex-flex-auto" size="small" placeholder="机构名称"> -->
                          <el-input v-model="searchParams.merchantName" class="flex-flex-auto" size="small" placeholder="商户名称" :maxlength="50">
                          </el-input>
                        </div>
                        <!-- 搜索条件: 签约业务员姓名 -->
                        <div class="search-bar-item">
                          <el-input v-model="searchParams.signMarketingName" class="flex-flex-auto" size="small" placeholder="签约业务员姓名" :maxlength="50">
                          </el-input>
                        </div>
                        <!-- 搜索条件: 签约业务员手机 -->
                        <div class="search-bar-item">
                          <el-input v-model="searchParams.signMarketingCellphone" class="flex-flex-auto" size="small" placeholder="签约业务员手机号" :maxlength="11">
                          </el-input>
                        </div>
                        <!-- 搜索条件: 履约业务员姓名 -->
                        <div class="search-bar-item">
                          <el-input v-model="searchParams.performMarketingName" class="flex-flex-auto" size="small" placeholder="履约业务员姓名" :maxlength="50">
                          </el-input>
                        </div>
                        <!-- 搜索条件: 履约业务员手机 -->
                        <div class="search-bar-item">
                          <el-input v-model="searchParams.performMarketingCellphone" class="flex-flex-auto" size="small" placeholder="履约业务员手机" :maxlength="11">
                          </el-input>
                        </div>
                        <!-- 按钮: 查询 / 重置 -->
                        <div class="search-bar-item-auto">
                          <el-button size="small" type="primary" @click="search()">查询</el-button>
                          <el-button size="small" type="primary" @click="reset()">重置</el-button>
                        </div>
                      </div>
                  </div>

                  <div class="mt20" ref="viewBody" v-if="isOver">
                    <div class="p20 tac darkgray" v-if="list.length === 0">没有数据</div>
                    <div v-else>
                      <div class="card card-shadow" ref="viewBody" v-for="item in list" :key="item.id">
                        <div class="panel p15">
                          <div class="lc-row lc-space16">
                            <div class="lc-col-12 lc-col-xs6">商户名称：{{ item.merchantName }}</div>
                            <div class="lc-col-12 lc-col-xs6">商户类型：{{ item.merchantTypeName }}</div>
                            <div class="lc-col-12 lc-col-xs6">商户分类：{{ item.categoryName }}</div>
                          </div>
                          <div class="lc-row lc-space16">
                            <div class="lc-col-12 lc-col-xs6">签约业务员：{{ item.signMarketingName }}</div>
                            <div class="lc-col-12 lc-col-xs6">签约业务员手机号：{{ item.signMarketingCellphone }}</div>
                          </div>
                          <div class="lc-row lc-space16">
                            <div class="lc-col-12 lc-col-xs6">履约业务员：{{ item.performMarketingName }}</div>
                            <div class="lc-col-12 lc-col-xs6">履约业务员手机号：{{ item.performMarketingCellphone }}</div>
                          </div>
                        </div>
                        <div class="card-footer">
                          是否选择变更此商户管家:
                          <span class="link" @click="selectResult(item)">确定</span>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import crumbsBar from '@/common-base/components/crumbs-bar';
  // 提供一个搜索框组件，用于在页面上实现搜索功能
  import searchBar from "@/common-base/components/search-bar";
  // 视图组件，用于展示数据列表
  import tableView from "@/common-base/components/pubComponents/tableView";
  export default {
    // 定义组件名称
    name: "generalSelection",
    // 引入组件
    components: {
      crumbsBar,
      tableView, // 表格组件
      searchBar // 搜索组件
    },
    // 配置项
    props: ["permissions", "mode"],
    // 初始化数据
    data() {
      return {
        // 控制加载状态
        isOver: false,
        // 网格高度
        gridHeight: 500,
        // 组件是否已挂载
        isMounted: false,
        // 总记录数
        total: 0,
        // 数据列表
        list: [],
        // 列配置
        cols: [],
        // 搜索参数
        searchParams: {
          current: 1, // 当前页码
          rowCount: 20, // 每页显示数量
          merchantName: "", // 原始发起人手机号
          signMarketingName: "", // 原始发起人名称
          signMarketingCellphone: "", // 营销人员手机号
          performMarketingName: "", // 营销人员名称
          performMarketingCellphone: "", // 营销人员名称
        },
      };
    },
    // 实例化
    created() {
    },
    // 挂载
    mounted() {
      // 初始化高度
      // this.gridHeight = this.$refs.box.offsetHeight - this.$refs.serch.offsetHeight - 55 + "px";
      this.isMounted = true;
    },
    // 定义方法
    methods: {
      /**
       * 手机号隐藏中间四位
       * @param phoneNumber 
       */
      maskPhoneNumber(phoneNumber) {
        // 检查输入是否为有效的11位数字
        if (phoneNumber && typeof phoneNumber === 'string' && /^\d{11}$/.test(phoneNumber)) {
          return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
        } else {
          return phoneNumber;
        }
      },
      close() {
        this.$emit("close");
      },
      /**
       * 选择结果
       * @param row 
       */
      selectResult(row) {
        this.$emit('selectResult', row);
      },
      // 选择 
      selectHanle(row) {
        this.mode.data = row;
        this.mode.show = false;
      },
      /**
       * 分页器更新表格list数据
       * @param pager 当前更新列表目标页面
       */
      currentPager(pager) {
        this.searchParams.current = pager;
        this.getData(this.searchParams);
      },
      /**
       * 更新表格
       */
      updateCurrentPage() {
        this.getData(this.searchParams);
      },
      /**
       * 查询表格数据
       * @param pager 查询目标分页
       */
      reset() {
        this.isOver = false;
        this.searchParams.current = 1; // 每页显示数量
        this.searchParams.merchantName = '';
        this.searchParams.signMarketingName = '';
        this.searchParams.signMarketingCellphone = '';
        this.searchParams.performMarketingName = '';
        this.searchParams.performMarketingCellphone = '';
      },
      /**
       * 查询表格数据
       * @param pager 查询目标分页
       */
      search() {
        this.searchParams.current = 1;
        this.getData();
      },
      /**
       * 查询表格数据
       * @param args 查询参数
       */
      getData(page) {
        this.isOver = false;
        if(!this.searchParams.merchantName && !this.searchParams.signMarketingName && !this.searchParams.signMarketingCellphone && !this.searchParams.performMarketingName && !this.searchParams.performMarketingCellphone) {
          this.$toast({text: '请输入查询条件'});
          return;
        }
        if(page) {
          this.searchParams.current = page;
        }
        const args = {
          current: this.searchParams.current,
          rowCount: this.searchParams.rowCount,
          merchantName: this.searchParams.merchantName,
          signMarketingName: this.searchParams.signMarketingName,
          signMarketingCellphone: this.searchParams.signMarketingCellphone,
          performMarketingName: this.searchParams.performMarketingName,
          performMarketingCellphone: this.searchParams.performMarketingCellphone,
        }
        //发请求
        this.API.send(
          this.CFG.services.crmapi.merchantManagerPage,
          args,
          function (res) {
            this.isOver = true;
            const result = res && res.data || {};
            const row = result.rows || [];
            if(args.current === 1) {
              this.list = row;
            } else {
              this.list = [...this.list , ...row];
            }
            this.total = result.total >= 0 ? result.total : this.total;
          },
          function () {},
          this
        );
      },
    },
  };
</script>
