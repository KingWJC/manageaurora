/*
 * @Author: tuWei
 * @Date: 2022-03-16 14:27:09
 * @LastEditors: tuWei
 * @LastEditTime: 2022-11-13 00:09:29
 */
const ehrapi = {
  saveProfessionInfo:{ module:'ehrapi',url:'/profession/saveProfessionInfo', method: 'POST', comment: '新增或修改履历信息'},
  auditProfession:{ module:'ehrapi',url:'/profession/auditProfession', method: 'POST', comment: '审核用户履历'},
  delProfession:{ module:'ehrapi',url:'/profession/delProfession', method: 'POST', comment: '删除用户履历'},
  queryProfessionHumanList:{ module:'ehrapi',url:'/profession/queryProfessionHumanList', method: 'POST', comment: '查询用户履历列表'},
  queryProfessionInfoByHuman:{ module:'ehrapi',url:'/profession/queryProfessionInfoByHuman', method: 'POST', comment: '查询个人的职业履历信息详情'},
  calPersonalYearPay:{ module:'ehrapi',url:'/pay/calPersonalYearPay', method: 'POST', comment: '根据月薪计算薪酬'},
  querySocialSecurityArea:{ module:'ehrapi',url:'/socialSecurity/querySocialSecurityArea', method: 'POST', comment: '查询已录入的省区和市区'},
  querySocialSecurityList:{ module:'ehrapi',url: '/socialSecurity/querySocialSecurityList', method: 'POST', comment: '查询社保列表'},
  saveSocialSecurityInfo:{ module:'ehrapi',url: '/socialSecurity/saveSocialSecurityInfo', method: 'POST', comment: '保存社保信息'},
  queryIndustry:{ module:'ehrapi',url: '/socialSecurity/queryIndustry', method: 'POST', comment: '查询社保行业分类'},
  querySecurityInfosById:{ module:'ehrapi',url: '/socialSecurity/queryInfosById', method: 'POST', comment: '根据社保id查询详情'},
  querySecurityDescription:{ module:'ehrapi',url: '/socialSecurity/queryDescription', method: 'POST', comment: '查询社保说明项'},
  saveSecurityDescription:{ module:'ehrapi',url: '/socialSecurity/saveDescription', method: 'POST', comment: '保存社保说明项'},
  querySYPageIndustry:{ module:'ehrapi',url: '/socialSecurity/queryPageIndustry', method: 'POST', comment: '工伤保险行业风险分类表查询'},

  //工作日管理
  selectAttendanceDay: { module: 'ehrapi', url: '/hrAttendance/selectAttendanceDay', method: 'POST', comment: '' },
  insertOrUpdateAttendanceDay: { module: 'ehrapi', url: '/hrAttendance/insertOrUpdateAttendanceDay', method: 'POST', comment: '' },
  //考勤打卡记录
  selectAttendanceMonth: { module: 'ehrapi', url: '/hrAttendance/selectAttendanceMonth', method: 'POST', comment: '' },
  //考勤规则管理
  selectAttendanceRule: { module: 'ehrapi', url: '/hrAttendance/selectAttendanceRule', method: 'POST', comment: '' },
  insertOrUpdateAttendanceRule: { module: 'ehrapi', url: '/hrAttendance/insertOrUpdateAttendanceRule', method: 'POST', comment: '' },
  saveOrUpdateAttendanceRule: { module: 'ehrapi', url: '/hrAttendance/saveOrUpdateAttendanceRule', method: 'POST', comment: '' },
  
  //行政认证-人员基础档案-切换人员表接口-自然人改造

  queryPersonnelBaseFilesPage: { module: 'ehrapi', url: '/staff/queryPersonnelBaseFilesPage', method: 'POST', comment: '查询自然人人员列表' },
  humanAuthenticationEhr: { module: 'ehrapi', url: '/administration/humanAuthentication', method: 'POST', comment: '行政认证操作' },
  saveOrUpdateCaHumanAdministration: { module: 'ehrapi', url: '/administration/saveOrUpdateCaHumanAdministration', method: 'POST', comment: '删除兼岗' },
  selectHuman4AdministrationByHumanId: { module: 'ehrapi', url: '/administration/selectHuman4AdministrationByHumanId', method: 'POST', comment: '查询行政组织部门接口' },
  selectHumanByOrgEhr: { module: 'ehrapi', url: '/administration/selectHumanByOrg', method: 'POST', comment: '选领导--树状' },
  queryAllPositionNature: { module: 'ehrapi', url: '/common/queryAllPositionNature', method: 'POST', comment: '岗位类型' },
  queryAllPosition: { module: 'ehrapi', url: '/common/queryAllPosition', method: 'POST', comment: '查询人员岗位' },
  selectPositionNatureLevel: { module: 'ehrapi', url: '/common/selectPositionNatureLevel', method: 'POST', comment: '查询人员岗位级别列表' },
  queryCorporateList: { module: 'ehrapi', url: '/common/queryCorporateList', method: 'POST', comment: '法人组织' },
  queryHumanInfoList: { module: 'ehrapi', url: '/common/queryHumanInfoList', method: 'POST', comment: '查询用户信息列表' },
  selectAdministration: { module: 'ehrapi', url: '/administration/selectAdministration', method: 'POST', comment: '' },
  updateHuman4AdministrationByHumanId: { module: 'ehrapi', url: '/administration/updateHuman4AdministrationByHumanId', method: 'POST', comment: '行政认证修改' },
  closeCaHumanAdministration: { module: 'ehrapi', url: '/administration/closeCaHumanAdministration', method: 'POST', comment: '行政认证岗位失效' },
  humanConfirmMsg: { module: 'ehrapi', url: '/administration/humanConfirmMsg', method: 'POST', comment: '行政认证确认' },
  queryPositionByHumanId: { module: 'ehrapi', url: '/common/queryPositionByHumanId', method: 'POST', comment: '根据自然人id查询其职位信息' },

  //基础档案
  examineCaPersonnelInfo: { module: 'ehrapi', url: '/staff/examineCaPersonnelInfo', method: 'POST', comment: '审核基础档案' },
  getCaPersonnelInfoDetail: { module: 'ehrapi', url: '/staff/getCaPersonnelInfoDetail', method: 'POST', comment: '根据humanId获取基础档案详情' },
  updateCaPersonnelInfo: { module: 'ehrapi', url: '/staff/updateCaPersonnelInfo', method: 'POST', comment: '保存基础档案' },
  getCaPersonnelInfoDetailByToken: { module: 'ehrapi', url: '/staff/getCaPersonnelInfoDetailByToken', method: 'POST', comment: '查询自己基础档案信息' },
  //人员关系
  updateHumanParent: { module: 'ehrapi', url: '/administration/updateHumanParent', method: 'POST', comment: '人员关系' },

}
export default ehrapi;