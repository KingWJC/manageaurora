<!--
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-11-12 21:46:30
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-08-24 22:52:40
 * @FilePath: \YYFc:\project\middleground\lonch-search-fe\src\components\common\remoteSelect\IdxDbList.vue
 * @Description: 产品
-->

<template>
  <RemoteSelectVue
    :value="value"
    :url="url"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    paramsKeyText="name"
    idText="id"
    :cols="cols"
    @change="onChange"
    @input="onInput"
  >
    <!-- 自定义的内容显示 -->
    <!-- <template #default="{ item }">
      <div class="option">
        <span class="title">{{ item.name }}</span>
        <span>{{ item.provinceName }}{{ item.cityName }}</span>
      </div>
    </template> -->
  </RemoteSelectVue>
</template>

<script type="text/ecmascript-6">
import RemoteSelectVue from './RemoteSelect.vue';

export default {
  components: {
    RemoteSelectVue
  },
  props: {
    /**
     * 绑定的值
     */
    value: {
      type: String,
      required: true
    },
    /**
     * 是否可以清空
     */
    clearable: {
      type: Boolean,
      default: true
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 默认显示的提示文本
     */
    placeholder: {
      type: String,
      default: '药品'
    },
  },
  data() {
    return {
      // 接口地址
      // url: this.CFG.services.oot.drugList,
      url: {
        module: 'oot',
        url: "/goods/drug/queryPagedDataList",
        method: 'POST',
        comment: "药品列表"
      },
      // 加上就是列表
      cols: [
        { label: '名称', id: 'productName', width: '200px' },
        { label: '规则', id: 'specification', width: '100px' },
        { label: '分类', id: 'productTypeValue', width: '100px', 
          renderJxs: (item) => {
            return (<el-tag v-show={item.productTypeValue} type="success" size="small">
              { item.productTypeValue }
            </el-tag>)
          }  
        },
        { label: '上市许可持有人', id: 'mahValue', width: '200px' },
      ]
    };
  },
  watch: {
  },
  computed: {},
  methods: {
    onChange(value, row, type) {
      this.$emit('change', value, row, type);
    },
    onInput(value) {
      this.$emit('input', value)
    }
  },
  created() {}
};
</script>