const whStorage = {
  /**
   * 字典
   */
  getLegalPerson: { module: 'whstorage', url: '/dictionaries/getLegalPerson', method: 'POST', comment: '获取法人组织列表' },
  getWhStorageType: { module: 'whstorage', url: '/dictionaries/getWhStorageType', method: 'POST', comment: '获取存储位置类型列表' },
  
  /**
   * 仓库储存位置档案
   */
  getWhStorageArchivesList: { module: 'whstorage', url: '/whStorageArchives/getWhStorageArchivesList', method: 'POST', comment: '仓库储存位置档案列表' },
  delWhStorageArchives: { module: 'whstorage', url: '/whStorageArchives/delWhStorageArchives', method: 'POST', comment: '删除仓库储存位置档案' },
  getWhStorageArchivesDetail: { module: 'whstorage', url: '/whStorageArchives/getWhStorageArchivesDetail', method: 'POST', comment: '调试仓库储存位置档案详情' },
  saveWhStorageArchives: { module: 'whstorage', url: '/whStorageArchives/saveWhStorageArchives', method: 'POST', comment: '保存仓库储存位置档案' },
  
  /**
   * 温湿度监控记录
   */
  delWhThermometerHumidityArchives: { module: 'whstorage', url: '/whThermometerHumidityLog/delWhThermometerHumidityArchives', method: 'POST', comment: '删除温湿度监控记录' },
  getWhThermometerHumidityLogDetail: { module: 'whstorage', url: '/whThermometerHumidityLog/getWhThermometerHumidityLogDetail', method: 'POST', comment: '温湿度监控记录详情' },
  getWhThermometerHumidityLogsDTOList: { module: 'whstorage', url: '/whThermometerHumidityLog/getWhThermometerHumidityLogsDTOList', method: 'POST', comment: '温湿度监控记录列表' },
  saveWhThermometerHumidityLog: { module: 'whstorage', url: '/whThermometerHumidityLog/saveWhThermometerHumidityLog', method: 'POST', comment: '保存温湿度监控记录' },
  
  /**
   * 温湿度计档案
   */
  delArchivesWhThermometerHumidityArchives: { module: 'whstorage', url: '/whThermometerHumidityArchives/delWhThermometerHumidityArchives', method: 'POST', comment: '删除温湿度计档案' },
  getWhThermometerHumidityArchivesDetail: { module: 'whstorage', url: '/whThermometerHumidityArchives/getWhThermometerHumidityArchivesDetail', method: 'POST', comment: '温湿度计档案详情' },
  getWhThermometerHumidityArchivesList: { module: 'whstorage', url: '/whThermometerHumidityArchives/getWhThermometerHumidityArchivesList', method: 'POST', comment: '温湿度计档案列表' },
  saveWhThRel: { module: 'whstorage', url: '/whThermometerHumidityArchives/saveWhThRel', method: 'POST', comment: '保存温湿度计和仓库实际储存位置的关系' },
  saveWhThermometerHumidityArchives: { module: 'whstorage', url: '/whThermometerHumidityArchives/saveWhThermometerHumidityArchives', method: 'POST', comment: '保存温湿度计档案' },
}

export default whStorage