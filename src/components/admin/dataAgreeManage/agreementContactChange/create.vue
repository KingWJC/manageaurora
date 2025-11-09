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
          <h2 class="pl15 pb10">协议嵌套关联关系修改申请单</h2>
          <div class="pl15 pr15">
            <div class="card card-shadow mt10">
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
                  <div class="lc-row lc-space16" v-if="isShow">
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
                            </div>
                          </div>
                          <!-- 
                            确认操作
                          -->
                          <div class="card-footer">
                            <span class="black">是否为此协议嵌套关联关系进行修改:</span>
                            <el-button type='text' class="link ml10" @click="toEdit(item.id)">确定</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 
                      未查询数据
                    -->
                    <div v-else class="tac mt50 mb50 darkgray">未查询数据</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import crumbsBar from '@/common-base/components/crumbs-bar';
import QualificationUploader from '../QualificationUploader'
import keepAliveMixin from "@/common-base/mixins/keep-alive";
import selectOrg from '../selectOrg';
import treeselect from '@riophae/vue-treeselect'
import { contractTypeName } from '../config';
let commonAreaData;
export default {
  name: 'orgEditApplyCreate',
  mixins:[keepAliveMixin],
  components: {
    OssUpload,
    crumbsBar,
    QualificationUploader,
    selectOrg,
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
      ident: '',
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
    this.contractTypeName = contractTypeName;
  },
  mounted () {
  },
  methods: {
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
      if (!this.search.contractId && !this.search.refContractType && !this.search.refContractId) {
        this.$toast({ text: `请输入查询信息` });
        return
      }
      // 增加查询有效的数据
      this.search.status = '1';
      this.API.send(this.CFG.services.ecRef.list, this.search, function (res) {
        this.total = res.data.total > 0 ? res.data.total : this.total
        this.list = res.data.rows
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
     * 去编辑
     */
    toEdit (id) {
      this.$router.push({
        path: '/admin/agreementContactChangegoCreate',
        query: {
          orgId: id
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .vue-treeselect {
    margin-top: 0;
  }
  .tooltip-line-3 {
    max-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
<style lang="scss">
  .table-tooltip-line-clamp {
    max-width: 80%;
  }
</style>
