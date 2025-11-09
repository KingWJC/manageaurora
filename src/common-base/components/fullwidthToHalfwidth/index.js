/**
 * 全角转半角 Vue 插件
 * 功能：自动将输入框中的全角字符（数字、字母、标点符号等）转换为对应的半角字符
 * 特点：
 * - 支持普通输入框、文本域、Element UI组件及富文本编辑器
 * - 可通过data-fullwidth-to-halfwidth="false"禁用特定区域的转换
 * - 使用方式 main.js 中引入并使用即可
 * import FullwidthToHalfwidth from './common-base/components/fullwidthToHalfwidth';
 * Vue.use(FullwidthToHalfwidth);
 */

/**
 * 根据全局字符偏移量查找对应的文本节点和局部偏移位置
 * @param {Node} root - 根DOM节点
 * @param {number} globalOffset - 全局字符偏移量
 * @return {Object} - 包含文本节点和局部偏移位置的对象
 *   - node: 目标文本节点
 *   - offset: 节点内的字符偏移量
 */
const findTextNodeAndOffset = (root, globalOffset) => {
  // 检查根节点是否有效
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let currentNode;
  let currentLength = 0;
  let lastTextNode = null; // 优化：在第一次遍历时记录最后一个文本节点

  // 遍历所有文本节点，查找匹配偏移量的节点
  while ((currentNode = treeWalker.nextNode())) {
    lastTextNode = currentNode; // 更新最后一个文本节点
    const nodeLength = currentNode.nodeValue.length;
    if (globalOffset <= currentLength + nodeLength) {
      return {
        node: currentNode,
        offset: globalOffset - currentLength
      };
    }
    currentLength += nodeLength;
  }

  // 如果偏移量超出总长度或无文本节点，处理边界情况
  // 直接使用在遍历中记录的lastTextNode
  if (lastTextNode) {
    return {
      node: lastTextNode,
      offset: lastTextNode.nodeValue.length
    };
  }
  // 如果没有找到任何文本节点，返回根节点和偏移0
  return { node: root, offset: 0 };
};

/**
 * 核心转换函数：将全角字符转换为半角字符
 * @param {string} str - 需要转换的字符串
 * @return {string} 转换后的半角字符串
 */
const convertToHalfwidth = (str) => {
  // 空值检查
  if (!str) return str;

  let result = ''; // 存储转换结果

  // 优化：使用Map存储特殊中文标点，提高可读性和查找效率
  const specialCharMap = new Map([
    [65292, ','],  // 中文逗号
    [12290, '.'],  // 中文句号
    [8220, '"'],  // 中文双引号
    [8221, '"'],  // 中文双引号
    [8216, '\''], // 中文单引号
    [8217, '\''], // 中文单引号
    [65288, '('],  // 中文左括号
    [65289, ')'],  // 中文右括号
    [12289, ','],  // 中文顿号
    [65306, ':'],  // 中文冒号
    [65307, ';'],  // 中文分号
    [8212, '-'],   // 中文破折号
    [8211, '-'],   // 中文连接号
    [8230, '...'], // 中文省略号
    [65509, '¥']   // 人民币符号
  ]);

  // 遍历字符串每个字符
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);
    let convertedChar = char; // 默认不转换

    // 转换逻辑分为5大类：

    // 1. 全角空格 (U+3000)
    if (code === 12288) {
      convertedChar = '\u00A0'; // 转换为不间断空格
    }
    // 2. 全角数字 (U+FF10-U+FF19)
    else if (code >= 65296 && code <= 65305) {
      convertedChar = String.fromCharCode(code - 65248);
    }
    // 3. 全角字母 (U+FF21-U+FF3A 和 U+FF41-U+FF5A)
    else if ((code >= 65313 && code <= 65338) || (code >= 65345 && code <= 65370)) {
      convertedChar = String.fromCharCode(code - 65248);
    }
    // 4. 其他全角标点符号 (U+FF01-U+FF5E)
    else if (code >= 65281 && code <= 65374) {
      if (!( // 排除已处理的数字和字母
        (code >= 65296 && code <= 65305) ||
        (code >= 65313 && code <= 65338) ||
        (code >= 65345 && code <= 65370)
      )) {
        convertedChar = String.fromCharCode(code - 65248);
      }
    }
    // 5. 特殊中文标点符号处理
    else {
      // 使用Map进行查找
      const mappedChar = specialCharMap.get(code);
      if (mappedChar !== undefined) {
        convertedChar = mappedChar;
      }
    }
    result += convertedChar;
  }
  return result;
};

