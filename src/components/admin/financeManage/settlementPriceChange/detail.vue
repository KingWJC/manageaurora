<template>
  <div class="viewport-fixed" ref="viewBody">
    <!-- 
      返回
    -->
    <crumbs-bar></crumbs-bar>
    <!-- 
      底部保存
    -->
    <!-- <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center">
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="submit" @click="saveOrder">保存</button>
      </div>
    </div> -->
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column" id="step1">
        <div class="panel-content-padded ">
          <h2>结算价格修改规则申请单-详情</h2>
          <!-- 
            是否选择已有合同
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>是否选择已有合同</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- 
                    可以选择已有合同
                    可以不选择按原来逻辑
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-items-center">
                      <label class="label nowrap">
                        <span class="red">*</span>是否选择已有合同:
                      </label>
                      <div class="flex-flex-auto flex">
                        <el-select v-model="orderData.isBaseContract"
                          class="full-width"
                          disabled
                          placeholder="请选择"
                          @change="hasChange"
                          size="small">
                          <el-option
                            label="是"
                            value="1">
                          </el-option>
                          <el-option
                            label="否"
                            value="2">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 
                  选择合同
                -->
                <!-- <div class="lc-col-12 lc-col-xs10 pt15 pb5" v-if="orderData.isBaseContract === '1'">
                  <div class="flex flex-content-start flex-items-center">
                    <el-button size="small" type="primary" @click="addContract">选择合同</el-button>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <!-- 
            结算方信息
            有合同isHasShow true
          -->
          <div class="card card-shadow" v-if="isHasShow">
            <div class="card-body">
              <div class="card-header">
                <strong>结算方信息</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div v-for="(item, index) in enterList" :key="index">
                    <div class="lc-col-12 lc-col-xs12 mt10">
                      <el-table :data="fangData[index]" max-height="200" width="100%" border stripe ref="gridTable">
                        <!-- 
                          方名称
                        -->
                        <el-table-column
                          prop="subjectName"
                          :label="item.name + '名称'"
                          min-width="120"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            <div class="flex-flex-auto">
                              <span v-if="scope.row.subjectName">{{scope.row.subjectName}}</span>
                            </div>
                          </template>
                        </el-table-column>
                        <!-- 
                          方地址
                        -->
                        <el-table-column
                          prop="subjectAddress"
                          label="地址"
                          min-width="160"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            {{scope.row.subjectAddress | formatEmpty('--')}}
                          </template>
                        </el-table-column>
                        <!-- 
                          方电话
                        -->
                        <el-table-column
                          prop="subjectCellphone"
                          label="手机号"
                          min-width="120"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            {{scope.row.subjectCellphone | formatEmpty('--')}}
                          </template>
                        </el-table-column>
                        <!-- 
                          签约代表
                        -->
                        <!-- <el-table-column
                          prop="deputyName"
                          :label="item.name + '签约代表'"
                          min-width="120"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            <div class="flex-flex-auto">
                              <span v-if="scope.row.deputyName">{{scope.row.deputyName}}</span>
                            </div>
                          </template>
                        </el-table-column> -->
                        <!-- 
                          手机号
                        -->
                        <!-- <el-table-column
                          prop="deputyCellphone"
                          label="手机号"
                          min-width="120"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            {{scope.row.deputyCellphone | formatEmpty('--')}}
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            无合同
            orderData.isBaseContract !== '1'
          -->
          <!-- 
            选择无合同
            沿用原逻辑结算甲方
          -->
          <div class="card card-shadow" v-if="orderData.isBaseContract !== '1'">
            <div class="card-body">
              <div class="card-header">
                <strong>结算甲方</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- 
                    类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>类型:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.partyA.partySubjectType"
                          disabled
                          @change="changePartyAType"
                          @input="$forceUpdate()"
                          class="full-width power-minw90" size="small"
                          placeholder="请选择">
                          <el-option
                            label="机构"
                            value="6">
                          </el-option>
                          <el-option
                            label="商户"
                            value="1">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <template v-if="orderData.partyA.partySubjectType === '6'">
                    <!-- 
                      名称
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>结算甲方(机构):</label>
                        <div class="flex flex-flex-auto">
                          <el-input v-model="orderData.partyA.partyName" disabled  class="full-width" size="small" placeholder="请填写内容"></el-input>
                          <!-- <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addOrgD"></span> -->
                        </div>
                      </div>
                    </div>
                    <!-- 
                      联系人
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">联系人:</label>
                        <div class="flex-flex-auto">
                          <el-input v-model="orderData.partyA.partyLinkmanName"  class="full-width" disabled size="small" placeholder="请填写内容"></el-input>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      联系人电话
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">联系人电话:</label>
                        <div class="flex-flex-auto">
                          <el-input v-model="orderData.partyA.partyLinkmanCellphone"  class="full-width" disabled size="small" placeholder="请填写内容"></el-input>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      地址
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">地址:</label>
                        <div class="flex-flex-auto">
                          <el-input v-model="orderData.partyA.partyAddress"  class="full-width" disabled size="small" placeholder="请填写内容"></el-input>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-if="orderData.partyA.partySubjectType === '1'">
                    <!-- 
                      名称
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>结算甲方(商户):</label>
                        <div class="flex flex-flex-auto">
                          <el-input v-model="orderData.partyA.partyName" disabled  class="full-width" size="small" placeholder="请填写内容"></el-input>
                          <!-- <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addOrgE"></span> -->
                        </div>
                      </div>
                    </div>
                    <!-- 
                      增加商户分类的展示
                    -->
                    <!-- <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">商户分类:</label>
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="orderData.partyA.category"
                            disabled
                            placeholder="请填写内容"
                            size="small"
                            class="full-width">
                            <el-option
                              label="私域商城"
                              value="1">
                            </el-option>
                            <el-option
                              label="云药房"
                              value="2">
                            </el-option>
                            <el-option
                              label="云诊室"
                              value="3">
                            </el-option>
                            <el-option
                              label="药发采"
                              value="4">
                            </el-option>
                            <el-option
                              label="云氧疗"
                              value="5">
                            </el-option>
                            <el-option
                              label="云药房S"
                              value="6">
                            </el-option>
                            <el-option
                              label="逆时舱"
                              value="7">
                            </el-option>
                            <el-option label="万众创业商户" value="8"></el-option>
                          </el-select>
                        </div>
                      </div>
                    </div> -->
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            选择无合同
            沿用原逻辑结算乙方
          -->
          <div class="card card-shadow" v-if="orderData.isBaseContract !== '1'">
            <div class="card-body">
              <div class="card-header">
                <strong>结算乙方</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- 
                    类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>类型:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.partyB.partySubjectType"
                          @change="changePartyBType"
                          disabled
                          @input="$forceUpdate()"
                          class="full-width power-minw90" size="small"
                          placeholder="请选择">
                          <!-- <el-option
                            label="业务员"
                            value="2">
                          </el-option> -->
                          <el-option
                            label="业务组织"
                            value="0">
                          </el-option>
                          <el-option
                            label="商户"
                            value="1">
                          </el-option>
                          <el-option
                            label="店铺"
                            value="3">
                          </el-option>
                          <el-option
                            label="代理（商户）"
                            value="4">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    业务员
                  -->
                  <template v-if="orderData.partyB.partySubjectType === '0'">
                    <!-- 
                      名称
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>业务员级别:</label>
                        <div class="flex flex-flex-auto">
                          <el-select disabled v-model="orderData.partyB.salesmanLevel" @input="$forceUpdate()" clearable class="full-width" size="small" placeholder="业务员级别">
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
                      </div>
                    </div>
                    <!-- 
                      业务组织
                    -->
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>业务组织:</label>
                        <div class="flex-flex-auto">
                          <treeselect disabled :options="businessOrganizationList" multiple v-model="orderData.partyB.businessOrgIdList" :appendToBody="true" placeholder="业务组织"></treeselect>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 
                    商户
                  -->
                  <template v-if="orderData.partyB.partySubjectType === '1'">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>指定类型:</label>
                        <div class="flex-flex-auto">
                          <el-select v-model="orderData.partyB.scope"
                            @input="$forceUpdate()"
                            disabled
                            class="full-width power-minw90" size="small"
                            placeholder="请选择">
                            <el-option
                              label="单一指定"
                              value="1">
                            </el-option>
                            <el-option
                              label="批量指定"
                              value="0">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      单一指定
                    -->
                    <div class="lc-col-12 lc-col-xs6" v-if="orderData.partyB.scope === '1'">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>商户:</label>
                        <div class="flex flex-flex-auto">
                          <!-- 
                            多选商户
                          -->
                          <el-select
                            v-model="orderData.partyB.partyId"
                            filterable
                            disabled
                            @input="$forceUpdate()"
                            multiple
                            remote
                            reserve-keyword
                            placeholder="请填写内容"
                            :remote-method="getprivateMasterList"
                            class="full-width power-minw90" size="small"
                            >
                            <el-option
                              v-for="item in privateMasterList"
                              :key="item.c"
                              :label="item.n"
                              :value="item.c">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      批量指定
                    -->
                    <div class="lc-col-12 lc-col-xs6" v-if="orderData.partyB.scope === '0'">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>商户分类:</label>
                        <div class="flex flex-flex-auto">
                          <el-select
                            v-model="orderData.partyB.merchantCategoryList"
                            placeholder="请填写内容"
                            disabled
                            @input="$forceUpdate()"
                            multiple
                            size="small"
                            class="full-width">
                            <el-option
                              label="私域商城"
                              value="1">
                            </el-option>
                            <el-option
                              label="云药房"
                              value="2">
                            </el-option>
                            <el-option
                              label="云诊室"
                              value="3">
                            </el-option>
                            <el-option
                              label="药发采"
                              value="4">
                            </el-option>
                            <el-option
                              label="云氧疗"
                              value="5">
                            </el-option>
                            <el-option
                              label="云药房S"
                              value="6">
                            </el-option>
                            <el-option
                              label="逆时舱"
                              value="7">
                            </el-option>
                            <el-option label="万众创业商户" value="8"></el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6" v-if="orderData.partyB.scope === '0'">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">商户类型:</label>
                        <div class="flex flex-flex-auto">
                          <el-select
                            v-model="orderData.partyB.merchantTypeList"
                            placeholder="请填写内容"
                            disabled
                            @input="$forceUpdate()"
                            multiple
                            size="small"
                            class="full-width">
                            <el-option v-for="item in shopTypeList"
                              :label="item.name"
                              :value="item.code">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 
                    店铺
                  -->
                  <template v-if="orderData.partyB.partySubjectType === '3'">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>店铺:</label>
                        <div class="flex flex-flex-auto">
                          <!-- 
                            店铺
                          -->
                          <el-select
                            v-model="orderData.partyB.partyId"
                            filterable
                            disabled
                            @input="$forceUpdate()"
                            remote
                            reserve-keyword
                            placeholder="请填写内容"
                            :remote-method="remotePrivateShopList"
                            class="full-width power-minw90" size="small"
                            >
                            <el-option
                              v-for="item in privateMallShopList"
                              :key="item.c"
                              :label="item.n"
                              :value="item.c">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 
                    代理（商户）
                  -->
                  <template v-if="orderData.partyB.partySubjectType === '4'">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"><span class="red">*</span>代理（商户）:</label>
                        <div class="flex flex-flex-auto">
                          <!-- 
                            代理（商户）
                          -->
                          <el-select
                            v-model="orderData.partyB.partyId"
                            filterable
                            disabled
                            @input="$forceUpdate()"
                            remote
                            reserve-keyword
                            placeholder="请填写内容"
                            :remote-method="remotePrivateDlList"
                            class="full-width power-minw90" size="small"
                            >
                            <el-option
                              v-for="item in privateDlList"
                              :key="item.c"
                              :label="item.n"
                              :value="item.c">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            结算标的信息
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong><span class="red">*</span>结算信息</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- 
                    销售类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>销售类型:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.businessTypeList"
                          class="full-width power-minw90" size="small"
                          multiple
                          disabled
                          placeholder="请选择">
                          <el-option v-for="item in listBusinessTypeOpts" :key="item.code" :label="item.name" :value='item.code'></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    交易价格类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>交易价格类型:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.priceTypeList"
                          class="full-width power-minw90" size="small"
                          multiple
                          disabled
                          placeholder="请选择">
                          <el-option v-for="item in listRatioTypeOpts" :key="item.code" :label="item.name" :value='item.code'></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    标的交易结算方式
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">标的交易结算方式:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.settlementTypeList"
                          class="full-width power-minw90" size="small"
                          multiple
                          disabled
                          placeholder="请选择">
                          <el-option v-for="item in overallDataList1" :key="item.id" :label="item.name" :value='item.id'></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    标的交易支付方式
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">标的交易支付方式:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.paymentTypeList"
                          class="full-width power-minw90" size="small"
                          multiple
                          disabled
                          placeholder="请选择">
                          <el-option v-for="item in overallDataList2" :key="item.id" :label="item.name" :value='item.id'></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    结算方式类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>结算方式类型:</label>
                      <div class="flex-flex-auto">
                        <el-radio-group v-model="orderData.calcWay" @input="changeCalcWay" disabled>
                          <el-radio
                            :label="0"
                            size="small">价格设置</el-radio>
                          <el-radio
                            :label="1"
                            size="small">比例设置</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                  <!-- 
                     比例基准价格
                  -->
                  <div class="lc-col-12 lc-col-xs6" v-if="orderData.calcWay === 1">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>比例基准价格:</label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.benchPriceType"
                          class="full-width power-minw90" size="small"
                          disabled
                          placeholder="请选择">
                          <el-option v-for="item in processlistRatioTypeOpts" :key="item.code" :label="item.name" :value='item.code'></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    添加标的
                  -->
                  <!-- <div class="lc-col-12 lc-col-xs10 pt15 pb5" v-if="orderData.isBaseContract !== '1'">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">添加标的</label>
                      <span class="el-icon-circle-plus-outline power-fs26 blue" @click="addOot"></span>
                    </div>
                  </div> -->
                  <!-- 
                    标的列表
                  -->
                  <div class="lc-col-12 lc-col-xs12">
                    <div v-for="ite in ootType" :key="ite">
                      <el-tag class="power-btrr5 mt5 power-fs16">{{ colsName[ite] }}</el-tag>
                      <el-table :data="ootListObj[ite]" width="100%" border ref="gridTable">
                        <el-table-column
                          prop="productName"
                          label="产品名称"
                          min-width="160"
                          align="center"
                          :resizable="false"
                        >
                        </el-table-column>
                        <el-table-column
                          v-if="ite !== '-1'"
                          prop="batchNoList"
                          label="批号"
                          min-width="300"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.batchNoList"
                              class="full-width power-minw90" size="small" disabled
                              @focus="getBat(ootListObj[ite],scope.row, scope.$index)"
                              multiple
                              placeholder="请选择">
                              <el-option v-for="item in scope.row.bachNums" :key="item.c" :label="item.n" :value='item.c'></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="ite !== '-1'"
                          prop="lotNoList"
                          label="批次"
                          min-width="300"
                          align='center'
                          :resizable="false">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.lotNoList"
                              class="full-width power-minw90" size="small" disabled
                              @focus="getBat(ootListObj[ite],scope.row, scope.$index)"
                              multiple
                              placeholder="请选择">
                              <el-option v-for="item in scope.row.bachs" :key="item.c" :label="item.n" :value='item.c'></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <!-- 
                          结算方式类型选择价格设置orderData.calcWay === 0
                          根据结算方个数进行循环
                        -->
                        <template v-if="orderData.calcWay === 0">
                          <el-table-column
                            v-for="(item,index) in contractData.signatoryList"
                            prop="lotNoList"
                            :label="item.fangName + '结算价格'"
                            min-width="200"
                            align='center'
                            :resizable="false">
                            <!-- 
                              item.type 代表 1甲方 2乙方 3 丙方
                            -->
                            <template slot-scope="scope">
                              <el-input-number
                                v-model="scope.row.fixedPriceObj[item.type]"
                                disabled
                                controls-position="right"
                                precision = 2
                                :min="0"
                                size="small"
                                class="full-width power-minw90"
                                placeholder="请填写内容">
                              </el-input-number>
                            </template>
                          </el-table-column>
                        </template>
                        <!-- 
                          结算方式类型选择价格比例orderData.calcWay === 1
                          根据结算方个数进行循环
                        -->
                        <template v-if="orderData.calcWay === 1">
                          <el-table-column
                            v-for="(item,index) in contractData.signatoryList"
                            prop="lotNoList"
                            :label="item.fangName + '结算比例'"
                            min-width="200"
                            align='center'
                            :resizable="false">
                            <!-- 
                              item.type 代表 1甲方 2乙方 3 丙方
                            -->
                            <template slot-scope="scope">
                              <div class="flex flex-content-start flex-items-center">
                                <el-input-number
                                  v-model="scope.row.fixedPriceObj[item.type]"
                                  disabled
                                  controls-position="right"
                                  precision = 2
                                  :min="0"
                                  size="small"
                                  class="full-width power-minw90"
                                  placeholder="请填写内容">
                                </el-input-number>
                                <span>%</span>
                              </div>
                            </template>
                          </el-table-column>
                        </template>
                        <el-table-column
                          v-for="item in cols[ite]"
                          :key="item.prop"
                          :prop="item.prop"
                          :label="item.label"
                          min-width="190"
                          align="center"
                          :resizable="false"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="db"
                          v-if="orderData.isBaseContract !== '1'"
                          :fixed="'right'"
                          :width="globalData.viewportWidth > 768 ? 160 : 100"
                          label="操作"
                          min-width="180"
                          align="center"
                          :resizable="false"
                        >
                          <template slot-scope="scope">
                            <!-- <p>
                              <span class="ml10 link">
                                <span @click="toDeleted(scope.$index, ite)">删除</span>
                              </span>
                            </p> -->
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            购方机构
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>销方机构</strong>
              </div>
              <div class="card-content-padded">
                <!-- 
                  添加机构
                -->
                <div class="lc-row lc-space16">
                  <!-- <div class="lc-col-12 lc-col-xs10">
                    <div class="flex flex-content-start flex-items-center">
                      <el-button size="small" type="primary" @click="addOrgA">添加机构</el-button>
                    </div>
                  </div> -->
                  <div class="lc-col-12 lc-col-xs12">
                    <el-table
                      :data="orderData.limitSellerList"
                      height="200"
                      width="100%"
                      border
                      ref="gridTable">
                      <!-- 
                      机构名称
                      -->
                      <el-table-column
                        prop="name"
                        label="机构名称"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                          {{ scope.row.name | formatEmpty('--') }}
                        </template>
                      </el-table-column>
                      <!-- 
                      联系人
                      -->
                      <el-table-column
                        prop="linkmanName"
                        label="联系人"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                          {{ scope.row.linkmanName | formatEmpty('--') }}
                        </template>
                      </el-table-column>
                      <!-- 
                      手机号
                      -->
                      <el-table-column
                        prop="linkmanPhone"
                        label="手机号"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                          {{ scope.row.linkmanPhone | formatEmpty('--') }}
                        </template>
                      </el-table-column>
                      <!-- 
                        省市县
                      -->
                      <el-table-column
                        prop="address"
                        label="省市县"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                         {{scope.row | formatArea()}}
                        </template>
                      </el-table-column>
                      <!-- 
                      地址
                      -->
                      <el-table-column
                        prop="address"
                        label="地址"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                          {{ scope.row.address | formatEmpty('--') }}
                        </template>
                      </el-table-column>
                      <!-- 
                      操作
                      -->
                      <!-- <el-table-column
                        prop="db"
                        :fixed="'right'"
                        label="操作"
                        min-width="140"
                        align="center"
                        :resizable="false">
                        <template slot-scope="scope">
                          <span class="link" @click="toDelete(scope.row, scope.$index)">删除</span>
                        </template>
                      </el-table-column> -->
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            销方机构
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>购方机构</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- 
                    购方类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-items-center">
                      <label class="label nowrap">
                        <span class="red">*</span>购方类型:
                      </label>
                      <div class="flex-flex-auto flex">
                        <el-select v-model="orderData.buyerLimitType"
                          class="full-width"
                          disabled
                          placeholder="请选择"
                          @change="buyerLimitTypeChange"
                          size="small">
                          <el-option
                            label="不限制"
                            :value="0">
                          </el-option>
                          <el-option
                            label="类型指定"
                            :value="1">
                          </el-option>
                          <el-option
                            label="单一指定"
                            :value="2">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!-- 
                    类型指定
                  -->
                  <template v-if="orderData.buyerLimitType === 1">
                    <!-- 
                      认证类型
                    -->
                    <div class="lc-col-12 lc-col-xs12">
                      <div class="card card-shadow">
                        <div class="card-body">
                          <div class="card-header">
                            <strong>认证类型</strong>
                          </div>
                          <div class="card-content-padded">
                            <div class="lc-row lc-space16">
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">认证类型:</label>
                                  <div class="flex-flex-auto">
                                    <el-select v-model="orderData.limitAuthTypeList"
                                      disabled
                                      class="full-width power-minw90" size="small"
                                      multiple
                                      placeholder="请选择">
                                      <el-option v-for="item in limitAuthTypeOpts" :key="item.c" :label="item.n" :value='item.c'></el-option>
                                    </el-select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      机构类型
                    -->
                    <div class="lc-col-12 lc-col-xs12">
                      <div class="card card-shadow">
                        <div class="card-body">
                          <div class="card-header">
                            <strong>机构类型</strong>
                          </div>
                          <div class="card-content-padded">
                            <div class="lc-row lc-space16">
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">|| 药店:</label>
                                  <div class="flex-flex-auto">
                                    <el-select v-model="orderData.limitOrgType.pharmacyType"
                                      class="full-width power-minw90" size="small"
                                      disabled
                                      multiple
                                      placeholder="请选择">
                                      <el-option v-for="item in monomerOpts" :key="item.c" :label="item.n" :value='item.c'></el-option>
                                    </el-select>
                                  </div>
                                </div>
                              </div>
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">|| 商业:</label>
                                  <div class="flex-flex-auto">
                                    <el-select v-model="orderData.limitOrgType.businessType"
                                      class="full-width power-minw90" size="small"
                                      disabled
                                      multiple
                                      placeholder="请选择">
                                      <el-option v-for="item in monomerOpts" :key="item.c" :label="item.n" :value='item.c'></el-option>
                                    </el-select>
                                  </div>
                                </div>
                              </div>
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">|| 医疗机构:</label>
                                  <div class="flex-flex-auto">
                                    <el-select v-model="orderData.limitOrgType.medicalInstitutionType"
                                      class="full-width power-minw90" size="small"
                                      disabled
                                      multiple
                                      placeholder="请选择">
                                      <el-option v-for="item in businessOpts" :key="item.c" :label="item.n" :value='item.c'></el-option>
                                    </el-select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      添加机构
                    -->
                    <!-- <div class="lc-col-12 lc-col-xs10">
                      <div class="flex flex-content-start flex-items-center">
                        <el-button size="small" type="primary" @click="addOrgC">添加排除机构</el-button>
                      </div>
                    </div> -->
                    <div class="lc-col-12 lc-col-xs10">
                      排除机构
                    </div>
                    <!-- 
                      排除机构
                    -->
                    <div class="lc-col-12 lc-col-xs12">
                      <el-table
                        :data="orderData.blackList"
                        height="200"
                        width="100%"
                        border
                        ref="gridTable">
                        <!-- 
                        机构名称
                        -->
                        <el-table-column
                          prop="name"
                          label="机构名称"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.name | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        联系人
                        -->
                        <el-table-column
                          prop="linkmanName"
                          label="联系人"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.linkmanName | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        手机号
                        -->
                        <el-table-column
                          prop="linkmanPhone"
                          label="手机号"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.linkmanPhone | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                          省市县
                        -->
                        <el-table-column
                          prop="address"
                          label="省市县"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                          {{scope.row | formatArea()}}
                          </template>
                        </el-table-column>
                        <!-- 
                        地址
                        -->
                        <el-table-column
                          prop="address"
                          label="地址"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.address | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        操作
                        -->
                        <!-- <el-table-column
                          prop="db"
                          :fixed="'right'"
                          label="操作"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            <span class="link" @click="toDeleteOrgC(scope.row, scope.$index)">删除</span>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </div>
                  </template>
                  <!-- 
                    单一指定
                  -->
                  <template v-if="orderData.buyerLimitType === 2">
                    <!-- 
                      添加机构
                    -->
                    <!-- <div class="lc-col-12 lc-col-xs10">
                      <div class="flex flex-content-start flex-items-center">
                        <el-button size="small" type="primary" @click="addOrgB">添加机构</el-button>
                      </div>
                    </div> -->
                    <div class="lc-col-12 lc-col-xs10">
                      购方机构
                    </div>
                    <!-- 
                      机构白名单
                    -->
                    <div class="lc-col-12 lc-col-xs12">
                      <el-table
                        :data="orderData.orgWhiteList"
                        height="200"
                        width="100%"
                        border
                        ref="gridTable">
                        <!-- 
                        机构名称
                        -->
                        <el-table-column
                          prop="name"
                          label="机构名称"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.name | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        联系人
                        -->
                        <el-table-column
                          prop="linkmanName"
                          label="联系人"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.linkmanName | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        手机号
                        -->
                        <el-table-column
                          prop="linkmanPhone"
                          label="手机号"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.linkmanPhone | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                          省市县
                        -->
                        <el-table-column
                          prop="address"
                          label="省市县"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                          {{scope.row | formatArea()}}
                          </template>
                        </el-table-column>
                        <!-- 
                        地址
                        -->
                        <el-table-column
                          prop="address"
                          label="地址"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.address | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        操作
                        -->
                        <!-- <el-table-column
                          prop="db"
                          :fixed="'right'"
                          label="操作"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            <span class="link" @click="toDeleteOrgB(scope.row, scope.$index)">删除</span>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </div>
                    <!-- 
                      添加人员
                    -->
                    <!-- <div class="lc-col-12 lc-col-xs10">
                      <div class="flex flex-content-start flex-items-center">
                        <el-button size="small" type="primary" @click="addPersonA">添加人员</el-button>
                      </div>
                    </div> -->
                    <div class="lc-col-12 lc-col-xs10">
                      购方人员
                    </div>
                    <!-- 
                      人员白名单
                    -->
                    <div class="lc-col-12 lc-col-xs12">
                      <el-table
                        :data="orderData.humanWhiteList"
                        height="200"
                        width="100%"
                        border
                        ref="gridTable">
                        <!-- 
                        姓名
                        -->
                        <el-table-column
                          prop="name"
                          label="姓名"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.name | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        手机号
                        -->
                        <el-table-column
                          prop="cellphone"
                          label="手机号"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.cellphone | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        身份证号码
                        -->
                        <el-table-column
                          prop="idNum"
                          label="身份证号码"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            {{ scope.row.idNum | formatEmpty('--') }}
                          </template>
                        </el-table-column>
                        <!-- 
                        操作
                        -->
                        <!-- <el-table-column
                          prop="db"
                          :fixed="'right'"
                          label="操作"
                          min-width="140"
                          align="center"
                          :resizable="false">
                          <template slot-scope="scope">
                            <span class="link" @click="toDeletePersonA(scope.row, scope.$index)">删除</span>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 结算说明 -->
          <div class="card card-shadow">
            <div class="card-header">
              <strong>结算说明</strong>
            </div>
            <div class="card-body">
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="p10 relative power-zi101" ref="clip1"></div>
                  <oss-upload
                    :bucket="oss.bucket"
                    :basePath="oss.basePath"
                    :region="oss.region"
                    :dir-name="oss.dirName"
                    label=""
                    ref="fileCom"
                    @uploaded="insertImgFn($event, config)">
                  </oss-upload>
                </div>
              </div>
            </div>
          </div>
          <!-- 
            生效类型和生效时间 
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>生效信息</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!-- <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>生效类型:</label>
                      <div class="flex-flex-auto">
                        <el-radio @input="$forceUpdate()" v-model="orderData.effectType" label="1" size="small">立即生效</el-radio>
                        <el-radio @input="$forceUpdate()" v-model="orderData.effectType" label="2" size="small">延迟生效</el-radio>
                      </div>
                    </div>
                  </div> -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>生效时间:</label>
                      <div class="flex-flex-auto">
                        <el-date-picker
                          v-model="orderData.effectiveTime"
                          disabled
                          :picker-options="startTimeOptions"
                          value-format="timestamp"
                          size="small"
                          type="datetime"
                          placeholder="请选择时间">
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap">失效时间:</label>
                      <div class="flex-flex-auto">
                        <el-date-picker
                          v-model="orderData.invalidTime"
                          disabled
                          :picker-options="endTimeOptions"
                          value-format="timestamp"
                          size="small"
                          type="datetime"
                          placeholder="请选择时间">
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="power-clear"></div> -->
          <!--
            单据信息
            单据默认字段
            后端库里默认需要的字段
            需要提交存入后端库里
            通用字段
            包含：注册来源、单据备注
           -->
          <div v-if="isShow">
            <form-data :formDataSub="formDataSub" type="detail"></form-data>
          </div>
        </div>
      </div>
    </div>
    <!-- 
      进行弹框选择数据
    -->
    <div class="viewport-fixed bg-white power-zi101" v-if="selectOrgConfig.show">
      <selectOrg ref="addOrg" v-if="selectOrgConfig.show" :selectOrgConfig="selectOrgConfig"></selectOrg>
    </div>
    <!-- 
      选择合同标的
    -->
    <div class="viewport-fixed bg-white power-zi101" v-if="ootListConfig.show">
      <ootList v-if="ootListConfig.show" :ootListConfig="ootListConfig"></ootList>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
