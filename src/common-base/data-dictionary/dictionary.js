import IndexedDBX from '../api/indexed-dbx';

let dictionary = {
  config: {},
  versions: [],
  preLoads: [],
  lazyLoads: [],
  currentLoads: [], // 当前正在加载列表
  worker: null,
  vue: null,
  db: null,
  init (data, workerInstance, vue) {
    let that = this;
    this.worker = workerInstance;
    this.vue = vue;
    Object.assign(this.config, data);
    dictionary.getDictConfig(data, function (res) {
      if (res.opFlag) {
        Object.assign(that.config, res.serviceResult);
        this.vue.bundingData({name: 'config'}, that.config);
        that.db = new IndexedDBX(that.config);
        that.db.initDatabase(
          function () {
            that.initVersions(that.config, function (versions) {
              that.versions = versions;
              that.loadPreLoads(); // 加载预加载数据
            });
          },
          function () {
            //console.log('===initDatabase err===', err);
          },
          that
        );
      }
    });
  },
  initVersions (config, callback) {
    this.db.get('versions',
      {},
      function (versions) {
        if (typeof callback === 'function') {
          callback(versions);
        }
      },
      function () {
        //console.log('获取版本失败', err);
      },
      this
    );
  },
  /**
   * 加载预加载数据
   */
  loadPreLoads () {
    this.loadDictionarys(this.config.preLoads, 'pre-loading');
  },
  /**
   * 加载懒加载数据
   */
  loadLazyLoads () {
    this.loadDictionarys(this.config.lazyLoads, 'lazy-loading');
  },
  loadDictionarys (loads, type) {
    //let that = this;
    this.currentLoads = [];
    for(let i=0;i<loads.length; i++){
      let loader = loads[i];
      this.currentLoads.push(loader.name);
      this.loadDictionary(loader, type);
    }
    //for (let item in  loads) {
    //  let loader = loads[item];
    //  this.currentLoads.push(loader.name);
    //  this.loadDictionary(loader, type);
    //}
  },
  loadDictionary (loader, type) {
    if (this.isCurrentVersion(loader)) {
      this.db.get(loader.tableName,
        {},
        function (result) {
          if (result && result.length > 0) {
            this.dataCompleted(loader, type, result);
          } else {
            this.updateDictData(loader, type, true);
          }
        },
        function () {
          //console.log('===loadDictionarys error===', err);
        },
        this
      );
    } else {
      this.updateDictData(loader, type, true);
    }
  },
  /**
   * 获取字典配置
   */
  getDictConfig (data, callBack) {
    let service = {
      url: data.basePath + data.url,
      method: 'GET',
      protocolVersion: '1.0',
      noLog: true,
      noErrTips: true
    };
    this.vue.API.send(service, {}, function (res) {
      if (typeof callBack === 'function') {
        callBack.call(this, res);
      }
    }, function (err) {
      this.vue.loadingLocalConfigError(err);
    }, this);
  },
  /**
   * 加载数据
   * @param preLoad
   * @param callBack
   * @param context
   */
  loadDictData: function (preLoad, callBack, context) {
    context = context || this;
    let source = preLoad.source;
    let service = Object.assign({noLog: true}, source.service);
    let basePath = this.config.basePath;
    if (service && service.module === 'cdn') {
      service.url = /^http[s]?:\/\//.test(service.url) ? service.url : basePath + service.url;
      service.method = 'GET';
      service.protocolVersion= '1.0';
      service.noLog = true;
    }
    this.vue.API.send(service, {},
      function (res) {
        if (typeof callBack === 'function') {
          callBack.call(this, res);
        }
      },
      function () {
        //console.log('==getDictConfig err==', err);
      },
      context
    );
  },
  
  /**
   * 更新缓存数据
   * @param loader
   * @param type
   * @param isNewVersion
   */
  updateDictData (loader, type, isNewVersion = false) {
    let that = this;
    this.loadDictData(loader, function (res) {
      that.dataCompleted(loader, type, res.serviceResult);
      that.saveOrUpdateData(loader, res.serviceResult, isNewVersion);
    });
  },
  /**
   * 保存数据或更新数据到
   * @param currentLoad
   * @param data
   * @param isNewVersion
   */
  saveOrUpdateData (currentLoad, data, isNewVersion) {
    if (isNewVersion) {
      let db = this.db;
      db.clear(currentLoad.tableName,
        function () {
          db.addOrUpdate(currentLoad.tableName, data,
            function () {
              // 更新版本
              db.addOrUpdate('versions',
                {name: currentLoad.tableName, version: currentLoad.version},
                function () {
                },
                function () {
                  //console.log('更新版本失败', err);
                },
                this
              );
            },
            function () {
              //console.log('===更新数据失败===', err);
            },
            this
          );
        },
        function () {
          //console.log('===清除数据失败===', err);
        },
        this
      );
    }
  },
  /**
   * 获取已保存数据的版本
   * @param tableName
   * @return {{}}
   */
  getSavedVersion (tableName) {
    let matchedVersions = this.db.matchedData(this.versions, 'name', tableName);
    return matchedVersions.length > 0 ? matchedVersions[0] : {};
  },
  /**
   * 检查是否为当前版本
   * @param preLoad
   * @return {boolean}
   */
  isCurrentVersion (preLoad) {
    let version = this.getSavedVersion(preLoad.tableName);
    return preLoad.version === version.version
  },
  /**
   * 当前加载完成
   * @param loader
   */
  currentLoadDone (loader) {
    for (let i in this.currentLoads) {
      if (this.currentLoads[i] === loader.name) {
        this.currentLoads.splice(Number(i), 1);
        return;
      }
    }
  },
  /**
   * 当前加载队列是否加载完成
   * @return Boolean
   */
  isCurrentLoadsAllDone () {
    return !(this.currentLoads.length > 0);
  },
  
  /**
   * 加载数据完成，绑定数据，判断是否加载完成
   * @param loader
   * @param type
   * @param data
   */
  dataCompleted (loader, type, data) {
    let that = this;
    this.vue.bundingData(loader, data);
    this.currentLoadDone(loader);
    if (this.isCurrentLoadsAllDone()) {
      this.vue.dictLoadingDone(type);
      if (type === 'pre-loading') {
        that.loadLazyLoads();
      }
    }
  }
};
export default dictionary;

