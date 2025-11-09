/**
 * 自动任务列表
 */
import utils from '../utils/utils';
import api from './api';

const TESK_LIST = {};
const DEFAULT_TIMEOUT = 30000; // 默认轮询时间

/**
 *
 * 添加定时任务
 * @param name 任务名称
 * @param processor 任务处理
 * @param args
 * @param time
 */
function addTask (data) {
  if (window.self != window.top) {
    return  LonchJsApi.postMessage('ADD-TASK', {
      name: data.name,
      processor: typeof data.processor === 'function' ? data.processor.toString() : data.processor,
      service: data.service,
      args: data.args,
      time: data.time
    });
  }
  const sn = utils.formatDate(new Date(), 'yyyyMMddhhmmssS') + utils.UUID(3, 8);
  let callBack;
  let processor = typeof data.processor === 'string' ? utils.toFunction(data.processor) : data.processor;
  if (data.service) {
    callBack = function (params) {
      api.send(data.service, params, function (res) {
        if (processor(res)) {
          stopTask(sn);
        }
      }, function () {
        stopTask(sn);
      }, this, true);
    };
  } else {
    callBack = processor;
  }
  TESK_LIST[sn] = {
    name: data.name,
    processor: callBack,
    service: data.service,
    args: data.args,
    time: data.time || DEFAULT_TIMEOUT
  };
  runTask(sn);
  return sn;
}

/**
 * 轮询执行任务，返回true时停止
 * @param sn
 */
function runTask (sn) {
  let task = TESK_LIST[sn];
  if (task) {
    task.timer = setInterval(function () {
      if (task.processor(task.args)) {
        stopTask(sn);
      }
    }, task.time);
  }
}

/**
 * 停止任务，并清除运行任务
 * @param sn
 */
function stopTask (sn) {
  let task = TESK_LIST[sn];
  //console.log('stopTask:', task);
  if (task) {
    if (task.timer) {
      clearInterval(task.timer);
    }
    delete TESK_LIST[sn];
  }
}

function stopAllTask () {
  //console.log(TESK_LIST);
  for (let k in TESK_LIST) {
    stopTask(k);
  }
}

/**
 * 获取任务列表
 */
function getTaskList () {
  return TESK_LIST;
}

export default {
  TESK_LIST,
  addTask,
  stopTask,
  stopAllTask,
  getTaskList
};