/**
 * 导入OssUpload组件，用于文件上传功能。
 */
import OssUpload from '@/common-base/components/upload/index';
import crumbsBar from '@/common-base/components/crumbs-bar';
import QualificationUploader from '../QualificationUploader'
import keepAliveMixin from "@/common-base/mixins/keep-alive";
import ootList from '../ootListChoice';
import tableView from '@/common-base/components/pubComponents/tableView';
import selectOrg from '../selectOrg';
import formData from '../formData';
/**
 * 图片水平居中垂直居中
 */
import LimitImg from '@/components/admin/common/limitImg/index'
import { numberList, toChinese, cols, colsName } from '../config';
import treeselect from '@riophae/vue-treeselect'
import E from "wangeditor";
let commonAreaData;
export default {
  mixins:[keepAliveMixin],
  components: {
    OssUpload,
    crumbsBar,
    QualificationUploader,
    ootList,
    tableView,
    selectOrg,
    formData,
    LimitImg,
    treeselect
  },
  props: {
    permissions: {
      type: Object,
      default () {
        return {
          names: {},
          codes: {}
        };
      }
    },
    params: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      // 结算说明
      clip1: null,
      // 代理（商户）
      privateDlList: [],
      // 店铺
      privateMallShopList: [],
      // 结算乙方多选商户
      privateMasterList: [],
      /**
       * 业务组织数据字典项
       */
      businessOrganizationList: [],
      /**
       * 商户类型业务字典数据
       */
      shopTypeList: [],
      //销售类型 字典项
      listBusinessTypeOpts: [],
      // 交易价格类型
      listRatioTypeOpts: [],
      // 比例基准价格  字典项
      processlistRatioTypeOpts: [], 
      // 标的交易结算方式
      overallDataList1: [],
      // 标的交易支付方式
      overallDataList2: [],
      // 药店 医疗机构
      monomerOpts: [
        { c: '1', n: '单店' },
        { c: '2', n: '连锁' }
      ],
      // 商业
      businessOpts: [
        { c: '1', n: '单体' },
        { c: '2', n: '集团' }
      ],
      // 认证类型
      limitAuthTypeOpts: [
        { n: '创始人', c: '9' },
        { n: '合伙人', c: '6' }
      ],
      // 是否已有合同
      isHasShow: false,
      // 选择合同标的
      ootListConfig: {
        show: false, //显示隐藏
        selection: false, //是否单双选
        categoryList: [1, 3], //1，商品，3.服务 4.资产
        //扩展参数
        params: {
          pubStatus: 9 //曾发布过
        }
      },
      /**
       * 合同标的
       */
      ootListObj: {},
      ootType: [],
      colsName:{},
      cols: {},
      /**
       * 表格高度
       */
      gridHeight: 120,
      fangData: {},
      /**
       * 合同方
       */
      numberList: [],
      /**
       * 确定几方后的数据
       */
      enterList: [],
      isShow: false,
      formDataSub: {
        source: this.CFG.project.id
      },
      selectOrgConfig: {
        show: false,
        type: 1, //1，法人组织， 2。机构、3.自然人  4终端  5、商业
        okFn: () => {
        }
      },
      /**
       * 生效时间
       */
      startTimeOptions: {
        disabledDate: (time) => {
          if (this.orderData.invalidTime) {
            return time.getTime() > new Date(this.orderData.invalidTime).getTime();
          }
        }
      },
      /**
       * 失效时间
       */
      endTimeOptions: {
        disabledDate: (time) => {
          if (this.orderData.effectiveTime) {
            return time.getTime() < new Date(this.orderData.effectiveTime).getTime();
          }
        }
      },
      isMounted: false,
      /**
       * 上传oss
       */
      oss: Object.assign({ basePath: 'bi', dirName: '/financeManage' }, this.OSSCFG),
      /**
       * 单据数据
       */
      orderData: {
        // 默认否
        isBaseContract: '2',
        // *结算方式类型: 价格设置 0  比例设置 1
        calcWay: 0,
        // 销方机构
        limitSellerList: [],
        // 单一指定机构白名单
        orgWhiteList: [],
        // 单一指定人员白名单
        humanWhiteList: [],
        // 排除机构
        blackList: [],
        // 购方机构认证类型
        limitAuthTypeList: [],
        // 机构类型
        limitOrgType: {
          // 药店
          pharmacyType: [],
          // 商业
          businessType: [],
          // 医疗机构
          medicalInstitutionType: [],
        },
        // 结算方
        jiesuanfanglist: [],
        // 无合同结算甲方
        partyA: {
          // 默认机构
          partySubjectType: '6'
        },
        // 无合同结算乙方
        partyB: {
          // 默认业务
          partySubjectType: '0'
        },
        buyerLimitType: 0
      },
      /**
       * 合同数据
       */
      contractData: {},
    };
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
  created () {
    // 结算说明
    // if(!this.clip1){
    //   this.createEditor('1')
    // }
    // 合同方数据
    this.numberList = numberList();
    // 合同标的表格头
    this.cols = cols();
    // 合同标的类型
    this.colsName = colsName();
    // 查询销售类型
    this.queryAllBusinessType();
    // 获取标的价格类型
    this.getPriceList();
    this.getDataIte1('');
    this.getDataIte2('');
    // 获取标的比例基准价格
    this.getProcessPriceList();
    /**
     * 认证类型
     */
    this.getAuthType();
    /**
     * 加载业务组织字典项
     */
    this.getBusinessOrganizationList();
    /**
     * 商户类型业务字典数据
     */
    this.getshopTypeList();
    /**
     * 加载单据数据
     */
    this.getData({ id: this.params.id })
    commonAreaData= vue.getCommonDictionary('area')
    this.provinces_yj = commonAreaData.filter(ad => ad.p === '');
    this.isMounted = true

  },
  mounted () {
  },
  methods: {
    /**
     * 获取数据
     */
    getData (data) {
      let service = null
      service = this.CFG.services.settlementNew.queryForm
      this.API.send(service, data, function (res) {
        this.orderData = {...res.serviceResult};
        // 如果是选择的合同
        // 组装结算方数据进行显示
        // 结算方不固定
        if(this.orderData.isBaseContract === '1' && this.orderData.contractId){
          this.isHasShow = true;
          // 根据合同id查合同详情
          this.API.send(this.CFG.services.ecContract.view, {contractNo: this.orderData.contractId}, function (res1) {
            res1 = res1.serviceResult || {};
            console.info(res1);
            this.contractData = {...res1};
            // 赋值合同id
            this.orderData.contractId = res1.contractNo;
            // 回显有几个签署方
            this.enterList = [];
            for(let i = 0; i < this.contractData.partyNumber; i++){
              this.fangData[i] = [];
              // 确定多少个方
              this.enterList.push({
                name: this.fang(i)
              })
            }
            // 回显签署方
            if(this.contractData.signatoryList && this.contractData.signatoryList.length){
              this.contractData.signatoryList.forEach(item => {
                // 设置结算标的里的 甲方结算价格  乙方结算价格 丙方结算价格 等等
                item.fangName = this.fang(item.type-1)
                if(item.subjectType === '1'){
                  item.subjectName = item.subjectName + '(自然人)'
                } else if(item.orgType === '0008'){
                  item.subjectName = item.subjectName + '(机构)'
                } else if(item.orgType === '0010'){
                  item.subjectName = item.subjectName + '(实控人)'
                } 
                this.contractData.splitOxygenChamberCount = this.contractData.splitOxygenChamberCount ? this.contractData.splitOxygenChamberCount : 0;
                switch(item.type - 1){
                  case 0:
                    this.fangData[0].push(item);
                    // 甲方固定一条
                    this.fangData[0][0].isGD = false;
                    break;
                  case 1:
                    this.fangData[1].push(item);
                    break;
                  case 2:
                    this.fangData[2].push(item);
                    break;
                  case 3:
                    this.fangData[3].push(item);
                    break;
                  case 4:
                    this.fangData[4].push(item);
                    break;
                  case 5:
                    this.fangData[5].push(item);
                    break;
                  case 6:
                    this.fangData[6].push(item);
                    break;
                  case 7:
                    this.fangData[7].push(item);
                    break;
                  case 8:
                    this.fangData[8].push(item);
                    break;
                  case 9:
                    this.fangData[9].push(item);
                    break;
                  case 10:
                    this.fangData[10].push(item);
                    break;
                  case 11:
                    this.fangData[11].push(item);
                    break;
                  case 12:
                    this.fangData[12].push(item);
                    break;
                  case 13:
                    this.fangData[13].push(item);
                    break;
                  case 14:
                    this.fangData[14].push(item);
                    break;
                  case 15:
                    this.fangData[15].push(item);
                    break;
                  case 16:
                    this.fangData[16].push(item);
                    break;
                  case 17:
                    this.fangData[17].push(item);
                    break;
                  case 18:
                    this.fangData[18].push(item);
                  break;
                    case 19:
                    this.fangData[19].push(item);
                  break;
                  case 20:
                    this.fangData[20].push(item);
                  break;
                    case 21:
                    this.fangData[21].push(item);
                    break;
                  case 22:
                    this.fangData[22].push(item);
                    break;
                  case 23:
                    this.fangData[23].push(item);
                    break;
                  case 24:
                  this.fangData[24].push(item);
                  break;
                  case 25:
                  this.fangData[25].push(item);
                  break;
                  case 26:
                  this.fangData[26].push(item);
                  break;
                  case 27:
                  this.fangData[27].push(item);
                  break;
                  case 28:
                  this.fangData[28].push(item);
                  break;
                  case 29:
                  this.fangData[29].push(item);
                  break;
                  case 30:
                  this.fangData[30].push(item);
                  break;
                  case 31:
                  this.fangData[31].push(item);
                    break;
                  case 32:
                  this.fangData[32].push(item);
                    break;
                  case 33:
                  this.fangData[33].push(item);
                    break;
                  case 34:
                  this.fangData[34].push(item);
                  break;
                  case 35:
                  this.fangData[35].push(item);
                  break;
                  case 36:
                  this.fangData[36].push(item);
                  break;
                  case 37:
                  this.fangData[37].push(item);
                  break;
                  case 38:
                  this.fangData[38].push(item);
                  break;
                  case 39:
                  this.fangData[39].push(item);
                  break;
                  case 40:
                  this.fangData[40].push(item);
                  break;
                  case 41:
                  this.fangData[41].push(item);
                    break;
                  case 42:
                  this.fangData[42].push(item);
                    break;
                  case 43:
                  this.fangData[43].push(item);
                    break;
                  case 44:
                  this.fangData[44].push(item);
                  break;
                  case 45:
                  this.fangData[45].push(item);
                  break;
                  case 46:
                  this.fangData[46].push(item);
                  break;
                  case 47:
                  this.fangData[47].push(item);
                  break;
                  case 48:
                  this.fangData[48].push(item);
                  break;
                  case 49:
                  this.fangData[49].push(item);
                  break;
                  case 50:
                  this.fangData[50].push(item);
                  break;
                  case 51:
                  this.fangData[51].push(item);
                    break;
                  case 52:
                  this.fangData[52].push(item);
                    break;
                  case 53:
                  this.fangData[53].push(item);
                    break;
                  case 54:
                  this.fangData[54].push(item);
                  break;
                  case 55:
                  this.fangData[55].push(item);
                  break;
                  case 56:
                  this.fangData[56].push(item);
                  break;
                  case 57:
                  this.fangData[57].push(item);
                  break;
                  case 58:
                  this.fangData[58].push(item);
                  break;
                  case 59:
                  this.fangData[59].push(item);
                  break;
                }
              })
            }
            this.isHasShow = true;
          },
          function () {}, this);
        }
        // 如果不是选择的合同
        // 组装结算方数据进行显示
        // 结算方固定 就是甲方和乙方
        if(this.orderData.isBaseContract === '2'){
          let attrA = [];
          let attrB = [];
          if(this.orderData.settlePartyList && this.orderData.settlePartyList.length === 2){
            attrA = this.orderData.settlePartyList.filter(item => (item.partyType === '1' || item.partyType === 1)) || [];
            if(attrA.length){
              this.orderData.partyA = attrA[0];
              // 结算甲方类型 机构 和 商户 都是单个id的字符串
              if(this.orderData.partyA.partyIdList && this.orderData.partyA.partyIdList.length > 0){
                this.orderData.partyA.partyId = this.orderData.partyA.partyIdList[0];
              }
            }
            attrB = this.orderData.settlePartyList.filter(item => (item.partyType === '2' || item.partyType === 2)) || [];
            if(attrB.length){
              this.orderData.partyB = attrB[0];
              // 1 商户 同时指定类型为单一指定 partyId 是数组
              // 3 店铺 是单个的 字符串
              // 4 代理（商户） 是单个的 字符串
              if(this.orderData.partyB.partyIdList && this.orderData.partyB.partyIdList.length > 0){
                if(this.orderData.partyB.partySubjectType === '3'){
                  this.orderData.partyB.partyId = this.orderData.partyB.partyIdList[0];
                  this.privateMallShopList = [{c:this.orderData.partyB.partyId, n:this.orderData.partyB.partyName}]
                }
                if(this.orderData.partyB.partySubjectType === '4'){
                  this.orderData.partyB.partyId = this.orderData.partyB.partyIdList[0];
                  this.privateDlList = [{c:this.orderData.partyB.partyId, n:this.orderData.partyB.partyName}]
                }
                if(this.orderData.partyB.partySubjectType === '1' || this.orderData.partyB.scope === '1'){
                  this.orderData.partyB.partyId = this.orderData.partyB.partyIdList;
                  // todo
                  let attrC = this.orderData.partyB.partyName.split(",");
                  this.privateMasterList = [];
                  this.orderData.partyB.partyIdList.forEach((item, index) => {
                    this.privateMasterList.push({c: item, n: attrC[index]});
                  })
                  console.info(this.privateMasterList);
                }
              }
            }
            // 组装结算甲方和结算乙方 的 固定价格 和 比例的 个数
            this.contractData.signatoryList = [
              {
                fangName: '甲方',
                type: 1
              },
              {
                fangName: '乙方',
                type: 2
              }
            ]
          }
        }
        // 组装标的数据进行显示
        // 合同信息中的结算方展示
        if(this.orderData.ootList && this.orderData.ootList.length){
          // 查询商品信息 新的
          this.getSpuDataA(this.orderData);
        }
        // 回显结算备注
        // if(!this.clip1){
        //   this.createEditor('1')
        // }
        // this.clip1.editor.txt.html('')
        // this.clip1.editor.txt.html(this.orderData.description);
        if(!this.clip1){
          this.createEditor('1', this.orderData.description)
        }
        // 回显单据信息
        this.formDataSub.source = this.orderData.source;
        this.formDataSub.formRemark = this.orderData.formRemark;
        this.formDataSub.id = this.orderData.id;
        this.formDataSub.applicantName = this.orderData.applicant === 'system' ? '系统自动' : this.orderData.applicantName;
        this.formDataSub.applicationDate = this.orderData.applicationDate;
        this.formDataSub.auditorName = this.orderData.auditor === 'system' ? '系统自动' : this.orderData.auditorName;
        this.formDataSub.auditDate = this.orderData.auditDate;
        this.isShow = true;
      }, function () {}, this)
    },
    // 根据结算单据详情回显标的 标的里已有批次批号和结算价格结算比例
    // 查询合同标的
    getSpuDataA(ootdata){
      console.info(ootdata);
      let id = '';
      if(ootdata.ootList && ootdata.ootList.length){
        ootdata.ootList.forEach(item => {
          id = id + ',' + item.ootId;
        })
      }
      console.info(id);
      this.API.send(
        this.CFG.services.settlement.openQueryObjects, {ids: id}, function (res) {
          res = res.serviceResult;
          let data = []
          for(let item in res){
            // 转字段
            res[item].productName = res[item].name;
            res[item].mainUnitValue = res[item].mainUnit;
            res[item].ootType = res[item].typeCode;
            data.push(res[item]);
          }
          console.info(data);
          data.forEach(dataIte => {
            dataIte.ootType = dataIte.ootType || '-1';

            // 设置标的中的结算方 结算价格和结算比例 开始
            // 取单据中ootList中的结算价格和结算比例所在对象
            dataIte.settlePrice = ootdata.ootList.filter(itemBB => itemBB.ootId === dataIte.id)[0].settlePrice;
            // 取单据中批次
            // 取单据中批号
            dataIte.batchNoList = ootdata.ootList.filter(itemBB => itemBB.ootId === dataIte.id)[0].batchNoList;
            dataIte.lotNoList = ootdata.ootList.filter(itemBB => itemBB.ootId === dataIte.id)[0].lotNoList;
            // 为支持添加甲方结算价格  乙方结算价格 丙方结算价格
            dataIte.fixedPriceObj = {
              // 1: null,
              // 2: null,
              // 3: null
            };
            // 结算价格 价格设置
            if(this.orderData.calcWay === 0){
              dataIte.settlePrice.forEach(itemAA => {
                itemAA.partyType = Number(itemAA.partyType);
                dataIte.fixedPriceObj[itemAA.partyType] = itemAA.fixedPrice;
              })
            }
            // 结算比例 比例设置
            if(this.orderData.calcWay === 1){
              dataIte.settlePrice.forEach(itemAA => {
                itemAA.partyType = Number(itemAA.partyType);
                // dataIte.fixedPriceObj[itemAA.partyType] = itemAA.ratio;
                dataIte.fixedPriceObj[itemAA.partyType] = itemAA.ratio ? itemAA.ratio * 100 : null;
              })
            }
            // 设置标的中的结算方 结算价格和结算比例 结束

            // 根据标的id加载标的的批次和批号
            let args = {
              id: dataIte.id,
              current: 1,
              rowCount: 300
            };
            this.API.send(
              this.CFG.services.jupiter.queryAllBatchByCommodity, args, function (resA) {
                resA = resA.serviceResult;
                if (resA && resA.length > 0) {
                  dataIte.bachNums = []; // 批号列表
                  dataIte.bachs = []; // 批次列表
                  resA.forEach(i => {
                    dataIte.bachNums.push({c: i.batchNumId, n: i.batchNum + '  (' + i.invalidDate + ')'});
                    dataIte.bachs.push({c: i.batchId, n: i.batchCode + '  (' + i.invalidDate + ')'});
                  });
                  // this.$forceUpdate();
                }
                let attr1 = this.ootType.filter(item => item === dataIte.ootType) || [];
                if(!attr1.length){
                  this.ootType.push(dataIte.ootType);
                }
                if(!this.ootListObj[dataIte.ootType]){
                  this.ootListObj[dataIte.ootType] = [];
                }
                // this.ootListObj[dataIte.ootType] = [];

                let attr2 = this.ootListObj[dataIte.ootType].filter(item => item.id === dataIte.id);
                if(!attr2.length){
                  this.ootListObj[dataIte.ootType].push(dataIte);
                }
              }, function () {}, this, true
            );

            // let attr1 = this.ootType.filter(item => item === dataIte.ootType) || [];
            // if(!attr1.length){
            //   this.ootType.push(dataIte.ootType);
            // }
            // if(!this.ootListObj[dataIte.ootType]){
            //   this.ootListObj[dataIte.ootType] = [];
            // }
            // // this.ootListObj[dataIte.ootType] = [];

            // let attr2 = this.ootListObj[dataIte.ootType].filter(item => item.id === dataIte.id);
            // if(!attr2.length){
            //   this.ootListObj[dataIte.ootType].push(dataIte);
            // }
          })
          console.info(this.colsName);
          console.info(this.ootListObj);
          this.$forceUpdate();
        }, function () {}, this, true
      );
    },
    // 结算说明
    // 创建富文本编辑器
    insertImgFn(){},
    // 创建编辑器
    createEditor(num, text) {
      const _self = this;
      let _obj = {
        editor: null
      };
      this.$nextTick(() => {
        _obj.editor = new E(this.$refs['clip' + num]);
        _obj.editor.config.height = 220;
        _obj.editor.config.menus = ["bold", "head", "fontName", "foreColor", "backColor", "table", "italic", "underline", "image", "justify"];
        _obj.editor.config.showFullScreen = false;
        _obj.editor.config.showLinkImg = true;
        _obj.editor.config.customUploadImg = function(resultFiles, insertImgFn) {
          _self.$refs.fileCom.fileChange({
            target: { files: resultFiles }
          });
          _self.insertImgFn = (c)=>{
            // 自动写入_obj.content中
            insertImgFn(_self.oss.resourcesLocation + c.Key)
          }
        };
        _obj.editor.create();
        // _obj.editor.txt.html(_obj.content);
        _obj.editor.txt.html(text);
      });
      if(num === '1'){
        this.clip1 = _obj
      } else {
        this.clip2 = _obj
      }
    },
    /**
     * 结算甲方类型变更
     */
    changePartyBType(){
      /**
       * 清空所选数据
       */
      this.orderData.partyB.salesmanLevel = null;
      this.orderData.partyB.businessOrgIdList = null;
      this.orderData.partyB.scope = null;
      this.orderData.partyB.partyId = null;
      this.orderData.partyB.merchantCategoryList = null;
      this.orderData.partyB.merchantTypeList = null;
      this.$forceUpdate();
    },
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
    // 查询店铺
    remotePrivateShopList(keyword) {
      this.API.send(
        this.CFG.services.privateMallShop.noPermissionList, {
          shopName: keyword,
          status: '1',
          checkPermission: false,
          rowCount: 99,
        }, function (res) {
          res = res.serviceResult || {};
          const list = res.rows || [];
          list.forEach(item => {
            item.n = item.shopName;
            item.c = item.privateMallShopId;
          })
          this.privateMallShopList = list;
        }, function () {}, this, true
      );
    },
    /**
     * 结算乙方多选商户
     */
    getprivateMasterList(query){
      let args = {
        keyword: query
      }
      this.API.send(this.CFG.services.settlement.searchPrivateMaster, args, function (res) {
        res = res.serviceResult || [];
        this.privateMasterList = res;
      }, function () {
      }, this)
    },
    getshopTypeList(){
      /**
       * 加载商户类型列表
       */
      this.API.send(this.CFG.services.shopType.list, {}, function (resa) {
        resa = resa.serviceResult;
        this.shopTypeList = resa.rows || [];
      }, function () {
      }, this)
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
     * 结算甲方类型变更
     */
    changePartyAType(){
      /**
       * 清空所选数据
       */
      this.orderData.partyA.partyName = null;
      this.orderData.partyA.partyId = null;
      this.orderData.partyA.partyAddress = null;
      this.orderData.partyA.partyLinkmanName = null;
      this.orderData.partyA.partyLinkmanCellphone = null;
      this.orderData.partyA.category = null;
    },
    /**
     * 结算甲方 选机构
     */
    addOrgD(){
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
        this.orderData.partyA.partyName = row.name;
        this.orderData.partyA.partyId = row.id;
        this.orderData.partyA.partyAddress = row.address;
        this.orderData.partyA.partyLinkmanName = row.linkmanName;
        this.orderData.partyA.partyLinkmanCellphone = row.linkmanPhone;
      }
    },
    /**
     * 结算甲方 选商户
     */
    addOrgE(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 4;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        /***
         *
         * 机构信息
         * **/
        this.orderData.partyA.partyName = row.name;
        this.orderData.partyA.partyId = row.id;
        this.orderData.partyA.category = row.category;
      }
    },
    // /**
    //  * 结算乙方 选商户
    //  */
    // addOrgF(){
    //   this.selectOrgConfig.show = true;
    //   this.selectOrgConfig.type = 5;
    //   /**
    //    * 弹框确认选择后回调返回数据进行处理
    //    */
    //   this.selectOrgConfig.okFn = row =>{
    //     /***
    //      *
    //      * 机构信息
    //      * **/
    //     this.orderData.partyB.name = row.name;
    //     this.orderData.partyB.id = row.id;
    //     // this.orderData.partyB.category = row.category;
    //   }
    // },
    /**
     * 认证类型
     */
    getAuthType(){
      // 认证类型通过枚举字典接口获取
      let args = {
        codeName: "CERT_CODE",
        category: '1'
      };
      this.API.send(this.CFG.services.ca.getAllCode, args, function (res) {
        res = res.serviceResult || [];
        this.limitAuthTypeOpts = res;
        this.limitAuthTypeOpts.forEach(item => {
          item.n = item.name;
          item.c = item.code;
        })
      }, function () { }, this)
    },
    /**
     * 购方类型变更
     */
    buyerLimitTypeChange(){
      // 单一指定机构白名单
      this.orderData.orgWhiteList = [];
      // 单一指定人员白名单
      this.orderData.humanWhiteList = [];
      // 排除机构
      this.orderData.blackList = [];
      // 购方机构认证类型
      this.orderData.limitAuthTypeList = [];
      // 机构类型
      this.orderData.limitOrgType = {
        // 药店
        pharmacyType: [],
        // 商业
        businessType: [],
        // 医疗机构
        medicalInstitutionType: []
      };
    },
    // 添加销方机构
    addOrgA(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 1;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        let attr = this.orderData.limitSellerList.filter(item => item.id === row.id);
        if(attr.length){
          return false;
        }
        /***
         *
         * 机构信息
         * **/
        this.orderData.limitSellerList.push(
          {
            name: row.name,
            id: row.id,
            address: row.address,
            provinceCode: row.provinceCode,
            cityCode: row.cityCode,
            districtCode: row.districtCode,
            linkmanName: row.linkmanName,
            linkmanPhone: row.linkmanPhone
          }
        )
      }
    },
    // 删除销方机构
    toDelete(index){
      this.orderData.limitSellerList.splice(index, 1);
    },
    /**
     * 添加单一指定机构白名单
     */
    addOrgB(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 1;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        let attr = this.orderData.orgWhiteList.filter(item => item.id === row.id);
        if(attr.length){
          return false;
        }
        /***
         *
         * 机构信息
         * **/
        this.orderData.orgWhiteList.push(
          {
            name: row.name,
            id: row.id,
            address: row.address,
            provinceCode: row.provinceCode,
            cityCode: row.cityCode,
            districtCode: row.districtCode,
            linkmanName: row.linkmanName,
            linkmanPhone: row.linkmanPhone
          }
        )
      }
    },
    // 删除购方机构白名单
    toDeleteOrgB(index){
      this.orderData.orgWhiteList.splice(index, 1);
    },
     /**
     * 添加单一指定人员白名单
     */
    addPersonA(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 3;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        let attr = this.orderData.humanWhiteList.filter(item => item.id === row.id);
        if(attr.length){
          return false;
        }
        /***
         *
         * 自然人
         * **/
        this.orderData.humanWhiteList.push(
          {
            name: row.name,
            id: row.id,
            cellphone: row.cellphone,
            idNum: row.identificationNumber
          }
        )
      }
    },
    // 删除单一指定人员白名单
    toDeletePersonA(index){
      this.orderData.humanWhiteList.splice(index, 1);
    },
    /**
     * 添加排除机构
     */
    addOrgC(){
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
        this.orderData.blackList.push(
          {
            name: row.name,
            id: row.id,
            address: row.address,
            provinceCode: row.provinceCode,
            cityCode: row.cityCode,
            districtCode: row.districtCode,
            linkmanName: row.linkmanName,
            linkmanPhone: row.linkmanPhone
          }
        )
      }
    },
    // 删除排除机构
    toDeleteOrgC(index){
      this.orderData.blackList.splice(index, 1);
    },
    // 查询销售类型
    queryAllBusinessType() {
      this.API.send( this.CFG.services.jupiter.queryAllBusinessType, {}, function (res) {
        res = res.serviceResult || [];
        this.listBusinessTypeOpts = res;
      }, function () {}, this, true );
    },
    //获取标的价格类型
    getPriceList() {
      this.API.send( this.CFG.services.krill.priceDictList, {}, res => {
        res = res.serviceResult || [];
        this.listRatioTypeOpts = res;
      }, () => {}, this );
    },
    // 标的交易结算方式
    getDataIte1 (query) {
      let args = {
        name: query
      };
      this.API.send(this.CFG.services.pay.selectSettlement, args, function (res) {
        res.serviceResult = res.serviceResult || {};
        this.overallDataList1 = res.serviceResult.rows || [];
      }, function () {
      }, this);
    },
    // 标的交易支付方式
    getDataIte2 (query) {
      let args = {
        name: query
      };
      this.API.send(this.CFG.services.pay.selectPayment, args, function (res) {
        res.serviceResult = res.serviceResult || {};
        this.overallDataList2 = res.serviceResult.rows || [];
      }, function () {
      }, this);
    },
    //获取标的比例基准价格
    getProcessPriceList() {
      this.API.send( this.CFG.services.krill.processPriceList, {}, res => {
        res = res.serviceResult || [];
        this.processlistRatioTypeOpts = res;
      }, () => {}, this );
    },
    /**
     * 点击触发获取批次批号
     */
    getBat(ootListObj, data, index){
      console.info(data)
      if((data.bachNums && data.bachNums.length) && (data.bachs && data.bachs.length)){
        return false;
      }
      let args = {
        id: data.id,
        current: 1,
        rowCount: 300
      };
      this.API.send(
        this.CFG.services.jupiter.queryAllBatchByCommodity, args, function (res) {
          res = res.serviceResult;
          if (res && res.length > 0) {
            data.bachNums = []; // 批号列表
            data.bachs = []; // 批次列表
            res.forEach(i => {
              data.bachNums.push({c: i.batchNumId, n: i.batchNum + '  (' + i.invalidDate + ')'});
              data.bachs.push({c: i.batchId, n: i.batchCode + '  (' + i.invalidDate + ')'});
            });
            // this.$forceUpdate();
            this.$set(ootListObj, index, data);
          }
        }, function () {}, this, true
      );
    },
    /**
     * 变更是否选择已有合同
     */
    hasChange(val){
      if(val !== '1'){
        this.isHasShow = false;
      }
      // 清空标的列表
      this.ootType = [];
      this.ootListObj = {};
    },
    /**
     * 切换结算方式类型
     */
    changeCalcWay(){
      // 未选合同时才能 请求标的信息 进行重新选择标的
      if(this.orderData.isBaseContract === '2'){
        // 清空标的列表
        this.ootType = [];
        this.ootListObj = {};
      }
    },
    /**
     * 添加合同
     */
    addContract(){
      this.selectOrgConfig.show = true;
      this.selectOrgConfig.type = 2;
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        /***
         *
         * 合同信息
         * **/
        console.info(row);
        // 根据合同id查合同详情
        this.API.send(this.CFG.services.ecContract.view, {contractNo: row.contractNo}, function (res) {
          res = res.serviceResult || {};
          console.info(res);
          this.contractData = {...res};
          // 赋值合同id
          this.orderData.contractId = res.contractNo;
          // 回显有几个签署方
          this.enterList = [];
          for(let i = 0; i < this.contractData.partyNumber; i++){
            this.fangData[i] = [];
            // 确定多少个方
            this.enterList.push({
              name: this.fang(i)
            })
          }
          // 回显签署方
          if(this.contractData.signatoryList && this.contractData.signatoryList.length){
            this.contractData.signatoryList.forEach(item => {
              // 设置结算标的里的 甲方结算价格  乙方结算价格 丙方结算价格 等等
              item.fangName = this.fang(item.type-1)
              if(item.subjectType === '1'){
                item.subjectName = item.subjectName + '(自然人)'
              } else if(item.orgType === '0008'){
                item.subjectName = item.subjectName + '(机构)'
              } else if(item.orgType === '0010'){
                item.subjectName = item.subjectName + '(实控人)'
              } 
              this.contractData.splitOxygenChamberCount = this.contractData.splitOxygenChamberCount ? this.contractData.splitOxygenChamberCount : 0;
              switch(item.type - 1){
                case 0:
                  this.fangData[0].push(item);
                  // 甲方固定一条
                  this.fangData[0][0].isGD = false;
                  break;
                case 1:
                  this.fangData[1].push(item);
                  break;
                case 2:
                  this.fangData[2].push(item);
                  break;
                case 3:
                  this.fangData[3].push(item);
                  break;
                case 4:
                  this.fangData[4].push(item);
                  break;
                case 5:
                  this.fangData[5].push(item);
                  break;
                case 6:
                  this.fangData[6].push(item);
                  break;
                case 7:
                  this.fangData[7].push(item);
                  break;
                case 8:
                  this.fangData[8].push(item);
                  break;
                case 9:
                  this.fangData[9].push(item);
                  break;
                case 10:
                  this.fangData[10].push(item);
                  break;
                case 11:
                  this.fangData[11].push(item);
                  break;
                case 12:
                  this.fangData[12].push(item);
                  break;
                case 13:
                  this.fangData[13].push(item);
                  break;
                case 14:
                  this.fangData[14].push(item);
                  break;
                case 15:
                  this.fangData[15].push(item);
                  break;
                case 16:
                  this.fangData[16].push(item);
                  break;
                case 17:
                  this.fangData[17].push(item);
                  break;
                case 18:
                  this.fangData[18].push(item);
                break;
                  case 19:
                  this.fangData[19].push(item);
                break;
                case 20:
                  this.fangData[20].push(item);
                break;
                  case 21:
                  this.fangData[21].push(item);
                  break;
                case 22:
                  this.fangData[22].push(item);
                  break;
                case 23:
                  this.fangData[23].push(item);
                  break;
                case 24:
                this.fangData[24].push(item);
                break;
                case 25:
                this.fangData[25].push(item);
                break;
                case 26:
                this.fangData[26].push(item);
                break;
                case 27:
                this.fangData[27].push(item);
                break;
                case 28:
                this.fangData[28].push(item);
                break;
                case 29:
                this.fangData[29].push(item);
                break;
                case 30:
                this.fangData[30].push(item);
                break;
                case 31:
                this.fangData[31].push(item);
                  break;
                case 32:
                this.fangData[32].push(item);
                  break;
                case 33:
                this.fangData[33].push(item);
                  break;
                case 34:
                this.fangData[34].push(item);
                break;
                case 35:
                this.fangData[35].push(item);
                break;
                case 36:
                this.fangData[36].push(item);
                break;
                case 37:
                this.fangData[37].push(item);
                break;
                case 38:
                this.fangData[38].push(item);
                break;
                case 39:
                this.fangData[39].push(item);
                break;
                case 40:
                this.fangData[40].push(item);
                break;
                case 41:
                this.fangData[41].push(item);
                  break;
                case 42:
                this.fangData[42].push(item);
                  break;
                case 43:
                this.fangData[43].push(item);
                  break;
                case 44:
                this.fangData[44].push(item);
                break;
                case 45:
                this.fangData[45].push(item);
                break;
                case 46:
                this.fangData[46].push(item);
                break;
                case 47:
                this.fangData[47].push(item);
                break;
                case 48:
                this.fangData[48].push(item);
                break;
                case 49:
                this.fangData[49].push(item);
                break;
                case 50:
                this.fangData[50].push(item);
                break;
                case 51:
                this.fangData[51].push(item);
                  break;
                case 52:
                this.fangData[52].push(item);
                  break;
                case 53:
                this.fangData[53].push(item);
                  break;
                case 54:
                this.fangData[54].push(item);
                break;
                case 55:
                this.fangData[55].push(item);
                break;
                case 56:
                this.fangData[56].push(item);
                break;
                case 57:
                this.fangData[57].push(item);
                break;
                case 58:
                this.fangData[58].push(item);
                break;
                case 59:
                this.fangData[59].push(item);
                break;
              }
            })
          }
          // 回显合同标的
          if(this.contractData.contractOotList && this.contractData.contractOotList.length){
            // 查询商品信息 新的
            this.getSpuData(this.contractData);
          }
          // 合同信息中的结算方展示
          this.isHasShow = true;
        },
        function () {}, this);
      }
    },
    // 查询合同标的
    getSpuData(ootdata){
      console.info(ootdata);
      let id = '';
      if(ootdata.contractOotList && ootdata.contractOotList.length){
        ootdata.contractOotList.forEach(item => {
          id = id + ',' + item.ootId;
        })
      }
      console.info(id);
      this.API.send(
        this.CFG.services.settlement.openQueryObjects, {ids: id}, function (res) {
          res = res.serviceResult;
          let data = []
          for(let item in res){
            // 转字段
            res[item].productName = res[item].name;
            res[item].mainUnitValue = res[item].mainUnit;
            res[item].ootType = res[item].typeCode;
            data.push(res[item]);
          }
          console.info(data);
          data.forEach(dataIte => {
            dataIte.ootType = dataIte.ootType || '-1';
            // 为支持添加甲方结算价格  乙方结算价格 丙方结算价格
            dataIte.fixedPriceObj = {
              // 1: null,
              // 2: null,
              // 3: null
            };
            let attr1 = this.ootType.filter(item => item === dataIte.ootType) || [];
            if(!attr1.length){
              this.ootType.push(dataIte.ootType);
            }
            if(!this.ootListObj[dataIte.ootType]){
              this.ootListObj[dataIte.ootType] = [];
            }
            // this.ootListObj[dataIte.ootType] = [];

            let attr2 = this.ootListObj[dataIte.ootType].filter(item => item.id === dataIte.id);
            if(!attr2.length){
              this.ootListObj[dataIte.ootType].push(dataIte);
            }
          })
          console.info(this.colsName);
          console.info(this.ootListObj);
          this.$forceUpdate();
        }, function () {}, this, true
      );
    },
    /**
     * 删除合同标的
     */
    // 删除商品
    toDeleted(index, ite){
      this.ootListObj[ite].splice(index, 1);
      if(!this.ootListObj[ite].length){
        this.ootType = this.ootType.filter(item => item !== ite);
      }
    },
    /**
     * 添加合同标的
     */
     showModel(model, show, type) {
      model.show = show;
      model.type = type;
    },
    /**
     * 添加标的
     */
    addOot() {
      // 请先添加 结算甲方和结算乙方
      // 选了合同的 就自动有结算甲乙方了 同时也有标的了 无需再添加标的 此按钮消隐
      // let haveJS = true;
      // if(haveJS){
      //   this.$toast({ text: '请选择结算甲方' });
      //   return false;
      // }
      // if(haveJS){
      //   this.$toast({ text: '请选择结算乙方' });
      //   return false;
      // }
      const that = this;
      that.showModel(that.ootListConfig, true, 1);
      this.ootListConfig.selection = true;
      // 把销售类型带过去
      this.ootListConfig.businessType = this.orderData.businessTypeList;
      that.ootListConfig.okFn = data => {
        console.info('all', data)
        // 多选
        data.forEach(dataIte => {
          dataIte.ootType = dataIte.ootType || '-1';
          // 为支持添加甲方结算价格  乙方结算价格 丙方结算价格
          dataIte.fixedPriceObj = {};
          // 原逻辑 需要选固定的结算甲方 和 结算乙方 没有结算丙方 等等
          this.contractData.signatoryList = [
            {
              fangName: '甲方',
              type: 1
            },
            {
              fangName: '乙方',
              type: 2
            }
          ]
          let attr1 = this.ootType.filter(item => item === dataIte.ootType) || [];
          if(!attr1.length){
            this.ootType.push(dataIte.ootType);
          }
          if(!this.ootListObj[dataIte.ootType]){
            this.ootListObj[dataIte.ootType] = [];
          }
          let attr2 = this.ootListObj[dataIte.ootType].filter(item => item.id === dataIte.id);
          if(!attr2.length){
            this.ootListObj[dataIte.ootType].push(dataIte);
          }
          this.$forceUpdate();
        })
      };
    },
    /**
     * 转换  1=》甲方 2=》乙方 等
     */
    fang(val){
      return toChinese(val);
    },
    /**
     * 保存单据
     */
    saveOrder () {
      console.info(11, this.clip1.editor.txt.html())
      console.info(321, this.ootListObj);
      /**
       * 请选择是否选择已有合同
       */
      if(!this.orderData.isBaseContract){
        this.$toast({text: '请选择是否选择已有合同'});
        return false;
      }
      /**
       * 请选择结算甲方类型
       */
      if(this.orderData.isBaseContract === '2' && !this.orderData.partyA.partySubjectType){
        this.$toast({text: '请选择结算甲方类型'});
        return false;
      }
      /**
       * 请选择结算甲方
       */
      if(this.orderData.isBaseContract === '2' && !this.orderData.partyA.partyId){
        this.$toast({text: '请选择结算甲方'});
        return false;
      }
      /**
       * 请选择结算乙方类型
       */
      if(this.orderData.isBaseContract === '2' && !this.orderData.partyB.partySubjectType){
        this.$toast({text: '请选择结算乙方类型'});
        return false;
      }
      /**
       * 请选择业务组织
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '0' && (!this.orderData.partyB.businessOrgIdList || (this.orderData.partyB.businessOrgIdList && !this.orderData.partyB.businessOrgIdList.length))){
        this.$toast({text: '请选择业务组织'});
        return false;
      }
      /**
       * 请选择指定类型
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '1' && !this.orderData.partyB.scope){
        this.$toast({text: '请选择指定类型'});
        return false;
      }
      /**
       * 请选择商户
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '1' && this.orderData.partyB.scope === '1' && (!this.orderData.partyB.partyId || (this.orderData.partyB.partyId && !this.orderData.partyB.partyId.length))){
        this.$toast({text: '请选择商户'});
        return false;
      }
      /**
       * 请选择商户分类
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '1' && this.orderData.partyB.scope === '0' && (!this.orderData.partyB.merchantCategoryList || (this.orderData.partyB.merchantCategoryList && !this.orderData.partyB.merchantCategoryList.length))){
        this.$toast({text: '请选择商户分类'});
        return false;
      }
      /**
       * 请选择商户类型
       */
      // if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '1' && this.orderData.partyB.scope === '0' && (!this.orderData.partyB.merchantTypeList || (this.orderData.partyB.merchantTypeList && !this.orderData.partyB.merchantTypeList.length))){
      //   this.$toast({text: '请选择商户类型'});
      //   return false;
      // }
      /**
       * 请选择店铺
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '3' && !this.orderData.partyB.partyId){
        this.$toast({text: '请选择店铺'});
        return false;
      }
      /**
       * 请选择代理（商户）
       */
      if(this.orderData.isBaseContract === '2' && this.orderData.partyB.partySubjectType === '4' && !this.orderData.partyB.partyId){
        this.$toast({text: '请选择代理（商户）'});
        return false;
      }
      /**
       * 请选择销售类型
       */
      if(!this.orderData.businessTypeList || (this.orderData.businessTypeList && !this.orderData.businessTypeList.length)){
        this.$toast({text: '请选择销售类型'});
        return false;
      }
      /**
       * 请选择交易价格类型
       */
      if(!this.orderData.priceTypeList || (this.orderData.priceTypeList && !this.orderData.priceTypeList.length)){
        this.$toast({text: '请选择交易价格类型'});
        return false;
      }
      /**
       * 请选择结算方式类型
       */
      if(![ '0', 0].includes(this.orderData.calcWay) && !this.orderData.calcWay){
        this.$toast({text: '请选择结算方式类型'});
        return false;
      }
      /**
       * 请选择结算方式类型
       */
      if(this.orderData.calcWay === 1 && !this.orderData.benchPriceType){
        this.$toast({text: '请选择比例基准价格'});
        return false;
      }
      /**
       * 当选择无合同时
       * 数据组装
       */
      // 结算方
      if(this.orderData.isBaseContract === '2'){
        // 商户 同时指定类型为单一指定 partyId 是数组
        // 店铺 是单个的 字符串
        // 代理（商户） 是单个的 字符串
        if(this.orderData.partyB.partySubjectType === '3' || this.orderData.partyB.partySubjectType === '4'){
          this.orderData.partyB.partyId = [this.orderData.partyB.partyId]
        }
        this.orderData.settlePartyList = [
          // 甲方
          {
            partyType: 1,
            // partyId: this.orderData.partyA.partyId,
            partyIdList: [this.orderData.partyA.partyId],
            partySubjectType: this.orderData.partyA.partySubjectType,
          },
          // 乙方
          {
            partyType: 2,
            partyIdList: this.orderData.partyB.partyId,
            partySubjectType: this.orderData.partyB.partySubjectType,
            //业务组织
            businessOrgIdList: this.orderData.partyB.businessOrgIdList,
            // 业务员级别
            salesmanLevel: this.orderData.partyB.salesmanLevel,
            // 商户分类
            merchantCategoryList: this.orderData.partyB.merchantCategoryList,
            // 商户类型
            merchantTypeList: this.orderData.partyB.merchantTypeList,
            // 指定类型
            scope: this.orderData.partyB.scope,
          }
        ];
      }
      /**
       * 当选择有合同时
       * 数据组装
       */
      // 结算方
      if(this.orderData.isBaseContract === '1'){
        // 判断合同中是否有签署方
        if(!this.contractData.signatoryList && (this.contractData.signatoryList && !this.contractData.signatoryList.length)){
          this.$toast({text: '此合同无签署方'});
          return false;  
        }
        // 结算方
        this.orderData.settlePartyList = [];
        this.contractData.signatoryList.forEach(item => {
          // 合同中的签署方类型 机构 实控人 自然人 需改成结算方里对应的类型
          // 合同中的签署方类型 机构/实控人 2 => 结算方里对应的 机构 6
          // 合同中的签署方类型 自然人 1 => 结算方里对应的 自然人 5
          item.subjectTypeA = '';
          if(item.subjectType === '2'){
            item.subjectTypeA = '6'
          }
          if(item.subjectType === '1'){
            item.subjectTypeA = '5'
          }
          this.orderData.settlePartyList.push(
            {
              partyType: item.type,
              partyIdList: [item.subjectId],
              partySubjectType: item.subjectTypeA
            }
          )
        })
      }
      let attr_1 = [];
      // let attr_2 = [];
      // let attr_3 = [];
      let isObj = false;
      if(JSON.stringify(this.ootListObj) !== "{}"){
        for(let key in this.ootListObj){
          if(this.ootListObj[key].length){
            this.ootListObj[key].forEach(item => {
              item.attr2 = [];
              item.attr3 = [];
              // 处理甲方结算价格 乙方结算价格 丙方结算价格 等等
              if(JSON.stringify(item.fixedPriceObj) !== "{}"){
                for(let k in item.fixedPriceObj){
                  // k 1甲方 2 乙方 3丙方
                  // if(item.fixedPriceObj[k]){
                  // 结算方式类型 calcWay === 0 价格设置  calcWay === 1 比例设置
                  if(this.orderData.calcWay === 0){
                    item.attr2.push(
                      {
                        fixedPrice: item.fixedPriceObj[k] ? item.fixedPriceObj[k] : null,
                        partyType: Number(k),
                        // calcWay: 0
                      }
                    )
                  } else {
                    let ratioNum1 = item.fixedPriceObj[k] ? item.fixedPriceObj[k] / 100 : null
                    item.attr2.push(
                      {
                        ratio: ratioNum1,
                        partyType: Number(k),
                        // calcWay: 0
                      }
                    )
                  }
                  // }
                  // 每一个标的里面 有一个结算价格不存在就放里面
                  if(!item.fixedPriceObj[k]){
                    item.attr3.push(k);
                  }
                }
              } else {
                isObj = true;
              }
              attr_1.push({ootId: item.id, batchNoList: item.batchNoList, lotNoList: item.lotNoList, settlePrice: item.attr2, jiaoyan: item.attr3})
            })
          }
        }
      }
      if(isObj && this.orderData.calcWay === 0){
        this.$toast({text: '请填写结算标的各结算方的结算价格'});
        return false;
      }
      if(isObj && this.orderData.calcWay === 1){
        this.$toast({text: '请填写结算标的各结算方的结算比例'});
        return false;
      }
      console.info('attr_1', attr_1);
      // 每一个标的里的  结算价格为空的大于1 就提示下面
      let attr4 = attr_1.filter(item => item.jiaoyan.length > 1);
      if(attr4.length && this.orderData.calcWay === 0){
        this.$toast({text: '结算标的结算价格最多可以有一方不填'});
        return false;
      }
      if(attr4.length && this.orderData.calcWay === 1){
        this.$toast({text: '结算标的结算比例最多可以有一方不填'});
        return false;
      }
      if(!attr_1.length){
        this.$toast({text: '请添加结算标的'});
        return false;
      }
      this.orderData.ootList = attr_1;
      /**
       * 购方类型: 类型指定
       */
      if(this.orderData.buyerLimitType === 1 && (!this.orderData.limitAuthTypeList || (this.orderData.limitAuthTypeList && !this.orderData.limitAuthTypeList.length)) && (!this.orderData.limitOrgType.pharmacyType || (this.orderData.limitOrgType.pharmacyType && !this.orderData.limitOrgType.pharmacyType.length)) && (!this.orderData.limitOrgType.businessType || (this.orderData.limitOrgType.businessType && !this.orderData.limitOrgType.businessType.length)) && (!this.orderData.limitOrgType.medicalInstitutionType || (this.orderData.limitOrgType.medicalInstitutionType && !this.orderData.limitOrgType.medicalInstitutionType.length))){
        this.$toast({ text: '请任选一种购方机构中的认证类型或者机构类型' });
        return;
      }
      /**
       * 请选择购方机构或购方人员
       */
      if(this.orderData.buyerLimitType === 2 && (!this.orderData.humanWhiteList || (this.orderData.humanWhiteList && !this.orderData.humanWhiteList.length)) && (!this.orderData.orgWhiteList || (this.orderData.orgWhiteList && !this.orderData.orgWhiteList.length))) {
        this.$toast({ text: '请选择购方机构或购方人员' });
        return
      }
      /**
       * 请选择生效时间
       */
      if(!this.orderData.effectiveTime){
          this.$toast({text: '请选择生效时间'});
          return false;
      }
      /**
       * 请选择失效时间
       */
      // if(!this.orderData.invalidTime){
      //   this.$toast({text: '请选择失效时间'});
      //   return false;
      // }
      // 结算说明
      this.orderData.description = this.clip1.editor.txt.html();
      /**
       * 提交数据增加表单信息
       * 注册来源、单据ID、制单人、申请时间、审核人、审核时间、单据备注
       */
      this.orderData = this.utils.extend({},this.orderData, this.formDataSub);
      this.goSubMit(this.CFG.services.settlementNew.upsertApply, this.orderData);
    },
    /**
     * 提交数据
     */
    goSubMit(service, obj){
      this.API.send(service, obj, function (res) {
        if (res.opFlag) {
          this.$toast({ text: '保存成功' });
          this.$router.push({
            path: '/admin/settlementPriceApply'
          })
        }
      }, function () { }, this)
    }
  }
};
</script>
