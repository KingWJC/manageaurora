/**
 * postMessage消息处理
 */
import config from '../../config';
import Login from '../login/login';
import WebSocketService from './webSocketApi/WebSocketService.js'
import { IFRAME_WEB_SOCKET } from './webSocketApi/IframeWebSocket.js'

import { setPermissionAction } from '@/common-base/api/permission';

function postMessageHandlers (msgData) {
  let command = msgData.command;
  let data = msgData.data || msgData.params;
  let frameName = msgData.frameName;
  let sn = msgData.sn;
  let callBack;
  switch (command) {
    case 'INNER-FRAME-READY':
      LonchJsApi.postMessage(
        sn || 'INNER-FRAME-READY-BACK', // 兼容没有老版本没有传sn
        {
          token: config.token,
          loginTime: config.loginTime,
          isVisitor: config.isVisitor,
          isSupportH5Cache: config.isSupportH5Cache,
          terminalId: config.terminalId,
          sk: config.sk,
          userInfo: config.userInfo,
          versionConfig: config.versionConfig,
          permissions: config.permissions,
          appType: config.client.apptype,
          clientType: LonchJsApi.clientType,
          isMultiWebFramework: config.isMultiWebFramework,
          projectName: config.projectName,
          project: config.project,
          projectTitle: config.projectTitle,
          customSettings: config.customSettings,
          clientInfo: config.client.clientInfo,
          isCommonDataConfigInitialized: config.isCommonDataConfigInitialized,
          isCommonDataPreLoadingInitialized: config.isCommonDataPreLoadingInitialized,
          commonDataConfig: config.commonDataConfig,

          appName      : config.appName,
          projects     : config.projects,
          origins      : config.origins,
          commonParams : config.commonParams,
          isLogin      : config.isLogin,
          netStatus    : config.netStatus,
          clientAppName: config.client.appName,
          permissionTree: config.permissionTree,
          userRoles: config.userRoles,
        },
        frameName
      );
      break;
    case 'WEB-CALL-APP':
      if (data.sn) {
        LonchJsApi.AppCallBacks[data.sn] = {
          frameName: frameName
        };
      }
      LonchJsApi.webCallAppFun(data);
      break;
    case 'APP-CALL-WEB':
      LonchJsApi.appCallWeb(data.sn, data.data);
      break;
    case 'WEB-CALL-APP-V2':
      if (data) {
        LonchJsApi.AppCallBacks[data.sn] = {
          frameName: frameName
        };
      }
      LonchJsApi.webCallAppFun(data);
      break;
    case 'APP-CALL-WEB-V2':
      LonchJsApi.appCallWebV2(data);
      break;
    case 'INNER-FRAME-READY-BACK':
      //计划废弃，改为回调处理
      config.token = data.token;
      config.loginTime = data.loginTime;
      config.isVisitor = data.isVisitor;
      config.isSupportH5Cache = data.isSupportH5Cache;
      config.terminalId = data.terminalId;
      config.userInfo = data.userInfo;
      config.versionConfig = data.versionConfig;
      config.permissions = data.permissions;
      config.isInitialized = true;
      config.isMultiWebFramework = data.isMultiWebFramework;
      config.projectName = data.projectName;
      config.project = data.project;
      config.projectTitle = data.projectTitle;
      config.isCommonDataConfigInitialized = data.isCommonDataConfigInitialized;
      config.isCommonDataPreLoadingInitialized = data.isCommonDataPreLoadingInitialized;
      config.commonDataConfig = data.commonDataConfig;

      config.appName        = data.appName
      config.projects       = data.projects
      config.origins        = data.origins
      config.commonParams   = data.commonParams
      config.isLogin        = data.isLogin
      config.netStatus      = data.netStatus
      config.client.appName = data.clientAppName

      LonchJsApi.isTopWindowInApp = data.isInApp;
      LonchJsApi.clientType = data.clientType;

      config.permissionTree = data.permissionTree
      config.userRoles = data.userRoles;
      // LonchJsApi初始化完成
      LonchJsApi.callReady();
      break;
    case 'INNER-OPEN-URL':
      // 打开给定地址
      LonchJsApi.openUrl(data);
      break;
    case 'INNER-OPEN-MENU':
      LonchJsApi.openMenu(data);
      break;
    case 'GET-TOP-LOCATION-URL':
      // 获取topwindow加载地址
      LonchJsApi.postMessage(
        sn,
        {
          url: window.location.href
        },
        frameName
      );
      break;
    case 'ADD-TASK':
      LonchJsApi.autoTaskMonitor.addTask(data);
      break;
    // 父页面收到通知要创建定时器
    case 'ADD-TIMEOUT':
      LonchJsApi.timeout.addParentTimeout(data);
      break;
    // 父页面收到通知清除定时器
    case 'DESTROY-TIMEOUT':
      LonchJsApi.timeout.destroyTimeout(data.sn);
      break;
    // 通知子页面运行任务
    case 'RUN-TIMEOUT-TASK':
      LonchJsApi.timeout.runTask();
      break;
    case 'TO-LOGOUT':
      Login.toLogOut(data.callbackUrl);
      break;
    case 'TO-LOGIN':
      Login.toLogIn(data.callbackUrl);
      break;
    case 'GO-BACK':
      vue.$router.goBack(data);
      break;
    case 'INNER-FRAME-GET-PERMISSION': 
      if ( window.top === window.self ) {
        setPermissionAction(data.moduleCode).then(() => {
          LonchJsApi.postMessage(
            sn, 
            {
              permissions: config.permissions,
            },
            frameName
          );
        })
      } else {
            
        LonchJsApi.postMessage('INNER-FRAME-GET-PERMISSION', {moduleCode: data.moduleCode}, null, function (data) {
            LonchJsApi.postMessage(
              sn,
              {
                permissions: data.permissions,
              },
              frameName
            );
        });
      }


      break;
    case IFRAME_WEB_SOCKET.REQUEST: {

      
      if ( window.top === window.self ) {

        // 使用socket请求
        const socket = WebSocketService(config)

        socket.send(data).then((res) => {
          LonchJsApi.postMessage(
            sn, 
            {
              type: 'success',
              data: res
            },
            frameName
          );

        }).catch((res) => {
          LonchJsApi.postMessage(
            sn, 
            {
              type: 'error',
              data: res,
            },
            frameName
          );
        })

      } else {
        
        LonchJsApi.postMessage(IFRAME_WEB_SOCKET.REQUEST, data, null, function (data) {
          LonchJsApi.postMessage(
            sn,
            data,
            frameName
          );
        });
      }
      
      break;
    }
    case 'IFRAME-FULLSCREEN':
      // iframe全屏
      if(msgData && msgData.frameName) {
        LonchJsApi.setupIframeScreen(msgData.frameName, msgData.data, 'fullscreen');
      }
      break;
    case 'IFRAME-EXIT-FULLSCREEN':
      // iframe退出全屏
      if(msgData && msgData.frameName) {
        LonchJsApi.setupIframeScreen(msgData.frameName, msgData.data, 'exitFullscreen');
      }
      break;
    default:
      callBack = LonchJsApi.postMessageCallBacks[command];
      if (callBack && typeof callBack === 'function') {
        callBack(data);
      }
      break;
  }
}

export default postMessageHandlers;
