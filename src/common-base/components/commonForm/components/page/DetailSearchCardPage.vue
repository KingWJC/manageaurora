<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-07 00:38:34
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-31 09:44:12
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\components\page\DetailSearchCardPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewport-fixed bg-white z10" v-show="visible">
    <crumbs-bar
      :title="pageTitle"
    ></crumbs-bar>
    <div
      class="viewport-footer viewport-footer-m viewport-footer-padded flex-column flex flex-content-center tar"
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
    <div class="viewport-view ofh">
      <div class="flex-flex-auto panel p15 flex-1 ofa full-height" ref="viewBody">
        <div class="card card-shadow">
          <div class="card-body">
            <div class="card-header">
              <strong>{{ title }}</strong>
              <div class="flex flex-content-between"></div>
            </div>
            <div class="panel pl15 pr15 pt10">
              <div
                class="search-bar flex flex-content-start flex-items-center flex-wrap"
              >
                <div
                  class="search-bar-item"
                  v-for="item in detailSearchCardSearchCols"
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
                    clearable
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
                <div class="search-bar-item-auto">
                  <el-button size="small" type="primary" @click="search(1)"
                    >查询</el-button
                  >
                  <el-button size="small" type="primary" @click="onReset()"
                    >重置</el-button
                  >
                </div>
                <div class="full-width">
                  <div
                    v-for="item in list"
                    :key="item.id"
                    class="card card-shadow mt15 mb15 lc-col-12 lc-col-xs12"
                  >
                    <div class="card-body">
                      <div class="card-header" v-if="cardTitlePrefix || renderColValue(cols.find((v) => v.id === cardTitleKey), item)">
                        <strong>
                          <span v-if="cardTitlePrefix">{{ cardTitlePrefix }}:</span>
                          <h3 class="inline">
                            {{ renderColValue(cols.find((v) => v.id === cardTitleKey), item) }}
                          </h3></strong>
                      </div>
                      <div v-else class="mt10"></div>
                      <div class="card-content-padded">
                        <div class="lc-row lc-space16">
                          <div
                            class="lc-col-12 lc-col-xs6"
                            v-for="(col, colIndex) in detailSearchCardListCols"
                            :key="col.id"
                          >
                            <div
                              class="flex flex-content-start"
                            >
                              <label class="nowrap">{{ col.label }}:</label>
                              <div class="flex-flex-auto">
                                <template>
                                  <lb-render
                                    v-if="col.renderjxs"
                                    :scope="getRenderScope(colIndex, col, item)"
                                    :render="col.renderjxs"
                                  />
                                  <template v-else>
                                    {{ renderColValue(col, item) }}
                                  </template>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-footer">
                        <span class="black">{{ cardFooter }}:</span
                        ><button
                          type="button"
                          class="el-button link el-button--text"
                          @click="onConfirm(item)"
                        >
                          <span>确定</span>
                        </button>
                        <span class="ml10 black" v-if="auditType === 'adjust'">是否确定要终止:</span
                        ><button
                          v-if="auditType === 'adjust'"
                          type="button"
                          class="el-button link el-button--text"
                          @click="onConfirmAdjustStop(item)"
                        >
                          <span>确定</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="tac darkgray pt50 pb50" v-show="!list.length">
                    未查询到数据
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tableView from '@/common-base/components/pubComponents/tableView';
import crumbsBar from '@/common-base/components/crumbs-bar';
import formDataMixin from '@/common-base/components/commonForm/formDataMixin';
import { AUDIT_PARAMS_MAP } from '@/common-base/components/commonForm/data/auditData';
import LbRender from '@/common-base/components/pubComponents/render.vue';

