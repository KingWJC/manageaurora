const whale = {
  taxBwPaperPage: { module: 'whale', url: '/tax/bw/paperPage', method: 'POST', comment: '纸质发票列表' },
  taxBwDetails: { module: 'whale', url: '/tax/bw/details', method: 'POST', comment: '发票详情' },
  taxBwUpdatePrintStatus: { module: 'whale', url: '/tax/bw/updatePrintStatus', method: 'POST', comment: '修改发票状态' },
  taxBwSyncOne: { module: 'whale', url: '/tax/bw/syncOne', method: 'POST', comment: '同步发票' },
  taxVendorAccountDelete: { module: 'whale', url: '/tax/vendorAccount/delete', method: 'POST', comment: '删除金税厂商账号' },
  taxVendorAccountPaperPage: { module: 'whale', url: '/tax/vendorAccount/paperPage', method: 'POST', comment: '金税厂商账号列表' },
  taxVendorAccountSave: { module: 'whale', url: '/tax/vendorAccount/save', method: 'POST', comment: '修改金税厂商账号' },
  taxVendorAccountUpdate: { module: 'whale', url: '/tax/vendorAccount/update', method: 'POST', comment: '修改金税厂商账号信息' },
  taxVendorAccountDetails: { module: 'whale', url: '/tax/vendorAccount/details', method: 'POST', comment: '金税厂商账号信息详情' },
  // =====航天金税=====
  taxHtPaperPage: { module: 'whale', url: '/tax/ht/paperPage', method: 'POST', comment: '航天金税发票列表' },
  taxHtDetails: { module: 'whale', url: '/tax/ht/details', method: 'POST', comment: '航天金税发票详情' },
  taxHtUpdatePrintStatus: { module: 'whale', url: '/tax/ht/updatePrintStatus', method: 'POST', comment: '修改航天金税发票状态' },
  taxHtSyncById: { module: 'whale', url: '/tax/ht/syncById', method: 'POST', comment: '同步航金税发票' },
  taxHtWebprint: { module: 'whale', url: '/tax/ht/webprint', method: 'POST', comment: '获取打印码' },
  selectList: { module: 'whale', url: '/tax/invoiceKind/selectList', method: 'POST', comment: '获取发票' },
  //
  taxInvoiceKindApiServiceRelSelectInfoListByApiServiceType: { module: 'whale', url: '/tax/invoiceKindApiServiceRel/selectInfoListByApiServiceType', method: 'POST', comment: '获取发票类型与金税厂商对照' },
}

export default whale
