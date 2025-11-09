<!--
 * @Author: tuWei
 * @Date: 2023-03-14 10:25:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-18 16:36:23
-->
<template>
  <div class="pb10 card card-shadow bps-container mb35">
    <div class="viewport-footer viewport-footer-padded flex flex-column flex-content-center">
        <!-- 底部按钮 -->
        <div class="flex flex-content-center" >
          <!-- 发起审核  -->
          <template v-if="params.bpsType === 'commit'">
            <button class="btn btn-primary btn-xl mr20"
              :disabled="suBdisabled"
              :class="suBdisabled ? 'btn-disabled' : '' "
              @click="submitProcess()"
            >提交</button>
            <slot name="footer-btns"></slot>
          </template>
          <template v-if="params.bpsType === 'approve'">
            <div class="tac flex pt5 pb5 ofa">
              <button @click="showOperate(btn)" v-for="btn in oprTypes" :key="btn" class="btn btn-xl mr20 inline-block" :class="btn === 103 ? 'btn-primary': '' " native-type="submit" >{{getOprTypesName(btn)}}</button>
            </div>
          </template>
        </div>
    </div>
    <div class="card-body">
      <div class="card-header">
        <h4 class="inline">审批流程</h4>
        <span class="blue" v-if="params.bpsType === 'approve' && processInfo && processInfo.state !== 100">({{getApproveStateName(processInfo.state)}})</span>
      </div>
      <!-- 发起人审批模版 -->
      <div v-if="params.bpsType === 'commit'">
        <div class="m20" v-if="itemsList.length">
          <el-timeline>
            <el-timeline-item
              v-for="(node, index) in itemsList"
              :key="index"
              :hide-timestamp="true"
              :icon="node.icon"
              :type="node.type"
              :color="node.color"
              :size="node.size"
              :timestamp="node.timestamp">
              <div>
                <div>
                  {{node.name}}<span class="red">*</span>
                  <span class="blue fs-sm ml10" v-if="node.rdUserNodes.length">{{getApprovalWayType(node.approvalWayType)}} </span>
                </div>
                <!-- 指定成员节点 -->
                <div v-if="node.userType === 1 || node.userType === 3 ">
                  <ItemUser :node="node" :type="1"/>
                </div>
                <!-- 发起人自选节点 -->
                <div class="flex" v-if="node.userType === 2 || node.userType === 0 || node.userType === 4 || node.userType === 5">
                    <ItemUser :node="node" :type="1"/>
                    <div class="pointer mt10" v-if="node.userIds.length !== node.maxUserNum">
                      <i class="el-icon-plus p10 span-icon-i" @click="selectUser(node)"></i>
                    </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="m20" v-else>
          无符合条件流程
        </div>
      </div>

      <!-- 审核模版 -->
      <div v-if="params.bpsType === 'approve'">
        <div class="m20">
          <el-timeline v-if="recordsList.length">
            <el-timeline-item
              v-for="(node, index) in recordsList"
              :key="index"
              :hide-timestamp="true"
              :icon="node.icon"
              :type="node.type"
              :color="node.color"
              :size="node.size"
              :timestamp="node.timestamp">
              <ItemUser :node="node" :type="2"/>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <el-dialog
      :title="getOprTypesName(approveForm.oprType)"
      :visible.sync="approveVisible"
      width="650px"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <formView :formConfig='formConfig' :oss='oss' ref="form"></formView>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approveVisible = false" size="small">关闭</el-button>
        <el-button type="primary" @click="submitOperate" size="small">确定</el-button>
      </span>
    </el-dialog>

    <employees-dialog
        :visible.sync="visibleDialog"
        :checkedUserList.sync="checkedUserList"
        :checkedOrgList.sync="checkedOrgList"
        :orgType="activeNode.orgType"
        :rdUserNodes="activeNode.rdUserNodes"
        :scopeType='scopeType'
        :userType="activeNode.userType"
        @change="sureApprover"
        :maxUserNum="activeNode.maxUserNum"
    />

  </div>
