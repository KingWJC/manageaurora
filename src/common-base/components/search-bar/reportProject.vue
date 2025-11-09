<template>
  <div :style="mobileStyle">
  <!-- <div :style="isMobile ? mobileStyle : ''"> -->
    <div class="search-bar flex flex-content-start flex-items-center flex-wrap" :class="{isdrawer: !isFolding}" ref="searchBar">
      <div class="search-bar-item" v-for="(item, index) in displayData" :key="index" v-show="index < formItemNum">
        <!-- input 输入框 -->
        <el-input v-if="item.paramType=='text'" v-model="valData.formData[item.param]" class="flex-flex-auto" size="small"
          @change="formDataChange(item.param)" :placeholder="item.paramMark">
        </el-input>
        <!-- select 时间选择 -->
        <el-date-picker v-if="item.paramType=='date'" v-model="valData.formData[item.param]" type="date" size="small"
          :value-format="item.valueFormat || 'yyyy-MM-dd'" @change="formDataChange(item.param)" :placeholder="item.paramMark" :picker-options="item.pickerOptions">
        </el-date-picker>
        <!-- select 日期时间选择 -->
        <el-date-picker v-if="item.paramType=='datetime'" v-model="valData.formData[item.param]" type="datetime" size="small"
          :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'" @change="formDataChange(item.param)" :placeholder="item.paramMark" :picker-options="item.pickerOptions">
        </el-date-picker>
        <!-- select -->
        <el-select v-if="item.paramType=='select'" v-model="valData.formData[item.param]" class="full-width" @change="formDataChange(item.param)"
          size="small" :placeholder="item.paramMark" filterable>
          <el-option v-for="option in item.dataList" :key="option.name" :label="option.name" :value="option.code">
          </el-option>
        </el-select>
        <!-- select2 -->
        <el-select v-if="item.paramType=='select-all'" v-model="valData.formData[item.param]" class="full-width"
          @change="formDataChange(item.param)" size="small" :placeholder="item.paramMark" filterable>
          <el-option v-for="option in item.dataList" :key="option.name" :label="option.name" :value="option.code">
          </el-option>
        </el-select>
        <!-- select 多选 -->
        <el-select v-if="item.paramType=='select-multi'" multiple collapse-tags v-model="valData.formData[item.param]" class="full-width" @change="formDataChange(item.param)"
          size="small" :placeholder="item.paramMark" filterable>
          <el-option v-for="option in item.dataList" :key="option.name" :label="option.name" :value="option.code">
          </el-option>
        </el-select>
        <!-- select树状图 -->
        <select-tree
          v-if="item.paramType=='select-tree' || item.paramType=='select-tree-contains-children'"
          :options="treeDataCheck(item.dataList)"
          v-model="valData.formData[item.param]"
          :props="defaultProps"
          size="small"
          :placeholder="item.paramMark"
          width="150"
          class="flex-flex-auto"
        />
      </div>
      <template>
        <slot />
      </template>
    </div>
  </div>
</template>

<script>
import selectTree from './common/SelectTree'
export default {
  name: 'reportProject',
  inject:['valDataObject'],
  components: {
    selectTree
  },
  props: {
    thumbnailNumber: {  // 精简模式下需要显示查询条件的数量
      type: Number,
      default: () => {
        return null
      }
    },
    isFolding: {  // 是否折叠
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data () {
    return {
      isMobile: false,
      defaultProps: {
        parent: 'parentCode',   // 父级唯一标识
        value: 'code',          // 唯一标识
        label: 'name',       // 标签显示
        children: 'children', // 子级
      },
      mobileStyle: {
        overflow: 'hidden',
        height: 'auto' // 框架主体高度
      }
    };
  },
  computed: {
    valData(){
      const datas = this.valDataObject()
      return datas  //通过计算属性调用inject传进来的函数，返回值
    },
    formItemNum() {
      // 非手机端
      // if(!this.isMobile) return this.valData.formItem.length
      // 打开折叠菜单
      if(!this.isFolding) return this.valData.formItem.length
      // 设置保留数量
      const number = this.thumbnailNumber === null ? this.valData.formItem.length : this.thumbnailNumber
      return number
    },
    displayData() {
      const _self = this
      const datas = _self.valData
      // return datas.formItem.slice(0, this.formItemNum)
      return datas.formItem
    }
  },
  created() {
    this.isMobile = this.globalData.client.isMobile
  },
  mounted () {
    const _self = this
    this.$nextTick(() => {
      _self.loadCheck()
    })
  },
  methods: {
    // 初始化处理
    loadCheck() {
      // console.log(this.$refs.searchBar)
      this.$nextTick(() => {
        // 初始化处理
        //console.log(this.$refs.searchBar.offsetHeight)
        // this.initialHeight = this.$refs.searchBar.offsetHeight
        this.$set(this.mobileStyle, 'min-height', this.$refs.searchBar.offsetHeight + 'px')
      })
    },
    // select 树状结构数据
    treeDataCheck(data) {
      const copyData = this.utils.deepCopy(JSON.parse(JSON.stringify(data)))
      const value = this.utils.array2tree(copyData, 'code', 'parentCode')
      return value
    },
    // 数据处理
    formDataChange(param) {
      if (this.valData.formData[param] === null) {
        this.valData.formData[param] = ''
      }
    },
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
  .isdrawer {
    position: absolute;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    z-index: 11;
    left: 0;
    top: 0;
    padding: 10px 15px 15px 15px;
    max-height: 90vh;
  }

  ::v-deep .search-bar {
    .el-select{
      .el-select__input {
        margin-left: 5px;
      }
    }
  }
</style>
