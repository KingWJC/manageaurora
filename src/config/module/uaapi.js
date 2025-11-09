const uaapi = {
  // 新角色管理
  newProductPermeissionList2:{ module:'uaapi',url:'/user/newProductPermeissionList2', method: 'POST', comment: '查询用户有的产品和资源（除按钮外）' },
  rolePermeissionList2:{ module:'uaapi',url:'/user/rolePermeissionList2', method: 'POST', comment: '查询角色下所有的资源，（除按钮外）' },
  rolePermeissionIdList2:{ module:'uaapi',url:'/user/rolePermeissionIdList2', method: 'POST', comment: '查询角色下所有的资源id集合，（除按钮外）' },
  productPermeissionByParentId:{ module:'uaapi',url:'/user/productPermeissionByParentId', method: 'POST', comment: '根据父id查询资源下的所有子' },
  rolePermeissionListByParentId:{ module:'uaapi',url:'/user/rolePermeissionListByParentId', method: 'POST', comment: '查询角色在指定资源下所有的按钮权限' },
  saveRolePermissionList2:{ module:'uaapi',url:'/user/saveRolePermissionList2', method: 'POST', comment: '保存角色权限' },
  productPermeissionLastUpdateTime:{ module:'uaapi',url:'/user/productPermeissionLastUpdateTime', method: 'POST', comment: '获取角色最后更新时间' },
  // 新增加的部分资源接口
  permissionNameList2:{ module:'uaapi',url:'/user/permissionNameList2', method: 'POST', comment: '返回所有文件夹和真实资源' },
  permissionNameListByParam:{ module:'uaapi',url:'/user/permissionNameListByParam', method: 'POST', comment: '根据资源ID再查询数据操作、行、列权限' },
  // 商品发布申请
  enumSelectCaOrganizePharmacyType: { module: 'uaapi', url: '/enum/selectCaOrganizePharmacyType', method: 'POST', comment: '获取药店类型字典项' },
  enumSelectCaOrganizeMedicalInstitutionType: { module: 'uaapi', url: '/enum/selectCaOrganizeMedicalInstitutionType', method: 'POST', comment: '获取医疗机构类型字典项' },
  enumSelectCaOrganizeBusinessType: { module: 'uaapi', url: '/enum/selectCaOrganizeBusinessType', method: 'POST', comment: '获取商业类型字典项' },

  selectOrgLegalPerson: { module: 'uaapi', url: '/legalPerson/selectOrgLegalPerson', method: 'POST', expire: 0, comment: '' },
  insertOrUpdateOrgLegalPerson: { module: 'uaapi', url: '/legalPerson/insertOrUpdateOrgLegalPerson', method: 'POST', expire: 0, comment: '' },
  deletedOrgLegalPerson: { module: 'uaapi', url: '/legalPerson/deletedOrgLegalPerson', method: 'POST', expire: 0, comment: '' },
  selectOrgLegalPersonHuman: { module: 'uaapi', url: '/legalPerson/selectOrgLegalPersonHuman', method: 'POST', expire: 0, comment: '' },
  insertOrupdateLegalPersonHuman: { module: 'uaapi', url: '/legalPerson/insertOrupdateLegalPersonHuman', method: 'POST', expire: 0, comment: '' },
  deletedLegalPersonHuman: { module: 'uaapi', url: '/legalPerson/deletedLegalPersonHuman', method: 'POST', expire: 0, comment: '' },

  selectCaOrganize: { module: 'uaapi', url: '/caOrganize/selectCaOrganize', method: 'POST', expire: 0, comment: '' },
  insertOrUpdateCaOrganize: { module: 'uaapi', url: '/caOrganize/insertOrUpdateCaOrganize', method: 'POST', expire: 0, comment: '' },
  deletedCaOrganize: { module: 'uaapi', url: '/caOrganize/deletedCaOrganize', method: 'POST', expire: 0, comment: '' },

  selectCaOrgBankcardType: { module: 'uaapi', url: '/caOrgBankcard/selectCaOrgBankcardType', method: 'POST', expire: 0, comment: '' },
  insertOrUpdateCaOrgBankcardType: { module: 'uaapi', url: '/caOrgBankcard/insertOrUpdateCaOrgBankcardType', method: 'POST', expire: 0, comment: '' },

  selectCaOrganizeAddress: { module: 'uaapi', url: '/caAddress/selectCaOrganizeAddress', method: 'POST', expire: 0, comment: '' },

  selectCaOrganizeLinkman: { module: 'uaapi', url: '/caLinkman/selectCaOrganizeLinkman', method: 'POST', expire: 0, comment: '' },

  selectCaOrgBankcard: { module: 'uaapi', url: '/caOrgBankcard/selectCaOrgBankcard', method: 'POST', expire: 0, comment: '' },
  insertOrupdateCaOrgBankcard: { module: 'uaapi', url: '/caOrgBankcard/insertOrupdateCaOrgBankcard', method: 'POST', expire: 0, comment: '' },
  deletedCaOrgBankcard: { module: 'uaapi', url: '/caOrgBankcard/deletedCaOrgBankcard', method: 'POST', expire: 0, comment: '' },
  selectCaOrgBankcardList:  { module: 'uaapi', url: '/caOrgBankcard/selectCaOrgBankcardList', method: 'POST', expire: 0, comment: '' },

  selectCaLinkmanList:{ module: 'uaapi', url: '/caLinkman/selectCaLinkmanList', method: 'POST', expire: 0, comment: '' },
  selectCaBankcardList:{ module: 'uaapi', url: '/caOrgBankcard/selectCaBankcardList', method: 'POST', expire: 0, comment: '' },

  insertOrupdateCaBankcard:{ module: 'uaapi', url: '/caOrgBankcard/insertOrupdateCaBankcard', method: 'POST', expire: 0, comment: '' },
  deletedCaBankcard:{ module: 'uaapi', url: '/caOrgBankcard/deletedCaBankcard', method: 'POST', expire: 0, comment: '' },

  selectCaSourceType:{ module: 'uaapi', url: '/enum/selectCaSourceType', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizeMedicalInstitutionType:{ module: 'uaapi', url: '/enum/selectCaOrganizeMedicalInstitutionType', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizePharmacyType:{ module: 'uaapi', url: '/enum/selectCaOrganizePharmacyType', method: 'POST', expire: 0, comment: '' },
  selectCaLinkmanType:{ module: 'uaapi', url: '/enum/selectCaLinkmanType', method: 'POST', expire: 0, comment: '' },
  selectCaAddressType:{ module: 'uaapi', url: '/enum/selectCaAddressType', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizeBusinessType:{ module: 'uaapi', url: '/enum/selectCaOrganizeBusinessType', method: 'POST', expire: 0, comment: '' },

  selectCaOrganizeType:{ module: 'uaapi', url: '/enum/selectCaOrganizeType', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizeErpContrast:{ module: 'uaapi', url: '/caOrganizeOutId/selectCaOrganizeErpContrast', method: 'POST', expire: 0, comment: '' },
  insertErpContrast:{ module: 'uaapi', url: '/caOrganizeOutId/insertErpContrast', method: 'POST', expire: 0, comment: '' },
  confirmErpContrast:{ module: 'uaapi', url: '/caOrganizeOutId/confirmErpContrast', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizeAll:{ module: 'uaapi', url: '/caOrganize/selectCaOrganizeAll', method: 'POST', expire: 0, comment: '' },
  updateErpContrast:{ module: 'uaapi', url: '/caOrganizeOutId/updateErpContrast', method: 'POST', expire: 0, comment: 'erp更改外系统ID' },
  removeErpContrast:{ module: 'uaapi', url: '/caOrganizeOutId/removeErpContrast', method: 'POST', expire: 0, comment: '解除外系统关系传id' },
  selectNCSupplier:{ module: 'uaapi', url: '/caOrganizeOutId/selectNCSupplier', method: 'POST', expire: 0, comment: '查询NC供应商' },
  selectSupplier:{ module: 'uaapi', url: '/caOrganizeOutId/selectSupplier', method: 'POST', expire: 0, comment: '根据id查询是否是供应商' },

  selectCaAddress:{ module: 'uaapi', url: '/caAddress/selectCaAddress', method: 'POST', expire: 0, comment: '' },
  selectCaOrganizeOutIdType:{ module: 'uaapi', url: '/enum/selectCaOrganizeOutIdType', method: 'POST', expire: 0, comment: '外系统对照类型列表' },
  selectCaOrganizeErpContrastStatus:{ module: 'uaapi', url: '/enum/selectCaOrganizeErpContrastStatus', method: 'POST', expire: 0, comment: '对照方式枚举' },
  selectCaOrganizeErpContrastType:{ module: 'uaapi', url: '/enum/selectCaOrganizeErpContrastType', method: 'POST', expire: 0, comment: '对照类型枚举' },

  selectCaHuman:{ module: 'uaapi', url: '/caHuman/selectCaHuman', method: 'POST', expire: 0, comment: '查询自然人' },
  insertOrUpdatCaHuman:{ module: 'uaapi', url: '/caHuman/insertOrUpdatCaHuman', method: 'POST', expire: 0, comment: '新增或修改' },
  insertCaHuman:{ module: 'uaapi', url: '/caHuman/insertCaHuman', method: 'POST', expire: 0, comment: '新增' },

  selectCaHumanErpContrast:{ module: 'uaapi', url: '/caHumanOutId/selectCaHumanErpContrast', method: 'POST', expire: 0, comment: '自然人外系统查询  分页' },
  insertCaHumanErpContrast:{ module: 'uaapi', url: '/caHumanOutId/insertCaHumanErpContrast ', method: 'POST', expire: 0, comment: '新增' },
  updateCaHumanErpContrast:{ module: 'uaapi', url: '/caHumanOutId/updateCaHumanErpContrast', method: 'POST', expire: 0, comment: '修改' },
  confirmCaHumanErpContrast:{ module: 'uaapi', url: '/caHumanOutId/confirmCaHumanErpContrast', method: 'POST', expire: 0, comment: '确认' },
  caLinkmanTypeInsertOrUpdate: { module: 'uaapi', url: '/caLinkmanType/insertOrUpdate', method: 'POST', comment: '新增联系人类型' },
  caLinkmanTypeSelect: { module: 'uaapi', url: '/caLinkmanType/select', method: 'POST', comment: '联系人类型详情' },

}
export default uaapi;
