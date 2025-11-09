<!--
 * @Author: tuWei
 * @Date: 2023-03-02 14:02:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-18 16:36:06
-->
<template>
  <el-dialog class="promoter_person"
    :title="(orgType === '0004' ? '人员选择-行政组织' : '人员选择-业务组织') "
    :visible.sync="visible"
    :width="CFG.viewportWidth > 768 ? '650px' : '100%'"
    :modal-append-to-body="false"
    :close-on-click-modal="false">
      <div class="person_body clear" v-if="visible">
          <div class="person_tree l">
              <!-- <input type="text" placeholder="搜索成员" v-model="searchVal" @input="getDebounceData($event)">
              <p class="ellipsis tree_nav" v-if="!searchVal">
                  <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                  <span v-for="(item,index) in departments.titleDepartments" class="ellipsis"
                  :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>
              </p> -->
              <selectBox :scopeType='scopeType' @addResList="addResList" :resultList="resultList" :orgType="orgType" :rendList="checkedUserList" :checkedOrgList="checkedOrgList"/>
          </div>
          <selectResult v-if="CFG.viewportWidth > 76" :total="total" @del="delResultList" @cancelSelect="cancelSelect" :list="resultList"/>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('update:visible',false)" size="small">取 消</el-button>
          <el-button type="primary" @click="saveDialog" size="small">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import selectBox from './selectBox.vue';
import selectResult from './selectResult.vue';

export default {
  components: { selectBox, selectResult },
  // mixins: [mixins], //scopeType 1 表示选择人员 0 表示选择组织;
  // props: ['visible', 'data', 'scopeType', 'orgType'], //isDepartment
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 人员选择数据渲染
    checkedUserList: {
      type: Array,
      default:() =>{ return [] },
    },
    // 组织选择数据渲染
    checkedOrgList:{
      type: Array,
      default:() =>{ return [] },
    },
    // scopeType 2，人员  1 组织和人员， 0组织
    scopeType: {
      type: Number,
      default: 0,
    },
    // 1 行政 2.业务
    orgType: {
      type: String,
      default: '1',
    },
    maxUserNum: {
      type: Number,
      default: 1,
    },
    // 组织选择数据渲染
    rdUserNodes:{
      type: Array,
      default:() =>{ return [] },
    },
    // 用户类型 0-5
    userType: {
      type: Number,
      default: 0,
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = this.visible;
      this.resultList = [];
      if (val && this.userType !== 0) {
        this.resultList = Object.assign(this.resultList, this.rdUserNodes);
      }
    },
  },
  computed: {
    total() {
      return this.resultList.length;
    },
  },
  data() {
    return {
      resultList: []
    }
  },
  methods: {
    addResList(node, isCheck){
      if(isCheck){
        if(!this.resultList.find(v=> v.id === node.id)){
          if(this.resultList.length >= this.maxUserNum){
            this.resultList.shift();
            this.resultList.push(node);
          }else{
            this.resultList.push(node);
          }
        }
      }else{
        this.resultList.forEach((element,index) => {
          if(element.id === node.id){
            this.resultList.splice(index, 1)
          }
        });
      }
    },
    cancelSelect(index){
      this.resultList.splice(index, 1);
    },
    saveDialog() {
      this.$emit('change', this.resultList);
    },
    delResultList() {
      this.resultList = [];
    },

  }
}
</script>

<style lang="scss">
// 与下面重复了，所以注释
// .promoter_person .el-dialog__header {
//     padding: 0 0 0 20px;
//     line-height: 50px;
//     height: 50px;
//     background: #fff;
//     border-bottom: 1px solid #F2F2F2;
// }
.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}
.promoter_person {
    overflow: inherit;
    .el-dialog__header {
      padding: 0 0 0 20px;
      line-height: 50px;
      height: 50px;
      background: #fff;
      border-bottom: 1px solid #F2F2F2;
    }

    .el-dialog__header .el-dialog__title {
        font-size: 16px;
        line-height: 50px;
        color: #333333;
    }

    .el-dialog__header .el-dialog__headerbtn {
        height: 12px;
        width: 12px;
    }

    .el-dialog__header .el-icon-close {
        width: 12px;
        height: 12px;
        float: left;
    }

    .el-dialog__header .el-icon-close::before {
        display: block;
        width: 12px;
        height: 12px;
        /* background: url(~@/assets/images/add-close.png) no-repeat center; */
        background-size: 100% 100%;
        content: "";
    }

    .el-dialog__footer {
        border-top: 1px solid #F2F2F2;
        padding-bottom: 10px;
    }
    .person_body {
      border: 1px solid #f5f5f5;
      height: 400px;
    }
    .tree_nav span {
      display: inline-block;
      padding-right: 10px;
      margin-right: 5px;
      max-width: 6em;
      color: #38adff;
      font-size: 12px;
      cursor: pointer;
      /* background: url(~@/assets/images/jiaojiao.png) no-repeat right center; */
    }
    .tree_nav span:last-of-type {
      background: none;
    }
    .person_tree {
      // padding: 10px 12px 0 8px;
      width: 350px;
      height: 100%;
      border-right: 1px solid #f5f5f5;
    }
    .person_tree input {
      padding-left: 22px;
      width: 280px;
      height: 30px;
      font-size: 12px;
      border-radius: 2px;
      border: 1px solid #d5dadf;
      /* background: url(~@/assets/images/list_search.png) no-repeat 10px center; */
      background-size: 14px 14px;
      margin-bottom: 14px;
    }

    .person_tree img {
        width: 14px;
        vertical-align: middle;
        margin-right: 5px;
    }
    .l {
      float: left;
    }
}

</style>
