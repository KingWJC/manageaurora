/*
 * @Author: tuWei
 * @Date: 2023-05-08 14:59:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-17 15:47:12
 */
const search = {
  getDbList: { module: 'search', url: '/biz/dbList', method: 'POST', comment: '业务库列表' },
  getTbList: { module: 'search', url: '/biz/tbList', method: 'POST', comment: '业务表列表' },
  getTbFieldList: { module: 'search', url: '/biz/tbFieldList', method: 'POST', comment: '业务表字段' },
  idxDbList: { module: 'search', url: '/idxDb/list', method: 'POST', comment: '索引库列表' },
  idxDbSave: { module: 'search', url: '/idxDb/save', method: 'POST', comment: '索引库保存' },
  idxDbUpdateDelete: { module: 'search', url: '/idxDb/updateDelete', method: 'POST', comment: '索引库删除' },

  idxTbFieldList: { module: 'search', url: '/idxTb/fieldList', method: 'POST', comment: '索引字段列表' },
  idxTbList: { module: 'search', url: '/idxTb/list', method: 'POST', comment: '索引表列表' },
  idxTbSave: { module: 'search', url: '/idxTb/save', method: 'POST', comment: '索引表保存' },
  idxTbUpdateDelete: { module: 'search', url: '/idxTb/updateDelete', method: 'POST', comment: '索引表删除' },
  idxTbUpdateFields: { module: 'search', url: '/idxTb/updateFields', method: 'POST', comment: '索引表保存字段' },

}

export default search;
