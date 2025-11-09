const outconnector = {
  // 开通虚拟订单记录
  pageVirtualOrder: { module: 'outconnector', url: '/ovo/pageVirtualOrder', method: 'POST', comment: '开通虚拟订单记录' },
  queryVirtualOrderById: { module: 'outconnector', url: '/ovo/queryVirtualOrderById', method: 'POST', comment: '查看虚拟订单记录详情' },
  saveVirtualOrder: { module: 'outconnector', url: '/ovo/saveVirtualOrder', method: 'POST', comment: '开通虚拟订单' },

  // 开通外系统账号记录
  pageOutAccount: { module: 'outconnector', url: '/oa/pageOutAccount', method: 'POST', comment: '开通外系统账户记录' },
  queryOutAccountById: { module: 'outconnector', url: '/oa/queryOutAccountById', method: 'POST', comment: '开通外系统账户记录详情' },

  // 外系统组织操作记录
  pageOutOrg: { module: 'outconnector', url: '/oo/pageOutOrg', method: 'POST', comment: '外系统组织操作记录' },
  queryOutOrgById: { module: 'outconnector', url: '/oo/queryOutOrgById', method: 'POST', comment: '外系统组织操作记录详情' },

  // 云药房
  pageYyfClinic: { module: 'outconnector', url: '/oo/pageYyfClinic', method: 'POST', comment: '获取云药房组织分页列表' },
  queryYyfClinicById: { module: 'outconnector', url: '/oo/queryYyfClinicById', method: 'POST', comment: '获取云药房组织详情' },
  saveYyfClinic: { module: 'outconnector', url: '/oo/saveYyfClinic', method: 'POST', comment: '保存云药房组织' },

  // 云诊室
  pageYzsClinic: { module: 'outconnector', url: '/oo/pageYzsClinic', method: 'POST', comment: '获取云诊室组织分页列表' },
  queryYzsClinicById: { module: 'outconnector', url: '/oo/queryYzsClinicById', method: 'POST', comment: '获取云诊室组织详情信息' },
  saveYzsClinic: { module: 'outconnector', url: '/oo/saveYzsClinic', method: 'POST', comment: '保存云诊室组织详情信息' },
  yzsAccountExpansion: { module: 'outconnector', url: '/oo/yzsAccountExpansion', method: 'POST', comment: '账户扩容' },
  
  // 机构绑定
  queryOutOrgListForBinding: { module: 'outconnector', url: '/oo/queryOutOrgListForBinding', method: 'POST', comment: '查询中台id绑定的外系统组织列表' },
  pageNotBindingYyfClinic: { module: 'outconnector', url: '/oo/pageNotBindingYyfClinic', method: 'POST', comment: '获取未绑定云药房组织分页列表' },
  pageNotBindingYzsClinic: { module: 'outconnector', url: '/oo/pageNotBindingYzsClinic', method: 'POST', comment: '获取未绑定的云诊室组织分页列表' },
  saveOutOrgAndZtRef: { module: 'outconnector', url: '/oo/saveOutOrgAndZtRef', method: 'POST', comment: '向中台发起保存外系统id关系' },
  saveOutOrg: { module: 'outconnector', url: '/oo/saveOutOrg', method: 'POST', comment: '由中台同步新增 诊所信息 和编辑同步更新信息' },
  
  // 云诊室账户
  pageAccount: { module: 'outconnector', url: '/yzsa/pageAccount', method: 'POST', comment: '获取云诊室账户分页列表' },
  queryClinicList: { module: 'outconnector', url: '/yzsa/queryClinicList', method: 'POST', comment: '诊所列表' },
  saveAccount: { module: 'outconnector', url: '/yzsa/saveAccount', method: 'POST', comment: '云诊室账户保存' },
  resetPwd: { module: 'outconnector', url: '/yzsa/resetPwd', method: 'POST', comment: '重置密码' },
  disabledAccount: { module: 'outconnector', url: '/yzsa/disabledAccount', method: 'POST', comment: '  禁用  ' },
  enabledAccount: { module: 'outconnector', url: '/yzsa/enabledAccount', method: 'POST', comment: '  启用  ' },

  // 云药房账户
  yyfaAccountModify: { module: 'outconnector', url: '/yyfa/accountModify', method: 'POST', comment: '云药房账户修改' },
  yyfaAccountSetAdmin: { module: 'outconnector', url: '/yyfa/accountSetAdmin', method: 'POST', comment: '云药房账户设置管理员' },
  yyfaAddAccount: { module: 'outconnector', url: '/yyfa/addAccount', method: 'POST', comment: '云药房账户新增' },
  yyfaEnableDisableAccountStatus: { module: 'outconnector', url: '/yyfa/enableDisableAccountStatus', method: 'POST', comment: '账号启用禁用删除' },
  yyfaPageAccount: { module: 'outconnector', url: '/yyfa/pageAccount', method: 'POST', comment: '获取账户分页列表' },
  yyfaQueryAreaList: { module: 'outconnector', url: '/yyfa/queryAreaList', method: 'POST', comment: '云药房区域列表' },
  yyfaQueryClinicList: { module: 'outconnector', url: '/yyfa/queryClinicList', method: 'POST', comment: '云药房诊所列表' },
  
  // 标签管理
  querySelectTagList: { module: 'outconnector', url: '/oot/querySelectTagList', method: 'POST', comment: '获取已选择的标签列表' },
  queryTagList: { module: 'outconnector', url: '/oot/queryTagList', method: 'POST', comment: '获取标签列表' },
  saveSelectTagList: { module: 'outconnector', url: '/oot/saveSelectTagList', method: 'POST', comment: '获取已选择的标签列表' },

  // 云诊室设备绑定
  pageYzsDeviceBinding: { module: 'outconnector', url: '/yzsdb/pageYzsDeviceBinding', method: 'POST', comment: '云诊室设备分页列表' },
  queryYzsDeviceTypeList: { module: 'outconnector', url: '/yzsdb/queryYzsDeviceTypeList', method: 'POST', comment: '云诊室设备类型列表' },
  bindingYzsDevice: { module: 'outconnector', url: '/yzsdb/bindingYzsDevice', method: 'POST', comment: '云诊室设备绑定' },
  unBindingYzsDevice: { module: 'outconnector', url: '/yzsdb/unBindingYzsDevice', method: 'POST', comment: '云诊室设备解绑' },
  modifyDeviceInfo: { module: 'outconnector', url: '/yzsdb/modifyDeviceInfo', method: 'POST', comment: '修改云诊室设备信息' },
}

export default outconnector