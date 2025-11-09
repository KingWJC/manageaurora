<template>
  <div class="viewport-fixed">
    <!-- 返回 -->
    <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
      <div class="flex flex-content-between">
        <div class="flex flex-items-start">
          <i class="icon-back" @click="close"></i>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div v-if="!(this.mode.setting.noPaging)" class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination background layout="total, prev, pager, next" @current-change="currentPager" :page-size="searchParams.rowCount" :current-page="searchParams.current" :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column" ref="box">
        <div class="panel pl15 pr15 pt10" ref="serch">
          <!-- 搜索条 -->
          <searchBar :form-item="mode.setting.formConfig" :form-data="searchParams" :thumbnail-number="12" @reloadData="search(1)" :permissions='permissions' ref="serch" />
        </div>
        <!-- 表格 -->
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <!-- 表格实体 -->
            <tableView v-if="isMounted" ref="tableView" :list="list" :cols="mode.setting.cols" :height="gridHeight">
            </tableView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 提供一个搜索框组件，用于在页面上实现搜索功能
  import searchBar from "@/common-base/components/search-bar";
  // 视图组件，用于展示数据列表
  import tableView from "@/common-base/components/pubComponents/tableView";
  export default {
    // 定义组件名称
    name: "generalSelection",
    // 引入组件
    components: {
      tableView, // 表格组件
      searchBar // 搜索组件
    },
    // 配置项
    props: ["permissions", "mode"],
    // 初始化数据
    data() {
      return {
        // 控制加载状态
        loading: null,
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
          originatorCellphone: "", // 原始发起人手机号
          originatorName: "", // 原始发起人名称
          marketingCellphone: "", // 营销人员手机号
          marketingName: "", // 营销人员名称
        },
      };
    },
    // 实例化
    created() {
      // 初始化数据
      // this.initData();
    },
    // 挂载
    mounted() {
      // 初始化高度
      this.gridHeight = this.$refs.box.offsetHeight - this.$refs.serch.offsetHeight - 55 + "px";
      this.isMounted = true;
    },
    // 定义方法
    methods: {
      close() {
        this.$emit("close");
      },
      // 获取数据
      initData() {
        this.getData(this.searchParams);
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
      search(pager) {
        this.searchParams.current = pager || 1;
        this.getData(this.searchParams);
      },
      /**
       * 查询表格数据
       * @param args 查询参数
       */
      getData(args) {
        args = {...args, ...this.mode.setting.params || {}}
        const argsCopy = this.utils.deepCopy(args);
        delete argsCopy.current;
        delete argsCopy.rowCount;
        if(!this.hasNonEmptyValue(argsCopy)) {
          this.$toast({text: '请输入查询条件'});
          return;
        }
        //发请求
        this.API.send(
          this.mode.setting.url,
          args,
          function (res) { //成功的回调函数
            res = res.serviceResult;
            if(this.mode.setting.noPaging) {
              this.list = res || []
            } else {
              this.list = res.rows || [];
              this.total = res.total >= 0 ? res.total : this.total;
            }
          },
          function () {},
          this
        );
      },
      /**
       * 判断对象是否非空
       * @param obj 
       */
      hasNonEmptyValue(obj) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value !== null && value !== undefined && value !== '') {
                return true; // 存在非空值，返回 true
            }
          }
        }
        return false; // 所有值都为空，返回 false
      }
    },
  };
</script>
