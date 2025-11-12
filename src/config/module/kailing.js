const kailing = {
  // 1. 前置处理
  queryPreprocess: { module: 'kailing', url: '/lqadapter/digitalInvoice/queryPreprocess', method: 'POST', comment: '查询前置处理结果' },
  executePreprocess: { module: 'kailing', url: '/lqadapter/digitalInvoice/executePreprocess', method: 'POST', comment: '执行前置处理' },

  // 2. 额度下载/退回记录
  pageQuotaRecords: { module: 'kailing', url: '/lqadapter/quota/pageQuotaRecords', method: 'POST', comment: '发票额度记录分页查询' },
  operateQuota: { module: 'kailing', url: '/lqadapter/quota/operateQuota', method: 'POST', comment: '下载/退回发票额度' },
  adjustValidity: { module: 'kailing', url: '/lqadapter/quota/adjustValidity', method: 'POST', comment: '调整发票额度有效期' },

  // 3. 数电发票
  digitalInvoiceList: { module: 'kailing', url: '/lqadapter/digitalInvoice/list', method: 'POST', comment: '分页查询数电发票信息' },
  digitalInvoiceAdd: { module: 'kailing', url: '/lqadapter/digitalInvoice/add', method: 'POST', comment: '新增数电发票并创建上传任务' },
  digitalInvoiceAudit: { module: 'kailing', url: '/lqadapter/digitalInvoice/review', method: 'POST', comment: '审核数电发票' },
  digitalInvoiceQuery: { module: 'kailing', url: '/lqadapter/digitalInvoice/query', method: 'POST', comment: '查询数电发票明细' },

  // 4. 红字确认单（沿用旧路径，等待新规范）
  pageRedConfirmList: { module: 'kailing', url: '/lqadapter/pageRedConfirmList', method: 'POST', comment: '查询数电红字确认单列表信息' },
  queryRedConfirmDetail: { module: 'kailing', url: '/lqadapter/queryRedConfirmDetail', method: 'POST', comment: '查询数电红字确认单明细信息' },
  applyRedConfirm: { module: 'kailing', url: '/lqadapter/applyRedConfirm', method: 'POST', comment: '数电红字确认单申请' },
  confirmRedConfirm: { module: 'kailing', url: '/lqadapter/confirmRedConfirm', method: 'POST', comment: '数电红字确认单确认' }
};

export default kailing;
