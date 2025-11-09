<template>
  <!-- 弹出框组件，用于显示选择内容的提示信息 -->
  <el-popover
    placement="top"
    trigger="hover"
    :disabled="!selectName || !isOverStep"
    popper-class="popover-select"
    :content="selectName"
  >
    <!-- 添加一层dom为了不让popover的事件与select的事件冲突 -->
    <div slot="reference">
      <!-- 下拉选择器组件，支持远程搜索和过滤功能 -->
      <el-select
        ref="elSelectDom"
        v-model="selectValue"
        :placeholder="placeholder"
        :popper-class="{'table-popper-select': cols.length}"
        filterable
        remote
        :remote-method="startRemoteMethod"
        :loading="loading"
        :size="size"
        :disabled="disabled"
        :clearable="clearable"
        :allow-create="allowCreate"
        :multiple="multiple"
        :reserve-keyword="reserveKeyword"
        v-tag-no-delete-list="[selectValue, noDeleteList]"
        @focus="onFocus"
      >
        <!-- 表格表头 -->
        <div v-if="cols.length" class="table-header">
          <div
            v-for="child of cols"
            :key="child.id" 
            :style="{width: child.width}"
            class="table-column name-column">{{child.label}}</div>
        </div>

        <!-- 下拉选择项，循环渲染可选项 -->
        <el-option
          v-for="(item, index) in newOptionsList"
          :key="item[idText] + index"
          :label="
            typeof resolvedNameText === 'function' ? resolvedNameText(item) : item[resolvedNameText]
          "
          :value="item[idText]"
          :disabled="item.disabled"
        >
          <!-- 表格内容 -->
          <div v-if="cols.length" class="table-row">
            <div 
              v-for="child of cols"
              :key="child.id" 
              :style="{width: child.width}"
              class="table-column"
            >
              <!-- 渲染数据 -->
              <template v-if="child.renderJxs">
                <RenderVue :scope="item" :render="child.renderJxs"></RenderVue> 
              </template>
              <!-- 文本渲染 -->
              <template v-else>{{ item[child.id] || '--'}}</template>
            </div>
          </div>
          <!-- 自定义插槽，可用于自定义选项内容 -->
          <slot :item="item"></slot>
        </el-option>
      </el-select>
    </div>
  </el-popover>
</template>

<script type="text/ecmascript-6">
/**
 * 引入渲染组件，用于动态渲染内容
 */
import RenderVue from '@/common-base/components/pubComponents/render.vue'
/**
 * 引入防抖函数，用于优化频繁触发的操作
 */
import debounce from 'lodash/debounce'
// 当前访问的url，如果不一样，清空缓存数据
let currentPromiseUrl = '';
// 同时请求接口的id
let sameTimeIds = {}; 

// 用于保存请求中的接口
const promiseMap = new Map();
/**
 * 此组件的列表集合
 */
const componentMap = new Map();

/**
 * 清除远程选择器的缓存数据
 * 遍历组件集合，将每个组件的清除缓存状态设置为 true，并清空请求中的接口集合
 */
export function clearRemoteSelectCache() {
  componentMap.forEach(el => {
    el.clearCacheStatus = true
  })
  promiseMap.clear();
}

