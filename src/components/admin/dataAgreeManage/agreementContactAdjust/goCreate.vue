<template>
  <div class="viewport-fixed" ref="viewBody">
    <!-- 
      返回
    -->
    <crumbs-bar></crumbs-bar>
    <div
      class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
      <el-pagination background layout="total, prev, pager, next" @current-change="currentPager"
        :page-size="search.rowCount" :current-page="search.current" :total="total">
      </el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded ">
          <h2>协议嵌套关联关系待生效数据调整单-新增</h2>
          <div>
            <!-- 已分配终端列表 -->
            <div class="card card-shadow mt15">
              <div class="card-body">
                <div class="card-header">
                  <strong>协议嵌套关联关系查询</strong>
                </div>
                <div class="card-content-padded" :style="`height:${gridHeight}`">
                  <div>
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
                      <div class="search-bar-item">
                        <el-button size="small" type="primary" @click="queryOrg">查询</el-button>
                        <el-button size="small" type="primary" @click="reset">重置</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="lc-row lc-space16 p10" v-if="isShow">
                    <div v-if="list.length > 0">
                      <div class="card card-shadow mt15 lc-col-12 lc-col-xs12" v-for="item in list"
                        :key="item.id">
                        <div class="card-body">
                          <div class="card-content-padded">
                            <div class="lc-row lc-space16">
                              <!-- 
                                单据ID
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">单据ID:</label>
                                  <div class="flex-flex-auto">
                                    {{item.id}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                协议编码
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">协议编码:</label>
                                  <div class="flex-flex-auto">
                                    {{item.contractId}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                              协议版号 
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">协议版号:</label>
                                  <div class="flex-flex-auto">
                                    {{item.versionNum}} / ({{contractTypeName(item.versionNum)}})
                                  </div>
                                </div>
                              </div>
                              <!-- 
                              甲方 
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">甲方:</label>
                                  <div class="flex-flex-auto">
                                    {{item.partyAName}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                              乙方 
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">乙方:</label>
                                  <div class="flex-flex-auto">
                                    {{item.partyBName}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                关联协议类型
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">关联协议类型:</label>
                                  <div class="flex-flex-auto">
                                    <span v-if="item.refContractType=='1'">协议</span>
                                    <span v-else-if="item.refContractType=='2'">签署单</span>
                                    <span v-else>--</span>
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                关联协议编码
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">关联协议编码:</label>
                                  <div class="flex-flex-auto">
                                    {{item.refContractId}}
                                  </div>
                                </div>
                              </div>
                              <!-- 
                              协议版号 
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">关联协议版号:</label>
                                  <div class="flex-flex-auto">
                                    {{item.refVersionNum}} / ({{contractTypeName(item.refVersionNum)}})
                                  </div>
                                </div>
                              </div>
                              <!-- 
                                申请时间
                              -->
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">申请时间:</label>
                                  <div class="flex-flex-auto">
                                    {{utils.formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}
                                  </div>
                                </div>
                              </div>
                              <div class="lc-col-12 lc-col-xs6">
                                <div class="flex flex-content-start flex-items-center">
                                  <label class="nowrap">单据类型:</label>
                                  <div class="flex-flex-auto">
                                    {{item.typeName}}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="card-footer">
                            <span class="black">是否为此单据进行调整:</span>
                            <el-button type='text' class="link ml10 mr50" @click="toEdit(item)"> 确定
                            </el-button>
                            <span class="black">是否确定要终止:</span>
                            <el-button type='text' class="link ml10" @click="toEnd(item)">确定</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="tac mt50 mb50 darkgray">未查询到数据</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="作废" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isCancel" width="400px" center>
      <div class=" flex flex-content-start flex-items-center">
        <label class="form-label"><span class="red">*</span>生效类型：</label>
        <div class="flex-flex-auto">
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="1" size="small">立即生效</el-radio>
          <el-radio @input="$forceUpdate()" v-model="checkData.effectType" label="2" size="small">延迟生效</el-radio>
        </div>
      </div>
      <div class="mt15 flex flex-content-start flex-items-center" v-if="checkData.effectType === '2'">
        <label class="form-label"><span class="red">*</span>生效时间：</label>
        <div class="flex-flex-auto">
          <el-date-picker
            v-model="checkData.effectTime"
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
    <!--
      查数据
    -->
    <div class="viewport-fixed bg-white power-zi101" v-if="selectOrgConfig.show">
      <selectOrg ref="addOrg" v-if="selectOrgConfig.show" :selectOrgConfig="selectOrgConfig"></selectOrg>
    </div>
  </div>
</template>
<script>
import crumbsBar from '@/common-base/components/crumbs-bar';
import selectOrg from '../selectOrg';
let commonAreaData;
/**
 * 图片水平居中垂直居中
 */
import LimitImg from '@/components/admin/common/limitImg/index'
import { contractTypeName } from '../config';
export default {
  components: {
    crumbsBar,
    selectOrg,
    LimitImg
  },
  props: {
    permissions: {
      type: Object,
      default () {
        return {
          codes: {},
          names: {}
        }
      }
    }
  },
  data () {
    return {
      contractTypeName: {},
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
      currentData: null,
      isCancel: false,
      checkData: {
        effectType: '1'
      },
      formData: {},
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
      gridHeight: 500,

    }
  },
  created () {
    this.contractTypeName = contractTypeName;
  },
  mounted () {
  },
  filters: {},
  methods: {
    /**
     * 终止操作
     */
    toEnd (data) {
      let that = this;
      this.$confirm({
        title: '提示',
        text: '是否确认此操作？',
        buttons: [
          {
            text: '取消',
            type: 'follow'
          },
          {
            text: '确定',
            type: 'primary',
            callback: function () {
              that.API.send(that.CFG.services.ecRefApply.queryPre, {id: data.id}, function (res) {
                res = res.serviceResult || {};
                let obj = {...res}
                if(obj.type){
                  if(obj.type === '1' || obj.type === '3'){
                    obj.type = '3'
                  }
                  if(obj.type === '2' || obj.type === '4'){
                    obj.type = '4'
                  }
                  if(obj.type === '5' || obj.type === '6'){
                    obj.type = '6'
                  }
                }
                obj.directiveId = data.id
                obj.directiveType = '2'
                obj.effectType = '1'
                // 收陈瑞反馈终止操作 type = '7'
                // obj.type = '7';
                delete obj.id
                delete obj.effectiveTime
                that.API.send(that.CFG.services.ecRefApply.upsertAdjust, obj, function () {
                  that.$toast({text: '操作成功'})
                  let str = ''
                  if(data.type){
                    if(data.type === '1' || data.type === '3'){
                      str = '/admin/agreementContactAdjust'
                    }
                    if(data.type === '2' || data.type === '4'){
                      str = '/admin/agreementContactAdjust'
                    }
                    if(data.type === '5' || data.type === '6'){
                      str = '/admin/agreementContactAdjust'
                    }
                    that.$router.push({
                      path: str,
                    })
                  } else{
                    that.$toast({ text: `此单据无效` });
                    // return
                  }
                }, function () {
                }, that)
              }, function () {
              }, that);
            }
          }
        ]
      })
    },
    /**
     * 新增编辑
     */
    toEdit (item) {
      console.info(item);
      let str = ''
      if(item.type){
        if(item.type === '1' || item.type === '3'){
          str = '/admin/agreementContactAdjustCreateApply'
          this.$router.push({
            path: str,
            query: {
              id: item.id
            }
          })
        }
        if(item.type === '2' || item.type === '4'){
          str = '/admin/agreementContactAdjustCreateChange'
          this.$router.push({
            path: str,
            query: {
              id: item.id
            }
          })
        }
        if(item.type === '5' || item.type === '6'){
          this.formData = item
          this.isCancel = true
          this.checkData = { directiveId: item.id, effectType: '1', directiveType : '2' }
        }
      } else{
        this.$toast({ text: `此单据无效` });
        // return
      }
    },
    /**
     * 确认生效
     */
    toEditEntter (){
      if (!this.checkData.effectType) {
        this.$toast({ text: `请选择生效类型` });
        return false
      } else if (this.checkData.effectType === '2' && !this.checkData.effectTime) {
        this.$toast({ text: `请选择生效时间` });
        return false
      }
      this.API.send(this.CFG.services.ecRefApply.viewDirective, {id: this.formData.id}, function (res) {
        res = res.serviceResult || {};
        this.currentData = res
        // this.currentData.selfDescriptionVersion = 'FOUNDERMP-0001'
        this.currentData.effectType = this.checkData.effectType
        // this.currentData.effectiveTime = this.checkData.effectiveTime
        if(this.currentData.effectType === '1'){
          delete this.currentData.effectTime
        }
        this.currentData.directiveId = this.checkData.directiveId
        delete this.currentData.id
        // 根据原单据类型改成对应的调整单 5=>6 2=>4  1=>3
        if(this.currentData.type === '5'){
          this.currentData.type = '6'
        }
        this.API.send(this.CFG.services.ecRefApply.update, this.currentData, function () {
          this.$toast({text: '操作成功'})
          this.$router.push({
            path: '/admin/agreementContactAdjust',
          });
        }, function () {
        }, this)
      }, function () {
      }, this);
    },
    /**
     * 查询结果集列表
     */
    queryOrg () {
      if (!this.search.contractId && !this.search.refContractType && !this.search.refContractId) {
        this.$toast({ text: `请输入查询信息` });
        return
      }
      if(this.$route.query.type === '1'){
        this.search.types = ['1','3']
      }
      if(this.$route.query.type === '2'){
        this.search.types = ['2','4']
      }
      if(this.$route.query.type === '5'){
        this.search.types = ['5','6']
      }
      this.API.send(this.CFG.services.ecRefApply.listDirective, this.search, function (res) {
        this.total = res.data.total > 0 ? res.data.total : this.total
        this.list = res.data.rows || []
        this.list.forEach(item => {
          if(item.type){
            if(item.type === '1' || item.type === '3'){
              item.typeName = '申请认证'
            }
            if(item.type === '2' || item.type === '4'){
              item.typeName = '变更认证'
            }
            if(item.type === '5' || item.type === '6'){
              item.typeName = '作废认证'
            }
          }
        })
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
      //选择同注册地
      if (this.sameRegistration) {
        this.search.receivingAddress.provinceCode = this.search.provinceCode
        this.receivingProvinceChange()
      }
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
      //选择同注册地
      if (this.sameRegistration) {
        this.search.receivingAddress.cityCode = this.search.cityCode
        this.receivingCityChange()
      }
    },
    /**
     * 县数据变更
     */
    handleDistrictChange () {
      //选择同注册地
      if (this.sameRegistration) {
        this.search.receivingAddress.districtCode = this.search.districtCode
        this.receivingDistrictChange()
      }
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
  }
}
</script>
