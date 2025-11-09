import { requireAuth } from '@/common-base/router';

export default [
  /**
   * 结算价格新增规则申请单
   */
  /**
   * 列表
   */
  {
    path: '/admin/settlementPriceApply',
    name: 'settlementPriceApply',
    meta: {
      name: '结算价格新增规则申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceApply/index'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceApplyCreate',
    name: 'settlementPriceApplyCreate',
    meta: {
      name: '结算价格新增规则申请单-新增',
      // keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceApply/create'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/settlementPriceApplyEdit',
    name: 'settlementPriceApplyEdit',
    meta: {
      name: '结算价格新增规则申请单-编辑',
      // keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceApply/edit'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 查看
   */
  {
    path: '/admin/settlementPriceApplyDetail',
    name: 'settlementPriceApplyDetail',
    meta: {
      name: '结算价格新增规则申请单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceApply/detail'/* webpackChunkName: "financeManage" */)
  },
  // /**
  //  * 结算价格修改规则申请单
  //  */
  // /**
  //  * 列表
  //  */
  {
    path: '/admin/settlementPriceChange',
    name: 'settlementPriceChange',
    meta: {
      name: '结算价格修改规则申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceChange/index'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceChangeCreate',
    name: 'settlementPriceChangeCreate',
    meta: {
      name: '结算价格修改规则申请单-新增'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceChange/create'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceChangeGoCreate',
    name: 'settlementPriceChangeGoCreate',
    meta: {
      name: '结算价格修改规则申请单-新增'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceChange/goCreate'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/settlementPriceChangeEdit',
    name: 'settlementPriceChangeEdit',
    meta: {
      name: '结算价格修改规则申请单-编辑'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceChange/edit'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/settlementPriceChangeDetail',
    name: 'settlementPriceChangeDetail',
    meta: {
      name: '结算价格修改规则申请单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceChange/detail'/* webpackChunkName: "financeManage" */)
  },
  // /**
  //  * 结算价格关停规则新增申请单
  //  */
  // /**
  //  * 列表
  //  */
  {
    path: '/admin/settlementPriceCancel',
    name: 'settlementPriceCancel',
    meta: {
      name: '结算价格关停规则新增申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceCancel/list'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceCancelCreate',
    name: 'settlementPriceCancelCreate',
    meta: {
      name: '结算价格关停规则新增申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceCancel/create'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/settlementPriceCancelDetail',
    name: 'settlementPriceCancelDetail',
    meta: {
      name: '结算价格关停规则新增申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceCancel/detail'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 结算价格待生效数据规则调整单
   */
  /**
   * 列表
   */
  {
    path: '/admin/settlementPriceAdjust',
    name: 'settlementPriceAdjust',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/list'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceAdjustGoCreate',
    name: 'settlementPriceAdjustGoCreate',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/goCreate'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceAdjustCreateApply',
    name: 'settlementPriceAdjustCreateApply',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/createApply'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/settlementPriceAdjustCreateChange',
    name: 'settlementPriceAdjustCreateChange',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/createChange'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/settlementPriceAdjustEditApply',
    name: 'settlementPriceAdjustEditApply',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/editApply'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/settlementPriceAdjustEditChange',
    name: 'settlementPriceAdjustEditChange',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/editChange'/* webpackChunkName: "financeManage" */)
  },
  // /**
  //  * 详情
  //  */
  {
    path: '/admin/settlementPriceAdjustDetailApply',
    name: 'settlementPriceAdjustDetailApply',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/detailApply'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/settlementPriceAdjustDetailChange',
    name: 'settlementPriceAdjustDetailChange',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/detailChange'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/settlementPriceAdjustDetailCancel',
    name: 'settlementPriceAdjustDetailCancel',
    meta: {
      name: '结算价格待生效数据规则调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceAdjust/detailCancel'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 结算价格失效到期提醒单
   */
  /**
   * 列表
   */
  {
    path: '/admin/settlementPriceTimeOut',
    name: 'settlementPriceTimeOut',
    meta: {
      name: '结算价格失效到期提醒单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceTimeOut/index'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 查看
   */
  {
    path: '/admin/settlementPriceTimeOutDetail',
    name: 'settlementPriceTimeOutDetail',
    meta: {
      name: '结算价格失效到期提醒单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceTimeOut/detail'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 结算价格配置规则信息
   */
  /**
   * 列表
   */
  {
    path: '/admin/settlementPriceResult',
    name: 'settlementPriceResult',
    meta: {
      name: '结算价格失效到期提醒单'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceResult/index'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 查看
   */
  {
    path: '/admin/settlementPriceResultDetail',
    name: 'settlementPriceResultDetail',
    meta: {
      name: '结算价格失效到期提醒单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlementPriceResult/detail'/* webpackChunkName: "financeManage" */)
  },
  /**
   * 结算价格档案
   */
  /**
   * 列表
   */
  {
    path: '/admin/settlePriceRule',
    name: 'settlePriceRule',
    meta: {
      name: '结算价格档案'
    },
    beforeEnter: requireAuth,
    component: () => import('./settlePriceRule/index'/* webpackChunkName: "financeManage" */)
  },
];
