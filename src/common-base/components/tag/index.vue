<!--
 * @Author: liwei
 * @Date: 2022-05-11 13:27:21
 * @LastEditTime: 2024-06-13 22:35:32
 * @LastEditors: liwei
 * @Description: 标签选择
 * @FilePath: \lonch-itoc\src\common-base\components\tag\index.vue
-->
<template>
  <div v-loading="loading">
    <div class="flex flex-row-reverse" v-if="tagData.select">
      <el-button class="button-new-tag ml10" size="small" type="primary" @click="saveTagSelect">保存标签</el-button>
      <div>
        <div v-if="inputVisible">
          <el-select size="small" clearable v-model="inputValue" style="width:150px;" class="mr5">
            <el-option label="请选择" value></el-option>
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in tagData.select.options" :key="index"></el-option>
          </el-select>
          <el-button type="text" size="small" @click="handleInputConfirmSelect()">确定</el-button>
          <el-button type="text" size="small" @click="inputVisible = false; inputValue = ''">取消</el-button>
        </div>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
      </div>
    </div>
    <div class="flex flex-row-reverse" v-else>
      <el-button v-if="tagData.batchSubmission && tagData.batchSubmissionBtn" class="button-new-tag ml10" size="small" type="primary" @click="saveTag">批量保存标签</el-button>
      <div v-if="inputVisible">
        <el-input
          v-model.trim="inputValue"
          ref="saveTagInput"
          size="small"
          style="width:150px;"
          class="mr5"
        >
        </el-input>
        <el-button type="text" size="small" @click="handleInputConfirm()">确定</el-button>
        <el-button type="text" size="small" @click="inputVisible = false; inputValue = ''">取消</el-button>
      </div>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
    </div>
    <div class="mt5">
      <template v-if="tagList.length > 0">
        <el-tag
          :key="tag"
          v-for="tag in tagList"
          closable
          class="mr10 mb5"
          :disable-transitions="false"
          @close="handleClose(tag.tagId)">
          {{tag.tagName}}
        </el-tag>
      </template>
      <div v-else>
        暂无标签
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import keepAliveMixin from "@/common-base/mixins/keep-alive";
export default {
  name: "tag",
  mixins: [keepAliveMixin],
  components: {},
  props: {
    permissions: {
      type: Object,
      default: () => {
        return {};
      }
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    meta: { // 元数据信息
      type: Object,
      default: () => {
        return {};
      }
    },
    tag: {  // 标签基本信息
      type: Object,
      default: () => {
        return {};
      }
    },
    option: { // 配置信息
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    // 监听原始数据的变化
    'tagList': {
      deep: true,
      handler: function(newV) {
        this.$emit('tagListChange', newV);
      },
    },
    // 监听参数值改变
    'option': {
      deep: true,
      handler: function() {
        this.initParam();
      },
    }
  },
  data() {
    return {
      loading: false,
      tagData: {}, // 标签数据对象
      tagList: [], // 标签列表
      inputVisible: false, // 输入框显隐状态
      inputValue: '', // 输入框值
    };
  },
  created() {

  },
  mounted() {
    this.initParam();
  },
  methods: {
    /**
     * 初始化参数
    */
    initParam() {
      this.tagData = {
        data: {
          metaId: '', // 元数据ID
          metaType: '', // 元数据类型
          metaName: '', // 元数据名称  必填
          dbType: 'MySQL', // 数据库类型
          dbInstance: 'yunfu-db-01', // 数据库实例
          dbSchema: 'pad_db', // 库
          dbTable: '', // 表    必填
          dbRow: '', // 数据ID   必填
          dbCol: '' // 数据列
        },
        tag: {
          tagId: '', // 标签ID
          tagName: '', // 标签名称
          tagOwnerId: '', // 标签所有者id
          tagOwnerType: '0', // 标签所有者类型
        },
        queryTags: Boolean(this.option.queryTags),  // 默认查询数据
        batchSubmission: Boolean(this.option.batchSubmission), // 是否批量提交数据
        batchSubmissionBtn: Boolean(this.option.batchSubmissionBtn), // 是否批量提交数据按钮
        batchSubmissionRendering: typeof(this.option.batchSubmissionRendering) === 'undefined' ? true : this.option.batchSubmissionRendering, // 批量提交的数据是否重新渲染数据
        select: this.option.select, // 是否使用select 选择标签数据
      };
      // 合并数据
      this.tagData.data = {...this.tagData.data, ...this.meta};
      this.tagData.tag = {...this.tagData.tag, ...this.tag};
      // 默认加载详情，获取标签数据
      if(this.tagData.queryTags) {
        this.getData();
      }
    },
    /**
     * 确认输入内容
     * @param tagName 新增标签的名称
    */
    handleInputConfirm(tagName) {
      let inputValue = tagName || this.inputValue;
      if(inputValue === '') {
        this.$toast({text: '请输入标签内容'});
        return;
      }
      // 如果使用批量提交数据，阻断输入内容后的数据提交
      if(this.tagData.batchSubmission) {
        this.tagList.push({
          tagId: '', // 标签ID
          tagName: inputValue, // 标签名称
          tagOwnerId: this.tagData.tag.tagOwnerId, // 标签所有者id
          tagOwnerType: this.tagData.tag.tagOwnerType, // 标签所有者类型
        });
        this.inputVisible = false;
        this.inputValue = '';
        return;
      }
      let args = JSON.parse(JSON.stringify(this.tagData));
      args.tag.tagName = inputValue;
      this.API.send(this.CFG.services.tag.dataAddTag, args, function (res) {
        this.$toast({text: '操作成功'});
        const list = this.tagList.filter(item => {
          return item.tagId === res.data.tagId;
        });
        if(list.length < 1) {
          this.tagList.push({
            tagId: res.data.tagId, // 标签ID
            tagName: inputValue, // 标签名称
            tagOwnerId: this.tagData.tag.tagOwnerId, // 标签所有者id
            tagOwnerType: this.tagData.tag.tagOwnerType, // 标签所有者类型
          });
        }
        this.tagData.data.metaId = res.data.metadataId;
        this.inputVisible = false;
        this.inputValue = '';
      }, function () {
      }, this);
    },
    /**
     * 确认输入内容 select
    */
    handleInputConfirmSelect() {
      if(this.inputValue === '') {
        this.$toast({text: '请选择需要添加的标签'});
        return;
      }
      const repeat = this.tagList.filter(item => {
        return item.tagId === this.inputValue
      })
      if(repeat.length > 0) {
        this.$toast({text: '标签已存在，请勿重复添加'})
        return;
      }
      const datas = this.tagData.select.options.filter(item => {
        return item.id === this.inputValue
      })
      if(datas.length > 0) {
        this.tagList.push({
          tagId: datas[0].id, // 标签ID
          tagName: datas[0].name, // 标签名称
          tagOwnerId: this.tagData.tag.tagOwnerId, // 标签所有者id
          tagOwnerType: this.tagData.tag.tagOwnerType, // 标签所有者类型
        });
        // this.inputVisible = false;
        this.inputValue = '';
      } else {
        this.$toast({text: '数据发生异常'})
      }
    },
    /**
     * 批量保存标签
    */
    saveTag(_cb) {
      if(!this.tagData.batchSubmission) {
        return;
      }
      // 延迟加载，避免option数据变化时加载时序出错
      this.$nextTick(() => {
        let args = JSON.parse(JSON.stringify(this.tagData));
        const tagListData = this.tagList.filter(item => {
          return item.tagId === '';
        });
        if(tagListData.length < 1) {
          this.$toast({text: '您没有新增标签'});
          return;
        }
        const _args = {
          dataList: [args.data],
          tagList: tagListData
        };
        this.API.send(this.CFG.services.tag.dataBatchAddTags, _args, function () {
          this.$toast({text: '操作成功'});
          // 重新渲染数据
          if(this.tagData.batchSubmissionRendering) {
            this.getData();
          }
          if (typeof _cb === 'function') {
            _cb.call();
          }
        }, function () {
        }, this);
      });
    },
    /**
     * 批量保存标签
    */
    saveTagSelect(_cb) {
      if(!this.tagData.batchSubmission) {
        return;
      }
      // 延迟加载，避免option数据变化时加载时序出错
      this.$nextTick(() => {
        let args = JSON.parse(JSON.stringify(this.tagData));
        if(this.tagList.length < 1) {
          this.$toast({text: '您没有新增标签'});
          return;
        }
        const _args = {
          dataList: [args.data],
          tagList: this.tagList
        };
        this.API.send(this.CFG.services.tag.dataBatchAddTags, _args, function () {
          this.$toast({text: '操作成功'});
          this.$emit('saveSuccess')
          // 重新渲染数据
          if(this.tagData.batchSubmissionRendering) {
            this.getData();
          }
          if (typeof _cb === 'function') {
            _cb.call();
          }
        }, function () {
        }, this);
      });
    },
    /**
     * 删除标签
     * @param tagId 标签id
    */
    handleClose(tagId) {
      this.API.send(this.CFG.services.tag.dataRemoveTag, {data: this.tagData.data, tagId: tagId}, function () {
        this.$toast({text: '删除成功'});
        this.tagList = this.tagList.filter(item => {
          return item.tagId !== tagId;
        });
      }, function () {
      }, this);
    },
    /**
     * 显示输入框
    */
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        if(typeof(this.$refs.saveTagInput) !== 'undefined') {
          this.$refs.saveTagInput.$refs.input.focus();
        }
      });
    },
    /**
     * 获取详情数据
     * @param args 查询条件
    */
   getData(args = {data: this.tagData.data}) {
    this.loading = true;
     this.API.send(this.CFG.services.tag.dataQueryTags, args, function (res) {
        const list = res.data.list,
              tagList = [];
        // 格式化数据
        list.filter(item => {
          tagList.push({
            tagId: item.id, // 标签ID
            tagName: item.name, // 标签名称
            tagOwnerId: this.tagData.tag.tagOwnerId, // 标签所有者id
            tagOwnerType: this.tagData.tag.tagOwnerType, // 标签所有者类型
          });
        });
        this.tagList = tagList;
        this.loading = false;
      }, function () {
      }, this);
   }
  },
};
</script>
