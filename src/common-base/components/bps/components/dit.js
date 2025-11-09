/*
 * @Author: tuWei
 * @Date: 2023-03-20 12:15:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-11 01:34:57
 */
//审批方式
export const approvalWayTypeOpts = [
  {
    c: 1,
    n: '依次审批'
  },
  {
    c: 2,
    n: '会签'
  },
  {
    c: 3,
    n: '或签'
  }
];

/**
 *
 * @param {*} code
 * @returns 根据code返回对应审批方式name
 */
export function getApprovalWayType(code) {
  let fOno = approvalWayTypeOpts.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

// 成员设置类型
export const userTypeOpts = [
  {
    c: 1,
    n: '指定成员'
  },
  {
    c: 2,
    n: '发起人自选'
  },
  {
    c: 3,
    n: '发起人自己'
  },
  {
    c: 4,
    n: '申请人多级上级'
  },
  {
    c: 5,
    n: '申请人直接上级'
  }
];

/**
 *
 * @param {*} code
 * @returns 根据code返回对应成员设置类型name
 */

export function getuserType(code) {
  let fOno = userTypeOpts.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

// 101驳回，102撤回，103通过，104回退，106转交，107加签
// 审核需要的操作：驳回，通过，回退，转交，加签
export const oprTypes = [
  { c: 100, n: '发起申请' },
  { c: 101, n: '驳回', step: ['verify'] },
  { c: 102, n: '撤回' },
  { c: 103, n: '通过', step: ['verify'] },
  { c: 104, n: '回退', step: ['verify'] },
  { c: 105, n: '抄送人' },
  { c: 106, n: '转交', step: ['verify'] },
  { c: 107, n: '加签', step: ['verify'] },
  { c: 108, n: '评论' },
  { c: 999, n: '审批人' }
];

// 101驳回，102撤回，103通过，104回退，106转交，107加签
export const workOprTypes = [
  { c: 100, n: '发起申请' },
  { c: 102, n: '撤回' },
  { c: 104, n: '回退' },
  { c: 107, n: '添加处理人' },
  { c: 108, n: '评论' },
  { c: 109, n: '下一步' },
  { c: 110, n: '归档' },
  { c: 998, n: '处理人' }
];

export function getOprTypesName(code) {
  let fOno = oprTypes.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

export function getOprTypesWorkName(code) {
  let fOno = workOprTypes.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

// 流程审批状态
export const approveState = [
  // { c: 999,n: '审批中' },
  { c: 101, n: '审批驳回' },
  { c: 102, n: '审批撤回' },
  { c: 200, n: '审批通过' }
];

// 工单审批状态
export const workState = [
  // { c: 999,n: '审批中' },
  { c: 100, n: '处理中' },
  { c: 102, n: '已撤回' },
  { c: 200, n: '已归档' }
];

// 获取流程审批状态name
export function getApproveStateName(code) {
  let fOno = approveState.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

// 获取流程审批状态name
export function getWorkStateName(code) {
  let fOno = workState.find((v) => v.c === code);
  if (fOno) {
    return fOno.n;
  }
  return null;
}

export const commonUrl = {
  selectBusinessDepartment: {
    module: 'mserver',
    url: '/department/selectBusinessDepartment',
    method: 'POST',
    comment: '根据业务组织部门'
  },
  selectYWHumanByDepartmentId: {
    module: 'mserver',
    url: '/department/selectYWHumanByDepartmentId',
    method: 'POST',
    comment: '根据业务部门查询人员'
  },
  selectCaOrgAdministrationByCode: {
    module: 'mserver',
    url: '/department/selectCaOrgAdministrationByCode',
    method: 'POST',
    comment: '行政组织'
  },
  selectXZHumanByDepartmentId: {
    module: 'mserver',
    url: '/department/selectXZHumanByDepartmentId',
    method: 'POST',
    comment: ''
  },
  selectHumanOrganizationByNameAndOrgTypelog: {
    module: 'uaapi',
    url: '/caHuman/selectHumanOrganizationByNameAndOrgTypelog',
    method: 'POST',
    comment: '根据组织查人'
  },

  bizProcessPreSubmit: {
    module: 'bps',
    url: '/bizProcess/instance/approval/preSubmit',
    method: 'POST',
    comment: '审批预发起流程'
  },
  bizProcessSubmit: {
    module: 'bps',
    url: '/bizProcess/instance/approval/submit',
    method: 'POST',
    comment: '发起流程'
  },
  instanceDetails: {
    module: 'bps',
    url: '/bizProcess/instance/details',
    method: 'POST',
    comment: '流程详情'
  },
  getOrgType: {
    module: 'bps',
    url: '/approval/instance/getOrgType',
    method: 'POST',
    comment: '获取组织类型'
  },
  approvalOperate: {
    module: 'bps',
    url: '/approval/instance/operate',
    method: 'POST',
    comment: '审批操作'
  },
  rollbackNodeList: {
    module: 'bps',
    url: '/approval/instance/rollbackNodeList',
    method: 'POST',
    comment: '回退节点列表'
  },
  getBpsUsersInfo: {
    module: 'bps',
    url: '/approval/instance/getUsersInfo',
    method: 'POST',
    comment: '获取用户信息'
  },
  selectHumanLeaderslog: {
    module: 'uaapi',
    url: '/caHuman/selectHumanLeaderslog',
    method: 'POST',
    comment: '申请人多级上级'
  },
  selectHumanLeaderlog: {
    module: 'uaapi',
    url: '/caHuman/selectHumanLeaderlog',
    method: 'POST',
    comment: '申请人直接上级'
  },

  // 工单
  workOrderOperate: {
    module: 'bps',
    url: '/workOrder/instance/operate',
    method: 'POST',
    comment: '工单节点操作'
  },
  workRollbackNodeList: {
    module: 'bps',
    url: '/workOrder/instance/rollbackNodeList',
    method: 'POST',
    comment: '工单回退节点列表'
  },
  workOrderSubmit: {
    module: 'bps',
    url: '/bizProcess/instance/workOrder/submit',
    method: 'POST',
    comment: '发起工单流程'
  },
  canAddUserRange: {
    module: 'bps',
    url: '/workOrder/instance/canAddUserRange',
    method: 'POST',
    comment: '允许添加人员范围'
  },
  workNextNodeList: {
    module: 'bps',
    url: '/workOrder/instance/nextNodeList',
    method: 'POST',
    comment: '下一步节点列表'
  }
};

export const tmpNodeDefaut = {
  size: 'large',
  type: 'primary',
  color: '#cecfd1',
  icon: 'el-icon-user',
  rdUserNodes: []
};

export const approveForm = {
  attachment: [],
  pictures: [],
  oprType: '',
  remark: '',
  nextToNodeId: '',
  isAddSignBefore: null,
  addUserIdNames: null, // 工单加签人
  addSignUserName: null, // 审批加签人
  transferUserId: null,
  transferUserName: null, // 转交人
  rollbackToNodeId: null,
  rollbackToNodeName: null
};
