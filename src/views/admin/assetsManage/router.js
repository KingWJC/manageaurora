/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-30 14:27:29
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-30 14:27:29
 * @FilePath: /manageaurora/src/views/admin/assetsManage/router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 权限校验
import { requireAuth } from '@/common-base/router';

// 路由模块
export default [
  /**
   * @路由标题: 氧舱商户发货确认单
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/create
   * @路由名称: merchantDeliveryApplyCreateList
   * @路由组件: ./merchantDeliveryApply/create/List
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/create',
    name: 'merchantDeliveryApplyCreateList',
    meta: {
      name: '氧舱商户发货确认单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/create/List' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户发货确认单-详情
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/create/form
   * @路由名称: merchantDeliveryApplyCreateForm
   * @路由组件: ./merchantDeliveryApply/create/Form
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/create/form',
    name: 'merchantDeliveryApplyCreateForm',
    meta: {
      name: '氧舱商户发货确认单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/create/Form' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户发货修改确认单
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/modify
   * @路由名称: merchantDeliveryApplyModifyList
   * @路由组件: ./merchantDeliveryApply/modify/List
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/modify',
    name: 'merchantDeliveryApplyModifyList',
    meta: {
      name: '氧舱商户发货修改确认单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/modify/List' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户发货修改确认单-详情
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/modify/form
   * @路由名称: merchantDeliveryApplyModifyForm
   * @路由组件: ./merchantDeliveryApply/modify/Form
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/modify/form',
    name: 'merchantDeliveryApplyModifyForm',
    meta: {
      name: '氧舱商户发货修改确认单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/modify/Form' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户取消发货确认单
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/stop
   * @路由名称: merchantDeliveryApplyStopList
   * @路由组件: ./merchantDeliveryApply/stop/List
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/stop',
    name: 'merchantDeliveryApplyStopList',
    meta: {
      name: '氧舱商户取消发货确认单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/stop/List' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户取消发货确认单-详情
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/stop/form
   * @路由名称: merchantDeliveryApplyStopForm
   * @路由组件: ./merchantDeliveryApply/stop/Form
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/stop/form',
    name: 'merchantDeliveryApplyStopForm',
    meta: {
      name: '氧舱商户取消发货确认单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/stop/Form' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户发货确认待生效数据调整单
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/adjust
   * @路由名称: merchantDeliveryApplyAdjustList
   * @路由组件: ./merchantDeliveryApply/adjust/List
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/adjust',
    name: 'merchantDeliveryApplyAdjustList',
    meta: {
      name: '氧舱商户发货确认待生效数据调整单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/adjust/List' /* webpackChunkName: "assetsManage" */
      )
  },
  /**
   * @路由标题: 氧舱商户发货确认待生效数据调整单-详情
   * @路由路径: /admin/assetsManage/merchantDeliveryApply/adjust/form
   * @路由名称: merchantDeliveryApplyAdjustForm
   * @路由组件: ./merchantDeliveryApply/adjust/Form
   */
  {
    path: '/admin/assetsManage/merchantDeliveryApply/adjust/form',
    name: 'merchantDeliveryApplyAdjustForm',
    meta: {
      name: '氧舱商户发货确认待生效数据调整单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantDeliveryApply/adjust/Form' /* webpackChunkName: "assetsManage" */
      )
  }
];
