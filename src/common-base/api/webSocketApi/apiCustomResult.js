/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-14 10:52:39
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-08-08 11:29:03
 * @Description: 模拟返回接口错误数据
 * 
 * RES_502("SERgtw1101100001", "目标服务502异常，请联系我们！"),
RES_404("SERgtw1101100002", "目标服务404异常，请联系我们！"),
RES_500("SERgtw1101100003", "目标服务500异常，请联系我们！"),
RES_UNKNOWN_ERROR("SERgtw1101100004", "目标服务发生异常，请联系我们！"),
RES_DOWN_MAINTENANCE("SERgtw1101100005", "系统停机维护中"),
RES_ERROR("SERgtw1101100006", "目标服务发生错误"),
NETTY_ERROR("SERgtw1101100007", "网关异常，请稍后重试"),
SCHEME_NOT_SUPPORT("SERgtw1101100008", "请求scheme不支持"),

AUTH_GETPERMSIGNOREURL("SERgtw1201100001", "查询忽略权限失败，请联系我们"),
AUTH_GETPERMSURL("SERgtw1201100002", "查询权限接口失败，请联系我们"),
AUTH_DATAOWNERORGID_NOT_NULL("SERgtw1201100004", "dataOwnerOrgId不能为空"),
AUTH_NOT_PERMS("SERgtw1201100005", "服务拒绝访问,请联系我们授权"),
AUTH_PRODUCTID_NOT_NULL("SERgtw1201100007", "productId不能为空"),
AUTH_GETDATAPERMSURL("SERgtw1201100008", "查询数据权限接口失败，请联系我们"),
AUTH_FORCED_OFFLINE("SERgtw1201100010", "强制下线，请重新登录"),
MODULE_ISNULL("SERgtw1201100011", "moduleCode不能为空"),
SEND_LOG_FAIL("SERGTW1201100013", "队列已满，可能是监控系统失去响应"),

ROUTE_MATCHING_FAIL("SERGTW1201100014", "路由匹配失败，请检查路由配置"),
MQ_CONSUME_FAIL("SERGTW1201100015", "消费mq失败，请联系我们"),

GATEWAY_BOOT_FAILED("SERGTW1201100016", "网关启动失败，请联系我们"),
HUB_BOOT_FAILED("SERGTW1201100017", "网关Hub启动失败，请联系我们"),
RATE_LIMIT("SERGTW1201100018", "服务拒绝访问,请您稍后重试"),
PARAM_ERROR("SERGTW1201100019", "请求参数格式错误,请联系我们"),
SCHEME_ERROR("SERGTW1201100020", "scheme参数错误,请联系我们"),
METHOD_ERROR("SERGTW1201100021", "method参数错误,请联系我们"),
CONTENT_TYPE_ERROR("SERGTW1201100023", "contentType参数错误,请联系我们"),
PROTOCOL_VERSION_ERROR("SERGTW1201100024", "protocolVersion参数错误,请联系我们"),
URL_ERROR("SERGTW1201100025", "url参数错误,请联系我们"),
BODY_ERROR("SERGTW1201100026", "body参数错误,请联系我们"),
SID_ERROR("SERGTW1201100027", "sid参数错误,请联系我们"),
FORWARD_ERROR("SERGTW1201100028", "forward参数错误,请联系我们"),
TARGET_TYPE_ERROR("SERGTW1201100029", "targetType参数错误,请联系我们"),
TARGET_ID_ERROR("SERGTW1201100030", "targetId参数错误,请联系我们"),
CLIENT_ID_ERROR("SERGTW1201100031", "clientId参数错误,请联系我们"),
HANDLE_WEBSOCKET_TEXT_FAIL("SERGTW1201100032", "转发websocket异常"),
BACKEND_CONNECTION_FAIL("SERGTW1202100001", "%s连接失败，请稍后重试"),
BACKEND_CONNECTION_CLOSE("SERGTW1202100002", "服务端连接已关闭，请重试"),
CLIENT_CONNECTION_CLOSE("SERGTW1202100003", "客户端连接已关闭，请重试");

AUTH_UUID_ISNULL("SERgtw1201100009", "uuid不能为空"),  