/**
 * 🌼 组件的使用方式说明
 * 
 * ┌───────────────────────────────┐
 * │          prop的参数          │
 * └───────────────────────────────┘
 * 
 * 🎛️ el-select属性相关：
 *   - value: 当前选中的值，类型为 String，必填
 *   - placeholder: 占位文字，类型为 String，默认值为 '请输入'
 *   - clearable: 是否可清空，类型为 Boolean，默认值为 false
 *   - allowCreate: 是否可创建，类型为 Boolean，默认值为 false
 *   - disabled: 是否禁用，类型为 Boolean，默认值为 false
 *   - size: 大小，类型为 String，默认值为 'small'
 *   - multiple: 是否多选，类型为 Boolean，默认值为 false
 *   - reserveKeyword: 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词，类型为 Boolean，默认值为 true
 * 
 * 🌐 接口相关：
 *   - url: 请求的 url 配置，类型为 String，必填
 *   - params: 请求接口的其它参数，类型为 Object，默认值为 {}
 *   - rowCount: 请求接口的数量，类型为 Number，默认值为 50
 *   - updateParamsRequire: 其它参数更新，是否请求接口，类型为 Boolean，默认值为 false
 *   - hasParams: 请求接口必须要有的参数，类型为 Array，默认值为 []
 *   - paramsKeyText: 入参的 key 的名称，类型为 String，默认值为 'key'
 *   - paramsIdText: 入参 id 的名称，类型为 String，默认值为 'id'
 *   - paramsIdList: 是否强制使用 idList 参数，不使用 id，类型为 Boolean，默认值为 true
 *   - mustHasKeyOrId: 是否必须要有 id 或 key 才请求接口，类型为 Boolean，默认值为 false
 * 
 * 🚀 初始化请求相关
 *   - initDefaultRequired: 默认组件加载后请求，类型为 Boolean，默认值为 false
 *   - initRequired: 获得焦点后请求，类型为 Boolean，默认值为 true
 *   - initChooseFirst: 初始化默认选中第一个选项，类型为 Boolean，默认值为 false
 * 
 * 🎨 显示使用
 *   - idText: value 的名称，类型为 String，默认值为 'c'
 *   - nameText: label 的名称，类型为 String 或 Function，默认值为 ''
 *   - cols: 表格列，类型为 Array，默认值为 []
 * 
 * 🛠️ 功能
 *   - noDeleteList: 多选时，不能删除的 tag，类型为 Array，默认值为 []
 *   - noKeydownDeleteState: 是否键盘回退或删除不能删除标签，类型为 Boolean，默认值为 false
 * 
 * 📜 函数
 *   - customRemoteMethod: 自定义筛选过滤，第一次请求，后面不再请求接口，类型为 Function，默认值为 null
 *   - processingDataFun: 处理数据的函数，类型为 Function，默认值为 null
 *   - filterListFun: 过滤结果数据，类型为 Function，默认值为 null
 * 
 * ┌───────────────────────────────┐
 * │          emit的事件          │
 * └───────────────────────────────┘
 * 
 * 📢 事件：
 *   - input: 当 selectValue 变化时触发，传递当前选中的值
 *   - change: 当选择值变化时触发，传递当前选中的值、当前选中的选项和变化类型
 *   - getList: 当选项列表更新时触发，传递所有选项列表
 */

/**
 * 远程选择器组件配置
 */
