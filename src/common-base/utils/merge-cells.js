/**
 * @type {
 *   rowspans: [
 *     {columnIndex: 0, prop: 'applyId', dataIndex},
 *     {columnIndex: 1, prop: 'applyId', dataIndex}
 *   ],
 *   dataIndex: 如果行内为数据为数组对象，则传递dataIndex，对象不传递
 *   colspans: [] // 暂不支持
 * }
 */
let config = {}
function initConfig (cfg) {
  config = cfg
}
// 获取行合并配置
function getRowspanConfig (columnIndex) {
  for (let item of config.rowspans) {
    if (item.columnIndex === columnIndex) {
      return item
    }
  }
  return null
}

// 合并行算法
function rowspan (data, current, cfg) {
  let rowspan = 1
  let colspan = 1
  // 如果前一行相同，
  if(cfg.dataIndex === undefined){
    if (current.rowIndex > 0 && current.row[cfg.prop] === data[current.rowIndex - 1][cfg.prop]) {
      rowspan = 0
      colspan = 0
    }else{
      // 合并和当前行相同的单元格，rowspan++
      for (let i = current.rowIndex + 1; i < data.length; i++) {
        if (current.row[cfg.prop] === data[i][cfg.prop]) {
          rowspan++
        } else {
          break
        }
      }
    }
  }else{
    // 配置数据结构为内部对象是
    // 如果当前行为空
    if(cfg.dataIndex+1 > current.row.length){
      return {rowspan: rowspan, colspan: colspan}
    }
    if (current.rowIndex > 0 && data[current.rowIndex - 1] && cfg.dataIndex < data[current.rowIndex - 1].length &&  current.row[cfg.dataIndex][cfg.prop] === data[current.rowIndex - 1][cfg.dataIndex][cfg.prop]) {
      rowspan = 0
      colspan = 0
    }else{
      // 合并和当前行相同的单元格，rowspan++
      for (let i = current.rowIndex + 1; i < data.length; i++) {
        if (current.row[cfg.dataIndex] && data[i][cfg.dataIndex] && current.row[cfg.dataIndex][cfg.prop] === data[i][cfg.dataIndex][cfg.prop]) {
          rowspan++
        } else {
          break
        }
      }
    }
  }
  return {rowspan: rowspan, colspan: colspan}
}
// 合并单元个入口方法
// MergeCells.spanCell(this.list, {row, column, rowIndex, columnIndex})
function spanCell (data, {row, column, rowIndex, columnIndex}) {
  if(data.length < 2){
    return
  }
  let rowspanCfg = getRowspanConfig(columnIndex)
  if (rowspanCfg) {
    return rowspan(data, {row, column, rowIndex, columnIndex}, rowspanCfg)
  }
}

// 合并行处理，需绑定到表格对象
//function spanMethod ({row, column, rowIndex, columnIndex}) {
//  let rowspanCfg = getRowspanConfig(columnIndex)
//  if (rowspanCfg) {
//    return rowspan(this.list, {row, column, rowIndex, columnIndex}, rowspanCfg)
//  }
//}

export default {
  initConfig,
  spanCell
}
