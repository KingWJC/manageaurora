/**
 * 全局indexDB配置
 * 1. 数据结构变动必须变更dataBase version
 */
//import utils from '@/common-base/utils/utils';
//const envConfig = {
//  dev: {
//    dataBase: {
//      dbName: 'lonch-web-db',
//      version: '6'
//    }
//  },
//  test: {
//    dataBase: {
//      dbName: 'lonch-web-db',
//      version: '1'
//    }
//  },
//  production: {
//    dataBase: {
//      dbName: 'lonch-web-db',
//      version: '1'
//    }
//  }
//};
const config = {
  dataBase: {
    dbName: 'lonch-web-db',
    version: '6',
    tables: [
      {
        name: 'versions',
        keyPath: 'name',
        indexs: [
          {key: 'name', option: {unique: true}},
          {key: 'version'}
        ]
      },
      {
        name: 'area',
        keyPath: 'code',
        indexs: [
          {key: 'code', option: {unique: true}},
          {key: 'levelCode'},
          {key: 'parentCode'}
        ]
      },
      {
        name: 'banks',
        keyPath: 'c',
        indexs: [
          {key: 'c', option: {unique: true}},
          {key: 'n'}
        ]
      },
      {
        name: 'business-types',
        keyPath: 'c',
        indexs: [
          {key: 'c', option: {unique: true}},
          {key: 'n'}
        ]
      }
    ]
  },
  /**
   * 预加载配置
   * source: 数据来源
   */
  preLoads: [
    {
      name: 'testAreaDatas',
      target: window,
      source: {
        type: 'cdn',
        service: {module: 'cdn', url: 'dictionary-datas/new-area.json', method: 'GET'}
      },
      versionSource: {
        type: 'cdn',
        service: {module: 'cdn', url: 'dictionary-datas/new-area-version.json', method: 'GET'}
      },
      tableName: 'area'
    },{
      name: 'businessTypes',
      target: window,
      source: {
        type: 'cdn',
        service: {module: 'cdn', url: 'dictionary-datas/business-types.json', method: 'GET'}
      },
      versionSource: {
        type: 'cdn',
        service: {module: 'cdn', url: 'dictionary-datas/business-types-version.json', method: 'GET'}
      },
      tableName: 'business-types'
    }
  ]
};
//let dictionaryConfig = utils.extend(true, {}, config, envConfig[process.env.VUE_APP_MODE]);
//console.log('dictionary-config', config);
export default config;
