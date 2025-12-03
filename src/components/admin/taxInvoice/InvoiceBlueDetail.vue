<template>
  <div>
    <div class="viewport-fixed">
      <!-- 顶部返回面包屑 -->
      <crumbs-bar></crumbs-bar>
      <!-- 底部保存按钮 -->
      <div
        class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
        v-if="!isViewMode"
      >
        <div class="flex flex-content-center">
          <button
            class="btn btn-primary btn-xl"
            type="button"
            @click="submit"
            :disabled="saving"
          >
            保存
          </button>
        </div>
      </div>
      <div class="viewport-view">
        <div class="viewport-view-body flex flex-column">
          <div class="panel-content-padded">
            <h2>数电发票开具申请单（蓝字）-{{ pageTitle }}</h2>
            <!-- 基本信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header"><strong>基本信息</strong></div>
                <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>销售方名称:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfmc"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方名称"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">购货单位类型:</label>
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="form.gmfzrrbz"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode"
                            ><el-option label="自然人" value="Y" /><el-option
                              label="组织"
                              value="N"
                          /></el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>购买方名称:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfmc"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方名称"
                            :disabled="isViewMode"
                          />
                        </div>
                        <span
                          class="el-icon-circle-plus-outline ml10 power-fs26 blue"
                          @click="addBuyer"
                          v-if="!isViewMode"
                        ></span>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>发票票种:</label
                        >
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="form.fppz"
                            size="small"
                            placeholder="请选择"
                            class="full-width"
                            :disabled="isViewMode"
                            ><el-option label="数电专票" value="01" /><el-option
                              label="数电普票"
                              value="02"
                          /></el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">展示销方银行账号标签:</label>
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="form.sfzxsfyhzhbq"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode"
                            ><el-option label="否" value="0" /><el-option
                              label="是"
                              value="1"
                          /></el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">展示购方银行账号标签:</label>
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="form.sfzsgmfyhzhbq"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode"
                            ><el-option label="否" value="0" /><el-option
                              label="是"
                              value="1"
                          /></el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">特定要素类型:</label>
                        <div class="flex-flex-auto">
                          <el-select
                            v-model="form.tdys"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode"
                          >
                            <el-option label="成品油发票" value="01" />
                            <el-option label="稀土发票" value="02" />
                            <el-option label="建筑服务发票" value="03" />
                            <el-option label="货物运输服务发票" value="04" />
                            <el-option label="不动产销售服务发票" value="05" />
                            <el-option label="不动产租赁服务发票" value="06" />
                            <el-option label="代收车船税" value="07" />
                            <el-option label="通行费" value="08" />
                            <el-option label="旅客运输服务发票" value="09" />
                            <el-option label="医疗服务(住院)发票" value="10" />
                            <el-option label="医疗服务(门诊)发票" value="11" />
                            <el-option label="自产农产品销售发票" value="12" />
                            <el-option
                              label="拖拉机和联合收割机发票"
                              value="13"
                            />
                            <el-option label="机动车" value="14" />
                            <el-option label="二手车" value="15" />
                            <el-option label="农产品收购发票" value="16" />
                            <el-option label="光伏收购发票" value="17" />
                            <el-option label="卷烟发票" value="18" />
                            <el-option label="农产品" value="20" />
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">增值税即征即退代码:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.zzsjzjtDm"
                            size="small"
                            class="full-width"
                            placeholder="请输入增值税即征即退代码"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">收款银行名称:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.skyhmc"
                            size="small"
                            class="full-width"
                            placeholder="请输入收款银行名称"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">收款银行账号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.skyhzh"
                            size="small"
                            class="full-width"
                            placeholder="请输入收款银行账号"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">结算方式:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.jsfs"
                            size="small"
                            class="full-width"
                            placeholder="请输入结算方式"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">应税行为发生地:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.ysxwfsd"
                            size="small"
                            class="full-width"
                            placeholder="请输入应税行为发生地"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 销售方信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header"><strong>销售方信息</strong></div>
                <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>销售方税号:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfnsrsbh"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方纳税人识别号"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>销售方名称:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfmc"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方名称"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">地址:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfdz"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方地址"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">手机号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfdh"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方电话"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">销售方开户行:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfkhh"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方开户行"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">销售方账号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.xsfzh"
                            size="small"
                            class="full-width"
                            placeholder="请输入销售方账号"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">差额征税类型:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.cezzslx"
                            size="small"
                            class="full-width"
                            placeholder="请输入差额征税类型"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 购买方信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header"><strong>购买方信息</strong></div>
                <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>购买方名称:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfmc"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方名称"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">购买方税号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfnsrsbh"
                            size="small"
                            class="full-width"
                            placeholder="开具专票时必填"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">地址:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfdz"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方地址"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">手机号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfdh"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方电话"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">购买方开户行:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfkhh"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方开户行"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">购买方账号:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.gmfzh"
                            size="small"
                            class="full-width"
                            placeholder="请输入购买方账号"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 发票信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header"><strong>发票信息</strong></div>
                <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>开票日期:</label
                        >
                        <div class="flex-flex-auto">
                          <el-date-picker
                            v-model="form.kprq"
                            size="small"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            class="full-width"
                            placeholder="选择开票日期"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12 lc-col-xs6">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap"
                          ><span class="red">*</span>开票人:</label
                        >
                        <div class="flex-flex-auto">
                          <el-input
                            v-model="form.kpr"
                            size="small"
                            class="full-width"
                            placeholder="请输入开票人"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="lc-col-12">
                      <div class="flex flex-content-start flex-items-center">
                        <label class="nowrap">备注:</label>
                        <div class="flex-flex-auto">
                          <el-input
                            type="textarea"
                            v-model="form.bz"
                            :rows="3"
                            size="small"
                            class="full-width"
                            placeholder="请输入备注"
                            :disabled="isViewMode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 开票详情信息 -->
            <div class="card card-shadow">
              <div class="card-body">
                <div class="card-header">
                  <strong>开票详情信息</strong>
                </div>
                <div class="card-content-padded">
                  <div class="lc-row lc-space16">
                    <div
                      class="flex flex-content-start flex-items-center mb10"
                      v-if="!isViewMode"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        @click="openSelectGoods"
                        >添加明细</el-button
                      >
                    </div>
                    <el-table :data="form.fpmxList" border style="width: 100%">
                      <el-table-column
                        prop="spfwjc"
                        label="商品服务简称"
                        min-width="140"
                        ><template slot-scope="{ row }"
                          ><span>{{ row.spfwjc }}</span></template
                        ></el-table-column
                      >
                      <el-table-column
                        prop="xmmc"
                        label="项目名称"
                        min-width="140"
                        ><template slot-scope="{ row }"
                          ><span>{{ row.xmmc }}</span></template
                        ></el-table-column
                      >
                      <el-table-column prop="ggxh" label="规格型号" width="120"
                        ><template slot-scope="{ row }"
                          ><span>{{ row.ggxh }}</span></template
                        ></el-table-column
                      >
                      <el-table-column prop="dw" label="单位" width="90"
                        ><template slot-scope="{ row }"
                          ><span>{{ row.dw }}</span></template
                        ></el-table-column
                      >
                      <el-table-column prop="sl" label="数量" width="150"
                        ><template slot-scope="{ row }"
                          ><el-input-number
                            v-model="row.sl"
                            @change="onRowChange(row)"
                            :min="0"
                            :step="1"
                            size="small"
                            class="full-width power-minw90"
                            :disabled="isViewMode" /></template
                      ></el-table-column>
                      <el-table-column prop="dj" label="单价(含税)" width="150"
                        ><template slot-scope="{ row }"
                          ><el-input-number
                            v-model="row.dj"
                            @change="onRowChange(row)"
                            :precision="2"
                            :step="0.01"
                            :min="0"
                            size="small"
                            class="full-width power-minw90"
                            :disabled="isViewMode" /></template
                      ></el-table-column>
                      <el-table-column prop="je" label="金额(含税)" width="150">
                        <template slot-scope="{ row }"
                          >¥{{ formatMoney(row.je) }}</template
                        >
                      </el-table-column>
                      <el-table-column
                        prop="slv"
                        label="增值税税率/征收率"
                        width="150"
                      >
                        <template slot-scope="{ row }">
                          <el-input-number
                            v-model="row.slv"
                            @change="onRowChange(row)"
                            :precision="4"
                            :step="0.01"
                            :min="0"
                            :max="1"
                            size="small"
                            class="full-width power-minw90"
                            :disabled="isViewMode"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="se" label="税额" width="150"
                        ><template slot-scope="{ row }"
                          >¥{{ formatMoney(row.se) }}</template
                        ></el-table-column
                      >
                      <el-table-column prop="hsje" label="含税金额" width="150"
                        ><template slot-scope="{ row }"
                          >¥{{ formatMoney(row.hsje) }}</template
                        ></el-table-column
                      >
                      <el-table-column prop="kce" label="扣除额" width="150"
                        ><template slot-scope="{ row }"
                          ><el-input-number
                            v-model="row.kce"
                            :precision="2"
                            :step="0.01"
                            :min="0"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode" /></template
                      ></el-table-column>
                      <el-table-column
                        prop="sphfwssflhbbm"
                        label="商品和服务税收分类合并编码"
                        min-width="220"
                        ><template slot-scope="{ row }"
                          ><span>{{ row.sphfwssflhbbm }}</span></template
                        ></el-table-column
                      >
                      <el-table-column
                        prop="yhzcbs"
                        label="优惠政策"
                        width="180"
                      >
                        <template slot-scope="{ row }">
                          <el-select
                            v-model="row.yhzcbs"
                            @change="onPreferentialPolicyChange(row)"
                            size="small"
                            class="full-width"
                            :disabled="isViewMode"
                            clearable
                            placeholder="请选择"
                          >
                            <el-option label="简易征收" value="01"></el-option>
                            <el-option label="稀土产品" value="02"></el-option>
                            <el-option label="免税" value="03"></el-option>
                            <el-option label="不征税" value="04"></el-option>
                            <el-option label="先征后退" value="05"></el-option>
                            <el-option
                              label="100%先征后退"
                              value="06"
                            ></el-option>
                            <el-option
                              label="50%先征后退"
                              value="07"
                            ></el-option>
                            <el-option
                              label="按3%简易征收"
                              value="08"
                            ></el-option>
                            <el-option
                              label="按5%简易征收"
                              value="09"
                            ></el-option>
                            <el-option
                              label="按5%简易征收减按1.5%计征"
                              value="10"
                            ></el-option>
                            <el-option
                              label="即征即退30%"
                              value="11"
                            ></el-option>
                            <el-option
                              label="即征即退50%"
                              value="12"
                            ></el-option>
                            <el-option
                              label="即征即退70%"
                              value="13"
                            ></el-option>
                            <el-option
                              label="即征即退100%"
                              value="14"
                            ></el-option>
                            <el-option
                              label="超税负3%即征即退"
                              value="15"
                            ></el-option>
                            <el-option
                              label="超税负8%即征即退"
                              value="16"
                            ></el-option>
                            <el-option
                              label="超税负12%即征即退"
                              value="17"
                            ></el-option>
                            <el-option
                              label="超税负6%即征即退"
                              value="18"
                            ></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="80"
                        fixed="right"
                        v-if="!isViewMode"
                        ><template slot-scope="scope"
                          ><p>
                            <span
                              class="link"
                              @click="deleteDetailRow(scope.$index)"
                              >删除</span
                            >
                          </p></template
                        ></el-table-column
                      >
                    </el-table>
                    <div class="mt10 darkgray">
                      <p class="mt5">
                        合计金额： {{ formatMoney(form.hjjc) }}（元）
                      </p>
                      <p class="mt5">
                        合计税额： {{ formatMoney(form.hjs) }}（元）
                      </p>
                      <p class="mt5">
                        价税合计： {{ formatMoney(form.jshj) }}（元）
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品/服务选择组件 -->
    <div class="viewport-fixed bg-white power-zi101" v-if="ootListConfig.show">
      <ootListChoice :ootListConfig="ootListConfig"></ootListChoice>
    </div>
    <!-- 通用选择组件（用于选择自然人和机构） -->
    <div
      class="viewport-fixed bg-white power-zi101"
      v-if="generalSelectionModel.show"
    >
      <generalSelection
        :mode="generalSelectionModel"
        @close="closeGeneralSelection"
      ></generalSelection>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    crumbsBar: () => import('@/common-base/components/crumbs-bar'),
    ootListChoice: () => import('./ootListChoice'),
    generalSelection: () =>
      import('@/components/admin/institutionName/common/generalSelection')
  },
  props: { permissions: Object, params: Object },
  data() {
    return {
      saving: false,
      isViewMode: false,
      generalSelectionModel: {
        show: false,
        data: {},
        setting: {
          url: '',
          formConfig: [],
          cols: []
        }
      },
      ootListConfig: {
        show: false,
        selection: true, // 支持多选
        categoryList: [1, 3], // 1=商品，3=服务
        ptypes: ['101', '102', '103', '104', '105', '199'], // 商品类型：药品、器械、食品、消毒用品、化妆品、其他
        ootCategory: '1', // 默认显示商品
        ootType: '101', // 默认显示药品
        noDetails: false, // 显示详情按钮
        okFn: (selectedItems) => {
          this.handleGoodsSelected(selectedItems);
        }
      },
      productType: {
        101: '药品',
        102: '器械',
        103: '食品',
        104: '消毒用品',
        105: '化妆品',
        199: '其他'
      },
      form: {
        id: '',
        taxInvoiceNo: '',
        fphm: '',
        ptbh: '',
        fppz: '',
        kprq: '',
        qyDm: '',
        lzfpbz: '0',
        xsfnsrsbh: '',
        xsfmc: '',
        xsfdz: '',
        xsfdh: '',
        xsfkhh: '',
        xsfzh: '',
        cezzslx: '',
        gmfnsrsbh: '',
        gmfmc: '',
        gmfdz: '',
        gmfdh: '',
        gmfkhh: '',
        gmfzh: '',
        gmfzrrbz: '',
        sfzxsfyhzhbq: '',
        sfzsgmfyhzhbq: '',
        tdys: '',
        cezslxDm: '',
        sgfplxDm: '',
        ckywyszczDm: '',
        zzsjzjtDm: '',
        skyhmc: '',
        skyhzh: '',
        jsfs: '',
        ysxwfsd: '',
        gmfjbr: '',
        jbrsfzjhm: '',
        gmfbrlxdh: '',
        kprzjhm: '',
        kprzjlx: '',
        dylzfphm: '',
        hzqrxxdbh: '',
        hzqrduuid: '',
        hjjc: 0,
        hjs: 0,
        jshj: 0,
        fpmxList: [],
        fjysList: [],
        cekcList: [],
        kpr: '',
        skrxm: '',
        fhrxm: '',
        bz: ''
      }
    };
  },
  computed: {
    pageTitle() {
      const query = this.$route && this.$route.query;
      if (!query) {
        return '新增';
      }
      if (query.mode === 'view') {
        return '查看';
      }
      if (query.id) {
        return '编辑';
      }
      return '新增';
    }
  },
  mounted() {
    this.isViewMode =
      this.$route && this.$route.query && this.$route.query.mode === 'view';

    if (this.$route && this.$route.query && this.$route.query.id) {
      this.fetchInvoiceDetail(this.$route.query.id);
    }
  },
  methods: {
    fetchInvoiceDetail(invoiceId) {
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceQuery,
        { invoiceId },
        (res) => {
          if (res && res.data) {
            this.applyInvoiceDetail(res.data);
          } else if (message) {
            this.$message.warning(message);
          }
        },
        () => {},
        this
      );
    },
    applyInvoiceDetail(detail = {}) {
      const assigns = [
        ['id', detail.id],
        ['invoice_id', detail.taxInvoiceNo],
        ['fphm', detail.fphm],
        ['fppz', detail.fppz],
        ['kprq', this.utils.formatDate(detail.kprq)],
        ['kpr', detail.kpr],
        ['xsfnsrsbh', detail.xsfnsrsbh],
        ['xsfmc', detail.xsfmc],
        ['xsfdz', detail.xsfdz],
        ['xsfdh', detail.xsfdh],
        ['xsfkhh', detail.xsfkhh],
        ['xsfzh', detail.xsfzh],
        ['gmfnsrsbh', detail.gmfnsrsbh],
        ['gmfmc', detail.gmfmc],
        ['gmfdz', detail.gmfdz],
        ['gmfdh', detail.gmfdh],
        ['gmfkhh', detail.gmfkhh],
        ['gmfzh', detail.gmfzh],
        ['gmfzrrbz', detail.gmfzrrbz],
        ['tdys', detail.tdys],
        ['cezslxDm', detail.cezslxDm],
        ['sgfplxDm', detail.sgfplxDm],
        ['ckywyszczDm', detail.ckywyszczDm],
        ['zzsjzjtDm', detail.zzsjzjtDm],
        ['gmfjbr', detail.gmfjbr],
        ['jbrsfzjhm', detail.jbrsfzjhm],
        ['gmfbrlxdh', detail.gmfbrlxdh],
        ['kprzjhm', detail.kprzjhm],
        ['kprzjlx', detail.kprzjlx],
        ['dylzfphm', detail.dylzfphm],
        ['hzqrxxdbh', detail.hzqrxxdbh],
        ['hzqrduuid', detail.hzqrduuid],
        ['skyhmc', detail.skyhmc],
        ['skyhzh', detail.skyhzh],
        ['jsfs', detail.jsfs],
        ['ysxwfsd', detail.ysxwfsd],
        ['sfzxsfyhzhbq', detail.sfzxsfyhzhbq],
        ['sfzsgmfyhzhbq', detail.sfzsgmfyhzhbq],
        ['skrxm', detail.skrxm],
        ['fhrxm', detail.fhrxm],
        ['bz', detail.bz || detail.remark],
        [
          'hjjc',
          detail.hjje !== undefined ? Number(detail.hjje) : this.form.hjjc
        ],
        [
          'hjs',
          detail.hjse !== undefined ? Number(detail.hjse) : this.form.hjs
        ],
        [
          'jshj',
          detail.jshj !== undefined ? Number(detail.jshj) : this.form.jshj
        ],
        ['lzfpbz', detail.lzfpbz]
      ];
      assigns.forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          this.form[key] = value;
        }
      });

      // 处理发票明细列表
      const details = Array.isArray(detail.fpmxList) ? detail.fpmxList : [];
      if (details.length) {
        this.form.fpmxList = details.map((item, index) => ({
          mxxh: item.mxxh || index + 1,
          xmmc: item.xmmc || '',
          spfwjc: item.spfwjc || '',
          ggxh: item.ggxh || '',
          dw: item.dw || '',
          sl: Number(item.sl || 0),
          dj: Number(item.dj || 0),
          je: Number(item.je || 0),
          slv: (() => {
            if (
              item.slv !== undefined &&
              item.slv !== null &&
              item.slv !== ''
            ) {
              return Number(item.slv);
            }
            return item.yhzcbs ? 0 : 0.13;
          })(),
          se: Number(item.se || 0),
          hsje: Number(item.hsje || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          fphxz: item.fphxz || '00',
          yhzcbs: item.yhzcbs || ''
        }));
        this.recalcTotals();
      }
      // 处理附加要素列表
      if (Array.isArray(detail.fjysList) && detail.fjysList.length) {
        this.form.fjysList = detail.fjysList.map((item) => ({
          fjysmc: item.fjysmc || '',
          fjyslx: item.fjyslx || '',
          fjysz: item.fjysz || ''
        }));
      }
      // 处理差额扣除列表
      if (Array.isArray(detail.cekcList) && detail.cekcList.length) {
        this.form.cekcList = detail.cekcList.map((item) => ({
          xh: item.xh || 0,
          pzlx: item.pzlx || '',
          fpdm: item.fpdm || '',
          fphm: item.fphm || '',
          cezphm: item.cezphm || '',
          kjrq: this.utils.formatDate(item.kjrq) || '',
          pzhjje: Number(item.pzhjje || 0),
          bckcje: Number(item.bckcje || 0),
          bz: item.bz || ''
        }));
      }
    },
    activated() {
      this.isViewMode =
        this.$route && this.$route.query && this.$route.query.mode === 'view';
    },
    appendGoodsRows(list) {
      (list || []).forEach((g) => {
        let spfwjc = '';
        if (g.productTypeValue) {
          spfwjc = g.productTypeValue;
        } else if (
          this.ootListConfig.ootType &&
          this.productType[this.ootListConfig.ootType]
        ) {
          spfwjc = this.productType[this.ootListConfig.ootType];
        }

        const newRow = {
          mxxh: (this.form.fpmxList.length || 0) + 1,
          xmmc: g.productName || g.name || g.xmmc || '',
          spfwjc: spfwjc,
          ggxh:
            g.specification ||
            g.specificationAndModel ||
            g.spec ||
            g.ggxh ||
            '',
          dw: g.packingSpecification || g.packSpec || g.dw || '',
          sl: Number(g.sl) || 1,
          dj: Number(g.dj) || 0,
          je: 0,
          slv: 0.13,
          se: 0,
          hsje: 0,
          kce: 0,
          sphfwssflhbbm: g.sphfwssflhbbm || g.taxCode || '',
          fphxz: g.fphxz || '00',
          yhzcbs: g.yhzcbs || ''
        };
        this.form.fpmxList.push(newRow);
      });
    },
    deleteDetailRow(i) {
      this.form.fpmxList.splice(i, 1);
      this.recalcTotals();
    },
    onPreferentialPolicyChange(row) {
      const yhzcbs = row.yhzcbs;
      let newSlv = 0.13;

      // 根据优惠政策限制税率
      if (yhzcbs === '03') {
        // 免税：税率为0
        newSlv = 0;
      } else if (yhzcbs === '04') {
        // 不征税：税率为0
        newSlv = 0;
      } else if (yhzcbs === '08') {
        // 按3%简易征收：税率限制为3%
        newSlv = 0.03;
      } else if (yhzcbs === '09') {
        // 按5%简易征收：税率限制为5%
        newSlv = 0.05;
      } else if (yhzcbs === '10') {
        // 按5%简易征收减按1.5%计征：税率限制为1.5%
        newSlv = 0.015;
      }

      this.$set(row, 'slv', newSlv);
      this.onRowChange(row);
    },
    onRowChange(row) {
      const BN = this.BigNumber;
      const sl = BN(row.sl || 0);
      const dj = BN(row.dj || 0);

      let slv = BN(0);
      if (row.slv !== null && row.slv !== undefined && row.slv !== '') {
        const slvNum = BN(row.slv);
        if (!slvNum.isNaN()) {
          slv = slvNum;
        }
      }
      // 使用 BigNumber 进行运算：金额 = 单价 * 数量
      const je = dj.multipliedBy(sl);
      // 税额 = 金额 * 税率
      const se = je.multipliedBy(slv);
      // 含税金额 = 金额 + 税额
      const hsje = je.plus(se);
      // 将计算结果转换为 Number 并赋值
      row.je = this.toFixedNumber(je, 2);
      row.se = this.toFixedNumber(se, 2);
      row.hsje = this.toFixedNumber(hsje, 2);
      this.recalcTotals();
    },
    recalcTotals() {
      const BN = this.BigNumber;
      const sum = this.form.fpmxList.reduce(
        (acc, r) => {
          acc.je = acc.je.plus(BN(r.je || 0));
          acc.se = acc.se.plus(BN(r.se || 0));
          acc.hs = acc.hs.plus(BN(r.hsje || 0));
          return acc;
        },
        { je: BN(0), se: BN(0), hs: BN(0) }
      );
      this.form.hjjc = this.toFixedNumber(sum.je, 6);
      this.form.hjs = this.toFixedNumber(sum.se, 6);
      this.form.jshj = this.toFixedNumber(sum.hs, 6);
    },
    toFixedNumber(v, p) {
      const BN = this.BigNumber;
      const num = BN(v || 0);
      return Number(num.toFixed(p));
    },
    formatMoney(v) {
      const n = Number(v || 0).toFixed(2);
      return n;
    },
    addBuyer() {
      const type = this.form.gmfzrrbz;
      if (type === 'Y') {
        // 选择自然人
        this.openSelectPerson();
        return;
      }
      if (type === 'N') {
        // 选择机构
        this.openSelectOrg();
        return;
      }
      this.$message.info('请先选择购货单位类型');
    },
    // 打开选择自然人
    openSelectPerson() {
      this.generalSelectionModel.show = true;
      const modelOptions = {
        url: this.CFG.services.ca.humanSelectHumans,
        noPaging: false,
        formConfig: [
          { paramMark: '姓名', param: 'name', paramType: 'text' },
          { paramMark: '手机号', param: 'cellphone', paramType: 'text' },
          {
            paramMark: '证件号码',
            param: 'identificationNumber',
            paramType: 'text'
          }
        ],
        cols: [
          { label: '姓名', id: 'name' },
          { label: '手机号', id: 'cellphone' },
          { label: '证件类型', id: 'identificationTypeCode' },
          { label: '证件号码', id: 'identificationNumber' },
          {
            label: '操作',
            fixed: 'right',
            width: '120',
            btns: [
              {
                name: '选择',
                click: (row) => {
                  this.generalSelectionModel.show = false;
                  // 回写自然人数据到表单
                  this.form.gmfmc = row.name || '';
                  this.form.gmfdh = row.cellphone || '';
                  this.form.gmfnsrsbh = row.identificationNumber || '';
                  this.form.jbrsfzjhm = row.identificationNumber || '';
                  this.form.gmfdz = '';
                  this.form.gmfkhh = '';
                  this.form.gmfzh = '';
                  this.form.gmfjbr = '';
                  this.form.gmfbrlxdh = '';
                }
              }
            ]
          }
        ]
      };
      this.generalSelectionModel.setting = modelOptions;
    },
    // 打开选择机构
    openSelectOrg() {
      this.generalSelectionModel.show = true;
      const modelOptions = {
        url: this.CFG.services.ca.organizeSearchOrgsByPage,
        noPaging: false,
        formConfig: [
          { paramMark: '机构名称', param: 'name', paramType: 'text' }
        ],
        cols: [
          { label: '机构名称', id: 'name' },
          { label: '省', id: 'province' },
          { label: '市', id: 'city' },
          { label: '县', id: 'district' },
          { label: '地址', id: 'address' },
          { label: '联系人', id: 'linkmanName' },
          { label: '联系人电话', id: 'linkmanPhone' },
          {
            label: '操作',
            fixed: 'right',
            width: '120',
            btns: [
              {
                name: '选择',
                click: (row) => {
                  this.generalSelectionModel.show = false;
                  // 回写机构数据到表单
                  this.form.gmfmc = row.name || '';
                  this.form.gmfnsrsbh =
                    row.nsrsbh || row.unifiedSocialCreditCode || '';
                  this.form.gmfdz = row.address || '';
                  if (row.province || row.city || row.district) {
                    const addressParts = [
                      row.province,
                      row.city,
                      row.district,
                      row.address
                    ].filter(Boolean);
                    this.form.gmfdz = addressParts.join('');
                  }
                  this.form.gmfdh = row.linkmanPhone || '';
                  this.form.gmfkhh = row.bankAccount || '';
                  this.form.gmfzh = row.bankName || '';
                  this.form.gmfjbr = row.linkmanName || '';
                  this.form.gmfbrlxdh = row.linkmanPhone || '';
                  this.form.jbrsfzjhm = '';
                }
              }
            ]
          }
        ]
      };
      this.generalSelectionModel.setting = modelOptions;
    },
    // 关闭通用选择组件
    closeGeneralSelection() {
      this.generalSelectionModel.show = false;
    },
    openSelectGoods() {
      // 显示商品/服务选择组件
      this.ootListConfig.show = true;
    },
    handleGoodsSelected(selectedItems) {
      if (!selectedItems) {
        return;
      }
      if (Array.isArray(selectedItems)) {
        if (selectedItems.length > 0) {
          this.appendGoodsRows(selectedItems);
        }
      } else {
        this.appendGoodsRows([selectedItems]);
      }
    },
    validateForm() {
      const required = [
        ['xsfnsrsbh', '请填写销售方税号'],
        ['xsfmc', '请填写销售方名称'],
        ['gmfmc', '请填写购买方名称'],
        ['fppz', '请选择发票票种'],
        ['kprq', '请选择开票日期'],
        ['kpr', '请填写开票人']
      ];
      for (const [key, msg] of required) {
        const value = this.form[key];
        if (value === '' || value === null || value === undefined) {
          return msg;
        }
      }
      if (!Array.isArray(this.form.fpmxList) || !this.form.fpmxList.length) {
        return '请添加至少一条开票明细';
      }
      return '';
    },
    buildAddPayload() {
      const detailList = (this.form.fpmxList || []).map((item, index) => {
        const quantity = Number(item.sl || 0);
        const price = Number(item.dj || 0);
        const amount = Number(item.je || 0);
        const tax = Number(item.se || 0);
        return {
          mxxh: item.mxxh || index + 1,
          xmmc: item.xmmc || '',
          spfwjc: item.spfwjc || '',
          ggxh: item.ggxh || '',
          dw: item.dw || '',
          sl: Number.isFinite(quantity) ? quantity.toString() : '0',
          dj: Number.isFinite(price) ? price.toString() : '0',
          je: Number.isFinite(amount) ? amount : 0,
          slv: (() => {
            if (
              item.slv !== undefined &&
              item.slv !== null &&
              item.slv !== ''
            ) {
              return Number(item.slv);
            }
            return item.yhzcbs ? 0 : 0.13;
          })(),
          se: Number.isFinite(tax) ? tax : 0,
          hsje: Number(item.hsje || 0),
          kce: Number(item.kce || 0),
          sphfwssflhbbm: item.sphfwssflhbbm || '',
          fphxz: item.fphxz || '00',
          yhzcbs: item.yhzcbs || ''
        };
      });
      const payload = {
        id: this.form.id || '',
        taxInvoiceNo: this.form.taxInvoiceNo || '',
        lzfpbz: '0', // 蓝字发票
        fppz: this.form.fppz,
        gmfzrrbz: this.form.gmfzrrbz || '',
        tdys: this.form.tdys || '',
        cezslxDm: this.form.cezslxDm || '',
        sgfplxDm: this.form.sgfplxDm || '',
        ckywyszczDm: this.form.ckywyszczDm || '',
        zzsjzjtDm: this.form.zzsjzjtDm || '',
        xsfnsrsbh: this.form.xsfnsrsbh,
        xsfmc: this.form.xsfmc,
        xsfdz: this.form.xsfdz || '',
        xsfdh: this.form.xsfdh || '',
        xsfkhh: this.form.xsfkhh || '',
        xsfzh: this.form.xsfzh || '',
        gmfnsrsbh: this.form.gmfnsrsbh || '',
        gmfmc: this.form.gmfmc,
        gmfdz: this.form.gmfdz || '',
        gmfdh: this.form.gmfdh || '',
        gmfkhh: this.form.gmfkhh || '',
        gmfzh: this.form.gmfzh || '',
        gmfbrlxdh: this.form.gmfbrlxdh || '',
        gmfjbr: this.form.gmfjbr || '',
        jbrsfzjhm: this.form.jbrsfzjhm || '',
        hjje: Number(this.form.hjjc || 0),
        hjse: Number(this.form.hjs || 0),
        jshj: Number(this.form.jshj || 0),
        skyhmc: this.form.skyhmc || '',
        skyhzh: this.form.skyhzh || '',
        jsfs: this.form.jsfs || '',
        ysxwfsd: this.form.ysxwfsd || '',
        kpr: this.form.kpr,
        kprzjhm: this.form.kprzjhm || '',
        kprzjlx: this.form.kprzjlx || '',
        kprq: this.form.kprq
          ? new Date(this.form.kprq).getTime()
          : Math.floor(Date.now() / 1000),
        dylzfphm: this.form.dylzfphm || '',
        hzqrxxdbh: this.form.hzqrxxdbh || '',
        hzqrduuid: this.form.hzqrduuid || '',
        bz: this.form.bz || '',
        sfzxsfyhzhbq: this.form.sfzxsfyhzhbq || '',
        sfzsgmfyhzhbq: this.form.sfzsgmfyhzhbq || '',
        skrxm: this.form.skrxm || '',
        fhrxm: this.form.fhrxm || '',
        fpmxList: detailList
      };
      if (Array.isArray(this.form.fjysList) && this.form.fjysList.length) {
        payload.fjysList = this.form.fjysList.map((item) => ({
          fjysmc: item.fjysmc || '',
          fjyslx: item.fjyslx || '',
          fjysz: item.fjysz || ''
        }));
      }
      if (Array.isArray(this.form.cekcList) && this.form.cekcList.length) {
        payload.cekcList = this.form.cekcList.map((item) => ({
          xh: item.xh || 0,
          pzlx: item.pzlx || '',
          fpdm: item.fpdm || '',
          fphm: item.fphm || '',
          cezphm: item.cezphm || '',
          kjrq: item.kjrq
            ? new Date(item.kjrq).getTime()
            : Math.floor(Date.now() / 1000),
          pzhjje: Number(item.pzhjje || 0),
          bckcje: Number(item.bckcje || 0),
          bz: item.bz || ''
        }));
      }
      return payload;
    },
    submit() {
      // 防暴击：如果正在保存，直接返回
      if (this.saving) {
        return;
      }
      const validationMessage = this.validateForm();
      if (validationMessage) {
        this.$toast({ text: validationMessage });
        return;
      }
      this.recalcTotals();
      if (!this.form.taxInvoiceNo) {
        this.form.taxInvoiceNo = this.utils.UUID(32, 16);
      }
      this.saving = true;
      const payload = this.buildAddPayload();
      this.API.send(
        this.CFG.services.kailing.digitalInvoiceAdd,
        payload,
        (res) => {
          this.saving = false;
          if (res && res.data) {
            const data = res.data;
            const invoiceId = data && data.id;
            const fphm = data && data.fphm;
            const resultMessage = data && data.message;
            if (invoiceId || fphm) {
              const info = fphm && `发票号码: ${fphm}`;
              this.$message.success(`上传成功，${info}`);
            } else if (resultMessage) {
              this.$message.success(resultMessage);
            } else {
              this.$message.success('上传完成');
            }
            // 返回列表页
            this.$router.go(-1);
          } else {
            this.$message.warning(message);
          }
        },
        () => {
          this.saving = false;
        },
        this
      );
    }
  }
};
</script>

<style scoped>
</style>