const fullwidthToHalfwidth = {
  /**
   * 插件安装方法
   * @param {Object} Vue - Vue 构造器
   */
  install(Vue) {
    /**
     * 输入事件处理函数（用于普通输入框/文本域）
     * @param {Event} event - 输入事件对象
     */
    const handleInput = (event) => {
      const target = event.target;
      const start = target.selectionStart; // 记录光标起始位置
      const end = target.selectionEnd;    // 记录光标结束位置

      // 执行转换
      const convertedValue = convertToHalfwidth(target.value);

      // 值有变化时更新
      if (target.value !== convertedValue) {
        target.value = convertedValue;
        // 触发Vue的响应式更新
        target.dispatchEvent(new Event('input', { bubbles: true }));

        // 异步恢复光标位置（确保DOM更新完成）
        setTimeout(() => {
          target.selectionStart = start;
          target.selectionEnd = end;
        }, 0);
      }
    };

    /**
     * 检查元素是否应被转换
     * @param {HTMLElement} element - 要检查的元素
     * @return {boolean} - 是否应该进行转换
     */
    const shouldConvert = (element) => {
      let current = element;

      while (current) {
        if (current.dataset?.fullwidthToHalfwidth === 'false') {
          return false;
        }
        current = current.parentElement;
      }
      return true;
    };

    /**
     * 查找并绑定事件监听器
     * @param {HTMLElement} el - 根DOM元素
     */
    const findAndAttachListeners = (el) => {
      // 确保传入的元素是有效的DOM节点
      if (!el || el.nodeType !== Node.ELEMENT_NODE) {return};

      // 处理可编辑元素
      const elements = el.querySelectorAll('input, textarea, .el-input__inner, .el-textarea__inner, [contenteditable="true"]');

      elements.forEach(element => {
        // 检查是否需要转换
        if (shouldConvert(element)) {
          // 处理富文本编辑器
          if (element.contentEditable === 'true') {
            // 使用MutationObserver监听可编辑区域的内容变化
            const observer = new MutationObserver((mutationsList) => {
              for (const mutation of mutationsList) {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                  // 仅当文本内容实际变化时才进行转换
                  if (element.textContent !== element._originalContent) {
                    // 对数据进行转换
                    const convertedText = convertToHalfwidth(element.textContent);
                    if (element.textContent !== convertedText) {
                      // 保存当前光标位置
                      const selection = window.getSelection();
                      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                      const preCaretRange = range ? range.cloneRange() : null;
                      let startOffset = 0;
                      let endOffset = 0;

                      // 如果有光标位置，计算光标偏移
                      if (preCaretRange) {
                        preCaretRange.selectNodeContents(element);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        startOffset = preCaretRange.toString().length;
                        preCaretRange.setEnd(range.startContainer, range.startOffset);
                        endOffset = preCaretRange.toString().length;
                      }

                      // 遍历并替换文本节点内容
                      const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
                      let node;
                      let currentOffset = 0;
                      while ((node = walk.nextNode())) {
                        const nodeText = node.nodeValue;
                        // 对数据进行转换
                        const newText = convertToHalfwidth(nodeText);
                        if (nodeText !== newText) {
                          node.nodeValue = newText;
                        }
                      }
                      // 确保DOM结构稳定
                      element.normalize();

                      // 恢复光标位置
                      if (range) {
                        const newRange = document.createRange();

                        const startPos = findTextNodeAndOffset(element, startOffset);
                        const endPos = findTextNodeAndOffset(element, endOffset);

                        if (startPos.node && endPos.node) {
                          newRange.setStart(startPos.node, startPos.offset);
                          newRange.setEnd(endPos.node, endPos.offset);
                          selection.removeAllRanges();
                          selection.addRange(newRange);
                        } else {
                          // 如果无法找到位置，将光标置于末尾
                          element.focus();
                          selection.selectAllChildren(element);
                          selection.collapseToEnd();
                        }
                      }

                      // 触发自定义事件通知外部内容已更新
                      element.dispatchEvent(new CustomEvent('fullwidthToHalfwidthConverted', { bubbles: true }));
                    }
                    element._originalContent = element.textContent;
                  }
                }
              }
            });
            observer.observe(element, { childList: true, characterData: true, subtree: true });
            element._fullwidthToHalfwidthObserver = observer; // 保存观察器引用
            element._originalContent = element.textContent; // 存储原始内容
          } else {
            // 普通输入框绑定input事件
            element.addEventListener('input', handleInput);
            element._fullwidthToHalfwidthHandler = handleInput; // 保存处理器引用
          }
        }
      });
    };

    /**
     * 移除事件监听器
     * @param {HTMLElement} el - 根DOM元素
     */
    const removeListeners = (el) => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

      // 移除所有可能元素的事件监听
      const elements = el.querySelectorAll('input, textarea, .el-input__inner, .el-textarea__inner, [contenteditable="true"]');
      elements.forEach(element => {
        if (element._fullwidthToHalfwidthHandler) {
          element.removeEventListener('input', element._fullwidthToHalfwidthHandler);
          delete element._fullwidthToHalfwidthHandler;
        }
        if (element._fullwidthToHalfwidthObserver) {
          element._fullwidthToHalfwidthObserver.disconnect();
          delete element._fullwidthToHalfwidthObserver;
          delete element._originalContent;
        }
      });
    };

    // 注册全局混入
    Vue.mixin({
      mounted() {
        this.$nextTick(() => {
          // 组件挂载后查找并绑定监听器
          findAndAttachListeners(this.$el);
        });
      },
      beforeDestroy() {
        // 组件销毁前移除监听器
        removeListeners(this.$el);
      }
    });
  }
};

export default fullwidthToHalfwidth;
