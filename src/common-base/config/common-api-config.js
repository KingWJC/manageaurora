/*
 * @Author: tuwei
 * @Date: 2023-08-25 00:44:39
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-06-12 16:52:49
 */
export default {
  ca: {
    systemHumanApplyCreate: { module: 'ca', url: '/systemHumanApply/create', method: 'POST', comment: '系统人创建'},
  },
  lca: {
    systemHumanApplyCreate: { module: 'lca', url: '/cert/authByFace', method: 'POST', comment: 'CA人脸认证'},
  },
  /**
   * 获取 WorkId
   */
  lid: {
    lidAssignWorkerId: {module: 'lid', url: '/lid/assignWorkerId', method: 'POST', comment: '获取lid'}
  },
  /**
   * 网关加密相关 API
   */
  secretkey: {
    // 不加密
    securityGetPublicKey: { module: 'secretkey', url: '/security/getPublicKey', method: 'POST', comment: '通过terminalId查询公钥'},
    // 不加密
    securityResetPublicKey: { module: 'secretkey', url: '/security/resetPublicKey', method: 'POST', comment: '通过terminalId查询公钥'},
    // RSA 加密
    securitySaveSymmetricKey: { module: 'secretkey', url: '/security/saveSymmetricKey', method: 'POST', comment: '保存对称秘钥'},
  },
  im: {
    getUserSigByToken: { module: 'im', url: '/userSig/getUserSigByToken', method: 'POST', comment: '获取用户SIG'},
  },
  /*
  * 运维工程师角色
  */
  operation: {
    list: { module: 'ca', url: '/operation/list', method: 'POST', comment: '' },
    view: { module: 'ca', url: '/operation/view', method: 'POST', comment: '' },
    viewByLoginUser: { module: 'ca', url: '/operation/viewByLoginUser', method: 'POST', comment: '' }
  },
  email: {
    queryMailByHumanId: { module: 'email', url: '/winmail/queryMailByHumanId', method: 'POST', comment: '获取用户邮箱信息' },
    resetPassword: { module: 'email', url: '/winmail/resetPassword', method: 'POST', comment: '修改用户邮箱密码' },
  },
  ad: {
    adServingApiListAllAdServingByChannel: {
      module: 'ad',
      url: '/adServingApi/listAllAdServingByChannel',
      method: 'POST',
      comment: '查询频道下的短视频列表'
    }
  },
}

