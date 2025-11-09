/**
 * 字符串工具函数库
 * 提供字符串处理的通用工具方法
 */

/**
 * 在字符串左侧填充指定字符，使字符串达到目标长度
 * @param {string|number} str - 要填充的字符串或数字
 * @param {number} targetLength - 目标字符串长度
 * @param {string} [padChar=' '] - 用于填充的字符，默认为空格
 * @returns {string} 填充后的字符串
 * @example
 * leftPad('123', 5, '0'); // 返回 '00123'
 * leftPad('test', 8); // 返回 '    test'
 */
function leftPad(str, targetLength, padChar = ' ') {
    // 将输入转换为字符串，确保处理数字时也能正常工作
    str = str.toString();

    // 如果字符串已经达到或超过目标长度，直接返回原字符串
    if (str.length >= targetLength) {
        return str;
    }

    // 计算需要填充的字符数量
    const padLength = targetLength - str.length;

    // 使用 padChar 重复填充，并添加到字符串左侧
    // repeat 方法会创建一个包含指定数量的字符串的新字符串
    return padChar.repeat(padLength) + str;
}

/**
 * 检测URL是否是图片，检测前会去掉query参数
 * @param {string} url - 要检测的URL字符串
 * @returns {boolean} - 如果是图片URL返回true，否则返回false
 * @example
 * isImageUrl('https://example.com/image.jpg'); // 返回 true
 * isImageUrl('https://example.com/image.png?size=large'); // 返回 true
 * isImageUrl('https://example.com/document.pdf'); // 返回 false
 */
function isImageUrl(url) {
    // 检查输入是否为字符串且不为空
    if (!url || typeof url !== 'string') {
        return false;
    }

    // 去掉URL中的query参数，只保留基础URL部分
    // split('?') 将URL按问号分割，[0] 取第一部分（即问号前的内容）
    const urlWithoutQuery = url.split('?')[0];

    // 定义常见的图片文件扩展名数组
    // 包含了网页开发中常见的所有主流图片格式
    const imageExtensions = [
        '.jpg',  // JPEG图片格式
        '.jpeg', // JPEG的另一种扩展名
        '.png',  // PNG图片格式（支持透明）
        '.gif',  // GIF图片格式（支持动画）
        '.bmp',  // BMP位图格式
        '.webp', // WebP格式（现代网页优化格式）
        '.svg',  // SVG矢量图格式
        '.tiff', // TIFF图片格式（高质量图像）
        '.ico',  // 图标文件格式
        '.jfif'  // JPEG文件交换格式
    ];

    // 转换为小写进行比较，确保大小写不敏感
    const lowerUrl = urlWithoutQuery.toLowerCase();

    // 检查URL是否以图片扩展名结尾
    // some 方法遍历数组，只要有一个扩展名匹配就返回true
    return imageExtensions.some(ext => lowerUrl.endsWith(ext));
}

// 导出工具函数供外部使用
export { leftPad, isImageUrl };
