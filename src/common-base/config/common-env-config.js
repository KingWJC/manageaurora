/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-09-05 00:40:14
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-06-16 00:17:25
 * @FilePath: \common-base\config\common-env-config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 全局接口配置配置
 */
 const commonEnvConfig = {
  dev: {
    expire: 12 * 3600000, // 缓存过期时间
    isOpenLog: false, // 是否记录行为日志
    domain: '.lonch.com.cn', // 共享域
    aesKey: 'lonch123', // aeskey 8位，16位，32位
    sessionKey: 'ACCESS-SESSION-DEV',
    productTypeKey: 'PRODUCT-TYPE-DEV',
    versionKey: 'VERSIONS-DEV',
    loginCallbackKey: 'LOGIN-CALLBACK-DEV',
    defaultJump: 'http://local-manage.lonch.com.cn:8081/index.html',
    defaultLoginUrl: 'http://local-portal.lonch.com.cn:8080/index.html#/login',
    defaultLogOutUrl: 'http://local-portal.lonch.com.cn:8080/index.html#/logout',
    wechatLoginUrl: 'https://local-portal.lonch.com.cn:8080/index.html#/WechatLogin', // 扫码登录
    wechatWork: {
      appid: 'ww98055e27dd1e67fd',
      agentid: '1000057',
      redirect: 'https://test-portal.lonch.com.cn/index.html',
      //scope: 'snsapi_base',
      scope: 'snsapi_privateinfo',
      response_type: 'code',
      state: 0,
      styleUri: 'https://test-portal.lonch.com.cn/static/wechat-qrconnect.css'
    },
    //微信自动登录
    wechatAutoLogin: {
      appid: 'wxf163b64e410feab6',
      redirect_uri: 'https://test-portal.lonch.com.cn/index.html',
      scope: 'snsapi_userinfo',
      response_type: 'code',
      state: 2
    },
    modules: {
      osssign: '/osssign',
      appClient: '/appClient',
      mserver: '/mserver',
      uaapi: '/uaapi',
      operlog: '/operlog',
      operlogNoGetway:'https://test-operlog.lonch.com.cn',
      xreport: '/xreport',
      tag: '/tag',
      lid: '/lid',
      secretkey: '/secretkey',
      ca: '/ca',
      email: '/email',
    },
    oss: {
      resourcesLocation: 'https://resources.lonch.com.cn/', // 资源域名地址
      bucket: 'resources-lonch', // 上传bucket
      region: 'oss-cn-beijing', // 上传bucket
      basePath: 'bi-dev' // 上传跟目录
    },
    wxPay: {
      yfcPayName: 'gh_3643b0a9ace2', //药发采原始ID
      managePayName: 'gh_99a9dbf7543e' //云服原始ID
    }
  },
  test: {
    domain: '.lonch.com.cn',
    sessionKey: 'ACCESS-SESSION-TEST',
    aesKey: 'lonch123', // aeskey 8位，16位，32位
    productTypeKey: 'PRODUCT-TYPE-TEST',
    versionKey: 'VERSIONS-TEST',
    loginCallbackKey: 'LOGIN-CALLBACK-TEST',
    expire: 12 * 3600000, // 缓存过期时间
    isOpenLog: true, // 是否记录日志
    defaultJump: 'https://test-manage.lonch.com.cn/index.html',
    defaultLoginUrl: 'https://test-portal.lonch.com.cn/index.html#/login', // 账号密码登录
    defaultLogOutUrl: 'https://test-portal.lonch.com.cn/index.html#/logout',// 退出登录
    wechatLoginUrl: 'https://test-portal.lonch.com.cn/index.html#/WechatLogin', // 扫码登录
    wechatWork: {
      appid: 'ww98055e27dd1e67fd',
      agentid: '1000057',
      redirect: 'https://test-portal.lonch.com.cn/index.html',
      //scope: 'snsapi_base',
      scope: 'snsapi_privateinfo',
      response_type: 'code',
      state: 0,
      styleUri: 'https://test-portal.lonch.com.cn/static/wechat-qrconnect.css'
    },
    //微信自动登录
    wechatAutoLogin: {
      //appid: 'wxf163b64e410feab6',
      appid: 'wx2adc0cff3261a585',
      redirect_uri: 'https://test-portal.lonch.com.cn/index.html',
      scope: 'snsapi_userinfo',
      response_type: 'code',
      state: 2
    },
    modules: {
      osssign: '/osssign',
      appClient: '/appClient',
      mserver: '/mserver',
      uaapi: '/uaapi',
      operlog: '/operlog',
      operlogNoGetway:'https://test-operlog.lonch.com.cn',
      xreport: '/xreport',
      tag: '/tag',
      lid: '/lid',
      secretkey: '/secretkey',
      ca: '/ca',
      email: '/email',
    },
    oss: {
      resourcesLocation: 'https://resources.lonch.com.cn/', // 资源域名地址
      bucket: 'resources-lonch', // 上传bucket
      region: 'oss-cn-beijing', // 上传bucket
      basePath: 'bi-test' // 上传目录
    },
    wxPay: {
      yfcPayName: 'gh_3643b0a9ace2', //药发采原始ID
      managePayName: 'gh_99a9dbf7543e' //云服原始ID
    }
  },
  production: {
    domain: '.lonch.com.cn',
    sessionKey: 'ACCESS-SESSION',
    aesKey: 'Lonch@1234567890', // aeskey 8位，16位，32位
    productTypeKey: 'PRODUCT-TYPE',
    versionKey: 'VERSIONS',
    loginCallbackKey: 'LOGIN-CALLBACK',
    expire: 8 * 3600000, // 缓存过期时间
    isOpenLog: true, // 是否记录日志
    defaultJump: 'https://manage.lonch.com.cn/index.html',
    defaultLoginUrl: 'https://portal.lonch.com.cn/index.html#/login', // 账号密码登录
    defaultLogOutUrl: 'https://portal.lonch.com.cn/index.html#/logout',// 退出登录
    wechatLoginUrl: 'https://portal.lonch.com.cn/index.html#/WechatLogin', // 扫码登录
    wechatWork: {
      appid: 'ww98055e27dd1e67fd',
      agentid: '1000038',
      redirect: 'https://portal.lonch.com.cn/index.html',
      scope: 'snsapi_privateinfo',
      response_type: 'code',
      state: 0,
      styleUri: 'https://portal.lonch.com.cn/static/wechat-qrconnect.css'
    },
    //微信自动登录
    wechatAutoLogin: {
      appid: 'wx828ca62e1ab884e6',
      redirect_uri: 'https://portal.lonch.com.cn/index.html',
      scope: 'snsapi_userinfo',
      response_type: 'code',
      state: 2
    },
    modules: {
      osssign: '/osssign',
      appClient: '/appClient',
      mserver: '/mserver',
      uaapi: '/uaapi',
      operlog: '/operlog',
      operlogNoGetway:'https://operlog.lonch.com.cn',
      xreport: '/xreport',
      tag: '/tag',
      lid: '/lid',
      secretkey: '/secretkey',
      ca: '/ca',
      email: '/email',
    },
    oss: {
      resourcesLocation: 'https://resources.lonch.com.cn/', // 资源域名地址
      bucket: 'resources-lonch', // 上传bucket
      region: 'oss-cn-beijing', // 上传bucket
      basePath: 'bi' // 上传目录
    },
    wxPay: {
      yfcPayName: 'gh_3643b0a9ace2', //药发采原始ID
      managePayName: 'gh_99a9dbf7543e' //云服原始ID
    }
  }
};
const commonConfig = {
  project: {},
  projects: [], // 由公共数据加载
  origins: [], // 公共数据加载
  terminalId: '',
  isShowLeftSide:true, // 默认是否线上菜单
  isInitialized: false, // 是否初始化完成
  initializedCallBacks: [],
  activatedOrigin: null, // 当前活动的iframe
  token: '', // 登录的token
  uidToken: '', // 登录的token（uuid token改造）
  userInfo: {}, // 登录用户信息
  isVisitor: false, // 是否为游客登录
  isSupportH5Cache: false, // app是否支持前端缓存
  netStatus: 1, //网络状态，默认有网
  visibilityState: 'visible', // 当前项目是显示还是隐藏
  customSettings: {},
  permissions: [], // 权限数据
  permissionTree: [], // 权限数据树
  versionConfig: [],
  commonDataConfigUrl: '/config.json',
  isCommonDataPreLoadingInitialized: false, // 预加载是否完成
  isCommonDataConfigInitialized: false, // 公共数据是否加载完成
  commonDataConfig: {},
  env: process.env
};
const config = Object.assign({}, commonConfig, commonEnvConfig[process.env.VUE_APP_MODE]);
export default config;
