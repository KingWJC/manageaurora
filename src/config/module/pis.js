/*
 * @Author: tuWei
 * @Date: 2022-12-27 00:21:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-24 12:07:59
 */
export default {
  // 盘点管理接口字典迁移
  queryCountingCycleTypeList: { module: 'pis', url: '/search/countingCycleType', method: 'POST', comment: '查询盘点周期类型列表' },
  queryCountingMethodList: { module: 'pis', url: '/search/countingMethod', method: 'POST', comment: '查询盘点方式列表' },
  queryCountingTypeList: { module: 'pis', url: '/search/countingType', method: 'POST', comment: '查询盘点类型列表' },
  //其他出库
  inOutMethodQueryList: { module: 'pis', url: '/search/inOutMethod', method: 'POST', comment: '出入库方式列表' },
  pagedGoodsPossessor: { module: 'pis', url: '/base/pagedGoodsPossessor', method: 'POST', comment: '分页查询货物资产所有者' },
}
