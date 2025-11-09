<template>
  <div class="viewport-fixed">
    <!-- 
      分页
    -->
    <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination background layout="total, prev, pager, next" @current-change="currentPager"
        :page-size="search.rowCount" :current-page="search.current" :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <!-- 
          搜索条件
        -->
        <div class="panel pl15 pr15 pt10">
          <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
            <div class="search-bar-item flex"> 
              <!-- 
                协议编码
               -->
              <el-input v-model="search.contractId" class="full-width" size="small" placeholder="协议编码"></el-input>
            </div>
            <!-- 
              关联协议类型
            -->
            <div class="search-bar-item">
              <el-select
                v-model="search.refContractType"
                class="full-width"
                size="small"
                placeholder="关联协议类型">
                <el-option label="协议" value='1'></el-option>
                <el-option label="签署单" value='2'></el-option>
              </el-select>
            </div>
            <div class="search-bar-item flex"> 
              <!-- 
                关联协议编码
               -->
              <el-input v-model="search.refContractId" class="full-width" size="small" placeholder="关联协议编码"></el-input>
            </div>
            <!-- 
              审核状态
            -->
            <div class="search-bar-item">
              <el-select
                v-model="search.auditStatus"
                class="full-width"
                size="small"
                placeholder="审核状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="申请中" value='1'></el-option>
                <el-option label="已驳回" value='3'></el-option>   
                <el-option label="审核通过" value='6'></el-option>
                <el-option label="审批通过" value='2'></el-option>
              </el-select>
            </div>
            <!-- 
              操作
            -->
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="query()">查询</el-button>
              <el-button size="small" type="primary" @click="reset()">重置</el-button>
              <el-button size="small" v-if="permissions.names.add" type="primary" @click="add({})">
                新增</el-button>
            </div>
          </div>
        </div>
        <!-- 
           主体列表
        -->
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <el-table
              :data="list"
              :height="gridHeight"
              v-if="isMounted"
              width="100%" border ref="gridTable">
              <!-- 
                单据ID
              -->
              <el-table-column
                prop="id"
                label="单据ID"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.id| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                协议编码
              -->
              <el-table-column
                prop="contractId"
                label="协议编码"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.contractId | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                甲方
              -->
              <el-table-column
                prop="partyAName"
                label="甲方"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.partyAName | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                乙方
              -->
              <el-table-column
                prop="partyBName"
                label="乙方"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.partyBName | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                关联协议类型
              -->
              <el-table-column
                prop="refContractType"
                label="关联协议类型"
                min-width="140"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.refContractType=='1'">协议</span>
                  <span v-else-if="scope.row.refContractType=='2'">签署单</span>
                </template>
              </el-table-column>
              <!-- 
                关联协议编码
              -->
              <el-table-column
                prop="refContractId"
                label="关联协议编码"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.refContractId | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                生效类型
              -->
              <el-table-column
                prop="effectType"
                label="生效类型"
                min-width="110"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.effectType==1">立即生效</span>
                  <span v-else-if="scope.row.effectType==2">延迟生效</span>
                </template>
              </el-table-column>
              <!-- 
                生效时间
              -->
              <el-table-column
                prop="effectTime"
                label="生效时间"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.effectTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </template>
              </el-table-column>
              <!-- 
                申请人
              -->
              <el-table-column
                prop="applicantName"
                label="申请人"
                min-width="90"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.applicant === 'system'">系统自动</span>
                    <span v-else>{{scope.row.applicantName | formatEmpty('--')}}</span>
                </template>
              </el-table-column>
              <!-- 
                申请时间
              -->
              <el-table-column
                prop="applicationDate"
                label="申请时间"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.applicationDate | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </template>
              </el-table-column>
              <!-- 
                审核人
              -->
              <el-table-column
                prop="auditorName"
                label="审核人"
                min-width="90"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.auditor === 'system'">系统自动</span>
                    <span v-else>{{scope.row.auditorName | formatEmpty('--')}}</span>
                </template>
              </el-table-column>
              <!-- 
                审核时间
              -->
              <el-table-column
                prop="auditDate"
                label="审核时间"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.auditDate | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </template>
              </el-table-column>
              <!-- 
                状态
              -->
              <el-table-column
                prop="auditStatus"
                label="状态"
                min-width="130"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.auditStatus === '1'">申请中</span>
                  <span v-else-if="scope.row.auditStatus === '2'">审批通过</span>
                  <span v-else-if="scope.row.auditStatus === '3'">已驳回</span>                 
                  <span v-else-if="scope.row.auditStatus=='6'">审核通过</span>
                  <el-popover placement="top" trigger="hover" v-if="scope.row.auditStatus!=='1' && scope.row.auditComment">
                    <div class="pad10 fs-sm"><p><strong>备注</strong></p>{{scope.row.auditComment}}</div>
                    <i slot="reference" class="el-icon-warning-outline current fs-sm ml5"></i>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- 
                操作
              -->
              <el-table-column
                prop="db"
                :fixed="'right'"
                label="操作"
                min-width="140"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <p>
                    <!-- 
                      查看
                    -->
                    <span class="link" @click="details(scope.row)">查看</span>
                    <!-- 
                      编辑
                    -->
                    <span v-if="permissions.names.modify && (scope.row.auditStatus === '1' || scope.row.auditStatus === '3')" class="link ml10" @click="edit(scope.row)">编辑</span> 
                    <span v-else class="ml10 darkgray">编辑</span>
                  </p>
                  <p>
                    <!-- 
                      审核
                    -->
                    <span v-if="permissions.names.verify">
                      <span v-if="scope.row.auditStatus === '1'" class="link" @click="checkEnter(scope.row)">审核</span>
                      <span v-else class="darkgray">审核</span>
                    </span>
                    <!-- 
                      审批
                    -->
                    <span v-if="permissions.names.custom1">
                      <span v-if="scope.row.auditStatus === '6'" class="link ml10" @click="checkEnterA(scope.row)">审批</span>
                      <span v-else class="ml10 darkgray">审批</span>
                    </span>
                  </p>
                  <p>
                    <span v-if="permissions.names.delete">
                      <!-- 未审批通过的都可以删除 -->
                      <!-- <span v-if="scope.row.auditStatus !== '2'" class="link" @click="toDeleted(scope.row)">删除</span>
                      <span v-else  class="darkgray">删除</span> -->
                      <span v-if="scope.row.auditStatus === '1' || scope.row.auditStatus === '3'" class="link" @click="toDeleted(scope.row)">删除</span>
                      <span v-else  class="darkgray">删除</span>
                    </span>
                  </p>
                  <!-- <div class="tac">
                    <span v-if="scope.row.auditStatus === '2'" class="link" @click="openFlow(scope.row)">查看流程</span>
                    <span v-else class="darkgray">查看流程</span>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 
      审核
    -->
    <el-dialog title="审核" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isShowCheck" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>状态：</label>
        <div class="flex-flex-auto">
          <el-radio-group v-model="examine.action">
            <el-radio :label="7">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center">
        <label class="form-label"><span v-if="examine.action === 2" class="red">*</span>审核备注：</label>
        <div class="flex-flex-auto">
          <el-input type="textarea" v-model="examine.auditComment" class="full-width"
            placeholder="请填写内容" size="small">
          </el-input>
        </div>
      </div>

      <div class="mt15 flex flex-content-start flex-items-center">
        <div class="flex-flex-auto tac">
          <span type="btn" @click="toCheckEnter" class="btn btn-primary btn-xl">
            确定
          </span>
          <span class="btn btn-xl ml20" @click="isShowCheck=false">
            取消
          </span>
        </div>
      </div>
    </el-dialog>
    <!-- 
      审批
    -->
    <el-dialog title="审批" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isShowCheckA" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>状态：</label>
        <div class="flex-flex-auto">
          <el-radio-group v-model="examine.action">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
            
          </el-radio-group>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center">
        <label class="form-label"><span v-if="examine.action === 2" class="red">*</span>审核备注：</label>
        <div class="flex-flex-auto">
          <el-input type="textarea" v-model="examine.auditComment" class="full-width"
            placeholder="请填写内容" size="small">
          </el-input>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center">
        <div class="flex-flex-auto tac">
          <span type="btn" @click="toCheckEnterA" class="btn btn-primary btn-xl">
            确定
          </span>
          <span class="btn btn-xl ml20" @click="isShowCheckA=false">
            取消
          </span>
        </div>
      </div>
    </el-dialog>
    <!--流程-->
    <FlowPath :flowObj="flowObj" @closeFlow="closeFlow" v-if="flowObj.isShow"></FlowPath>
  </div>
