<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-30 23:15:16
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-15 01:58:29
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\ListView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-23 02:00:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-12-05 17:17:49
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\ListView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-16 15:40:43
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-29 17:54:06
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\ListView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-fixed">
    <div
      class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar"
      v-if="!config.listAll"
    >
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="search"
        :page-size="searchParams.rowCount"
        :current-page="searchParams.current"
        :total="total"
      ></el-pagination>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="panel pl15 pr15 pt10">
          <div
            class="search-bar flex flex-content-start flex-items-center flex-wrap"
          >
            <div
              class="search-bar-item"
              v-for="item in getSearchCols()"
              :key="item.id"
            >
              <el-input
                v-if="item.type === 'text' || item.type === 'textarea'"
                v-model="searchParams[item.id]"
                size="small"
                :placeholder="item.label"
                :maxlength="item.maxlength"
                clearable
              />
              <el-select
                v-else-if="item.type === 'select'"
                v-model="searchParams[item.id]"
                size="small"
                :placeholder="item.label"
                filterable
                :clearable="!item.searchRequired"
              >
                <el-option
                  v-for="option in getItemOptions(item)"
                  :label="
                    option[item.field.labelKey] || item.field.labelRenderer(option)
                  "
                  :key="option[item.field.valueKey]"
                  :value="option[item.field.valueKey]"
                >
                </el-option>
              </el-select>
            </div>
            <div class="search-bar-item" v-if="isAudit()">
              <el-select
                v-model="searchParams.auditStatus"
                size="small"
                placeholder="审核状态"
                clearable
              >
                <el-option
                  v-for="item in AUDIT_STATUS_OPTIONS"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="search-bar-item-auto">
              <el-button size="small" type="primary" @click.stop="search(1)"
                >查询</el-button
              >
              <el-button v-if="!(config.listAll && getSearchCols().length === 0)" size="small" type="primary" @click.stop="onReset()"
                >重置</el-button
              >
              <el-button
                v-if="permissions.names.add || isDev"
                size="small"
                type="primary"
                @click.stop="routerForm()"
                >新增</el-button
              >
            </div>
          </div>
        </div>
        <div class="flex-flex-auto panel p15" ref="viewBody">
          <div class="panel-table-content">
            <tableView
              ref="tableView"
              v-if="isMounted"
              :list="filterDataList"
              :cols="cols"
              :height="gridHeight"
            >
            </tableView>
          </div>
        </div>
      </div>
    </div>
    <AuditDialog
      :visible.sync="auditDialog.visible"
      :apiModule="config.auditModule || config.module"
      :apiKey="config.applyAudit"
      :params="auditDialog.params"
      :passedValue="auditDialog.passedValue"
      @confirm="updateCurrentPage"
    ></AuditDialog>
    <FormEditDialog
      v-if="formEditDialog.visible"
      :visible.sync="formEditDialog.visible"
      :width="formEditDialog.width"
      :model="formEditDialog.model"
      :options="formEditDialog.options"
      :config="config"
      :cols="formEditDialog.cols"
      :oss="config.oss"
      @confirm="onReset"
    />
    <component
      :title="customDialog.title"
      :center="customDialog.center"
      :oss="customDialog.oss || oss"
      :is="customDialog.componentName"
      v-if="customDialog.componentName && customDialog.visible"
      :visible.sync="customDialog.visible"
      @change="onCustomDialogChange"
      />
  </div>
</template>
<script>
import tableView from '@/common-base/components/pubComponents/tableView';
import AuditDialog from '@/common-base/components/commonForm/components/dialog/AuditDialog';
import { AUDIT_COMMON_COLS, AUDIT_STATUS_OPTIONS, AUDIT_PARAMS_MAP } from '@/common-base/components/commonForm/data/auditData';
import keepAliveMixin from '@/common-base/mixins/keep-alive';
import { filterObjectNull } from '@/common-base/components/commonForm/utils/objectUtils';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import FormEditDialog from '@/common-base/components/commonForm/FormEditDialog';
import AuthenticationDialog from '@/common-base/components/commonForm/components/dialog/AuthenticationDialog';
import SignatureDialog from '@/common-base/components/commonForm/components/dialog/SignatureDialog';

