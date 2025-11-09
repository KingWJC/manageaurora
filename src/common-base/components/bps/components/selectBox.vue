<!-- eslint-disable vue/no-template-key -->
<!--
 * @Date: 2022-08-26 17:18:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-18 16:36:45
 * @FilePath: /Workflow/src/components/selectBox.vue
-->
<template>
  <div class="bps-select-persion-box">
    <!-- scopeType 2，人员  1 组织和人员， 0组织 -->
    <el-tabs v-if="scopeType === 1" v-model="active" @tab-click="handleClick">
      <el-tab-pane label="按组织" :name=1></el-tab-pane>
      <el-tab-pane label="按人员" :name=2></el-tab-pane>
    </el-tabs>

    <!-- 组织 -->
    <div v-show="scopeType < 2 && active === 1">
      <div class="flex">
      <el-input v-if="scopeType===1 || scopeType===0" ref="treeInput" v-model.trim="queryName"
        placeholder="请输入名称" @input="typeQueryName" size="mini" class="tac"></el-input>
        <el-button v-if="scopeType===1 || scopeType===0" type="primary" class="pl5 pr5 power-minw55 fs-12 power-h30"
        size="mini" @click="queryNameClick">确 定</el-button>
      </div>

      <div v-show="isShowQueryList" class="personnelList" :style="{height:gridHeight}">
        <ul v-if="personnelArr.length > 0">
          <li v-for="item in personnelArr" :key="item.id" class="p5"
            @click="onCheckChange(item,true)">
            <el-popover placement="top-start" trigger="hover">
              <div slot="reference">
                <div class="flex">
                  <img :src="iconPeople">
                  <span>{{item.name}}</span>
                </div>
                <p class="mt5 department">部门：{{item.orgNameArr[0]?item.orgNameArr[0]:""}}</p>
              </div>
              <div v-for="(ele,index) in item.orgNameArr" :key="index" class="pt5"> {{ele}} </div>
            </el-popover>
          </li>

        </ul>
        <div v-else class="tac">
          暂无数据
        </div>
      </div>
      <!-- 行政 -->
      <div class="tree-box" v-if="orgType === '0004' && !isShowQueryList"
        :style="{height:gridHeight}">
        <el-tree ref="tree" lazy show-checkbox empty-text='暂无数据' :props="{
            children: 'children',
            label: 'name',
            isLeaf: 'isLeaf'
          }" :load="loadCaOrgData" :default-expanded-keys.sync="defaultExpanded"
          :default-checked-keys.sync="defaultList" node-key="keyId" :check-strictly="true"
          @check-change="(data, checked) => onCheckChange(data, checked)">
        </el-tree>
      </div>

      <!-- 业务 -->
      <div class="tree-box" v-if="orgType === '0002' && !isShowQueryList"
        :style="{height:gridHeight}">
        <el-tree ref="tree" lazy show-checkbox empty-text='暂无数据' :props="{
            children: 'children',
            label: 'name',
            isLeaf: 'isLeaf'
          }" :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultList"
          :load="loadBusinessData" node-key="keyId" :check-strictly="true"
          @check-change="(data, checked) => onCheckChange(data, checked)">
        </el-tree>
      </div>
    </div>

    <!-- 按人员 scopeType > 0-->
    <div v-if="(scopeType === 1 && active === 2) || scopeType === 2" class="select-box">
      <ul class="pl10">
        <template v-for="(data, index) in rendList">
          <li :key="index" style="cursor: pointer">
            <el-checkbox :value="data.isCheck" :checked="data.isCheck"
              @change="onCheckPerson(data)">
              <img class="ml5" :src="iconPeople">
              <span>{{data.name}}</span>
            </el-checkbox>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>

import { commonUrl } from "./dit.js"