export default {
  components: {
    crumbsBar,
    tableView,
    LbRender,
  },
  mixins: [formDataMixin],
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    auditType: {
      type: String,
      default() {
        return '';
      }
    },
    searchParamsRequired: {
      type: Boolean,
      default() {
        return false;
      }
    },
    pageTitle: {
      type: String
    },
    title: {
      type: String,
      default() {
        return '请选择';
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    apiModule: {
      type: Object,
      default() {
        return {};
      }
    },
    apiKey: {
      type: Object,
      default() {
        return {};
      }
    },
    cardTitlePrefix: {
      type: String,
      default() {
        return '';
      }
    },
    cardTitleKey: {
      type: String,
      default() {
        return '';
      }
    },
    placeholder: {
      type: String,
      default() {
        return '名称';
      }
    },
    cardFooter: {
      type: String,
      default() {
        return '';
      }
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    immediate: {
      type: Boolean,
      default() {
        return false;
      }
    },
    cols: {
      type: Array,
      default() {
        return [];
      }
    },
    beforeConfirm: {
      type: Function,
      default() {
        return true;
      }
    }
  },
  computed: {
    detailSearchCardListCols() {
      return this.getDetailSearchCardListViewCols().filter(v => v.listable);
    },
    detailSearchCardSearchCols() {
      return this.getDetailSearchCardListViewCols().filter(v => v.searchable);
    }
  },
  data() {
    return {
      options: this.getDefaultOptions('LIST_VIEW'),
      total: 0,
      list: [],
      searchParams: {
        current: 1,
        rowCount: 15,
        ...this.getDefaultSearchParams(this.getDetailSearchCardListViewCols()),
      }
    };
  },
  created() {
    if (this.immediate) {
      this.getData();
    }
    this.initOptions('LIST_VIEW');
  },
  watch: {
    visible: {
      handler(newValue) {
        this.$emit('update:visible', newValue);
      }
    }
  },
  methods: {
    getRenderScope(colIndex, col, item) {
      return {
        $index: colIndex,
        column: col,
        row: item,
        _self: this,
      };
    },
    // 重置
    onReset() {
      this.searchParams = {
        ...this.searchParams,
        ...this.getDefaultSearchParams(this.getDetailSearchCardListViewCols()),
        current: 1,
      };
      if (this.searchParamsRequired) {
        this.list = [];
        this.total = 0;
      } else {
        this.getData(true);
      }
    },
    /**
     * 查询表格数据
     * @param pager 查询目标分页
     */
    search(pager) {
      this.searchParams.current = pager || 1;
      this.getData();
    },
    getDetailSearchCardListViewCols() {
      let result = this.cols.length ? this.cols : this.getListViewCols();
      if (this.auditType !== 'adjust') {
        result = result.filter(col => !['effectTime', 'effectType'].includes(col.id));
      }
      return result;
    },
    /**
     * 查询表格数据
     * @param args 查询参数
     */
    getData() {
      if (this.checkHasSearchParams(this.detailSearchCardSearchCols)) {
        const params = {
          ...this.searchParams,
          ...this.params
        };
        Object.entries(params).forEach(([key, value]) => {
          if ((typeof value === 'string' && value.trim() === '') || value === null) {
            params[key] = undefined;
          }
        });
        this.API.send(
          this.CFG.services[this.apiModule][this.apiKey],
          params,
          (res) => {
            res = res.serviceResult || res;
            this.list = res.rows || res;
            this.total = res.total >= 0 ? res.total : this.total;
          },
          () => {},
          this
        );
      }
    },

    renderColValue(col, item) {
      if (col && item) {
        if (typeof col.render === 'function') {
          return col.render(item);
        }
        if (col.type === 'date') {
          return this.utils.formatDate(item[col.id], col.format);
        }
        return item[col.id];
      }
      return '';
    },

    onCancel() {
      this.$emit('update:visible', false);
      this.$refs.viewBody.scrollTop = 0;
    },

    onConfirm(item) {
      if (typeof this.beforeConfirm === 'function') {
        this.$emit('confirm', item);
        this.onCancel();
        return;
      }
      this.$emit('confirm', item);
      this.onCancel();
    },

    onConfirmAdjustStop(item) {
      this.$confirm({
        title: '提示',
        text: '是否终止该单据？',
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
                this.CFG.services[this.config.module][this.config.applyUpdate],
                {
                  ...item,
                  directiveId: item.id,
                  directiveType: '2',
                  effectType: '1',
                  ...AUDIT_PARAMS_MAP.adjustUpdate[item.type],
                  id: undefined,
                  effectTime: undefined,
                },
                () => {
                  this.onCancel();
                  this.$router.go(-1);
                },
                () => {},
                this
              );
             
            }
          }
        ]
      })
      
    }
  }
};
</script>
<style lang="scss" scoped>
.z10 {
  z-index: 10;
}
</style>