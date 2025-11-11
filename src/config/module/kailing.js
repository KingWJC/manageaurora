const kailing = {
  // 1. 前置处理
  queryPreprocess: { module: 'kailing', url: '/lqadapter/digitalInvoice/queryPreprocess', method: 'POST', comment: '查询前置处理结果' },
  executePreprocess: { module: 'kailing', url: '/lqadapter/digitalInvoice/executePreprocess', method: 'POST', comment: '执行前置处理' },
  // 2. 发票上传与下载
  pagelqadapterDownloads: { module: 'kailing', url: '/lqadapter/pagelqadapterDownloads', method: 'POST', comment: '发票下载记录分页' },
  applyInvoiceDownload: { module: 'kailing', url: '/lqadapter/applyInvoiceDownload', method: 'POST', comment: '申请发票下载' },
  uploadlqadapters: { module: 'kailing', url: '/lqadapter/uploadlqadapters', method: 'POST', comment: '数电票上传 QDFPSC' },
  pagelqadapterUploads: { module: 'kailing', url: '/lqadapter/pagelqadapterUploads', method: 'POST', comment: '上传记录分页' },
  queryUploadResult: { module: 'kailing', url: '/lqadapter/queryUploadResult', method: 'POST', comment: '查询上传结果 CXQDFPSCJG' },
  auditBluelqadapter: { module: 'kailing', url: '/lqadapter/auditBluelqadapter', method: 'POST', comment: '蓝字发票审核（自定义）' },
  // 3. 额度下载/退回记录 
  pageQuotaRecords: { module: 'kailing', url: '/lqadapter/quota/pageQuotaRecords', method: 'POST', comment: '发票额度记录分页查询' },
  operateQuota: { module: 'kailing', url: '/lqadapter/quota/operateQuota', method: 'POST', comment: '下载/退回发票额度' },
  adjustValidity: { module: 'kailing', url: '/lqadapter/quota/adjustValidity', method: 'POST', comment: '调整发票额度有效期' },
  // 4. 汇总确认
  uploadSummaryConfirm: { module: 'kailing', url: '/lqadapter/uploadSummaryConfirm', method: 'POST', comment: '上传发票汇总确认信息 SCFPHZQRXX' },
  pageSummaryList: { module: 'kailing', url: '/lqadapter/pageSummaryList', method: 'POST', comment: '发票汇总确认信息分页 CXFPHZQRXX' },
  // 5. 红字确认单
  pageRedConfirmList: { module: 'kailing', url: '/lqadapter/pageRedConfirmList', method: 'POST', comment: '查询数电红字确认单列表信息 CXQDHZQRDLB' },
  queryRedConfirmDetail: { module: 'kailing', url: '/lqadapter/queryRedConfirmDetail', method: 'POST', comment: '查询数电红字确认单明细信息 CXQDHZQRDMX' },
  applyRedConfirm: { module: 'kailing', url: '/lqadapter/applyRedConfirm', method: 'POST', comment: '数电红字确认单申请 QDHZQRDSQ' },
  confirmRedConfirm: { module: 'kailing', url: '/lqadapter/confirmRedConfirm', method: 'POST', comment: '数电红字确认单确认 QDHZQRDQR' },
  // 6. 红字发票开具
  createRedlqadapter: { module: 'kailing', url: '/lqadapter/createRedlqadapter', method: 'POST', comment: '创建数电红字发票（自定义）' },
  pageRedlqadapters: { module: 'kailing', url: '/lqadapter/pageRedlqadapters', method: 'POST', comment: '红字发票列表分页（自定义）' }
};

export default kailing;