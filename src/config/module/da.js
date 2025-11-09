const da = {
  bizDic: {
    createBizDic: { module: 'da', url: '/bizDic/createBizDic',method: 'POST', comment: '' },
    editBizDic: { module: 'da', url: '/bizDic/editBizDic', method: 'POST', comment: ''},
    getAllBizDic: { module: 'da', url: '/bizDic/getAllBizDic', method: 'POST', comment: '' }
  },
  assetDelivery:{
    deliveryApplyAudit: { module: 'da', url: '/deliveryApply/audit', method: 'POST',comment: '审核/审批申请' },
    deliveryApplyCreate: { module: 'da', url: '/deliveryApply/create', method: 'POST',comment: '创建' },
    deliveryApplyDelete: { module: 'da', url: '/deliveryApply/delete', method: 'POST',comment: '删除，传ID' },
    deliveryApplyList: { module: 'da', url: '/deliveryApply/list', method: 'POST',comment: '分页查询列表' },
    deliveryApplyUpdate: { module: 'da', url: '/deliveryApply/update', method: 'POST',comment: '更新' },
    deliveryApplyView: { module: 'da', url: '/deliveryApply/view', method: 'POST',comment: '查询详情，传ID' },
  },
  /**
   * 分页查询列表
   */
  merchantDeliveryList: { module: 'da', url: '/merchantDelivery/list', method: 'POST', comment: '分页查询列表' },
  /**
   * 查询详情，传ID
   */
  merchantDeliveryView: { module: 'da', url: '/merchantDelivery/view', method: 'POST', comment: '查询详情，传ID' },
  /**
   * 审核/审批申请
   */
  merchantDeliveryApplyAudit: { module: 'da', url: '/merchantDeliveryApply/audit', method: 'POST', comment: '审核/审批申请' },
  /**
   * 校验签字人接口，返回0-非法签字人或未审核通过 1-负责人 2商户管理员 3-签字流程完成 4商户管理员但未到签字步骤
   */
  merchantDeliveryApplyCheckSignHuman: { module: 'da', url: '/merchantDeliveryApply/checkSignHuman', method: 'POST', comment: '校验签字人接口，返回0-非法签字人或未审核通过 1-负责人 2商户管理员 3-签字流程完成 4商户管理员但未到签字步骤' },
  /**
   * 删除，传ID
   */
  merchantDeliveryApplyDelete: { module: 'da', url: '/merchantDeliveryApply/delete', method: 'POST', comment: '删除，传ID' },
  /**
   * 分页查询列表
   */
  merchantDeliveryApplyList: { module: 'da', url: '/merchantDeliveryApply/list', method: 'POST', comment: '分页查询列表' },
  /**
   * 分页查询指令列表
   */
  merchantDeliveryApplyListDirective: { module: 'da', url: '/merchantDeliveryApply/listDirective', method: 'POST', comment: '分页查询指令列表' },
  /**
   * 签字接口
   */
  merchantDeliveryApplySign: { module: 'da', url: '/merchantDeliveryApply/sign', method: 'POST', comment: '签字接口' },
  /**
   * 创建或更新
   */
  merchantDeliveryApplyUpdate: { module: 'da', url: '/merchantDeliveryApply/update', method: 'POST', comment: '创建或更新' },
  /**
   * 查询详情，传ID
   */
  merchantDeliveryApplyView: { module: 'da', url: '/merchantDeliveryApply/view', method: 'POST', comment: '查询详情，传ID' },
  /**
   * 查询指令详情，传ID
   */
  merchantDeliveryApplyViewDirective: { module: 'da', url: '/merchantDeliveryApply/viewDirective', method: 'POST', comment: '查询指令详情，传ID' },
}

export default da
