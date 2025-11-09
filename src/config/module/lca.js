/*
 * @Author: tuwei
 * @Date: 2023-09-05 16:34:10
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 14:51:15
 */
const lca = {
  //cert/list
  lonchCertList: { module: 'lca', url: '/cert/list', method: 'POST', comment: '查询证书' },
  // 证书申请单相关接口
  lonchCertApplyList: { module: 'lca', url: '/certApply/list', method: 'POST', comment: '查询证书申请单列表' },
  lonchCertApplyAudit: { module: 'lca', url: '/certApply/audit', method: 'POST', comment: '审核证书申请单' },
  lonchCertApplyDel: { module: 'lca', url: '/certApply/delete', method: 'POST', comment: '删除证书申请单' },
  lonchCertApplyAdd: { module: 'lca', url: '/certApply/update', method: 'POST', comment: '更新新增ca证书' },
  lonchCertApplyView: { module: 'lca', url: '/certApply/view', method: 'POST', comment: '查询证书申请单信息' },
  // 证书终止申请单相关接口
  lonchCertCancelApplyList: { module: 'lca', url: '/certCancelApply/list', method: 'POST', comment: '查询证书作废申请单列表' },
  lonchCertCancelApplyAudit: { module: 'lca', url: '/certCancelApply/audit', method: 'POST', comment: '审核证书作废申请单' },
  lonchCertCancelApplyDel: { module: 'lca', url: '/certCancelApply/delete', method: 'POST', comment: '删除证书作废申请单' },
  lonchCertCancelApplyAdd: { module: 'lca', url: '/certCancelApply/update', method: 'POST', comment: '创建证书作废申请单' },
  lonchCertCancelApplyView: { module: 'lca', url: '/certCancelApply/view', method: 'POST', comment: '查询证书作废申请单信息' },
  /**
   * CA 实名认证
   */
  certAuthByFace: { module: "lca", url: "/cert/authByFace", method: "POST", comment: "实名认证" },
  /**
   * CA 认证状态
   */
  certGetAuthStatus: { module: "lca", url: "/cert/getAuthStatus", method: "POST", comment: "获取用户的CA状态" },
}

export default lca;
