/**
 * 模块公共工具方法
 */

/**
 * 将时间戳转换为日期字符串
 * @param {number|string} timestamp - 时间戳（秒级或毫秒级）
 * @param {string} format - 日期格式，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatTimestampToDate(timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!timestamp) {
    return '';
  }
  // 如果是字符串，尝试转换为数字
  if (typeof timestamp === 'string') {
    timestamp = Number(timestamp);
  }
  // 如果是 NaN，返回空字符串
  if (isNaN(timestamp)) {
    return '';
  }
  // 判断是秒级还是毫秒级时间戳（
  let date;
  if (timestamp < 2524579200) {
    // 秒级时间戳，转换为毫秒
    date = new Date(timestamp * 1000);
  } else {
    // 毫秒级时间戳
    date = new Date(timestamp);
  }
  
  // 如果日期无效，返回空字符串
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // 根据格式返回日期字符串
  if (format === 'yyyy-MM-dd HH:mm:ss') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (format === 'yyyy-MM-dd') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    // 其他格式，使用通用格式化方法
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}

/**
 * 将日期字符串转换为时间戳
 * @param {string} dateStr - 日期字符串
 * @returns {number} 秒级时间戳
 */
export function formatDateToTimestamp(dateStr) {
  if (!dateStr) {
    return Math.floor(Date.now());
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return Math.floor(Date.now());
  }
  // 返回秒级时间戳
  return Math.floor(date.getTime());
}

/**
 * 将日期范围数组转换为时间戳范围
 * @param {Array<string>} dateRange - 日期范围数组，如 ['2024-01-01', '2024-01-31']
 * @returns {Object} 包含 kprqStart 和 kprqEnd 的对象，值为秒级时间戳
 */
export function formatDateRangeToTimestamp(dateRange) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return { kprqStart: undefined, kprqEnd: undefined };
  }
  const [start, end] = dateRange;
  let kprqStart, kprqEnd;
  
  if (start) {
    // 将开始日期设置为当天的 00:00:00
    const startDate = new Date(start + 'T00:00:00');
    kprqStart = Math.floor(startDate.getTime());
  }
  
  if (end) {
    // 将结束日期设置为当天的 23:59:59
    const endDate = new Date(end + 'T23:59:59');
    kprqEnd = Math.floor(endDate.getTime());
  }
  
  return { kprqStart, kprqEnd };
}

/**
 * 格式化日期时间显示（用于表格显示）
 * @param {number|string} value - 时间戳或日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateTime(value) {
  if (!value) {
    return '-';
  }
  
  // 如果是字符串格式的日期，先尝试转换为时间戳
  let timestamp = value;
  if (typeof value === 'string') {
    // 检查是否是日期字符串格式
    if (value.includes('-') || value.includes('/')) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        timestamp = Math.floor(date.getTime() / 1000);
      } else {
        // 尝试直接转换为数字
        timestamp = Number(value);
      }
    } else {
      timestamp = Number(value);
    }
  }
  
  // 使用 formatTimestampToDate 格式化
  const formatted = formatTimestampToDate(timestamp);
  return formatted || '-';
}

/**
 * 获取当前日期时间字符串（用于表单默认值）
 * @param {string} format - 日期格式，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 当前日期时间字符串
 */
export function getCurrentDateTime(format = 'yyyy-MM-dd HH:mm:ss') {
  const now = new Date();
  if (format === 'yyyy-MM-dd HH:mm:ss') {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (format === 'yyyy-MM-dd') {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return formatTimestampToDate(Math.floor(Date.now() / 1000), format);
}

export default {
  formatTimestampToDate,
  formatDateToTimestamp,
  formatDateRangeToTimestamp,
  formatDateTime,
  getCurrentDateTime
};





