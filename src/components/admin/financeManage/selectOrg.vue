<template>
    <div class="viewport-fixed">
      <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
        <div class="flex flex-content-between">
          <div class="flex flex-items-start">
            <i class="icon-back" @click="selectOrgConfig.show = false"></i>
          </div>
        </div>
      </div>
      <div class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="search"
          :page-size="searchParams.rowCount"
          :current-page="searchParams.current"
          :total="total">
        </el-pagination>
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <!--
            核名机构
          -->
          <div class="panel pl15 pr15 pt10" v-if="selectOrgConfig.type === 1">
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <div class="search-bar-item">
                <!-- 
                  名称
                -->
                <el-input v-model="searchParams.name"
                  size="small"
                  class="mr5"
                  placeholder="名称">
                </el-input>
              </div>
              <div class="search-bar-item">
                <!-- 
                  机构联系人
                -->
                <el-input v-model="searchParams.linkmanName"
                  size="small"
                  class="mr5"
                  placeholder="机构联系人">
                </el-input>
              </div>
              <div class="search-bar-item">
                <!-- 
                  机构联系人电话
                -->
                <el-input v-model="searchParams.linkmanPhone"
                  size="small"
                  class="mr5"
                  placeholder="机构联系人电话">
                </el-input>
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
              </div>
            </div>
          </div>
          <!--
            查合同
          -->
          <div class="panel pl15 pr15 pt10" v-if="selectOrgConfig.type === 2">
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <div class="search-bar-item">
                <!-- 
                  合同id
                -->
                <el-input
                  v-model="searchParams.relContractId"
                  size="small"
                  placeholder="合同ID">
                </el-input>
              </div>
              <div class="search-bar-item">
                <el-input
                  v-model="searchParams.partyaName"
                  size="small"
                  placeholder="甲方名称">
                </el-input>
              </div>
              <div class="search-bar-item">
                <el-input
                  v-model="searchParams.partybName"
                  size="small"
                  placeholder="乙方名称">
                </el-input>
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
              </div>
            </div>
          </div>
          <!-- 
            查自然人
          -->
          <div class="panel pl15 pr15 pt10" v-if="selectOrgConfig.type === 3">
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <!-- 
                姓名
              -->
              <div class="search-bar-item">
                <el-input v-model="searchParams.name"
                  size="small"
                  class="ml5 power-w150px"
                  placeholder="名称">
                </el-input>
              </div>
              <!-- 
                手机号
              -->
              <div class="search-bar-item">
                <el-input v-model="searchParams.cellphone"
                  size="small"
                  class="ml5 power-w150px"
                  placeholder="手机号">
                </el-input>
              </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
              </div>
            </div>
          </div>
          <!-- 
            查商户
          -->
          <div class="panel pl15 pr15 pt10" v-if="selectOrgConfig.type === 4">
            <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
              <!-- 
                姓名
              -->
              <div class="search-bar-item">
                <el-input v-model="searchParams.name"
                  size="small"
                  class="ml5 power-w150px"
                  placeholder="名称">
                </el-input>
              </div>
              <!--
              商户分类
             -->
             <div class="search-bar-item">
              <el-select v-model="searchParams.category" size="small" class="ml5 power-w150px"
                @input="$forceUpdate()"
                placeholder="商户分类">
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
              </el-select>
            </div>
              <div class="search-bar-item-auto">
                <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
              </div>
            </div>
          </div>
          <div class="flex-flex-auto panel p15" ref="viewBody">
            <div class="panel-table-content">
              <tableView v-if="isMounted"
                :list="list"
                :cols="cols"
                :height="gridHeight">
              </tableView>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
