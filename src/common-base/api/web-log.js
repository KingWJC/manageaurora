/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-01-18 01:32:02
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-06-21 11:00:57
 * @FilePath: \common-base\api\web-log.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 前端错误编码规则
 * level: error(错误), warn（警告）, info(消息)
 * msg: 自定义字符串（建议同编码描述字符串）
 * code: 6位编码前两位位错误类型，后四位错误编码
 *   前两位解释为：00(自定义) 01前端配置错误 02 数据错误 03 运行时错误，04 WEB-APP交互规范, 05 权限问题
 *   后四位可以添加具体错误编码
 * 已定义错误编码
 *   WEBAPP000000: '自定义消息',
 *   WEBAPP010000: '前端配置错误',
 *   WEBAPP010001: '未绑定数据回调',
 *   WEBAPP010002: '接口未配置',
 *   WEBAPP020000: '数据返回异常',
 *   WEBAPP020001: 'JSON 解析错误',
 *   WEBAPP020002: '数据不符合规范',
 *   WEBAPP020003: '服务端未返回内容',
 *   WEBAPP030000: '前端代码报错',
 *   WEBAPP030001: '设置缓存异常',
 *   WEBAPP040000: '发起webApp协议错误',
 *   WEBAPP050000: '无权限访问',
 */

import api from './api';
import config from '../../config/index';
import utils from '../utils/utils';
import { getAESDecryptString, getCookieSKKey } from '../utils/crypto';

/**
 * 上报错误日志，支持直接上传err.msg
 * @param service
 * @param params
 * @param data
 * @param err
 * @param time
 * @param cfg 默认取公共配置对象
 * @param info 说明
 */
export function log (err, service, params, data, time, cfg, info) {
  // 上报异常时发生异常，则不再次上报
  if(service && service.url === '/log/sendH5ErrorLog') {
    return;
  }
  cfg = cfg || config;
  // 如果请求是加密请求，则返回数据需要解密(JSON 字符串)，作为 originDemand 放入 params 中
  if (cfg?.sk && params?.secretType && typeof params?.demand === 'string') {
    params.originDemand = getAESDecryptString(params.demand, cfg.sk);
    params.sk = config.sk;
    params.cookieSk = utils.getCookie(getCookieSKKey());
  }
  // 没有配置logUrl或关闭日志
  if (!cfg.isOpenLog || cfg.netStatus === 0) {
    console.error(err);
    console.error(params);
    console.error(data);
    return;
  }
  if (service && service.noLog) {
    console.error(err);
    console.error(params);
    console.error(data);
    return;
  }
  params = params || {};
  // const url = service && service.url ? (/^(http|ws)[s]?:\/\//.test(service.url) ? service.url : /^(http|ws)[s]?:\/\//.test(cfg.modules[service.module]) ? cfg.modules[service.module] + service.url : cfg.project.gateway + cfg.modules[service.module] + service.url) : service && service.command ? service.command : '';
  // 20241226优化sonar
  let url = '';
  if (service && service.url) {
    if (/^(http|ws)[s]?:\/\//.test(service.url)) {
      url = service.url;
    } else if (/^(http|ws)[s]?:\/\//.test(cfg.modules[service.module])) {
      url = cfg.modules[service.module] + service.url;
    } else {
      url = cfg.project.gateway + cfg.modules[service.module] + service.url;
    }
  } else if (service && service.command) {
    url = service.command;
  }

  // 发送h5错误日志接口报错，不再发送
  if(url.includes('/log/sendH5ErrorLog')) {
    return
  }
  let clientInfo = cfg.client.clientInfo || config.client.clientInfo || {};
  //andorid、ios、pc、mac、企业微信
  let history = window.vue && window.vue.$routerHistory ? window.vue.$routerHistory.list() || [] : [];
  let sourceRoute = history && history.length >= 2 ? history[history.length - 2] : {};
  let endTime = new Date().getTime();
  let remark = {
    info: info,
    from: sourceRoute.fullPath,
    start: params ? params.timestamp : '',
    end: endTime,
    takeTime: params && params.timestamp ? endTime - params.timestamp : ''
  };
  // 20241220优化下方三元表达式展示
  // 错误编码
  let errCode = '';
  if (data && typeof data === 'object') {
    errCode = data.code;
  } else if (typeof err === 'object') {
    errCode = err.code || '';
  }
  let args = {
    sourceName: cfg.projectName,
    sourceType: LonchJsApi && LonchJsApi.clientType ? LonchJsApi.clientType : 'web-app', //区分同一个页面是否多端使用（andorid、ios、pc、mac、企业微信）
    appVer: LonchJsApi && LonchJsApi.isInApp() ? clientInfo.version : '',	// 宿主版本号（app、小程序）
    h5Ver: getVersion(), // h5版本
    reqUrl: url, //请求接口地址
    reqParam: params ? JSON.stringify(params) : '', //请求接口参数
    reqResult: typeof data === 'object' ? JSON.stringify(data) : data, //接口返回结果
    curPageUrl: window.location.href, // 当前页面url
    curPageTitle: document.title, //当前页面标题
    errLevel: typeof err === 'object' ? err.level : 'info', // 错误级别, error, warn, info
    // errCode: data && typeof data === 'object' ? data.code : typeof err === 'object' ? err.code || '' : '', //错误编码
    errCode,
    errMsg: typeof err === 'object' ? err.msg : err, //错误信息
    sid: service && service.config && service.config.headers ? service.config.headers.sid || params.sid || err.sid : params.sid || err.sid,
    remark: JSON.stringify(remark),
    userAgent: window.navigator.userAgent, // 浏览器agent
    browserInfo: '', //	浏览器类型(chrome的版本是：89.0.4389.90)
    prePageUrl: sourceRoute.fullPath, // 暂无
    // 20240710新增耗时
    executeTime: time
  };
  api.send({module: 'operlogNoGetway', url: '/log/sendH5ErrorLog', method: 'POST', noLog: true},
    args,
    function () {
    },
    function () {
    },
    null,
    true
  );
}

/**
 * 自定义日志
 */
export function customLog (args) {
  if (!config.isOpenLog || config.netStatus === 0) {
    return;
  }
  api.send(
    {module: 'operlogNoGetway', url: '/log/sendH5ErrorLog', method: 'POST', noLog: true},
    args,
    function () {
    },
    function () {
    },
    null,
    true
  );
}

function getVersion () {
  let matchVersions = window.location.href.match(/\/v\d+\.\d+\.\d+\//gi) || [];
  return matchVersions.length > 0 ? matchVersions[0].replace(/\//g, '') : '';
}

/**
 * 上报用户行为
 * @param args
 * operation:操作行为
 * url:'',// 当前页面地址，必须
 * evt:'',// 事件 非必须
 * target:'',// 页面触发对象，非必须
 * data：//数据，非必须
 * startTime:开始时间  事例：2021-07-26 17:53:26
 * endTime:结束时间   事例：2021-07-26 17:53:27
 * fromType:上报方1h5;2app
 */
export function reportBehavior (params) {
  let args = Object.assign({}, {
    url: window.location.href,
    startTime: new Date().getTime().toString(),
    fromType: '1'
  }, params);
  if (/multiFrames/.test(args.url)) {
    args.url = decodeURIComponent(window.atob(decodeURIComponent(utils.getParam('url', args.url))));
  }
  if (LonchJsApi.isInApp()) {
    api.send({command: 'reportBehavior', noLog: true, noErrTips: true}, args,
      function () {
      },
      function () {
      },
      null,
      true
    );
  }
}

export default {
  log,
  customLog,
  reportBehavior
};
