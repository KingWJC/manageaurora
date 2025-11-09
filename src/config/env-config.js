//import commonModules from '@/common-base/config/common-modules';
import commonEnvConfig from '@/common-base/config/common-env-config';
import utils from '@/common-base/utils/utils';
import cdnConfig from './cdn-config';

const EnvConfig = {
  dev: {
    oboQrCodeUrl: 'https://test-woacs.lonch.com.cn/#/obo/search', // 出库单生成二维码地址参数orderNo
    customerService: 'https://test-customer-service.lonch.com.cn/#/main/chat',
    yuncallService: 'https://test-yuncall.lonch.com.cn/#',
    webScoket: {
      customerserviceWS: 'wss://test-customerservice.lonch.com.cn'
    },
    modules: {
      ims: '/ims', //
      mserver: '/mserver', // 史海洋-公共登录, 权限管理 走网关
      // mserver: 'https://test-mserver.lonch.com.cn/mserve_lonch',  // 史海洋-公共登录, 权限管理
      //  mserver: 'https://apimserve.lonch.com.cn/mserve_lonch',
      // mserver: 'http://10.20.11.108:8083', //海洋公司
      //  mserver: 'http://10.20.11.108:8083',//vpn
      // mserver: 'http://2.0.1.5:8083',
      // mserverNogateway: 'https://test-mserver.lonch.com.cn/mserve_lonch',
      //common: 'https://test-mserver.lonch.com.cn/mserve_lonch', // 史海洋-公共登录, 权限管理
      //sy: 'https://test-mserver.lonch.com.cn/mserve_lonch', // 史海洋
      //adr: 'https://test-mserver.lonch.com.cn/mserve_lonch', // 史海洋-药品不良反应生产
      //department: 'https://test-mserver.lonch.com.cn/mserve_lonch',
      //pay: 'https://test-mserver.lonch.com.cn/mserve_lonch',
      // operlog: 'http://17.17.3.104:8185', // 洪景泉  日志审计
      // operlog: 'http://2.0.1.8:8185', // 洪景泉  日志审计  走网关
      //operlog: '/operlog', // 洪景泉  日志审计  走网关
      // hrapi: 'https://test-hrapi.lonch.com.cn', // 人事管理
      // hrnewapi: 'http://2.0.1.51:8080', // 人事管理
      // hrnewapi:'http://2.0.1.70:8080',
      // hrnewapi: 'http://17.17.3.2:8080', // 人事管理
      hrnewapi: '/hrnewapi', // 史伟-人事管理   走网关
      // osssign: 'http://17.17.3.71:8006', // oss服务
      // osssign: 'http://2.0.1.93:8006', // oss服务
      apipad: 'https://test-apipad.lonch.com.cn', // 生产论证汇总生产
      // sa: 'http://17.17.1.219:8005/sa',
      // sa: 'http://10.20.13.192:8005/sa',
      // sa: 'http://2.0.1.93:8005/sa',
      // sa: 'https://test-sa.lonch.com.cn/saapi', // 高利伟
      sa: '/sa',
      // sca: 'https://sca.lonch.com.cn', // 高利伟
      sca: '/sca',
      // sca: 'http://10.20.13.192:8011/sca', // 高利伟
      // sca: 'http://17.17.3.39:8011/sca', // 高利伟vpn
      // sca: 'http://47.114.175.231:8312', // 高利伟vpn
      // sca: 'http://2.0.1.93:8011/sca', // 高利伟vpn
      // sca: 'https://test-sca.lonch.com.cn', // 高利伟
      nto: '/nto',
      // nto: 'https://test-nto.lonch.com.cn', // 高利伟
      // nto: 'http://2.0.1.93:8045/nto', // 高利伟
      //nto: 'http://17.17.3.39:8012/nto', // 高利伟
      oem: '/oem',
      // oem: 'https://test-oem.lonch.com.cn/oem',
      //oem: 'http://17.17.3.11', // 利伟公司
      // oem: 'http://2.0.1.93:8009/oem', // 利伟vpn
      // oem: 'http://17.17.0.240:8083/oem', // 海洋公司
      bip: '/bip',
      // bip: 'https://test-bip.lonch.com.cn/bip',
      // bip: 'https://test-gateway.lonch.com.cn/bip', // 高利伟 透视报表  走网关
      //bip: 'http://17.17.3.39:8007/perspective',
      hsapiNogateway: 'https://test-hsapi.lonch.com.cn',
      hsapi: '/hsapi',
      //hsapi: 'https://test-hsapi.lonch.com.cn',
      // hsapi: 'http://192.168.11.100:7032',
      // hsapi: 'http://47.114.173.202:7032',
      // hsapi: 'http://2.0.1.7:7032',
      //ysb: 'https://test-hsapi.lonch.com.cn', // 合并到hsapi
      store: '/store',
      // store: 'https://test-storeapi.lonch.com.cn', // 冯剑飞
      // store: 'http://2.0.1.51:4008/store', // 冯剑飞
      // store: 'http://10.20.13.58:4008/store',
      pso: '/pso',
      // pso: 'https://test-pso.lonch.com.cn:8085/pso', //销售预订单
      // pso: 'http://10.20.14.44:8010/pso',
      // pso: 'http://2.0.1.93:8010/pso',
      // pso: 'https://yunfu-gateway.lonch.com.cn/pso',
      // unifiedPso: 'https://test-pso.lonch.com.cn:8085/pso',
      ectapi: '/ectapi',
      // ectapi: 'https://ectapi.lonch.com.cn', // 电子合同
      // ectapi: 'https://testec.lonch.com.cn/ele', // 电子合同
      // ectapi: 'http://10.20.14.138:7474/ele/', // 电子合同
      //ectapi: 'http://2.0.1.51:7474/ele', // 电子合同
      pay: 'https://test-pay.lonch.com.cn',
      // pay: 'http://17.17.0.240:8080',
      // pay: 'http://2.0.1.70:8080',
      sc: 'https://test-sc.lonch.com.cn',
      // sc: 'http://2.0.1.2:9002',
      wlnew: '/wlnew',
      // wlnew: 'https://test-wlnew.lonch.com.cn',
      // wlnew: 'https://wlnew.lonch.com.cn', // 正式
      // wlnew: 'http://2.0.1.9:80',
      // wlnew: 'http://10.20.13.197:8080',
      wlnewNogateway: 'https://test-wlnew.lonch.com.cn',
      // wlnew: 'http://17.17.3.11:8080',
      // wlnew: 'https://test-mserver.lonch.com.cn:8653',
      // wlnew: 'http://2.0.1.5:8080',
      // sc: 'http://47.114.175.231:9002/sc',
      // sc: 'http://2.0.1.3:9002/sc',
      appro: 'https://qywxapidev.lonch.com.cn/test',
      // wlnew: 'http://2.0.1.5:8080',
      // sc: 'http://47.114.175.231:9002/sc',
      // sc: 'http://2.0.1.3:9002/sc',
      //wlnew: 'https://test-mserver.lonch.com.cn:8653',
      //wlnew: 'http://17.17.3.11:8080',
      email: '/email',
      // email: 'https://test-lonchmail.lonch.com.cn/lonchmail', // 洪景泉  邮件  走网关
      // email: 'http://2.0.1.9:8050',
      // email: 'http://17.17.3.124:8050',
      // callcenter: 'http://47.114.175.231:9005/callcenter', // 洪景泉  呼叫中心
      callcenter: 'https://test-callcenter.lonch.com.cn/callcenter', // 洪景泉  呼叫中心 走网关
      // callcenter: 'https://test-gateway.lonch.com.cn/callcenter', // 洪景泉  呼叫中心 走网关
      //callcenter: 'http://2.0.1.3:8262/callcenter',
      lp: '/lp', // 高利伟 分账平台接口
      // lp: 'http://17.17.3.21:8025/lp', // 高利伟 分账平台接口
      // lp: 'http://2.0.1.93:8025/lp', // 高利伟 分账平台接口
      dls: 'https://test-dl.lonch.com.cn', // 高利伟  敏捷日志管理
      // dls: 'http://2.0.1.93:8014/dl',
      //dls: 'https://dl.lonch.com.cn',
      wechatrobot: '/wechatrobot',
      // wechatrobot: 'http://17.17.1.158:80',
      // wechatrobot: 'http://2.0.1.2:80',
      //invoice: 'https://test-invoicing.lonch.com.cn',
      kailing: '/kailing',
      // invoice: 'http://10.20.14.44:8012/invoice',
      // invoice: 'http://17.17.1.219:8012/invoice',
      // invoice: 'http://2.0.1.93:8012/invoice',
      // wechatrobot: 'http://17.17.1.158:80',
      // wechatrobot: 'http://2.0.1.5:80',
      // agentapi: 'http://192.168.11.100:7042',
      //agentapi: 'http://2.0.1.7:7042',
      agentapi: 'https://test-agentapi.lonch.com.cn',
      crmapi: '/crmapi',
      // crmapi: 'https://test-crmapi.lonch.com.cn',
      // crmapi: 'http://17.17.3.17:9002',
      // crmapi: 'http://2.0.1.8:9002',
      // crmapi: 'http://10.20.11.108:9002',
      tyc: 'https://test-tyc.lonch.com.cn', // 冯剑飞 天眼查
      sku: 'https://test-sku.lonch.com.cn', // sku库存
      // sku: 'http://17.17.3.21:8013/sku', // sku库存
      // sku: 'http://17.17.1.219:8013/sku', // sku库存
      // sku: 'http://2.0.1.93:8013/sku', // sku库存
      br: 'https://test-br.lonch.com.cn', // 业务规则
      // appClient: 'http://192.168.11.100:7052' ,// app
      // appClient: 'https://test-appclientapi.lonch.com.cn',// app
      // appClient: 'http://17.17.2.169:7052',// app
      // appClient: 'http://2.0.1.7:7052' ,// app
      appClient: '/appClient', // app
      // appClient:'http://17.17.2.169:7052',
      customerservice: 'https://test-customerservice.lonch.com.cn',
      // customerservice: 'http://2.0.1.3:8080',
      // customerservice: 'http://17.17.1.158:8080',
      universalreport: 'https://test-gateway.lonch.com.cn/universalreport',
      yfcapi: 'https://test-yfcapi.lonch.com.cn', // 药报单
      workFlow: '/wff', // 工作流
      // spu: 'https://test-spu.lonch.com.cn', // SPU
      spu: '/spu', // SPU
      // spu:'http://17.17.3.2:8082',
      // spu:'http://2.0.1.70:8081',// SPU
      devops: 'https://test-gateway.lonch.com.cn/devops', //云效管理
      sap: 'https://test-sap.lonch.com.cn',
      // sap: 'http://10.20.14.44:8018/sap',
      // sap: 'http://2.0.1.93:8018/sap',
      // sap: 'https://test-sap.lonch.com.cn',
      // reimburse: 'http://2.0.1.51:4012',
      reimburse: '/reimburse',
      // reimburse: 'http://10.20.11.149:4012',
      // reimburse: 'http://17.17.1.235:4012',
      // permission: 'https://test-permission.lonch.com.cn' ,// 权限校验
      // permission: 'http://10.20.14.126:8187',
      // permission: 'http://2.0.1.4:8187',
      permission: '/permission',
      knowledgeapi: 'https://test-knowledgeapi.lonch.com.cn',
      // permission: 'http://2.0.1.5:8187',
      // xreport: 'https://test-xreport.lonch.com.cn',
      xreport: '/xreport',
      // whstorage: 'https://test-wh-storage.lonch.com.cn',
      whstorage: '/whstorage',
      // yyfba: 'http://17.17.3.21:8020/yyfba',
      yyfba: '/yyfba',
      // ehrapi: 'http://2.0.1.51:4014',
      ehrapi: '/ehrapi',
      // ehrapi: 'https://test-ehrapi.lonch.com.cn',
      pat: '/pat',
      outconnector: '/outconnector',
      // outconnector: 'http://10.20.13.192:8031/oc',
      // outconnector: 'http://2.0.1.93:8031/oc',
      crawler: '/crawler',
      // crawler:'http://10.20.12.2:5001',
      ca: '/ca',
      // ca:'http://2.0.1.9:9010/ca',
      // activityapi: '/activityapi',
      activityapi: 'https://test-activityapi.lonch.com.cn',
      // ccm: 'http://2.0.1.51:4017',
      ccm: 'https://test-ccm.lonch.com.cn',
      knowledgehelp: 'https://test-knowledgehelp.lonch.com.cn',
      // uaapi: 'http://10.20.11.179:8080',
      // uaapi: 'http://2.0.1.70:8080',
      uaapi: '/uaapi',
      // cdm: '/cdm',
      // uaapi: 'http://2.0.1.70:8080',
      cdm: '/cdm',
      // cdm: 'https://test-cdm.lonch.com.cn',
      // cdm: 'http://10.20.11.149:4015'
      // oot: 'https://test-oot.lonch.com.cn',
      oot: '/oot',
      // venus: 'https://test-venus.lonch.com.cn',
      venus: '/venus',
      // jupiter: 'http://2.0.1.51:4018',
      jupiter: '/jupiter',
      // jupiter: 'https://test-jupiter.lonch.com.cn',
      mpmapi: '/mpmapi', //景泉"项目"接口
      krill: '/krill',
      report: '/ncreport', //海洋NC报表接口
      // report:'http://2.0.1.70:8080',//海洋NC报表接口
      // mars: 'http://10.20.12.13:9010/mars',
      mars: '/mars',
      ocr: '/ocr',
      supplier: '/supplier',
      tec: '/tecapi',
      tecapi: '/tecapi',
      // tec: 'http://2.0.1.6:8888',
      qywxapi: '/qywxapi',
      // qywxapi: 'http://2.0.1.5:9002',
      whale: 'https://test-whale.lonch.com.cn',
      settlement: '/settlement',
      stocktake: '/stocktake',
      pis: '/pis',
      payment: 'https://front.zhiyijiankang.com.cn',
      bps: '/bps',
      // payment: 'https://payment-front.zhiyimall.com'
      erpa: '/erpa',
      thas: '/thas',
      // thas: 'http://2.0.1.6:8278/',
      im: '/im',
      lca: '/lca',
      // im: 'http://2.0.1.4:8899',

      // add by zouzhe
      ldd: '/ldd', // 疾病诊断分组方案服务
      rxv: '/rxv', // 处方价值管理
      tag: '/tag', // 标签服务
      oxygenTherapyServer: '/oxygen-therapy-server',
      da: '/da',
      dightRights: '/dightrights',
      cps: '/cps',
      ies: '/ies',
      conductor: '/conductor'
    },
    /**
     * 切换本地后，可以本地多项目测试，不带有版本号,测试环境请主要配置domain域名是否匹配
     */
    origins: [{
        "name": "activity",
        "domain": "https://test-activity.lonch.com.cn",
        "desc": "活动管理"
      },
      {
        "name": "ahead",
        "domain": "https://test-ahead.lonch.com.cn",
        "desc": "生产验证"
      },
      {
        "name": "appbar",
        "domain": "https://test-appbar.lonch.com.cn",
        "desc": "侧边栏"
      },
      {
        "name": "chart",
        "domain": "https://test-chart.lonch.com.cn",
        "desc": "图表"
      },
      {
        "name": "chat",
        "domain": "https://test-chat.lonch.com.cn",
        "desc": "聊天"
      },
      {
        "name": "commonLibrary",
        "domain": "https://resources.lonch.com.cn/common-library",
        "desc": "lib"
      },
      {
        "name": "customer-service",
        "domain": "https://test-customer-service.lonch.com.cn",
        "desc": "在线客服"
      },
      {
        "name": "ehr",
        "domain": "http://local-ehr.lonch.com.cn:8808",
        "desc": "人力资源"
      },
      {
        "name": "evm",
        "domain": "https://test-evm.lonch.com.cn",
        "desc": "企业价值管理"
      },
      {
        "name": "friendly-business",
        "domain": "https://test-friendly-business.lonch.com.cn",
        "desc": "友商"
      },
      {
        "name": "insu",
        "domain": "https://test-insu.lonch.com.cn",
        "desc": "医保"
      },
      {
        "name": "itoc",
        "domain": "http://local-itoc.lonch.com.cn:8098",
        "desc": "项目配置"
      },
      {
        "name": "knowledge",
        "domain": "https://test-knowledge.lonch.com.cn",
        "desc": "知识库"
      },
      {
        "name": "lonchbi",
        "domain": "https://test-lonchbi.lonch.com.cn",
        "desc": "LonchBI"
      },
      {
        "name": "manage",
        "domain": "https://test-manage.lonch.com.cn",
        "desc": "云服"
      },
      {
        "name": "medicine",
        "domain": "https://test-medicine.lonch.com.cn",
        "desc": "医药项目管理"
      },
      {
        "name": "meeting",
        "domain": "https://test-meeting.lonch.com.cn",
        "desc": "会议"
      },
      {
        "name": "ootfe",
        "domain": "https://test-ootfe.lonch.com.cn",
        "desc": "交易标的中心"
      },
      {
        "name": "pivottable",
        "domain": "https://test-pivottable.lonch.com.cn",
        "desc": "透视表"
      },
      {
        "name": "platform",
        "domain": "https://test-platform.lonch.com.cn",
        "desc": "中台"
      },
      {
        "name": "puyao",
        "domain": "https://test-puyao.lonch.com.cn",
        "desc": "普药商城"
      },
      {
        "name": "rpac",
        "domain": "https://test-rpac.lonch.com.cn",
        "desc": "资源权限访问控制"
      },
      {
        "name": "tec",
        "domain": "https://test-tec.lonch.com.cn",
        "desc": "腾讯生态协作管理"
      },
      {
        "name": "woacs",
        "domain": "https://test-woacs.lonch.com.cn",
        "desc": "物流服务"
      },
      {
        "name": "workflow",
        "domain": "http://local-workflow.lonch.com.cn:8092",
        "desc": "工作流"
      },
      {
        "name": "xiaoke",
        "domain": "https://test-xiaoke.lonch.com.cn",
        "desc": "朗致销客"
      },
      {
        "name": "yaofacai",
        "domain": "https://test-yaofacai.lonch.com.cn",
        "desc": "药发采小程序"
      },
      {
        "name": "yfc",
        "domain": "https://test-yfc.lonch.com.cn",
        "desc": "药发采"
      },
      {
        "name": "yuncall",
        "domain": "http://local-yuncall.lonch.com.cn:8083",
        "desc": "呼叫中心"
      },
      {
        "name": "pwms",
        "domain": "https://test-pwms.lonch.com.cn",
        "desc": "平台储运管理"
      },
      {
        "name": "imsfe",
        "domain": "http://local-imsfe.lonch.com.cn:8091",
        "desc": "逻辑进销存"
      },
      {
        "name": "xxljobadmin",
        "domain": "https://test-xxljob-admin.lonch.com.cn",
        "desc": "任务调度中心"
      },
      {
        "name": "manageaurora",
        "domain": "https://test-manageaurora.lonch.com.cn",
        "desc": "云服"
      },
    ]
  },
  test: {
    oboQrCodeUrl: 'https://test-woacs.lonch.com.cn/#/obo/search', // 出库单生成二维码地址参数orderNo
    customerService: 'https://test-customer-service.lonch.com.cn/#/main/chat',
    yuncallService: 'https://test-yuncall.lonch.com.cn/#',
    isOpenLog: true,
    webScoket: {
      customerserviceWS: 'wss://test-customerservice.lonch.com.cn'
    },
    modules: {
      ims: '/ims', //
      mserver: '/mserver',
      mserverNogateway: 'https://test-apimserve.lonch.com.cn/mserve_lonch',
      operlog: '/operlog', // 洪景泉-日志审计   走网关
      apipad: '/apipad', // 生产论证汇总  走网关
      //hrapi: '/hrapi', // 史海洋-人事管理   走网关
      hrapi: 'https://test-hrapi.lonch.com.cn', // 史海洋-人事管理   取消网关
      hrapiNogateway: 'https://test-hrapi.lonch.com.cn', // 史海洋-人事管理
      hrnewapi: '/hrnewapi', // 史伟-人事管理   走网关
      sa: '/sa',
      sca: '/sca', // 高利伟  *****
      nto: '/nto', // 高利伟  *****
      bip: '/bip', // 透视报表  走网关
      hsapi: '/hsapi', // 史海洋-人事管理   走网关
      hsapiNogateway: 'https://test-hsapi.lonch.com.cn',
      store: '/store', // 剑飞-进销存  走网关
      oem: '/oem',
      pso: '/pso',
      ectapi: '/ectapi', // 电子合同  走网关
      pay: '/pay',
      sc: '/sc', // 走网关
      wlnew: '/wlnew', // 史伟-物流 走网关
      wlnewNogateway: 'https://test-wlnew.lonch.com.cn',
      email: '/email', // 邮件 走网关
      callcenter: '/callcenter', // 洪景泉  呼叫中心 走网关
      dls: '/dls', // 高利伟  敏捷日志管理 走网关
      lp: '/lp',
      agentapi: '/agentapi',
      wechatrobot: '/wechatrobot',
      invoice: '/invoice',
      kailing: '/kailing',
      lqadapter: '/lqadapter',
      crmapi: '/crmapi',
      tyc: '/tyc', // 冯剑飞 天眼查
      sku: '/sku',
      br: '/br', // 业务规则
      appClient: '/appClient', // app
      customerservice: '/customerservice',
      universalreport: '/universalreport',
      yfcapi: '/yfcapi', // 药报单
      workFlow: '/wff', // 工作流
      devops: '/devops', //云效管理
      spu: '/spu',
      sap: '/sap',
      reimburse: '/reimburse',
      knowledgeapi: '/knowledgeapi',
      permission: '/permission', // 权限校验
      xreport: '/xreport',
      whstorage: '/whstorage',
      yyfba: '/yyfba',
      pat: '/pat',
      ehrapi: '/ehrapi',
      outconnector: '/outconnector',
      crawler: '/crawler',
      ca: '/ca',
      activityapi: '/activityapi',
      ccm: '/ccm',
      knowledgehelp: '/knowledgehelp',
      uaapi: '/uaapi',
      cdm: '/cdm',
      oot: '/oot',
      venus: '/venus',
      jupiter: '/jupiter',
      mpmapi: '/mpmapi', //景泉"项目"接口
      krill: '/krill',
      report: '/ncreport', //海洋NC报表接口
      mars: '/mars',
      ocr: '/ocr',
      supplier: '/supplier',
      tec: '/tecapi',
      tecapi: '/tecapi',
      qywxapi: '/qywxapi',
      whale: '/whale',
      settlement: '/settlement',
      stocktake: '/stocktake',
      pis: '/pis',
      payment: 'https://front.zhiyijiankang.com.cn',
      bps: '/bps',
      erpa: '/erpa',
      thas: '/thas',
      im: '/im',
      // add by zouzhe
      ldd: '/ldd', // 疾病诊断分组方案服务
      rxv: '/rxv', // 处方价值管理
      tag: '/tag', // 标签服务
      lca: '/lca',
      oxygenTherapyServer: '/oxygen-therapy-server',
      da: '/da',
      dightRights: '/dightrights',
      cps: '/cps',
      ies: '/ies',
      conductor: '/conductor'
    }
  },
  production: {
    oboQrCodeUrl: 'https://woacs.lonch.com.cn/#/obo/search', // 出库单生成二维码地址参数orderNo
    customerService: 'https://customer-service.lonch.com.cn/#/main/chat',
    yuncallService: 'https://yuncall.lonch.com.cn/#',
    isOpenLog: true,
    webScoket: {
      customerserviceWS: 'wss://customerservice.lonch.com.cn'
    },
    modules: {
      ims: '/ims', //
      mserver: '/mserver',
      mserverNogateway: 'https://apimserve.lonch.com.cn/mserve_lonch',
      operlog: '/operlog', // 洪景泉-日志审计   走网关
      apipad: '/apipad', // 生产论证汇总  走网关
      //hrapi: '/hrapi', // 史海洋-人事管理   走网关
      hrapi: 'https://hrapi.lonch.com.cn', // 史海洋-人事管理   取消网关
      hrapiNogateway: 'https://hrapi.lonch.com.cn', // 史海洋-人事管理
      hrnewapi: '/hrnewapi', // 史伟-人事管理   走网关
      sa: '/sa',
      sca: '/sca', // 高利伟  *****
      nto: '/nto', // 高利伟  *****
      bip: '/bip', // 透视报表  走网关
      hsapi: '/hsapi', // 史海洋-人事管理   走网关
      hsapiNogateway: 'https://hsapi.lonch.com.cn',
      store: '/store', // 剑飞-进销存  走网关
      oem: '/oem',
      pso: '/pso',
      ectapi: '/ectapi', // 电子合同  走网关
      pay: '/pay',
      sc: '/sc', // 走网关
      wlnew: '/wlnew', // 史伟-物流 走网关
      wlnewNogateway: 'https://wlnew.lonch.com.cn',
      email: '/email', // 邮件 走网关
      callcenter: '/callcenter', // 洪景泉  呼叫中心 走网关
      dls: '/dls', // 高利伟  敏捷日志管理 走网关
      lp: '/lp',
      agentapi: '/agentapi',
      wechatrobot: '/wechatrobot',
      invoice: '/invoice',
      kailing: '/kailing',
      lqadapter: '/lqadapter',
      crmapi: '/crmapi',
      tyc: '/tyc', // 冯剑飞 天眼查
      sku: '/sku',
      br: '/br', // 业务规则
      appClient: '/appClient', // app
      customerservice: '/customerservice',
      universalreport: '/universalreport',
      yfcapi: '/yfcapi', // 药报单
      workFlow: '/wff', // 工作流
      devops: '/devops', //云效管理
      spu: '/spu', // SPU
      sap: '/sap', //云效管理
      reimburse: '/reimburse',
      knowledgeapi: '/knowledgeapi',
      permission: '/permission', // 权限校验
      xreport: '/xreport',
      whstorage: '/whstorage',
      yyfba: '/yyfba',
      pat: '/pat',
      ehrapi: '/ehrapi',
      outconnector: '/outconnector',
      crawler: '/crawler',
      ca: '/ca',
      activityapi: '/activityapi',
      ccm: '/ccm',
      knowledgehelp: '/knowledgehelp',
      uaapi: '/uaapi',
      cdm: '/cdm',
      oot: '/oot',
      venus: '/venus',
      jupiter: '/jupiter',
      mpmapi: '/mpmapi', //景泉"项目"接口
      krill: '/krill',
      report: '/ncreport', //海洋NC报表接口
      mars: '/mars',
      ocr: '/ocr',
      supplier: '/supplier',
      tec: '/tecapi',
      tecapi: '/tecapi',
      qywxapi: '/qywxapi',
      whale: '/whale',
      settlement: '/settlement',
      stocktake: '/stocktake',
      pis: '/pis',
      payment: 'https://payment-front.zhiyimall.com',
      bps: '/bps',
      erpa: '/erpa',
      thas: '/thas',
      im: '/im',
      // add by zouzhe
      ldd: '/ldd', // 疾病诊断分组方案服务
      rxv: '/rxv', // 处方价值管理
      tag: '/tag', // 标签服务
      lca: '/lca',
      oxygenTherapyServer: '/oxygen-therapy-server',
      da: '/da',
      dightRights: '/dightrights',
      cps: '/cps',
      ies: '/ies',
      conductor: '/conductor'
    }
  }
};

let config = utils.extend(true, {}, commonEnvConfig, EnvConfig[process.env.VUE_APP_MODE], {
  cdn: cdnConfig
});
export default config;
