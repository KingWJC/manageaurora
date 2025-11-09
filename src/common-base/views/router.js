export default [
  {
    path: '/error/netWorkError',
    name: 'NetWorkError',
    meta: {
      name: '无网络',
      keepAlive: true,
      isNoHistory:true
    },
    component: () => import('./error/NetWorkErrorGame'/* webpackChunkName: "common" */)
  },
  {
    path: '/error/noAccessError',
    name: 'NoAccessError',
    meta: {
      name: '无权限',
      keepAlive: true,
      isNoHistory:true
    },
    component: () => import('./error/NoAccessError'/* webpackChunkName: "common" */)
  },
  {
    path: '/user/bindMobileNumber',
    name: 'bindMobileNumber',
    meta: {
      name: '绑定手机号',
      keepAlive: true,
      isNoHistory:true
    },
    component: () => import('./user/BindMobileNumber'/* webpackChunkName: "common" */)
  }
]
