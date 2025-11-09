import ErrorCode from './errorCode'
export default class DbHelper {

  /**
   * 调用桥接协议，执行sql查询语句
   */
  /*
  executeQuerySQL(sql, totalSql) {
    console.log('SQL模板', sql)
    return new Promise((resolve, reject) => {
      const demand = {
        "sql": sql || '',
        "queryType": 'querySingleModel',
        "totalSql": totalSql || ""
      };
      LonchJsApi.webCallAppRequest(
          {
            command: 'executeQuerySQL',
          },
          demand,
          function(data) {
            resolve(data.data);
          },
          function(err) {
            console.error(`SQL出错：`,sql);
            reject(err);
          },
      );
    })
  }
  */

  /*
  executeQueryModels(sql, totalSql) {
    console.log('SQL模板', sql)
    return new Promise((resolve, reject) => {
      const demand = {
        "sql": sql || '',
        "queryType": 'queryModels',
        "totalSql": totalSql || ""
      };
      LonchJsApi.webCallAppRequest(
          {
            command: 'executeQuerySQL',
          },
          demand,
          function(data) {
            resolve(data.data);
          },
          function(err) {
            console.error(`SQL出错：`,sql);
            reject(err);
          },
      );
    })
  }
  */

  /**
   * 调用桥接协议，执行sql增删改语句
   */
  /*
  executeModifiedSQL(sql) {
    console.log('SQL模板', sql)
    return new Promise((resolve, reject) => {
      const demand = {
        executeSqls: [{
          "sqls": Array.isArray(sql) ? sql : [sql],
          "syncTable": 'bi_store',
          "sqlType": 1,
        }]
      };
      LonchJsApi.webCallAppRequest(
          {
            command: 'executeModifiedSQL',
          },
          demand,
          function (data) {
            resolve(data);
          },
          function (err) {
            console.error(`SQL出错：`,sql);
            reject(err);
          },
      );
    })
  }
  */

  /**
   * 调用桥接协议，执行sql语句
   */
  executeSQL(sql, type, uuid, sid, dataSourceType) {
    console.log(sid, ':::SQL模板', JSON.stringify(sql))
    return new Promise((resolve, reject) => {
      // 2024-11-20 App协议增加dataSourceType  
      // 类型分为 local，broker（默认），remote，insurance（医保），默认是broker，
      const demand = {
        sqlModelList: sql,
        dataSourceType: dataSourceType || 'broker',
      };
      LonchJsApi.webCallAppRequest(
          {
            command: 'executeSQL',
          },
          demand,
          function (data) {
            console.log(sid, ':::SQL执行结果>>>>>>>>>>>>>>>>>>>>>>', data)
            if(type === 'queryObject') {
              resolve(data.data && data.data[uuid] && data.data[uuid][0] || null);
            } else {
              let result = [];
              if(data.data) {
                for(let key in data.data) {
                  result = result.concat(data.data[key]);
                }
              }
              console.log(sid, ':::localapi result>>>>>>>>>>>>>>>>>>>>>>', result)
              resolve(result);
            }
          },
          function (err) {
            console.error(sid, `:::SQL出错：`,sql, err);
            const error = new ErrorCode();
            error.init(err.code, err.error);
            reject(error);
          },
          null,
          true
      );
    })
  }

  /**
   * 提示表名
   * @param query
   * @returns {string|null}
   */
  extractTableName(query) {
    const regex = /from\s+(\w+)/i;
    const match = regex.exec(query);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  }

  /**
   * 获取插入更新的表名
   * @param query
   * @returns {string|*}
   */
  extractInsertTableName(query) {
    const regex = /(?:INSERT INTO|UPDATE) ([^\s]+)/i;
    const match = query.match(regex);

    if (match && match.length > 1) {
      return match[1];
    }

    return "";
  }


  /**
   * 查询单条sql
   * @param sql
   */
  queryObject(sql) {
    const uuid = LonchJsApi.UUID(32);
    return this.executeSQL([{
      id: uuid,
      // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
      sqlType: 5,
      sqlTemplate: sql.sql,
      paramList: Array.isArray(sql.param) ? sql.param : [sql.param],
      syncTable: this.extractTableName(sql.sql),
      updateTime: `${new Date().getTime()}`
    }], 'queryObject', uuid, sql.sid, sql.dataSourceType);
  }

