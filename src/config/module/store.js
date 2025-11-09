const store = {
  /**
   * 商品管理库存
   */
  // 查询私有商品信息分页
  queryPrivateProductPage: { module: 'store', url: '/product/queryPrivateProductPage', method: 'POST', comment: '' },
  saveOrEditPrivateProduct: { module: 'store', url: '/product/saveOrEditPrivateProduct', method: 'POST', comment: '保存私有商品' },
  // 添加修改私有商品信息
  deletePrivateProduct: { module: 'store', url: '/product/deletePrivateProduct', method: 'POST', comment: '' }, // 删除私有产品
  // 朗致库存
  queryLonchProductExtendPage: { module: 'store', url: '/product/queryLonchProductExtendPage', method: 'POST', comment: '' }, // 根据仓库查询朗致商品扩展信息(选择信息列表)
  selectLonchProduct: { module: 'store', url: '/product/selectLonchProduct', method: 'POST', comment: '' }, // 添加朗致商品
  queryLonchProductByStore: { module: 'store', url: '/product/queryLonchProductByStore', method: 'POST', comment: '' }, // 根据仓库查询朗致商品信息和库存信息
  editProductStockValue: { module: 'store', url: '/product/editProductStockValue', method: 'POST', comment: '' }, // 根据仓库查询朗致商品信息和库存信息
  deleteLonchProduct: { module: 'store', url: '/product/deleteLonchProduct', method: 'POST', comment: '' }, // 删除朗致商品
  saveOrEditLonchProduct: { module: 'store', url: '/product/saveOrEditLonchProduct', method: 'POST', comment: '' }, // 修改朗致商品库存值
  queryFifoDetailsLonchPage: { module: 'store', url: '/fifo/queryFifoDetailsLonchPage', method: 'POST', comment: '' }, // 查询出入库明细列表--朗致 分页
  queryFifoDetailsPrivatePage: { module: 'store', url: '/fifo/queryFifoDetailsPrivatePage', method: 'POST', comment: '' },
  /* 查询出入库明细列表--私有 分页 核销对账*/
  queryStoreBillsPageByStore: { module: 'store', url: '/bills/queryStoreBillsPageByStore', method: 'POST', comment: '查询核销对账列表 分页' },
  queryDetailsPageByBills: { module: 'store', url: '/bills/queryDetailsPageByBills', method: 'POST', comment: '' }, // 根据单据查询明细 分页
  updateStatusByBills: { module: 'store', url: '/bills/updateStatusByBills', method: 'POST', comment: '' }, // 修改核销状态
  /**
   * 订单管理
   */
  queryOrdersByAccount: {module: 'store', url: '/originalOrder/queryOrdersByAccount', method: 'POST', comment: ''}, // 原始订单查询
  queryDetailsByOrder: {module: 'store', url: '/originalOrder/queryDetailsByOrder', method: 'POST', comment: ''}, // 原始订单详情
  orderQueryOrdersByAccount: {module: 'store', url: '/order/queryOrdersByAccount ', method: 'POST', comment: ''}, // 销售订单查询
  orderQueryDetailsByOrder: {module: 'store', url: '/order/queryDetailsByOrder', method: 'POST', comment: ''}, // 销售、采购订单详情
  closeOriginalOrder: {module: 'store', url: '/originalOrder/closeOriginalOrder', method: 'POST', comment: '关闭原始订单'},
  queryDeliveryInfoByOrder: {module: 'store', url: '/originalOrderDelivery/queryDeliveryInfoByOrder', method: 'POST', comment: '根据原始订单查询原始订单发货信息'},
  updateDeliveryInfo: {module: 'store', url: '/originalOrderDelivery/updateDeliveryInfo', method: 'POST', comment: '修改原始订单发货信息'},
  commonQuerySalesListByName: {module: 'store', url: '/common/querySalesListByName', method: 'POST', comment: '根据姓名查询业务员信息'},
  /**
   * 库存管理
   */
  queryFifoDetailsByAccount: { module: 'store', url: '/fifo/queryFifoDetailsByAccount', method: 'POST', comment: '销售、采购订单详情' },
  productFifoDetailsPrivatePage: { module: 'store', url: '/fifoOther/queryFifoDetailsPrivatePage', method: 'POST', comment: '出入库管理' },
  queryFifoOtherPage: { module: 'store', url: '/fifoOther/queryFifoOtherPage', method: 'POST', comment: '' }, // 出入库管理
  saveOrEditOtherFifo: { module: 'store', url: '/fifoOther/saveOrEditOtherFifo', method: 'POST', comment: '' }, // 其他出入库管理

  queryLogisticsCompanys: { module: 'store', url: '/logistics/queryLogisticsCompanys', method: 'POST', comment: '查询物流公司列表' }, // 其他出入库管理

  queryLogisticsByOrder: { module: 'store', url: '/order/queryLogisticsByOrder', method: 'POST', comment: '根据出库订单查看物流信息' },
  saveLogisticsByOrder: { module: 'store', url: '/order/saveLogisticsByOrder', method: 'POST', comment: '根据出库订单保存编辑物流信息' },

  queryFifoOrdersByAccount: { module: 'store', url: '/fifo/queryFifoOrdersByAccount', method: 'POST', comment: '查询出入库订单列表' },
  queryDetailsByFifoId: { module: 'store', url: '/fifo/queryDetailsByFifoId', method: 'POST', comment: '根据出入库订单查看明细' },
  queryLogisticsByFifoId: { module: 'store', url: '/fifo/queryLogisticsByFifoId', method: 'POST', comment: '根据出库订单查看物流信息' },
  saveLogisticsByFifoId: { module: 'store', url: '/fifo/saveLogisticsByFifoId', method: 'POST', comment: '根据出库订单保存编辑物流信息' },
  confirmOutWarehouseByFifoId: { module: 'store', url: '/fifo/confirmOutWarehouseByFifoId', method: 'POST', comment: '根据出库订单确认生成平台出库单' },
  /**
   * 进销存对接标的
   */
  queryProductCosmeticsList: { module: 'store', url: '/lonchOot/queryProductCosmeticsList', method: 'POST', comment: '查询化妆品列表分页' },
  queryProductDeviceList: { module: 'store', url: '/lonchOot/queryProductDeviceList', method: 'POST', comment: '查询器械列表列表分页' },
  queryProductDisinfectionList: { module: 'store', url: '/lonchOot/queryProductDisinfectionList', method: 'POST', comment: '查询消毒品列表分页' },
  queryProductDrugList: { module: 'store', url: '/lonchOot/queryProductDrugList', method: 'POST', comment: '查询药品列表分页' },
  queryProductFoodList: { module: 'store', url: '/lonchOot/queryProductFoodList', method: 'POST', comment: '查询食品列表列表分页' },
  queryProductOtherList: { module: 'store', url: '/lonchOot/queryProductOtherList', method: 'POST', comment: '查询其他列表分页' },
  queryProductPageByAccount: { module: 'store', url: '/product/queryProductPageByAccount', method: 'POST', comment: '批号批次管理查询商品' },
  productQueryProductPage: { module: 'store', url: '/product/queryProductPage', method: 'POST', comment: '查询商品信息分页' },
  productQueryProductDetails: { module: 'store', url: '/product/queryProductDetails', method: 'POST', comment: '根据id查询商品详情' },
  /**
   * 进销存期初单据
   */
  approverInitialBill: { module: 'store', url: '/initialBill/approverInitialBill', method: 'POST', comment: '审批期初单据' },
  auditInitialBill: { module: 'store', url: '/initialBill/auditInitialBill', method: 'POST', comment: '审核期初单据' },
  queryLonchInitialBillDetailsById: { module: 'store', url: '/initialBill/queryLonchInitialBillDetailsById', method: 'POST', comment: '根据单据id查询朗致商品单据详情' },
  queryPrivateInitialBillDetailsById: { module: 'store', url: '/initialBill/queryPrivateInitialBillDetailsById', method: 'POST', comment: '根据单据id查询私有商品单据详情' },
  queryPrivateInitialBillList: { module: 'store', url: '/initialBill/queryPrivateInitialBillList', method: 'POST', comment: '查询私有商品单据列表' },
  queryLonchInitialBillList: { module: 'store', url: '/initialBill/queryLonchInitialBillList', method: 'POST', comment: '查询朗致商品单据列表' },
  queryNewestBill: { module: 'store', url: '/initialBill/queryNewestBill', method: 'POST', comment: '查询朗致商品原期初' },
  updateInitialBill: { module: 'store', url: '/initialBill/updateInitialBill', method: 'POST', comment: '修改期初确认单、调整单' },
  saveInitialBill: { module: 'store', url: '/initialBill/saveInitialBill', method: 'POST', comment: '保存期初确认单、调整单' },

  initialBillQueryProductInitialBillList: { module: 'store', url: '/initialBill/queryProductInitialBillList', method: 'POST', comment: '查询商品单据列表' },
  initialBillQueryProductInitialBillDetailsById: { module: 'store', url: '/initialBill/queryProductInitialBillDetailsById', method: 'POST', comment: '根据单据id查询商品单据详情' },
  archivesQueryBatchNumByProductId: { module: 'store', url: '/archives/queryBatchNumByProductId', method: 'POST', comment: '期初单据，根据商品查询批号' },
  archivesQueryBatchByBatchNumId: { module: 'store', url: '/archives/queryBatchByBatchNumId', method: 'POST', comment: '根据批号查询批次' },
  orderSaveInitialBill: { module: 'store', url: '/order/saveInitialBill', method: 'POST', comment: '保存修改销售采购单据--功能录入' },
  orderEffectFunctionEntryOrder: { module: 'store', url: '/order/effectFunctionEntryOrder', method: 'POST', comment: '生效--销售采购单据(功能录入才能手动点击)' },
  orderQueryOrderDetailsById: { module: 'store', url: '/order/queryOrderDetailsById', method: 'POST', comment: '根据订单查看明细' },
  orderEffectFunctionEntryFifo: { module: 'store', url: '/order/effectFunctionEntryFifo', method: 'POST', comment: '生效--出库单据(功能录入才能手动点击)' },
  queryStoreAccountList: { module: 'store', url: '/common/queryStoreAccountList', method: 'POST', comment: '查询仓库账号列表信息' },
  /**
  * 第三方平台对接
  */
  queryStoreErpList: { module: 'store', url: '/erp/queryStoreErpList', method: 'POST', comment: '查询朗致商品单据列表' },
  saveStoreErp: { module: 'store', url: '/erp/saveStoreErp', method: 'POST', comment: '保存erp配置' },
  /**
   * 业务字典 批号批次管理
   */
  archivesQueryBatchNumList: { module: 'store', url: '/archives/queryBatchNumList', method: 'POST', comment: '查询批号商品列表' },
  archivesSaveBatchNumArchives: { module: 'store', url: '/archives/saveBatchNumArchives', method: 'POST', comment: '保存批号档案' },
  archivesQueryBatchList: { module: 'store', url: '/archives/queryBatchList', method: 'POST', comment: '查询批次商品列表' },
  archivesSaveBatchArchives: { module: 'store', url: '/archives/saveBatchArchives', method: 'POST', comment: '保存批次档案' },
  archivesQueryBatchNumDetailsById: { module: 'store', url: '/archives/queryBatchNumDetailsById', method: 'POST', comment: '根据批号id查询批号商品信息' },

  /**
   * 预出库单
   */
  preDeliveryQueryStoreErpList: {module: 'store', url: '/preDeliveryOrder/queryStoreErpList', method: 'POST', comment: '查询预出库单据列表'},
  preDeliveryApproverPreDeliveryOrder: {module: 'store', url: '/preDeliveryOrder/approverPreDeliveryOrder', method: 'POST', comment: '审批预出库单'},
  preDeliveryAuditPreDeliveryOrder: {module: 'store', url: '/preDeliveryOrder/auditPreDeliveryOrder', method: 'POST', comment: '审核预出库单'},
  preDeliveryQueryPreDeliveryOrderById: {module: 'store', url: '/preDeliveryOrder/queryPreDeliveryOrderById', method: 'POST', comment: '根据预出库单id查询详情信息'},

  /**
   * 新其他出入库单
   */
  queryOtherOutInBoundList: {module: 'store', url: '/outInBound/queryOtherOutInBoundList', method: 'POST', comment: '查询其他出入库单据列表'},
  queryOtherOutInBoundDetails: {module: 'store', url: '/outInBound/queryOtherOutInBoundDetails', method: 'POST', comment: '根据出入库id查询单据详情'},
  saveOtherOutInBound: {module: 'store', url: '/outInBound/saveOtherOutInBound', method: 'POST', comment: '保存其他出入库单据'},
  auditOtherOutInBound: {module: 'store', url: '/outInBound/auditOtherOutInBound', method: 'POST', comment: '审核其他出入库单据'},
  reviewOtherOutInBound: {module: 'store', url: '/outInBound/reviewOtherOutInBound', method: 'POST', comment: '复核其他出入库单据'},
  queryAuthenticationList: {module: 'store', url: '/common/queryAuthenticationList', method: 'POST', comment: '查询核名认证机构列表信息'},
  queryHumanList: {module: 'store', url: '/common/queryHumanList', method: 'POST', comment: '查询自然人列表信息'},
  queryAccountList: {module: 'store', url: '/common/queryAccountList', method: 'POST', comment: '查询账号列表信息'},

  //获取用户权限
  queryTenantByCellphoneAndName: {module: 'store', url: '/tenant/queryTenantByCellphoneAndName', method: 'POST', comment: '进销存管理员查询用户账号信息'},
  queryStockApplyList: { module: 'store', url: '/tenant/queryStockApplyList', method: 'POST', comment: '查询库存组织申请单列表' },
  //业务档案
  auditPurchasePriceAdjust: { module:'store', url: '/price/auditPurchasePriceAdjust', method: 'POST', comment: '采购价格调整单的审核' },
  auditPurchasePriceApply: { module:'store', url: '/price/auditPurchasePriceApply', method: 'POST', comment: '采购价格申请单的审核' },
  auditSalePriceAdjust: { module:'store', url: '/price/auditSalePriceAdjust', method: 'POST', comment: '销售价格调整单的审核' },
  auditSalePriceApply: { module:'store', url: '/price/auditSalePriceApply', method: 'POST', comment: '销售价格申请单的审核' },
  queryPurchasePriceAdjustList: { module:'store', url: '/price/queryPurchasePriceAdjustList', method: 'POST', comment: '采购价格调整单查询列表' },
  queryPurchasePriceApplyList: { module:'store', url: '/price/queryPurchasePriceApplyList', method: 'POST', comment: '采购价格申请单查询列表' },
  queryPurchasePriceArchivesList: { module:'store', url: '/price/queryPurchasePriceArchivesList', method: 'POST', comment: '采购价格档案查询列表' },
  querySalePriceArchivesList: { module:'store', url: '/price/querySalePriceArchivesList', method: 'POST', comment: '销售价格档案查询列表' },
  querySalePriceAdjustList: { module:'store', url: '/price/querySalePriceAdjustList', method: 'POST', comment: '销售价格调整单查询列表' },
  querySalePriceApplyList: { module:'store', url: '/price/querySalePriceApplyList', method: 'POST', comment: '销售价格申请单查询列表' },
  savePurchasePriceAdjust: { module:'store', url: '/price/savePurchasePriceAdjust', method: 'POST', comment: '采购价格调整单保存' },
  savePurchasePriceApply: { module:'store', url: '/price/savePurchasePriceApply', method: 'POST', comment: '采购价格申请单保存' },
  saveSalePriceAdjust: { module:'store', url: '/price/saveSalePriceAdjust', method: 'POST', comment: '销售价格调整单保存' },
  saveSalePriceApply: { module:'store', url: '/price/saveSalePriceApply', method: 'POST', comment: '销售价格申请单保存' },
  querySettlementPrice: { module:'store', url: '/price/querySettlementPrice', method: 'POST', comment: '查询商品结算价' },
  queryPriceAuditRecordByBillId: { module:'store', url: '/price/queryPriceAuditRecordByBillId', method: 'POST', comment: '查询审核详情' },
  //仓库列表
  auditWarehouseApply: { module:'store', url: '/warehouse/auditWarehouseApply', method: 'POST', comment: '仓库创建申请单审核' },
  queryStockOrgList: { module:'store', url: '/warehouse/queryStockOrgList', method: 'POST', comment: '查询库存组织列表' },
  queryStoreManageList: { module:'store', url: '/warehouse/queryStoreManageList', method: 'POST', comment: '查询仓库列表' },
  queryWarehouseApplyList: { module:'store', url: '/warehouse/queryWarehouseApplyList', method: 'POST', comment: '库创建申请单查询列表' },
  saveWarehouseApply: { module:'store', url: '/warehouse/saveWarehouseApply', method: 'POST', comment: '保存仓库创建申请单' },
  //库存租住
  queryStockOrgListByOwnerId: { module:'store', url: '/warehouse/queryStockOrgListByOwnerId', method: 'POST', comment: '根据租户查询库存组织' },

  queryStockOrgListByPermission: { module:'store', url: '/warehouse/queryStockOrgListByPermission', method: 'POST', comment: '库存组织' },

  supplierAuditSupplierArchivesAddApply   : { module: "store", url: "/supplier/auditSupplierArchivesAddApply", method: "POST", comment: "审核供应商新增申请" },
  supplierAuditSupplierArchivesModifyApply: { module: "store", url: "/supplier/auditSupplierArchivesModifyApply", method: "POST", comment: "审核供应商修改申请" },
  supplierQueryAddApplyList               : { module: "store", url: "/supplier/queryAddApplyList", method: "POST", comment: "查询供应商新增申请列表" },
  supplierQueryModifyApplyList            : { module: "store", url: "/supplier/queryModifyApplyList", method: "POST", comment: "查询供应商修改申请列表" },
  supplierQuerySupplierArchivesList       : { module: "store", url: "/supplier/querySupplierArchivesList", method: "POST", comment: "查询供应商档案结果列表" },
  supplierSaveSupplierArchiveApply        : { module: "store", url: "/supplier/saveSupplierArchiveApply", method: "POST", comment: "保存供应商档案新增申请单" },
  supplierSaveSupplierArchiveModify       : { module: "store", url: "/supplier/saveSupplierArchiveModify", method: "POST", comment: "保存供应商档案修改申请单" },
  supplierQueryAddApplyDetails            : { module: "store", url: "/supplier/queryAddApplyDetails", method: "POST", comment: "根据id查询供应商新增申请详情信息"},
  supplierQueryModifyApplyDetails         : { module: "store", url: "/supplier/queryModifyApplyDetails", method: "POST", comment: "根据id查询供应商修改申请详情信息"},
  supplierQuerySupplierArchivesDetails    : { module: "store", url: "/supplier/querySupplierArchivesDetails", method: "POST", comment: "根据id查询供应商档案结果集详情信息"},


  customerAuditCustomerArchivesAddApply   : { module: "store", url: "/customer/auditCustomerArchivesAddApply", method: "POST", comment: "审核客户新增申请" },
  customerAuditCustomerArchivesModifyApply: { module: "store", url: "/customer/auditCustomerArchivesModifyApply", method: "POST", comment: "审核客户修改申请" },
  customerQueryAddApplyList               : { module: "store", url: "/customer/queryAddApplyList", method: "POST", comment: "查询客户新增申请列表" },
  customerQueryCustomerArchivesList       : { module: "store", url: "/customer/queryCustomerArchivesList", method: "POST", comment: "查询客户档案结果列表" },
  customerQueryModifyApplyList            : { module: "store", url: "/customer/queryModifyApplyList", method: "POST", comment: "查询客户修改申请列表" },
  customerSaveCustomerArchiveApply        : { module: "store", url: "/customer/saveCustomerArchiveApply", method: "POST", comment: "保存客户档案新增申请单" },
  customerSaveCustomerArchiveModify       : { module: "store", url: "/customer/saveCustomerArchiveModify", method: "POST", comment: "保存客户档案修改申请单" },
  customerQueryAddApplyDetails            : { module: "store", url: "/customer/queryAddApplyDetails", method: "POST", comment: "根据id查询客户新增申请详情信息"},
  customerQueryCustomerArchivesDetails    : { module: "store", url: "/customer/queryCustomerArchivesDetails", method: "POST", comment: "根据id查询客户档案结果详情信息"},
  customerQueryModifyApplyDetails         : { module: "store", url: "/customer/queryModifyApplyDetails", method: "POST", comment: "根据id查询客户修改申请详情信息"},


  commonQueryHumanAuthById   : { module: "store", url: "/common/queryHumanAuthById", method: "POST", comment: "根据id查询人员(有认证状态)信息" },
  commonQueryHumanAuthList   : { module: "store", url: "/common/queryHumanAuthList", method: "POST", comment: "查询人员(有认证状态)列表" },
  commonQueryOrganizeAuthById: { module: "store", url: "/common/queryOrganizeAuthById", method: "POST", comment: "根据id查询机构(有认证状态)信息" },
  commonQueryOrganizeAuthList: { module: "store", url: "/common/queryOrganizeAuthList", method: "POST", comment: "查询机构(有认证状态)列表" },
  commonQueryProvinceByOrg   : { module: "store", url: "/common/queryProvinceByOrg", method: "POST", comment: "省总列表" },


  queryEstimationPriceTypeList        : { module: "store", url: "/estimationPrice/queryEstimationPriceTypeList", method: "POST", comment: "暂估价格类型-列表" },
  queryEstimationPriceTypeDetails     : { module: "store", url: "/estimationPrice/queryEstimationPriceTypeDetails", method: "POST", comment: "暂估价格类型-详情" },
  updateEstimationPriceTypeDescription: { module: "store", url: "/estimationPrice/updateEstimationPriceTypeDescription", method: "POST", comment: "暂估价格类型-编辑" },
  
  queryEstimationPriceAddApplyList   : { module: "store", url: "/estimationPrice/queryEstimationPriceAddApplyList", method: "POST", comment: "暂估价格创建申请单-列表" },
  queryEstimationPriceAddApplyDetails: { module: "store", url: "/estimationPrice/queryEstimationPriceAddApplyDetails", method: "POST", comment: "暂估价格创建申请单-详情" },
  saveEstimationPriceAddApply        : { module: "store", url: "/estimationPrice/saveEstimationPriceAddApply", method: "POST", comment: "暂估价格创建申请单-创建/编辑" },
  delEstimationPriceAddApply         : { module: "store", url: "/estimationPrice/delEstimationPriceAddApply", method: "POST", comment: "暂估价格创建申请单-删除" },
  auditEstimationPriceAddApply       : { module: "store", url: "/estimationPrice/auditEstimationPriceAddApply", method: "POST", comment: "暂估价格创建申请单-审核" },

  queryEstimationPriceModifyApplyList   : { module: "store", url: "/estimationPrice/queryEstimationPriceModifyApplyList", method: "POST", comment: "暂估价格修改申请单-列表" },
  queryEstimationPriceModifyApplyDetails: { module: "store", url: "/estimationPrice/queryEstimationPriceModifyApplyDetails", method: "POST", comment: "暂估价格修改申请单-详情" },
  saveEstimationPriceModifyApply        : { module: "store", url: "/estimationPrice/saveEstimationPriceModifyApply", method: "POST", comment: "暂估价格修改申请单-创建/编辑" },
  delEstimationPriceModifyApply         : { module: "store", url: "/estimationPrice/delEstimationPriceModifyApply", method: "POST", comment: "暂估价格修改申请单-删除" },
  auditEstimationPriceModifyApply       : { module: "store", url: "/estimationPrice/auditEstimationPriceModifyApply", method: "POST", comment: "暂估价格修改申请单-审核" },
  
  queryStoreEstimationPriceList         : { module: "store", url: "/estimationPrice/queryStoreEstimationPriceList", method: "POST", comment: "暂估价格结果集-列表" },
  queryStoreEstimationPriceDetails      : { module: "store", url: "/estimationPrice/queryStoreEstimationPriceDetails", method: "POST", comment: "暂估价格结果集-详情" },

  queryEstimationStoreProductDetails      : { module: "store", url: "/estimationPrice/queryEstimationStoreProductDetails", method: "POST", comment: "查询暂估价格档案-进销存商品详情" },
}

export default store
