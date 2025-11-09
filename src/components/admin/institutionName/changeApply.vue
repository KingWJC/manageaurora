<template>
  <div>
    <div class="viewport-fixed" v-if="!selectResultIsShow">
      <!-- 分页 -->
      <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="currentPager"
          :page-size="searchParams.rowCount"
          :current-page="searchParams.current"
          :total="total"
        />
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <div class="panel pl15 pr15 pt10">
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
              <div class="search-bar-item">
                <el-select size="small" filterable
                  v-model="searchParams.auditStatus" placeholder="审核状态">
                  <el-option label="申请中" :value="'1'"></el-option>
                  <el-option label="审核通过" :value="'2'"></el-option>
                  <el-option label="审核不通过" :value="'4'"></el-option>
                </el-select>
              </div>
              <!-- 查询等按钮 -->
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="search">查询</el-button>
                <el-button size="small" type="primary" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="toAdd" v-if="permissions.names.add">新增</el-button>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <!-- <v-list
                v-if="isMounted"
                :function-type="functionType"
                :list="list"
                ref="list"
                :permissions="permissions"
                :height="gridHeight"
                @toEdit="toEdit"
                @toExamine="toExamine"
                @toDetail="toDetail"
                @toAudit="toAudit"
              /> -->
              <tableView
                v-if="isMounted"
                :list="table.list"
                :cols="table.cols"
                :height="gridHeight"
              ></tableView>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="viewport-fixed bg-white power-zi101" v-if="selectResultIsShow">
      <!-- <generalSelection :mode="generalSelectionModel"></generalSelection> -->
      <resultSelection @close="closeSelectResult" @selectResult="selectResult"></resultSelection>
    </div>
    <!-- 数据核验 对话框 -->
    <el-dialog
      title="审核"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="checkModelIsShow"
      center
    >
      <Audit :checkData="checkData" :checkUrl="checkUrl" @close="checkCallback" v-if="checkModelIsShow"></Audit>
    </el-dialog>
  </div>
</template>

