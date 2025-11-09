<template>
  <div class="viewport-fixed">
    <!-- 
      返回
    -->
    <crumbs-bar></crumbs-bar>
    <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination background layout="total, prev, pager, next" @current-change="currentPager"
        :page-size="search.rowCount" :current-page="search.current" :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded">
          <h2 class="pl15 pb10">结算价格关停规则申请单-新增</h2>
          <div class="pl15 pr15">
            <div class="card card-shadow mt10">
              <div class="card-body">
                <div class="card-header">
                  <strong>结算价格规则查询</strong>
                </div>
                <div class="card-content-padded" :style="`height:${gridHeight}`">
                  <div>
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
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
                        规则ID
                      -->
                      <div class="search-bar-item">
                        <el-input
                          v-model="search.ruleId"
                          size="small"
                          placeholder="规则ID">
                        </el-input>
                      </div>
                      <!-- 
                        乙方类型
                      -->
                      <div class="search-bar-item">
                        <el-select @input="$forceUpdate()" v-model="search.partyBType" @change="changeType" clearable class="full-width" size="small"  placeholder="结算乙方类型">
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
                      <div class="search-bar-item">
                        <el-button size="small" type="primary" @click="queryOrg">查询</el-button>
                        <el-button size="small" type="primary" @click="reset">重置</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="lc-row lc-space16" v-if="isShow">
                    <div v-if="list.length > 0">
                      <div class="card card-shadow mt15 lc-col-12 lc-col-xs12" v-for="item in list"
                        :key="item.id">
                        <div class="card-body">
                          <div class="card-content-padded">
                            <div class="lc-row lc-space16">
                              <!-- 
                                规则ID
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">规则ID:</label>
                                  <div class="flex-flex-auto">
                                    {{item.id}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                是否基于合同结算
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">是否基于合同结算:</label>
                                  <div class="flex-flex-auto">
                                    <span v-if="item.isBaseContract=='1'">是</span>
                                    <span v-else-if="item.isBaseContract=='1'">否</span>
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                合同ID
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">合同ID:</label>
                                  <div class="flex-flex-auto">
                                    {{item.contractId}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算甲方类型
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算甲方类型:</label>
                                  <div class="flex-flex-auto">
                                    <span v-if="item.partyAType=='0'">业务组织</span>
                                    <span v-else-if="item.partyAType=='1'">商户</span>
                                    <span v-else-if="item.partyAType=='2'">业务员</span>
                                    <span v-else-if="item.partyAType=='3'">店铺</span>
                                    <span v-else-if="item.partyAType=='4'">代理（商户）</span>
                                    <span v-else-if="item.partyAType=='5'">自然人</span>
                                    <span v-else-if="item.partyAType=='6'">机构</span>
                                    <span v-else>--</span>
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算甲方
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算甲方:</label>
                                  <div class="flex-flex-auto">
                                    {{item.partyAName}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算乙方类型
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算乙方类型:</label>
                                  <div class="flex-flex-auto">
                                    <span v-if="item.partyBType=='0'">业务组织</span>
                                    <span v-else-if="item.partyBType=='1'">商户</span>
                                    <span v-else-if="item.partyBType=='2'">业务员</span>
                                    <span v-else-if="item.partyBType=='3'">店铺</span>
                                    <span v-else-if="item.partyBType=='4'">代理（商户）</span>
                                    <span v-else-if="item.partyBType=='5'">自然人</span>
                                    <span v-else-if="item.partyBType=='6'">机构</span>
                                    <span v-else>--</span>
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算乙方
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算乙方:</label>
                                  <div class="flex-flex-auto">
                                    <span v-if="item.partyBName.length < 35">
                                      {{item.partyBName}}
                                    </span>
                                    <!-- 
                                      弹出黑色背景弹框
                                    -->
                                    <el-tooltip v-else class="item" popper-class="table-tooltip-line-clamp" effect="dark" :content=item.partyBName placement="top">
                                      <div class="tooltip-line-3">{{item.partyBName}}</div>
                                    </el-tooltip>
                                    <!-- 
                                      弹出白色背景弹框
                                    -->
                                    <!-- <el-popover placement="top" trigger="hover">
                                      <div class="pad10 fs-sm">{{item.partyBName}}</div>
                                      <div slot="reference" class="tooltip-line-3">{{item.partyBName}}</div>
                                    </el-popover> -->
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                业务员级别
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">业务员级别:</label>
                                  <div class="flex-flex-auto">
                                    {{item.salesmanLevel}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                销售类型
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">销售类型:</label>
                                  <div class="flex-flex-auto">
                                    {{item.businessTypeName}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                价格类型
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">价格类型:</label>
                                  <div class="flex-flex-auto">
                                    {{item.priceTypeName}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算规则
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算规则:</label>
                                  <div class="flex-flex-auto">
                                    {{item.ruleCalcWayValue}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                结算基准
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">结算基准:</label>
                                  <div class="flex-flex-auto">
                                    {{item.ruleBenchPriceTypeValue}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                申请时间
                              -->
                              <!-- <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">申请时间:</label>
                                  <div class="flex-flex-auto">
                                    {{utils.formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}
                                  </div>
                                </div>
                              </div> -->
                            </div>
                          </div>
                          <div class="card-footer">
                            <span class="black">是否要关停此结算价格规则:</span>
                            <el-button type='text' class="link ml10" @click="toEdit(item)">确定</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="tac mt50 mb50 darkgray">未查询数据</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="关停" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isCancel" width="400px" center>
      <!-- <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>生效类型：</label>
        <div class="flex-flex-auto">
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="1" size="small">立即生效</el-radio>
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="2" size="small">延迟生效</el-radio>
        </div>
      </div> -->
      <div class="mt15 flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>关停时间：</label>
        <div class="flex-flex-auto">
          <el-date-picker
            v-model="checkData.invalidTime"
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
          <span class="btn btn-xl ml20" @click="toCancel">
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
/**
 * 导入OssUpload组件，用于文件上传功能。
 */
import OssUpload from '@/common-base/components/upload/index';
// import AreaData from '@/common-base/data-dictionary/area';
import crumbsBar from '@/common-base/components/crumbs-bar';
import keepAliveMixin from "@/common-base/mixins/keep-alive";
import selectOrg from '../selectOrg';
let commonAreaData;

export default {
  name: 'orgEditApplyCreate',
  mixins:[keepAliveMixin],
  components: {
    OssUpload,
    // AreaData,
    crumbsBar,
    selectOrg
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
      isCancel: false,
      checkData: {
        effectType: '1'
      },
      ident: '',
      orderData: {},
      districts: [],
      citys: [],
      provinces: [],
      total: 0,
      list: [],
      search: {
        current: 1,//页数
        rowCount: 10,
      },
      isShow: false,
      gridHeight: 500
    };
  },
  created () {
    // eslint-disable-next-line no-undef
    commonAreaData= vue.getCommonDictionary('area')
    this.provinces = commonAreaData.filter(ad => ad.p === '')
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
    this.ident = this.params.ident
  },
  mounted () {
  },
  filters:{
    /**
     * 显示省市县中文名称
     */
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
    }
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
     * 更新页面相关信息
     */
    updateCurrentPage(){
      if(this.ident !== this.params.ident){
        this.ident = this.params.ident
        this.search = {}
        this.list = []
      }
    },
    /**
     * 查询结果集列表
     */
    queryOrg () {
      // if (!this.search.partyaName && !this.search.partybName && !this.search.contractId && !this.search.versionNum && !this.search.partybRemitterName && !this.search.salesmanName) {
      //   this.$toast({ text: `请输入查询信息` });
      //   return
      // }
      // 增加查询有效的数据
      this.search.status = '1';
      this.API.send(this.CFG.services.settlementNew.queryPagedResultList, this.search, function (res) {
        this.total = res.data.total > 0 ? res.data.total : this.total
        this.list = res.data.rows || [];
        this.isShow = true
        this.$forceUpdate();
      }, function () {
      }, this)
    },
    /**
     * 重置
     */
    reset () {
      this.search = {
        current: 1,//页数
        rowCount: 10,
      }
      this.queryOrg()
    },
    /**
     * 分页
     */
    currentPager (value) {
      this.search.current = value
      this.queryOrg()
      this.$forceUpdate();
    },
    /**
     * 省数据变更
     */
    handleProvinceChange () {
      this.search.cityCode = ''
      this.search.districtCode = ''
      this.citys = []
      let citys = []
      if (this.search.provinceCode) {
        citys = commonAreaData.filter(ad => ad.p === this.search.provinceCode)
      }
      citys.unshift({ c: '', n: '请选择...' })
      this.citys = citys
      this.districts = [{ c: '', n: '请选择...' }]
      this.$forceUpdate()
    },
    /**
     * 市数据变更
     */
    handleCityChange () {
      this.search.districtCode = '';
      this.districts = []
      let districts = []
      if (this.search.cityCode) {
        districts = commonAreaData.filter(ad => ad.p === this.search.cityCode)
      }
      districts.unshift({ c: '', n: '请选择...' })
      this.districts = districts
    },
    /**
     * 县数据变更
     */
    handleDistrictChange () {
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    /**
     * 取消
     */
    toCancel(){
      this.isCancel = false;
    },
    /**
     * 编辑
     */
    toEdit(data){
      this.isCancel = true;
      this.checkData = { contractId: data.id}
      // this.checkData.effectType = '1';
    },
    /**
     * 确认生效
     */
    toEditEntter (){
      let that = this;
      // if (!this.checkData.effectType) {
      //   this.$toast({ text: `请选择生效类型` });
      //   return false
      // } 
      //  if (this.checkData.effectType === '2' && !this.checkData.effectiveTime) {
      //   this.$toast({ text: `请选择关停时间` });
      //   return false
      // }
      if (!this.checkData.invalidTime) {
        this.$toast({ text: `请选择关停时间` });
        return false
      }
      this.$confirm({
        title: '提示',
        text: '确定要关停此结算价格规则吗？关停后不可恢复！',
        buttons: [
          {
            text: '取消',
            type: 'follow'
          },
          {
            text: '确定',
            type: 'primary',
            callback: function () {
              that.isCancel = false
              // console.info('11', that.checkData)
              // that.checkData.type = '5';
              that.API.send(that.CFG.services.settlementNew.queryResult, {id: that.checkData.contractId}, function (res) {
                res = res.serviceResult;
                res.type = '5';
                // res.contractId = this.orderData.id;
                res.resultId = res.id;
                delete res.id;
                // res.effectType = that.checkData.effectType;
                // res.effectiveTime = that.checkData.effectiveTime;
                res.invalidTime = that.checkData.invalidTime;
                that.API.send(that.CFG.services.settlementNew.upsertInvalid, res, function () {
                  that.$toast({text: '操作成功'})
                  that.$router.push({
                    path: '/admin/settlementPriceCancel'
                  })
                }, function () {
                }, that)
              }, function () {
              }, that)
            }
          }
        ]
      })
    },
    // toEditEntter (id){
    //   let that = this;
    //   this.$confirm({
    //     title: '提示',
    //     text: '确定要作废此数据合同(购销合同)(医药行业)吗？作废后不可恢复！',
    //     buttons: [
    //       {
    //         text: '取消',
    //         type: 'follow'
    //       },
    //       {
    //         text: '确定',
    //         type: 'primary',
    //         callback: function () {
    //           this.isCancel = false;
    //           that.API.send(that.CFG.services.oxMassApply.update,  {contractId: id, type: '5'}, function () {
    //             that.$toast({text: '操作成功'})
    //             that.$router.push({
    //               path: '/main/goodoAgreementCancel'
    //             })
    //           }, function () {
    //           }, that)
    //         }
    //       }
    //     ]
    //   })
    // }
  }
};
</script>
