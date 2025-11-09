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
                规则ID
               -->
              <el-input v-model="search.ruleId" class="full-width" size="small" placeholder="规则ID"></el-input>
            </div>
            <!-- 
            是否基于合同协议结算
            -->
            <div class="search-bar-item">
              <el-select v-model="search.isBaseContract" @change="changeType" clearable class="full-width" size="small"  placeholder="是否基于合同结算">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
              </el-select>
            </div>
            <div class="search-bar-item flex" v-if="search.isBaseContract === '1'"> 
              <!-- 
                合同ID
               -->
              <el-input v-model="search.contractId" class="full-width" size="small" placeholder="合同ID"></el-input>
            </div>
            <!-- 
              结算乙方类型
            -->
            <div class="search-bar-item">
              <el-select v-model="search.partyBType" @change="changeType" clearable class="full-width" size="small"  placeholder="结算乙方类型">
                <el-option label="业务员" value="2"></el-option>
                <el-option label="商户" value="1"></el-option>
                <el-option label="店铺" value="3"></el-option>
                <el-option label="代理（商户）" value="4"></el-option>
                <el-option label="自然人" value="5"></el-option>
                <el-option label="机构" value="6"></el-option>
              </el-select>
            </div>
            <div class="search-bar-item flex" v-if="search.partyBType === '5'"> 
              <!-- 
                自然人
                id
               -->
              <el-input v-model="search.partyBName" disabled class="full-width" size="small" placeholder="自然人"></el-input>
              <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addYiOrg"></span>
            </div>
            <div class="search-bar-item flex" v-if="search.partyBType === '6'"> 
              <!-- 
                机构
               -->
              <el-input v-model="search.partyBName" disabled class="full-width" size="small" placeholder="机构"></el-input>
              <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addJiOrg"></span>
            </div>
            <!-- 
              结算乙方类型：业务员 展示如下
            -->
            <template v-if="search.partyBType === '2'">
              <!-- 
                业务组织
              -->
              <div class="search-bar-item">
                <treeselect @input="$forceUpdate()" :options="businessOrganizationList" v-model="search.businessOrg" :appendToBody="true" placeholder="业务组织">
                </treeselect>
              </div>
              <!-- 
                业务员级别
              -->
              <div class="search-bar-item">
                <el-select @input="$forceUpdate()" v-model="search.salesmanLevel" clearable class="full-width" size="small" placeholder="业务员级别">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="一级业务员" value="1"></el-option>
                  <el-option label="二级业务员" value="2"></el-option>
                  <el-option label="三级业务员" value="3"></el-option>
                  <el-option label="四级业务员" value="4"></el-option>
                  <el-option label="五级业务员" value="5"></el-option>
                  <el-option label="六级业务员" value="6"></el-option>
                  <el-option label="七级业务员" value="7"></el-option>
                  <el-option label="八级业务员" value="8"></el-option>
                  <el-option label="九级业务员" value="9"></el-option>
                  <el-option label="十级业务员" value="10"></el-option>
                </el-select>
              </div>
            </template>
            <!-- 
              结算乙方类型：商户 展示如下
            -->
            <template v-if="search.partyBType === '1'">
              <div class="search-bar-item">
                <el-select @input="$forceUpdate()" v-model="search.partyBId" clearable class="full-width" size="small"  placeholder="商户名称"
                  :filterable="true" :remote="true" :remote-method="remotePrivateMasterList">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="el of privateMasterList" :key="el.c" :label="el.n" :value="el.c"></el-option>
                </el-select>
              </div>
            </template>
            <!-- 
              结算乙方类型：店铺 展示如下
            -->
            <template v-if="search.partyBType === '3'">
              <div class="search-bar-item">
                <el-select @input="$forceUpdate()" v-model="search.partyBId" clearable class="full-width" size="small"  placeholder="店铺名称"
                  :filterable="true" :remote="true" :remote-method="remotePrivateMasterList">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="el of privateMasterList" :key="el.c" :label="el.n" :value="el.c"></el-option>
                </el-select>
              </div>
            </template>
            <!-- 
              结算乙方类型：代理（商户） 展示如下
            -->
            <template v-if="search.partyBType === '4'">
              <div class="search-bar-item">
                <el-select @input="$forceUpdate()" v-model="search.partyBId" clearable class="full-width" size="small"  placeholder="代理（商户）"
                  :filterable="true" :remote="true" :remote-method="remotePrivateDlList">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="el of privateDlList" :key="el.c" :label="el.n" :value="el.c"></el-option>
                </el-select>
              </div>
            </template>
            <!-- 
              商品名称
            -->
            <div class="search-bar-item">
              <el-select
                v-model="search.ootId"
                @input="$forceUpdate()"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="商品名称"
                :remote-method="getOot"
                size="small">
                <el-option
                  v-for="item in ootList"
                  :key="item.c"
                  :label="item.n"
                  :value="item.c">
                </el-option>
              </el-select>
            </div>
            <!-- 
              销售类型
            -->
            <!-- <div class="search-bar-item">
              <el-select v-model="search.businessType" clearable class="full-width" size="small"  placeholder="销售类型">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in businessTypeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div> -->
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
                规则ID
              -->
              <el-table-column
                prop="resultId"
                label="规则ID"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.resultId | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                是否基于合同结算
              -->
              <el-table-column
                prop="isBaseContract"
                label="是否基于合同结算"
                min-width="140"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.isBaseContract=='1'">是</span>
                    <span v-else-if="scope.row.isBaseContract=='2'">否</span>
                </template>
              </el-table-column>
              <!-- 
                合同ID
              -->
              <el-table-column
                prop="contractId"
                label="合同ID"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.contractId| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                结算甲方类型
              -->
              <el-table-column
                prop="partyAType"
                label="结算甲方类型"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.partyAType=='0'">业务组织</span>
                    <span v-else-if="scope.row.partyAType=='1'">商户</span>
                    <span v-else-if="scope.row.partyAType=='2'">业务员</span>
                    <span v-else-if="scope.row.partyAType=='3'">店铺</span>
                    <span v-else-if="scope.row.partyAType=='4'">代理（商户）</span>
                    <span v-else-if="scope.row.partyAType=='5'">自然人</span>
                    <span v-else-if="scope.row.partyAType=='6'">机构</span>
                    <span v-else>--</span>
                </template>
              </el-table-column>
              <!-- 
                结算甲方
              -->
              <el-table-column
                prop="partyAName"
                label="结算甲方"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.partyAName| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                结算乙方类型
              -->
              <el-table-column
                prop="partyBType"
                label="结算乙方类型"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.partyBType=='0'">业务组织</span>
                    <span v-else-if="scope.row.partyBType=='1'">商户</span>
                    <span v-else-if="scope.row.partyBType=='2'">业务员</span>
                    <span v-else-if="scope.row.partyBType=='3'">店铺</span>
                    <span v-else-if="scope.row.partyBType=='4'">代理（商户）</span>
                    <span v-else-if="scope.row.partyBType=='5'">自然人</span>
                    <span v-else-if="scope.row.partyBType=='6'">机构</span>
                    <span v-else>--</span>
                </template>
              </el-table-column>
              <!-- 
                结算乙方
              -->
              <!-- <el-table-column
                prop="partyB"
                label="结算乙方"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.partyB| formatEmpty('--')}}
                </template>
              </el-table-column> -->
              <!-- 
                业务组织
              -->
              <el-table-column
                prop="partyBName"
                label="结算乙方"
                min-width="180"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.partyBName| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                业务员级别
              -->
              <el-table-column
                prop="salesmanLevel"
                label="业务员级别"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.salesmanLevel| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                商户
              -->
              <!-- <el-table-column
                prop="privateMaster"
                label="商户"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.privateMaster| formatEmpty('--')}}
                </template>
              </el-table-column> -->
              <!-- 
                店铺
              -->
              <!-- <el-table-column
                prop="mallShop"
                label="店铺"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.mallShop| formatEmpty('--')}}
                </template>
              </el-table-column> -->
              <!-- 
                代理（商户）
              -->
              <!-- <el-table-column
                prop="agentName"
                label="代理（商户）"
                min-width="120"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.agentName| formatEmpty('--')}}
                </template>
              </el-table-column> -->
              <!-- 
                销售类型
              -->
              <el-table-column
                prop="businessTypeName"
                label="销售类型"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.businessTypeName| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                价格类型
              -->
              <el-table-column
                prop="priceTypeName"
                label="价格类型"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.priceTypeName| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                结算规则
              -->
              <el-table-column
                prop="ruleCalcWayValue"
                label="结算规则"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.ruleCalcWayValue| formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                结算基准
              -->
              <el-table-column
                prop="ruleBenchPriceTypeValue"
                label="结算基准"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.ruleBenchPriceTypeValue | formatEmpty('--')}}
                </template>
              </el-table-column>
              <!-- 
                结算比例
              -->
              <!-- <el-table-column
                prop="settleRatioName"
                label="结算比例"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.settleRatioName| formatEmpty('--')}}
                </template>
              </el-table-column> -->
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
                prop="effectiveTime"
                label="生效时间"
                min-width="100"
                align='center'
                :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.effectiveTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
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
                    <!-- <span v-if="permissions.names.modify && (scope.row.auditStatus === '1' || scope.row.auditStatus === '3')" class="link ml10" @click="edit(scope.row)">编辑</span> 
                    <span v-else class="ml10 darkgray">编辑</span> -->
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
    <!-- 
      查数据
    -->
    <div class="viewport-fixed bg-white power-zi101" v-if="selectOrgConfig.show">
      <selectOrg ref="addOrg" v-if="selectOrgConfig.show" :selectOrgConfig="selectOrgConfig"></selectOrg>
    </div>
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
      // 代理（商户）
      privateDlList: [],
      // 商品
      ootList: [],
      // 业务员级别基础字典项
      salesman: [
        { n: '一级业务员', c: 1 },
        { n: '二级业务员', c: 2 },
        { n: '三级业务员', c: 3 },
        { n: '四级业务员', c: 4 },
        { n: '五级业务员', c: 5 },
        { n: '六级业务员', c: 6 },
        { n: '七级业务员', c: 7 },
        { n: '八级业务员', c: 8 },
        { n: '九级业务员', c: 9 },
        { n: '十级业务员', c: 10 }
      ],
      /**
       * 商户列表
       */
      privateMasterList: [],
      /**
       * 业务组织数据字典项
       */
      businessOrganizationList: [],
      /**
       * 销售类型字典项
       */
      businessTypeList: [],
      /**
       * 查询组织、自然人
       */
      selectOrgConfig: {
        show: false,
        type: 1, //1，法人组织， 2。机构、3.自然人  4终端  5、商业
        okFn: () => {
        }
      },
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
    /**
     * 加载业务组织字典项
     */
    this.getBusinessOrganizationList();
    /**
     * 加载销售类型字典项
     */
    // this.getBusinessTypeList();
    /**
     * 加载商户
     */
    this.remotePrivateMasterList();
  },
  filters: {
    formatAreaA: function(rowData) {
      let arr = []
      if(rowData.partyAProvinceCode){
        let province = commonAreaData.filter(ad => ad.c === rowData.partyAProvinceCode)
        if(province.length > 0){
          arr.push(province[0].n)
        }
      }
      if(rowData.partyAPCityCode){
        let city = commonAreaData.filter(ad => ad.c === rowData.partyAPCityCode)
        if(city.length > 0){
          arr.push(city[0].n)
        }
      }
      if(rowData.partyAPDistrictCode){
        let district = commonAreaData.filter(ad => ad.c === rowData.partyAPDistrictCode)
        if(district.length > 0){
          arr.push(district[0].n)
        }
      }
      return arr.length > 0 ? arr.join(' ') : '全国'
    },
    formatAreaB: function(rowData) {
      let arr = []
      if(rowData.partyBProvinceCode){
        let province = commonAreaData.filter(ad => ad.c === rowData.partyBProvinceCode)
        if(province.length > 0){
          arr.push(province[0].n)
        }
      }
      if(rowData.partyBPCityCode){
        let city = commonAreaData.filter(ad => ad.c === rowData.partyBPCityCode)
        if(city.length > 0){
          arr.push(city[0].n)
        }
      }
      if(rowData.partyBPDistrictCode){
        let district = commonAreaData.filter(ad => ad.c === rowData.partyBPDistrictCode)
        if(district.length > 0){
          arr.push(district[0].n)
        }
      }
      return arr.length > 0 ? arr.join(' ') : '全国'
    },
  },
  mounted () {
    this.getData(this.search)
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + "px"
    this.isMounted = true;
  },
  methods: {
    // 代理（商户）
    remotePrivateDlList(keyword) {
      this.API.send(
        this.CFG.services.agent.listAgent, {
          name: keyword,
          certificationStatus: '1',
          subjectType: '5',
          rowCount: 99,
        }, function (res) {
          res = res.serviceResult || {};
          const list = res.rows || [];
          list.forEach(item => {
            item.n = item.name;
            item.c = item.formId;
          })
          this.privateDlList = list;
        }, function () {}, this, true
      );
    },
    /**
     * 类型改变
     * 清空填写
     */
    changeType(){
      this.search.partyBName = null;
      this.search.partyBId = null;
      this.search.businessOrg = null;
      this.search.salesmanLevel = null;
      this.search.ootId = null;
      this.search.auditStatus = null;
      this.ootList = [];
      this.privateMasterList = [];
    },
    /**
     * 加载商品
     */
    getOot(query){
      let args = {
        key: query
      }
      this.API.send(this.CFG.services.oot.searchObjects, args, function (res) {
        res = res.serviceResult || [];
        this.ootList = res;
      }, function () {
      }, this)
    },
    /**
     * 加载商户
     */
    remotePrivateMasterList(keyword) {
      this.API.send(
        this.CFG.services.settlement.searchPrivateMaster, {keyword, rowCount: 50,}, function (res) {
          this.privateMasterList = res.serviceResult || {};
        }, function () {}, this, true);
    },
    /**
     * 加载业务组织字典项
     */
    getBusinessOrganizationList () {
      this.API.send( this.CFG.services.jupiter.queryAllBusiness, {}, function (res) {
        res = res.serviceResult;
        res.forEach(i => {
          i.label = i.name;
          if(this.disabled){
            i.isDisabled = true;
            i.isNew = true;
          }
        });
        let data = this.utils.deepCopy(res);
        this.businessOrganizationList = this.utils.array2tree(data, 'id', 'parentId')
      },
      function () {}, this, true);
    },
    /**
     * 加载销售类型字典项
     */
    getBusinessTypeList () {
      console.info('销售类型')
      this.API.send(this.CFG.services.lp.queryBusinessTypeList, {}, function (res) {
        res = res.serviceResult || [];
        this.businessTypeList = res;
      },
      function () {}, this);
    },
    /**
     * 查机构
     */
     addJiOrg(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 1;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        /***
         *
         * 机构信息
         * **/
        this.search.partyBId = row.id;
        this.search.partyBName = row.name;
      }
    },
    /**
     * 查自然人
     */
    addYiOrg(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 3;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        /***
         *
         * 机构信息
         * **/
        this.search.partyBId = row.id;
        this.search.partyBName = row.name;
      }
    },
    /**
     * 设置表格行背景色
     */
    rowclassName (scope) {
      if (scope.row.auditStatus === 4) {
        return 'disabled-row';
      }
      return '';
    },
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
      this.API.send(this.CFG.services.settlementNew.queryPagedInvalidList, data, function (res) {
        res = res.serviceResult;
        this.list = res.rows || [];
        this.total = res.total>=0 ? res.total : this.total;
        // this.list.forEach(item => {
        //   // item.businessTypeName = item.businessType ? item.businessType.split(',') : '';
        //   // item.settleRatioName = item.settleRatio ? (item.settleRatio * 100).toFixed(2) + '%' : '';
        // })
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
      this.API.send(this.CFG.services.settlementNew.auditForm, this.examine, function () {
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
      this.API.send(this.CFG.services.settlementNew.auditForm, this.examine, function () {
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
        path: '/admin/settlementPriceCancelCreate',
      })
    },
    /**
     * 编辑
     */
    edit (scope) {
      this.$router.push({
        path: '/admin/settlementPriceCancelEdit',
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
              that.API.send(that.CFG.services.settlementNew.delete, args, function () {
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
        path: '/admin/settlementPriceCancelDetail',
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
<style lang="scss" scoped>
  .warn-txt{
    padding: 10px 0;
    color: red;
  }
</style>