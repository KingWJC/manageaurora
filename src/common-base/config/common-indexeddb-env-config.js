/**
 * 全局indexDB配置
 */
const commonEnvConfig = {
  dev: {
    dbName: 'lonch-web-db',
    version: '6'
  },
  test: {
    dbName: 'lonch-web-db',
    version: '1'
  },
  production: {
    dbName: 'lonch-web-db',
    version: '1'
  }
};
const config = {
  tables: [
    {
      name: 'area',
      keyPath: 'code',
      indexs: [
        {key: 'code', option: {unique: true}},
        {key: 'levelCode'},
        {key: 'parentCode'}
      ]
    },{
      name: 'versions',
      keyPath: 'name',
      indexs: [
        {key: 'name', option: {unique: true}},
        {key: 'version'}
      ]
    }
  ]
};
let indexedDBConfig = Object.assign({}, config, commonEnvConfig[process.env.VUE_APP_MODE]);
export default indexedDBConfig;