export default {
  components: {
    tableView, AuditDialog, FormEditDialog,
    AuthenticationDialog, SignatureDialog,
  },
  mixins: [keepAliveMixin, formDataMixin],
  props: ['permissions', 'params', 'auditType', 'config', 'isTree'],
  data() {
    return {
      options: this.getDefaultOptions('LIST_VIEW'),
      AUDIT_STATUS_OPTIONS,
      gridHeight: 500,
      isMounted: false,
      auditDialog: {
        visible: false,
        params: {},
      },
      formEditDialog: {
        visible: false,
        model: null,
      },
      oss: {
        ...this.OSSCFG,
        basePath: 'bi',
        ...(this.config.oss || {}),
      },
      total: 0,
      list: [],
      cols: [
        ...this.getListViewCols(),
        ...this.getAuditCommonCols(),
        this.getListActionsCol(),
      ].filter(Boolean),
      searchParams: this.getInitSearchParams(),
      customDialog: {
        visible: false,
        componentName: '',
        title: '',
        center: false,
      }
    };
  },
  created() {
    this.initOptions('LIST_VIEW');
    this.updateCurrentPage();
  },
  computed: {
    isDev() {
      return process.env.VUE_APP_MODE === 'dev';
    },
    filterDataList() {
      if (this.isTree) {
        let dataList = this.utils.array2tree(this.list?.map(item => ({
          ...item,
          id: item.id || item.code,
          parentId: item.parentId || item.parentid || item.parentCode,
        })), 'id', 'parentId');
        for (let index = 0; index < this.config.cols.length; index++) {
          const item = this.config.cols[index];
          if (item.searchable && this.searchParams[item.id]) {
            dataList = this.utils.matchedDataX(dataList, item.id, this.searchParams[item.id], false);
            break;
          }
        }
        return dataList;
      }
      return this.list;
    },
  },
  mounted() {
    this.gridHeight = this.$refs.viewBody.offsetHeight - 30 + 'px';
    this.isMounted = true;
  },
  methods: {
    /**
     * 获取初始化查询参数
     * @returns 初始化查询参数
     */
    getInitSearchParams() {
      return {
        current: 1,
        rowCount: 15,
        ...this.getDefaultSearchParams(this.getAuditCommonCols()),
        ...this.getDefaultSearchParams(),
      };
    },
    /**
     * 获取审核公共列
     * @returns 审核公共列
     */
    getAuditCommonCols() {
      if (this.isAudit()) {
        return AUDIT_COMMON_COLS.filter(v => {
          if (v.id === 'directiveType' || v.id === 'type') {
            return this.auditType === 'adjust';
          }
          return true;
        });
      }
      return [];
    },
    /**
     * 获取列表操作列
     * @returns 列表操作列
     */
    getListActionsCol() {
      let btns = [
        {
          name: '查看',
          click: (row) => {
            this.routerForm(row, 'details');
          },
          condition: () => {
            return !this.isCRUDDialog();
          }
        },
        {
          name: '编辑',
          isDisabled: (row) => {
            if (this.isCRUD() || this.isCRUDDialog()) {
              return false;
            }
            return !['1', '3', '4', '5'].includes(row.auditStatus) || (this.auditType === 'adjust' && row.directiveType === '2');
          },
          click: (row) => {
            this.routerForm(row, 'edit');
          },
          condition: () => {
            return (this.permissions.names.modify || this.isDev) && this.auditType !== 'stop';
          },
        },
        {
        name: '新增下级',
          click: (row) => {
            this.edit(row, row.id);
          },
          condition: () => {
            return (this.permissions.names.add || this.isDev) && this.isTree && this.isCRUDDialog();
          }
        },
        this.isAudit() ? {
          name: '审核',
          isDisabled: (row) => {
            return !['1', '4', '5'].includes(row.auditStatus);
          },
          click: (row) => {
            this.auditDialog.params = {
              id: row.id
            };
            this.auditDialog.title = '审核';
            this.auditDialog.passedValue = this.config.hasVetting ? '7' : '1';
            this.auditDialog.visible = true;
          },
          condition: () => {
            return this.permissions.names.verify || this.isDev;
          }
        } : null,
        this.isAudit() && this.config.hasVetting ? {
          name: '审批',
          isDisabled: (row) => {
            return !['6'].includes(row.auditStatus);
          },
          click: (row) => {
            this.auditDialog.params = {
              id: row.id
            };
            this.auditDialog.passedValue = '1';
            this.auditDialog.title = '审批';
            this.auditDialog.visible = true;
          },
          condition: () => {
            return this.permissions.names.custom1 || this.isDev;
          }
        } : null,
        {
          name: '删除',
          isDisabled: (row) => {
            if (this.isCRUD() || this.isCRUDDialog()) {
              return false;
            }
            return !['1', '3', '4', '5'].includes(row.auditStatus);
          },
          click: (row) => {
            if (this.auditType === 'statement') {
              this.routerForm(row, 'delete');
            } else {
              this.toDelete(row);
            }
          },
          condition: () => this.permissions.names.delete || this.isDev
        }
      ].filter(Boolean);
      if (typeof this.config.listActions === 'function') {
        btns = this.config.listActions(btns, this) || [];
      }
      btns = btns.filter(Boolean);
      if (btns.length) {
        return {
          label: '操作',
          fixed: 'right',
          width: '100',
          btns
        };
      }
      return null;
    },
    isAudit() {
      return ['create', 'modify', 'stop', 'adjust'].includes(this.auditType);
    },
    isCRUD() {
      return ['crud'].includes(this.auditType);
    },
    isCRUDDialog() {
      return ['crudDialog'].includes(this.auditType);
    },
    /**
     * 重置查询参数
     */
    onReset() {
      this.searchParams = this.getInitSearchParams();
      this.getData();
    },
    /**
     * 查询表格数据
     * @param pager 查询目标分页
     */
    search(pager) {
      this.searchParams.current = pager || 1;
      this.getData();
    },
    /**
     * 查询表格数据
     * @param args 查询参数
     */
    getData() {
      const listParams = typeof this.config.listParams === 'function'
        ? this.config.listParams(this)
        : this.config.listParams;
      this.API.send(
        this.CFG.services[this.config.module][this.isAudit() ? this.config.applyList : this.config.list ],
        { ...this.searchParams, ...(AUDIT_PARAMS_MAP[this.auditType] || {}), ...(listParams || {}) },
        (res) => {
          res = res.serviceResult || res;
          const result = filterObjectNull(res.rows || res);
          this.list = (Array.isArray(result) ? result : []).map(item => ({
            ...item,
            $$hasVetting: this.config.hasVetting
          }));
          this.total = res.total > 0 ? res.total : this.total;
        },
        () => {},
        this
      );
    },
    /**
     * 更新表格
     */
    updateCurrentPage() {
      this.getData();
    },
    routerForm(row, type = '') {
      if (this.isCRUDDialog()) {
        this.edit(row);
      } else if (this.isAudit() || this.isCRUD() || type ==='details') {
        this.$router.push({
          path: `${this.$route.path}/form`,
          query: { id: row?.id, type }
        });
      } else {
        let auditType = 'create';
        if (row?.id) {
          auditType = type === 'edit' ? 'modify' : 'stop';
        }
        this.$router.push({
          path: `${this.$route.path.replace(/statement$/i, auditType)}/form`,
          query: { _resultId: row?.id, type, isAuto: '1' }
        });
      }
    },
    edit(row, parentId) {
      const model = row ? { ...row } : undefined;
      this.config.cols.forEach((item) => {
        if (model && typeof item.defaultValue === 'function') {
          model[item.id] = model[item.id] || item.defaultValue(this, item, model, parentId) || null;
        }
        if (item.editable && item.field?.options && item.field?.optionsRenderer) {
          this.options[item.field.options] = item.field.optionsRenderer(this, item, model);
        }
      });
      let title;
      if (row && parentId) {
        title = '新增下级';
      } else if (row) {
        title = '编辑';
      } else {
        title = '新增';
      }
      let formEditDialogModel = this.isTree ? { $isTree: true } : model;
      if (this.isTree) {
        if (parentId) {
          formEditDialogModel = {
            ...formEditDialogModel,
            parentId,
            $addChild: true,
          }
        } else {
          formEditDialogModel = {
            ...formEditDialogModel,
            ...(model || {}),
          }
        }
      }
      this.formEditDialog = {
        model: formEditDialogModel,
        title,
        visible: true,
        options: this.options
      };
    },
    toDelete(row) {
      this.$confirm({
        title: '提示',
        text: '您确认删除该数据吗？',
        buttons: [
          {
            text: '取消',
            type: 'follow'
          },
          {
            text: '确定',
            type: 'primary',
            callback: () => {
              this.API.send(
                this.CFG.services[this.config.module][
                  this.isAudit() ? this.config.applyDelete : this.config.delete
                ],
                { id: row.id },
                () => {
                  this.updateCurrentPage();
                },
                () => {},
                this
              );
            }
          }
        ]
      });
    },
    onCustomDialogChange(result) {
      this.customDialog.visible = false;
      if (typeof this.customDialog.onChange === 'function') {
        this.customDialog.onChange(result, this);
      }
    }
  }
};
</script>
<style>
.viewer-canvas > img {
  background-color: #fff;
}
</style>
