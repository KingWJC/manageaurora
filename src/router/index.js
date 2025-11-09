/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-29 02:37:31
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-30 15:14:41
 * @FilePath: \manageaurora\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {requireAuth, initRouter} from '../common-base/router';
import authVerify from '@/views/admin/authVerify/router';
// import assetsManage from '@/views/admin/assetsManage/router'
import financeManage from '@/views/admin/financeManage/router'
import institutionName from '@/views/admin/institutionName/router'
import taxInvoice from '@/views/admin/taxInvoice/router'

import dataAgreeManage from '@/views/admin/dataAgreeManage/router'
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/admin',
    meta: {
      name: '朗致云服'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin' /* webpackChunkName: "admin" */),
    meta: {
      name: '朗致云服'
    },
    beforeEnter: requireAuth,
    children: Array.prototype.concat.call(
      [
        {
          path: '/admin/multiFrames',
          name: 'multiFrames',
          meta: {
            name: '朗致云服',
            keepAlive: true
          },
          component: () => import('../common-base/views/MultiFrames.vue' /* webpackChunkName "multiFrames" */)
        }
      ],
      authVerify,
      // assetsManage,
      financeManage,
      institutionName,
      dataAgreeManage,
      taxInvoice
    )
  },
  {path: '*', redirect: '/'}
];
/**
 * 初始化路由
 */
const router = initRouter(routes);

export default router;
