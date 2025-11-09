<template>
  <div>
    <div class="viewport-fixed">
      <!-- 页码 -->
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
            <!-- 搜索 -->
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <!-- 搜索条件: 机构名称 -->
              <div class="search-bar-item flex flex-items-center">
                <!-- <el-input v-model="searchParams.clinicPartnerOrgName" class="flex-flex-auto" size="small" placeholder="机构名称"> -->
                <el-input v-model="searchParams.orgName" readonly class="flex-flex-auto" size="small" placeholder="机构" :maxlength="50">
                </el-input>
                <span
                  class="ml5 mr10 search-bar-add-btn"
                  @click="addOrg()"
                >
                  <i :class="'el-icon-circle-plus'"></i>
                </span>
              </div>
              <!-- 搜索条件: 机构名称 -->
              <div class="search-bar-item">
                <!-- <el-input v-model="searchParams.clinicPartnerOrgName" class="flex-flex-auto" size="small" placeholder="机构名称"> -->
                <el-input v-model="searchParams.oldName" class="flex-flex-auto" size="small" placeholder="机构曾用名" :maxlength="50">
                </el-input>
              </div>
              <!-- 搜索条件: 审核状态 -->
              <div class="search-bar-item">
                <el-select size="small" filterable
                  v-model="searchParams.auditStatus" placeholder="审核状态">
                  <el-option label="申请中" :value="'1'"></el-option>
                  <el-option label="审核通过" :value="'2'"></el-option>
                  <el-option label="审核不通过" :value="'4'"></el-option>
                </el-select>
              </div>
              <!-- 按钮: 查询 / 重置 -->
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" @click="search">查询</el-button>
                <el-button size="small" type="primary" @click="reset">重置</el-button>
                <el-button size="small" type="primary" @click="toAdd" v-if="permissions.names.add">新增</el-button>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <!-- <v-list
                v-if="isMounted"
                function-type="apply"
                :list="list"
                ref="list"
                :permissions="permissions"
                :height="gridHeight"
                @toEdit="toEdit"
                @toDetails="toDetails"
                @toDel="toDel"
                @toCheck="toCheck"
                @toTakeEffect="toTakeEffect"
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
    <div class="viewport-fixed bg-white power-zi101" v-if="showSelect">
      <generalSelection :mode="generalSelectionModel" @close="closeGeneralSelection"></generalSelection>
    </div>
  </div>
</template>