export default {
  data () {
    return {
      originalYwArr: [], // 业务组织数据缓存
      originalXzArr: [], // 行政组织数据缓存
      defaultExpanded: [], // 默认展开节点
      active: 1, // 1按组织 2按人员
      orgList: [],
      defaultList: [],
      templteUserDate: [],
      queryName: '',//根据名字查询
      queryTime: null,
      personnelArr: [],//查询出来人员数组
      treeArr: [],
      gridHeight: 342,
      isShowQueryList: false,
      businessTree: [],
      loadCaOrgTree: [],
      iconPeople: require("@/common-base/accsets/images/icon_people.png"),
    }
  },
  watch: {
    resultList () {
      this.initEcho();
    },
  },
  computed: {
  },
  props: {
    // scopeType 2，人员  1 组织和人员， 0组织
    scopeType: {
      type: Number,
      default: 1
    },
    // 0004 行政 0002.业务
    orgType: {
      type: String
    },
    // 回显选择的数据
    resultList: {
      type: Array,
      default () {
        return []
      }
    },
    rendList: {
      type: Array,
      default () {
        return []
      }
    },
    checkedOrgList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    this.initEcho();
    if (this.scopeType < 2 && this.active === 1) {
      this.gridHeight = 380 - this.$refs.treeInput.$el.offsetHeight + "px"
    }
  },
  methods: {

    initEcho () {
      if (this.scopeType < 2 && this.active === 1) {
        this.echoCheckOrg();
      } else if ((this.scopeType === 1 && this.active === 2) || this.scopeType === 2) {
        this.echoCheckPerson();
      }
    },
    //业务组织
    loadBusinessData (node, resolve) {
      let args = { humanType: 2 }
      if (this.originalYwArr.length > 0) {
        if (node.data && node.data.children == null) {
          node.data.children = [];
        }
        this.getYwChildNode(node, resolve)
      } else {
        this.API.send(commonUrl.selectBusinessDepartment, args, function (res) {
          res = res.serviceResult;
          if (res && res.length > 0) {
            res.forEach(i => {
              i.keyId = i.id;
            });
            this.originalYwArr = res;
            let treeData = this.utils.array2tree(res, 'id', 'parentId');
            // this.defaultExpanded = [treeData[0].id]
            if (this.scopeType < 2 && this.checkedOrgList.length > 0) {
              this.orgList = [];
              this.deepTree(treeData[0]);
              this.defaultExpanded = [this.orgList.map(v => v.id)];
              this.businessTree = [...this.orgList]
              resolve(this.orgList);
            } else {
              this.defaultExpanded = [treeData[0].id]
              this.businessTree = [...treeData]
              resolve(treeData);
            }

          }
        }, function () {
        }, this)
      }
    },

    // 根据业务部门查询人员
    getYwChildNode (node, resolve) {
      this.API.send(commonUrl.selectYWHumanByDepartmentId, { id: node.data.id }, function (res) {
        res = res.serviceResult;
        res.forEach(i => {
          i.parentId = node.data.id;
          i.isLeaf = true;
          i.id = i.humanId;
          i.keyId = i.humanId + '-' + node.data.id;
        });
        if (res && res.length > 0) {
          if (node.data.children == null) {
            node.data.children = [];
          }
          if (Array.isArray(node.data.children)) {
            node.data.children.push(...res);
            this.templteUserDate.push(...res);
            this.initEcho();
            resolve(node.data.children);
          }
        } else {
          try {
            resolve([{}]);
            resolve();
          } catch (e) {
            // console.log(e);
          }
        }
      }, function () {
      }, this)
    },

    //行政组织树
    loadCaOrgData (node, resolve) {
      let args = { orgType: "0002" };
      if (this.originalXzArr.length > 0) {
        if (node.data && node.data.children == null) {
          node.data.children = [];
        }
        this.getXzChildNode(node, resolve)
      } else {
        this.API.send(commonUrl.selectCaOrgAdministrationByCode, args, function (res) {
          res = res.serviceResult;
          if (res && res.length > 0) {
            res.forEach(i => {
              i.keyId = i.id;
            });
            this.originalXzArr = res;
            let treeData = this.utils.array2tree(res, 'id', 'parentId');
            // scopeType 2，人员  1 组织和人员， 0组织
            if (this.scopeType < 2 && this.checkedOrgList.length > 0) {
              this.orgList = [];
              this.deepTree(treeData[0]);
              this.defaultExpanded = [this.orgList.map(v => v.id)];
              this.loadCaOrgTree = [...this.orgList]
              resolve(this.orgList);
            } else {
              this.defaultExpanded = [treeData[0].id];
              this.loadCaOrgTree = [...treeData]
              resolve(treeData);
            }


          }
        }, function () {
        }, this)
      }
    },

    echoCheckOrg () {

      let dearr = this.resultList.map((v) => {
        if (v.id) {
          return v.id;
        }
      });
      let arr = [];
      dearr.forEach((aid) => {
        this.templteUserDate.forEach((user) => {
          if (user.id === aid) {
            arr.push(user.keyId);
          }
        })
      })
      if (arr.length === 0) {
        this.$refs.tree.setCheckedKeys([]);
      }
      if (arr.length > 0) {
        this.$refs.tree.setCheckedKeys(Array.from(new Set(arr)));
      }
    },
    // 根据行政组织树查询人员
    getXzChildNode (node, resolve) {
      if (!node.data) {
        return
      }
      this.API.send(commonUrl.selectXZHumanByDepartmentId, { id: node.data.id }, function (res) {
        res = res.serviceResult;
        res.forEach(i => {
          i.parentId = node.data.id;
          i.isLeaf = true;
          i.id = i.caHuman;
          i.keyId = i.caHuman + '-' + node.data.id;
        });
        if (res && res.length > 0) {
          if (node.data.children == null) {
            node.data.children = [];
          }
          if (Array.isArray(node.data.children)) {
            node.data.children.push(...res);
            this.templteUserDate.push(...res);
            this.initEcho();
            resolve(node.data.children);
          }
        } else {
          if (node.data.children.length > 0) {
            resolve(node.data.children);
          } else {
            try {
              resolve(null);
              resolve(null);
              // eslint-disable-next-line no-empty
            } catch (e) { }
          }
        }
        // this.originalArr = res;
      }, function () {
      }, this)
    },

    //回显下拉选
    echoCheckPerson () {
      this.rendList.forEach((item, index) => {
        if (this.resultList.map(v => v.id).indexOf(item.id) !== -1) {
          item.isCheck = true;
          this.$set(this.rendList, index, item)
        } else {
          item.isCheck = false;
          this.$set(this.rendList, index, item)
        }
      })
    },

    //勾选人员、组织
    onCheckChange (node, isCheck) {
      this.$emit('addResList', node, isCheck);
      this.initEcho();
    },

    //勾选人员
    onCheckPerson (node) {
      node.isCheck = !node.isCheck;
      this.$emit('addResList', node, node.isCheck);
      this.$toast({
        text: '添加成功'
      });
      this.initEcho();
    },
    //切换tab
    handleClick () {
      // this.originalXzArr = [];
      // this.originalYwArr = [];
      this.initEcho();
    },
    getDefaultCheck () {
      if (this.resultList && this.resultList.length > 0) {
        return this.resultList.map((v) => {
          if (v.id) {
            return v.id;
          }
        });
      } else {
        return []
      }
    },
    // 获取父节点 获取当前节点是否在指定组织下
    getParseNode (pid) {
      let prevNode = null;
      if (this.orgType === '0002') {
        prevNode = this.originalXzArr.find(v => v.id === pid);
      } else if (this.orgType === '0004') {
        prevNode = this.originalYwArr.find(v => v.id === pid);
      }
      if (prevNode && this.checkedOrgList.indexOf(prevNode.id) !== -1) {
        return false;
      } else if (prevNode && prevNode.parentId) {
        return this.getParseNode(prevNode.parentId);
      }
      return true;
    },

    // 递归处理 组织过滤数据
    deepTree (root) {
      if (this.checkedOrgList.indexOf(root.id) !== -1) {
        if (root.parentId && this.getParseNode(root.parentId)) {
          this.orgList.push(root);
        }
        if (!root.parentId) {
          this.orgList.push(root);
        }
      } else if (root.children && root.children.length) {
        root.children.forEach((child) => {
          this.deepTree(child)
        });
      }
    },
    queryNameClick(){
      this.selectHumanOrganizationByNameAndOrgTypelog(this.queryName)
    },
    typeQueryName (name) {
      if (!name) {
        this.isShowQueryList = false
      }

      // clearTimeout(this.queryTime)
      // this.$refs.treeInput.$el.firstElementChild.blur()
      // this.queryTime = null
      // this.queryTime = setTimeout(() => {
      //   // selectHumanOrganizationByNameAndOrgTypelog
      //   this.selectHumanOrganizationByNameAndOrgTypelog(name)
      //   // console.log(text);
      //   // console.log(this.originalXzArr);
      // }, 1000)
    },
    
    selectHumanOrganizationByNameAndOrgTypelog (name) {
      // console.log(this.originalXzArr);
      // console.log(this.originalYwArr);

      let args = {
        name,
        orgType: this.orgType
      }
      this.API.send(commonUrl.selectHumanOrganizationByNameAndOrgTypelog, args, function (res) {
        // console.log(res.data)
        let data = res.data;
        let arr = data.filter((ele) => {//循环人员列表
          let that = this;
          let tree = []
          ele.isLeaf = true;//设置人员状态
          if (this.orgType === '0004') {//行政
            tree = this.loadCaOrgTree
          } else if (this.orgType === '0002') {
            tree = this.businessTree
          }
          if (Array.isArray(ele.orgIds) && ele.orgIds.length > 0) {
            let orgIds = ele.orgIds;//拿到人员组织类型数组

            orgIds.forEach((id) => {//查询到组织中文名称
              if (!ele.orgNameArr) {
                ele.orgNameArr = []
              }
              let name = that.findParents(tree, id).join('/')
              if (name) {
                ele.orgNameArr.push(name)
              }
            })
          }
          if (ele.orgNameArr.length > 0) {
            return ele
          }
        })
        // console.log(arr);
        this.personnelArr = arr;
        // console.log(this.personnelArr);
        this.isShowQueryList = true;
      }, function () {
      }, this)
    },
    //查询父节点
    findParents (array, id) {
      let parentArray = [];

      if (array.length === 0) {
        return parentArray;
      }

      function recursion (arrayNew, id) {
        for (let i = 0; i < arrayNew.length; i++) {
          let node = arrayNew[i];
          if (node.id === id) {
            parentArray.unshift(node.name);
            recursion(array, node.parentId);
            break;
          } else {
            if (Array.isArray(node.children)) {
              recursion(node.children, id);
            }
          }
        }
        return parentArray;
      }
      let arrayNew = array;
      parentArray = recursion(arrayNew, id);
      return parentArray;
    },
  }

}
</script>

