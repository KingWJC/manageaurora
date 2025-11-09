import {requireAuth} from '@/common-base/router';
export default [

  {
    path: '/admin/taxInvoice/preprocess',
    name: 'taxInvoicePreprocess',
    meta: { name: '数电票开具前置任务', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./preprocess.vue')
  },
  // 数电蓝字发票开具
  {
    path: '/admin/taxInvoice/blue/list',
    name: 'taxInvoiceBlueList',
    meta: { name: '数电蓝字发票开具', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./blueList.vue')
  },
  {
    path: '/admin/taxInvoice/blue/detail',
    name: 'taxInvoiceBlueDetail',
    meta: { name: '新增发票表单', keepAlive: false },
    beforeEnter: requireAuth,
    component: () => import('./blueDetail.vue')
  },
  {
    path: '/admin/taxInvoice/blue/selectOrg',
    name: 'taxInvoiceSelectOrg',
    meta: { name: '选择组织列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./selectOrg.vue')
  },
  {
    path: '/admin/taxInvoice/blue/selectPerson',
    name: 'taxInvoiceSelectPerson',
    meta: { name: '选择自然人列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./selectPerson.vue')
  },
  {
    path: '/admin/taxInvoice/blue/selectGoods',
    name: 'taxInvoiceSelectGoods',
    meta: { name: '添加商品或服务列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./selectGoods.vue')
  },

  // 销方红字确认单开具
  {
    path: '/admin/taxInvoice/red/seller/list',
    name: 'taxInvoiceRedSellerList',
    meta: { name: '销方红字确认单开具', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./redSellerList.vue')
  },
  {
    path: '/admin/taxInvoice/red/seller/create',
    name: 'taxInvoiceRedSellerCreate',
    meta: { name: '销方红字确认单新增单据', keepAlive: false },
    beforeEnter: requireAuth,
    component: () => import('./redSellerCreate.vue')
  },
  {
    path: '/admin/taxInvoice/red/blueInvoiceQuery',
    name: 'taxInvoiceBlueInvoiceQuery',
    meta: { name: '数电蓝字发票单据查询', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./blueInvoiceQuery.vue')
  },

  // 购方红字确认单操作
  {
    path: '/admin/taxInvoice/red/buyer/list',
    name: 'taxInvoiceRedBuyerList',
    meta: { name: '购方红字确认单列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./redBuyerList.vue')
  },
  {
    path: '/admin/taxInvoice/red/buyer/detail',
    name: 'taxInvoiceRedBuyerDetail',
    meta: { name: '购方红字确认单详情', keepAlive: false },
    beforeEnter: requireAuth,
    component: () => import('./redBuyerDetail.vue')
  },

  // 数电红字发票开具
  {
    path: '/admin/taxInvoice/red/list',
    name: 'taxInvoiceRedList',
    meta: { name: '数电红字发票开具列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./redList.vue')
  },
  {
    path: '/admin/taxInvoice/red/detail',
    name: 'taxInvoiceRedDetail',
    meta: { name: '数电红字发票详情', keepAlive: false },
    beforeEnter: requireAuth,
    component: () => import('./redDetail.vue')
  },

  // 发票额度操作
  {
    path: '/admin/taxInvoice/quota/list',
    name: 'taxInvoiceQuotaList',
    meta: { name: '发票额度列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./quotaOps.vue')
  },

  // 批量发票下载
  {
    path: '/admin/taxInvoice/download/batch',
    name: 'taxInvoiceDownloadBatch',
    meta: { name: '批量发票下载列表', keepAlive: true },
    beforeEnter: requireAuth,
    component: () => import('./downloadBatch.vue')
  }
];