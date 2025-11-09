const msgConfig = {
  dev: {
    '0001': {
      title: '预订单基层直配审核',
      url: 'http://local-manage.lonch.com.cn:8081/index.html#/admin/presaleGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=180400'
    },
    '0002':{
      title: '预订单基层控销审核',
      url: 'http://local-manage.lonch.com.cn:8081/index.html#/admin/presalebasicControlGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=181300',
    },
    '0003':{
      title: '定价申请审核',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/spuManage/spusSalesPriceChangeApproval?appName=yaoFaCai&entry=chat&moduleCode=073000'
    },
    '0004':{
      title: '确认联系人',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0005':{
      title: '机构信息修改',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0006':{
      title: '机构发票信息修改',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0007':{
      title: '机构创始人信息修改',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0008':{
      title: '查看药发采订单',
      url:'http://local-yfc.lonch.com.cn:8086/index.html#/main/orders/ordersDetail?id=${id}&entry=chat&moduleCode=821000'
    },
    '0009':{
      title: '查看价格冲突',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/spuManage/spuAbnormalData?appName=yaoFaCai&entry=chat&moduleCode=073200'
    },
    '0010':{
      title: '查看物流路由',
      url:'http://local-woacs.lonch.com.cn:8081/index.html#/signfor/logcList?appName=yaoFaCai&waybillNo=${id}&entry=chat&moduleCode=821000'
    },
    '0011':{
      title: '订单（业务员预定）审核',
      url:'http://local-manage.lonch.com.cn:8081/index.html#/admin/presaleSaleManListCheck?appName=yaoFaCai&entry=chat&moduleCode=182600'
    },
    '0012':{
      title: '药店合伙人认证',
      url:'http://local-itoc.lonch.com.cn:8081/index.html#/main/salesmanCertification/firstCamp/TerminalIndustryPartnerDetailsYFC?appName=yaoFaCai&id=${id}&entry=chat&moduleCode=670309'
    },
    '0013':{
      title: '朗致周边s',
      url:'http://local-satellite.lonch.com.cn:8560/#/admin/mine/order/details?id=${id}'
    }
  },
  test: {
    '0001': {
      title: '预订单基层直配审核',
      url: 'https://test-manage.lonch.com.cn/index.html#/admin/presaleGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=180400'
    },
    '0002':{
      title: '预订单基层控销审核',
      url: 'https://test-manage.lonch.com.cn/index.html#/admin/presalebasicControlGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=181300',
    },
    '0003':{
      title: '定价申请审核',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/spuManage/spusSalesPriceChangeApproval?appName=yaoFaCai&entry=chat&moduleCode=073000'
    },
    '0004':{
      title: '确认联系人',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0005':{
      title: '机构信息修改',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0006':{
      title: '机构发票信息修改',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0007':{
      title: '机构创始人信息修改',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0008':{
      title: '查看药发采订单',
      url:'https://test-yfc.lonch.com.cn/index.html#/main/orders/ordersDetail?id=${id}&entry=chat&moduleCode=821000'
    },
    '0009':{
      title: '查看价格冲突',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/spuManage/spuAbnormalData?appName=yaoFaCai&entry=chat&moduleCode=073200'
    },
    '0010':{
      title: '查看物流路由',
      url:'https://test-woacs.lonch.com.cn/index.html#/signfor/logcList?appName=yaoFaCai&waybillNo=${id}&entry=chat&moduleCode=821000'
    },
    '0011':{
      title: '订单（业务员预定）审核',
      url:'https://test-manage.lonch.com.cn/index.html#/admin/presaleSaleManListCheck?appName=yaoFaCai&entry=chat&moduleCode=182600'
    },
    '0012':{
      title: '药店合伙人认证',
      url:'https://test-itoc.lonch.com.cn/index.html#/main/salesmanCertification/firstCamp/TerminalIndustryPartnerDetailsYFC?appName=yaoFaCai&id=${id}&entry=chat&moduleCode=670309'
    },
    '0013':{
      title: '朗致周边s',
      url:'https://test-lonch-satellite.lonch.com.cn/index.html#/admin/mine/order/details?id=${id}'
    }
  },
  production: {
    '0001': {
      title: '预订单基层直配审核',
      url: 'https://manage.lonch.com.cn/index.html#/admin/presaleGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=180400'
    },
    '0002':{
      title: '预订单基层控销审核',
      url: 'https://manage.lonch.com.cn/index.html#/admin/presalebasicControlGiveCheck?appName=yaoFaCai&entry=chat&moduleCode=181300',
    },
    '0003':{
      title: '定价申请审核',
      url:'https://manage.lonch.com.cn/index.html#/admin/spuManage/spusSalesPriceChangeApproval?appName=yaoFaCai&entry=chat&moduleCode=073000'
    },
    '0004':{
      title: '确认联系人',
      url:'https://manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0005':{
      title: '机构信息修改',
      url:'https://manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0006':{
      title: '机构发票信息修改',
      url:'https://manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0007':{
      title: '机构创始人信息修改',
      url:'https://manage.lonch.com.cn/index.html#/admin/firstCamp/TerminalFirstCampUploadLinkMan?appName=yaoFaCai&id=${id}&type=0&selfType=linkMan&entry=chat&moduleCode=050702'
    },
    '0008':{
      title: '查看药发采订单',
      url:'https://yfc.lonch.com.cn/index.html#/main/orders/ordersDetail?id=${id}&entry=chat&moduleCode=821000'
    },
    '0009':{
      title: '查看价格冲突',
      url:'https://manage.lonch.com.cn/index.html#/admin/spuManage/spuAbnormalData?appName=yaoFaCai&entry=chat&moduleCode=073200'
    },
    '0010':{
      title: '查看物流路由',
      url:'https://woacs.lonch.com.cn/index.html#/signfor/logcList?appName=yaoFaCai&waybillNo=${id}&entry=chat&moduleCode=821000'
    },
    '0011':{
      title: '订单（业务员预定）审核',
      url:'https://manage.lonch.com.cn/index.html#/admin/presaleSaleManListCheck?appName=yaoFaCai&entry=chat&moduleCode=182600'
    },
    '0012':{
      title: '药店合伙人认证',
      url:'https://itoc.lonch.com.cn/index.html#/main/salesmanCertification/firstCamp/TerminalIndustryPartnerDetailsYFC?appName=yaoFaCai&id=${id}&entry=chat&moduleCode=670309'
    },
    '0013':{
      title: '朗致周边s',
      url:'https://lonch-satellite.lonch.com.cn/index.html#/admin/mine/order/details?id=${id}'
    }
  }
}
export default msgConfig[process.env.VUE_APP_MODE]