  /**
   * 查询多条结果sql
   * @param sql
   */
  queryList(sql = {}) {
    // const sqlStr = this.generateSQL(sql.sql, sql.param);
    // return this.executeQueryModels(sqlStr);
    const uuid = LonchJsApi.UUID(32);
    return this.executeSQL([{
      id: uuid,
      // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
      sqlType: 5,
      sqlTemplate: sql.sql,
      paramList: Array.isArray(sql.param) ? sql.param : [sql.param],
      syncTable: this.extractTableName(sql.sql),
      updateTime: `${new Date().getTime()}`
    }], 'queryList', uuid, sql.sid, sql.dataSourceType);
  }

  /**
   * 插入单个sql
   * @param sql
   */
  insert(sql = {}) {
    const uuid = LonchJsApi.UUID(32);
    return this.executeSQL([{
      id: uuid,
      // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
      sqlType: 1,
      sqlTemplate: sql.sql,
      paramList: Array.isArray(sql.param) ? sql.param : [sql.param],
      syncTable: this.extractInsertTableName(sql.sql),
      updateTime: Array.isArray(sql.param) ?  sql.param[0].updateTime : sql.param.updateTime
    }], 'insert', uuid, sql.sid, sql.dataSourceType);
  }

  /**
   * 更新单个sql
   * @param sql
   */
  update(sql = {}) {
    const uuid = LonchJsApi.UUID(32);
    return this.executeSQL([{
      id: uuid,
      // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
      sqlType: 2,
      sqlTemplate: sql.sql,
      paramList: Array.isArray(sql.param) ? sql.param : [sql.param],
      syncTable: this.extractInsertTableName(sql.sql),
      updateTime: sql.param.updateTime
    }], 'update', uuid, sql.sid, sql.dataSourceType);
  }

  /**
   * 插入多条sql
   * @param sql
   */
  inserts(sql = []) {
    const uuid = LonchJsApi.UUID(32);
    let sqls = [];
    if(sql && sql.length > 0) {
      sql.forEach( v => {
        sqls.push({
          id: uuid,
          // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
          sqlType: 1,
          sqlTemplate: v.sql,
          paramList: [v.param],
          syncTable: this.extractInsertTableName(v.sql),
          updateTime: v.param.updateTime
        });
      })
      return this.executeSQL(sqls, 'inserts', uuid, sql[0].sid, sql[0].dataSourceType);
    } else {
      return Promise.resolve([]);
    }
  }

  /**
   * 更新多条sql
   * @param sql
   */
  batchUpdate(sql = []) {
    const uuid = LonchJsApi.UUID(32);
    let sqls = [];
    if(sql && sql.length > 0) {
      sql.forEach( v => {
        sqls.push({
          id: LonchJsApi.UUID(32),
          // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
          sqlType: 2,
          sqlTemplate: v.sql,
          paramList: [v.param],
          syncTable: this.extractInsertTableName(v.sql),
          updateTime: v.param.updateTime
        });
      })
      return this.executeSQL(sqls, 'batchUpdate', uuid, sql[0].sid, sql[0].dataSourceType);
    } else {
      return Promise.resolve([]);
    }
  }

  /**
   * 同时执行多条sql
   * @param sql
   */
  batchSql(sql = []) {
    const uuid = LonchJsApi.UUID(32);
    let sqls = [];
    if(sql && sql.length > 0) {
      sql.forEach( v => {
        sqls.push({
          id: LonchJsApi.UUID(32),
          // 1INSERT、2UPDATE、3DELETE、4DDL、5SELECT
          sqlType: v.sqlType,
          sqlTemplate: v.sql,
          // 兼容可以执行单条，或是多条
          paramList: Array.isArray(v.param) ? v.param : [v.param],
          syncTable: this.extractInsertTableName(v.sql),
          updateTime: Array.isArray(v.param) ? v.param[0] && v.param[0].updateTime : v.param.updateTime
        });
      })
      return this.executeSQL(sqls, 'batchSql', uuid, sql[0].sid, sql[0].dataSourceType);
    } else {
      return Promise.resolve([]);
    }
  }
}