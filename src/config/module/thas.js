
const thas = {
  deviceAdd   : { module: "thas", url: "/device/add", method: "POST", comment: "新增设备档案" },
  deviceDel   : { module: "thas", url: "/device/del", method: "POST", comment: "通过id删除设备档案" },
  deviceDetail: { module: "thas", url: "/device/detail", method: "POST", comment: "通过id查询" },
  deviceEdit  : { module: "thas", url: "/device/edit", method: "POST", comment: "修改设备档案" },
  devicePage  : { module: "thas", url: "/device/page", method: "POST", comment: "分页查询" },

  saveStorageDevice: { module: "thas", url: "/device/saveStorageDevice", method: "POST", comment: "保存存放位置" },

  warnSetting: { module: "thas", url: "/device/setting", method: "POST", comment: "温湿度设备阈值设置" },
  queryWarnSetting: { module: "thas", url: "/device/settingDetail", method: "POST", comment: "溫湿度设备阈值设置详情" },
  queryScreenItemList: { module: "thas", url: "/th/list", method: "POST", comment: "大屏列表" },
  queryDeviceItem: { module: "thas", url: "/device/list", method: "POST", comment: "查询某个设备" },
  queryTemAndHumChangeAllDay: { module: "thas", url: "/th/currentDayDatalist", method: "POST", comment: "查询该设备当天的温湿度变化" },

}

export default thas
