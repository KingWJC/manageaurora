/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-12-12 16:19:30
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-05-16 16:25:32
 * @FilePath: \common-basec:\project\middleground\lonch-isfe\src\common-base\api\webSocketApi\customEvent.js
 * @Description: 通用，自定义事件
 */
import utils from '../../utils/utils.js';

import {
  RESULT_TYPE_ENUM,
  default as getApiCustomResult
} from './apiCustomResult.js';

const STATUS_ENUM = {
  WAIT: 'wait',
  COMPLETE: 'complete'
};

// 事件处理器
function CustomEvent() {}

CustomEvent.prototype = {
  list: {},

  // 添加事件
  on(id, data, callback, { maxExpireTime = 0 } = {}) {
    if (!id) {
      console.warn(`添加事件失败，事件id为空`);
      return;
    }
    if (!callback) {
      console.warn(`添加事件失败，事件处理方法为空`);
      return;
    }

    const currentList = {
      state: STATUS_ENUM.WAIT,
      request: utils.turnJson(data),
      callback,
      timer: null,
    };

    this.list[id] = currentList;

    // 设置事件过期自动触发
    this.expireAutoEmit(id, maxExpireTime);
  },

  // 触发事件
  emit(id, data) {
    const currentList = this.list[id];

    /**
     * 触发事件${id}失败，没有查询到此事件
     */
    if (!currentList) {
      return false;
    }

    clearTimeout(this.list[id].timer)

    currentList.state = STATUS_ENUM.COMPLETE;

    const callback = currentList.callback;

    callback(data);

    this.delete(id);
    return true;
  },

  // 删除事件
  delete(id) {
    delete this.list[id];
  },

  // 得到全部未处理事件Id
  getIdList() {
    return Object.keys(this.list);
  },
  
  // 得到全部未处理事件Id
  getList() {
    return Object.values(this.list);
  },
  
  /**
   * 判断当前id是否存在
   * @param {String} id 判断当前ID是否存在
   * @returns 
   */
  hasId(id='') {
    return !!this.list[id]
  },

  /**
   * 根据ID获取数据
   * @param {String} id  
   * @return {Object || undefined}
   */
  getIdData(id) {
    return this.list[id]
  },

  // 过期自动触发，为0不需要过期触发
  expireAutoEmit(id, maxExpireTime = 0) {
    if (!maxExpireTime) {
      return;
    }

    this.list[id].timer = setTimeout(() => {
      if (this.list[id] && this.list[id].state === STATUS_ENUM.WAIT) {
        const res = getApiCustomResult(RESULT_TYPE_ENUM.TIMEOUT, id, this.list[id]);

        this.emit(id, res);
      }
    }, maxExpireTime);
  }
};

export default CustomEvent;
