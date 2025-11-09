<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-30 23:15:16
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 19:38:12
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-23 02:00:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-12-10 16:39:36
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 17:36:01
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-29 22:00:12
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-21 15:36:03
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-17 10:21:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-18 01:30:41
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\FormView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-fixed">
    <crumbs-bar v-if="hasCrumbsBar" :isShowBack="config.crumbsBarBack !== null" :title="pageTitle" :isCustomerBackEvent="true"
      @back="crumbsBarBack"></crumbs-bar>
    <div
      v-if="params.type !== 'details' && getSaveService()"
      class="viewport-footer viewport-footer-padded flex flex-column flex-content-center"
    >
      <div class="flex flex-content-center">
        <el-button size="small" type="primary" @click="save()">保存</el-button>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel-content-padded">
          <div v-if="formData">
            <div class="card-wrapper" v-for="item in config.detailCards"
              :key="item.ref">
              <component
                :is="item.componentName || 'BasicCard'"
                v-if="!item.children && conditionCard(item, 'if')"
                v-show="!item.children && conditionCard(item, 'show')"
                :key="item.ref"
                :ref="item.ref || item.title"
                :title="item.title"
                :auditType="auditType"
                :disabled="item.disabled ? disabledCard(item) : formIsDisabled"
                :options.sync="options"
                :formData.sync="formData"
                :config="config"
                :oss="oss"
                :cols="item.cols"
                :treeConfig="item.treeConfig"
                :previewConfig="item.previewConfig"
                :arrayConfig="item.arrayConfig"
                :recordItemsConfig="item.recordItemsConfig"
                @tagListDialogShow="onTagListDialogShow"
                @selectTableShow="onSelectTableShow"
                @sealPageShow="onSealPageShow"
                @ootListPageShow="onOotListPageShow"
              />
              <div class="card card-shadow" v-else-if="item.children">
                <div class="card-body">
                  <div class="card-header" v-if="item.title">
                    <strong>{{ item.title }}</strong>
                  </div>
                  <div class="card-content-padded" v-for="child in item.children" :key="child.ref">
                    <component
                      :is="child.componentName || 'BasicCard'"
                      v-if="conditionCard(child, 'if')"
                      v-show="conditionCard(child, 'show')"
                      :key="child.ref"
                      :ref="child.ref || child.title"
                      :title="child.title"
                      :auditType="auditType"
                      :disabled="child.disabled ? disabledCard(child) : formIsDisabled"
                      :options.sync="options"
                      :formData.sync="formData"
                      :config="config"
                      :oss="oss"
                      :cols="child.cols"
                      :treeConfig="child.treeConfig"
                      :previewConfig="child.previewConfig"
                      :arrayConfig="child.arrayConfig"
                      :recordItemsConfig="child.recordItemsConfig"
                      @tagListDialogShow="onTagListDialogShow"
                      @selectTableShow="onSelectTableShow"
                      @sealPageShow="onSealPageShow"
                      @ootListPageShow="onOotListPageShow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DetailSearchCardPage
      :visible.sync="detailSearchCardPage.visible"
      :title="detailSearchCardPage.title"
      :searchParamsRequired="detailSearchCardPage.searchParamsRequired"
      :cardTitlePrefix="detailSearchCardPage.cardTitlePrefix"
      :cardTitleKey="detailSearchCardPage.cardTitleKey"
      :pageTitle="pageTitle"
      :cardFooter="`是否${pageTitle}`"
      :apiModule="detailSearchCardPage.apiModule"
      :apiKey="detailSearchCardPage.apiKey"
      :cols="detailSearchCardPage.cols"
      :params="detailSearchCardPage.params"
      @confirm="detailSearchCardPage.onConfirm"
      :config="config"
      :auditType="auditType"
    />
    <SelectTableDialog
      v-if="selectTableDialog.visible"
      :visible.sync="selectTableDialog.visible"
      :title="selectTableDialog.title"
      :rowKey="selectTableDialog.rowKey"
      :additional="selectTableDialog.additional"
      :checked="selectTableDialog.checked"
      :canSelection="selectTableDialog.canSelection"
      :multiple="selectTableDialog.multiple"
      :params="selectTableDialog.params"
      :immediate="selectTableDialog.immediate"
      :cols="selectTableDialog.cols"
      :searchBarItems="selectTableDialog.searchBarItems"
      :apiModule="selectTableDialog.apiModule"
      :apiKey="selectTableDialog.apiKey"
      :searchParamsRequired="selectTableDialog.searchParamsRequired"
      :editConfig="selectTableDialog.editConfig"
      @confirm="onSelectTableDialogConfirm"
    ></SelectTableDialog>
    <SelectTablePage
      v-if="selectTablePage.visible"
      :visible.sync="selectTablePage.visible"
      :title="selectTablePage.title"
      :rowKey="selectTablePage.rowKey"
      :additional="selectTablePage.additional"
      :checked="selectTablePage.checked"
      :canSelection="selectTablePage.canSelection"
      :multiple="selectTablePage.multiple"
      :params="selectTablePage.params"
      :immediate="selectTablePage.immediate"
      :cols="selectTablePage.cols"
      :searchBarItems="selectTablePage.searchBarItems"
      :apiModule="selectTablePage.apiModule"
      :apiKey="selectTablePage.apiKey"
      :searchParamsRequired="selectTablePage.searchParamsRequired"
      :editConfig="selectTablePage.editConfig"
      @confirm="onSelectTablePageConfirm"
    ></SelectTablePage>
    <div class="viewport-fixed bg-white power-zi101" v-if="sealPage.show">
      <Seal ref="seal" v-if="sealPage.show" :sealConfig="sealPage"></Seal>
    </div>
    <TagListDialog
      v-if="tagListDialog.visible"
      :visible.sync="tagListDialog.visible"
      :field="tagListDialog.field"
      :model="tagListDialog.model"
      @confirm="onTagListDialogConfirm"
    />
    <!-- 资产选择 -->
    <div class="viewport-fixed bg-white power-zi101" v-if="ootListConfig.show">
      <ootList v-if="ootListConfig.show" :ootListConfig="ootListConfig"></ootList>
    </div>
  </div>