<script>
// 表格组件
// 缓存的混入
import keepAliveMixin from "@/common-base/mixins/keep-alive";
// 引入表格组件
import tableView from '@/common-base/components/pubComponents/tableView.vue';
import Audit from "./common/audit";
// 引入通用选择组件
import generalSelection from "./common/generalSelection";
export default {
  name: "doctorPartner", // 组件名
  mixins: [keepAliveMixin], //缓存混入
  // 注册局部组件
  components: {
    tableView,
    Audit,
    generalSelection,
  },
  // 接受从外部传入的属性
  props: {
    permissions: {
      type: Object,
      default() {
        return {
          names: {},
          codes: {},
        };
      },
    },
    functionType: {
      type: String,
      default() {
        return '';
      }
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  // 定义当前组件的响应式数据
  data() {
    return {
      // 通用选择组件
      generalSelectionModel: {
        show: false, // 控制
        data: {},
        setting: {
          url: "",
          formConfig: [],
          cols: [],
        },
      },
      // 通用选择
      showSelect: false,
      loading: null,
      isMounted: false,
      // 数据列表
      list: [],
      // 总页数
      totalPage: 1,
      // 总数据量
      total: 0,
      // 网格高度
      gridHeight: 500,
      searchParams: { //搜索参数
        current: 1, // 当前页码
        rowCount: 15,// 每页条数
        // 商户名称
        orgId: '',
        orgName: '',
        oldName: '',
      },
      // 审核弹层
      checkModelIsShow: false,
      checkUrl: null,
      checkData: null,
      isMobile: false,
      table: {
        cols: [],
        list: [],
      }
    };
  },
  // 组件创建完成
  created() {
    this.initForm();
    // 加载表格数据
    this.getData(this.searchParams);
  },
  // 组件挂载完成
  mounted() {
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + 'px';
    this.isMounted = true;
    this.isMobile = this.CFG.client.isMobile;
  },
  // 定义方法
  methods: {
    /**
     * 更新表格
     */
    updateCurrentPage() {
      this.getData();
    },
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
          label: '单据ID',
          id: 'id',
          width: '100',
        },
        {
          label: '单据来源',
          id: 'source',
          width: '100',
          render: (row) => {
            const projects = this.CFG.projects;
            const project = projects.find(v => v.id === row.source) || {};
            return project.title || '';
          }
        },
        {
          label: '机构名称',
          id: 'newName',
          width: '150',
          // render: (row) => formatEmpty(row.auditorName)
        },
        {
          label: '机构曾用名',
          id: 'oldName',
          width: '150',
          // render: (row) => formatEmpty(row.auditorName)
        },
        {
          label: '机构曾用名开始使用时间',
          id: 'beginTime',
          width: '180',
          render: (row) => this.utils.formatDate(row.beginTime, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          label: '机构曾用名结束使用时间',
          id: 'changeTime',
          width: '180',
          render: (row) => this.utils.formatDate(row.changeTime, 'yyyy-MM-dd hh:mm:ss')
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
          id: 'applicationDate',
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
              <div class="flex flex-content-center">
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
      //重置搜索参数
      that.searchParams = {
        current: 1, // 当前页码
        rowCount: 15,// 每页行数
        // 机构ID
        orgId: '',
        // 机构名称
        orgName: '',
        // 重置曾用名
        oldName: '',
      };
      // 重新请求数据
      that.getData(that.searchParams);
    },
    // 切换页码
    currentPager(pager) {
      // 当前页码
      this.searchParams.current = pager;
      // 调用数据加载函数，重新查询数据
      this.getData(this.searchParams);
    },
    // 点击搜索
    search() {
      this.searchParams.current = 1;
      this.getData(this.searchParams);
    },
    // 获取数据
    updateCurrentPage() {
      this.isMounted = false;
      this.getData(this.searchParams);
    },
    // 获取列表数据
    getData(args) {
      const that = this;
      if(this.params.clinicOrgId) {args.clinicOrgId = this.params.clinicOrgId;}
      let url = that.CFG.services.ca.nameChangeApplyList;
      // 发请求
      that.API.send(
        url,
        args,
        function (res) { //成功的回调函数
          res = res.serviceResult || {};
          if (res.rows !== null) {
            that.table.list = res.rows;
            that.total = res.total >= 0 ? res.total : that.total;
            that.isMounted = true;
          }
        },
        function () {}, //失败的回调函数
        that
      );
    },
    // ****************************************   功能性处理函数   ****************************************  //
    // 新增
    toAdd() {
      this.$router.push({ //跳转路由
        path: '/admin/institutionNameApplyAdd'
      });
    },
    // 编辑
    toEdit(row) {
      //跳转路由
      this.$router.push({
        path: '/admin/institutionNameApplyEdit',
        query: {
          //携带id参数
          id: row.id,
        },
      });
    },
    // 查看
    toDetails(row) {
      //跳转路由
      this.$router.push({
        path: '/admin/institutionNameApplyDetail',
        query: {
          //携带id参数
          id: row.id,
        },
      });
    },
    // 删除
    toDel(row) {
      const that = this;
      let url = that.CFG.services.ca.nameChangeApplyDelete;

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
    toAudit(row) {
      this.checkData = row;
      this.checkUrl = this.CFG.services.ca.nameChangeApplyAudit;
      this.checkModelIsShow = true;
    },
    checkCallback() {
      this.checkModelIsShow = false;
      this.updateCurrentPage();
    },
    /**
     * 关闭弹窗
     */
    closeGeneralSelection() {
      this.showSelect = false;
    },
    /**
     * 选择商户
     */
    addOrg() {
      const that = this;
      // 打开选择框
      this.showSelect = true;
      const modelOptions = {
        // 人员选择框数据
        url: this.CFG.services.ca.organizeSearchOrgsByPage,
        noPaging: false,
        // 表单配置
        formConfig: [
          // 手机号
          { paramMark: "机构名称", param: "name", paramType: "text" },
        ],
        cols: [ //列配置
          // 姓名
          { label: "机构名称", id: "name" },
          { label: "省", id: "district" },
          { label: "市", id: "city" },
          { label: "县", id: "district" },
          { label: "地址", id: "address" },
          { label: "联系人", id: "linkmanName" },
          { label: "联系人电话", id: "linkmanPhone", render: (row) => this.maskPhoneNumber(row.linkmanPhone) },
          {
            label: "操作",
            fixed: "right",
            width: "120",
            btns: [
              {
                name: "选择",
                click: (row) => {
                  const { id: id, name: name} = row;
                  this.showSelect = false;
                  this.searchParams.orgId = id;
                  this.searchParams.orgName = name;
                  this.searchParams.oldName = '';
                },
              }
            ],
          }
        ]
      };
      that.generalSelectionModel.setting = modelOptions;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar{
  .search-bar-item{
    :deep(.el-select){
      width: 150px
    }
  }
}
::v-deep .el-dialog {
  width: 480px;
  max-width: 100%;
}
.search-bar-add-btn {
  color: #3f9eff;
  font-size: 22px;
  cursor: pointer;
}
</style>