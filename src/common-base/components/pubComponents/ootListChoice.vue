<!--
 * @Author: KeKe zkaip1@gmail.com
 * @Date: 2023-09-05 00:40:14
 * @LastEditors: KeKe zkaip1@gmail.com
 * @LastEditTime: 2024-05-28 15:49:41
 * @FilePath: \common-base\components\pubComponents\ootListChoice.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-fixed">
    <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
      <div class="flex flex-content-between">
        <div class="flex flex-items-start">
          <i class="icon-back" @click="ootListConfig.show = false"></i>
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
    <div class="viewport-view full-height">
      <div class="viewport-view-body flex flex-column full-height">
        <div class="panel flex-flex-auto full-height">
          <el-tabs
            v-model="ootCategory"
            :tab-position="'left'"
            type="border-card"
            class="full-height el-tab"
            @tab-click="handleClick"
            >
            <el-tab-pane
              label="商品"
              v-if="categoryList.indexOf(1) === -1 ? false :  true"
              style="padding: 0"
              class="full-height"
              name='1'>
              <div class="viewport-view full-height">
                <div class="viewport-view-body flex flex-column full-height">
                  <div class="panel pl15 pr15 pt10">
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                      <div class="search-bar-item">
                          <el-input
                            v-model="searchParams.name"
                            
                            size="small"
                            placeholder="商品名称"
                          ></el-input>
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" @click="search(1)">查询</el-button>
                        <el-button size="small" type="primary" v-if="ootListConfig.selection" @click="selectAll()">添加</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="flex-flex-auto panel p15 full-height" ref="viewBody" style="overflow: hidden">
                    <div class="full-height">
                      <el-tabs v-model="ootType" class="full-height" @tab-click="handleClick" type="border-card">
                        <!-- <el-tab-pane label="药品" name="101">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '101'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                        <el-tab-pane  label="器械" name="102">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '102'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                        <el-tab-pane label="食品" name="103" >
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '103'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                        <el-tab-pane label="消毒用品" name="104">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '104'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                        <el-tab-pane label="化妆品" name="105">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '105'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                        <el-tab-pane label="其他" name="199">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == '199'" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane> -->
                        <el-tab-pane v-for="item in productVal" :key="item" :label="productType[item]" :name="item">
                          <tableView ref="tableView" :selection="ootListConfig.selection" v-if="ootType == item" :list="list" :cols="cols" :height="'calc(100% - 30px)'"></tableView>
                        </el-tab-pane>
                    </el-tabs>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label='物料'
              v-if="categoryList.indexOf(2) === -1 ? false : true"
              class="full-height"
              name='2'>
              <div class="viewport-fixed full-height">
                <div class="viewport-view full-height">
                  <div class="viewport-view-body flex flex-column full-height">
                    <div class="panel pl15 pr15 pt10">
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                      <div class="search-bar-auto flex">
                        <el-input v-model="searchParams.name"
                          
                          size="small"
                          class="ml5 power-w150px"
                          placeholder="物料名称">
                        </el-input>
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
                      </div>
                    </div>
                  </div>
                    <div class="flex-flex-auto panel p15" ref="viewBody1">
                      <div class="panel-table-content full-height">
                        <tableView v-if="isMounted"
                            :list="list"
                            :cols="cols"
                            ref="tableView"
                            :height="'100%'">
                        </tableView>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label='服务'
              v-if="categoryList.indexOf(3) === -1 ? false : true"
              class="full-height"
              name='3'>
              <div class="viewport-fixed full-height">
                <div class="viewport-view full-height">
                  <div class="viewport-view-body flex flex-column full-height">
                    <div class="panel pl15 pr15 pt10">
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                      <div class="search-bar-auto flex">
                        <el-input v-model="searchParams.name"
                          
                          size="small"
                          class="ml5 power-w150px"
                          placeholder="名称">
                        </el-input>
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
                      </div>
                    </div>
                  </div>
                    <div class="flex-flex-auto panel p15" ref="viewBody1">
                      <div class="panel-table-content full-height">
                        <tableView v-if="isMounted"
                            :list="list"
                            :cols="cols"
                            ref="tableView"
                            :height="'100%'">
                        </tableView>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="资产"
              v-if="categoryList.indexOf(4) === -1 ? false : true"
              style="padding: 0"
              class="full-height"
              name='4'>
              <div class="viewport-fixed full-height">
                <div class="viewport-view full-height">
                  <div class="viewport-view-body flex flex-column full-height">
                    <div class="panel pl15 pr15 pt10">
                    <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
                      <div class="search-bar-auto flex">
                        <el-input v-model="searchParams.name"
                          
                          size="small"
                          class="ml5 power-w150px"
                          placeholder="名称">
                        </el-input>
                      </div>
                      <div class="search-bar-item-auto">
                        <el-button size="small" type="primary" class="ml5" @click="search(1)">查询</el-button>
                        <el-button size="small" type="primary" v-if="ootListConfig.selection" @click="selectAll()">添加</el-button>
                      </div>
                    </div>
                  </div>
                    <div class="flex-flex-auto panel p15" ref="viewBody1">
                      <div class="panel-table-content full-height">
                        <tableView
                          :selection="ootListConfig.selection"
                          v-if="isMounted"
                          :list="list"
                          :cols="cols"
                          ref="tableView"
                          :height="'100%'">
                        </tableView>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 商品更多详情展示 -->
    <div class="viewport-fixed" style="background: #fff; z-index: 102;" v-if="showDetail">
        <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
          <div class="flex flex-content-between">
            <div class="flex flex-items-start">
              <i class="icon-back" @click="showDetail = false"></i>
            </div>
          </div>
        </div>
        <div class="viewport-view full-width" style="overflow: hidden;">
          <iframe
              name="https://chart.lonch.com.cn"
              class="full-width full-height"
              style="border:none"
              :src='detailUrl'
              title=""
            >
          </iframe>
        </div>
    </div>
    <!-- src="http://local-chart.lonch.com.cn:8085/index.html#/main/dynamicTableNew?dataCode=1020&system=0001&type=0&moduleCode=99991021&params={'eq__spuId':'5bd353b93229d92d2141cdec5e6a9b0b'}&appName=manage" -->
    <!-- <div class="viewport-fixed" style="background: #fff; z-index: 10;" v-if="showDetail">
      <Iframe class="full-width full-height" src="http://local-chart.lonch.com.cn:8085#/main/dynamicTableNew?dataCode=1020&system=0001&type=0&moduleCode=99991021&params={'eq__spuId':'5bd353b93229d92d2141cdec5e6a9b0b'}&appName=manage"></Iframe>
    </div> -->
  </div>