export default {
  /**
   * 注册组件
   */
  components: {
    RenderVue
  },
  /**
   * 注册指令
   */
  directives: {
    /**
     * 自定义指令，用于控制多选时不能删除的标签样式
     */
    tagNoDeleteList: {
      /**
       * 指令更新时的回调函数
       * @param {HTMLElement} el - 指令绑定的元素
       * @param {Object} bindings - 指令绑定的值
       */
      update(el, bindings) {
        // valueList v-model绑定值
        // noDeleteList 不能删除的列表
        const [valueList, noDeleteList] = bindings.value;
        if (
          !Array.isArray(valueList) ||
          !Array.isArray(noDeleteList) ||
          !noDeleteList.length ||
          !valueList.length
        ) {
          return;
        }

        const indexList = [];
        valueList.forEach((el, index) => {
          if (noDeleteList.includes(el)) {
            indexList.push(index);
          }
        });

        /**
         * 处理标签样式，隐藏不能删除的标签的关闭图标
         * @param {NodeList} tags - 标签关闭按钮的集合
         */
        const dealStyle = function (tags) {
          tags.forEach((el, index) => {
            if (
              indexList.includes(index) &&
              ![...el.classList].includes('none')
            ) {
              el.classList.add('none');
            }
          });
        };

        // 设置样式，隐藏close icon
        const tags = el.querySelectorAll('.el-tag__close');
        if (tags.length === 0) {
          // 初始化tags为空处理
          setTimeout(() => {
            const tagTemp = el.querySelectorAll('.el-tag__close');
            dealStyle(tagTemp);
          });
        } else {
          dealStyle(tags);
        }
      }
    }
  },
  /**
   * 组件接收的属性配置
   */
  props: {
    /**
     * el-select属性 -当前选中的值 
     */
    value: {
      type: String,
      required: true
    },
    /**
     * el-select属性 - 占位文字
     */
    placeholder: {
      type: String,
      default: '请输入'
    },
    /**
     * el-select属性 - 是否可清空
     */
    clearable: {
      type: Boolean,
      default: false
    },
    /**
     * el-select属性 - 是否可创建
     */
    allowCreate: {
      type: Boolean,
      default: false
    },
    /**
     * el-select属性 - 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * el-select属性 - 大小
     */
    size: {
      type: String,
      default: 'small'
    },
    /**
     * el-select属性 - 是否多选 
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * el-select属性 - 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
     */
    reserveKeyword: {
      type: Boolean,
      default: true
    },

    /**
     * 请求的url配置
     */
    url: {
      type: String,
      required: true
    },
    /**
     * 接口参数 - 请求接口的其它参数
     */
    params: {
      type: Object,
      default: () => ({})
    },
    /**
     * 接口参数 - 请求接口的数量
     */
    rowCount: {
      type: Number,
      default: 50
    },
    /**
     * 接口参数 - 其它参数更新，是否请求接口
     */
    updateParamsRequire: {
      type: Boolean,
      default: false
    },
    /**
     * 接口参数 - 请求接口必须要有的参数
     */
    hasParams: {
      type: Array,
      default: () => []
    },
    /**
     * 接口参数 - 入参的key的名称
     */
    paramsKeyText: {
      type: String,
      default: 'key'
    },
    /**
     * 接口参数 - 入参id的名称
     */
    paramsIdText: {
      type: String,
      default: 'id'
    },
    /**
     * 接口参数 - 是否强制使用idList参数，不使用id
     */
    paramsIdList: {
      type: Boolean,
      default: true
    },
    /**
     * 接口参数 - 是否必须要有id或key才请求接口
     */
    mustHasKeyOrId: {
      type: Boolean,
      default: false
    },
    /**
     * 初始化请求 - 默认组件加载后请求
     */
    initDefaultRequired: {
      type: Boolean,
      default: false
    },
    /**
     * 初始化请求 - 获得焦点后请求
     */
    initRequired: {
      type: Boolean,
      default: true
    },
    /**
     * 初始化请求 - 初始化默认选中第一个选项
     */
    initChooseFirst: {
      type: Boolean,
      default: false
    },
    /**
     * 回显使用 - value的名称
     */
    idText: {
      type: String,
      default: 'c'
    },
    /**
     * 回显使用 - label的名称
     */
    nameText: {
      type: String || Function,
      default: ''
    },
    /**
     * 功能 - 多选时，不能删除的tag
     */
    noDeleteList: {
      type: Array,
      default: () => []
    },
    /**
     * 功能 - 是否键盘回退或删除不能删除标签
     */
    noKeydownDeleteState: {
      type: Boolean,
      default: false
    },
    /**
     * 自定义筛选过滤 - 第一次请求，后面不再请求接口
     */
    customRemoteMethod: {
      type: Function,
      default: null
    },
    /**
     * 处理数据的函数
     */
    processingDataFun: {
      type: Function,
      default: null
    },
    /**
     * 过滤结果数据
     */
    filterListFun: {
      type: Function,
      default: null
    },
    /**
     * 表格列
     */
    cols: {
      type: Array,
      default: () => []
    },
  },
  /**
   * 组件的数据状态
   * @returns {Object} 组件的初始数据
   */
  data() {
    return {
      // 当前选中的值，多选时为数组，单选时为字符串
      selectValue: this.multiple ? [] : '',
      // 远程请求是否加载中
      loading: false,
      // 当前显示的选项列表
      optionsList: [],
      // 所有已获取的选项列表
      allOptionsList: [],
      // 是否为初始化状态
      init: true,
      selectName: '', // 选择的内容
      isOverStep: true, // input内容是否超过宽度
      requiredCount: 0, // 请求次数计数
      // 清除缓存状态
      clearCacheStatus: false,
    };
  },
  /**
   * 组件的监听器
   */
  watch: {
    /**
     * 监听 value 属性的变化
     */
    value: {
      /**
       * value 变化时的处理函数
       */
      handler() {
        // 若传入的 value 与当前选中值 selectValue 相同，则直接返回，不做后续处理
        if (this.isSameData(this.value, this.selectValue)) {
          return false;
        }

        // 若 value 为非空数组或非空字符串，且 updateParamsRequire 为 false
        if (
          ((Array.isArray(this.value) && this.value.length) ||
            (typeof this.value === 'string' && this.value)) &&
          !this.updateParamsRequire
        ) {
          // 调用远程请求方法，传入空关键词和当前 value，请求完成后触发 onChange 方法并标记为初始化操作
          this.remoteMethod('', this.value, () => {
            this.onChange('init');
          });
        } else if (typeof this.value === 'string' && !this.value) {
          // 若 value 为空字符串，设置当前单选的文本为空
          this.setSelectName({});
          // 判断输入框内容是否超出当前宽度
          this.noOverstepWidth();
        }
        // 更新当前选中值为传入的 value
        this.selectValue = this.value;
      },
      immediate: true
    },
    /**
     * 监听 selectValue 属性的变化
     */
    selectValue: {
      /**
       * selectValue 变化时的处理函数
       */
      handler() {
        if (this.value === this.selectValue) {
          return;
        }
        this.$emit('input', this.selectValue);
        this.onChange();
      }
    },
    /**
     * 监听 params 属性的变化
     */
    params: {
      /**
       * params 变化时的处理函数
       * @param {Object} next - 变化后的 params 值
       * @param {Object} prev - 变化前的 params 值
       */
      handler(next, prev) {
        if (this.updateParamsRequire && !this.isSameData(next, prev)) {
          this.remoteMethod('', this.value, () => {
            this.onChange();
          });
        }
      },
      deep: true,
      immediate: true
    },
    /**
     * 监听路由路径的变化
     */
    '$route.path'() {
      promiseMap.clear();
      for (let key in sameTimeIds) {
        sameTimeIds[key] = [];
      }
    }
  },
  /**
   * 组件的计算属性
   */
  computed: {
    /**
     * 计算最终的nameText值，优先使用传入的props，否则根据cols是否有数据，设置不同的默认值
     */
    resolvedNameText() {
      if (this.nameText) {
        return this.nameText;
      }
      
      /**
       * 设置表格类型的默认值
       */
      if (this.cols.length) {
        return (item) => {
          // 深拷贝列配置，避免修改原始数据
          const cols = this.utils.deepCopy(this.cols);
          // 获取第一列的 id
          const firstId = cols.shift().id;
          // 获取第一列对应的数据，若不存在则为空字符串
          const name = item[firstId] || ''

          // 遍历剩余列，获取每列对应的数据，并过滤掉空值
          const list = cols.map(el => item[el.id]).filter(el => el);
          // 有数据，拼接数据
          if(list.length) {
            // 将第一列数据与剩余列数据用括号拼接
            return name + '（' + list.join('-') + '）';
          }
          // 若剩余列无数据，仅返回第一列数据
          return name;
        };
      } else {
        // 若没有列配置，默认返回 'n' 作为 nameText 值
        return 'n';
      }
    },
    /**
     * 计算当前请求的名称
     * @returns {String} 请求的名称
     */
    name() {
      return this.url ? this.url.url : '';
    },
    /**
     * 计算最终的选项列表
     * @returns {Array} 处理后的选项列表
     */
    newOptionsList() {
      // 遍历当前选项列表
      this.optionsList.forEach((el) => {
        // 若存在数据处理函数，则对当前选项进行数据处理
        if (this.processingDataFun) {
          this.processingDataFun(el);
        }
        // 根据 noDeleteList 判断当前选项是否需要禁用
        el.disabled = this.noDeleteList.find(
          (item) => item === el[this.idText]
        );
        // 若当前未选中值，且配置了初始化选中第一个选项，且是第一次请求，且当前选项未被禁用
        if (
          !this.selectValue &&
          this.initChooseFirst &&
          this.requiredCount === 1 &&
          !el.disabled
        ) {
          // 将当前选项的值设为选中值
          this.selectValue = el[this.idText];
        }
      });

      // 返回当前选项列表，若为空则返回空数组
      return this.optionsList || [];
    },
  },
  /**
   * 组件的方法
   */
  methods: {
    /**
     * 判断两个值是否相同
     * @param {*} first - 第一个需要比较的值
     * @param {*} second - 第二个需要比较的值
     * @returns {boolean} - 如果两个值相同返回 true，否则返回 false
     */
    isSameData(first, second) {
      // 处理两个值都为 null 或 undefined 的情况
      if (!first && !second) {
        return first === second;
      }
      // 处理两个值都为数组的情况
      if (Array.isArray(first) && Array.isArray(second)) {
        // 深拷贝数组，避免修改原数组
        first = this.utils.deepCopy(first);
        second = this.utils.deepCopy(second);
        // 对数组排序后转换为 JSON 字符串进行比较
        return JSON.stringify(first.sort()) === JSON.stringify(second.sort());
      } 
      // 处理两个值都为对象的情况
      else if (typeof first === 'object' && typeof second === 'object') {
        // 若对象的键数量不同，则两个对象不同
        if (Object.keys(first).length !== Object.keys(second).length) {
          return false;
        }
        // 遍历第一个对象的所有键
        for (let key in first) {
          // 递归比较对象属性值
          if (first.hasOwnProperty(key) && !this.isSameData(first[key], second[key])) {
            return false;
          }
        }
        return true;
      }
      // 处理基本数据类型的情况
      return first === second;  
    },
    /**
     * 开始远程搜索方法，用于触发远程请求
     * 当存在自定义筛选方法且非清除缓存状态时，使用自定义筛选
     * 若处于清除缓存状态，则清空关键词并请求接口
     * 
     * @param {string} keyword - 搜索关键词
     */
    startRemoteMethod(keyword) {
      keyword = keyword && keyword.trim();

      /**
       * 自定义筛选，非清理缓存的状态下
       */
      if (keyword && this.customRemoteMethod) {
        if (this.clearCacheStatus) {
          /**
           * 清除缓存状态，请求接口
           */
          keyword = '';
        } else {
          this.optionsList = this.customRemoteMethod(
            keyword,
            this.allOptionsList
          );
          return;
        }
      }

      this.clearCacheStatus = false
      this.remoteMethod(keyword);
    },
    /**
     * 设置参数
     * @param {string} keyword - 搜索关键词
     * @param {string|array} id - 选择的id
     * @param {string} sameTimeName - 同时请求的接口的name
     * @returns {Object} 整合后的请求参数
     */
    setParams(keyword, id, sameTimeName) {
      // 整合参数，将组件传入的 params 和 rowCount 合并到新对象中
      const params = {
        ...this.params,
        rowCount: this.rowCount
      };

      // 设置参数关键词，如果存在搜索关键词，则将其添加到请求参数中
      if (keyword) {
        params[this.paramsKeyText] = keyword;
      }

      // 如果存在入参id的名称配置，则将选择的id添加到请求参数中
      if (this.paramsIdText) {
        params[this.paramsIdText] = id;
      }

      // 当存在入参id的名称配置，且 id 为数组或强制使用 idList 参数时，使用 idList 替代单个 id
      if (this.paramsIdText && (Array.isArray(id) || this.paramsIdList)) {
        // 移除之前添加的单个 id 参数
        delete params[this.paramsIdText];

        // 如果 id 是字符串且不为空，则将其转换为数组
        if (typeof id === 'string' && id) {
          id = [id];
        }
        // 设置 idList 参数，优先使用同时请求接口的 id 集合，若没有则使用传入的 id
        params.idList = id ? sameTimeIds[sameTimeName] || id : [];

        // 获取 idList 的长度
        const length = params.idList.length;
        // 如果 idList 为空，则移除该参数
        if (!params.idList || !length) {
          delete params.idList;
        }
        // 设置请求数量，取原 rowCount 和 idList 长度中的较大值
        params.rowCount = Math.max(params.rowCount, length);
      }

      return params;
    },
    /**
     * 远程搜索方法
     * @param {string} keyword - 搜索关键词
     * @param {string|array} id - 选择的id
     * @param {Function} callback - 回调函数
     */
    async remoteMethod(keyword, id, callback) {
      // 移除关键词左右空格
      if (keyword) {
        keyword = keyword.trim();
      }

      // 当前访问链接与上一次不一样，清除缓存数据
      if (window.location.href !== currentPromiseUrl) {
        promiseMap.clear();
      }

      // id和关键词，是否必须要用，没有不进行请求
      if (this.mustHasKeyOrId && !keyword && !id) {
        return false;
      }

      // 设置同时请求的数据id
      const sameTimeName = this.addSameTimeIds(id)

      /**
       * 生成远程搜索的防抖函数
       */
      if (!this.remoteMethodIngDebounce) {
        this.remoteMethodIngDebounce = debounce(this.remoteMethodIng, 300)
      }

      this.remoteMethodIngDebounce({keyword, id, sameTimeName}, callback)
    },
    /**
     * 添加到同时请求接口的id集合中
     * @param {array|string} id 添加的id或id列表
     * @return 同时请求的接口的name
     */
    addSameTimeIds(id) {
      const sameTimeName = this.name + JSON.stringify(this.params);
      /**
       * 没有id直接返回
       */
      if(!id) {
        return sameTimeName
      }
      // 没有同时请深圳市接口的id集合，创建
      if (!sameTimeIds[sameTimeName]) {
        sameTimeIds[sameTimeName] = [];
      }
      if (Array.isArray(id)) {
        id.forEach(el => {
          /**
           * 已添加过不在添加
           */
          if( !sameTimeIds[sameTimeName].includes(el) ) {
            sameTimeIds[sameTimeName].push(el);
          }
        })
      } else if( !sameTimeIds[sameTimeName].includes(id) ) {
        /**
         * 已添加过不在添加
         */
        sameTimeIds[sameTimeName].push(id);
      }

      return sameTimeName
    },
    /**
     * 远程搜索进行中
     * @param {Object} options - 包含 keyword、id 和 sameTimeName 的对象
     * @param {Function} callback - 回调函数
     */
    remoteMethodIng({keyword, id, sameTimeName}, callback) {

      // 得到请求的参数
      const params = this.setParams(keyword, id, sameTimeName);

      // 请求的参数是否存在
      if (this.hasParams.find((el) => !params[el])) {
        return;
      }

      this.loading = true;
      const paramsString = JSON.stringify(params) + this.url.url;

      currentPromiseUrl = window.location.href;

      // 请求中的接口，不再请求，
      if (promiseMap.has(paramsString)) {
        promiseMap.get(paramsString).then((res) => {
          this.loading = false;
          this.optionsList = res;
          this.updateAllOptionList();
          callback && callback();
        });
        return;
      }

      const currentPromise = this.requiredList(params, callback);

      promiseMap.set(paramsString, currentPromise);

      // 清空同时请求数据
      sameTimeIds[sameTimeName] = [];
    },
    /**
     * 请求数据列表
     * @param {Object} params - 请求参数
     * @param {Function} callback - 回调函数
     * @returns {Promise} 请求的 Promise 对象
     */
    requiredList(params, callback) {
      return new Promise((resolve) => {
        // 调用 API 发送请求
        this.API.send(
          this.url,  // 请求的 URL
          params,    // 请求的参数
          function (res) {
            // 从响应数据中提取服务结果
            res = res.serviceResult;
            // 若结果不是数组，尝试从 rows 字段获取数据
            if (!Array.isArray(res)) {
              res = res.rows;
            }
            // 请求完成，关闭加载状态
            this.loading = false;
            // 请求次数加 1
            this.requiredCount++;
            // 若响应数据存在且为数组
            if (res && Array.isArray(res)) {
              // 若存在过滤函数，对响应数据进行过滤
              if (this.filterListFun) {
                res = this.filterListFun(res);
              }

              // 更新当前选项列表
              this.optionsList = res;
              // 更新所有选项列表
              this.updateAllOptionList();
              // 执行回调函数
              callback && callback();

              // 解析响应数据
              resolve(res);
            } else {
              // 若响应数据无效，解析为空数组
              resolve([]);
            }
          },
          function () {
            // 请求失败，解析为空数组
            resolve([]);
          },
          this
        );
      });
    },
    /**
     * 更新所有选项列表
     */
    updateAllOptionList() {
      const list = this.optionsList.filter((el) => {
        return !this.allOptionsList.find(
          (item) => item[this.idText] === el[this.idText]
        );
      });
      this.allOptionsList = [...this.allOptionsList, ...list];
      this.$emit('getList', this.allOptionsList)
    },
    /**
     * 选择值变化时的回调函数
     * @param {string} type - 变化类型，默认为 'change'
     */
    onChange(type = 'change') {
      // 初始化当前选中的选项，默认为 null
      let currentOption = null;

      // 如果是多选模式
      if (this.multiple) {
        // 当前选中的选项为数组
        currentOption = [];
        // 遍历所有选项列表
        this.allOptionsList.forEach((el) => {
          // 检查当前选项的 id 是否在已选中的值中
          if (this.selectValue.find((item) => item === el[this.idText])) {
            // 若存在，则将该选项添加到当前选中的选项数组中
            currentOption.push(el);
          }
        });
      } else {
        // 单选模式下，从当前选项列表中查找与选中值 id 匹配的选项
        currentOption = this.optionsList.find(
          (el) => el[this.idText] === this.selectValue
        );
        // 设置当前单选的文本
        this.setSelectName(currentOption);
        // 判断输入框内容是否超出当前宽度
        this.noOverstepWidth();
      }
      // 触发 change 事件，传递当前选中的值、当前选中的选项和类型
      this.$emit('change', this.selectValue, currentOption, type);
    },
    /**
     * 输入框获取焦点时的回调函数，用于初始化请求
     */
    onFocus() {
      if (!this.init) {
        return;
      }

      this.init = false;
      this.initRequired && this.remoteMethod();
    },
    /**
     * 设置当前单选的文本
     * @param {Object} currentOption - 当前选中的选项，默认为空对象
     */
    setSelectName(currentOption = {}) {
      if (!this.selectValue || this.multiple) {
        this.selectName = '';
        return;
      }

      this.selectName =
        typeof this.resolvedNameText === 'function'
          ? this.resolvedNameText(currentOption)
          : currentOption[this.resolvedNameText];
    },
    /**
     * 判断输入框内容是否超出当前宽度
     */
    noOverstepWidth() {
      // 若未选中值或为多选模式，则不执行后续逻辑
      if (!this.selectValue || this.multiple) {
        return;
      }
      // 获取 el-select 组件的引用
      const $elSelectDom = this.$refs.elSelectDom;
      // 若未获取到 el-select 组件的引用，则不执行后续逻辑
      if (!$elSelectDom) {
        return;
      }
      // 获取 el-select 组件中的输入框元素
      const $input = $elSelectDom.$el.querySelector('input');
      // 若未获取到输入框元素，则不执行后续逻辑
      if (!$input) {
        return;
      }
      // 在下一次 DOM 更新循环结束之后执行回调函数
      this.$nextTick(() => {
        // 判断输入框内容是否超出输入框宽度
        this.isOverStep = $input.offsetWidth < $input.scrollWidth;
      });
    },
    /**
     * 设置初始化，无数据时的提示
     * @param {Object} $elSelectDom - el-select 组件的引用
     */
    initNoDataTips($elSelectDom) {
      try {
        // 重写 el-select 组件的 emptyText 计算属性的 getter 方法，用于自定义空状态提示文本
        $elSelectDom._computedWatchers.emptyText.getter = function () {
          // 若组件正在加载，返回加载状态的提示文本
          if (this.loading) {
            return this.utils.formatEmpty(this.loadingText, this.t('el.select.loading'));
          } else {
            // 若组件支持过滤、存在查询条件、有选项但过滤后无匹配项，返回无匹配结果的提示文本
            if (
              this.filterable &&
              this.query &&
              this.options.length > 0 &&
              this.filteredOptionsCount === 0
            ) {
              return this.utils.formatEmpty(this.noMatchText, this.t('el.select.noMatch'));
            }
            // 若没有可用选项，返回无数据的提示文本
            if (this.options.length === 0) {
              return this.utils.formatEmpty(this.noDataText, this.t('el.select.noData'));
            }
          }
          // 若不满足以上条件，返回 null
          return null;
        };

        // 若需要初始化请求且不强制要求有 id 或 key 才请求接口，设置空状态提示文本为 '无数据'
        if (this.initRequired && !this.mustHasKeyOrId) {
          $elSelectDom._computedWatchers.emptyText.value = '无数据';
        }
      } catch (e) {
        // 捕获异常并打印警告信息
        console.warn(e);
      }
    },
    /**
     * 设置键盘事件监听，禁用键盘回退或删除操作
     * @param {Object} $elSelectDom - el-select 组件的引用
     */
    setKeydown($elSelectDom) {
      // 禁用键盘回退或删除
      if (this.noKeydownDeleteState && $elSelectDom) {
        $elSelectDom.$el.querySelector('input').addEventListener(
          'keydown',
          (e) => {
            if (String(e.keyCode) === '46' || String(e.keyCode) === '8') {
              e.stopPropagation();
            }
          },
          true
        );
      }
    }
  },
  /**
   * 组件挂载完成后的回调函数
   */
  mounted() {
    // 获取 el-select 组件的 DOM 引用
    const $elSelectDom = this.$refs.elSelectDom;

    // 初始化无数据提示
    this.initNoDataTips($elSelectDom);
    // 设置键盘事件
    this.setKeydown($elSelectDom);

    // 若需要初始化默认请求，则调用远程请求方法
    this.initDefaultRequired && this.remoteMethod();

    /**
     * 添加此组件到组件集合中
     */
    componentMap.set(this._uid, this)
  },
  /**
   * 组件销毁前的回调函数
   */
  beforeDestroy() {
    
    /**
     * 移除此组件在组件集合里
     */
    componentMap.delete(this._uid)
  }
};
</script>
<style lang="scss" scoped>
/** 
* 多选时，标签页的输入框与提示文字对齐
*/
::v-deep .el-select__input {
  margin-left: 5px;
}
</style>
<style lang="scss">
/**
 * 表格选择器样式
 * 定义表格选择器的下拉框样式，包含滚动区域、下拉项、表头和表格行的样式
 */
.table-popper-select {
  /**
   * 滚动条可视区域样式
   * 设置为行内块元素，去除顶部内边距，允许垂直滚动
   */
  .el-scrollbar__view {
    display: inline-block;
    padding-top: 0;
    overflow-y: auto;
  }
  /**
   * 下拉选择项样式
   * 设置内边距、高度自适应、行高和文本换行方式
   */
  .el-select-dropdown__item {
    padding: 8px 0;
    height: auto;
    line-height: 1.1;
    white-space: pre-wrap;
  }
  /**
   * 表格表头和表格行通用样式
   * 设置为 flex 布局
   */
  .table-header,
  .table-row {
    display: flex;
  }
  /* 表格表头 */
  .table-header {
    padding: 12px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 500;
  }

  /* 表格行样式 */
  .table-row {
    align-items: center;
    padding: 0 20px;
  }

  /* 表格列样式 */
  .table-column {
    flex-shrink: 0;
    
    &+.table-column {
      margin-left: 5px;
    }
  }
}
</style>