import tableView from '@/common-base/components/pubComponents/tableView'
let commonAreaData;
export default {
  components: {
    tableView
  },
  props: ['selectOrgConfig'],
  data () {
    return {
      orderData: {},
      isMounted: false,
      searchParams: {
        name:'',
        current: 1,
        rowCount:  20
      },
      total: 0,
      list: [],
      cols: [],
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      provinces_opts: [], // 省
      citys_opts: [], // 市
      districts_opts: [], // 县
      gridHeight: ''
    }
  },
  created () {
    commonAreaData = vue.getCommonDictionary('area');
    this.provinces_opts = commonAreaData.filter(ad => ad.p === '');
    this.provinces_opts.unshift({id: '', name: '请选择...'});
    this.initList(this.selectOrgConfig.type);
  },
  mounted () {
    this.isMounted = true
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + 'px'
  },
  methods: {
    initList(type){
      /**
       * 查核名组织
       */
      if(type === 1){
        this.cols = [
          { label: '名称', id: 'name', width: '150' },
          { label: '省', id: 'provinceCode', width: '130', render: (row)=>{
            if(row.provinceCode){
              let provinceName = commonAreaData.find(ad => ad.c === row.provinceCode);
              let provinceNameStr = (!!provinceName ? provinceName.name : '');
              row.provinceName = provinceNameStr;
              return row.provinceName;
            }
          }
        },
          { label: '市', id: 'cityCode', width: '130',render: (row)=>{
            if(row.cityCode){
              let cityName = commonAreaData.find(ad => ad.c === row.cityCode);
              row.cityName = (!!cityName ? cityName.name : '');
              return row.cityName;
            }
          } 
        },
          { label: '县', id: 'districtCode', width: '130', render: (row)=>{
            if(row.districtCode){
              let districtName = commonAreaData.find(ad => ad.c === row.districtCode);
              row.districtName = (!!districtName ? districtName.name : '');
              return row.districtName;
            }
          }
        },
        { label: '地址', id: 'address', width: '130' },
      ];
    } 
    /**
     * 查合同
     */
    if(type === 2){
        this.cols = [
          { label: '合同ID', id: 'id', width: '130' },
          { label: '甲方名称', id: 'partyAName', width: '130' },
          { label: '乙方名称', id: 'partyBName', width: '130' },
          { label: '丙方名称', id: 'partyCName', width: '130' },
          // { label: '业务员（签约）', id: 'salesmanName', width: '130' },
          // { label: '业务员（签约）手机号', id: 'salesmanCellphone', width: '130' },
          { label: '合同版号', id: 'versionNum', width: '130' },
        ];
      }
      /**
       * 查自然人
       */
      if(type === 3){
        this.cols = [
          { label: '姓名', id: 'name', width: '130' },
          { label: '手机号', id: 'cellphone', width: '130' },
          { label: '身份证号码', id: 'identificationNumber', width: '130' },
        ];
      }
      /**
       * 查商户
       */
      if(type === 4){
        this.cols = [
          { label: '商户名称', id: 'name', width: '130' },
          { label: '商户ID', id: 'id', width: '130' },
          { label: '商户分类', category: 'id', width: '130', render: (row)=>{
            if(row.category){
              if(row.category === '1'){
                return '私域商城'
              } else if(row.category === '2'){
                return '云药房'
              } else if(row.category === '3'){
                return '云诊室'
              } else if(row.category === '4'){
                return '药发采'
              } else if(row.category === '5'){
                return '云氧疗'
              } else if(row.category === '6'){
                return '云药房S'
              } else if(row.category === '7'){
                return '逆时舱'
              }
              }
            } 
          },
          // { label: '备注', id: 'remark', width: '130' }
        ];
      }
      this.cols.push({
        label: '操作', width: '100', fixed: 'right', btns: [
          {
            name: '选择', click: (row) => {
              this.selectOrg(row);
            }
          },
        ]
      })
    },
    /**
     * 分页查询
     */
    search (pager) {
      this.searchParams.current = pager;
      if(this.selectOrgConfig.type === 98 &&  !this.searchParams.name && !this.searchParams.linkmanName && !this.searchParams.linkmanPhone){
        this.$toast({ text: `请输入查询信息` });
        return
      }
      this.getData(this.searchParams);
    },
    /**
     * 选择机构为签署人
     * @param row 行数据
     */
    selectOrg(row){
      this.selectOrgConfig.okFn(row);
      this.selectOrgConfig.show = false;
    },
    /**
     * 省数据变更
     */
    handleProvinceChange () {
      let citys = [];
      if (this.provinceCode) {
        citys = commonAreaData.filter(ad => ad.p === this.provinceCode);
      }
      citys.unshift({id: '', name: '请选择...'});
      this.citys_opts = citys;
      this.districts_opts = [{id: '', name: '请选择...'}];
      this.cityCode = '';
      this.$forceUpdate();
    },
    /**
     * 市数据变更
     */
    handleCityChange () {
      let districts = [];
      if (this.cityCode) {
        districts = commonAreaData.filter(ad => ad.p === this.cityCode);
      }
      this.districtCode = '';
      districts.unshift({id: '', name: '请选择...'});
      this.districts_opts = districts;
    },
    /**
     * 分页请求列表数据
     * @param args 查询条件
     */
    getData (args) {
      let services = null;
      /**
       * 查核名组织
       */
      if (this.selectOrgConfig.type === 1) {
        services = this.CFG.services.industryCode.searchOrgsByPage;
        args.nameVerifyStatus = '1';
      }
      /**
       * 查合同
       */
      if (this.selectOrgConfig.type === 2) {
        services = this.CFG.services.ecContract.list;
      }
      /**
       * 查自然人
       */
      if (this.selectOrgConfig.type === 3) {
        services = this.CFG.services.certification.selectHumans;
        // args.authStatus = '1';
      }
      /**
       * 查商户
       */
      if (this.selectOrgConfig.type === 4) {
        services = this.CFG.services.shop.list;
        args.status = '1';
      } 
      this.API.send(services, args, function (res) {
        res = res.serviceResult || {};
        this.isMounted = true;
        this.list = res.rows;
        this.total = res.total>=0 ? res.total : this.total;
      }, function () {
      }, this)
    },
  }
}
</script>
<style scoped>
  .el-radio-group label:not(:first-child) {
    margin: 0;
  }
</style>
