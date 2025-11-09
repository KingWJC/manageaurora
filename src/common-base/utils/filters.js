import BigNumber from 'bignumber.js';
/**
 * BigNumber配置
 */
const BNConfig = {
  // 保留25位小数进行运算
  DECIMAL_PLACES: 25,
  // 舍尾
  ROUNDING_MODE: BigNumber.ROUND_DOWN
};
const BN = BigNumber.clone(BNConfig);

export default {
  formatDate: function (timestamp, format) {
    if (!timestamp) {
      return timestamp;
    }
    if (typeof timestamp === 'string' && /^[0-9]{12,13}$/.test(timestamp)) {
      timestamp = timestamp * 1;
    }
    format = format || 'yyyy-MM-dd hh:mm:ss';
    let realDate = '';
    if (typeof timestamp === 'string') {
      if (new Date(timestamp) + '' != 'Invalid Date') {
        realDate = new Date(timestamp);
      } else if (new Date(timestamp.replace(/-/g, '/')) + '' != 'Invalid Date') {
        realDate = new Date(timestamp.replace(/-/g, '/'));
      } else {
        return '';
      }
    } else {
      realDate = new Date(timestamp);
    }
    let o = {
      'M+': realDate.getMonth() + 1,
      'D+': realDate.getDate(),
      'h+': realDate.getHours(),
      'm+': realDate.getMinutes(),
      's+': realDate.getSeconds(),
      'q+': Math.floor((realDate.getMonth() + 3) / 3),
      'S': realDate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (realDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')', 'i').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return format;
  },
  /**
   * @param num 需要格式化的数字
   * @param figure 保留精度
   * @return {*}
   */
  fixedNumber: function (num, figure) {
    if (!/^[+-]?\d+(.\d+)?([eE][+-]?\d+)?$/.test(num)) {
      return num;
    }
    let n = num - 0;
    return n.toFixed(figure || 0);
  },
  // 格式空值
  formatEmpty: function (ss, format) {
    if (ss === null || ss === undefined || ss === '') {
      return format;
    }
    return ss;
  },
  /**
   * 清楚浮点数后面的所有无意义的0
   * @param num
   * @return {*}
   */
  clearLastDecimalZero (num) {
    if (/\.\d*$/.test(num)) {
      let numStr = num.toString();
      let decimal = numStr.match(/\.\d*$/).toString();
      let formatDecimal = decimal.replace(/[0]+$/, '');
      num = numStr.replace(/\.\d*$/, /^\.$/.test(formatDecimal)? '' : formatDecimal);
    }
    return num;
  },
  /**
   * 格式化数字
   * @param num
   * @param type 默认fixed（ceil，floor，round，fixed，max，min，
   * @param figure fixed默认0(保留小数位数）max，min（参考值）
   * @return {*}
   */
  formatNumber: function (num, type, figure) {
    if (!/^[+-]?\d+(.\d+)?([eE][+-]?\d+)?$/.test(num)) {
      return num;
    }
    if(type === 'BigNumberFixed') {
      return new BN(num).toFixed(figure || 0);
    }
    let format = num - 0;
    switch (type) {
      case 'ceil':
        format = Math.ceil(format);
        break;
      case 'floor':
        format = Math.floor(format);
        break;
      case 'round':
        format = Math.round(format);
        break;
      case 'fixed':
        format = format.toFixed(figure || 0);
        break;
      case 'max':
        format = format > figure ? figure : format;
        break;
      case 'min':
        format = format < figure ? figure : format;
        break;
      default :
        format = format.toFixed(figure || 0);
        break;
    }
    return format;
  },
  // 转换为大写模式
  toUpperCase: function (ss) {
    if (ss === null || ss === undefined || ss === '') {
      return ss;
    }
    return ss.toString().toLocaleUpperCase();
  },
  // 小写模式
  toLowerCase: function (ss) {
    if (ss === null || ss === undefined || ss === '') {
      return ss;
    }
    return ss.toString().toLocaleLowerCase();
  }
};
