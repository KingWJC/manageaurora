/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-03-09 00:14:32
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-30 23:29:34
 * @FilePath: /lonch-itoc/src/config/module/ca.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ca = {
  // 商品发布申请
  organizeSelectOrgs: { module: 'ca', url: '/organize/selectOrgs', method: 'POST', comment: '根据名称和省市区模糊查询组织机构'},
  organizeSelectOrgsNoPage: { module: 'ca', url: '/organize/selectOrgsNoPage', method: 'POST', comment: '根据名称和省市区模糊查询组织机构'},

  querySalesmanListNoPermission: { module: 'ca', url: '/new/salesman/querySalesmanListNoPermission', method: 'POST', expire: 0, comment: '查询业务组织下的业务员'},
  selectCsrs: { module: 'ca', url: '/csr/selectCsrs', method: 'POST', expire: 0, comment: ''},
  getAllCode: { module: 'ca', url: '/code/getAllCode', method: 'POST', expire: 0, comment: ''},
  getAllCodeByPage: { module: 'ca', url: '/code/getAllCodeByPage', method: 'POST', expire: 0, comment: ''},
  createCodeWithoutPad: { module: 'ca', url: '/code/createCodeWithoutPad', method: 'POST', expire: 0, comment: ''},
  editCode: { module: 'ca', url: '/code/editCode', method: 'POST', expire: 0, comment: ''},
  getCode: { module: 'ca', url: '/code/getCode', method: 'POST', expire: 0, comment: ''},
  credentialType: { module: 'ca', url: '/credentialType/list', method: 'POST', expire: 0, comment: '证件类型'},
  listNoPermission: { module: 'ca', url: '/csrCert/listNoPermission', method: 'POST', expire: 0, comment: ''},
  getCsr: { module: 'ca', url: '/csrCert/getCsr', method: 'POST', expire: 0, comment: ''},
  saveCsrFile: { module: 'ca', url: '/csrCert/saveCsrFile', method: 'POST', expire: 0, comment: ''},
  autoCreate: { module: 'ca', url: '/linkmanApply/autoCreate', method: 'POST', expire: 0, comment: ''},
  viewPersonRealNameCert: { module: 'ca', url: '/realName/viewPersonRealNameCert', method: 'POST', expire: 0, comment: ''},
  refreshPersonRealNameCert: { module: 'ca', url: '/realName/refreshPersonRealNameCert', method: 'POST', expire: 0, comment: ''},

  getAllSupplier: { module: 'ca', url: '/supplierCert/getAllSupplier', method: 'POST', comment: ''},
  getSupplier: { module: 'ca', url: '/supplierCert/getSupplier', method: 'POST', comment: ''},
  humanSelectHumans: { module: 'ca', url: '/human/selectHumans', method: 'POST', comment: '查询人' },
  credentialTypeList: { module: 'ca', url: '/credentialType/list', method: 'POST', comment: '查询证件类型' },
  /**
   * 审核
   */
  realNameApplyAudit: { module: 'ca', url: '/realNameApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  realNameApplyDelete: { module: 'ca', url: '/realNameApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  realNameApplyList: { module: 'ca', url: '/realNameApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  realNameApplyUpdate: { module: 'ca', url: '/realNameApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  realNameApplyView: { module: 'ca', url: '/realNameApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查看上一个申请中的申请单
   */
  realNameApplyViewLast: { module: 'ca', url: '/realNameApply/viewLast', method: 'POST', comment: '查看上一个申请中的申请单' },
  /**
   * 发送实名认证创建账户的短信验证码
   */
  realNameApplySendSms: { module: 'ca', url: '/realNameApply/sendSms', method: 'POST', comment: '发送实名认证创建账户的短信验证码' },
  /**
   * 查询机构信息
   */
  organizeSearchOrgsByPage: { module: 'ca', url: '/organize/searchOrgsByPage', method: 'POST', comment: '查询机构信息' },
  /**
   * 查询商户信息
   */
  shopListNoPermission: { module: 'ca', url: '/shop/listNoPermission', method: 'POST', comment: '查询商户信息' },
  /**
   * 查询联系人信息
   */
  linkmanListWithoutPermission: { module: 'ca', url: '/linkman/listWithoutPermission', method: 'POST', comment: '查询商户信息' },
  /**
   * 创建联系人
   */
  linkmanApplyAutoCreate: { module: 'ca', url: '/linkmanApply/autoCreate', method: 'POST', expire: 0, comment: ''},
  /**
   * 查询商户类型信息
   */
  shopTypeList: { module: 'ca', url: '/shopType/list', method: 'POST', comment: '查询商户类型信息' },
  /**
   * 查询商户信息
   */
  shopList: { module: 'ca', url: '/shop/list', method: 'POST', comment: '查询商户信息' },
  /**
   * 申请详情
   */
  merchantBusinessPreferenceView: { module: 'ca', url: '/merchantBusinessPreference/view', method: 'POST', comment: '申请详情' },
  /**
   * 编辑
   */
  merchantBusinessPreferenceUpdate: { module: 'ca', url: '/merchantBusinessPreference/update', method: 'POST', comment: '编辑' },
  /**
   * 查询结果集
   */
  merchantBusinessPreferencePageResult: { module: 'ca', url: '/merchantBusinessPreference/pageResult', method: 'POST', comment: '查询结果集' },
  /**
   * 查询申请单
   */
  merchantBusinessPreferencePageApply: { module: 'ca', url: '/merchantBusinessPreference/pageApply', method: 'POST', comment: '查询申请单' },
  /**
   * 根据商户id查询商户营销偏好
   */
  merchantBusinessPreferenceGetResultByMerchantId: { module: 'ca', url: '/merchantBusinessPreference/getResultByMerchantId', method: 'POST', comment: '根据商户id查询商户营销偏好' },
  /**
   * 创建
   */
  merchantBusinessPreferenceCreate: { module: 'ca', url: '/merchantBusinessPreference/create', method: 'POST', comment: '创建' },
  /**
   * 删除
   */
  merchantBusinessPreferenceDelete: { module: 'ca', url: '/merchantBusinessPreference/delete', method: 'POST', comment: '删除' },
  /**
   * 创建并自动审核
   */
  merchantBusinessPreferenceAutoCreate: { module: 'ca', url: '/merchantBusinessPreference/autoCreate', method: 'POST', comment: '创建并自动审核' },
  /**
   * 审核
   */
  merchantBusinessPreferenceAudit: { module: 'ca', url: '/merchantBusinessPreference/audit', method: 'POST', comment: '审核' },
  /**
   * 查询指令集
   */
  merchantBusinessPreferencePageDirective: { module: 'ca', url: '/merchantBusinessPreference/pageDirective', method: 'POST', comment: '查询指令集' },
  // ==================================机构名称变更申请单==================================
  /**
   * 查看机构曾用名新增申请单详情
   */
  nameChangeApplyView: { module: 'ca', url: '/nameChangeApply/view', method: 'POST', comment: '查看机构曾用名新增申请单详情' },
  /**
   * 编辑机构曾用名新增申请单
   */
  nameChangeApplyUpdate: { module: 'ca', url: '/nameChangeApply/update', method: 'POST', comment: '编辑机构曾用名新增申请单' },
  /**
   * 机构曾用名新增申请单列表
   */
  nameChangeApplyList: { module: 'ca', url: '/nameChangeApply/list', method: 'POST', comment: '机构曾用名新增申请单列表' },
  /**
   * 删除机构曾用名新增申请单
   */
  nameChangeApplyDelete: { module: 'ca', url: '/nameChangeApply/delete', method: 'POST', comment: '删除机构曾用名新增申请单' },
  /**
   * 创建机构曾用名新增申请单
   */
  nameChangeApplyCreate: { module: 'ca', url: '/nameChangeApply/create', method: 'POST', comment: '创建机构曾用名新增申请单' },
  /**
   * 审核机构曾用名新增申请单
   */
  nameChangeApplyAudit: { module: 'ca', url: '/nameChangeApply/audit', method: 'POST', comment: '审核机构曾用名新增申请单' },
}

export default ca;
