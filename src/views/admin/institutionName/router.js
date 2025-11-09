import {requireAuth} from '@/common-base/router';
export default [
  // 机构曾用名 申请
  // 机构曾用名 申请列表
  // path ：路由路径
  // name ： 路由名称
  // component: 组件
  {
    path: '/admin/institutionNameApplyList',
    name: 'institutionNameApplyList',
    meta: {
      name: '机构名称新增申请单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () => import('./applyList'/* webpackChunkName: "partner" */)
  },
  // 机构曾用名 申请详情
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  {
    path: '/admin/institutionNameApplyAdd',
    name: 'institutionNameApplyAdd',
    meta: {
      name: '机构名称新增申请单新增',
    },
    beforeEnter: requireAuth,
    component: () => import('./applyAdd'/* webpackChunkName: "partner" */)
  },
  {
    path: '/admin/institutionNameApplyDetail',
    name: 'institutionNameApplyDetail',
    meta: {
      name: '机构名称新增申请单详情',
    },
    beforeEnter: requireAuth,
    component: () => import('./applyDetail'/* webpackChunkName: "partner" */)
  },
  // 机构曾用名 申请编辑
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  {
    path: '/admin/institutionNameApplyEdit',
    name: 'institutionNameApplyEdit',
    meta: {
      name: '机构名称新增申请单编辑',
    },
    beforeEnter: requireAuth,
    component: () => import('./applyEdit'/* webpackChunkName: "partner" */)
  },

  // 机构曾用名 管理
  // 机构曾用名 管理列表
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  // {
  //   path: '/admin/institutionNameManageList',
  //   name: 'institutionNameManageList',
  //   meta: {
  //     name: '机构名称新增申请单',
  //     keepAlive: true
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./manageList'/* webpackChunkName: "partner" */)
  // },
  // 机构曾用名 管理详情
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  // {
  //   path: '/admin/institutionNameManageDetail',
  //   name: 'institutionNameManageDetail',
  //   meta: {
  //     name: '机构名称新增申请单详情',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./manageDetail'/* webpackChunkName: "partner" */)
  // },
  // 机构曾用名 管理编辑
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  // {
  //   path: '/admin/institutionNameManageEdit',
  //   name: 'institutionNameManageEdit',
  //   meta: {
  //     name: '机构名称新增申请单编辑',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./manageEdit'/* webpackChunkName: "partner" */)
  // },

  // 机构曾用名 变更
  // 机构曾用名 变更列表
  // path : 路由路径
  // name : 路由名称
  // component: 组件
  // {
  //   path: '/admin/institutionNameChangeList',
  //   name: 'institutionNameChangeList',
  //   meta: {
  //     name: '机构名称变更申请单',
  //     keepAlive: true
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./changeApplyList'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名 变更新增
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameChangeAdd',
  //   name: 'institutionNameChangeAdd',
  //   meta: {
  //     name: '机构名称变更申请单新增',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./changeApplyAdd'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名 变更编辑
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameChangeEdit',
  //   name: 'institutionNameChangeEdit',
  //   meta: {
  //     name: '机构名称变更申请单编辑',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./changeApplyEdit'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名 变更审核
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // // {
  // //   path: '/admin/institutionNameChangeExamine',
  // //   name: 'institutionNameChangeExamine',
  // //   meta: {
  // //     name: '机构曾用名-变更-审核',
  // //     // keepAlive: true
  // //   },
  // //   beforeEnter: requireAuth,
  // //   component: () => import('./changeApplyExamine'/* webpackChunkName: "partner" */)
  // // },
  // // 机构曾用名 变更详情
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameChangeDetail',
  //   name: 'institutionNameChangeDetail',
  //   meta: {
  //     name: '机构名称变更申请单详情',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./changeApplyDetail'/* webpackChunkName: "partner" */)
  // },

  // // 机构曾用名取消
  // // 机构曾用名取消-列表
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameCancelList',
  //   name: 'institutionNameCancelList',
  //   meta: {
  //     name: '机构名称解除申请单',
  //     keepAlive: true
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./cancelApplyList'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名取消-新增
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameCancelAdd',
  //   name: 'institutionNameCancelAdd',
  //   meta: {
  //     name: '机构名称解除申请单新增',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./cancelApplyAdd'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名取消-编辑
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameCancelEdit',
  //   name: 'institutionNameCancelEdit',
  //   meta: {
  //     name: '机构名称解除申请单编辑',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./cancelApplyEdit'/* webpackChunkName: "partner" */)
  // },
  // // 机构曾用名取消-审核
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // // {
  // //   path: '/admin/institutionNameCancelExamine',
  // //   name: 'institutionNameCancelExamine',
  // //   meta: {
  // //     name: '机构曾用名-取消-审核',
  // //     // keepAlive: true
  // //   },
  // //   beforeEnter: requireAuth,
  // //   component: () => import('./cancelApplyExamine'/* webpackChunkName: "partner" */)
  // // },
  // // 机构曾用名取消-详情
  // // path : 路由路径
  // // name : 路由名称
  // // component: 组件
  // {
  //   path: '/admin/institutionNameCancelDetail',
  //   name: 'institutionNameCancelDetail',
  //   meta: {
  //     name: '机构名称解除申请单详情',
  //   },
  //   beforeEnter: requireAuth,
  //   component: () => import('./cancelApplyDetail'/* webpackChunkName: "partner" */)
  // },
];
