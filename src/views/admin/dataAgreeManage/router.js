import { requireAuth } from '@/common-base/router';

export default [
  /**
   * 协议嵌套关联关系新增申请单
   */
  /**
   * 列表
   */
  {
    path: '/admin/agreementContactApply',
    name: 'agreementContactApply',
    meta: {
      name: '协议嵌套关联关系新增申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactApply/index'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactApplyCreate',
    name: 'agreementContactApplyCreate',
    meta: {
      name: '协议嵌套关联关系新增申请单-新增',
      // keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactApply/create'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/agreementContactApplyEdit',
    name: 'agreementContactApplyEdit',
    meta: {
      name: '协议嵌套关联关系新增申请单-编辑',
      // keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactApply/edit'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 查看
   */
  {
    path: '/admin/agreementContactApplyDetail',
    name: 'agreementContactApplyDetail',
    meta: {
      name: '协议嵌套关联关系新增申请单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactApply/detail'/* webpackChunkName: "dataAgreeManage" */)
  },
  // /**
  //  * 协议嵌套关联关系修改申请单
  //  */
  // /**
  //  * 列表
  //  */
  {
    path: '/admin/agreementContactChange',
    name: 'agreementContactChange',
    meta: {
      name: '协议嵌套关联关系修改申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactChange/index'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactChangeCreate',
    name: 'agreementContactChangeCreate',
    meta: {
      name: '协议嵌套关联关系修改申请单-新增'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactChange/create'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactChangeGoCreate',
    name: 'agreementContactChangeGoCreate',
    meta: {
      name: '协议嵌套关联关系修改申请单-新增'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactChange/goCreate'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/agreementContactChangeEdit',
    name: 'agreementContactChangeEdit',
    meta: {
      name: '协议嵌套关联关系修改申请单-编辑'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactChange/edit'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/agreementContactChangeDetail',
    name: 'agreementContactChangeDetail',
    meta: {
      name: '协议嵌套关联关系修改申请单-详情'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactChange/detail'/* webpackChunkName: "dataAgreeManage" */)
  },
  // /**
  //  * 协议嵌套关联关系解除申请单
  //  */
  // /**
  //  * 列表
  //  */
  {
    path: '/admin/agreementContactCancel',
    name: 'agreementContactCancel',
    meta: {
      name: '协议嵌套关联关系解除申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactCancel/list'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactCancelCreate',
    name: 'agreementContactCancelCreate',
    meta: {
      name: '协议嵌套关联关系解除申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactCancel/create'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/agreementContactCancelDetail',
    name: 'agreementContactCancelDetail',
    meta: {
      name: '协议嵌套关联关系解除申请单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactCancel/detail'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 协议嵌套关联关系待生效数据调整单
   */
  /**
   * 列表
   */
  {
    path: '/admin/agreementContactAdjust',
    name: 'agreementContactAdjust',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/list'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactAdjustGoCreate',
    name: 'agreementContactAdjustGoCreate',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/goCreate'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactAdjustCreateApply',
    name: 'agreementContactAdjustCreateApply',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/createApply'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 新增
   */
  {
    path: '/admin/agreementContactAdjustCreateChange',
    name: 'agreementContactAdjustCreateChange',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/createChange'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/agreementContactAdjustEditApply',
    name: 'agreementContactAdjustEditApply',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/editApply'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 编辑
   */
  {
    path: '/admin/agreementContactAdjustEditChange',
    name: 'agreementContactAdjustEditChange',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/editChange'/* webpackChunkName: "dataAgreeManage" */)
  },
  // /**
  //  * 详情
  //  */
  {
    path: '/admin/agreementContactAdjustDetailApply',
    name: 'agreementContactAdjustDetailApply',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/detailApply'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/agreementContactAdjustDetailChange',
    name: 'agreementContactAdjustDetailChange',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/detailChange'/* webpackChunkName: "dataAgreeManage" */)
  },
  /**
   * 详情
   */
  {
    path: '/admin/agreementContactAdjustDetailCancel',
    name: 'agreementContactAdjustDetailCancel',
    meta: {
      name: '协议嵌套关联关系待生效数据调整单'
    },
    beforeEnter: requireAuth,
    component: () => import('./agreementContactAdjust/detailCancel'/* webpackChunkName: "dataAgreeManage" */)
                               
  },
];