</template>

<script type="text/ecmascript-6">
import formView from '@/common-base/components/pubComponents/form';
import { getApprovalWayType, tmpNodeDefaut, commonUrl, getOprTypesName, getApproveStateName, approveForm } from "./components/dit.js"
import { selectHumanLeaderslog, selectHumanLeaderlog,  arrToStr, getOrgType, getRollbackNodeList, getUsersInfo } from "./components/utils.js"
import ItemUser from "./components/item-user.vue"
import employeesDialog from "./components/employeesDialog"

export default {
  name: 'AuthenticatedAsSalesman',
  components: { employeesDialog, ItemUser , formView},
  props: {
    /**
     * 参数解析
     * bpsId 业务流程id
     * bpsType 模版对应的类型
     *    'commit'： 发起提交
     *    'approve'： 审批
     *    'view'：查看
     */
    params: {
      type: Object,
      default: () => {}
    },
    // saveHandler: {
    //   type: Array,
    //   default: () => {}
    // }
  },
  data() {
    return {
      oss: Object.assign({basePath: 'bi', dirName: '/workflow/operate'}, this.OSSCFG),
      suBdisabled: false,
      form: {
        processSubmitInfo: {
        },
      },
      itemsList: [],
      originalSend: null,
      dictUserInfo: [],
      resultList: [],
      checkedUserList: [],
      checkedOrgList: [],
      visibleDialog: false,
      getApprovalWayType,
      getOprTypesName,
      getApproveStateName,
      tmpNodeDefaut,
      activeNode: {},
      processInfo: {}, //审批流对象
      oprTypes: [], // 操作按钮集合
      recordsList: [], // 审批记录
      approveVisible: false,
      approveForm: Object.assign({}, approveForm),
      formConfig: [],
      // submitProcess: null,
      // 表单配置
      formInfo: {},
    }
  },
  created() {
    // this.submitProcess = this.logonCommitFn(this.saveHandler);
  },
  mounted() {
    if(this.params.bpsType === 'commit'){
      this.getPreSubmit(this.params.bpsId);
    }else if(this.params.bpsType === 'approve'){
      this.getInstanceDetails();
    }
    // this.initFormConfig();
  },
  methods: {
    submitProcess(){
      this.originalSend = this.API.send;
      try{
        this.API.send = (service, demand, success, error, context, isNoLoading)=>{
          // 处理数据
          if(!this.handleSubmitData()){
            this.$message({
              type: 'error',
              message: '审批节点配置错误',
            });
            return;
          }
          this.originalSend(service, demand, this.bpsCommitCallback || success, error, context, isNoLoading);
        };
        this.$emit('saveHandler');
      }catch{
        this.API.send = this.originalSend;
      }finally{
        this.API.send = this.originalSend;
      }
    },
    // 初始化审核配置
    initFormConfig(){
      this.formConfig = [
        {
          label: '签署之前加签', id: 'isAddSignBefore', required: true, type: 'radio', mWidth: '100px',  rows: 2, maxlength: 500, placeholder: '请选择是否签署之前加签', lg: 24, xl: 24,md: 24, model: this.approveForm,
          hide: ()=>{
            return this.approveForm.oprType !== 107 || this.processInfo.pendingUserIds.length > 1
          },
          options: [
            { c: 1, n: '是' },
            { c: 0, n: '否' },
          ]
        },
        {
          label: '加签人', id: 'addSignUserName', required: true, type: 'text-btn', disabled: true, showAdd: true, mWidth: '100px', rows: 2, maxlength: 500, placeholder: '请添加加签人', lg: 24, xl: 24,md: 24, model: this.approveForm,
          hide: ()=>{
            return this.approveForm.oprType !== 107
          },
          click: async ()=>{
            // 仅组织
            let orgId = await getOrgType.bind(this, this.processInfo.oprTokenId)();
            this.activeNode.orgType = orgId;
            this.activeNode.rdUserNodes = [];
            this.activeNode.maxUserNum = 5;
            this.scopeType = 0;
            this.checkedOrgList = [];
            this.visibleDialog = true;
          },
        },
        {
          label: '转交人', id: 'transferUserName', required: true, type: 'text-btn', disabled: true, showAdd: true, mWidth: '100px', rows: 2, maxlength: 500, placeholder: '请添加转交人', lg: 24, xl: 24,md: 24, model: this.approveForm,
          hide: ()=>{
            return this.approveForm.oprType !== 106
          },
          click: async ()=>{
            // 仅组织
            let orgId =  await getOrgType.bind(this, this.processInfo.oprTokenId)();
            this.activeNode.orgType = orgId;
            this.activeNode.rdUserNodes = [];
            this.activeNode.maxUserNum = 1;
            this.scopeType = 0;
            this.checkedOrgList = [];
            this.visibleDialog = true;
          },
        },
        {
          label: '回退节点', id: 'rollbackToNodeId', required: true, type: 'select', mWidth: '100px', maxlength: 500, placeholder: '请选择回退节点', lg: 24, xl: 24,md: 24, model: this.approveForm,
          hide: ()=>{
            return this.approveForm.oprType !== 104
          },
          change: (val, conf, from)=>{
            from.rollbackToNodeName = conf.options.find(v=> v.c === val) ? conf.options.find(v=> v.c === val).n : '';
          },
          options: []
        },
        { label: '备注', id: 'remark', required: false, type: 'textarea', mWidth: '100px', rows: 3, maxlength: 500, placeholder: '请填写备注', lg: 24, xl: 24,md: 24, model: this.approveForm, },
        // { label: '图片', type: 'file', id: 'pictures', mWidth: '100px', fileSrcKey: 'url', fileNameKey: 'name', accept: 'image/*', placeholder: '请上传图片', lg: 24, xl: 24,md: 24,
        //   isEdit: true, multiple: false, model: this.approveForm,
        // },
        { required: this.processInfo && this.processInfo.isNeedSign === '1', label: '签字', type: 'signature', id: 'pictures', mWidth: '100px', fileSrcKey: 'url', fileNameKey: 'name', accept: 'image/*', placeholder: '请签字', lg: 24, xl: 24,md: 24,
          isEdit: true, multiple: false, model: this.approveForm,
        },
        { label: '附件', type: 'file', id: 'attachment', mWidth: '100px', fileSrcKey: 'url', fileNameKey: 'name',  accept:'application/*', placeholder: '请上传附件', lg: 24, xl: 24,md: 24,
          isEdit: true, multiple: false, model: this.approveForm,
        },
      ]
    },
    // 获取流程信息
    getInstanceDetails(){
      if(!this.params.bpsId){
        return
      }
      let args = {
        id: this.params.bpsId,
      }
      this.API.send(commonUrl.instanceDetails, args, function (res) {
        res = res.serviceResult;
        this.formInfo = res.formInfo || {};
        this.processInfo = res.processInfo;
        this.oprTypes = res.processInfo.oprTypes;
        this.recordsList = [];
        // 历史节点记录
        if(this.processInfo.records){
          res.processInfo.records.forEach((red)=>{
            red.createTime = this.utils.formatDate(red.createTime);
            Object.assign(this.tmpNodeDefaut, red);
            red.rdUserNodes = []
            let user = res.processInfo.dictUserInfo.find(v=>v.id === red.oprUserId);
            if(red.oprType === 106 || red.oprType === 107){
              if(red.exAttribute && red.exAttribute.tagUserIds){
                red.exAttribute.rdUserNodes = [];
                red.exAttribute.tagUserIds.forEach((uid)=>{
                  let exuUser = res.processInfo.dictUserInfo.find(v=>v.id === uid);
                  red.exAttribute.rdUserNodes.push(exuUser);
                });
              }
            }
            if(red.oprType === 105){
              if(red.exAttribute && red.exAttribute.tagUserIds){
                 red.exAttribute.tagUserIds.forEach((uid)=>{
                  let exuUser = res.processInfo.dictUserInfo.find(v=>v.id === uid);
                  red.rdUserNodes.push(exuUser);
                });
              }
            }
            if(user){
              red.rdUserNodes.push(user);
            }
            this.recordsList.push(red);
          });
        }
        // 处理审批人
        if(this.processInfo.pendingUserIds){
          let obj = {
            rdUserNodes: [],
            oprType: 999,
            state: '审批中'
          }
          res.processInfo.pendingUserIds.forEach((id)=>{
            Object.assign(this.tmpNodeDefaut, obj);
            let user = res.processInfo.dictUserInfo.find(v=>v.id === id);
            obj.rdUserNodes.push(user);
          })
          this.recordsList.push(obj);
        }
        // 生成表单
        this.initFormConfig();
      }, function () {
      }, this);
    },
    // 操作节点
    async showOperate(oprType){
      this.approveForm = Object.assign(this.approveForm, approveForm);
      this.approveForm.attachment = [];
      this.approveForm.pictures = [];
      this.approveForm.oprType = oprType;
      if(oprType === 107){
        this.approveForm.isAddSignBefore = 0;
        this.approveForm.addSignUserName = '';
        this.approveForm.addSignUserIds = [];
      }
      if(oprType === 104){
        let options = await getRollbackNodeList.bind(this, this.processInfo.id)();
        if(!options.length){
          this.$message({
            type: 'info',
            message: '暂不存在回退节点',
          });
          return false
        }
        this.formConfig.forEach((conf)=>{
          if(conf.id === 'rollbackToNodeId'){
            conf.options = options.map((v)=>{
              return {
                ...v,
                c: v.nodeId,
                n: v.nodeName
              }
            })
          }
        })
      }
      this.approveVisible = true;
    },
    isMustKeys() {
      return this.$refs.form.isFormMustKey();
    },
    // 保存操作
    submitOperate(){
      if(!this.isMustKeys()){
        return
      }
      let args = {
        oprTokenId: this.processInfo.oprTokenId,
        processInstanceId: this.processInfo.id,
        ...this.approveForm
      }
      this.API.send(commonUrl.approvalOperate, args, (res)=> {
        // res = res.serviceResult;
        this.approveVisible = false;
        this.getInstanceDetails();
        // console.log(res);
        // 优氧协议弹出是否要在线收款
        this.oxygenSubmitNext();        
      }, ()=> {
        this.approveVisible = false;
        this.getInstanceDetails();
      }, this)
    },
    /**
     * 优氧协议
     * @param id 
     */
    oxygenSubmitNext() {
      if(this.approveForm.oprType === 103) {

        if(['EC_OX_MASS_SUB_APPLY', 'EC_OX_MASS_APPLY'].includes(this.formInfo.code)) {
          this.$confirm({
            title: '提示',
            text: `是否已付款？`,
            buttons: [
              {
                text: '已付款',
                type: 'follow'
              },
              {
                text: '未付款',
                type: 'primary',
                callback: () => {
                  this.$nextTick(() => {
                    this.$confirm({
                      title: '提示',
                      text: `是否发起在线付款？`,
                      buttons: [
                        {
                          text: '否',
                          type: 'follow'
                        },
                        {
                          text: '去付款',
                          type: 'primary',
                          callback: () => {
                            /**
                             * 跳转在线收款
                             */
                            LonchJsApi.openUrl({
                              originName: 'manage',
                              routePath:'/onlinePay',
                              query: {
                                moduleCode: '567936',
                                isback: 'true',
                                appName: 'manage'
                              }
                            });
                          }
                        }
                      ]
                    })
                  });
                }
              }
            ]
          })
        }
      }
    },
    // 预提交数据获取
    getPreSubmit(id){
      this.API.send(commonUrl.bizProcessPreSubmit, { id }, function (res) {
        res = res.serviceResult;
        this.itemsList = [];
        this.dictUserInfo = res.processInfo.dictUserInfo;
        // 提交form对象
        this.form.bizProcessImgId = res.bizProcessImgId;
        this.form.processSubmitInfo = {
          items: [],
          name: res.bizProcessName,
          processId: res.processInfo.processId,
          processImgId: res.processInfo.processImgId,
          processReleaseVersion: res.processInfo.processReleaseVersion,
          remark: res.processInfo.remark,
        }
        // 处理 模版渲染itemsList数据
        if(res.processInfo && res.processInfo.items && res.processInfo.items.length > 0){
          res.processInfo.items.forEach(async (ele)=>{
            Object.assign(ele, this.tmpNodeDefaut);
            this.itemsList.push(ele);
            ele.rdUserNodes = [];
            //处理指定人员
            if(ele.userType === 1 || ele.userType === 3){
              ele.userIds.forEach((uId)=>{
                ele.rdUserNodes.push(this.dictUserInfo.find(v=> v.id === uId ));
              })
            } else if(ele.userType === 2){
              ele.checkedUserList = [];
              ele.userIds.forEach((uId)=>{
                let findOne = this.dictUserInfo.find(v=> v.id === uId )
                if(findOne){
                  // findOne.isCheck = false;
                  ele.checkedUserList.push(findOne);
                }
              });
            } else if(ele.userType === 4){
              let levelArr = await selectHumanLeaderslog.bind(this)();
              if(levelArr && levelArr.length > 0){
                ele.userIds = levelArr.map(v=> v.id);
                ele.checkedUserList = [...levelArr];
              }
            } else if(ele.userType === 5){
              let level = await selectHumanLeaderlog.bind(this)();
              if(level){
                ele.userIds = [level.id];
                ele.rdUserNodes = [level];
              }
            } else if(ele.userType === 0){
              ele.checkedUserList = [];
              ele.userIds.forEach((uId)=>{
                ele.rdUserNodes.push(this.dictUserInfo.find(v=> v.id === uId ));
              })
            }
          });
        } else{
          this.suBdisabled = true;
          this.itemsList = [];
        }
        // 生成表单
        this.initFormConfig();
      }, function () {
      }, this)
    },

    // 打开人员选择
    selectUser(node){
      this.activeNode = node;
      if(node.userType === 0){ // 抄送人
        this.scopeType = 0; // 仅组织
        this.checkedOrgList = node.orgIds;
      }
      else if(node.userIds.length > 0 && node.orgIds.length > 0){
        this.checkedUserList = node.checkedUserList;
        this.checkedOrgList = node.orgIds;
        this.scopeType = 1; // 人员和组织
      } else if(node.userIds.length > 0 && node.orgIds.length === 0){
        this.checkedUserList = node.checkedUserList;
        this.scopeType = 2; // 仅人员
      } else if(node.userIds.length === 0 && node.orgIds.length > 0){
        this.scopeType = 0; // 仅组织
        this.checkedOrgList = node.orgIds;
      } else if(node.userIds.length === 0 || node.orgIds.length === 0){
        this.scopeType = 0; // 仅组织
        this.checkedOrgList = [];
      }
      this.visibleDialog = true;
    },

    // 保存人人员选择
    async sureApprover(data){
      let users = [];
      if(this.activeNode.rdUserNodes.length >= this.activeNode.maxUserNum){
        this.$message({
          type: 'info',
          message: `当前节点人数不能超过${this.activeNode.maxUserNum}人`,
        });
        this.visibleDialog = false;
        return;
      }
      let ids = data.map((v)=>v.id);
      if(this.scopeType !== 2 && ids && ids.length > 0){
        ids = Array.from(new Set(ids))
        users =  await getUsersInfo.bind(this, { ids })();
      }
      // 加签人
      if(this.approveForm.oprType === 107){
        this.approveForm.addSignUserIds.push(...ids);
        this.approveForm.addSignUserName = arrToStr(data);
      }
      // 转交人
      if(this.approveForm.oprType === 106){
        this.approveForm.transferUserId = ids[0];
        this.approveForm.transferUserName = arrToStr(data);
      }
      if(this.activeNode.userType === 0){
        if(this.activeNode.rdUserNodes.length){
          let userIds = this.activeNode.rdUserNodes.map(v=>v.id);
          users.forEach((user)=>{
            if(userIds.indexOf(user.id) === -1){
              this.activeNode.rdUserNodes.push(user);
            }
          })
        }else{
          this.activeNode.rdUserNodes = users;
        }
      }else if(users && users.length > 0){
        this.activeNode.rdUserNodes = users;
      }else{
        this.activeNode.rdUserNodes = data;
      }
      this.visibleDialog = false;
    },

    // 保存表单提交完方法回调
    bpsCommitCallback(res){
      res = res.serviceResult || {};
      if(res){
        this.form.formInstanceId = res;
        this.submit();
      }else {
        this.$message({
          type: 'error',
          message: '数据id为空，请联系管理员',
        });
      }
    },

    // 异常处理监听函数
    errorCallback(){
    },

    // 提交方法处理
    logonCommitFn(commitFn){
      let originSaveHandler = commitFn;
      return ()=>{
        this.originalSend = this.API.send;
        try{
          this.API.send = (service, demand, success, error, context, isNoLoading)=>{
            // 处理数据
            if(!this.handleSubmitData()){
              this.$message({
                type: 'error',
                message: '审批节点配置错误',
              });
              return;
            }
            this.originalSend(service, demand, this.bpsCommitCallback || success, error, context, isNoLoading);
          };
          originSaveHandler();
        }catch{
          this.API.send = this.originalSend;
        }finally{
          this.API.send = this.originalSend;
        }
      }
    },

    // 处理提交节点数据
    handleSubmitData(){
      const arr = [];
      let flag = true;
      if(this.itemsList.length > 0){
        this.itemsList.forEach((ket)=>{
          let item = {
            nodeId: ket.nodeId,
            userIds: ket.rdUserNodes.map(v=> {return v.id } )
          }
          if(item.userIds.length === 0){
            flag = false
          }
          arr.push(item);
        })
      }else{
        flag = false;
      }
      this.form.processSubmitInfo.items = arr;
      return flag;
    },

    // 发起提交审核
    submit(){
      this.API.send(commonUrl.bizProcessSubmit, this.form, function (res) {
        res = res.serviceResult;
        console.log(res);
        this.$router.go(-1);
      }, function () {
      }, this);
    },

    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.el-timeline-item{
  padding-bottom: 10px;
}
.el-timeline-item__node--large{
  left: -5px;
  width: 20px;
  height: 20px;
  top: -6px;
}
.bps-container{
  .el-dialog__body {
    padding: 10px 20px 14px 20px;
  }
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
  .pointer{
    cursor: pointer
  }
  .span-icon-i{
    font-size: 26px;
    color: #3e7fe8;
    background-color: #edf2fd
  }
  .bule{

    color: #4badea;
  }
  .el-button{
    min-width: 79px;
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 2px;
  }
}


// .selected_list {
//     margin-bottom: 20px;
//     line-height: 30px;
// }

// .selected_list span {
//     margin-right: 10px;
//     padding: 3px 6px 3px 9px;
//     line-height: 12px;
//     white-space: nowrap;
//     border-radius: 2px;
//     border: 1px solid rgba(220, 220, 220, 1);
// }

// .selected_list img {
//     margin-left: 5px;
//     width: 7px;
//     height: 7px;
//     cursor: pointer;
// }

</style>
