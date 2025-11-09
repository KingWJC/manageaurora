<template>
  <div>
    <!-- 遮罩层 -->
    <div class="mask" v-if="!isFolding" @click="loadMore"></div>
    <!-- 分页报表的搜索条件处理 -->
    <reportProject :thumbnail-number="thumbnailNumber" :isFolding="isFolding">
      <el-divider v-if="thumbnailNumber < formItem.length" content-position="right" @click="loadMore">
      <!-- <el-divider v-if="isMobile && thumbnailNumber < formItem.length" content-position="right" @click="loadMore"> -->
        {{ isFolding ? '展开' : '折叠' }}
      </el-divider>
      <div>
        <div class="search-bar-item" style="max-width: initial;">
          <el-button size="small" type="primary" @click="reloadData">查询</el-button>
          <slot></slot>
          <el-button v-if='permissions.names.export' size="small" type="primary" @click="exportData">导出</el-button>
        </div>
      </div>
    </reportProject>
  </div>
</template>

<script>
  import reportProject from './reportProject'
  export default {
    name: 'SearchBar',
    components: {
      reportProject
    },
    props: {
      thumbnailNumber: {
        type: Number,
        default: () => {
          return null
        }
      },
      formItem: { // 数据对象
        type: Array,
        default: () => {
          return []
        }
      },
      formData: { // 数据对象
        type: Object,
        default: () => {
          return {}
        }
      },
      permissions: {
        type: Object,
        default () {
          return {
            names: {},
            codes: {}
          }
        }
      },
    },
    data() {
      return {
        folding: false, // 是否显示更多
        initialData: {},
        isMobile: false,
        isFolding: true   // 是否折叠筛选框
      };
    },
    //依赖注入传值
    provide() {
      return {
        valDataObject: () => {
          const datas = {
            formItem: this.formItem,
            formData: this.formData
          }
          return datas
        }
      }
    },
    created() {
      this.isMobile = this.globalData.client.isMobile
    },
    methods: {
      // 加载更多
      loadMore() {
        // this.folding = !this.folding
        this.isFolding = !this.isFolding
      },
      // 点击查询按钮
      reloadData() {
        this.isFolding = true
        this.$emit('reloadData')
      },
      //导出
      exportData(){
        this.$emit('exportData')
      },
      // 重置数据
      resetData() {
        const param = this.formData
        Object.keys(param).forEach(key => {
          switch (typeof param[key]) {
            case 'string':
              param[key] = ''
              break
            case 'boolean':
              param[key] = false
              break
            case 'date':
              param[key] = new Date()
              break
            case 'number':
              param[key] = 0
              break
          }
        })
      }
    }
  };
</script>
<style scoped lang="scss">
  .el-divider__text.is-right {
    right: 6px;
  }
  .el-divider--horizontal {
    margin: 12px 0;
  }
  .mask {
    background-color: #000;
    opacity: .3;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }
</style>
