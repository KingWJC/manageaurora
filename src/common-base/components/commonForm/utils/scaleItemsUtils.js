/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-07 16:46:28
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-23 17:36:40
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getRecordItemsFromList = (recordItemsList = []) => {
  const recordItems = {};
  recordItemsList.forEach((recordItem) => {
    if (recordItem.selectionId) {
      recordItems[recordItem.itemId] = recordItem.selectionId;
      if (recordItem.itemResult) {
        recordItems[recordItem.selectionId] = recordItem.itemResult;
      }
    } else if (recordItem.itemResult) {
      recordItems[recordItem.itemId] = recordItem.itemResult;
    } else if (recordItem.itemResultUrl) {
      recordItems[recordItem.itemId] = recordItem.itemResultUrl;
    } else if (recordItem.itemScore && recordItem.questionType === '0') {
      recordItems[recordItem.itemId] = recordItem.itemScore;
    } else if (recordItem.itemScore) {
      recordItems[recordItem.itemId] = '1';
    } else {
      recordItems[recordItem.itemId] = '0';
    }
  });
  return recordItems;
};

function getItemAllName(item, itemListMapper) {
  function getName(target, childName = '') {
    if (target.parentId) {
      const currentName =
        (target.questionType === '3'
          ? target.itemName || '判断'
          : target.itemName) +
        '-' +
        childName;
      return getName(itemListMapper[target.parentId], currentName);
    }
    return target.itemName + '-' + childName;
  }
  return getName(item).split('-').filter(Boolean).join(' - ');
}

function getItemListMapper(itemsList) {
  return itemsList.reduce((pre, cur) => {
    const selection = {};
    if (cur.selectionList?.length) {
      cur.selectionList.forEach((obj) => {
        selection[obj.id] = obj;
      });
    }
    return { ...pre, [cur.id]: cur, ...selection };
  }, {});
}

const getRecordItemsListFromRecordItems = (recordItems, itemsList) => {
  const recordItemsList = [];
  const itemListMapper = itemsList.reduce((pre, cur) => {
    const selection = {};
    if (cur.selectionList?.length) {
      cur.selectionList.forEach((obj) => {
        selection[obj.id] = obj;
      });
    }
    return { ...pre, [cur.id]: cur, ...selection };
  }, {});
  for (let index = 0; index < itemsList.length; index++) {
    const item = itemsList[index];
    if (['1', '2', '3', '4', '5'].includes(item.questionType)) {
      if (recordItems?.[item.id]) {
        const recordItem = { itemId: item.id, questionType: item.questionType };
        if (item.questionType === '1' || item.questionType === '2') {
          recordItem.selectionId = recordItems[item.id];
          const selectionScore =
            typeof itemListMapper[recordItems[item.id]].selectionScore ===
            'number'
              ? itemListMapper[recordItems[item.id]].selectionScore
              : undefined;
          const itemScore =
            typeof itemListMapper[recordItems[item.id]].itemScore === 'number'
              ? itemListMapper[recordItems[item.id]].itemScore
              : undefined;
          recordItem.itemScore =
            typeof selectionScore === 'number' ? selectionScore : itemScore;
          if (itemListMapper[recordItems[item.id]].isNeedExplain) {
            const explainResult = recordItems[recordItems[item.id]];
            if (!explainResult) {
              throw new Error(
                `请解释：${getItemAllName(item, itemListMapper)}`
              );
            } else {
              recordItem.itemResult = explainResult;
            }
          }
        } else if (item.questionType === '3') {
          const yesValue = itemListMapper[item.id].itemScore === null || itemListMapper[item.id].itemScore === undefined ? 1 : itemListMapper[item.id].itemScore;
          recordItem.itemScore =
            recordItems[item.id] === '1'
              ? yesValue
              : 0;
        } else if (item.questionType === '4') {
          recordItem.itemResult = recordItems[item.id];
        } else if (item.questionType === '5') {
          recordItem.itemResultUrl = recordItems[item.id];
          if (typeof recordItems[`${item.id}.itemScore`] === 'number') {
            recordItem.itemScore = recordItems[`${item.id}.itemScore`];
          }
        }
        recordItemsList.push(recordItem);
      } else {
        let prefix = '';
        switch (item.questionType) {
          case '1':
          case '2':
            prefix = '选择';
            break;
          case '3':
            prefix = '判断';
            break;
          case '4':
            prefix = '填写';
            break;
          default:
            prefix = '画图';
            break;
        }
        throw new Error(`请${prefix}：${getItemAllName(item, itemListMapper)}`);
      }
    } else {
      recordItemsList.push({
        itemId: item.id,
        questionType: item.questionType,
        itemScore: recordItems?.[item.id]
      });
    }
  }
  return recordItemsList;
};

const parseItemScoringFormula = (formula) => {
  if (!formula) {
    return (x) => x;
  }
  const calcArray = [];
  const [brackets, formulaStr] = formula.match(/\((.*)\)/);
  const functionStr = formula.replace(brackets, '');
  formulaStr.split('*').map((value) => {
    if (value === 'x') {
      calcArray.push('variable');
    } else if (String(+value) === value) {
      calcArray.push('times', +value);
    }
  });
  if (functionStr === 'ceil') {
    return (x) => {
      let result;
      for (let index = 0; index < calcArray.length; index++) {
        const item = calcArray[index];
        if (item === 'variable') {
          // 如果 item 是变量, 则 result = x
          result = x;
        } else if (item === 'times') {
          // 如果 item 是 乘号, 则 result = result * calcArray[index + 1], 结果为 result × 该数的下一个数, 并跳过下一个数
          result = result * calcArray[index + 1];
          index++;
        }
      }
      return Math.ceil(result);
    };
  }
};

const calculateScore = (target, recordItems) => {
  let total = 0;
  function calculateItem(treeData) {
    if (treeData.questionType === '1' || treeData.questionType === '2') {
      const selectionId = recordItems[treeData.id];
      if (selectionId) {
        const selection = treeData.selectionList.find(
          (selection) => selection.id === selectionId
        );
        if (selection) {
          const score = selection.selectionScore;
          return score;
        }
      }
    } else if (treeData.questionType === '3') {
      if (recordItems[treeData.id] === '1') {
        const score = treeData.itemScore;
        return score;
      }
    } else if (treeData.questionType === '0' && !treeData.itemScore) {
      return;
    }
    if (treeData.children?.length) {
      let childTotal = 0;
      treeData.children.forEach((childItem) => {
        const result = calculateItem(childItem);
        if (typeof result === 'number') {
          childTotal += result;
        }
      });
      total += parseItemScoringFormula(treeData.itemScoringFormula)(childTotal);
    }
  }
  calculateItem(target);
  return total;
};

export {
  getRecordItemsFromList,
  getItemAllName,
  getItemListMapper,
  getRecordItemsListFromRecordItems,
  calculateScore
};
