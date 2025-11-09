/*
 * @Author: tuWei
 * @Date: 2022-07-28 16:59:31
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2025-08-24 22:57:20
 */
/**
 * Web-App协定消息列表
 */
let handlers = {
  cmdAppBack:[], // App后退按键监听器
  cmdAppForward: [], // App前进按键监听器
  //CmdIDCardReaderStatusChange: [], // 监听身份证阅读器状态变化
  //CmdIDCardReaderMsg: [], // 监听身份证阅读器扫码消息
  //CmdBarCodeScanningGunMsg: [], // 监听扫码枪扫码消息
  //CmdBarCodeScanningGunStatusChange: [], // 监听扫码枪状态变化
  //CmdPrinterStatusChange: [], // 监听打印机状态变化
  //CmdAppPrinterMsg: [] // 监听原生打印结果
  postMessage: [],
  addSimpleMsgListener: [], // 文本接收
  sendC2CTextMessage: [], // 发送文本消息
  // sendCustomMessage: [], // 发送药品消息
  recivedCustomMessage: [], // 接收药品消息
  V2TIMManager: [], // 单例调用
  recivedC2CTextMessage: [], // 收到单聊新消息
  recivedGroupTextMessage: [], // 收到群聊新消息
  recivedNewConversation: [], // 有新的会话
  recivedConversationChanged: [], // 当前会话列表有关键信息变化
  keyboardChange: [], // 键盘弹出收起事件
  cmdAppNotificationMsg: [], // 通知消息
  getConversationList: [], // PC新会话消息
  getUsersInfo: [], // PC返回头像
  cmdAppLiveBroadcastSettings: [], // app通知直播设置
  netStatusChanged: [], //网络状态变化监听
  syncAppPropertyChanged:[], //监听数据同步助手发送的消息
  noticeLiveLinkData: [], // 收到连麦消息
  dataChangeNotice: [], // 监听云诊室处方信息变动通知
  noticePushData:[],//云屏消息推送
  noticeCity:[],//云屏地区获取
  noticeWeather:[],//云屏天气获取
  cmdEnterLeaveRoom: [], // 收到有人进入直播间消息
  appNoticeBaseDataChanged: [], // app收到基础数据变更，逐个webview通知h5
  visibilityChanged:[], // 隐藏显示监听
  cmdIDCardReaderMsg: [], // 监听身份证读卡器消息
  cmdCloudInquiryVideoCallHandUP:[],//问诊页面关闭
  recivedScanResult:[],//通知扫码结果
  livePageExit: [], // 监听直播退出
  appSendDataToH5:[],//云屏s消息推送新协议
  appNoticeTimerAction: [], // 监听定时任务
  cmdLrtcAppNotifyH5: [], // app 通知 LRTC 信息
  cmdNotifyInquiryData: [], // LRTC接听后，通知APP，APP再通知视频问诊H5
  cmdAppPushWebRTCVideoStream: [], // App 推送 WebRTC 视频流
  appNoticeWindowStatusChange: [], // app通知h5窗体是激活状态还是非激活状态
  appNoticeAppStatusChange: [], // app通知h5进入后台或切换至前台
};
export default handlers;
