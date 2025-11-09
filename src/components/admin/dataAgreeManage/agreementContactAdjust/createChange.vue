<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div class="viewport-fixed" ref="viewBody">
    <!--
      返回
    -->
    <crumbs-bar></crumbs-bar>
    <!--
      底部保存
    -->
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center">
      <div class="flex flex-content-center">
        <button class="btn btn-primary btn-xl" type="submit" @click="saveOrder">保存</button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded ">
          <div class="full-width flex flex-content-between">
            <h2>协议嵌套关联关系待生效数据调整单-新增</h2>
          </div>
          <!--
            协议信息
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>协议信息</strong>
              </div>
              <div class="card-content-padded">
                <!-- <div class="lc-row lc-space16"> -->
                  <!--
                    选择合同
                  -->
                  <!-- <div class="lc-col-12 lc-col-xs10 pt15 pb5">
                    <div class="flex flex-content-start flex-items-center">
                      <el-button size="small" type="primary" @click="addContract('contractData')">选择协议</el-button>
                    </div>
                  </div>
                </div> -->
                <!--
                  有协议的时候才显示
                -->
                <div class="lc-col-12 lc-col-xs12" v-if="orderData.contractId">
                  <!--
                    签署方信息
                  -->
                  <div class="card card-shadow">
                    <div class="card-body">
                      <div class="card-header">
                        <strong>签署方信息</strong>
                      </div>
                      <div class="card-content-padded">
                        <div class="lc-row lc-space16">
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                签署方:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="contractData.partyNumber"
                                  class="full-width"
                                  disabled
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in numberList"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <div v-for="(item, index) in contractData.enterList" :key="index">
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
                                    <div class="flex flex-flex-auto">
                                      <span v-if="scope.row.subjectName">{{scope.row.subjectName}}</span>
                                      <span v-else class="blue">请选择</span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  方地址
                                -->
                                <el-table-column
                                  prop="subjectAddress"
                                  label="地址"
                                  min-width="120"
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
                                <el-table-column
                                  prop="deputyName"
                                  :label="item.name + '签约代表'"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div class="flex flex-flex-auto">
                                      <span v-if="scope.row.deputyName">{{scope.row.deputyName}}</span>
                                      <span v-else class="blue">请选择</span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  手机号
                                -->
                                <el-table-column
                                  prop="deputyCellphone"
                                  label="手机号"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    {{scope.row.deputyCellphone | formatEmpty('--')}}
                                  </template>
                                </el-table-column>
                                <!--
                                  是否是法定代表人
                                -->
                                <el-table-column
                                  prop="isLegalPerson"
                                  label="是否是法定代表人"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div class="flex flex-flex-auto">
                                      <el-radio disabled v-model="scope.row.isLegalPerson" label="1">是</el-radio>
                                      <el-radio disabled v-model="scope.row.isLegalPerson" label="2">否</el-radio>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  签约代表委托书
                                -->
                                <el-table-column
                                  prop="authorizationCertUrls"
                                  label="签约代表委托书"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div v-if="scope.row.isLegalPerson === '2'">
                                      <span class="blue power-va5">请上传</span>
                                      <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addFang_3Show(scope.row, fangData[index], scope.$index)"></span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  签署状态
                                -->
                                <el-table-column
                                  prop="auditStatus"
                                  label="签署状态"
                                  min-width="130"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <span v-if="scope.row.signatoryRecordDto">
                                      <span v-if="scope.row.signatoryRecordDto.signStatus === '0'">未签署</span>
                                      <span v-else-if="scope.row.signatoryRecordDto.signStatus === '1'">已签署</span>
                                      <span v-else-if="scope.row.signatoryRecordDto.signStatus === '2'">拒绝签署</span>
                                    </span>
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
                                      <span class="ml10 link" @click="seeQZ(scope.row)">查看签字</span>
                                    </p>
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
                    合同信息
                  -->
                  <div class="card card-shadow">
                    <div class="card-body">
                      <div class="card-header">
                        <strong>合同信息</strong>
                      </div>
                      <div class="card-content-padded">
                        <div class="lc-row lc-space16">
                          <!--
                            签约地点 省
                          -->
                          <div class="lc-col-12 lc-col-xs12">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">签约地点:</label>
                              <div class="flex-flex-auto">
                                <div class="lc-col-12 lc-col-xs2">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select
                                        v-model="contractData.signProvinceCode"
                                        disabled
                                        size="small"
                                        class="full-width"
                                        placeholder="请选择省">
                                        <el-option
                                          v-for="(item, index) in provinces_yj"
                                          :key="index"
                                          :label="item.n"
                                          :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                                <!--
                                  市
                                -->
                                <div class="lc-col-12 lc-col-xs2">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select v-model="contractData.signCityCode"
                                        disabled
                                        size="small"
                                        class="full-width"
                                        placeholder="请选择市">
                                        <el-option
                                          v-for="(item, index) in citys_yj"
                                          :key="index"
                                          :label="item.n"
                                          :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                                <!--
                                  县
                                -->
                                <div class="lc-col-12 lc-col-xs2"
                                      v-if="!contractData.signProvinceCode || !contractData.signCityCode || this.districts_yj.length > 1">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select
                                        v-model="contractData.signCountyCode"
                                        disabled
                                        class="full-width"
                                        size="small"
                                        placeholder="请选择县">
                                        <el-option
                                          v-for="(item, index) in this.districts_yj"
                                          :key="index"
                                          :label="item.n" :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--
                            签约时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">签约时间:</label>
                              <div class="flex flex-flex-auto">
                                <el-date-picker
                                  v-model="contractData.signTime"
                                  disabled
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择日期">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同版号
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同版号:</label>
                              <div class="flex-flex-auto">
                                <el-select v-model="contractData.versionNum"
                                  disabled
                                  class="full-width"
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in banList"
                                    :key="temp.version"
                                    :label="temp.version"
                                    :value="temp.version">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同约定生效时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同约定生效时间:</label>
                              <div class="flex-flex-auto">
                                <el-date-picker
                                  v-model="contractData.contractEffectiveTime"
                                  disabled
                                  :picker-options="startTimeOptions"
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择时间">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同约定终止时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同约定终止时间:</label>
                              <div class="flex-flex-auto">
                                <el-date-picker
                                  v-model="contractData.contractFailureTime"
                                  disabled
                                  :picker-options="endTimeOptions"
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择时间">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            契约类型
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                契约类型:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="contractData.deedType"
                                  disabled
                                  class="full-width"
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in deedTypeOpts"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同类型
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                合同类型:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="contractData.contractType"
                                  class="full-width"
                                  disabled
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in contractTypeOpts"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--
            关联协议信息
          -->
          <div class="card card-shadow">
            <div class="card-body">
              <div class="card-header">
                <strong>关联信息</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <!--
                    关联类型
                  -->
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-items-center">
                      <label class="label nowrap">
                        <span class="red">*</span>关联类型:
                      </label>
                      <div class="flex-flex-auto">
                        <el-select v-model="orderData.refContractType"
                          @change="refContractTypeChange"
                          class="full-width"

                          placeholder="请选择"
                          size="small">
                          <el-option
                            label="协议"
                            value="1">
                          </el-option>
                          <el-option
                            label="签署单"
                            value="2">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <!--
                    选择合同
                  -->
                  <div class="lc-col-12 lc-col-xs10 pt15 pb5">
                    <div class="flex flex-content-start flex-items-center">
                      <el-button size="small" type="primary" @click="addContract('refContractData')">选择关联协议</el-button>
                    </div>
                  </div>
                </div>
                <!--
                  有协议的时候才显示
                -->
                <div class="lc-col-12 lc-col-xs12" v-if="orderData.refContractId">
                  <!--
                    签署方信息
                  -->
                  <div class="card card-shadow">
                    <div class="card-body">
                      <div class="card-header">
                        <strong>签署方信息</strong>
                      </div>
                      <div class="card-content-padded">
                        <div class="lc-row lc-space16">
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                签署方:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="refContractData.partyNumber"
                                  class="full-width"
                                  disabled
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in numberList"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <div v-for="(item, index) in refContractData.enterList" :key="index">
                            <div class="lc-col-12 lc-col-xs12 mt10">
                              <el-table :data="refangData[index]" max-height="200" width="100%" border stripe ref="gridTable">
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
                                    <div class="flex flex-flex-auto">
                                      <span v-if="scope.row.subjectName">{{scope.row.subjectName}}</span>
                                      <span v-else class="blue">请选择</span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  方地址
                                -->
                                <el-table-column
                                  prop="subjectAddress"
                                  label="地址"
                                  min-width="120"
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
                                <el-table-column
                                  prop="deputyName"
                                  :label="item.name + '签约代表'"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div class="flex flex-flex-auto">
                                      <span v-if="scope.row.deputyName">{{scope.row.deputyName}}</span>
                                      <span v-else class="blue">请选择</span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  手机号
                                -->
                                <el-table-column
                                  prop="deputyCellphone"
                                  label="手机号"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    {{scope.row.deputyCellphone | formatEmpty('--')}}
                                  </template>
                                </el-table-column>
                                <!--
                                  是否是法定代表人
                                -->
                                <el-table-column
                                  prop="isLegalPerson"
                                  label="是否是法定代表人"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div class="flex flex-flex-auto">
                                      <el-radio disabled v-model="scope.row.isLegalPerson" label="1">是</el-radio>
                                      <el-radio disabled v-model="scope.row.isLegalPerson" label="2">否</el-radio>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  签约代表委托书
                                -->
                                <el-table-column
                                  prop="authorizationCertUrls"
                                  label="签约代表委托书"
                                  min-width="120"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <div v-if="scope.row.isLegalPerson === '2'">
                                      <span class="blue power-va5">请上传</span>
                                      <span class="el-icon-circle-plus-outline ml10 power-fs26 blue" @click="addFang_3Show(scope.row, fangData[index], scope.$index)"></span>
                                    </div>
                                  </template>
                                </el-table-column>
                                <!--
                                  签署状态
                                -->
                                <el-table-column
                                  prop="auditStatus"
                                  label="签署状态"
                                  min-width="130"
                                  align='center'
                                  :resizable="false">
                                  <template slot-scope="scope">
                                    <span v-if="scope.row.signatoryRecordDto">
                                      <span v-if="scope.row.signatoryRecordDto.signStatus === '0'">未签署</span>
                                      <span v-else-if="scope.row.signatoryRecordDto.signStatus === '1'">已签署</span>
                                      <span v-else-if="scope.row.signatoryRecordDto.signStatus === '2'">拒绝签署</span>
                                    </span>
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
                                      <span class="ml10 link" @click="seeQZ(scope.row)">查看签字</span>
                                    </p>
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
                    合同信息
                  -->
                  <div class="card card-shadow">
                    <div class="card-body">
                      <div class="card-header">
                        <strong>合同信息</strong>
                      </div>
                      <div class="card-content-padded">
                        <div class="lc-row lc-space16">
                          <!--
                            签约地点 省
                          -->
                          <div class="lc-col-12 lc-col-xs12">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">签约地点:</label>
                              <div class="flex-flex-auto">
                                <div class="lc-col-12 lc-col-xs2">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select
                                        v-model="refContractData.signProvinceCode"
                                        disabled
                                        size="small"
                                        class="full-width"
                                        placeholder="请选择省">
                                        <el-option
                                          v-for="(item, index) in provinces_yj"
                                          :key="index"
                                          :label="item.n"
                                          :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                                <!--
                                  市
                                -->
                                <div class="lc-col-12 lc-col-xs2">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select v-model="refContractData.signCityCode"
                                        disabled
                                        size="small"
                                        class="full-width"
                                        placeholder="请选择市">
                                        <el-option
                                          v-for="(item, index) in citys_yj"
                                          :key="index"
                                          :label="item.n"
                                          :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                                <!--
                                  县
                                -->
                                <div class="lc-col-12 lc-col-xs2"
                                      v-if="!refContractData.signProvinceCode || !refContractData.signCityCode || this.districts_yj.length > 1">
                                  <div class="flex flex-content-start flex-items-center">
                                    <div class="flex-flex-auto mr10 mb5">
                                      <el-select
                                        v-model="refContractData.signCountyCode"
                                        disabled
                                        class="full-width"
                                        size="small"
                                        placeholder="请选择县">
                                        <el-option
                                          v-for="(item, index) in this.districts_yj"
                                          :key="index"
                                          :label="item.n" :value="item.c">
                                        </el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--
                            签约时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">签约时间:</label>
                              <div class="flex flex-flex-auto">
                                <el-date-picker
                                  v-model="refContractData.signTime"
                                  disabled
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择日期">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同版号
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同版号:</label>
                              <div class="flex-flex-auto">
                                <el-select v-model="refContractData.versionNum"
                                  disabled
                                  class="full-width"
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in banList"
                                    :key="temp.version"
                                    :label="temp.version"
                                    :value="temp.version">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同约定生效时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同约定生效时间:</label>
                              <div class="flex-flex-auto">
                                <el-date-picker
                                  v-model="refContractData.contractEffectiveTime"
                                  disabled
                                  :picker-options="startTimeOptions"
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择时间">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同约定终止时间
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-content-start flex-items-center">
                              <label class="nowrap">合同约定终止时间:</label>
                              <div class="flex-flex-auto">
                                <el-date-picker
                                  v-model="refContractData.contractFailureTime"
                                  disabled
                                  :picker-options="endTimeOptions"
                                  value-format="timestamp"
                                  size="small"
                                  type="date"
                                  placeholder="请选择时间">
                                </el-date-picker>
                              </div>
                            </div>
                          </div>
                          <!--
                            契约类型
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                契约类型:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="refContractData.deedType"
                                  disabled
                                  class="full-width"
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in deedTypeOpts"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <!--
                            合同类型
                          -->
                          <div class="lc-col-12 lc-col-xs6">
                            <div class="flex flex-items-center">
                              <label class="label nowrap">
                                合同类型:
                              </label>
                              <div class="flex-flex-auto">
                                <el-select v-model="refContractData.contractType"
                                  class="full-width"
                                  disabled
                                  placeholder="请选择"
                                  size="small">
                                  <el-option
                                    v-for="temp in contractTypeOpts"
                                    :key="temp.c"
                                    :label="temp.n"
                                    :value="temp.c">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--
            生效类型
          -->
          <div class="card card-shadow mt10">
            <div class="card-body">
              <div class="card-header">
                <strong>生效类型</strong>
              </div>
              <div class="card-content-padded">
                <div class="lc-row lc-space16">
                  <div class="lc-col-12 lc-col-xs6">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>生效类型:</label>
                      <div class="flex-flex-auto">
                        <el-radio @input="$forceUpdate()" v-model="orderData.effectType" label="1" size="small">立即生效</el-radio>
                        <el-radio @input="$forceUpdate()" v-model="orderData.effectType" label="2" size="small">延迟生效</el-radio>
                      </div>
                    </div>
                  </div>
                  <div class="lc-col-12 lc-col-xs6" v-if="orderData.effectType === '2'">
                    <div class="flex flex-content-start flex-items-center">
                      <label class="nowrap"><span class="red">*</span>生效时间:</label>
                      <div class="flex-flex-auto">
                        <el-date-picker
                          v-model="orderData.effectTime"
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
          <div class="power-clear"></div>
          <!--
            单据信息
            单据默认字段
            后端库里默认需要的字段
            需要提交存入后端库里
            通用字段
            包含：注册来源、单据备注
           -->
          <div v-if="isShow">
            <form-data :formDataSub="formDataSub" type="create"></form-data>
          </div>
        </div>
      </div>
    </div>
    <!--
      委托书
    -->
    <el-dialog title="签约代表委托书" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isBook" width="650px" center>
      <div class="card flex-content-start flex-items-center">
        <div class="lc-row lc-space16">
          <div class="lc-col-12 lc-col-xs12">
            <!--
              上传文件组件
              -->
              <oss-upload
              :bucket="oss.bucket"
              :basePath="oss.basePath"
              :region="oss.region"
              accept="image/*"
              label="+选择文件"
              @uploaded="handleFileUploaded">
                <span class="btn">
                  + 选择文件
                </span>
            </oss-upload>
          </div>
          <!--
          图片渲染
          -->
          <div class="lc-col-12 lc-col-xs12">
            <div v-for="(item, index) in row.authorizationCertUrls" :key="index">
              <div class="lc-col-6 lc-col-xs4 lc-col-sm3 lc-col-md2 pt5 pr5 pb5 pl5 power-w120">
                <div class="relative style_1">
                    <div @click="removeFile(index)" class="style_2">
                      <!--
                        关闭按钮
                        -->
                      <span class="icon-close"></span>
                    </div>
                    <limit-img>
                      <!--
                        图片预览器
                        -->
                      <viewer :images="row.authorizationCertUrls" class="viewer" ref="viewer">
                        <img :src="item.authorizationCertUrl" alt="" />
                      </viewer>
                    </limit-img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--
      查看签字
    -->
    <el-dialog title="查看签字" :modal-append-to-body="false" :close-on-click-modal="false"
      :visible.sync="isQZ" width="400px" center>
      <div class="card flex-content-start flex-items-center">
        <div class="lc-row lc-space16">
          <!--
          图片渲染
          -->
          <div class="lc-col-12 lc-col-xs12">
              <div class="lc-col-6 lc-col-xs4 lc-col-sm3 lc-col-md2 pt5 pr5 pb5 pl5 power-w120">
                <div class="relative style_1 tac">
                    <limit-img>
                      <!--
                        图片预览器
                        -->
                      <viewer :images="rowQZ" class="viewer" ref="viewer">
                        <img :src="rowQZ" alt="" />
                      </viewer>
                    </limit-img>
                </div>
              </div>
          </div>
        </div>
      </div>
    </el-dialog>
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
import keepAliveMixin from "@/common-base/mixins/keep-alive";
import { numberList, toChinese } from '../config';
import tableView from '@/common-base/components/pubComponents/tableView';
import selectOrg from '../selectOrg';
import formData from '../formData';
/**
 * 图片水平居中垂直居中
 */
 import LimitImg from '@/components/admin/common/limitImg/index'
