export default class DbParam {
    sql
    param
    sid
    sqlType
    dataSourceType

    constructor(sql, param, sid, sqlType, dataSourceType) {
        this.sql = sql;
        this.param = param;
        this.sid = sid;
        this.sqlType = sqlType;
        // 数据源类型  
        // 目前支持四种：local，broker，remote，insurance，默认是broker，insurance是医保
        this.dataSourceType = dataSourceType;
    }
}