AUTH_TOKEN_EXPIRE("SERGTW1201100003", "token已经过期，请重新登录"),
AUTH_TOKEN_ISNULL("SERGTW1201100006", "token不能为空"),
AUTH_TOKEN_ILLEGALITY("SERGTW1201100012", "token中参数错误"),
TOKEN_ERROR("SERGTW1201100022", "token参数错误,请联系我们"),
TOKEN_USER_ID_ILLEGALITY("SERGTW1201100033", "token中userId参数错误"),
TOKEN_PRODUCT_ID_ILLEGALITY("SERGTW1201100034", "token中productId参数错误"),
 */
// import webLog from '../web-log';
// import config from '../../../config/index';


// 错误类型
export const RESULT_TYPE_ENUM = {
  TIMEOUT: 'timeout', // 超时
  CLOSE: 'webSocketClose', // 关闭
  TOKEN_EXPIRE: 'token-expire', // token为过期
  TOKEN_EMPTY: 'token-empty', // token为空
  TOKEN_ERROR: 'token-error', // token为参数错误
  TOKEN_ERROR_01: 'token-error-01', // token参数错误,请联系我们
  TOKEN_USER_ID_ERROR: 'token-user-id-error', // token中userId参数错误
  TOKEN_PRODUCT_ID_ERROR: 'token-product-id-error', // token中productId参数错误
  
  ROUTER_MATCH_ERROR: 'router-match-error', // 路由匹配失败，请检查路由配置 
};

// 错误code
export const ERROR_CODE_ENUM = {
  [RESULT_TYPE_ENUM.TIMEOUT]: 'WEBAPPwebSocket000002',
  [RESULT_TYPE_ENUM.CLOSE]: 'WEBAPPwebSocket000001',
  [RESULT_TYPE_ENUM.TOKEN_EXPIRE]: 'SERGTW1201100003', // token为过期
  [RESULT_TYPE_ENUM.TOKEN_EMPTY]: 'SERGTW1201100006', // token为空
  [RESULT_TYPE_ENUM.TOKEN_ERROR]: 'SERGTW1201100022', // token为参数错误
  [RESULT_TYPE_ENUM.TOKEN_ERROR_01]: 'SERGTW1201100022', // token参数错误,请联系我们
  [RESULT_TYPE_ENUM.TOKEN_USER_ID_ERROR]: 'SERGTW1201100033', // token中userId参数错误
  [RESULT_TYPE_ENUM.TOKEN_PRODUCT_ID_ERROR]: 'SERGTW1201100034', // token中productId参数错误

  [RESULT_TYPE_ENUM.ROUTER_MATCH_ERROR]: 'SERGTW1201100014', // 路由匹配失败，请检查路由配置
};

/**
 * 无效的token列表
 */
export const tokenInvalidList = [
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_EXPIRE]],
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_EMPTY]], 
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_ERROR]],
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_ERROR_01]],
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_USER_ID_ERROR]],
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.TOKEN_PRODUCT_ID_ERROR]],
];

/**
 * webSocket连接报错
 */
export const webSocketConnectErrorList = [
  ERROR_CODE_ENUM[[RESULT_TYPE_ENUM.ROUTER_MATCH_ERROR]],
]

// 错误描述
const ERROR_MSG_ENUM = {
  [RESULT_TYPE_ENUM.TIMEOUT]: '请求超时，请重试；',
  [RESULT_TYPE_ENUM.CLOSE]: '网络断开，请重试；'
};

const defaultVersion =  '2.0'

// 得到错误类型列表
const resultTypeList = Object.values(RESULT_TYPE_ENUM);


export default function getApiCustomResult(type, id, data) {
  if (!resultTypeList.includes(type)) {
    console.warn(`webSocket异常信息没有type：${type}`);
    return;
  }
  if (!id) {
    console.warn(`webSocket异常信息没有id：${id}`);
    return;
  }

  /**
   * 接口返回的数据格式
   */
  const res =  {
    code: ERROR_CODE_ENUM[type],
    errorCode: ERROR_CODE_ENUM[type],
    errorMsg: ERROR_MSG_ENUM[type],
    opFlag: false,
    protocolVersion: defaultVersion,
    serviceResult: null,
    sid: id,
    timestamp: Date.now()
  };

  return res
}