<script>
// 引入通用选择组件
import generalSelection from "./common/generalSelection";
import resultSelection from "./common/resultSelection";
import keepAliveMixin from "@/common-base/mixins/keep-alive";
// 引入表格组件
import tableView from '@/common-base/components/pubComponents/tableView.vue';
import Audit from "./common/audit";
export default {
  name: "housekeeper",
  mixins: [keepAliveMixin],
  // 注册局部组件
  components: {
    tableView,
    generalSelection,
    resultSelection,
    Audit,
  },
  // 定义从父组件传来的参数
  props: {
    permissions: { //权限
      type: Object,
      default () {
        return {
          names: {},
          codes: {},
        };
      },
    },
    functionType: { //功能类型
      type: String,
      default () {
        return '';
      }
    }
  },
  data() {
    return {
      loading: null,// 加载中
      isMounted: false,
      // 是否展示选择结果集弹层
      selectResultIsShow: false,
      // 数据列表
      list: [],
      // 总页数
      totalPage: 1,
      // 数据总数
      total: 0,
      // 网格高度
      gridHeight: 500,
      // 搜索参数
      searchParams: {
        // 当前页码，默认为第1页
        current: 1,
        // 每页显示的行数，默认为15行
        rowCount: 15,
        // 商户名称
        merchantName: '',
        // 签约业务员姓名
        signMarketingName: '',
        // 签约业务员手机号
        signMarketingCellphone: '',
        // 履约业务员姓名
        performMarketingName: '',
        // 履约业务员手机
        performMarketingCellphone: '',
      },
      isMobile: false,
      // 通用选择组件
      generalSelectionModel: {
        show: false,
        data: {},
        setting: {
          url: "",
          formConfig: [],
          cols: [],
        },
      },
      table: {
        cols: [],
        list: [],
      },
      // 审核弹层
      checkModelIsShow: false,
      checkUrl: null,
      checkData: null,
    };
  },
  // 创建完成执行
  created() {
    this.isMounted = false;
    this.initForm();
    // 加载表格数据
    this.getData(this.searchParams);
  },
  // 挂载完成
  mounted() {
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + "px";
    this.isMounted = false;
    this.isMobile = this.CFG.client.isMobile;
  },
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
    initForm() {
      this.table.cols = [
        {
          label: '商户名称',
          id: 'merchantName',
          width: '100',
          // render: (row) => formatEmpty(row.auditorName)
        },
        {
          label: '商户类型',
          id: 'merchantTypeName',
          width: '100',
          // render: (row) => formatEmpty(row.auditorName)
        },
        {
          label: '商户分类',
          id: 'categoryName',
          width: '100',
          // render: (row) => formatEmpty(row.auditorName)
        },
        {
          label: '签约业务员姓名',
          id: 'signMarketingName',
          width: '100',
        },
        {
          label: '签约业务员手机号',
          id: 'signMarketingCellphone',
          width: '100',
          // render: (row) => this.maskPhoneNumber(row.signMarketingCellphone)
        },
        {
          label: '签约业务员启计时间',
          id: 'signMarketingCellphone',
          width: '100',
          render: (row) => this.utils.formatDate(row.signStartDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '签约业务员终止时间',
          id: 'signMarketingCellphone',
          width: '100',
          render: (row) => this.utils.formatDate(row.signEndDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '履约业务员姓名',
          id: 'performMarketingName',
          width: '100',
        },
        {
          label: '履约业务员手机号',
          id: 'performMarketingCellphone',
          width: '100',
          // render: (row) => this.maskPhoneNumber(row.performMarketingCellphone)
        },
        {
          label: '履约业务员启计时间',
          id: 'performStartDate',
          width: '100',
          render: (row) => this.utils.formatDate(row.performStartDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '履约业务员终止时间',
          id: 'performEndDate',
          width: '100',
          render: (row) => this.utils.formatDate(row.performEndDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '制单人',
          id: 'auditorName',
          width: '100',
          render: (row) => {
            if(row.applicant === 'system') {
              return '系统自动';
            } else {
              return row.applicantName ? row.applicantName : '--';
            }
          }
        },
        {
          label: '制单时间',
          id: 'auditDate',
          width: '100',
          render: (row) => this.utils.formatDate(row.applicationDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '审核人',
          id: 'auditorName',
          width: '100',
          render: (row) => {
            if(row.auditor === 'system') {
              return '系统自动';
            } else {
              return row.auditorName ? row.auditorName : '--';
            }
          }
        },
        {
          label: '审核时间',
          id: 'auditDate',
          width: '100',
          render: (row) => this.utils.formatDate(row.auditDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '状态',
          id: 'isAuto',
          width: '100',
          renderjxs: (scope) => {
            return (
              <div class="flex">
                {scope.row.auditStatus === '1' && <div>申请中</div>}
                {scope.row.auditStatus === '2' && <div>审核通过</div>}
                {scope.row.auditStatus === '3' && <div>驳回</div>}
                {scope.row.auditStatus === '4' && <div>审核不通过</div>}

                {scope.row.auditComment && (
                  <el-popover placement="top" trigger="hover">
                    <div slot="default" class="pad10 fs-sm">
                      <p><strong>备注</strong></p>
                      {scope.row.auditComment}
                    </div>
                    <i slot="reference" class="el-icon-warning-outline current fs-sm ml5"></i>
                  </el-popover>
                )}
              </div>
            );
          }
        },
        { label: '操作', fixed: 'right', width: '120', btns: [
          {
            name: '查看', click: (row) => {
              this.toDetails(row);
            },
            condition: ()=>{
              return true;
            }
          },
          {
            name: '编辑', click: (row) => {
              this.toEdit(row);
            },
            condition: (row)=>{
              return this.permissions.names.modify && row.auditStatus === '1';
            },
          },
          {
            name: '审核', click: (row) => {
              this.toAudit(row);
            },
            condition: (row)=>{
              return this.permissions.names.verify && row.auditStatus === '1';
            },
          },
          {
            name: '删除', click: (row) => {
              this.toDel(row);
            },
            condition: (row)=>{
              return this.permissions.names.delete && row.auditStatus === '1';
            },
          },
        ]
      }
      ];
    },
    //重置
    reset() {
      const that = this;
      // 重置搜索参数
      that.searchParams = {
        current: 1,
        rowCount: 15,
        // 商户名称
        merchantName: '',
        // 签约业务员姓名
        signMarketingName: '',
        // 签约业务员手机号
        signMarketingCellphone: '',
        // 履约业务员手机号
        performMarketingName: '',
        // 履约业务员手机号
        performMarketingCellphone: '',
      };
      // 重新请求数据
      that.getData(that.searchParams);
    },
    // 点击选择记录
    toAdd() {
      this.selectResultIsShow = true;
    },
    closeSelectResult() {
      this.selectResultIsShow = false;
    },
    selectResult(row) {
      this.closeSelectResult();
      this.$router.push({
        path: '/admin/merchantButlerChangeAdd',
        query: {
          resultId: row.id
        }
      });
    },
    /**
     * 更新当前页码。
     * @param {Object} pager 分页对象，通常包含当前页码。
     */
    currentPager(pager) {
      this.searchParams.current = pager;
      this.getData(this.searchParams);
    },
    /**
     * 发起搜索操作。
     * 重置当前页码为第一页，并根据搜索条件获取数据。
     */
    search() {
      this.searchParams.current = 1;
      this.getData(this.searchParams);
    },
    /**
     * 更新当前页面数据。
     * 主要用于组件挂载状态变化时重新获取数据。
     */
    updateCurrentPage() {
      this.isMounted = false;
      this.getData(this.searchParams);
    },
    // 获取列表数据
    getData(args) {
      const that = this;
      //发请求
      that.API.send(
        that.CFG.services.crmapi.merchantManagerChangesApplyPage,
        args,
        function(res) {
          res = res.serviceResult || {};
          if (res.rows !== null) {
            that.table.list = res.rows;
            that.total = res.total >= 0 ? res.total : that.total;
            that.isMounted = true;
          }
        },
        function() {},
        that
      );
    },
    // 删除
    toDel(row) {
      const that = this;
      let url = that.CFG.services.crmapi.merchantManagerChangesApplyDel;

      // 弹框确认
      that.$confirm({
        title: "提示",
        text: '确认删除？',
        buttons: [ //确定和取消按钮
          {
            text: "取消",
            type: "follow",
          },
          {
            text: "确定",
            type: "primary",
            callback: function () {
              // 传输会议id数据
              const args = {
                id: row.id,
              };
              //发请求
              that.API.send(
                url,
                args,
                function () { //成功的回调函数
                  that.$toast({ text: "操作成功" });
                  that.updateCurrentPage();
                },
                function () {}, //失败的回调函数
                that
              );
            },
          },
        ],
      });
    },
    // 编辑
    toEdit(row) {
      // 编辑页面 路由地址
      const path = '/admin/merchantButlerChangeEdit';
      // 跳转路由
      this.$router.push({
        path: path,
        query: {
          id: row.id, // 传递id参数
        },
      });
    },
    // 审核
    toExamine(row) {
      // 审核页面 路由地址
      let path = '/admin/ogHealthAgreementHousekeeperChangeExamine';
      // 跳转路由
      this.$router.push({
        path: path,
        query: {
          id: row.id,// 传递id参数
        },
      });
    },
    // 详情
    toDetails(row) {
      // 详情页面 路由地址
      let path = '/admin/merchantButlerChangeDetail';
      // 跳转路由
      this.$router.push({
        path: path,
        query: {
          id: row.id, // 传递id参数
        },
      });
    },
    toAudit(row) {
      this.checkData = row;
      this.checkUrl = this.CFG.services.crmapi.merchantManagerChangesApplyAudit;
      this.checkModelIsShow = true;
    },
    checkCallback() {
      this.checkModelIsShow = false;
      this.updateCurrentPage();
    }
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  width: 480px;
  max-width: 100%;
}
</style>