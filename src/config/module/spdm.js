const spdm = {
  orgListStockOrg: {
    module: 'ims',
    url: '/org/listStockOrg',
    method: 'POST',
    comment: '查询库存组织(有权限控制)'
  },
  pagedOriginalProduct: {
    module: 'ims',
    url: '/original/pagedOriginalProduct',
    method: 'POST',
    comment: '分页查询原始商品'
  },
  queryProduct: {
    module: 'ims',
    url: '/original/queryProduct',
    method: 'POST',
    comment: '查询商品'
  },
  queryGoods: {
    module: 'oot',
    url: '/open/queryGoods',
    method: 'POST',
    comment: '查询商品信息'
  },
  map:{
    createApply: {
      module: 'ims',
      url: '/map/createApply',
      method: 'POST',
      comment: '创建申请单'
    },
    createUpdateApply: {
      module: 'ims',
      url: '/map/updateApply',
      method: 'POST',
      comment: '修改申请单'
    },
    createNullifyApply: {
      module: 'ims',
      url: '/map/nullifyApply',
      method: 'POST',
      comment: '终止申请单'
    },
    editApply: {
      module: 'ims',
      url: '/map/editApply',
      method: 'POST',
      comment: '编辑申请单'
    },
    delApply: {
      module: 'ims',
      url: '/map/delApply',
      method: 'POST',
      comment: '删除申请单'
    },
    auditApply: {
      module: 'ims',
      url: '/map/auditApply',
      method: 'POST',
      comment: '审核申请单'
    },
    applyPage: {
      module: 'ims',
      url: '/map/applyPage',
      method: 'POST',
      comment: '申请单列表'
    },
    resultPage: {
      module: 'ims',
      url: '/map/resultPage',
      method: 'POST',
      comment: '对码结果列表'
    },
  }
}

export default spdm
