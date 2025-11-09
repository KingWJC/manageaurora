let dbManager = {
  logable: true, // 是否打开控制台输出
  db: null,
  createOrOpenDb (dbName, dbVersion) {
    // 每次都是删除数据库
    // indexedDB.deleteDatabase(dbName)
    
    let dbOpenRequest = indexedDB.open(dbName, dbVersion);
    return new Promise((resolve, reject) => {
      dbOpenRequest.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      dbOpenRequest.onerror = (event) => {
        reject(event.target.error.message);
      };
      dbOpenRequest.onupgradeneeded = (event) => {
        // 拿到数据库对象
        this.db = event.target.result;
        resolve(this.db);
      };
    });
  },
  
  createObjectStore (storeName, options) {
    if (this.db.objectStoreNames.contains(storeName)) return;
    let objectStore = this.db.createObjectStore(storeName, {
      keyPath: options.keyPath
    });
    for (let prop in options) {
      objectStore.createIndex(prop, prop, {
        unique: options.unique
      });
    }
  },
  // 获取当前objectStore
  getCurrentStore (objectStoreName) {
    return this.db.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName);
  },
  // 定义 objectStore 基本操作
  createObjectStoreOperations (objectStoreName) {
    let that = this;
    this[objectStoreName] = {
      add (obj) {
        if (!obj) return;
        return new Promise((resolve, reject) => {
          let objectStore = that.getCurrentStore(objectStoreName);
          let addReq = objectStore.add(obj);
          addReq.onsuccess = () => {
            resolve(obj);
          };
          addReq.onerror = (event) => {
            reject(event.target.error.message);
          };
        });
      },
      remove (id) {
        return new Promise((resolve, reject) => {
          let objectStore = that.getCurrentStore(objectStoreName);
          let delReq = objectStore.delete(id);
          delReq.onsuccess = () => {
            resolve(true);
          };
          delReq.onerror = (event) => {
            reject(event.target.error.message);
          };
        });
      },
      update (obj) {
        if (!obj.id) throw new Error('必须拥有id属性的数据对象才能被修改');
        let objectStore = that.getCurrentStore(objectStoreName);
        return new Promise((resolve, reject) => {
          let putReq = objectStore.put(obj);
          putReq.onsuccess = () => {
            resolve(true);
          };
          putReq.onerror = (event) => {
            reject(event.target.error.message);
          };
        });
      },
      // 读取所有数据
      readAll () {
        let objectStore = that.getCurrentStore(objectStoreName);
        
        return new Promise((resolve, reject) => {
          let resultArr = [];
          let readAllRequest = objectStore.openCursor();
          readAllRequest.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
              resultArr.push(cursor.value);
              cursor.continue();
            } else {
              resolve(resultArr);
            }
          };
          readAllRequest.onerror = (event) => {
            reject(event.target.error.message);
          };
        });
      },
      readWithIndex (name) {
        return new Promise((resolve, reject) => {
          let objectStore = that.getCurrentStore(objectStoreName);
          // 使用指定索引查找数据
          let indexFetch = objectStore.index('name');
          // 用索引打开游标
          let indexRequest = indexFetch.openCursor();
          let resultArr = [];
          indexRequest.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
              let result = cursor.value;
              if (result.name.includes(name)) {
                resultArr.push(cursor.value);
              }
              cursor.continue();
            } else {
              resolve(resultArr);
            }
          };
          indexRequest.onerror = (event) => {
            reject(event.target.error.message);
          };
        });
      }
    };
  }
};

export default dbManager;