</template>
<script>
import keepAliveMixin from "@/common-base/mixins/keep-alive";
import selectOrg from '../selectOrg';
import FlowPath from '@/components/admin/flowPath/index'
import treeselect from '@riophae/vue-treeselect'
let commonAreaData;
export default {
  mixins: [keepAliveMixin],
  props: {
    permissions: {
      type: Object,
      default () {
        return {
          codes: {},
          names: {},
        }
      }
    }
  },
  components: {
    selectOrg,
    FlowPath,
    treeselect
  },
  data () {
    return {
      /**
       * 查询条件
       */
      search: {
        current: 1,
        rowCount: 15,
      },
      /**
       * 审核审批弹框
       */
      isShowCheck: false,
      isShowCheckA: false,
      total: 0,
      list: [],
      gridHeight: 500,
      isMounted: false,
      examine: {},
      /**
       * 是否展示流程图
       */
      flowObj: {
        formId: '',
        isShow: false
      }
    }
  },
  created () {
  },
  filters: {
  },
  mounted () {
    this.getData(this.search)
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + "px"
    this.isMounted = true;
  },
  methods: {
    /**
     * 重置
     */
    reset () {
      this.search = {//查询
        current: 1,//页数
        rowCount: 15,
      }
      this.getData(this.search)
    },
    /**
     * 查询列表数据
     */
    query () {
      this.search.current = 1
      this.getData(this.search)
    },
    /**
     * 填入数据
     */
    getData (data) {
      data.type = '2';
      this.API.send(this.CFG.services.ecRefApply.list, data, function (res) {
        res = res.serviceResult;
        this.list = res.rows || [];
        this.total = res.total>=0 ? res.total : this.total;
      }, function () {
      }, this)
    },
    /**
     * 点击当前页面
     * 加载数据
     */
    currentPager (current) {
      this.search.current = current
      this.getData(this.search)
    },
    /**
     * 确认操作
     */
    checkEnter (row) {
      this.examine = { id: row.id}
      this.isShowCheck = true;
    },
    /**
     * 审核
     */
    checkEnterA (row) {
      this.examine = { id: row.id };
      this.isShowCheckA = true;
    },
    toCheckEnterA () {
      if (!this.examine.action) {
        this.$toast({ text: `请选择审核状态` });
        return false
      } else if (this.examine.action === 2 && !this.examine.auditComment) {
        this.$toast({ text: `请输入审核备注` });
        return false
      }
      this.examine.auditAction = this.examine.action;
      this.API.send(this.CFG.services.ecRefApply.audit, this.examine, function () {
        this.$toast({ text: `操作成功` });
        this.isShowCheckA = false
        this.getData(this.search)
      }, function () { }, this)
    },
    /**
     * 确认
     */
    toCheckEnter () {
      if (!this.examine.action) {
        this.$toast({ text: `请选择审核状态` });
        return false
      } else if (!this.examine.auditComment) {
        this.$toast({ text: `请输入审核备注` });
        return false
      }
      this.examine.auditAction = this.examine.action;
      this.API.send(this.CFG.services.ecRefApply.audit, this.examine, function () {
        this.$toast({ text: `操作成功` });
        this.isShowCheck = false
        this.getData(this.search)
      }, function () { }, this)
    },
    /**
     * 新增
     */
    add () {
      this.$router.push({
        path: '/admin/agreementContactChangeCreate',
      })
    },
    /**
     * 编辑
     */
    edit (scope) {
      this.$router.push({
        path: '/admin/agreementContactChangeEdit',
        query: {
          id: scope.id,
        }
      })
    },
    /**
     * 删除
     */
    toDeleted(entity) {
      let that = this;
      this.$confirm({
        title: '提示',
        text: '确定要删除此数据吗？',
        buttons: [
          {
            text: '取消',
            type: 'follow'
          },
          {
            text: '确定',
            type: 'primary',
            callback: function () {
              let args = {
                id: entity.id
              }
              that.API.send(that.CFG.services.ecRefApply.delete, args, function () {
                that.$toast({text: '操作成功'});
                that.updateCurrentPage();
              }, function () {
              }, that)
            }
          }
        ]
      })
    },
    /**
     * 详情
     */
    details (scope) {
      this.$router.push({
        path: '/admin/agreementContactChangeDetail',
        query: {
          id: scope.id,
        }
      })
    },
    /**
     * 更新表格
     */
    updateCurrentPage(){
      this.getData(this.search)
    },
    /**
     * 打开流程
     * @param {*} row 
     */
    openFlow(row) {
      console.log('row:', row)
      this.flowObj.formId = row.id
      this.flowObj.isShow = true;
    },
    /**
     * 关闭流程
     */
    closeFlow() {
      this.flowObj.isShow = false;
    }
  }
}
</script>