<style lang="scss">
.bps-select-persion-box {
  .tree-box {
    height: 380px;
    overflow: auto;
  }

  .el-tree-node > .el-tree-node__children {
    overflow: inherit !important;
  }

  .el-tree .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }

  .el-tree .el-tree-node .el-checkbox .el-checkbox__inner {
    display: none;
  }

  .el-tree .el-tree-node .el-tree-node {
    .is-leaf + .el-checkbox .el-checkbox__inner {
      display: inline-block;
    }

    .el-checkbox .el-checkbox__inner {
      display: none;
    }
  }

  .select-box {
    height: 360px;
    overflow-y: auto;

    li {
      padding: 5px 0;
      list-style: none;
      i {
        float: right;
        padding-left: 24px;
        padding-right: 10px;
        color: #3195f8;
        font-size: 12px;
        cursor: pointer;
        // background: url(~@/assets/images/next_level_active.png) no-repeat 10px center;
        border-left: 1px solid rgb(238, 238, 238);
      }

      a.active + i {
        color: rgb(197, 197, 197);
        // background-image: url(~@/assets/images/next_level.png);
        pointer-events: none;
      }

      img {
        display: inline-block;
        width: 14px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
  .personnelList {
    overflow-y: auto;
    ul {
      overflow-y: auto;

      li {
        cursor: pointer;
        list-style: none;
        margin: 11px 26px 13px 19px;
        line-height: 17px;
        border-bottom: 1px solid #ccc;
        &:hover {
          background: #ccc;
        }
        span {
          vertical-align: middle;
        }
        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #999;
        }
        img {
          // &:first-of-type {
          //   width: 14px;
          //   vertical-align: middle;
          //   margin-right: 5px;
          // }

          &:last-of-type {
            margin-top: 2px;
            width: 14px;
          }
        }
      }
    }
  }
}
</style>
