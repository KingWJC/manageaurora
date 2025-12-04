/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-09-05 00:44:08
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-02 15:36:51
 * @FilePath: \manage\src\config\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 整合配置信息
 * 环境配置envConfig
 * web-app配置webAppConfig
 * 通用配置config
 * 所有接口command默认为getAppProxyData
 */
import utils from '@/common-base/utils/utils';
import envConfig from './env-config';
import webAppConfig from './web-app-config';
import spu from './module/spu';
import whStorage from './module/whStorage';
import pat from './module/pat';
import ehrapi from './module/ehrapi';
import outconnector from './module/outconnector';
import knowledgehelp from './module/knowledgehelp.js';
import oot from './module/oot';
import store from './module/store';
import whale from './module/whale';
import stocktake from './module/stocktake';
import uaapi from './module/uaapi';
import pis from './module/pis';
import thas from './module/thas';
import ldd from './module/ldd';
import rxv from './module/rxv';
import tag from './module/tag';
import lca from './module/lca';
import da from './module/da';
import mpmapi from './module/mpmapi';
import spdm from './module/spdm';
import ca from './module/ca';
import ectapi from './module/ectapi';
import taxinvoice from './module/taxinvoice';

const config = {
  domainName: 'manageaurora',
  defaultName: 'manage', // 默认网关名称，支持不再限制大小写
  projectName: 'manage', // 当前使用网关名称
  isMultiWebFramework: true, // 多web框架
  isLogClient: false,
  viewportWidth: '',
  roleName: '', // 用户角色
  loginUserName: '', // 登录用户姓名
  loginTime: '', // 登录时间
  clientType: 'webApp',
  departments: [],
  routeHistoryList: [],
  client: {
    isMiniprogram: false
  },
  commonParams: {
    manageProductId: '1'
  },
  versionConfig: [],
  services: {
    taxinvoice,
    spu,
    whStorage,
    pat,
    ehrapi,
    outconnector,
    knowledgehelp,
    oot,
    store,
    whale,
    stocktake,
    uaapi,
    pis,
    thas,
    tag, // add by zouzhe 标签服务
    ldd, // add by zouzhe 疾病诊断分组方案服务
    rxv, // 处方价值管理
    lca,
    da,
    mpmapi,
    spdm,
    ca,
    ectapi,
    // 公共模块接口
    common: {
      scanQRCode: {
        command: 'scanQRCode',
        url: '',
        method: 'POST',
        comment: '扫描协议'
      },
      login: {
        module: 'mserver',
        url: '/user/dologin',
        method: 'POST',
        comment: ''
      },
      wxLogin: {
        module: 'mserver',
        url: '/user/doWXlogin',
        method: 'POST',
        comment: ''
      },
      smsdoLogin: {
        module: 'mserver',
        url: '/user/smsdologin',
        method: 'POST',
        comment: ''
      },
      sendloginSms: {
        module: 'mserver',
        url: '/user/sendloginSms',
        method: 'POST',
        comment: ''
      },
      sendSms4loginPwd: {
        module: 'mserver',
        url: '/user/sendSms4loginPwd',
        method: 'POST',
        comment: ''
      },
      // 修改密码 "pwd":"用户原来的密码","newPwd":"用户新密码","newPwdCon":"确认密码"
      modifyLoginPwd: {
        module: 'mserver',
        url: '/user/modifyLoginPwd',
        method: 'POST',
        comment: ''
      },
      // 忘记密码短信确认接口{"userName":"手机号","phoneCode":"短信验证码","pwd":"用户新密码",newPwdCon: "确认密码"}
      loginPwdforget: {
        module: 'mserver',
        url: '/user/loginPwdforget',
        method: 'POST',
        comment: ''
      },
      getSign: {
        module: 'osssign',
        url: '/sign/getSign',
        method: 'POST',
        comment: ''
      },
      bankTypes: {
        module: 'mserver',
        url: '/bank/selectBankType',
        method: 'POST',
        comment: '获取银行类型'
      },
      bankNames: {
        module: 'mserver',
        url: '/bank/selectBank',
        method: 'POST',
        comment: '获取银行开户行'
      },
      //销售类型
      selectBusinessType: {
        module: 'mserver',
        url: '/enum/selectBusinessType',
        method: 'POST',
        comment: '销售类型列表'
      },
      insertBusinessType: {
        module: 'mserver',
        url: '/enum/insertBusinessType',
        method: 'POST',
        comment: '销售类型新增'
      },
      updateBusinessType: {
        module: 'mserver',
        url: '/enum/updateBusinessType',
        method: 'POST',
        comment: '销售类型编辑'
      },
      // 结算方式
      selectBiPaysettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      insertBiPaySettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/insertBiPaySettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      insertBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/insertBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethodLevelThree: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      insertBiPaysettlementMethodThree: {
        module: 'mserver',
        url: '/enum/insertBiPaysettlementMethodThree',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodThree: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodThree',
        method: 'POST',
        comment: ''
      },

      insertOrUpdateBiPaysettlementMethod: {
        module: 'mserver',
        url: '/enum/insertOrUpdateBiPaysettlementMethod',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethod: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethod',
        method: 'POST',
        comment: ''
      },
      // 支付方式
      selectBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },

      insertOrUpdateBiPayPaymentMethod: {
        module: 'mserver',
        url: '/enum/insertOrUpdateBiPayPaymentMethod',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethod: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethod',
        method: 'POST',
        comment: ''
      },
      //敏捷日志管理
      queryHumanList: {
        module: 'dls',
        url: '/common/queryHumanList',
        method: 'POST',
        comment: '获取人员列表'
      },
      //定时任务
      taskinfoList: {
        module: 'mserver',
        url: '/taskinfo/list',
        method: 'POST',
        comment: ''
      },
      taskinfoPause: {
        module: 'mserver',
        url: '/taskinfo/pause',
        method: 'GET',
        comment: ''
      },
      taskinfoResume: {
        module: 'mserver',
        url: '/taskinfo/resume',
        method: 'GET',
        comment: ''
      },
      taskinfoDelete: {
        module: 'mserver',
        url: '/taskinfo/delete',
        method: 'GET',
        comment: ''
      },
      taskinfoSave: {
        module: 'mserver',
        url: '/taskinfo/save',
        method: 'POST',
        comment: ''
      },
      //自定义组织
      selectHumanByOrgId: {
        module: 'mserver',
        url: '/user/selectHumanByOrgId',
        method: 'POST',
        comment: ''
      },
      insertOrUpdateHumanByOrgId: {
        module: 'mserver',
        url: '/user/insertOrUpdateHumanByOrgId',
        method: 'POST',
        comment: ''
      },
      deletedHumanById: {
        module: 'mserver',
        url: '/user/deletedHumanById',
        method: 'POST',
        comment: ''
      },
      refreshToken: {
        command: 'refreshToken',
        module: 'mserver',
        url: '/user/refreshToken',
        method: 'POST',
        comment: '刷新token，用于切换组织'
      },
      appPay: {
        command: 'appPay',
        module: 'mserver',
        url: '',
        method: 'POST',
        comment: 'APP支付',
        noErrTips: true
      },
      // 初始化账号
      userInitHumanAndLogin: {
        module: 'mserver',
        url: '/user/initHumanAndLogin',
        method: 'POST',
        comment: '初始化账号'
      },
      getClientIp: {
        module: 'appClient',
        url: '/App/QueryIP',
        method: 'POST',
        comment: '获取客户端ip'
      },
      // 打开音视频，文档等
      openChatFile: { module: 'appClient', command: 'openChatFile' },
      pay: {
        command: 'pay',
        module: 'mserver',
        url: '',
        method: 'POST',
        comment: 'APP支付'
      },
      selectHumanOrganizationByNameAndOrgTypelog: {
        module: 'uaapi',
        url: '/caHuman/selectHumanOrganizationByNameAndOrgTypelog',
        method: 'POST',
        comment: '根据组织查人'
      }
    },
    crm: {
      // CRM - 群机器人管理
      chatList: {
        module: 'wechatrobot',
        url: '/chat/list',
        method: 'POST',
        comment: '获取群机器人列表'
      },
      chatAdd: {
        module: 'wechatrobot',
        url: '/chat/add',
        method: 'POST',
        comment: '给群添加机器人'
      },
      chatRemove: {
        module: 'wechatrobot',
        url: '/chat/remove',
        method: 'POST',
        comment: '删除群机器人'
      },
      chatEdit: {
        module: 'wechatrobot',
        url: '/chat/edit',
        method: 'POST',
        comment: '编辑群机器人'
      },
      // CRM - 群消息发送
      chatLogList: {
        module: 'wechatrobot',
        url: '/chat/log/list',
        method: 'POST',
        comment: '获取群消息列表'
      },
      chatLogRemove: {
        module: 'wechatrobot',
        url: '/chat/log/remove',
        method: 'POST',
        comment: '删除群消息'
      },
      chatLogAdd: {
        module: 'wechatrobot',
        url: '/chat/log/add',
        method: 'POST',
        comment: '新增群消息'
      },
      chatLogEdit: {
        module: 'wechatrobot',
        url: '/chat/log/edit',
        method: 'POST',
        comment: '编辑群消息'
      },
      chatLogDetils: {
        module: 'wechatrobot',
        url: '/chat/log/detail',
        method: 'POST',
        comment: '获取群消息详情'
      },
      // 外部群消息发送
      chatOutList: {
        module: 'wechatrobot',
        url: '/chat/out/list',
        method: 'POST',
        comment: '获取外部群消息列表'
      },
      chatOutGetOutUser: {
        module: 'wechatrobot',
        url: '/chat/out/getOutUser',
        method: 'POST',
        comment: '获取外部群联系人列表'
      },
      chatOutAdd: {
        module: 'wechatrobot',
        url: '/chat/out/add',
        method: 'POST',
        comment: '外部群消息新增发送'
      },
      chatOutEdit: {
        module: 'wechatrobot',
        url: '/chat/out/edit',
        method: 'POST',
        comment: '外部群消息编辑'
      },
      chatOutUploadFile: {
        module: 'wechatrobot',
        url: '/chat/out/uploadFile',
        method: 'POST',
        comment: '外部群消息图片上传接口',
        protocolVersion: '1.0'
      },
      chatOutRemove: {
        module: 'wechatrobot',
        url: '/chat/out/remove',
        method: 'POST',
        comment: '删除外部群消息'
      },
      // 工单系统
      systemInfoSelectTicketByGroup: {
        module: 'wechatrobot',
        url: '/system/info/selectTicketByGroup',
        method: 'POST',
        comment: '查询分组工单列表'
      },
      systemInfoListByUser: {
        module: 'wechatrobot',
        url: '/system/info/listByUser',
        method: 'POST',
        comment: '查询个人工单列表'
      },
      systemInfoList: {
        module: 'wechatrobot',
        url: '/system/info/list',
        method: 'POST',
        comment: '查询工单列表'
      },
      systemInfoDetail: {
        module: 'wechatrobot',
        url: '/system/info/detail',
        method: 'POST',
        comment: '查询工单详情'
      },
      systemInfoAdd: {
        module: 'wechatrobot',
        url: '/system/info/add',
        method: 'POST',
        comment: '新增工单'
      },
      systemAnswerAdd: {
        module: 'wechatrobot',
        url: '/system/answer/add',
        method: 'POST',
        comment: '新增回复记录'
      },
      systemAnswerList: {
        module: 'wechatrobot',
        url: '/system/answer/list',
        method: 'POST',
        comment: '获取工单回复记录'
      },
      systemHumanEdit: {
        module: 'wechatrobot',
        url: '/system/human/edit',
        method: 'POST',
        comment: '弹屏获取自然人接口'
      },
      systemInfoListByPhone: {
        module: 'wechatrobot',
        url: '/system/info/listByPhone',
        method: 'POST',
        comment: '获取当前用户未完成工单'
      },
      systemTransRecordList: {
        module: 'wechatrobot',
        url: '/system/transRecord/list',
        method: 'POST',
        comment: '查询工单流转记录'
      },
      systemInfoEdit: {
        module: 'wechatrobot',
        url: '/system/info/edit',
        method: 'POST',
        comment: '工单数据保存'
      },
      systemRecordsGetTcketRecordsByID: {
        module: 'wechatrobot',
        url: '/system/records/getTcketRecordsByID',
        method: 'POST',
        comment: '查询工单通话记录'
      },
      systemInfoSelectSalesByUserId: {
        module: 'wechatrobot',
        url: '/system/info/selectSalesByUserId',
        method: 'POST',
        comment: '业务工单管理列表查询'
      },
      userInfo: {
        module: 'yfcapi',
        url: '/user/info',
        method: 'POST',
        comment: '登陆用户信息'
      },
      // 业务系统管理
      systemSystemAdd: {
        module: 'wechatrobot',
        url: '/system/system/add',
        method: 'POST',
        comment: '新增业务系统名称'
      },
      systemSystemEdit: {
        module: 'wechatrobot',
        url: '/system/system/edit',
        method: 'POST',
        comment: '编辑业务系统名称'
      },
      systemSystemList: {
        module: 'wechatrobot',
        url: '/system/system/list',
        method: 'POST',
        comment: '查询业务系统名称列表'
      },
      systemSystemListAll: {
        module: 'wechatrobot',
        url: '/system/system/listAll',
        method: 'POST',
        comment: '查询业务系统名称列表所有不带分页'
      },
      systemSystemRemove: {
        module: 'wechatrobot',
        url: '/system/system/remove',
        method: 'POST',
        comment: '删除业务系统名称'
      },
      // 工单类型管理
      systemTypeAdd: {
        module: 'wechatrobot',
        url: '/system/type/add',
        method: 'POST',
        comment: '新增工单类型'
      },
      systemTypeEdit: {
        module: 'wechatrobot',
        url: '/system/type/edit',
        method: 'POST',
        comment: '编辑工单类型'
      },
      systemTypeList: {
        module: 'wechatrobot',
        url: '/system/type/list',
        method: 'POST',
        comment: '查询工单类型列表'
      },
      systemTypeListAll: {
        module: 'wechatrobot',
        url: '/system/type/listAll',
        method: 'POST',
        comment: '查询工单类型列表所有不带分页'
      },
      systemTypeRemove: {
        module: 'wechatrobot',
        url: '/system/type/remove',
        method: 'POST',
        comment: '删除工单类型'
      },
      // 云呼中心
      aliyunRefresh: {
        module: 'wechatrobot',
        url: '/aliyun/refresh',
        method: 'POST',
        comment: '获取用户登录状态'
      },
      aliyunAuth: {
        module: 'wechatrobot',
        url: '/aliyun/auth',
        method: 'POST',
        comment: '获取阿里云登录接口'
      },
      aliyunAuthCallback: {
        module: 'wechatrobot',
        url: '/aliyun/auth/callback',
        method: 'POST',
        comment: '客服登录数据回传'
      },
      // 云呼客服管理
      systemCcuserList: {
        module: 'wechatrobot',
        url: '/system/ccuser/list',
        method: 'POST',
        comment: '查询cc对应平台用户列表'
      },
      systemCcuserAdd: {
        module: 'wechatrobot',
        url: '/system/ccuser/add',
        method: 'POST',
        comment: '新增cc对应平台用户'
      },
      systemCcuserEdit: {
        module: 'wechatrobot',
        url: '/system/ccuser/edit',
        method: 'POST',
        comment: '修改cc对应平台用户'
      },
      systemCcuserRemove: {
        module: 'wechatrobot',
        url: '/system/ccuser/remove',
        method: 'POST',
        comment: '删除cc对应平台用户'
      },
      systemHumanGetPerson: {
        module: 'wechatrobot',
        url: '/system/human/getPerson',
        method: 'POST',
        comment: '获取工单自然人信息'
      },
      systemHumanGetHumanByName: {
        module: 'wechatrobot',
        url: '/system/human/getHumanByName',
        method: 'POST',
        comment: '获取工单自然人信息'
      },
      // 通话记录管理
      systemRecordsList: {
        module: 'wechatrobot',
        url: '/system/records/list',
        method: 'POST',
        comment: '查询CC通话记录列表'
      },
      systemRecordingsList: {
        module: 'wechatrobot',
        url: '/system/recordings/list',
        method: 'POST',
        comment: '查询CC录音记录列表'
      },
      systemRecordingsDetail: {
        module: 'wechatrobot',
        url: '/system/recordings/detail',
        method: 'POST',
        comment: '查询CC通话记录详情'
      },
      systemRecordsMenu: {
        module: 'wechatrobot',
        url: '/system/records/menu',
        method: 'POST',
        comment: '查询CC通话记录搜索查询数据'
      },
      // 云呼桌面
      // systemHumanGetPerson: {module: 'wechatrobot', url: '/system/human/getPerson', method: 'POST', comment: '获取工单自然人信息'},
      systemRecordsListInOut: {
        module: 'wechatrobot',
        url: '/system/records/listInOut',
        method: 'POST',
        comment: '加载通话记录列表'
      },
      // systemRecordingsList: {module: 'wechatrobot', url: '/system/recordings/list', method: 'POST', comment: '获取录音详情'},
      systemDetailList: {
        module: 'wechatrobot',
        url: '/system/detail/list',
        method: 'POST',
        comment: '获取录音详情文字'
      },
      // systemInfoList: {module: 'wechatrobot', url: '/system/info/list', method: 'POST', comment: '查询工单列表'},
      userInsertHuman: {
        module: 'mserver',
        url: '/user/insertHuman',
        method: 'POST',
        comment: '更新客户信息'
      },
      // 云呼实例管理
      systemOrgListAll: {
        module: 'wechatrobot',
        url: '/system/org/listAll',
        method: 'POST',
        comment: '查询呼叫中心实例列表(不带分页)'
      },
      systemOrgList: {
        module: 'wechatrobot',
        url: '/system/org/list',
        method: 'POST',
        comment: '查询呼叫中心实例列表'
      },
      systemOrgAdd: {
        module: 'wechatrobot',
        url: '/system/org/add',
        method: 'POST',
        comment: '新增呼叫中心实例'
      },
      systemOrgEdit: {
        module: 'wechatrobot',
        url: '/system/org/edit',
        method: 'POST',
        comment: '编辑呼叫中心实例'
      },
      systemOrgRemove: {
        module: 'wechatrobot',
        url: '/system/org/remove',
        method: 'POST',
        comment: '删除呼叫中心实例'
      },
      // 云呼分组管理
      systemGetGroupListAll: {
        module: 'wechatrobot',
        url: '/system/getGroup/listAll',
        method: 'POST',
        comment: '查询呼叫中心分组列表(不带分页)'
      },
      systemGetGroupList: {
        module: 'wechatrobot',
        url: '/system/getGroup/list',
        method: 'POST',
        comment: '查询呼叫中心分组列表'
      },
      systemGetGroupAdd: {
        module: 'wechatrobot',
        url: '/system/getGroup/add',
        method: 'POST',
        comment: '新增呼叫中心分组'
      },
      systemGetGroupEdit: {
        module: 'wechatrobot',
        url: '/system/getGroup/edit',
        method: 'POST',
        comment: '编辑呼叫中心分组'
      },
      systemGetGroupRemove: {
        module: 'wechatrobot',
        url: '/system/getGroup/remove',
        method: 'POST',
        comment: '删除呼叫中心分组'
      },
      // 销售出库
      systemOrderList: {
        module: 'wechatrobot',
        url: '/system/order/list',
        method: 'POST',
        comment: '销售出库列表查询'
      },
      systemOrderAllYears: {
        module: 'wechatrobot',
        url: '/system/order/allYears',
        method: 'POST',
        comment: '销售出库获取年份列表'
      },
      systemOrderAllPacking: {
        module: 'wechatrobot',
        url: '/system/order/allPacking',
        method: 'POST',
        comment: '销售出库查询所有包装规格'
      },
      systemOrderAllBusinessType: {
        module: 'wechatrobot',
        url: '/system/order/allBusinessType',
        method: 'POST',
        comment: '销售出库查询所有销售类型'
      },
      systemAuthorityList: {
        module: 'wechatrobot',
        url: '/system/authority/list',
        method: 'POST',
        comment: '查询用户对应的销售类型数据'
      },
      systemAuthorityAdd: {
        module: 'wechatrobot',
        url: '/system/authority/add',
        method: 'POST',
        comment: '保存用户销售类型权限设置'
      },
      // 数据合同（商业统控）
      systemControlList: {
        module: 'wechatrobot',
        url: '/system/control/list',
        method: 'POST',
        comment: '数据合同（商业统控）报表列表'
      },
      // 数据合同（统控代理）
      systemSAgencyGetBusinessType: {
        module: 'wechatrobot',
        url: '/system/sAgency/getBusinessType',
        method: 'POST',
        comment: '查询业务系统'
      },
      systemCAgencyList: {
        module: 'wechatrobot',
        url: '/system/cAgency/list',
        method: 'POST',
        comment: '数据合同（统控代理）报表列表'
      },
      // 数据合同（代理销售）
      systemSAgencyList: {
        module: 'wechatrobot',
        url: '/system/sAgency/list',
        method: 'POST',
        comment: '数据合同（代理销售）报表列表'
      },
      // 发货开票报表
      systemDeliveryList: {
        module: 'wechatrobot',
        url: '/system/delivery/list',
        method: 'POST',
        comment: '发货开票报表'
      },
      // 发货开票报表业务组织列表
      systemDeliverySelectOrgName: {
        module: 'wechatrobot',
        url: '/system/delivery/selectOrgName',
        method: 'POST',
        comment: '业务组织'
      },
      // 发货开票报表业务申请人
      systemDeliverySelectApplicant: {
        module: 'wechatrobot',
        url: '/system/delivery/selectApplicant',
        method: 'POST',
        comment: '申请人'
      },
      // 发货开票报表业务开票客户
      systemDeliverySelectBillingBusiness: {
        module: 'wechatrobot',
        url: '/system/delivery/selectBillingBusiness',
        method: 'POST',
        comment: '开票客户'
      },
      // 发货开票报表业务代理客户
      systemDeliveryPromotionAgentName: {
        module: 'wechatrobot',
        url: '/system/delivery/selectPromotionAgentName',
        method: 'POST',
        comment: '代理客户'
      }
    },
    im: {
      imProductList: {
        module: 'im',
        url: '/product/list',
        method: 'POST',
        comment: '分页产品查询'
      },
      msgBatchSendMsg: {
        module: 'im',
        url: '/msg/batchSendMsg',
        method: 'POST',
        comment: '批量指定人发送消息'
      },
      sendCommonMsg: {
        module: 'im',
        url: '/msg/sendCommonMsg',
        method: 'POST',
        comment: '批量指定人发送消息'
      },
      sendMsg: {
        module: 'im',
        url: '/msg/sendMsg',
        method: 'POST',
        comment: '向指定的人员发送im文本消息'
      },
      imMsgPage: {
        module: 'im',
        url: '/msg/page',
        method: 'POST',
        comment: '查app消息推送列表'
      },
      imMsgGroupList: {
        module: 'im',
        url: '/msg/groupList',
        method: 'POST',
        comment: '查分组列表'
      },
      imsEatstIsSeats: {
        module: 'im',
        url: '/seats/isSeats',
        method: 'POST',
        comment: '查询是否IM坐席'
      }
    },
    /**
     * 发行方
     */
    publishParty: {
      list: { module: 'dightRights', url: '/publishParty/list', method: 'POST', comment: '' },
      view: { module: 'dightRights', url: '/publishParty/view', method: 'POST', comment: '' },
    },
    /**
     * 发放方
     */
    issueParty: {
      list: { module: 'dightRights', url: '/issueParty/list', method: 'POST', comment: '' },
      view: { module: 'dightRights', url: '/issueParty/view', method: 'POST', comment: '' },
    },
    /**
     * 服务兑付方结算单
     */
    settleOrderApply: {
      list: { module: 'settlement', url: '/settleOrderApply/list', method: 'POST', comment: '' },
      view: { module: 'settlement', url: '/settleOrderApply/view', method: 'POST', comment: '' },
      isSettle: { module: 'cps', url: '/sxyService/isSettle', method: 'POST', comment: '' },
      audit: { module: 'settlement', url: '/settleOrderApply/audit', method: 'POST', comment: '' },
      reRerunTask: { module: 'settlement', url: '/settleOrderApply/reRerunTask', method: 'POST', comment: '' },
    },
    /**
     * 服务兑付方预结算单
     */
    settlePreOrderApply: {
      list: { module: 'settlement', url: '/settlePreOrderApply/list', method: 'POST', comment: '' },
      view: { module: 'settlement', url: '/settlePreOrderApply/view', method: 'POST', comment: '' },
    },
    /**
     * 运维工程师角色
     */
    operation: {
      list: { module: 'ca', url: '/operation/list', method: 'POST', comment: '' },
      view: { module: 'ca', url: '/operation/view', method: 'POST', comment: '' },
      viewByLoginUser: { module: 'ca', url: '/operation/viewByLoginUser', method: 'POST', comment: '' }
    },
    /**
     * 运维检修单
     */
    opsMaintenanceOrder: {
      beginMaintenance: { module: 'ca', url: '/opsMaintenanceOrder/beginMaintenance', method: 'POST', comment: '开启或预约维护' },
      endMaintenance: { module: 'ca', url: '/opsMaintenanceOrder/endMaintenance', method: 'POST', comment: '完成维护' },
      startMaintenance: { module: 'ca', url: '/opsMaintenanceOrder/startMaintenance', method: 'POST', comment: '立即开始维护' },
      viewByLoginUser: { module: 'ca', url: '/opsMaintenanceOrder/viewByLoginUser', method: 'POST', comment: '根据登录用户查询是否正在检修'},
      changeMaintenanceTime: { module: 'ca', url: '/opsMaintenanceOrder/changeMaintenanceTime', method: 'POST', comment: '调整检修时间' },
      // viewByLoginUser: { module: 'ca', url: '/opsMaintenanceOrder/viewByLoginUser', method: 'POST', comment: '根据登录用户查询是否正在检修'}
    },
    // 致医优氧项目合作协议 (万众创业版)管理
    oxMassApply: {
      list: { module: 'venus', url: '/oxMassApply/list', method: 'POST', comment: '列表' },
      listAdjust: { module: 'venus', url: '/oxMassApply/listAdjust', method: 'POST', comment: '列表' },
      update: { module: 'venus', url: '/oxMassApply/update', method: 'POST', comment: '编辑' },
      view: { module: 'venus', url: '/oxMassApply/view', method: 'POST', comment: '详情' },
      audit: { module: 'venus', url: '/oxMassApply/audit', method: 'POST', comment: '审核' },
      delete: { module: 'venus', url: '/oxMassApply/delete', method: 'POST', comment: '删除' },
      listDirective: { module: 'venus', url: '/oxMassApply/listDirective', method: 'POST', comment: '' },
      viewDirective: { module: 'venus', url: '/oxMassApply/viewDirective', method: 'POST', comment: '' },
    },
    /**
     * 分账平台接口
     */
    lp: {
      queryBusinessOrg: {
        module: 'lp',
        url: '/common/queryBusinessOrg',
        method: 'POST',
        comment: '获取业务组织列表'
      },
      queryProductList: {
        module: 'lp',
        url: '/common/queryProductList',
        method: 'POST',
        comment: '获取产品列表'
      },
      pageSplitPolicy: {
        module: 'lp',
        url: '/sp/pageSplitPolicy',
        method: 'POST',
        comment: '获取分账政策列表'
      },
      querySplitPolicy: {
        module: 'lp',
        url: '/sp/querySplitPolicy',
        method: 'POST',
        comment: '获取分账政策列表'
      },
      pageSplitScaleLevel: {
        module: 'lp',
        url: '/sp/pageSplitScaleLevel',
        method: 'POST',
        comment: '获取分账比例等级分页列表'
      },
      querySplitScaleLevel: {
        module: 'lp',
        url: '/sp/querySplitScaleLevel',
        method: 'POST',
        comment: '获取分账比例等级列表'
      },
      querySplitPolicyById: {
        module: 'lp',
        url: '/sp/querySplitPolicyById',
        method: 'POST',
        comment: '获取分账政策详情'
      },
      querySplitScaleLevelById: {
        module: 'lp',
        url: '/sp/querySplitScaleLevelById',
        method: 'POST',
        comment: '获取分账比例等级详情'
      },
      saveSplitPolicy: {
        module: 'lp',
        url: '/sp/saveSplitPolicy',
        method: 'POST',
        comment: '保存分账政策'
      },
      saveSplitScaleLevel: {
        module: 'lp',
        url: '/sp/saveSplitScaleLevel',
        method: 'POST',
        comment: '保存分账比例等级'
      },
      pageOrderSplit: {
        module: 'lp',
        url: '/os/pageOrderSplit',
        method: 'POST',
        comment: '获取订单分账列表'
      },
      queryOrderSplitById: {
        module: 'lp',
        url: '/os/queryOrderSplitById',
        method: 'POST',
        comment: '获取订单分账列表'
      },
      querySplitRecordByOrderSplitInfoId: {
        module: 'lp',
        url: '/os/querySplitRecordByOrderSplitInfoId',
        method: 'POST',
        comment: '根据订单分账详情id获取分账明细记录'
      },
      saveOrderSplit: {
        module: 'lp',
        url: '/os/saveOrderSplit',
        method: 'POST',
        comment: '保存订单分账'
      },
      saveSplitRecord: {
        module: 'lp',
        url: '/os/saveSplitRecord',
        method: 'POST',
        comment: '保存分账明细记录'
      },
      pageRebateObject: {
        module: 'lp',
        url: '/ro/pageRebateObject',
        method: 'POST',
        comment: '获取返款对象分页列表'
      },
      queryRebateObject: {
        module: 'lp',
        url: '/ro/queryRebateObject',
        method: 'POST',
        comment: '获取返款对象列表'
      },
      queryRebateObjectById: {
        module: 'lp',
        url: '/ro/queryRebateObjectById',
        method: 'POST',
        comment: '获取返款对象详情'
      },
      queryRebateObjectListByType: {
        module: 'lp',
        url: '/ro/queryRebateObjectListByType',
        method: 'POST',
        comment: '获取返款对象列表'
      },
      saveRebateObject: {
        module: 'lp',
        url: '/ro/saveRebateObject',
        method: 'POST',
        comment: '保存返款对象'
      },
      pageOrderSplitInfo: {
        module: 'lp',
        url: '/os/pageOrderSplitInfo',
        method: 'POST',
        comment: '获取订单分账明细列表'
      },
      queryBusinessTypeList: {
        module: 'lp',
        url: '/common/queryBusinessTypeList',
        method: 'POST',
        comment: '获取销售类型列表'
      },
      batchSaveOrderSplit: {
        module: 'lp',
        url: '/os/batchSaveOrderSplit',
        method: 'POST',
        comment: '批量保存订单分账'
      }
    },
    jupiter: {
      queryAllAdministrations: {
        module: 'jupiter',
        url: '/common/queryAllAdministrations',
        method: 'POST',
        comment: '查询所有行政组织'
      },
      queryAllBusiness: {
        module: 'jupiter',
        url: '/common/queryAllBusiness',
        method: 'POST',
        comment: '查询所有业务组织'
      },
      queryAllCostItems: {
        module: 'jupiter',
        url: '/common/queryAllCostItems',
        method: 'POST',
        comment: '查询所有费用项目'
      },
      queryAllMedicalType: {
        module: 'jupiter',
        url: '/common/queryAllMedicalType',
        method: 'POST',
        comment: '查询所有医疗机构类别'
      },
      queryRuleDetailsById: {
        module: 'jupiter',
        url: '/rule/queryRuleDetailsById',
        method: 'POST',
        comment: '通过ID查询规则详情'
      },
      queryRulesList: {
        module: 'jupiter',
        url: '/rule/queryRulesList',
        method: 'POST',
        comment: '查询规则列表'
      },
      saveRule: {
        module: 'jupiter',
        url: '/rule/saveRule',
        method: 'POST',
        comment: '保存规则配置'
      },
      queryFormulaList: {
        module: 'jupiter',
        url: '/formula/queryFormulaList',
        method: 'POST',
        comment: '查看公式列表'
      },
      delFormula: {
        module: 'jupiter',
        url: '/formula/delFormula',
        method: 'POST',
        comment: '删除公式'
      },
      saveFormula: {
        module: 'jupiter',
        url: '/formula/saveFormula',
        method: 'POST',
        comment: '生成公式'
      },
      queryAllFormulaList: {
        module: 'jupiter',
        url: '/formula/queryAllFormulaList',
        method: 'POST',
        comment: '查看所有公式列表'
      },
      queryAllRuleAgreedTaxRate: {
        module: 'jupiter',
        url: '/generalData/queryAllRuleAgreedTaxRate',
        method: 'POST',
        comment: '约定税率'
      },
      queryAllFormulaValueSource: {
        module: 'jupiter',
        url: '/generalData/queryAllFormulaValueSource',
        method: 'POST',
        comment: '计算公式取值来源'
      },
      saveRuleAgreedTaxRate: {
        module: 'jupiter',
        url: '/generalData/saveRuleAgreedTaxRate',
        method: 'POST',
        comment: '保存约定税率'
      },
      delTrialManage: {
        module: 'jupiter',
        url: '/trial/delTrialManage',
        method: 'POST',
        comment: '删除试算管理'
      },
      queryTrialManageDetailsById: {
        module: 'jupiter',
        url: '/trial/queryTrialManageDetailsById',
        method: 'POST',
        comment: '查询试算管理配置详情'
      },
      queryTrialManageList: {
        module: 'jupiter',
        url: '/trial/queryTrialManageList',
        method: 'POST',
        comment: '查询试算管理列表'
      },
      saveTrialManage: {
        module: 'jupiter',
        url: '/trial/saveTrialManage',
        method: 'POST',
        comment: '保存试算管理配置'
      },
      validateVersionNum: {
        module: 'jupiter',
        url: '/rule/validateVersionNum',
        method: 'POST',
        comment: '规则版本号校验重复'
      },
      //业务结算价格比例设置
      queryHumanList: {
        module: 'jupiter',
        url: '/common/queryHumanList',
        method: 'POST',
        comment: '查询自然人列表'
      },
      queryAuthenticationList: {
        module: 'jupiter',
        url: '/common/queryAuthenticationList',
        method: 'POST',
        comment: '查询核名认证的组织'
      },
      queryAllBusinessType: {
        module: 'jupiter',
        url: '/common/queryAllBusinessType',
        method: 'POST',
        comment: '查询所有销售类型'
      },
      queryAllBatchByCommodity: {
        module: 'jupiter',
        url: '/common/queryAllBatchByCommodity',
        method: 'POST',
        comment: '根据spu的id查询批次批号'
      },
      saveJsBusinessPrice: {
        module: 'jupiter',
        url: '/settlement/saveJsBusinessPrice',
        method: 'POST',
        comment: '结算价格设置保存'
      },
      approverBusinessPrice: {
        module: 'jupiter',
        url: '/settlement/approverBusinessPrice',
        method: 'POST',
        comment: '审批业务员结算价格设置'
      },
      auditBusinessPrice: {
        module: 'jupiter',
        url: '/settlement/auditBusinessPrice',
        method: 'POST',
        comment: '审核业务员结算价格设置'
      },
      delBusinessPrice: {
        module: 'jupiter',
        url: '/settlement/delBusinessPrice',
        method: 'POST',
        comment: '删除业务员结算价格设置'
      },
      queryBusinessPriceDetails: {
        module: 'jupiter',
        url: '/settlement/queryBusinessPriceDetails',
        method: 'POST',
        comment: '查询业务员结算价格设置详情'
      },
      queryBusinessPriceList: {
        module: 'jupiter',
        url: '/settlement/queryBusinessPriceList',
        method: 'POST',
        comment: '查询业务员结算价格设置列表'
      },

      //结算价格结果集和作废修改
      approveInvalidApply: {
        module: 'jupiter',
        url: '/result/approveInvalidApply',
        method: 'POST',
        comment: '审批作废申请'
      },
      approveModifyApply: {
        module: 'jupiter',
        url: '/result/approveModifyApply',
        method: 'POST',
        comment: '审批修改申请'
      },
      auditInvalidApply: {
        module: 'jupiter',
        url: '/result/auditInvalidApply',
        method: 'POST',
        comment: '审核作废申请'
      },
      auditModifyApply: {
        module: 'jupiter',
        url: '/result/auditModifyApply',
        method: 'POST',
        comment: '审核修改申请'
      },
      queryPriceResultModifyList: {
        module: 'jupiter',
        url: '/result/queryPriceResultModifyList',
        method: 'POST',
        comment: '修改申请单录入时查询结果集查询列表'
      },
      queryInvalidApplyList: {
        module: 'jupiter',
        url: '/result/queryInvalidApplyList',
        method: 'POST',
        comment: '作废申请查询'
      },
      queryModifyApplyList: {
        module: 'jupiter',
        url: '/result/queryModifyApplyList',
        method: 'POST',
        comment: '修改申请查询'
      },
      queryPriceResultDetails: {
        module: 'jupiter',
        url: '/result/queryPriceResultDetails',
        method: 'POST',
        comment: '查询业务员结算价格设置结果详情'
      },
      queryPriceResultList: {
        module: 'jupiter',
        url: '/result/queryPriceResultList',
        method: 'POST',
        comment: '查询业务员结算价格设置结果列表'
      },
      saveInvalidApply: {
        module: 'jupiter',
        url: '/result/saveInvalidApply',
        method: 'POST',
        comment: '作废申请--对结果集操作'
      },
      saveModifyApply: {
        module: 'jupiter',
        url: '/result/saveModifyApply',
        method: 'POST',
        comment: '修改申请--对结果集操作'
      },
      delModifyApply: {
        module: 'jupiter',
        url: '/result/delModifyApply',
        method: 'POST',
        comment: '删除修改申请'
      },
      queryPeriodArchivesTypeList: {
        module: 'jupiter',
        url: '/period/queryPeriodArchivesTypeList',
        method: 'POST',
        comment: '查询所有期间档案类型列表'
      },
      queryPeriodArchivesDetails: {
        module: 'jupiter',
        url: '/period/queryPeriodArchivesDetails',
        method: 'POST',
        comment: '查询期间档案详情'
      },
      queryPeriodArchivesList: {
        module: 'jupiter',
        url: '/period/queryPeriodArchivesList',
        method: 'POST',
        comment: '查询期间档案列表'
      },
      queryPeriodTypeList: {
        module: 'jupiter',
        url: '/period/queryPeriodTypeList',
        method: 'POST',
        comment: '查询所有期间类型列表列表'
      },
      savePeriodArchives: {
        module: 'jupiter',
        url: '/period/savePeriodArchives',
        method: 'POST',
        comment: '保存期间档案'
      },
      queryPeriodCycleList: {
        module: 'jupiter',
        url: '/period/queryPeriodCycleList',
        method: 'POST',
        comment: '查询期间周期'
      },
      //核算直销收益
      queryAllItemList: {
        module: 'jupiter',
        url: '/profit/queryAllItemList',
        method: 'POST',
        comment: '查询收益统计所有项目'
      },
      queryProfitList: {
        module: 'jupiter',
        url: '/profit/queryProfitList',
        method: 'POST',
        comment: '查询收益统计列表'
      },
      queryListByProfitId: {
        module: 'jupiter',
        url: '/profit/queryListByProfitId',
        method: 'POST',
        comment: '根据直销收益统计id查询明细信息'
      },
      queryManageAnchorList: {
        module: 'jupiter',
        url: '/profit/queryManageAnchorList',
        method: 'POST',
        comment: '查询结算管理锚列表'
      },
      //直销收益订单核算期初(期间内)调整单
      approverAdjustBill: {
        module: 'jupiter',
        url: '/profitAdjust/approverAdjustBill',
        method: 'POST',
        comment: '审批期初单据'
      },
      auditAdjustBill: {
        module: 'jupiter',
        url: '/profitAdjust/auditAdjustBill',
        method: 'POST',
        comment: '审核期初单据'
      },
      queryAdjustBillDetailsById: {
        module: 'jupiter',
        url: '/profitAdjust/queryAdjustBillDetailsById',
        method: 'POST',
        comment: '根据id查询明细信息'
      },
      queryAdjustBillList: {
        module: 'jupiter',
        url: '/profitAdjust/queryAdjustBillList',
        method: 'POST',
        comment: '查询核算期初(期间内)调整单分页列表'
      },
      saveAdjustBill: {
        module: 'jupiter',
        url: '/profitAdjust/saveAdjustBill',
        method: 'POST',
        comment: '保存核算期初(期间内)调整单'
      },
      saveItem: {
        module: 'jupiter',
        url: '/profit/saveItem',
        method: 'POST',
        comment: '保存核算项目'
      },
      //直销核算 诊所合伙人任务达成直销奖励核算
      queryRewardOrderPoolList: {
        module: 'jupiter',
        url: '/direct/queryRewardOrderPoolList',
        method: 'POST',
        comment: '查询直销奖励核算订单池列表--A'
      },
      queryRewardAccountingList: {
        module: 'jupiter',
        url: '/direct/queryRewardAccountingList',
        method: 'POST',
        comment: '查询直销奖励核算期初列表--B'
      },
      queryListByInitial: {
        module: 'jupiter',
        url: '/direct/queryListByInitial',
        method: 'POST',
        comment: '根据期初id查询汇总信息--B的汇总'
      },
      queryDetailsListBySummary: {
        module: 'jupiter',
        url: '/direct/queryDetailsListBySummary',
        method: 'POST',
        comment: '根据汇总id查询明细列表--B的汇总明细'
      }
    },
    /**
     * 结算
     */
    settlement: {
      // 业务员结算配置申请
      manageQueryPagedApplyList: {
        module: 'settlement',
        url: '/manage/queryPagedApplyList',
        method: 'POST',
        comment: '查询申请单列表'
      },
      manageUpsertApply: {
        module: 'settlement',
        url: '/manage/upsertApply',
        method: 'POST',
        comment: '创建更新申请单'
      },
      manageCancelForm: {
        module: 'settlement',
        url: '/manage/cancelForm',
        method: 'POST',
        comment: '撤销单据'
      },
      manageQueryForm: {
        module: 'settlement',
        url: '/manage/queryForm',
        method: 'POST',
        comment: '查询单据详情'
      },
      openQueryObjects: {
        module: 'oot',
        url: '/open/queryObjects',
        method: 'POST',
        comment: '查询交易标的信息'
      },
      manageAuditForm: {
        module: 'settlement',
        url: '/manage/auditForm',
        method: 'POST',
        comment: '审核单据'
      },
      // 业务员结算配置修改
      manageQueryPagedModifyList: {
        module: 'settlement',
        url: '/manage/queryPagedModifyList',
        method: 'POST',
        comment: '查询修改单列表'
      },
      manageUpsertModify: {
        module: 'settlement',
        url: '/manage/upsertModify',
        method: 'POST',
        comment: '创建/更新修改单'
      },
      // 业务员结算配置调整
      manageQueryPagedAdjustList: {
        module: 'settlement',
        url: '/manage/queryPagedAdjustList',
        method: 'POST',
        comment: '查询调整单列表'
      },
      manageUpsertAdjust: {
        module: 'settlement',
        url: '/manage/upsertAdjust',
        method: 'POST',
        comment: '创建更新调整单'
      },

      // 业务员结算配置作废
      manageQueryPagedInvalidList: {
        module: 'settlement',
        url: '/manage/queryPagedInvalidList',
        method: 'POST',
        comment: '查询作废单列表'
      },
      manageUpsertInvalid: {
        module: 'settlement',
        url: '/manage/upsertInvalid',
        method: 'POST',
        comment: '创建更新作废单'
      },

      // 业务员结算配置结果
      manageQueryPagedResultList: {
        module: 'settlement',
        url: '/manage/queryPagedResultList',
        method: 'POST',
        comment: '查询待已生效单据列表'
      },

      manageQueryPagedPreList: {
        module: 'settlement',
        url: '/manage/queryPagedPreList',
        method: 'POST',
        comment: '查询待待生效单据列表'
      },
      // 查询私域店铺
      searchPrivateMaster: {
        module: 'settlement',
        url: '/search/searchPrivateMaster',
        method: 'POST',
        comment: '查询私域店铺列表'
      },
      queryPagedNoticeList: {
        module: 'settlement',
        url: '/manage/queryPagedNoticeList',
        method: 'POST',
        comment: '到期提醒单'
      },
      getAllBizDic: { module: 'settlement', url: '/bizDic/getAllBizDic', method: 'POST', comment: '业务字典' },
    },
    /**
     * 查合同
     */
    ecContract: {
      list: { module: 'venus', url: '/ecContract/list', method: 'POST', comment: '列表' },
      view: { module: 'venus', url: '/ecContract/view', method: 'POST', comment: '详情' },
      baseApplyList: { module: 'venus', url: '/ecContract/baseApplyList', method: 'POST', comment: '关联协议查签署单' },
      baseList: { module: 'venus', url: '/ecContract/baseList', method: 'POST', comment: '关联协议查协议' },
      viewApply: { module: 'venus', url: '/ecContract/viewApply', method: 'POST', comment: '签署单详情' },
    },
    krill: {
      dictSystemList: {
        module: 'krill',
        url: '/system/dict/list',
        method: 'POST',
        comment: '字典项_系统_列表'
      },
      priceDictList: {
        module: 'krill',
        url: '/price/dict/list',
        method: 'POST',
        comment: '查询交易标的价格类型'
      },
      processPriceList: {
        module: 'krill',
        url: '/process/price/dict/list',
        method: 'POST',
        comment: '交易执行的价格类型'
      },
      salesmanPsoSource: {
        module: 'krill',
        url: '/salesmanPsoSource/dict/list',
        method: 'POST',
        comment: ''
      },
      queryBusinessTypeAndOot: {
        module: 'krill',
        url: '/business-type-inner-api/queryBusinessTypeAndOot',
        method: 'POST',
        comment: ''
      }
    },
    // 往来
    pay: {
      recharge: {
        module: 'mserver',
        url: '/pay/recharge',
        method: 'POST',
        comment: ''
      },
      selectRecharge: {
        module: 'mserver',
        url: '/pay/selectRecharge',
        method: 'POST',
        comment: ''
      },
      selectPayForSource: {
        module: 'mserver',
        url: '/pay/selectPayForSource',
        method: 'POST',
        comment: ''
      },
      updateOrinsertRecharge: {
        module: 'mserver',
        url: '/pay/updateOrinsertRecharge',
        method: 'POST',
        comment: ''
      },
      refundListQuery: {
        module: 'mserver',
        url: '/pay/refundListQuery',
        method: 'POST',
        comment: ''
      },
      refund: {
        module: 'mserver',
        url: '/pay/refund',
        method: 'POST',
        comment: ''
      },
      getRechargeExcel: {
        module: 'mserver',
        url: '',
        method: 'GET',
        comment: ''
      },
      selectRefundList: {
        module: 'mserver',
        url: '/pay/selectRefundList',
        method: 'POST',
        comment: ''
      },
      confirmRefund: {
        module: 'mserver',
        url: '/pay/confirmRefund',
        method: 'POST',
        comment: ''
      },
      examineRefund: {
        module: 'mserver',
        url: '/pay/examineRefund',
        method: 'POST',
        comment: ''
      },
      //付款单 付款单位信息
      fkDepartment: {
        module: 'mserver',
        url: '/pay/fkDepartment',
        method: 'POST',
        comment: ''
      },
      selectLogcBiOutboundOrder: {
        module: 'mserver',
        url: '/pay/selectLogcBiOutboundOrder',
        method: 'POST',
        comment: ''
      },
      selectLogcBiOutboundOrderDetail: {
        module: 'mserver',
        url: '/pay/selectLogcBiOutboundOrderDetail',
        method: 'POST',
        comment: ''
      },
      selectInvoiceInvoicing: {
        module: 'mserver',
        url: '/pay/selectInvoiceInvoicing',
        method: 'POST',
        comment: ''
      },
      selectInvoiceInvoicingDetail: {
        module: 'mserver',
        url: '/pay/selectInvoiceInvoicingDetail',
        method: 'POST',
        comment: ''
      },
      selectBankIfnfomerDetail: {
        module: 'mserver',
        url: '/pay/selectBankIfnfomerDetail',
        method: 'POST',
        comment: ''
      },
      selectBiPayReceivableDetail: {
        module: 'mserver',
        url: '/pay/selectBiPayReceivableDetail',
        method: 'POST',
        comment: ''
      },
      selectBankIfnfomerAccount: {
        module: 'mserver',
        url: '/pay/selectBankIfnfomerAccount',
        method: 'POST',
        comment: ''
      },
      selectBankIfnfomerDay: {
        module: 'mserver',
        url: '/pay/selectBankIfnfomerDay',
        method: 'POST',
        comment: ''
      },

      selectLogcSaleIssue: {
        module: 'mserver',
        url: '/pay/selectLogcSaleIssue',
        method: 'POST',
        comment: ''
      },
      selectLogcSaleIssueDetail: {
        module: 'mserver',
        url: '/pay/selectLogcSaleIssueDetail',
        method: 'POST',
        comment: ''
      },
      // 其他应收来源类型
      insertBiPayOrgReceivableAmountType: {
        module: 'mserver',
        url: '/pay/insertBiPayOrgReceivableAmountType',
        method: 'POST',
        comment: ''
      },
      selectBiPayOrgReceivableAmountType: {
        module: 'mserver',
        url: '/pay/selectBiPayOrgReceivableAmountType',
        method: 'POST',
        comment: ''
      },
      deletedBiPayOrgReceivableAmountType: {
        module: 'mserver',
        url: '/pay/deletedBiPayOrgReceivableAmountType',
        method: 'POST',
        comment: ''
      },
      // 抵扣和增加
      selectBiPayOrgReceivable: {
        module: 'mserver',
        url: '/pay/selectBiPayOrgReceivable',
        method: 'POST',
        comment: ''
      },
      insertBiPayOrgReceivable: {
        module: 'mserver',
        url: '/pay/insertBiPayOrgReceivable',
        method: 'POST',
        comment: ''
      },
      deletedBiPayOrgReceivable: {
        module: 'mserver',
        url: '/pay/deletedBiPayOrgReceivable',
        method: 'POST',
        comment: ''
      },
      selectSalesMans: {
        module: 'mserver',
        url: '/human/selectSalesMans',
        method: 'POST',
        comment: ''
      },
      selectSalesMansLeaderLevel4: {
        module: 'mserver',
        url: '/human/selectSalesMansLeaderLevel4',
        method: 'POST',
        comment: ''
      },
      // 业务员对照函（四级）
      insertOrUpdateBiPayReconciliationLetter: {
        module: 'mserver',
        url: '/pay/insertOrUpdateBiPayReconciliationLetter',
        method: 'POST',
        comment: ''
      },
      selectBiPayReconciliationLetter: {
        module: 'mserver',
        url: '/pay/selectBiPayReconciliationLetter',
        method: 'POST',
        comment: ''
      },
      deletedBiPayReconciliationLetter: {
        module: 'mserver',
        url: '/pay/deletedBiPayReconciliationLetter',
        method: 'POST',
        comment: ''
      },
      // 费用计提应收
      selectreceivableBillCustom: {
        module: 'mserver',
        url: '/pay/selectreceivableBillCustom',
        method: 'POST',
        comment: ''
      },

      selectBiPayOrgReceivableDetail: {
        module: 'mserver',
        url: '/pay/selectBiPayOrgReceivableDetail',
        method: 'POST',
        comment: ''
      },
      // 冲抵方式
      insertBiPayOrgReceivableOffsetmethod: {
        module: 'mserver',
        url: '/pay/insertBiPayOrgReceivableOffsetmethod',
        method: 'POST',
        comment: ''
      },
      selectBiPayOrgReceivableOffsetmethod: {
        module: 'mserver',
        url: '/pay/selectBiPayOrgReceivableOffsetmethod',
        method: 'POST',
        comment: ''
      },
      deletedBiPayOrgReceivableOffsetmethod: {
        module: 'mserver',
        url: '/pay/deletedBiPayOrgReceivableOffsetmethod',
        method: 'POST',
        comment: ''
      },
      //结算方式管理
      selectBiPaysettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethodThree: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      selectBiPaysettlementMethod: {
        module: 'mserver',
        url: '/enum/selectBiPaysettlementMethod',
        method: 'POST',
        comment: ''
      },
      insertBiPaySettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/insertBiPaySettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      insertBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/insertBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      insertBiPaysettlementMethodThree: {
        module: 'mserver',
        url: '/enum/insertBiPaysettlementMethodThree',
        method: 'POST',
        comment: ''
      },
      insertOrUpdateBiPaysettlementMethod: {
        module: 'mserver',
        url: '/enum/insertOrUpdateBiPaysettlementMethod',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodLevelOne: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      updateBiPaysettlementMethodThree: {
        module: 'mserver',
        url: '/enum/updateBiPaysettlementMethodThree',
        method: 'POST',
        comment: ''
      },
      // 支付方式管理
      selectBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      selectBiPayPaymentMethod: {
        module: 'mserver',
        url: '/enum/selectBiPayPaymentMethod',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      insertBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/insertBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },
      insertOrUpdateBiPayPaymentMethod: {
        module: 'mserver',
        url: '/enum/insertOrUpdateBiPayPaymentMethod',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelOne: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelOne',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelTwo: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelTwo',
        method: 'POST',
        comment: ''
      },
      updateBiPayPaymentMethodLevelThree: {
        module: 'mserver',
        url: '/enum/updateBiPayPaymentMethodLevelThree',
        method: 'POST',
        comment: ''
      },

      selectYWDepLevel: {
        module: 'mserver',
        url: '/department/selectYWDepLevel',
        method: 'POST',
        comment: ''
      },
      reviewRecharge: {
        module: 'mserver',
        url: '/pay/reviewRecharge',
        method: 'POST',
        comment: ''
      },
      //个人收款.创始人收款
      selectCollection: {
        module: 'mserver',
        url: '/collection/selectCollection',
        method: 'POST',
        comment: '查询收款列表数据'
      },
      //导入
      inputCollection: {
        module: 'mserver',
        url: '/collection/inputCollection',
        method: 'POST',
        comment: '个人导入',
        protocolVersion: '1.0'
      },
      inputCSRCollection: {
        module: 'mserver',
        url: '/collection/inputCSRCollection',
        method: 'POST',
        comment: '创始人导入',
        protocolVersion: '1.0'
      },
      examineCollection: {
        module: 'mserver',
        url: '/collection/examineCollection',
        method: 'POST',
        comment: '审核'
      },

      selectTotalCount: {
        module: 'mserver',
        url: '/pay/selectTotalCount',
        method: 'POST',
        comment: ''
      },
      selectQrCodePay: {
        module: 'mserver',
        url: '/pay/selectQrCodePay',
        method: 'POST',
        comment: ''
      },

      selectTerminalOutCardAmount: {
        module: 'mserver',
        url: '/pay/selectTerminalOutCardAmount',
        method: 'POST',
        comment: ''
      },
      updateTerminalOutCardAmount: {
        module: 'mserver',
        url: '/pay/updateTerminalOutCardAmount',
        method: 'POST',
        comment: ''
      },

      selectBiPayGuaranteeRecordConfirmById: {
        module: 'mserver',
        url: '/pay/selectBiPayGuaranteeRecordConfirmById',
        method: 'POST',
        comment: ''
      },

      selectBiPaymentQrcodePerListByParam: {
        module: 'mserver',
        url: '/pay/selectBiPaymentQrcodePerListByParam',
        method: 'POST',
        comment: ''
      },
      selectBiPaymentQrcodePerList: {
        module: 'mserver',
        url: '/pay/selectBiPaymentQrcodePerList',
        method: 'POST',
        comment: ''
      },
      selectBiPaymentQrcodePerById: {
        module: 'mserver',
        url: '/pay/selectBiPaymentQrcodePerById',
        method: 'POST',
        comment: ''
      },
      // 新支付方式/支付分类/结算方式/结算分类
      selectPaymentClassification: {
        module: 'mserver',
        url: '/method/selectPaymentClassification',
        method: 'POST',
        comment: '支付方式分类查询，不分页：'
      },
      insertOrUpdatePaymentClassification: {
        module: 'mserver',
        url: '/method/insertOrUpdatePaymentClassification',
        method: 'POST',
        comment: '新增或修改支付方式分类：'
      },
      selectSettlementClassification: {
        module: 'mserver',
        url: '/method/selectSettlementClassification',
        method: 'POST',
        comment: '结算方式分类查询，不分页：'
      },
      insertOrUpdateBiSettlementClassification: {
        module: 'mserver',
        url: '/method/insertOrUpdateBiSettlementClassification',
        method: 'POST',
        comment: '新增或修改结算方式分类：'
      },
      selectPayment: {
        module: 'mserver',
        url: '/method/selectPayment',
        method: 'POST',
        comment: '支付方式查询，带分页'
      },
      insertOrUpdatePayment: {
        module: 'mserver',
        url: '/method/insertOrUpdatePayment',
        method: 'POST',
        comment: '新增或修改支付方式'
      },
      selectSettlement: {
        module: 'mserver',
        url: '/method/selectSettlement',
        method: 'POST',
        comment: '结算方式查询，带分页'
      },
      insertOrUpdateBiSettlement: {
        module: 'mserver',
        url: '/method/insertOrUpdateBiSettlement',
        method: 'POST',
        comment: '新增或修改结算方式'
      }
    },
    industryCode: {
      createCodeWithoutPad: {
        module: 'ca',
        url: '/industryCode/createCodeWithoutPad',
        method: 'POST',
        expire: 0,
        comment: ''
      },
      editCode: {
        module: 'ca',
        url: '/industryCode/editCode',
        method: 'POST',
        expire: 0,
        comment: ''
      },
      list: {
        module: 'ca',
        url: '/industryCode/list',
        method: 'POST',
        expire: 0,
        comment: ''
      },

      listA: {
        module: 'ca',
        url: '/industryCode/configure/list',
        method: 'POST',
        expire: 0,
        comment: '行业资料配置'
      },
      createCodeWithoutPadA: {
        module: 'ca',
        url: '/industryCode/configure/createCodeWithoutPad',
        method: 'POST',
        expire: 0,
        comment: ''
      },
      editCodeA: {
        module: 'ca',
        url: '/industryCode/configure/editCode',
        method: 'POST',
        expire: 0,
        comment: ''
      },

      create: {
        module: 'ca',
        url: '/industryCode/create',
        method: 'POST',
        expire: 0,
        comment: '行业字典'
      },
      edit: {
        module: 'ca',
        url: '/industryCode/edit',
        method: 'POST',
        expire: 0,
        comment: ''
      },
      listByPage: {
        module: 'ca',
        url: '/industryCode/listByPage',
        method: 'POST',
        expire: 0,
        comment: ''
      },

      getAllFileType: {
        module: 'ca',
        url: '/industryCode/getAllFileType',
        method: 'POST',
        comment: '查看机构分类下的证件类型'
      },
      searchOrgsByPage: {
        module: 'ca',
        url: '/organize/searchOrgsByPage',
        method: 'POST',
        comment: ''
      },
      selectOrgById: {
        module: 'ca',
        url: '/organize/selectOrgById',
        method: 'POST',
        comment: ''
      },
      searchOrgsByPageWithPermission: {
        module: 'ca',
        url: '/organize/searchOrgsByPageWithPermission',
        method: 'POST',
        comment: ''
      }
    },
    certification: {
      selectHumans: {
        module: 'ca',
        url: '/human/selectHumans',
        method: 'POST',
        comment: '查询自然人'
      },
      selectOneHuman: {
        module: 'ca',
        url: '/human/selectOneHuman',
        method: 'POST',
        comment: '查询自然人详情'
      },
      list: {
        module: 'ca',
        url: '/nameVerifyApplication/list',
        method: 'POST',
        comment: ''
      },
      insertOrUpdatCaHumanPre: {
        module: 'uaapi',
        url: '/caHuman/insertOrUpdatCaHumanPre',
        method: 'POST',
        comment: '自然人新增申请,新增或修改'
      },
      getCertReportWithoutPermission: {
        module: 'ca',
        url: '/certification/getCertReportWithoutPermission',
        method: 'POST',
        comment: ''
      },
      getCertReport: {
        module: 'ca',
        url: '/certification/getCertReport',
        method: 'POST',
        comment: '证书宽表列表'
      },
    },
    shop: {
     list: { module: 'ca', url: '/shop/list', method: 'POST', comment: '' },
     view: { module: 'ca', url: '/shop/view', method: 'POST', comment: '' }
    },
    shopType: {
     list: { module: 'ca', url: '/shopType/list', method: 'POST', comment: '' },
     update: { module: 'ca', url: '/shopType/update', method: 'POST', comment: '' }
    },
    //  店铺
    privateMallShop: {
      list: {
        module: 'ca',
        url: '/privateMallShop/list',
        method: 'POST',
        comment: ''
      },
      noPermissionList: {
        module: 'ca',
        url: '/privateMallShop/noPermissionList',
        method: 'POST',
        comment: ''
      },
    },
    // 代理
    agent: {
      listOrgAgent: {
        module: 'ca',
        url: '/agent/listOrgAgent',
        method: 'POST',
        comment: ''
      },
      viewOrgAgent: {
        module: 'ca',
        url: '/agent/viewOrgAgent',
        method: 'POST',
        comment: ''
      },
      /**
       * 去掉org
       */
      listAgent: { module: 'ca', url: '/agent/listAgent', method: 'POST', comment: '' },
      viewAgent: { module: 'ca', url: '/agent/viewAgent', method: 'POST', comment: '' },
      listHumanAgent: {
        module: 'ca',
        url: '/agent/listHumanAgent',
        method: 'POST',
        comment: ''
      },
      viewHumanAgent: {
        module: 'ca',
        url: '/agent/viewHumanAgent',
        method: 'POST',
        comment: ''
      }
    },
    // 结算价格
    settlementNew:{
      auditForm: { module: 'settlement', url: '/manage/auditForm', method: 'POST', comment: '审核' },
      queryForm: { module: 'settlement', url: '/manage/queryForm', method: 'POST', comment: '查询单据详情' },
      queryPagedAdjustList: { module: 'settlement', url: '/manage/queryPagedAdjustList', method: 'POST', comment: '查询调整单列表' },
      queryPagedApplyList: { module: 'settlement', url: '/manage/queryPagedApplyList', method: 'POST', comment: '查询申请单列表' },
      queryPagedInvalidList: { module: 'settlement', url: '/manage/queryPagedInvalidList', method: 'POST', comment: '查询作废单列表' },
      queryPagedModifyList: { module: 'settlement', url: '/manage/queryPagedModifyList', method: 'POST', comment: '查询修改单列表' },
      queryPagedPreList: { module: 'settlement', url: '/manage/queryPagedPreList', method: 'POST', comment: '待生效列表（指令集）' },
      queryPre: { module: 'settlement', url: '/manage/queryPre', method: 'POST', comment: '查待生效详情（指令集）' },
      queryResult: { module: 'settlement', url: '/manage/queryResult', method: 'POST', comment: '查询结算规则结果集详情' },
      upsertAdjust: { module: 'settlement', url: '/manage/upsertAdjust', method: 'POST', comment: '创建/更新调整单' },
      upsertApply: { module: 'settlement', url: '/manage/upsertApply', method: 'POST', comment: '创建/更新申请单' },
      upsertInvalid: { module: 'settlement', url: '/manage/upsertInvalid', method: 'POST', comment: '创建/更新作废单' },
      upsertModify: { module: 'settlement', url: '/manage/upsertModify', method: 'POST', comment: '创建/更新修改单' },

      queryPagedNoticeList: { module: 'settlement', url: '/manage/queryPagedNoticeList', method: 'POST', comment: '通知单列表' },
      queryPagedResultList: { module: 'settlement', url: '/manage/queryPagedResultList', method: 'POST', comment: '查询结算规则结果集列表' },
      queryPagedPriceResultList: { module: 'settlement', url: '/manage/queryPagedPriceResultList', method: 'POST', comment: '查询结算价格结果数据' },
    },
    venusCmDeedType: {
      create: { module: 'venus', url: '/venusCmDeedType/create', method: 'POST', comment: '' },
      list: { module: 'venus', url: '/venusCmDeedType/list', method: 'POST', comment: '' },
      update: { module: 'venus', url: '/venusCmDeedType/update', method: 'POST', comment: '' },
      view: { module: 'venus', url: '/venusCmDeedType/view', method: 'POST', comment: '' },
    },
    venusCmVersion: {
      create: { module: 'venus', url: '/venusCmVersion/create', method: 'POST', comment: '' },
      list: { module: 'venus', url: '/venusCmVersion/list', method: 'POST', comment: '' },
      update: { module: 'venus', url: '/venusCmVersion/update', method: 'POST', comment: '' },
      view: { module: 'venus', url: '/venusCmVersion/view', method: 'POST', comment: '' },
    },
    // 协议嵌套关联关系
    ecRefApply: {
      audit: { module: 'venus', url: '/ecRefApply/audit', method: 'POST', comment: '新增' },
      delete: { module: 'venus', url: '/ecRefApply/delete', method: 'POST', comment: '删除' },
      update: { module: 'venus', url: '/ecRefApply/update', method: 'POST', comment: '编辑' },
      create: { module: 'venus', url: '/ecRefApply/create', method: 'POST', comment: '新增' },
      view: { module: 'venus', url: '/ecRefApply/view', method: 'POST', comment: '详情' },
      listDirective: { module: 'venus', url: '/ecRefApply/listDirective', method: 'POST', comment: '指令集' },
      viewDirective: { module: 'venus', url: '/ecRefApply/viewDirective', method: 'POST', comment: '指令集详情' },
      list: { module: 'venus', url: '/ecRefApply/list', method: 'POST', comment: '列表' },
    },
    // 协议嵌套关联关系结果集
    ecRef: {
      list: { module: 'venus', url: '/ecRef/list', method: 'POST', comment: '列表' },
      viewById: { module: 'venus', url: '/ecRef/viewById', method: 'POST', comment: '详情' },
    },
  }
};
const gloabalConfig = utils.extend(true, {}, envConfig, webAppConfig, config);
export default gloabalConfig;