</template>
<script>
import crumbsBar from '@/common-base/components/crumbs-bar';
import BasicCard from '@/common-base/components/commonForm/components/card/BasicCard';
import TreeCard from '@/common-base/components/commonForm/components/card/TreeCard';
import PreviewCard from '@/common-base/components/commonForm/components/card/PreviewCard';
import ArrayCard from '@/common-base/components/commonForm/components/card/ArrayCard';
import ScaleItemsCard from '@/common-base/components/commonForm/components/card/ScaleItemsCard';
import { mergeArrayObject, filterObjectNull } from '@/common-base/components/commonForm/utils/objectUtils';
import DetailSearchCardPage from '@/common-base/components/commonForm/components/page/DetailSearchCardPage';
import SelectTableDialog from '@/common-base/components/commonForm/components/dialog/SelectTableDialog';
import TagListDialog from '@/common-base/components/commonForm/components/dialog/TagListDialog';
import SelectTablePage from '@/common-base/components/commonForm/components/page/SelectTablePage';
import OssUpload from '@/common-base/components/upload';
import { AUDIT_PARAMS_MAP } from '@/common-base/components/commonForm/data/auditData';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import Seal from '@/common-base/components/seal';
import ootList from '@/common-base/components/pubComponents/ootListChoice';

export default {
  components: {
    crumbsBar,
    DetailSearchCardPage,
    SelectTableDialog,
    SelectTablePage,
    TagListDialog,
    BasicCard,
    TreeCard,
    PreviewCard,
    ArrayCard,
    ScaleItemsCard,
    OssUpload,
    Seal,
    ootList,
  },
  mixins: [formDataMixin],
  props: ['params', 'auditType', 'config'],
  data() {
    // 初始化formData
    // 如果是创建操作且没有id参数，则使用默认值
    // 如果不是创建操作且没有id参数，则使用空对象
    // 如果是审核操作且审核类型为创建，则使用默认值
    // 否则，使用空对象
    const formData = (this.isAudit() && this.auditType === 'create' && !this.params.id) || (!this.isAudit() && !this.params.id) ? this.getColsDefaultValue(this.getFormViewCols()) : {};
    const auditCardCols = this.config.detailCards.find(item => item.ref === 'AuditCardRef')?.cols;
    const auditCardDefaultValue = auditCardCols ? this.getColsDefaultValue(auditCardCols.map(id => this.getFormViewCols().find(col => col.id === id))) : {};

    const detailSearchCardPage = this.config.detailSearchCard?.[this.auditType] || {};
    return {
      oss: {
        ...this.OSSCFG,
        basePath: 'bi',
        ...(this.config.oss || {}),
      },
      options: this.getDefaultOptions('FORM_VIEW'),
      formData: {
        ...formData,
        ...auditCardDefaultValue,
      },
      recordItems: {},
      selectTableDialog: {
        visible: false,
      },
      selectTablePage: {
        visible: false,
      },
      sealPage: {
        show: false,
      },
      ootListConfig: {
        show: false, //显示隐藏
        selection: true, //是否单双选
        ootCategory: '4', // 资产
        categoryList: [4], //1，商品，3.服务 4.资产
        //扩展参数
        params: {
          pubStatus: 9 //曾发布过
        },
      },
      tagListDialog: {
        visible: false,
      },
      detailSearchCardPage: {
        visible: false,
        ...detailSearchCardPage,
        onConfirm: (item) => {
          const idKeyObject = {};
          if (this.auditType === 'adjust') {
            idKeyObject.directiveId = item.id;
          } else if (this.auditType !== 'create') {
            idKeyObject[this.config.resultId] = item.id;
          }
          this.formData = filterObjectNull({
            ...this.formData,
            ...item,
            ...idKeyObject,
            id: undefined,
          });
          if (this.auditType === 'adjust' && detailSearchCardPage.needDetail) {
            this.getDirectiveDetailsData(item.id);
          } else if (detailSearchCardPage.needDetail) {
            this.getResultDetailsData(item.id);
          } else if (typeof detailSearchCardPage.onConfirm === 'function') {
            detailSearchCardPage.onConfirm(item, this);
          }
        }
      },
    };
  },
  computed: {
    /**
     * 是否显示导航条, 默认显示
     */
    hasCrumbsBar() {
      if (typeof this.config.hasCrumbsBar === 'function') {
        return this.config.hasCrumbsBar(this);
      }
      return this.config.hasCrumbsBar !== false;
    },
    /**
     * 导航条页标题
     */
    pageTitle() {
      const auditString = this.config.detailPageTitle && this.auditType && this.config.detailPageTitle[this.auditType] ? this.config.detailPageTitle[this.auditType] : '';
      if (!auditString) {
        return '';
      }
      if (typeof auditString === 'function') {
        return auditString(this);
      }
      if (this.params.type === 'details') {
        return `查看${auditString}`;
      } else if (this.params.id) {
        return `编辑${auditString}`;
      } else {
        return `创建${auditString}`;
      }
    },
    // 表单禁用状态
    formIsDisabled() {
      return this.params.type === 'details' || this.auditType === 'stop' || this.auditType === 'statement';
    },
    hasDetailSearchCard() {
      return this.config.detailSearchCard?.[this.auditType] && !this.params.id && !this.params._resultId;
    },
    refNames() {
      const result = [];
      function loop(items) {
        items.forEach(item => {
          if (item.children) {
            loop(item.children);
          } else {
            result.push(item.ref || item.title);
          }
        });
      }
      loop(this.config.detailCards);
      return result;
    },
  },
  created() {
    this.checkDetailSearchCard();
    this.initOptions('FORM_VIEW');
    this.init();
  },
  methods: {
    /**
     * 导航条返回函数
     */
    crumbsBarBack() {
      if (this.hasDetailSearchCard) {
        this.detailSearchCardPage.visible = true;
      } else if (typeof this.config.crumbsBarBack === 'function') {
        this.config.crumbsBarBack(this);
      } else {
        this.$router.goBack();
      }
    },
    /**
     * 是否是单据操作
     */
    isAudit() {
      return ['create', 'modify', 'stop', 'adjust'].includes(this.auditType);
    },
    /**
     * 卡片条件函数
     */
    conditionCard(item, conditionKey) {
      if (typeof item.validator === 'function' && item.validatorKey === conditionKey) {
        return item.validator(this);
      }
      return true;
    },
    /**
     * 卡片禁用函数
     */
    disabledCard(item) {
      if (typeof item.disabled === 'function') {
        return item.disabled(this);
      }
      if (typeof item.disabled === 'boolean') {
        return item.disabled;
      }
    },
    /**
     * 选择表格弹窗显示函数
     * @param tableConfig 表格配置
     */
    onSelectTableShow(tableConfig) {
      this[tableConfig.type] = {
        ...tableConfig,
        visible: true,
      }
    },
    /**
     * 标签列表弹窗显示函数
     * @param tagListConfig 标签列表配置
     */
    onTagListDialogShow(tagListConfig) {
      this.tagListDialog = {
        ...tagListConfig,
        visible: true,
      };
    },
    /**
     * 盖章弹窗显示函数
     * @param sealPage 盖章配置
     */
    onSealPageShow(sealPage) {
      this.sealPage.show = true;
      this.sealPage.okFn = (pngBase64) => {
        sealPage.onChange({
          type: 'image/png',
          base64Data: pngBase64
        }, this);
      }
    },
    /**
     * oot列表弹窗显示函数
     * @param ootListConfig oot列表配置
     */
    onOotListPageShow(ootListConfig) {
      this.ootListConfig = {
        ...this.ootListConfig,
        ...ootListConfig,
        show: true,
        okFn: (data) => {
          ootListConfig.onChange(data, this);
          this.ootListConfig.show = false;
        }
      };
    },
    onTagListDialogConfirm(tagList) {
      if (typeof this.tagListDialog.onConfirm === 'function') {
        this.tagListDialog.onConfirm(tagList, this);
      }
    },
    onSelectTableDialogConfirm(item) {
      if (typeof this.selectTableDialog.onConfirm === 'function') {
        this.selectTableDialog.onConfirm(item, this);
      }
    },
    onSelectTablePageConfirm(item) {
      if (typeof this.selectTablePage.onConfirm === 'function') {
        this.selectTablePage.onConfirm(item, this);
      }
    },
    checkDetailSearchCard() {
      if (this.hasDetailSearchCard) {
        this.detailSearchCardPage.visible = true;
      }
    },
    /**
     * 初始化函数
     */
    init() {
      if (this.params.id) {
        this.getDetailsData();
      }
      if (this.params._resultId) {
        this.getResultDetailsData(this.params._resultId);
      }
      if (typeof this.config.init === 'function') {
        this.config.init(this);
      }
    },
    /**
     * 获取结果详情数据函数
     * @param id 结果ID
     */
    getResultDetailsData(id) {
      this.API.send(
        this.CFG.services[this.config.module][this.config.detail],
        { id },
        (res) => {
          res = res.serviceResult || res;
          if (res) {
            this.formData = filterObjectNull({
              ...this.formData,
              ...res,
              [this.config.resultId]: id,
            });
            if (typeof this.config.detailSearchCard[this.auditType]?.onConfirm === 'function') {
              this.config.detailSearchCard[this.auditType].onConfirm(res, this);
            }
          }
        },
        () => {},
        this
      );
    },
    /**
     * 获取指令详情数据函数
     * @param id 指令ID
     */
    getDirectiveDetailsData(id) {
      this.API.send(
        this.CFG.services[this.config.module][this.config.detailDirective],
        { id },
        (res) => {
          res = res.serviceResult || res;
          if (res) {
            this.formData = filterObjectNull({
              ...this.formData,
              ...res,
              directiveId: id,
              id: undefined,
            });
            if (typeof this.config.detailSearchCard[this.auditType]?.onConfirm === 'function') {
              this.config.detailSearchCard[this.auditType].onConfirm(res, this);
            }
          }
        },
        () => {},
        this
      );
    },
    /**
     * 获取详情数据函数
     * @param id 详情ID (params.id)
     */
    getDetailsData() {
      this.API.send(
        this.CFG.services[this.config.module][this.isAudit() ? this.config.applyDetail : this.config.detail],
        { id: this.params.id, ...(AUDIT_PARAMS_MAP[this.auditType] || {}), },
        (res) => {
          res = res.serviceResult || res;
          if (res) {
            this.formData = filterObjectNull(res);
            if (typeof this.config.afterDetails === 'function') {
              this.config.afterDetails(this);
            }
          }
        },
        () => {},
        this
      );
    },
    /**
     * 保存函数
     */
    async save() {
      try {
        const params = await Promise.all(
          [
            ...this.refNames.map(refName => {
              if (Array.isArray(this.$refs[refName])) {
                return this.$refs[refName]?.[0]?.validateForm();
              }
              if (this.$refs[refName]) {
                return this.$refs[refName]?.validateForm();
              }
            }),
          ].filter(Boolean)
        );
        let sendParams = this.getUpdateParams(mergeArrayObject(params));
        if (typeof this.config.beforeUpdate === 'function') {
          await this.config.beforeUpdate(sendParams, this);
        }
        if (this.auditType === 'stop') {
          this.$confirm({
            title: '提示',
            text: `确认 ${this.pageTitle}？`,
            buttons: [
              {
                text: '取消',
                type: 'follow'
              },
              {
                text: '确定',
                type: 'primary',
                callback: () => {
                  this.sendSave(sendParams);
                }
              }
            ]
          });
        } else {
          this.sendSave(sendParams);
        }
      } catch (error) {
        console.error(error);
        error = error.message || error;
        if (error) {
          this.$toast({ text: error });
        }
      }
    },
    /**
     * 保存参数处理函数
     * @param sendParams 保存参数
     */
    getUpdateParams(sendParams) {
      const auditParams = this.auditType === 'adjust' ? AUDIT_PARAMS_MAP.adjustUpdate[this.formData.type] : AUDIT_PARAMS_MAP[this.auditType];

      let params = {
        ...this.formData,
        ...sendParams,
        ...(auditParams || {}),
        isAuto: this.params.isAuto,
        id: this.params.id
      };
      const updateParams =  typeof this.config.updateParams === 'function' ? this.config.updateParams(this, params) : this.config.updateParams;
      params = { ...params, ...updateParams };
      return params;
    },
    /**
     * 获取保存服务函数
     * @returns 保存服务
     */
    getSaveService() {
      if (typeof this.config.saveService === 'function') {
        return this.config.saveService(this);
      }
      let url = '';
      if (this.isAudit()) {
        url = (this.params.id ? this.config.applyUpdate : this.config.applyCreate) || this.config.applyUpdate || this.config.applyCreate;
      } else {
        url = (this.params.id ? this.config.update : this.config.create) || this.config.update || this.config.create;
      }
      const service = this.CFG.services[this.config.module] && this.CFG.services[this.config.module][url];
      return service;
    },
    /**
     * 发送保存请求函数
     * @param params 保存参数
     */
    sendSave(params) {
      const service = this.getSaveService();
      this.API.send(
        service,
        params,
        () => {
          // 保存成功后处理
          if (typeof this.config.afterSave === 'function') {
            this.config.afterSave(this);
          } else {
            this.$router.goBack();
          }
        },
        () => {},
        this
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.card-wrapper:not(:first-child) {
  margin-top: 10px;
}
</style>