</template>

<script type="text/ecmascript-6">
import tableView from './tableView';

export default {
  components: {
    tableView
  },
  props: ['ootListConfig'],
  data () {
    return {
      productVal: ['101', '102', '103', '104', '105', '199'],
      productType:{
        '101': '药品',
        '102': '器械',
        '103': '食品',
        '104': '消毒用品',
        '105': '化妆品',
        '199': '其他'
      },
      isMounted: false,
      tabPosition: 'left',
      categoryList: [1], //展示左侧哪些数据
      ootCategory: '1', //分类选择
      ootType: '101', //商品分类
      showDetail: false,
      Url: '',
      detailUrl: null,
      searchParams: {
        name:'',
        current: 1,
        rowCount:  20
      },
      total: 0,
      list: [],
      cols: [],
      gridHeight: '',
    };
  },
  created () {
    if(this.ootListConfig.ptypes && this.ootListConfig.ptypes.length){
      this.productVal = this.ootListConfig.ptypes;
      this.ootType = this.ootListConfig.ptypes[0]
    }
    if(this.ootListConfig.categoryList){
      this.categoryList = this.ootListConfig.categoryList;
    }
    if(this.ootListConfig.ootCategory){
      this.ootCategory = this.ootListConfig.ootCategory;
    }
    if(this.ootListConfig.ootType){
      this.ootType = this.ootListConfig.ootType;
    }
  },
  mounted () {
    this.initTableData();
  },
  methods: {
    handleClick(){
      this.isMounted = false;
      this.searchParams.current = 1;
      this.searchParams.rowCount = 20;
      this.initTableData();
    },
    //药品初始化选择
    initTableData(){
      if(this.ootCategory == 1){
        if(this.ootType == '101'){
          this.Url = this.CFG.services.oot.queryPagedDrug;
          this.cols = [
              { label: '药品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '规格', id: 'specification', width: '120',  },
              { label: '包装规格', id: 'packingSpecification',width: '120',  },
              { label: '生产企业', id: 'manufacturerValue', width: '180' },
              { label: '69码', id: 'barcode', width: '120' },
              { label: '批准文号', id: 'licenseNumber', width: '120' },
              { label: '上市许可持有人', id: 'mahValue', width: '140' },
              { label: '处方分类', id: 'rxTypeValue', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
              { label: '有效期', id: 'validPeriodValue', width: '100' },
          ];
          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {
            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                  {
                    name: '选择', click: (row) => {
                      this.selectOne(row);
                    }, condition: ()=>{
                      return !this.ootListConfig.selection;
                    }
                  },
                  {
                    name: '详情', click: (row) => {
                        this.toSeeDetail(row, '101');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }else if(this.ootType == '102'){
          this.Url = this.CFG.services.oot.queryPagedDevice;
          this.cols = [
              { label: '产品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '商品类型', id: 'productTypeValue', width: '120',  },
              { label: '医疗器械分类', id: 'medicalDeviceTypeValue',width: '120',  },
              { label: '规格型号', id: 'specificationAndModel', width: '180' },
              { label: '包装规格', id: 'packingSpecification', width: '120' },
              { label: '注册证号/备案号', id: 'licenseNumber', width: '120' },
              { label: '生产企业', id: 'manufacturerValue', width: '120' },
              { label: '商品69码', id: 'barcode', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
              { label: '有效期', id: 'validPeriodValue', width: '100' },
          ];

          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                  {
                    name: '选择', click: (row) => {
                      this.selectOne(row);
                    }, condition: ()=>{
                      return !this.ootListConfig.selection;
                    }
                  },
                  {
                    name: '详情', click: (row) => {
                      this.toSeeDetail(row , '102');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }else if(this.ootType == '103'){
          this.Url = this.CFG.services.oot.queryPagedFood;
          this.cols = [
              { label: '产品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '商品类型', id: 'productTypeValue', width: '120',  },
              { label: '包装规格', id: 'packingSpecification',width: '120',  },
              { label: '生产企业', id: 'manufacturerValue', width: '180' },
              { label: '商品69码', id: 'barcode', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
              { label: '有效期', id: 'validPeriodValue', width: '100' },
          ];

          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                  {
                    name: '选择', click: (row) => {
                      this.selectOne(row);
                    }, condition: ()=>{
                      return !this.ootListConfig.selection;
                    }
                  },
                  {
                    name: '详情', click: (row) => {
                        this.toSeeDetail(row, '103');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }else if(this.ootType == '104'){
          this.Url = this.CFG.services.oot.queryPagedDisinfection;
          this.cols = [
              { label: '产品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '商品类型', id: 'productTypeValue', width: '120',  },
              { label: '剂型', id: 'formulationValue',width: '120',  },
              { label: '规格', id: 'specification', width: '180' },
              { label: '包装规格', id: 'packingSpecification', width: '120' },
              { label: '注册证号/备案号', id: 'licenseNumber', width: '120' },
              { label: '生产企业', id: 'manufacturerValue', width: '120' },
              { label: '商品69码', id: 'barcode', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
              { label: '有效期', id: 'validPeriodValue', width: '100' },
          ];

          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                  {
                    name: '选择', click: (row) => {
                      this.selectOne(row);
                    }, condition: ()=>{
                      return !this.ootListConfig.selection;
                    }
                  },
                  {
                    name: '详情', click: (row) => {
                      this.toSeeDetail(row, '104');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }else if(this.ootType == '105'){
          //化妆品
          this.Url = this.CFG.services.oot.queryPagedCosmetics;
          this.cols = [
              { label: '产品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '包装规格', id: 'packingSpecification', width: '120',  },
              { label: '注册证号/备案号', id: 'licenseNumber',width: '120',  },
              { label: '生产企业', id: 'manufacturerValue', width: '180' },
              { label: '商品69码', id: 'barcode', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
              { label: '有效期', id: 'validPeriodValue', width: '100' },
          ];

          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                  {
                    name: '选择', click: (row) => {
                      this.selectOne(row);
                    }, condition: ()=>{
                      return !this.ootListConfig.selection;
                    }
                  },
                  {
                    name: '详情', click: (row) => {
                        this.toSeeDetail(row, '105');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }else if(this.ootType == '199'){
          this.Url = this.CFG.services.oot.queryPagedOther;
          this.cols = [
              { label: '产品名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left' },
              { label: '商品类型', id: 'productTypeValue', width: '120',  },
              { label: '规格', id: 'specification',width: '120',  },
              { label: '型号', id: 'model', width: '180' },
              { label: '包装规格', id: 'packingSpecification', width: '120' },
              { label: '生产企业', id: 'manufacturerValue', width: '120' },
              { label: '商品69码', id: 'barcode', width: '120' },
              { label: '商标', id: 'trademark', width: '120' },
          ];

          if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

            this.cols.push(
              { label: '操作', fixed: 'right', width: '80', btns: [
                {
                  name: '选择', click: (row) => {
                    this.selectOne(row);
                  }, condition: ()=>{
                    return !this.ootListConfig.selection;
                  }
                  },
                  {
                    name: '详情', click: (row) => {
                      this.toSeeDetail(row, '199');
                    },
                    condition: ()=>{
                      return !this.ootListConfig.noDetails;
                    },
                  },
                ]
              }
            )
          }
        }
      } else if(+this.ootCategory === 2){
        this.Url = this.CFG.services.oot.queryPagedMaterial;
        this.cols = [
          { label: '物料名称', id: 'name', width: '120', fixed: this.CFG.client.isMobile ? false : 'left', tooltip: true },
          { label: '物料编号', id: 'code', width: '120',  },
          { label: '规格', id: 'specification', width: '120',  },
          { label: '型号', id: 'model', width: '120',  },
          { label: '材质', id: 'texture', width: '120',  },
          { label: '品牌', id: 'brand', width: '120'},
          { label: '颜色', id: 'color', width: '120' },
          { label: '生产厂商', id: 'manufacturerValue', width: '120' },
          { label: '售后期限', id: 'length', width: '120', render: (row) => `${row.servicePeriodNum || ''}${row.servicePeriodUnitValue || ''}` },
        ];

        if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

          this.cols.push(
            { label: '操作', fixed: 'right', width: '80', btns: [
              {
                name: '选择', click: (row) => {
                  this.selectOne(row);
                }, condition: ()=>{
                  return !this.ootListConfig.selection;
                }
                },
                {
                  name: '详情', click: (row) => {
                    this.toSeeDetail(row, 'material');
                  },
                  condition: ()=>{
                    return !this.ootListConfig.noDetails;
                  },
                },
              ]
            }
          )
        }
      } else if(this.ootCategory == 3){
        this.Url = this.CFG.services.oot.queryPagedService;
        this.cols = [
          { label: '服务名称', id: 'productName', width: '120', fixed: this.CFG.client.isMobile ? false : 'left', tooltip: true },
          { label: '服务类型', id: 'productTypeValue', width: '120',  },
          { label: '规格', id: 'specification', width: '120', tooltip: true },
          { label: '服务供应商', id: 'supplierValue', width: '120' },
          { label: '商品69码', id: 'barcode', width: '120' },
          { label: '商标', id: 'trademark', width: '120' },
        ];

        if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {

          this.cols.push(
            { label: '操作', fixed: 'right', width: '80', btns: [
              {
                name: '选择', click: (row) => {
                  this.selectOne(row);
                }, condition: ()=>{
                  return !this.ootListConfig.selection;
                }
                },
                {
                  name: '详情', click: (row) => {
                    this.toSeeDetail(row, 'service');
                  },
                  condition: ()=>{
                    return !this.ootListConfig.noDetails;
                  },
                },
              ]
            }
          )
        }
      } else if(this.ootCategory === '4'){
        this.Url = this.CFG.services.oot.queryPagedAsset;
        this.cols = [
          { label: '资产所有者', id: 'possessorName', width: '120' },
          { label: '资产大类', id: 'assetCategoryValue', width: '120',  },
          { label: '资产类型', id: 'assetTypeValue', width: '120', tooltip: true },
          { label: '资产名称', id: 'assetName', width: '120' },
          { label: '规格型号', id: 'specificationAndModel', width: '120' },
          { label: '包装规格', id: 'packingSpecification', width: '120' },
          { label: '集成商', id: 'integratorName', width: '120' },
          { label: '生产厂家', id: 'manufacturerName', width: '120' },
          { label: '主计量单位', id: 'mainUnit', width: '120' },
        ];
        if ( !this.ootListConfig.selection || !this.ootListConfig.noDetails) {
          this.cols.push(
            { label: '操作', fixed: 'right', width: '80', btns: [
              {
                name: '选择', click: (row) => {
                  this.selectOne(row);
                }, condition: ()=>{
                  return !this.ootListConfig.selection;
                }
                },
                {
                  name: '详情', click: (row) => {
                    this.toSeeDetail(row, 'property');
                  },
                  condition: ()=>{
                    return !this.ootListConfig.noDetails;
                  },
                },
              ]
            }
          )
        }
      } 
      this.search(1);
      this.$nextTick(()=>{
        this.isMounted = true;
      });
    },
    /**
     * 查看详情
     */
    toSeeDetail(row, code){
      let args = {
        originName:  'chart',
        routePath: '/main/dynamicTableNew',
        type:'0',
        system: '0001',
        query: {
          params: {},
          appName: 'manage',
        }
      };
      switch(code) {
        case '101':
          args.query.params['eq__1330.id'] = row.id;
          args.query.moduleCode = '99991330';
          args.query.dataCode = '1330';
          break;
        case '102':
          args.query.params['eq__1331.id'] = row.id;
          args.query.moduleCode = '99991331';
          args.query.dataCode = '1331';
          break;
        case '103':
          args.query.params['eq__1332.id'] = row.id;
          args.query.moduleCode = '99991332';
          args.query.dataCode = '1332';
          break;
        case '104':
          args.query.params['eq__1333.id'] = row.id;
          args.query.moduleCode = '99991333';
          args.query.dataCode = '1333';
          break;
        case '105':
          args.query.params['eq__1366.id'] = row.id;
          args.query.moduleCode = '99991366';
          args.query.dataCode = '1366';
          break;
        case '199':
          args.query.params['eq__1334.id'] = row.id;
          args.query.moduleCode = '99991334';
          args.query.dataCode = '1334';
          break;
        case 'material':
          args.query.params['eq__2400.id'] = row.id;
          args.query.dataCode = '2400';
          break;
        case 'service':
          args.query.params['eq__1335.id'] = row.id;
          args.query.moduleCode = '99991335';
          args.query.dataCode = '1335';
          break;
        case 'property':
          args.query.params['eq__2249.id'] = row.id;
          args.query.moduleCode = '99992249';
          args.query.dataCode = '2249';
          break;
        default:
          break;
      }
      let url = this.createUrl(args);
      let toUrl = this.utils.makeUrl(url, args.query);

      if(this.CFG.client.isApp) { // 如果是在app中打开
        // this.appJumpHandle(data[item.fieldKey])
        let url = `${toUrl}&hiddenMenu=true&hiddenHeader=true&token=` + this.CFG.client.clientInfo.token;
        // if(this.CFG.client.isIOS || this.CFG.client.isWindows) {  // windows 和 mac
        //   // this.API.send(this.CFG.services.im.cmdOpenNewWindow, {
        //   //   url: toUrl + `&token=` + this.CFG.token || this.CFG.client.clientInfo.token
        //   // }, function () { }, function () { }, this, true);
        //   this.API.send({ command: 'cmdAppOpenUrl' }, {
        //     url: url,
        //     addChat: false,
        //     title: '',
        //     animated: false,
        //     isBackTitleBar: true,
        //     config: {
        //       type: 'normal',
        //       isBackTitleBar: true,
        //       addChat: false,
        //       animated: false,
        //     }
        //   }, function () { }, function () { }, this, true);
        // } else {  // 安卓和ios
        //   this.API.send({ command: 'cmdAppOpenUrl' }, {
        //     url: url,
        //     addChat: false,
        //     title: '',
        //     animated: false,
        //     isBackTitleBar: true,
        //     config: {
        //       type: 'normal',
        //       isBackTitleBar: true,
        //       addChat: false,
        //       animated: false,
        //     }
        //   }, function () { }, function () { }, this, true);
        // }
        // 20241226优化sonar
        // 上面的if else条件完全一致，所以去掉
        this.API.send({ command: 'cmdAppOpenUrl' }, {
          url: url,
          addChat: false,
          title: '',
          animated: false,
          isBackTitleBar: true,
          config: {
            type: 'normal',
            isBackTitleBar: true,
            addChat: false,
            animated: false,
          }
        }, function () { }, function () { }, this, true);
      } else {
        this.detailUrl = toUrl + `&token=` + this.CFG.token || this.CFG.client.clientInfo.token;
        this.showDetail = true;
      }


      // this.detailUrl = toUrl + `&token=` + this.CFG.token;
      // this.showDetail = true;
    },
    createUrl (args) {
        if (args.url) {
          return args.url;
        }
        let arr = [];
        if (args.path && 'http[s]?:'.test(args.path)) {
          arr.push(args.path);
        } else if (args.originName !== '') {
          let origin = this.utils.matchedData(this.CFG.origins, 'name', args.originName, true);
          if (origin && origin.length > 0) {
            arr.push(origin[0].domain);
          }
          arr.push(args.path || '/index.html');
        }
        if (args.routePath) {
          if (args.originName === '') {
            arr.push(args.routePath);
          } else {
            arr.push(/^#/.test(args.routePath) ? args.routePath : '#' + args.routePath);
          }
        }
        return this.utils.transformationMachedVersion(arr.join(''), this.CFG.versionConfig);
    },
    /**
     * 分页查询
     */
    search (pager) {
      this.searchParams.current = pager;
      this.getData(this.searchParams);
    },
    /**
     * 批量选择
     */
    selectAll(){
      let arr;
      if(this.$refs.tableView instanceof Array){
        arr = this.$refs.tableView[0].getSelectionData();
      }else{
        arr = this.$refs.tableView.getSelectionData();
      }
      if(arr && arr.length > 0) {
        if(this.ootCategory == 1 ){
          this.ootListConfig.ootType = this.ootType;
        }
        this.ootListConfig.ootCategory = this.ootCategory;
        this.ootListConfig.okFn(arr);
        this.ootListConfig.show = false;
      }else{
        this.$toast({text: '请选择数据'});
      }
    },
    /**
     *
     * @param row 行数据
     */
    selectOne(row){
      row.category = this.searchParams.category;
      if(this.ootCategory == 1 ){
        this.ootListConfig.ootType = this.ootType;
      }
      this.ootListConfig.ootCategory = this.ootCategory;
      this.ootListConfig.okFn(row);
      this.ootListConfig.show = false;
    },
    // toDetail(){
    //   http://local-chart.lonch.com.cn:8085#/main/dynamicTableNew?dataCode=1020&system=0001&type=0&moduleCode=99991021&params={'eq__spuId':'5bd353b93229d92d2141cdec5e6a9b0b'}&appName=manage
    //   https://test-chart.lonch.com.cn/index.html#/main/dynamicTableNew?dataCode=1288&system=0001&type=0&appName=manage&moduleCode=xx
    // },
    /**
     * 分页请求列表数据
     * @param args 查询条件
     */
    getData (args) {
      // 增加id集合查询
      if(this.ootListConfig.ids && this.ootListConfig.ids.length){
        args.scope = this.ootListConfig.ids
      }
      args.ootCategory = this.ootCategory;
      args.ootType = this.ootType;
      if(this.ootListConfig.params){
        args = Object.assign(args, this.ootListConfig.params);
      }
      this.API.send(this.Url, args, function (res) {
        res = res.serviceResult;
        this.list = res.rows;
        this.total = res.total>=0 ? res.total : this.total;
      }, function () {
      }, this);
    },
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.lh32{
  line-height: 32px;
}
.el-tab{
  height: 100%;
}
.label-tab-top{
  line-height:30px;
  margin: 0 6px;
}
::v-deep .el-tabs--left .el-tabs__header.is-left{
  margin-right: 0;
}
::v-deep .el-tabs--border-card>.el-tabs__content{
  padding: 6px 0px;
  height: 100%;
}
.el-tab ::v-deep{
  .el-tab-pane{
    height: 100%;
  }
}
</style>
