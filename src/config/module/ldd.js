/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-12-19 17:04:13
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-10-13 16:50:13
 * @FilePath: \manage\src\config\module\ldd.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2023-12-19 17:04:13
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-10-11 19:17:50
 * @FilePath: \manage\src\config\module\ldd.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
  @Author: zouzhe
  @Date: 2023-08-06 19:05:13
  @LastEditors: zouzhe
  @Email: zouzhe@lonch.com.cn
  @LastEditTime: 2023-08-28 17:03:02
  @Description: file content
 */
const ldd = {
  // ============== 疾病诊断分组方案版本 ==============
  listSourceType: {
    module: 'ldd',
    url: '/drgEntityVersions/listSourceType',
    method: 'POST',
    comment: '获取疾病诊断分组实体版本来源类型',
  },
  listCertificationParty: {
    module: 'ldd',
    url: '/drgEntityVersions/listCertificationParty',
    method: 'POST',
    comment: '疾病诊断分组实体版本认证方',
  },
  listUseParty: {
    module: 'ldd',
    url: '/drgEntityVersions/listUseParty',
    method: 'POST',
    comment: '疾病诊断分组实体版本应用方',
  },
  drgEntityVersionsList: {
    module: 'ldd',
    url: '/drgEntityVersions/page',
    method: 'POST',
    comment: '获取疾病诊断分组实体版本分页列表',
  },
  drgEntityVersionsSave: {
    module: 'ldd',
    url: '/drgEntityVersions/save',
    method: 'POST',
    comment: '保存疾病诊断分组实体版本记录',
  },
  drgEntityVersionsUpdate: {
    module: 'ldd',
    url: '/drgEntityVersions/update',
    method: 'POST',
    comment: '更新疾病诊断分组实体版本记录',
  },
  drgEntityVersionsGetById: {
    module: 'ldd',
    url: '/drgEntityVersions/getById',
    method: 'POST',
    comment: '获取疾病诊断分组实体版本详情',
  },
  drgEntityVersionsDelete: {
    module: 'ldd',
    url: '/drgEntityVersions/delete',
    method: 'POST',
    comment: '删除疾病诊断分组实体版本记录',
  },
  // ============== 疾病诊断目录申请单 ==============
  // 国家疾病诊断目录申请单
  chsDrgDirectoryApplyList: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/page',
    method: 'POST',
    comment: '获取国家疾病诊断目录申请单（新增、修改、作废）分页列表',
  },
  chsDrgDirectoryApplyGetById: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/getById',
    method: 'POST',
    comment: '获取国家疾病诊断目录申请单（新增、修改、作废）详情',
  },
  chsDrgDirectoryApplySave: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/save',
    method: 'POST',
    comment: '保存国家疾病诊断目录申请单（新增、修改、作废）记录',
  },
  chsDrgDirectoryApplyUpdate: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/update',
    method: 'POST',
    comment: '更新国家疾病诊断目录申请单（新增、修改、作废）记录',
  },
  chsDrgDirectoryApplyDelete: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/delete',
    method: 'POST',
    comment: '删除国家疾病诊断目录申请单（新增、修改、作废）记录',
  },
  chsDrgDirectoryApplyAudit: {
    module: 'ldd',
    url: '/chsDrgDirectoryApply/audit',
    method: 'POST',
    comment: '审批国家疾病诊断目录申请单（新增、修改、作废）记录',
  },

  // 朗致疾病诊断目录申请单
  lonchDrgDirectoryApplyList: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/page',
    method: 'POST',
    comment: '获取朗致疾病诊断目录申请单（新增、修改、作废）分页列表',
  },
  lonchDrgDirectoryApplyGetById: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断目录申请单（新增、修改、作废）详情',
  },
  lonchDrgDirectoryApplySave: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/save',
    method: 'POST',
    comment: '保存朗致疾病诊断目录申请单（新增、修改、作废）记录',
  },
  lonchDrgDirectoryApplyUpdate: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/update',
    method: 'POST',
    comment: '更新朗致疾病诊断目录申请单（新增、修改、作废）记录',
  },
  lonchDrgDirectoryApplyDelete: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断目录申请单（新增、修改、作废）记录',
  },
  lonchDrgDirectoryApplyAudit: {
    module: 'ldd',
    url: '/lonchDrgDirectoryApply/audit',
    method: 'POST',
    comment: '审批朗致疾病诊断目录申请单（新增、修改、作废）记录',
  },
  // ============== 疾病诊断申请单 ==============
  // 国家疾病诊断申请单
  chsDrgSurgeryOrProcedureApplyList: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/page',
    method: 'POST',
    comment: '获取国家疾病诊断申请单（新增、修改、作废）分页列表',
  },
  chsDrgSurgeryOrProcedureApplyGetById: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/getById',
    method: 'POST',
    comment: '获取国家疾病诊断申请单（新增、修改、作废）详情',
  },
  chsDrgSurgeryOrProcedureApplySave: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/save',
    method: 'POST',
    comment: '保存国家疾病诊断申请单（新增、修改、作废）记录',
  },
  chsDrgSurgeryOrProcedureApplyUpdate: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/update',
    method: 'POST',
    comment: '更新国家疾病诊断申请单（新增、修改、作废）记录',
  },
  chsDrgSurgeryOrProcedureApplyDelete: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/delete',
    method: 'POST',
    comment: '删除国家疾病诊断申请单（新增、修改、作废）记录',
  },
  chsDrgSurgeryOrProcedureApplyAudit: {
    module: 'ldd',
    url: '/chsDrgSurgeryOrProcedureApply/audit',
    method: 'POST',
    comment: '审批国家疾病诊断申请单（新增、修改、作废）记录',
  },
  // 朗致疾病诊断申请单
  lonchDrgSurgeryOrProcedureApplyList: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/page',
    method: 'POST',
    comment: '获取朗致疾病诊断申请单（新增、修改、作废）分页列表',
  },
  lonchDrgSurgeryOrProcedureApplyGetById: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断申请单（新增、修改、作废）详情',
  },
  lonchDrgSurgeryOrProcedureApplySave: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/save',
    method: 'POST',
    comment: '保存朗致疾病诊断申请单（新增、修改、作废）记录',
  },
  lonchDrgSurgeryOrProcedureApplyUpdate: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/update',
    method: 'POST',
    comment: '更新朗致疾病诊断申请单（新增、修改、作废）记录',
  },
  lonchDrgSurgeryOrProcedureApplyDelete: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断申请单（新增、修改、作废）记录',
  },
  lonchDrgSurgeryOrProcedureApplyAudit: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureApply/audit',
    method: 'POST',
    comment: '审批朗致疾病诊断申请单（新增、修改、作废）记录',
  },
  // ==============疾病诊断目录 ==============
  // 国家
  // 国家疾病诊断目录类型列表
  cdDirectoryListDirectoryType: {
    module: 'ldd',
    url: '/cdDirectory/listDirectoryType',
    method: 'POST',
    comment: '国家疾病诊断目录类型列表',
  },
  // 国家疾病诊断目录列表
  cdDirectoryList: {
    module: 'ldd',
    url: '/cdDirectory/list',
    method: 'POST',
    comment: '国家疾病诊断目录列表',
  },
  // 国家疾病诊断目录详情
  cdDirectoryGetById: {
    module: 'ldd',
    url: '/cdDirectory/getById',
    method: 'POST',
    comment: '获取国家疾病诊断目录详情',
  },
  // 根据id列表获取国家疾病诊断目录列表
  cdDirectoryGetByIds: {
    module: 'ldd',
    url: '/cdDirectory/getByIds',
    method: 'POST',
    comment: '根据id列表获取国家疾病诊断目录列表',
  },

  // 朗致疾病诊断目录接口：
  // 朗致疾病诊断目录类型列表
  ldDirectoryListDirectoryType: {
    module: 'ldd',
    url: '/ldDirectory/listDirectoryType',
    method: 'POST',
    comment: '朗致疾病诊断目录类型列表',
  },
  // 朗致疾病诊断目录列表
  ldDirectoryList: {
    module: 'ldd',
    url: '/ldDirectory/list',
    method: 'POST',
    comment: '朗致疾病诊断目录列表',
  },
  // 朗致疾病诊断目录详情
  ldDirectoryGetById: {
    module: 'ldd',
    url: '/ldDirectory/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断目录详情',
  },
  // 根据id列表获取朗致疾病诊断目录列表
  ldDirectoryGetByIds: {
    module: 'ldd',
    url: '/ldDirectory/getByIds',
    method: 'POST',
    comment: '根据id列表获取朗致疾病诊断目录列表',
  },
  //  ============== 疾病诊断以及手术或操作 ==============
  // 国家
  // 获取国家疾病诊断以及手术或操作
  cdSurgeryOrProcedureList: {
    module: 'ldd',
    url: '/cdSurgeryOrProcedure/page',
    method: 'POST',
    comment: '获取国家疾病诊断以及手术或操作分页列表',
  },
  // 国家疾病诊断目录详情
  cdSurgeryOrProcedureGetById: {
    module: 'ldd',
    url: '/cdSurgeryOrProcedure/getById',
    method: 'POST',
    comment: '获取国家疾病诊断详情',
  },
  // 朗致
  // 获取朗致疾病诊断以及手术或操作分页列表
  ldSurgeryOrProcedureList: {
    module: 'ldd',
    url: '/ldSurgeryOrProcedure/page',
    method: 'POST',
    comment: '获取朗致疾病诊断以及手术或操作分页列表',
  },
  // 获取朗致疾病诊断详情
  ldSurgeryOrProcedureGetById: {
    module: 'ldd',
    url: '/ldSurgeryOrProcedure/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断详情',
  },

  //  ============== 疾病诊断并发症或合并症排除组 ==============
  // 国家
  // 获取国家疾病诊断并发症或合并症排除组列表
  cdMcExcludeGroupList: {
    module: 'ldd',
    url: '/cdMcExcludeGroup/page',
    method: 'POST',
    comment: '获取国家疾病诊断并发症或合并症排除组列表',
  },
  cdMcExcludeGroupSave: {
    module: 'ldd',
    url: '/cdMcExcludeGroup/save',
    method: 'POST',
    comment: '保存国家疾病诊断并发症或合并症排除组记录',
  },
  cdMcExcludeGroupUpdate: {
    module: 'ldd',
    url: '/cdMcExcludeGroup/update',
    method: 'POST',
    comment: '更新国家疾病诊断并发症或合并症排除组记录',
  },
  cdMcExcludeGroupDelete: {
    module: 'ldd',
    url: '/cdMcExcludeGroup/delete',
    method: 'POST',
    comment: '删除国家疾病诊断并发症或合并症排除组记录',
  },

  // 获取国家疾病诊断并发症或合并症排除组详情分页列表
  cdMcExcludeGroupInfoList: {
    module: 'ldd',
    url: '/cdMcExcludeGroupInfo/page',
    method: 'POST',
    comment: '获取国家疾病诊断并发症或合并症排除组详情分页列表',
  },
  cdMcExcludeGroupInfoSave: {
    module: 'ldd',
    url: '/cdMcExcludeGroupInfo/save',
    method: 'POST',
    comment: '保存国家疾病诊断并发症或合并症排除组详情记录',
  },
  cdMcExcludeGroupInfoUpdate: {
    module: 'ldd',
    url: '/cdMcExcludeGroupInfo/update',
    method: 'POST',
    comment: '更新国家疾病诊断并发症或合并症排除组详情记录',
  },
  cdMcExcludeGroupInfoDelete: {
    module: 'ldd',
    url: '/cdMcExcludeGroupInfo/delete',
    method: 'POST',
    comment: '删除国家疾病诊断并发症或合并症排除组详情记录',
  },
  // 朗致
  // 朗致疾病诊断并发症或并发症排除组
  ldMcExcludeGroupList: {
    module: 'ldd',
    url: '/ldMcExcludeGroup/page',
    method: 'POST',
    comment: '获取朗致疾病诊断并发症或合并症排除组列表',
  },
  ldMcExcludeGroupSave: {
    module: 'ldd',
    url: '/ldMcExcludeGroup/save',
    method: 'POST',
    comment: '保存朗致疾病诊断并发症或合并症排除组记录',
  },
  ldMcExcludeGroupUpdate: {
    module: 'ldd',
    url: '/ldMcExcludeGroup/update',
    method: 'POST',
    comment: '更新朗致疾病诊断并发症或合并症排除组记录',
  },
  ldMcExcludeGroupDelete: {
    module: 'ldd',
    url: '/ldMcExcludeGroup/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断并发症或合并症排除组记录',
  },

  ldMcExcludeGroupInfoList: {
    module: 'ldd',
    url: '/ldMcExcludeGroupInfo/page',
    method: 'POST',
    comment: '获取朗致疾病诊断并发症或合并症排除组详情分页列表',
  },
  ldMcExcludeGroupInfoSave: {
    module: 'ldd',
    url: '/ldMcExcludeGroupInfo/save',
    method: 'POST',
    comment: '保存朗致疾病诊断并发症或合并症排除组详情记录',
  },
  ldMcExcludeGroupInfoUpdate: {
    module: 'ldd',
    url: '/ldMcExcludeGroupInfo/update',
    method: 'POST',
    comment: '更新朗致疾病诊断并发症或合并症排除组详情记录',
  },
  ldMcExcludeGroupInfoDelete: {
    module: 'ldd',
    url: '/ldMcExcludeGroupInfo/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断并发症或合并症排除组详情记录',
  },
  // ==============  疾病诊断并发症或排除组 ==============
  // 国家
  cdMcList: {
    module: 'ldd',
    url: '/cdMc/page',
    method: 'POST',
    comment: '获取国家疾病诊断并发症或合并症分页列表',
  },
  cdMcSave: {
    module: 'ldd',
    url: '/cdMc/save',
    method: 'POST',
    comment: '保存国家疾病诊断并发症或合并症详情记录',
  },
  cdMcUpdate: {
    module: 'ldd',
    url: '/cdMc/update',
    method: 'POST',
    comment: '更新国家疾病诊断并发症或合并症详情记录',
  },
  cdMcDelete: {
    module: 'ldd',
    url: '/cdMc/delete',
    method: 'POST',
    comment: '删除国家疾病诊断并发症或合并症详情记录',
  },
  // 朗致
  ldMcList: {
    module: 'ldd',
    url: '/ldMc/page',
    method: 'POST',
    comment: '获取朗致疾病诊断并发症或合并症分页列表',
  },
  ldMcSave: {
    module: 'ldd',
    url: '/ldMc/save',
    method: 'POST',
    comment: '保存朗致疾病诊断并发症或合并症详情记录',
  },
  ldMcUpdate: {
    module: 'ldd',
    url: '/ldMc/update',
    method: 'POST',
    comment: '更新朗致疾病诊断并发症或合并症详情记录',
  },
  ldMcDelete: {
    module: 'ldd',
    url: '/ldMc/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断并发症或合并症详情记录',
  },

  // ========================= 朗致与外部对照 ================
  // 数据源
  ldDirectoryOutIdListOutType: {
    module: 'ldd',
    url: '/ldDirectoryOutId/listOutType',
    method: 'POST',
    comment: '朗致疾病诊断和外系统对照类型',
  },
  // 朗致疾病诊断目录和外系统对照表
  ldDirectoryOutIdList: {
    module: 'ldd',
    url: '/ldDirectoryOutId/page',
    method: 'POST',
    comment: '获取朗致疾病诊断目录和外系统对照表分页列表',
  },
  ldDirectoryOutIdGetById: {
    module: 'ldd',
    url: '/ldDirectoryOutId/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断目录和外系统对照表详情',
  },
  // 朗致疾病诊断和外系统对照表
  ldSurgeryOrProcedureOutIdList: {
    module: 'ldd',
    url: '/ldSurgeryOrProcedureOutId/page',
    method: 'POST',
    comment: '获取朗致疾病诊断以及手术或操作和外系统对照id分页列表',
  },
  ldSurgeryOrProcedureOutIdGetById: {
    module: 'ldd',
    url: '/ldSurgeryOrProcedureOutId/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断以及手术或操作和外系统对照id详情',
  },

  // 朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）申请单
  lonchDrgDirectoryOutIdApplyList: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/page',
    method: 'POST',
    comment: '获取朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）列表',
  },
  lonchDrgDirectoryOutIdApplyGetById: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）详情',
  },
  lonchDrgDirectoryOutIdApplySave: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/save',
    method: 'POST',
    comment: '保存朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）详情记录',
  },
  lonchDrgDirectoryOutIdApplyUpdate: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/update',
    method: 'POST',
    comment: '更新朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）详情记录',
  },
  lonchDrgDirectoryOutIdApplyDelete: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）详情记录',
  },
  lonchDrgDirectoryOutIdApplyAudit: {
    module: 'ldd',
    url: '/lonchDrgDirectoryOutIdApply/audit',
    method: 'POST',
    comment: '审批朗致疾病诊断目录和外系统对照表申请单（新增、修改、作废）详情记录',
  },

  // 朗致疾病诊断以及手术或操作和外系统对照申请单
  lonchDrgSurgeryOrProcedureOutIdApplyList: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/page',
    method: 'POST',
    comment: '获取朗致疾病诊断以及手术或操作和外系统对照申请单列表',
  },
  lonchDrgSurgeryOrProcedureOutIdApplyGetById: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/getById',
    method: 'POST',
    comment: '获取朗致疾病诊断以及手术或操作和外系统对照申请单详情',
  },
  lonchDrgSurgeryOrProcedureOutIdApplySave: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/save',
    method: 'POST',
    comment: '保存朗致疾病诊断以及手术或操作和外系统对照申请单详情记录',
  },
  lonchDrgSurgeryOrProcedureOutIdApplyUpdate: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/update',
    method: 'POST',
    comment: '更新朗致疾病诊断以及手术或操作和外系统对照申请单详情记录',
  },
  lonchDrgSurgeryOrProcedureOutIdApplyDelete: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/delete',
    method: 'POST',
    comment: '删除朗致疾病诊断以及手术或操作和外系统对照申请单详情记录',
  },
  lonchDrgSurgeryOrProcedureOutIdApplyAudit: {
    module: 'ldd',
    url: '/lonchDrgSurgeryOrProcedureOutIdApply/audit',
    method: 'POST',
    comment: '审批朗致疾病诊断和外系统对照表申请单（新增、修改、作废）详情记录',
  },

  /**
   * 查询列表
   */
  chsCcList: { module: 'ldd', url: '/chs/cc/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取并发症或合并症详情
   */
  chsCcView: { module: 'ldd', url: '/chs/cc/view', method: 'POST', comment: '获取并发症或合并症详情' },
  /**
   * 审核
   */
  chsCcApplyAudit: { module: 'ldd', url: '/chs/ccApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  chsCcApplyDelete: { module: 'ldd', url: '/chs/ccApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  chsCcApplyList: { module: 'ldd', url: '/chs/ccApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  chsCcApplyUpdate: { module: 'ldd', url: '/chs/ccApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  chsCcApplyView: { module: 'ldd', url: '/chs/ccApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  chsCcExcludeGroupList: { module: 'ldd', url: '/chs/ccExcludeGroup/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取排除组详情
   */
  chsCcExcludeGroupView: { module: 'ldd', url: '/chs/ccExcludeGroup/view', method: 'POST', comment: '获取排除组详情' },
  /**
   * 审核
   */
  chsCcExcludeGroupApplyAudit: { module: 'ldd', url: '/chs/ccExcludeGroupApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  chsCcExcludeGroupApplyDelete: { module: 'ldd', url: '/chs/ccExcludeGroupApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  chsCcExcludeGroupApplyList: { module: 'ldd', url: '/chs/ccExcludeGroupApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  chsCcExcludeGroupApplyUpdate: { module: 'ldd', url: '/chs/ccExcludeGroupApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  chsCcExcludeGroupApplyView: { module: 'ldd', url: '/chs/ccExcludeGroupApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  chsCcExcludeGroupRefIcdList: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcd/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取排除组关联疾病诊断详情
   */
  chsCcExcludeGroupRefIcdView: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcd/view', method: 'POST', comment: '获取排除组关联疾病诊断详情' },
  /**
   * 审核
   */
  chsCcExcludeGroupRefIcdApplyAudit: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcdApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  chsCcExcludeGroupRefIcdApplyDelete: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcdApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  chsCcExcludeGroupRefIcdApplyList: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcdApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  chsCcExcludeGroupRefIcdApplyUpdate: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcdApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  chsCcExcludeGroupRefIcdApplyView: { module: 'ldd', url: '/chs/ccExcludeGroupRefIcdApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  chsDirectoryList: { module: 'ldd', url: '/chs/directory/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取疾病诊断分组目录
   */
  chsDirectoryView: { module: 'ldd', url: '/chs/directory/view', method: 'POST', comment: '获取疾病诊断分组目录' },
  /**
   * 审核
   */
  chsDirectoryApplyAudit: { module: 'ldd', url: '/chs/directoryApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  chsDirectoryApplyDelete: { module: 'ldd', url: '/chs/directoryApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  chsDirectoryApplyList: { module: 'ldd', url: '/chs/directoryApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  chsDirectoryApplyUpdate: { module: 'ldd', url: '/chs/directoryApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  chsDirectoryApplyView: { module: 'ldd', url: '/chs/directoryApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  chsDirectoryRefIcdList: { module: 'ldd', url: '/chs/directoryRefIcd/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取分组目录关联疾病诊断详情
   */
  chsDirectoryRefIcdView: { module: 'ldd', url: '/chs/directoryRefIcd/view', method: 'POST', comment: '获取分组目录关联疾病诊断详情' },
  /**
   * 审核
   */
  chsDirectoryRefIcdApplyAudit: { module: 'ldd', url: '/chs/directoryRefIcdApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  chsDirectoryRefIcdApplyDelete: { module: 'ldd', url: '/chs/directoryRefIcdApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  chsDirectoryRefIcdApplyList: { module: 'ldd', url: '/chs/directoryRefIcdApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  chsDirectoryRefIcdApplyUpdate: { module: 'ldd', url: '/chs/directoryRefIcdApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  chsDirectoryRefIcdApplyView: { module: 'ldd', url: '/chs/directoryRefIcdApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  lonchCcList: { module: 'ldd', url: '/lonch/cc/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取并发症或合并症详情
   */
  lonchCcView: { module: 'ldd', url: '/lonch/cc/view', method: 'POST', comment: '获取并发症或合并症详情' },
  /**
   * 审核
   */
  lonchCcApplyAudit: { module: 'ldd', url: '/lonch/ccApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  lonchCcApplyDelete: { module: 'ldd', url: '/lonch/ccApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  lonchCcApplyList: { module: 'ldd', url: '/lonch/ccApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  lonchCcApplyUpdate: { module: 'ldd', url: '/lonch/ccApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  lonchCcApplyView: { module: 'ldd', url: '/lonch/ccApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  lonchCcExcludeGroupList: { module: 'ldd', url: '/lonch/ccExcludeGroup/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取排除组详情
   */
  lonchCcExcludeGroupView: { module: 'ldd', url: '/lonch/ccExcludeGroup/view', method: 'POST', comment: '获取排除组详情' },
  /**
   * 审核
   */
  lonchCcExcludeGroupApplyAudit: { module: 'ldd', url: '/lonch/ccExcludeGroupApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  lonchCcExcludeGroupApplyDelete: { module: 'ldd', url: '/lonch/ccExcludeGroupApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  lonchCcExcludeGroupApplyList: { module: 'ldd', url: '/lonch/ccExcludeGroupApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  lonchCcExcludeGroupApplyUpdate: { module: 'ldd', url: '/lonch/ccExcludeGroupApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  lonchCcExcludeGroupApplyView: { module: 'ldd', url: '/lonch/ccExcludeGroupApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  lonchCcExcludeGroupRefIcdList: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcd/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取排除组关联疾病诊断详情
   */
  lonchCcExcludeGroupRefIcdView: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcd/view', method: 'POST', comment: '获取排除组关联疾病诊断详情' },
  /**
   * 审核
   */
  lonchCcExcludeGroupRefIcdApplyAudit: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcdApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  lonchCcExcludeGroupRefIcdApplyDelete: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcdApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  lonchCcExcludeGroupRefIcdApplyList: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcdApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  lonchCcExcludeGroupRefIcdApplyUpdate: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcdApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  lonchCcExcludeGroupRefIcdApplyView: { module: 'ldd', url: '/lonch/ccExcludeGroupRefIcdApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  lonchDirectoryList: { module: 'ldd', url: '/lonch/directory/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取疾病诊断分组目录
   */
  lonchDirectoryView: { module: 'ldd', url: '/lonch/directory/view', method: 'POST', comment: '获取疾病诊断分组目录' },
  /**
   * 审核
   */
  lonchDirectoryApplyAudit: { module: 'ldd', url: '/lonch/directoryApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  lonchDirectoryApplyDelete: { module: 'ldd', url: '/lonch/directoryApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  lonchDirectoryApplyList: { module: 'ldd', url: '/lonch/directoryApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  lonchDirectoryApplyUpdate: { module: 'ldd', url: '/lonch/directoryApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  lonchDirectoryApplyView: { module: 'ldd', url: '/lonch/directoryApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询列表
   */
  lonchDirectoryRefIcdList: { module: 'ldd', url: '/lonch/directoryRefIcd/list', method: 'POST', comment: '查询列表' },
  /**
   * 获取分组目录关联疾病诊断详情
   */
  lonchDirectoryRefIcdView: { module: 'ldd', url: '/lonch/directoryRefIcd/view', method: 'POST', comment: '获取分组目录关联疾病诊断详情' },
  /**
   * 审核
   */
  lonchDirectoryRefIcdApplyAudit: { module: 'ldd', url: '/lonch/directoryRefIcdApply/audit', method: 'POST', comment: '审核' },
  /**
   * 删除
   */
  lonchDirectoryRefIcdApplyDelete: { module: 'ldd', url: '/lonch/directoryRefIcdApply/delete', method: 'POST', comment: '删除' },
  /**
   * 查询列表
   */
  lonchDirectoryRefIcdApplyList: { module: 'ldd', url: '/lonch/directoryRefIcdApply/list', method: 'POST', comment: '查询列表' },
  /**
   * 创建或者更新
   */
  lonchDirectoryRefIcdApplyUpdate: { module: 'ldd', url: '/lonch/directoryRefIcdApply/update', method: 'POST', comment: '创建或者更新' },
  /**
   * 查询详情，传申请ID
   */
  lonchDirectoryRefIcdApplyView: { module: 'ldd', url: '/lonch/directoryRefIcdApply/view', method: 'POST', comment: '查询详情，传申请ID' },
  /**
   * 查询全部列表，不分页
   */
  chsDirectoryListAll: { module: 'ldd', url: '/chs/directory/listAll', method: 'POST', comment: '查询全部列表，不分页' },
  /**
   * 查询全部列表，不分页
   */
  lonchDirectoryListAll: { module: 'ldd', url: '/lonch/directory/listAll', method: 'POST', comment: '查询全部列表，不分页' },
};

export default ldd;