let commonAreaData;
export default {
  mixins:[keepAliveMixin],
  components: {
    OssUpload,
    crumbsBar,
    tableView,
    formData,
    LimitImg,
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
      selectOrgConfig: {
        show: false,
        type: 1, //1，法人组织， 2。机构、3.自然人  4终端  5、商业
        okFn: () => {
        }
      },
      // 签约代表委托书
      row: {},
      isBook: false,
      // 查看签字
      rowQZ: '',
      isQZ: false,
      colsName:{},
      cols: {},
      /**
       * 表格高度
       */
      gridHeight: 120,
      fangData: {},
      refangData: {},
      /**
       * 合同方
       */
      numberList: [],
      banList: [],
      isShow: false,
      formDataSub: {
        source: this.CFG.project.id
      },
      deedTypeOpts: [
        {n: '电子合同', c: '001'},
        {n: '数据合同', c: '002'},
        {n: '意向', c: '003'},
        {n: '备忘', c: '004'},
        {n: '纪要', c: '005'},
        {n: '书面约定', c: '007'},
      ],
      contractTypeOpts: [
        {n: '商品类', c: '001'},
        {n: '服务类', c: '002'},
        {n: '资产类', c: '003'},
        {n: '项目类', c: '029'}
      ],
      // 签约地址
      provinces_yj: [], // 省
      citys_yj: [], // 市
      districts_yj: [], // 县、
      isMounted: false,
      oss: Object.assign({ basePath: 'bi', dirName: '/control-selling' }, this.OSSCFG),
      orderData: {
      },
      /**
       * 合同数据
       */
      contractData: {
        /**
         * 确定几方后的数据
         */
        enterList: [],
      },
      /**
       * 关联合同数据
       */
      refContractData: {
        /**
         * 确定几方后的数据
         */
        enterList: [],
      },
    };
  },
  filters: {
  },
  computed: {
  },
  created () {
    // 合同方数据
    this.numberList = numberList();
    commonAreaData= vue.getCommonDictionary('area')
    this.provinces_yj = commonAreaData.filter(ad => ad.p === '');
    this.isMounted = true
    this.getBanList();
    /**
     * 加载单据数据
     */
    this.getData({ id: this.params.id })
  },
  mounted () {
  },
  methods: {
    // 关联类型变更
    refContractTypeChange(){
      this.orderData.refContractId = null;
      this.refContractData = {
        /**
         * 确定几方后的数据
         */
        enterList: [],
      }
    },
    /**
     * 获取数据
     */
    getData (data) {
      let service = null
      service = this.CFG.services.ecRefApply.viewDirective
      this.API.send(service, data, function (res) {
        this.orderData = {...res.serviceResult};
        this.contractData = this.orderData.contractData;
        this.refContractData = this.orderData.refContractData;
        this.getAgreeMent('contractData');
        this.getAgreeMent('refContractData');
        this.orderData.directiveId = this.params.id;
        delete this.orderData.id;
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
    /**
     * 根据合同No查合同内容
     */
    getAgreeMent(chooseType){
      if(chooseType === 'contractData'){
        // console.info(11)
        // this.contractData = {...res};
        // 回显有几个签署方
        this.contractData.enterList = [];
        for(let i = 0; i < this.contractData.partyNumber; i++){
          this.fangData[i] = [];
          // 确定多少个方
          this.contractData.enterList.push({
            name: this.fang(i)
          })
        }
        // 回显签署方
        if(this.contractData.signatoryList && this.contractData.signatoryList.length){
          this.contractData.signatoryList.forEach(item => {
            item.fangName = this.fang(item.type-1)
            if(item.subjectType === '1'){
              item.subjectName = item.subjectName + '(自然人)'
            } else if(item.orgType === '0008'){
              item.subjectName = item.subjectName + '(机构)'
            } else if(item.orgType === '0010'){
              item.subjectName = item.subjectName + '(实控人)'
            }
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

            }
          })
        }
        // 回显签约地址
        let citys1 = [];
        if (this.contractData.signProvinceCode) {
          citys1 = commonAreaData.filter(ad => ad.p === this.contractData.signProvinceCode);
        }
        citys1.unshift({c: '', n: '请选择...'});
        this.citys_yj = citys1;
        let districts1 = [];
        if (this.contractData.signCityCode) {
          districts1 = commonAreaData.filter(ad => ad.p === this.contractData.signCityCode);
        }
        districts1.unshift({c: '', n: '请选择...'});
        this.districts_yj = districts1;
      }
      if(chooseType === 'refContractData'){
        // this.refContractData = {...res};
        // console.info(22)
        // 回显有几个签署方
        this.refContractData.enterList = [];
        for(let i = 0; i < this.refContractData.partyNumber; i++){
          this.refangData[i] = [];
          // 确定多少个方
          this.refContractData.enterList.push({
            name: this.fang(i)
          })
        }
        // 回显签署方
        if(this.refContractData.signatoryList && this.refContractData.signatoryList.length){
          this.refContractData.signatoryList.forEach(item => {
            item.fangName = this.fang(item.type-1)
            if(item.subjectType === '1'){
              item.subjectName = item.subjectName + '(自然人)'
            } else if(item.orgType === '0008'){
              item.subjectName = item.subjectName + '(机构)'
            } else if(item.orgType === '0010'){
              item.subjectName = item.subjectName + '(实控人)'
            }
            switch(item.type - 1){
              case 0:
                this.refangData[0].push(item);
                // 甲方固定一条
                this.refangData[0][0].isGD = false;
                break;
              case 1:
                this.refangData[1].push(item);
                break;
              case 2:
                this.refangData[2].push(item);
                break;
              case 3:
                this.refangData[3].push(item);
                break;
              case 4:
                this.refangData[4].push(item);
                break;
              case 5:
                this.refangData[5].push(item);
                break;
              case 6:
                this.refangData[6].push(item);
                break;
              case 7:
                this.refangData[7].push(item);
                break;
              case 8:
                this.refangData[8].push(item);
                break;
              case 9:
                this.refangData[9].push(item);
                break;
              case 10:
                this.refangData[10].push(item);
                break;

            }
          })
        }
        // 回显签约地址
        let citys1 = [];
        if (this.refContractData.signProvinceCode) {
          citys1 = commonAreaData.filter(ad => ad.p === this.refContractData.signProvinceCode);
        }
        citys1.unshift({c: '', n: '请选择...'});
        this.citys_yj = citys1;
        let districts1 = [];
        if (this.refContractData.signCityCode) {
          districts1 = commonAreaData.filter(ad => ad.p === this.refContractData.signCityCode);
        }
        districts1.unshift({c: '', n: '请选择...'});
        this.districts_yj = districts1;
      }
      this.$forceUpdate();
    },
    /**
     * 添加协议
     * chooseType =》 contractData 点击添加协议信息
     * chooseType =》 refContractData 点击添加关联协议信息
     */
    addContract(chooseType){
      if(chooseType === 'refContractData' && !this.orderData.refContractType){
        this.$toast({text: '请选择关联协议类型'});
        return false;
      }
      this.selectOrgConfig.show = true;
      // 选择协议
      if(chooseType === 'contractData'){
        this.selectOrgConfig.type = 2;
      }
      // 选择关联协议
      // 需要先选择关联类型
      // refContractType === '2' 签署单  refContractType === '1' 协议
      if(chooseType === 'refContractData'){
        if(this.orderData.refContractType === '2'){
          this.selectOrgConfig.type = 22;
        } else {
          this.selectOrgConfig.type = 2;
        }
      }
      /**
       * 弹框确认选择后回调返回数据进行处理
       */
      this.selectOrgConfig.okFn = row =>{
        /***
         *
         * 合同信息
         * **/
        // 根据合同id查合同详情
        // this.API.send(this.CFG.services.ecContract.view, {contractNo: row.contractNo}, function (res) {
        let service = null;
        let args = {};
        if(chooseType === 'contractData'){
          service = this.CFG.services.ecContract.view;
          args.contractNo = row.contractNo
        }
        if(chooseType === 'refContractData'){
          if(this.orderData.refContractType === '1'){
            service = this.CFG.services.ecContract.view;
            args.contractNo = row.contractNo
          } else {
            service = this.CFG.services.ecContract.viewApply;
            args.id = row.id;
          }
        }
        this.API.send(service, args, function (res) {
          res = res.serviceResult || {};
          if(chooseType === 'contractData'){
            this.contractData = {...res};
            // 赋值合同id
            this.orderData.contractId = res.contractNo;
            // 回显有几个签署方
            this.contractData.enterList = [];
            for(let i = 0; i < this.contractData.partyNumber; i++){
              this.fangData[i] = [];
              // 确定多少个方
              this.contractData.enterList.push({
                name: this.fang(i)
              })
            }
            // 回显签署方
            if(this.contractData.signatoryList && this.contractData.signatoryList.length){
              this.contractData.signatoryList.forEach(item => {
                item.fangName = this.fang(item.type-1)
                if(item.subjectType === '1'){
                  item.subjectName = item.subjectName + '(自然人)'
                } else if(item.orgType === '0008'){
                  item.subjectName = item.subjectName + '(机构)'
                } else if(item.orgType === '0010'){
                  item.subjectName = item.subjectName + '(实控人)'
                }
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

                }
              })
            }
            // 回显签约地址
            let citys1 = [];
            if (this.contractData.signProvinceCode) {
              citys1 = commonAreaData.filter(ad => ad.p === this.contractData.signProvinceCode);
            }
            citys1.unshift({c: '', n: '请选择...'});
            this.citys_yj = citys1;
            let districts1 = [];
            if (this.contractData.signCityCode) {
              districts1 = commonAreaData.filter(ad => ad.p === this.contractData.signCityCode);
            }
            districts1.unshift({c: '', n: '请选择...'});
            this.districts_yj = districts1;
          }
          if(chooseType === 'refContractData'){
            this.refContractData = {...res};
            // 赋值合同id
            this.orderData.refContractId = this.orderData.refContractType === '1' ? res.contractNo : res.id;
            // 回显有几个签署方
            this.refContractData.enterList = [];
            for(let i = 0; i < this.refContractData.partyNumber; i++){
              this.refangData[i] = [];
              // 确定多少个方
              this.refContractData.enterList.push({
                name: this.fang(i)
              })
            }
            // 回显签署方
            if(this.refContractData.signatoryList && this.refContractData.signatoryList.length){
              this.refContractData.signatoryList.forEach(item => {
                item.fangName = this.fang(item.type-1)
                if(item.subjectType === '1'){
                  item.subjectName = item.subjectName + '(自然人)'
                } else if(item.orgType === '0008'){
                  item.subjectName = item.subjectName + '(机构)'
                } else if(item.orgType === '0010'){
                  item.subjectName = item.subjectName + '(实控人)'
                }
                switch(item.type - 1){
                  case 0:
                    this.refangData[0].push(item);
                    // 甲方固定一条
                    this.refangData[0][0].isGD = false;
                    break;
                  case 1:
                    this.refangData[1].push(item);
                    break;
                  case 2:
                    this.refangData[2].push(item);
                    break;
                  case 3:
                    this.refangData[3].push(item);
                    break;
                  case 4:
                    this.refangData[4].push(item);
                    break;
                  case 5:
                    this.refangData[5].push(item);
                    break;
                  case 6:
                    this.refangData[6].push(item);
                    break;
                  case 7:
                    this.refangData[7].push(item);
                    break;
                  case 8:
                    this.refangData[8].push(item);
                    break;
                  case 9:
                    this.refangData[9].push(item);
                    break;
                  case 10:
                    this.refangData[10].push(item);
                    break;
                }
              })
            }
            // 回显签约地址
            let citys1 = [];
            if (this.refContractData.signProvinceCode) {
              citys1 = commonAreaData.filter(ad => ad.p === this.refContractData.signProvinceCode);
            }
            citys1.unshift({c: '', n: '请选择...'});
            this.citys_yj = citys1;
            let districts1 = [];
            if (this.refContractData.signCityCode) {
              districts1 = commonAreaData.filter(ad => ad.p === this.refContractData.signCityCode);
            }
            districts1.unshift({c: '', n: '请选择...'});
            this.districts_yj = districts1;
          }
          this.$forceUpdate();
        },
        function () {}, this);
      }
    },
    /**
     * 删除委托书
     */
     removeFile (index) {
      if (index >= 0) {
        this.row.authorizationCertUrls.splice(index, 1)
      }
      this.$forceUpdate();
    },
    /**
     * 显示委托书弹框
     */
    addFang_3Show(row){
      this.row = row;
      this.isBook = true;
    },
    /**
     * 添加委托书
     */
    /**
     * 上传结束后触发事件
     */
    handleFileUploaded (result) {
      if(!this.row.authorizationCertUrls){
        this.row.authorizationCertUrls = [];
      }
      this.row.authorizationCertUrls.push({
        isDel: false,
        authorizationCertUrl: this.oss.resourcesLocation + result.Key, // 图片地址
        // 和原来一样
        authorizationCertCode: '0001'
      })
      this.$forceUpdate();
    },
    /**
     * 查看签字
     */
    seeQZ(row){
      this.rowQZ = '';
      if(row.signatoryRecordDto){
        this.rowQZ = row.signatoryRecordDto.signUrl;
      }
      console.info(this.rowQZ);
      if(!this.rowQZ){
        this.$toast({text: '暂无数据！'});
        return false;
      }
      this.isQZ = true;
    },
    /**
     * 转换  1=》甲方 2=》乙方 等
     */
    fang(val){
      return toChinese(val);
    },
    /**
     * 获取数据
     */
    getBanList(){
      let args = {
        current:1,
        rowCount:  999
      }
      this.API.send(this.CFG.services.venusCmVersion.list, args, function (res) {
        res = res.serviceResult || {};
        this.banList = res.rows || [];
      }, function () {
      }, this)
    },
    /**
     * 保存单据
     */
    saveOrder () {
      /**
       * 请选择协议
       */
      if(!this.orderData.contractId){
        this.$toast({ text: '请选择协议'});
        return false;
      }
      /**
       * 请选择关联类型
       */
      if(!this.orderData.refContractType){
        this.$toast({ text: '请选择关联类型'});
        return false;
      }
      /**
       * 请选择关联协议
       */
      if(!this.orderData.refContractId){
        this.$toast({ text: '请选择关联协议'});
        return false;
      }
      if(!this.orderData.effectType){
        this.$toast({text: '请选择生效类型'});
        return false;
      }
      if(this.orderData.effectType === '2' && !this.orderData.effectTime){
        this.$toast({text: '请选择生效时间'});
        return false;
      }
      this.orderData.type = '4';
      /**
       * 提交数据增加表单信息
       * 注册来源、单据ID、制单人、申请时间、审核人、审核时间、单据备注
       */
      this.orderData = this.utils.extend({},this.orderData, this.formDataSub);
      this.goSubMit(this.CFG.services.ecRefApply.update, this.orderData)
    },
    /**
     * 提交数据
     */
    goSubMit(service, obj){
      this.API.send(service, obj, function (res) {
        if (res.opFlag) {
          this.$toast({ text: '保存成功' });
          if(/^yaofacai$/i.test(this.CFG.projectName)){
            this.isShowYfc = false
          } else {
            this.$router.push({
              path: '/admin/agreementContactAdjust'
            })
          }
        }
      }, function () { }, this)
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.style_1{box-shadow: 0 0 3px 0 rgba(0,0,0,.3);}
.style_2{position: absolute;top:-10px;right:-10px;width: 28px;height:28px;padding:2px;border-radius:100%;z-index: 1;background-color: #f7f7f7;box-shadow: 0 0 3px 0 rgba(0,0,0,.3);opacity: .75;}
</style>
