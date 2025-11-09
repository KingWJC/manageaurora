/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-03 15:50:49
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-12 22:09:37
 * @FilePath: \lonch-rxv-fe\src\common-base\components\commonForm\utils\treeUtils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function findTreeNodeById(tree, id) {
  // 如果当前节点是目标节点，直接返回
  if (tree.id === id) {
    return tree;
  }

  // 如果当前节点有子节点，递归查找
  if (tree.children && tree.children.length > 0) {
    for (let child of tree.children) {
      const result = findTreeNodeById(child, id);
      if (result) {
        return result;
      }
    }
  }

  if (Array.isArray(tree)) {
    for (let item of tree) {
      const result = findTreeNodeById(item, id);
      if (result) {
        return result;
      }
    }
  }

  // 如果没有找到，返回 null
  return null;
}

/**
 * 递归遍历树, 过滤掉不符合条件的节点
 *
 * @param {*} treeData 传入树
 * @param {*} cols 传入列配置
 * @param {*} currentNode 当前节点
 * @param {*} _context 运行时
 * @returns boolean 是否显示 (只有返回 false 不显示, 其他情况继续向后查找条件)
 */
function isParentNodeShow(treeData, cols, currentNode, _context) {
  if (currentNode?.parentId) {
    const parentConfigCol = cols?.find((col) => col.id === currentNode.parentId);
    if (parentConfigCol?.validatorKey === 'if' && typeof parentConfigCol.validator === 'function' && !parentConfigCol.validator(_context)) {
      return false;
    } else if (isParentNodeShow(treeData, cols, findTreeNodeById(treeData, currentNode.parentId), _context) === false) {
      return false;
    }
  }
}

/**
 * 问询表构造树状结构
 * 
 * @param {*} treeData 传入问询表的构造树
 * @param {*} context 运行时
 * @param {*} colsKey 问询表存储 cols 的字段
 * @returns 
 */
