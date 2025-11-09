const ErrorStatus = {
  // 6位编码前两位位错误类型，后四位错误编码
  // 00 自定义
  // 01 前端配置错误
  // 02 数据错误
  // 03 运行时错误
  // 04 WEB-APP交互规范
  WEBAPP000000: '自定义消息',
  WEBAPP010000: '前端配置错误',
  WEBAPP010001: '未绑定数据回调',
  WEBAPP010002: '接口未配置',
  WEBAPP020000: '数据返回异常',
  WEBAPP020001: 'JSON 解析错误',
  WEBAPP020002: '数据不符合规范',
  WEBAPP030000: '前端代码报错',
  WEBAPP030001: '设置缓存异常',
  WEBAPP040000: '发起webApp协议错误',
  WEBAPP050000: '本地接口出现错误',
};
export default ErrorStatus;
