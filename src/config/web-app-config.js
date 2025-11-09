/**
 * command: getAppProxyData 代理请求协议
 */
export default {
  services: {
    appCommand:{
      getAppInfo: {'command': 'getAppInfo'}, // 获取App信息
      cmdAppLogout: {'command': 'cmdAppLogout'}, // App退出登录
      //toggleModal: {command: 'ToggleModal'}, // 唤起app遮罩
      //getMedical: {command: 'GetMedical'}, // 获取药品
      //getMedicalType: {command: 'GetMedicalType'} // 获取药品的类型列表
      //getPrinterList: {'command': 'GetPrinterList'}, // 获取打印机列表 todo 未测试
      // 获取打印机列表
      //cmdPrint: {'command': 'CmdPrintWebPage'}, // 打印WEB页面-todo
      //cmdOpenAppPrinter: {'command': 'CmdOpenAppPrinter'}, // 打开App打印对话框-todo testing
      // cmdAppPrinterClosed: {'command': 'CmdAppPrinterClosed'}, //
      //cmdOpenIDCardReader: {'command': 'CmdOpenIDCardReader'}, // 打开身份证阅读机，返回状态-todo testing
      //cmdOpenBarCodeScanningGun: {'command': 'CmdOpenBarCodeScanningGun'}, // 打开扫码枪-todo testing
      //cmdIDCardReaderStatusChange: {'command': 'CmdIDCardReaderStatusChange'}, // 身份证阅读机状态变化通知
      //cmdIDCardReaderMsg: {'command': 'CmdIDCardReaderMsg'}, // 身份证阅读机读身份证消息通知
    }
  }
}
