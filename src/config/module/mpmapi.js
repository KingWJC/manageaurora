/*
 * @Author: gaopengfei
 * @Date: 2024-05-26 19:03:45
 * @Description: 文件描述~
 * @FilePath: /manage/src/config/module/mpmapi.js
 * @LastEditTime: 2024-06-14 23:55:50
 * @LastEditors: Do not edit
 */
const mpmapi = {

  // 查询自然人
  queryHuman: { module: 'mpmapi', url: '/crcApplication/queryHuman', method: 'POST', comment: '自然人' },

  // 自然人CRC申请单 - 列表
  crcApplicationList: { module: 'mpmapi', url: '/crcApplication/list', method: 'POST', comment: '自然人CRC申请列表' },

  // 获取CRC认证申请 - 详情
  getCrcApplicationView: { module: 'mpmapi', url: '/crcApplication/view', method: 'POST', comment: '获取CRC认证申请详情' },

  // 获取CRC认证待生效申请单 - 详情
  getviewDirective: { module: 'mpmapi', url: '/crcApplication/viewDirective', method: 'POST', comment: '获取CRC认证申请详情' },


  // 提交自然人CRC申请，type按单据类型传递，1（新建单据）/2（修改单据/3（修改待生效新建单据）/4（修改待生效修改单据）/5（作废单据）/6（修改生效作废单据）
  crcApplicationSubmit: { module: 'mpmapi', url: '/crcApplication/submit', method: 'POST', comment: '提交自然人CRC申请，type按单据类型传递' },

  // 申请单 - 编辑
  crcApplicationEdit: { module: 'mpmapi', url: '/crcApplication/edit', method: 'POST', comment: '提交自然人CRC申请，type按单据类型传递' },

  // 新增CRC认证
  saveTcaCrcProject: { module: 'mpmapi', url: '/crcApplication/saveTcaCrcProject', method: 'POST', comment: '新增CRC认证' },


  // 审核、审批CRC认证
  auditTcaCrcProject: { module: 'mpmapi', url: '/crcApplication/audit', method: 'POST', comment: '审核CRC认证' },

  /**
   *
   * 指令列表
   * **/
  listDirective: { module: 'mpmapi', url: '/crcApplication/listDirective', method: 'POST', comment: '指令列表'},

    /**
     * 单据删除

    * **/
  crcApplicationDelete: { module: 'mpmapi', url: '/crcApplication/delete', method: 'POST', comment: '单据删除' },
  /**
   * 通过humanid 查询，CRC信息
   * **/
  crcQueryByHumanId: { module: 'mpmapi', url: '/crcApplication/queryByHumanId', method: 'POST', comment: '单据删除' },

  // 独立采样者分页列表信息查询
  independentPersonSamplingIndepList: { module: 'mpmapi', url: '/independentPersonSampling/independentPersonSampling/list', method: 'POST', comment: '独立采样者分页列表信息查询' },


  // /crcApplication/queryByHumanId
}

export default mpmapi;
