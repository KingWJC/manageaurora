/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-09-22 21:08:30
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-09-22 21:08:30
 * @FilePath: /manageaurora/src/views/admin/authVerify/router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 权限校验
import { requireAuth } from '@/common-base/router';

// 路由模块
export default [
  /**
   * @路由标题: 商户经营偏好申请单
   * @路由路径: /admin/authVerify/merchantBusinessPreference/create
   * @路由名称: merchantBusinessPreferenceCreateList
   * @路由组件: ./merchantBusinessPreference/create/List
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/create',
    name: 'merchantBusinessPreferenceCreateList',
    meta: {
      name: '商户经营偏好申请单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/create/List' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好申请单-详情
   * @路由路径: /admin/authVerify/merchantBusinessPreference/create/form
   * @路由名称: merchantBusinessPreferenceCreateForm
   * @路由组件: ./merchantBusinessPreference/create/Form
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/create/form',
    name: 'merchantBusinessPreferenceCreateForm',
    meta: {
      name: '商户经营偏好申请单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/create/Form' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好修改单
   * @路由路径: /admin/authVerify/merchantBusinessPreference/modify
   * @路由名称: merchantBusinessPreferenceModifyList
   * @路由组件: ./merchantBusinessPreference/modify/List
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/modify',
    name: 'merchantBusinessPreferenceModifyList',
    meta: {
      name: '商户经营偏好修改单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/modify/List' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好修改单-详情
   * @路由路径: /admin/authVerify/merchantBusinessPreference/modify/form
   * @路由名称: merchantBusinessPreferenceModifyForm
   * @路由组件: ./merchantBusinessPreference/modify/Form
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/modify/form',
    name: 'merchantBusinessPreferenceModifyForm',
    meta: {
      name: '商户经营偏好修改单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/modify/Form' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好作废单
   * @路由路径: /admin/authVerify/merchantBusinessPreference/stop
   * @路由名称: merchantBusinessPreferenceStopList
   * @路由组件: ./merchantBusinessPreference/stop/List
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/stop',
    name: 'merchantBusinessPreferenceStopList',
    meta: {
      name: '商户经营偏好作废单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/stop/List' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好作废单-详情
   * @路由路径: /admin/authVerify/merchantBusinessPreference/stop/form
   * @路由名称: merchantBusinessPreferenceStopForm
   * @路由组件: ./merchantBusinessPreference/stop/Form
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/stop/form',
    name: 'merchantBusinessPreferenceStopForm',
    meta: {
      name: '商户经营偏好作废单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/stop/Form' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好待生效数据调整单
   * @路由路径: /admin/authVerify/merchantBusinessPreference/adjust
   * @路由名称: merchantBusinessPreferenceAdjustList
   * @路由组件: ./merchantBusinessPreference/adjust/List
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/adjust',
    name: 'merchantBusinessPreferenceAdjustList',
    meta: {
      name: '商户经营偏好待生效数据调整单',
      keepAlive: true
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/adjust/List' /* webpackChunkName: "authVerify" */
      )
  },
  /**
   * @路由标题: 商户经营偏好待生效数据调整单-详情
   * @路由路径: /admin/authVerify/merchantBusinessPreference/adjust/form
   * @路由名称: merchantBusinessPreferenceAdjustForm
   * @路由组件: ./merchantBusinessPreference/adjust/Form
   */
  {
    path: '/admin/authVerify/merchantBusinessPreference/adjust/form',
    name: 'merchantBusinessPreferenceAdjustForm',
    meta: {
      name: '商户经营偏好待生效数据调整单-详情',
      keepAlive: false
    },
    beforeEnter: requireAuth,
    component: () =>
      import(
        './merchantBusinessPreference/adjust/Form' /* webpackChunkName: "authVerify" */
      )
  }
];