const setQuestionnaireDataCols = (treeData, context, colsKey = 'previewCols') => {
  const result = [];
  const answerList = context.formData?.answerList || [];
  const loop = (data, level) => {
    if (data?.id) {
      let item = {};
      item.style = `margin-left: ${level * 10}px;`
      item.label = data.questionName;
      item.required = !!data.parentId;
      item.xs = 12;
      // 预览的时候, 没有 ID, 用Index 当做 ID
      data.optionList?.forEach((option, optionIndex) => {
        data.optionList[optionIndex].id = data.optionList[optionIndex].id || optionIndex;
      });
      if (!data.questionType) {
        item.required = false;
        item.id = data.id;
      } else if (data.questionType === '1') {
        item.type = 'radio';
        item.id = data.id;
        item.field = {
          options: data.optionList,
          labelKey: 'optionName',
          valueKey: 'id'
        }
        item.onChange = (value) => {
          const label = data.optionList.find((option) => option.id === value)?.optionName;
          context.$set(context.formData, `__${item.id}`, label);
        }
        const answerOptionId = answerList.find((answer) => answer.questionId === data.id)?.answerOptionId;
        if (answerOptionId) {
          context.$set(context.formData, item.id, answerOptionId);
        }
      } else if (data.questionType === '2') {
         const answerOptionId = answerList.filter((answer) => answer.questionId === data.id).map((answer) => answer.answerOptionId).filter(Boolean);
        const hasConditionChildren = data.children?.length && data.children.findIndex((child) => child.conditionList?.length) < data.children.length -1;
        if (hasConditionChildren) {
          item.label = data.questionName; 
          const children = [{...data, children: null, $hide: true}];
          data.optionList.forEach((option) => {
            const result = {
              ...data,
              id: `${data.id}_${option.optionName}_$splitCondition$`,
              optionList: [option],
              optionId: option.id,
              children: null,
              questionName: '',
            };
            if (answerOptionId.includes(option.id)) {
              context.$set(context.formData, result.id, [option.id]);
            } else {
              context.$set(context.formData, result.id, []);
            }
            children.push(result);
            data.children.forEach((child, childIndex) => {
              if (child?.conditionList?.find((condition) => condition.conditionValue === option.optionName)) {
                children.push({
                  ...child,
                  _conditionId: `${data.id}_${option.optionName}_$splitCondition$`,
                });
                data.children[childIndex] = null;
              }
            });
          });
          children.push(...data.children.filter(Boolean));
          data.children = children;
        } else {
          item.id = data.id;
          item.xs = 12;
          item.type = 'checkbox';
          item.field = {
            options: data.optionList,
            labelKey: 'optionName',
            valueKey: 'id'
          }
          item.onChange = (value, context) => {
            const labels = value.map((v) => data.optionList.find((option) => option.id === v)?.optionName).filter(Boolean);
            context.$set(context.formData, `__${item.id}`, labels);
            if (/\_\$splitCondition\$$/.test(data.id)) {
              const parentId = data.id.split('_').filter(Boolean)[0];
              const parentValue = context.formData?.[parentId] || [];
              const optionId = data.optionId;
              if (value.includes(optionId)) {
                context.$set(context.formData, parentId, [
                ...parentValue.filter(v => !value.includes(v)),
                ...value
                ]);
              } else {
                context.$set(context.formData, parentId, [
                  ...parentValue.filter(v => v !== optionId),
                ]);
              }
            }
          }
          if (!/\_\$splitCondition\$$/.test(data.id)) {
            context.$set(context.formData, item.id, answerOptionId);
          }
        }
        
      } else if (data.questionType === '3') {
        const text = data.questionContent || `{#text}`;
        const answerContent = answerList.find((answer) => answer.questionId === data.id)?.answerContent;
        const defaultAnserContentList = answerContent ? JSON.parse(answerContent) : [];

        // 以 {} 作为分隔符，提取 {} 中的内容
        const result = text.split(/[{}]/).filter(Boolean);
        item.type = 'row';
        item.id = data.id;
        item.xs = 12;
        const children = result.map((v, index) => {
          if (/^#text$/.test(v)) {
            return {
              type: 'text',
              id: `${data.id}_$text$${index}`,
              label: '',
              disabled: false,
              required: true,
              placeholder: '请输入内容',
            }
          } 
          if (/^#number$/.test(v)) {
            return {
              type: 'number',
              id: `${data.id}_$number$${index}`,
              label: '',
              controlsPosition: 'right',
              disabled: false,
              required: true,
              placeholder: '请输入数字',
            }
          }
          if (/^#date(\|[^}]+)?$/.test(v)) {
            const format = v.split('|')[1] || `yyyy-MM-dd hh:mm:ss`;
            return {
              type: 'date',
              id: `${data.id}_$date$${index}`,
              label: '',
              disabled: false,
              required: true,
              format,
              placeholder: /^yyyy-MM-dd/.test(format) ? '请选择日期' : '请选择时间',
            }
          }
          return {
            type: 'show',
            defaultValue: v,
          }
        });
        if (defaultAnserContentList.length) {
          children.filter(child => ['text', 'number', 'date'].includes(child.type)).forEach((child, childIndex) => {
            if (child.id) {
              context.$set(context.formData, child.id, defaultAnserContentList[childIndex]);
            }
          });
        }
        item.children = children;
      }

      if (data?.conditionList?.length && data.parentId && item) {
        item.validatorKey = "if";
        item.validator = (_context) => {
          const conditionValue = data.conditionList[0].conditionValue;
          const condition = _context.formData[data._conditionId] || _context.formData[data.parentId];
          if (condition && conditionValue) {
            if (condition === conditionValue) {
              return true;
            }
            if (Array.isArray(condition)) {
              // 递归查询上级, 如果上级不存在, 则不显示
              const cols = context.config?.[colsKey] || context.options?.[colsKey];
              if (isParentNodeShow(treeData, cols, data, _context) === false) {
                return false;
              }

              if (condition.includes(conditionValue)) {
                return true;
              }

              const parentNode = findTreeNodeById(treeData, data.parentId);
              if (parentNode?.id && Array.isArray(context.formData?.[parentNode.id])) {
                return context.formData?.[parentNode.id].find(v => condition.includes(v));
              }
            }
            if (typeof condition === 'string') {
              // 递归查询上级, 如果上级不存在, 则不显示
              const cols = context.config?.[colsKey] || context.options?.[colsKey];
              if (isParentNodeShow(treeData, cols, data, _context) === false) {
                return false;
              }
              const parentNode = findTreeNodeById(treeData, data.parentId);
              const parentNodeValue = parentNode?.optionList.find(v => v.id === condition);
              if (parentNodeValue?.optionName === conditionValue || parentNodeValue?.id === conditionValue) {
                return true;
              }
            }
          }
        }
      } else if (data.parentId && item) {
        // 如果不满足上级条件，则判断是否存在上级，如果存在上级，则显示数据，如果不存在上级，则隐藏子数据
        item.validatorKey = "if";
        item.validator = (_context) => {
          const cols = context.config?.[colsKey] || context.options?.[colsKey];
          if (isParentNodeShow(treeData, cols, data, _context) === false) {
            return false;
          }
          
          return true;
        }
        
      }
      if (data.$hide) {
        item.itemClass = 'none';
        // 不满足上级条件，则隐藏
      }

      if (!result.find(v => v.id === item.id)) {
        result.push(item);
      }
    }
    if (Array.isArray(data.children)) {
      data.children.forEach((child) => {
        loop(child, level + 1);
      });
    } else if (Array.isArray(data)) {
      data.forEach((item) => { loop(item, level); });
    }
  }
  loop(treeData, 0);
  context.config = {
    ...context.config,
    [colsKey]: result
  }
  return result;
}


/**
 * 获取树中所有节点的ID
 * @param {Object|Array} tree 树数据
 * @returns {Array} 包含所有节点ID的数组
 */
function getAllNodeIds(tree) {
  const ids = [];
  
  const traverse = (node) => {
    if (node.id) {
      ids.push(node.id);
    }
    if (node.children && node.children.length) {
      node.children.forEach(child => traverse(child));
    }
  };

  if (Array.isArray(tree)) {
    tree.forEach(node => traverse(node));
  } else {
    traverse(tree);
  }
  
  return ids;
}

export {
  findTreeNodeById,
  setQuestionnaireDataCols,
  getAllNodeIds
};