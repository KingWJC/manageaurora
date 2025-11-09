const pat = {
  getPatTaskList: { module: 'pat', url: '/patTask/getPatTaskList', method: 'POST', comment: '任务管理列表' },
  getPatTaskDetail: { module: 'pat', url: '/patTask/getPatTaskDetail', method: 'POST', comment: '任务管理详情' },
  savePatTask: { module: 'pat', url: '/patTask/savePatTask', method: 'POST', comment: '保存任务' },
  delPatTask: { module: 'pat', url: '/patTask/delPatTask', method: 'POST', comment: '删除任务' },
  getPatTaskTypeList: { module: 'pat', url: '/patTask/getPatTaskTypeList', method: 'POST', comment: '任务类型列表' },
  getCaHumanDTOList: { module: 'pat', url: '/dictionaries/getCaHumanDTOList', method: 'POST', comment: '人员列表' },
  getOrganizationDTO: { module: 'pat', url: '/dictionaries/getOrganizationDTO', method: 'POST', comment: '获取业务组织和行政组织的树' },
  getProductList: { module: 'pat', url: '/dictionaries/getProductList', method: 'POST', comment: '产品列表查询' },
}

export default pat;