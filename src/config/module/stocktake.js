/*
 * @Author: tuWei
 * @Date: 2022-12-13 11:25:31
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2023-04-14 20:10:38
 */
const stocktake = {
  //规则申请
  auditApply: { module: 'stocktake', url: '/ruleApply/auditApply', method: 'POST', comment: '审核申请单据' },
  queryRuleApplyDetailsById: { module: 'stocktake', url: '/ruleApply/queryRuleApplyDetailsById', method: 'POST', comment: '查询规则申请详情' },
  queryRuleApplyList: { module: 'stocktake', url: '/ruleApply/queryRuleApplyList', method: 'POST', comment: '查询规则申请列表' },
  saveRuleApply: { module: 'stocktake', url: '/ruleApply/saveRuleApply', method: 'POST', comment: '保存规则申请' },
  //规则修改
  auditModify: { module: 'stocktake', url: '/ruleModify/auditModify', method: 'POST', comment: '审核修改单据' },
  queryRuleModifyDetailsById: { module: 'stocktake', url: '/ruleModify/queryRuleModifyDetailsById', method: 'POST', comment: '查询规则修改详情' },
  queryRuleModifyList: { module: 'stocktake', url: '/ruleModify/queryRuleModifyList', method: 'POST', comment: '查询规则修改列表' },
  saveRuleModify: { module: 'stocktake', url: '/ruleModify/saveRuleModify', method: 'POST', comment: '保存规则修改' },
  
  //终止盘点规则
  auditInvalid: { module: 'stocktake', url: '/ruleResult/auditInvalid', method: 'POST', comment: '审核规则终止' },
  queryRuleInvalidList: { module: 'stocktake', url: '/ruleResult/queryRuleInvalidList', method: 'POST', comment: '查询规则终止列表' },
  queryRuleResultDetailsById: { module: 'stocktake', url: '/ruleResult/queryRuleResultDetailsById', method: 'POST', comment: '查询规则结果集详情' },
  //结果集
  queryRuleResultList: { module: 'stocktake', url: '/ruleResult/queryRuleResultList', method: 'POST', comment: '查询规则结果集列表' },
  saveRuleInvalid: { module: 'stocktake', url: '/ruleResult/saveRuleInvalid', method: 'POST', comment: '增加规则终止' },
  queryStockOrgList: { module: 'stocktake', url: '/unifiedUser/queryStockOrgList', method: 'POST', comment: '查询库存组织列表' },
  queryObjectProductList: { module: 'stocktake', url: '/store/queryObjectProductList', method: 'POST', comment: '查询库存组织下盘点对象的商品列表' },
  queryProductList: { module: 'stocktake', url: '/store/queryProductList', method: 'POST', comment: '查询库存商品' },
  
  //盘点台账
  auditStandingBook: { module: 'stocktake', url: '/standingBook/auditStandingBook', method: 'POST', comment: '审核台账' },
  queryStandingBookList: { module: 'stocktake', url: '/standingBook/queryStandingBookList', method: 'POST', comment: '查询盘点台账列表' },
  updateStandingBook: { module: 'stocktake', url: '/standingBook/updateStandingBook', method: 'POST', comment: '修改盘点台账' },
  queryInventoryRecordList: { module: 'stocktake', url: '/standingBook/queryInventoryRecordList', method: 'POST', comment: '查询盘点台账记录' },

  //盘点任务列表
  queryTaskList: { module: 'stocktake', url: '/ruleTask/queryTaskList', method: 'POST', comment: '查询任务列表' },

  // 盘点模板申请单
  auditCountingTemplate: { module: "stocktake", url: "/countingRuleTemplate/auditCountingTemplate", method: "POST", comment: "审核模板申请单据"},
  queryCountingRuleTemplateDetails: { module: "stocktake", url: "/countingRuleTemplate/queryCountingRuleTemplateDetails", method: "POST", comment: "查询模板新增申请详情"},
  queryCountingRuleTemplateList: { module: "stocktake", url: "/countingRuleTemplate/queryCountingRuleTemplateList", method: "POST", comment: "查询模板新增申请列表"},
  saveCountingRuleTemplate: { module: "stocktake", url: "/countingRuleTemplate/saveCountingRuleTemplate", method: "POST", comment: "保存模板新增申请"},
  saveRuleTemplateRefStockOrg: { module: "stocktake", url: "/countingRuleTemplate/saveRuleTemplateRefStockOrg", method: "POST", comment: "下发库存组织"},
  queryStockOrgByTemplate: { module: "stocktake", url: "/countingRuleTemplate/queryStockOrgByTemplate", method: "POST", comment: "根据模板查询下发给的库存组织"},

  // 盘点规则作废申请单
  auditCountingInvalid: { module: "stocktake", url: "/countingRuleInvalid/auditCountingInvalid", method: "POST", comment: "审核作废申请单单据" },
  queryCountingRuleInvalidList: { module: "stocktake", url: "/countingRuleInvalid/queryCountingRuleInvalidList", method: "POST", comment: "查询作废申请单列表" },
  saveCountingRuleInvalid: { module: "stocktake", url: "/countingRuleInvalid/saveCountingRuleInvalid", method: "POST", comment: "保存规则作废申请单" },

  // 盘点规则修改申请单
  auditCountingModify: { module: "stocktake", url: "/countingRuleModify/auditCountingModify", method: "POST", comment: "审核修改申请单据" },
  queryCountingRuleModifyDetails: { module: "stocktake", url: "/countingRuleModify/queryCountingRuleModifyDetails", method: "POST", comment: "查询规则修改申请详情" },
  queryCountingRuleModifyList: { module: "stocktake", url: "/countingRuleModify/queryCountingRuleModifyList", method: "POST", comment: "查询修改申请列表" },
  saveCountingRuleModify: { module: "stocktake", url: "/countingRuleModify/saveCountingRuleModify", method: "POST", comment: "保存规则修改申请" },

  // 盘点规则新增申请单
  auditCountingApply: { module: "stocktake", url: "/countingRuleApply/auditCountingApply", method: "POST", comment: "审核新增申请单据"},
  queryCountingRuleApplyDetails: { module: "stocktake", url: "/countingRuleApply/queryCountingRuleApplyDetails", method: "POST", comment: "查询规则新增申请详情"},
  queryCountingRuleApplyList: { module: "stocktake", url: "/countingRuleApply/queryCountingRuleApplyList", method: "POST", comment: "查询规则新增申请列表"},
  saveCountingRuleApply: { module: "stocktake", url: "/countingRuleApply/saveCountingRuleApply", method: "POST", comment: "保存规则新增申请"},

  // 盘点规则结果集
  queryCountingRuleResultDetails: { module: "stocktake", url: "/countingRuleResult/queryCountingRuleResultDetails", method: "POST", comment: "查询规则结果集详情" },
  queryCountingRuleResultList: { module: "stocktake", url: "/countingRuleResult/queryCountingRuleResultList", method: "POST", comment: "查询规则结果集列表" },
  

  // 库存组织
  queryAllStockOrgList: { module: "stocktake", url: "/unifiedUser/queryAllStockOrgList", method: "POST", comment: "查询所有的库存组织列表" },
  
  // 台账列表
  countingLedgerAuditLedger    : { module: "stocktake", url: "/countingLedger/auditLedger", method: "POST", comment: "审核台账" },
  countingLedgerQueryLedgerList: { module: "stocktake", url: "/countingLedger/queryLedgerList", method: "POST", comment: "查询盘点台账列表" },
  countingLedgerSaveActualNum  : { module: "stocktake", url: "/countingLedger/saveActualNum", method: "POST", comment: "录入实存量" },

  // 盘点任务
  queryCountingTaskList  : { module: "stocktake", url: "/ruleTask/queryCountingTaskList", method: "POST", comment: "查询盘点任务列表" },

  // 批号
  queryBatchNumByProduct  : { module: "stocktake", url: "/store/queryBatchNumByProduct", method: "POST", comment: "根据商品查询批号列表" },
  queryBatchNumById  : { module: "stocktake", url: "/store/queryBatchNumById", method: "POST", comment: "根据批号ids查询批号列表" },
}

export default stocktake;