<template>
  <div class="viewport-fixed">
    <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="currentPager"
        :page-size="searchParams.rowCount"
        :current-page="searchParams.current"
        :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
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
                clearable
                @input="$forceUpdate()"
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
            <div class="search-bar-item">
              <el-select v-model="searchParams.auditStatus" @input="$forceUpdate()" size="small" class="flex-flex-auto"
                placeholder="审核状态">
                <el-option label="申请中" value='1'></el-option>
                <el-option label="已驳回" value='3'></el-option>
                
                <el-option label="审核通过" value='6'></el-option>
                <el-option label="审批通过" value='2'></el-option>
              </el-select>
            </div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click="search">查询</el-button>
              <el-button size="small" type="primary" @click="reset">重置</el-button>
              <el-button size="small" v-if="permissions.names.add" type="primary" @click="toAdd">新增调整申请</el-button>
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <div>
              <el-table
                :data="list"
                :height="gridHeight"
                v-if="isMounted"
                width="100%" border ref="gridTable">
                <el-table-column
                  prop="type"
                  label="单据类型"
                  min-width="130"
                  align='center'
                  :resizable="false">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === '1' || scope.row.type === '3'">结算价格新增待生效数据调整单</span>
                    <span v-else-if="scope.row.type === '2' || scope.row.type === '4'">结算价格修改待生效数据调整单</span>
                    <span v-else-if="scope.row.type === '5' || scope.row.type === '6'">结算价格关停待生效数据调整单</span>
                  </template>
                </el-table-column>
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
                <el-table-column
                  prop="directiveType"
                  label="指令状态"
                  min-width="130"
                  align='center'
                  :resizable="false">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.directiveType || scope.row.directiveType=='1'">调整</span>
                    <span v-else-if="scope.row.directiveType=='2'">终止</span>
                  </template>
                </el-table-column>
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
                <!-- <el-table-column
                  prop="applicantName"
                  label="最后修改人"
                  min-width="120"
                  align='center'
                  :resizable="false">
                  <template slot-scope="scope">
                    <span v-if="scope.row.applicant === 'system'">系统自动</span>
                    <span v-else>{{scope.row.applicantName | formatEmpty('--')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="applicationDate"
                  label="最后修改时间"
                  min-width="120"
                  align='center'
                  :resizable="false">
                  <template slot-scope="scope">
                    {{scope.row.applicationDate | formatDate('yyyy-MM-dd hh:mm:ss')}}
                  </template>
                </el-table-column> -->
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
                <el-table-column
                  prop="db"
                  :fixed="'right'"
                  label="操作"
                  min-width="140"
                  align='center'
                  :resizable="false">
                  <template slot-scope="scope">
                    <p>
                      <span class="link" @click="toReady(scope.row)">查看</span>
                      <span v-if="permissions.names.modify && (scope.row.auditStatus === '1' || scope.row.auditStatus === '3')" class="link ml10" @click="toEdit(scope.row)">编辑</span> 
                      <span v-else class="ml10 darkgray">编辑</span>
                    </p>
                    <p>
                    <span v-if="permissions.names.verify">
                      <span v-if="scope.row.auditStatus === '1'" class="link" @click="checkEnter(scope.row)">审核</span>
                      <span v-else class="darkgray">审核</span>
                    </span>
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
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="审核" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isShowCheck" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>状态：</label>
        <div class="flex-flex-auto">
          <el-radio-group v-model="examine.action" @input="$forceUpdate()">
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
    <el-dialog title="审批" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isShowCheckA" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>状态：</label>
        <div class="flex-flex-auto">
          <el-radio-group v-model="examine.action" @input="$forceUpdate()">
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
    <el-dialog title="作废申请-调整" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isCancel" width="400px" center>
      <!-- <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>生效类型：</label>
        <div class="flex-flex-auto">
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="1" size="small">立即生效</el-radio>
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="2" size="small">延迟生效</el-radio>
        </div>
      </div> -->
      <!-- <div class="mt15 flex flex-content-start flex-items-center" v-if="checkData.effectType === '2'">
        <label class="form-label"><span class="red">*</span>生效时间：</label>
        <div class="flex-flex-auto">
          <el-date-picker
            v-model="checkData.effectiveTime"
            @input="$forceUpdate()"
            value-format="timestamp"
            size="small"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </div>
      </div> -->
      <div class="mt15 flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>关停时间：</label>
        <div class="flex-flex-auto">
          <el-date-picker
            v-model="checkData.invalidTime"
            @input="$forceUpdate()"
            value-format="timestamp"
            size="small"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center">
        <div class="flex-flex-auto tac">
          <span type="btn" @click="toEditEntter" class="btn btn-primary btn-xl">
            确定
          </span>
          <span class="btn btn-xl ml20" @click="isCancel=false">
            取消
          </span>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="选择调整单据类型" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isAdd" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>单据类型：</label>
        <div class="flex-flex-auto">
          <el-select v-model="type" size="small" class="full"
            placeholder="单据类型">
            <el-option label="结算价格新增申请" value='1'></el-option>
            <el-option label="结算价格修改申请" value='2'></el-option>           
            <el-option label="结算价格关停申请" value='5'></el-option>
          </el-select>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center">
        <div class="flex-flex-auto tac">
          <span type="btn" @click="toAddEnter" class="btn btn-primary btn-xl">
            确定
          </span>
          <span class="btn btn-xl ml20" @click="isAdd=false">
            取消
          </span>
        </div>
      </div>
    </el-dialog>
    <!-- 
      查数据
    -->
    <!-- 
      进行弹框选择数据
    -->
    <div class="viewport-fixed bg-white power-zi101" v-if="selectOrgConfig.show">
      <selectOrg ref="addOrg" v-if="selectOrgConfig.show" :selectOrgConfig="selectOrgConfig"></selectOrg>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import keepAliveMixin from "@/common-base/mixins/keep-alive";
  // import AreaData from "@/common-base/data-dictionary/area";
  import selectOrg from '../selectOrg';
  let commonAreaData;

  export default {
    name: 'payFormList',
    mixins: [keepAliveMixin],
    props:{
      permissions: {
        type: Object,
        default () {
          return {
            names: {},
            codes: {}
          }
        }
      },
      params: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    components: {
      selectOrg
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
        selectOrgConfig: {
          show: false,
          type: 1, //1，法人组织， 2。机构、3.自然人  4终端  5、商业
          okFn: () => {
          }
        },
        isAdd: false,
        type: null,
        currentData: null,
        isCancel: false,
        checkData: {
          effectType: '1'
        },
        isShowCheck: false,
        isShowCheckA: false,
        examine: {},
        provinces: [], // 省
        citys: [], // 市
        districts: [], // 县
        isMounted: false,
        isNCPK: false,
        NCPK: null,
        checkYzm: '',
        currentRow: {},
        currentRow_NCPK: {},
        checkRemark: '',
        checkStatus: 0,
        isEnableFixedCol: true,
        list:[],
        totalPage: 1,
        total: 0,
        gridHeight: 500,
        searchParams: {
          // industryCert: 1,
          current:1,
          rowCount:  15
        }
      }
    },
    created () {
      // eslint-disable-next-line no-undef
      commonAreaData= vue.getCommonDictionary('area')
      this.isEnableFixedCol = this.globalData.viewportWidth > 768 ? true : false
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
      this.getData(this.searchParams)
      this.provinces = commonAreaData.filter(ad => ad.p === '')
    },
    mounted () {
      this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + 'px'
      this.isMounted = true
    },
    filters: {
      /**
       * 回显中文省市县
       */
      formatArea: function(rowData) {
        let arr = []
        if(rowData.provinceCode){
          let province = commonAreaData.filter(ad => ad.c === rowData.provinceCode)
          if(province.length > 0){
            arr.push(province[0].n)
          }
        }
        if(rowData.cityCode){
          let city = commonAreaData.filter(ad => ad.c === rowData.cityCode)
          if(city.length > 0){
            arr.push(city[0].n)
          }
        }
        if(rowData.districtCode){
          let district = commonAreaData.filter(ad => ad.c === rowData.districtCode)
          if(district.length > 0){
            arr.push(district[0].n)
          }
        }
        return arr.length > 0 ? arr.join(' ') : '全国'
      },
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
      toEditEntter (){
        // if (!this.checkData.effectType) {
        //   this.$toast({ text: `请选择生效类型` });
        //   return false
        // } else if (this.checkData.effectType === '2' && !this.checkData.effectiveTime) {
        //   this.$toast({ text: `请选择生效时间` });
        //   return false
        // }
        if (!this.checkData.invalidTime) {
          this.$toast({ text: `请选择关停时间` });
          return false
        }
        this.API.send(this.CFG.services.settlementNew.queryForm, {id: this.formData.id}, function (res) {
          res = res.serviceResult || {};
          this.currentData = res
          // this.currentData.selfDescriptionVersion = 'DCOXYGENTHERAPY-0001'
          // this.currentData.effectType = this.checkData.effectType
          // this.currentData.effectiveTime = this.checkData.effectiveTime
          // if(this.currentData.effectType === '1'){
          //   delete this.currentData.effectiveTime
          // }
          this.currentData.invalidTime = this.checkData.invalidTime
          // 根据原单据类型改成对应的调整单 5=>6 2=>4  1=>3
          if(this.currentData.type === '5'){
            this.currentData.type = '6'
          }
          this.API.send(this.CFG.services.settlementNew.upsertAdjust, this.currentData, function () {
            this.$toast({text: '操作成功'})
            this.isCancel = false
            this.updateCurrentPage();
          }, function () {
          }, this)
        }, function () {
        }, this);
      },
      /**
       * 删除操作
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
       * 审核操作
       */
      checkEnter (row) {
        this.examine = {id: row.id, effectType: row.effectType}
        this.isShowCheck = true
        this.examine.action = 1
      },
      /**
       * 审批操作
       */
      checkEnterA (row) {
        this.examine = {id: row.id, effectType: row.effectType}
        this.isShowCheckA = true
        this.examine.action = 1
      },
      /**
       * 确认审批
       */
      toCheckEnterA () {
        if (!this.examine.action) {
          this.$toast({ text: `请选择审批状态` });
          return false
        } else if (this.examine.action === 2 && !this.examine.auditComment) {
          this.$toast({ text: `请输入审批备注` });
          return false
        }
        this.examine.auditAction = this.examine.action
        // this.examine.selfDescriptionVersion = 'DCOXYGENTHERAPY-0001';
        // // 为生成快照信息 需要view接口获取全量数据 传给后端
        // this.API.send(this.CFG.services.settlementNew.view, {id: this.examine.id}, function (res) {
        //   res = res.serviceResult || {};
        //   res = this.utils.extend({}, res, this.examine);
        //   this.API.send(this.CFG.services.settlementNew.auditForm, res, function () {
        //     this.$toast({ text: `操作成功` });
        //     this.isShowCheckA = false
        //     this.getData(this.search)
        //   }, function () { }, this)
        // }, function () {
        // }, this);
        this.API.send(this.CFG.services.settlementNew.auditForm, this.examine, function () {
          this.$toast({ text: `操作成功` });
          this.isShowCheckA = false
          this.getData(this.searchParams)
        }, function () { }, this)
      },
      /**
       * 确认审批
       */
      toCheckEnter () {
        if (!this.examine.action) {
          this.$toast({ text: `请选择审核状态` });
          return false
        } else if (this.examine.action === 2 && !this.examine.auditComment) {
          this.$toast({ text: `请输入审核备注` });
          return false
        }
        this.examine.auditAction = this.examine.action
        this.API.send(this.CFG.services.settlementNew.auditForm, this.examine, function () {
          this.$toast({ text: `操作成功` });
          this.isShowCheck = false
          this.getData(this.searchParams)
        }, function () { }, this)
      },
      /**
       * 省变更操作
       */
      handleProvinceChange () {
        this.searchParams.cityCode = ''
        this.searchParams.districtCode = ''
        this.citys = []
        let citys = []

        if (this.searchParams.provinceCode) {
          citys = commonAreaData.filter(ad => ad.p === this.searchParams.provinceCode)
        }
        citys.unshift({c: '', n: '请选择...'})
        this.citys = citys
        this.districts = [{c: '', n: '请选择...'}]
        this.$forceUpdate()
      },
      /**
       * 市变更操作
       */
      handleCityChange () {
        this.searchParams.districtCode = '';
        this.districts = []
        let districts = []
        if (this.searchParams.cityCode) {
          districts = commonAreaData.filter(ad => ad.p === this.searchParams.cityCode)
        }
        districts.unshift({c: '', n: '请选择...'})
        this.districts = districts
      },
      /**
       * 县变更操作
       */
      handleDistrictChange () {
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
      /**
       * 获取数据信息
       */
      getData(args){
        args.typeList = ['3','4','6','7'];
        this.API.send(this.CFG.services.settlementNew.queryPagedAdjustList, args, function (res) {
          res = res.serviceResult;
          this.list = res.rows || []
          this.list.forEach(item => {
            if(this.CFG.projects.filter(entity => entity.id === item.source) && this.CFG.projects.filter(entity => entity.id === item.source).length){
              item.sourceName = this.CFG.projects.filter(entity => entity.id === item.source)[0].title
            }
          })
          this.total = res.total>=0 ? res.total : this.total;
        }, function () {
        }, this)
      },
      /**
       * 重置操作
       * 清空搜索条件
       */
      reset(){
        this.searchParams = {
          current:1,
          rowCount:  15
        }
        this.getData(this.searchParams)
      },
      /**
       * 当前页操作
       */
      currentPager (pager) {
        this.searchParams.current = pager
        this.getData(this.searchParams)
      },
      /**
       * 更新当前页内容
       */
      updateCurrentPage () {
        this.getData(this.searchParams)
      },
      /**
       * 查询操作
       */
      search () {
        this.searchParams.current = 1;
        this.getData(this.searchParams)
      },
      /**
       * 新增
       */
      toAdd(){
        this.isAdd = true;
      },
      /**
       * 确认新增
       */
      toAddEnter(){
        if(!this.type){
          this.$toast({text: '请选择调整单据类型'});
          return false;
        }
        this.isAdd = false;
        this.$router.push({
          path: '/admin/settlementPriceAdjustGoCreate',
          query:{
            type: this.type
          }
        })
      },
      /**
       * 跳转详情
       */
      toReady(item){
        let strA = ''
        if(item.type){
          if(item.type === '1' || item.type === '3'){
            strA = '/admin/settlementPriceAdjustDetailApply'
          }
          if(item.type === '2' || item.type === '4'){
            strA = '/admin/settlementPriceAdjustDetailChange'
          }
          if(item.type === '5' || item.type === '6'){
            strA = '/admin/settlementPriceAdjustDetailCancel'
          }
          this.$router.push({
            path: strA,
            query:{
              id: item.id
            }
          })
        }
      },
      /**
       * 跳转编辑
       */
      toEdit(item){
        let strA = ''
        if(item.type){
          if(item.type === '1' || item.type === '3'){
            strA = '/admin/settlementPriceAdjustEditApply'
          }
          if(item.type === '2' || item.type === '4'){
            strA = '/admin/settlementPriceAdjustEditChange'
          }
          if(item.type === '5' || item.type === '6'){
            this.formData = item
            this.isCancel = true
            // this.checkData = { certId: item.id, subjectId: item.subjectId, effectType: '1' }
            this.checkData.effectType = item.effectType
            this.checkData.effectiveTime = item.effectiveTime
          }
          this.$router.push({
            path: strA,
            query:{
              id: item.id
            }
          })
        }
      },
      /**
       * 删除操作
       */
      toDelete (entity){
        let that = this;
        this.$confirm({
          title: '提示',
          text: '确定要删除吗？',
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
                  // deleteState: true,
                  id: entity.id
                }
                that.API.send(that.CFG.services.uaapi.deletedCaOrganize, args, function () {
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
       * 审核操作
       */
      toCheck(row){
        this.currentRow = row
        this.isShowCheck = true
        this.checkRemark = ''
        this.checkStatus = 0
        this.NCPK = (row.ncId && row.ncId !== null) ? row.ncId : null
      },
      /**
       * 取消审核操作
       */
      cancel_check() {
        this.isShowCheck = false
      },
    }
  }
</script>
