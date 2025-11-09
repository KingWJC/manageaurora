/**
 * 自动任务列表
 */
import webLog from '../api/web-log';
import config from '../../config/index';

const TIMEOUT_TASK_LIST = {};
// 默认轮询时间
const DEFAULT_TIMEOUT = 3000;
// 定时器timerId
let timer = null;

/**
 *
 * 添加定时任务
 * @param describe 任务名称
 * @param time
 * @param run 是否立即执行
 */
function addTimeout (data) {
  console.log('### 提醒：为保证不会创建多余的定时任务，请务必使用LonchJsApi.timeout.destroyTimeout方法销毁定时器。 ###');
  console.info(`LonchJsApi.timeout.addTimeout 参数说明：\n context（必填项）: 作用域\n callback（必填项）: 任务回调\n describe: 任务说明 \n count: 任务预定执行次数，默认执行1次，0为不限制，请注意维护定时器状态，需要及时清除定时器 \n time: 任务间隔时间  \n run：是否立即执行任务`);
  if(data && data.context && data.callback) {
    if(typeof data.callback !== 'function') {
      console.log('### 定时器回调不是函数，请检查代码！ ###');
      return;
    }
    if(!data.describe || !(data.describe.trim())) {
      console.log('### 请注意添加任务描述! ###');
    }
    // 是否传入间隔时间
    let time = data.time || DEFAULT_TIMEOUT;
    let task = {
      // 任务说明
      describe: data.describe,
      // 所在组件作用域
      context: data.context,
      // 任务间隔时间
      time,
      // 下次执行时间
      // run 立刻执行
      nextRunTime: new Date().getTime() + (data.run ? 0 : time),
      callback: data.callback,
      // 任务已执行次数
      taskAlreadyCount: 0,
      // 任务预订执行次数
      // 默认执行一次
      // 0则是不限制
      count: data.count || data.count === 0 ? data.count : 1,
      // 任务失败次数
      failCount: 0
    };
    // 生成任务唯一标识
    let sn = LonchJsApi.UUID();
    // 添加任务到任务列表中
    TIMEOUT_TASK_LIST[sn] = {
      // 任务唯一标识
      sn,
      ...task
    };
    // 如果是在iframe中，则将任务提交给父页面执行
    if (window.self !== window.top) {
      const toParentParams = {
        sn,
        describe: data.describe,
        time,
        nextRunTime: new Date().getTime() + (data.run ? 0 : time),
        frameName: window.self.name
      };
      LonchJsApi.postMessage('ADD-TIMEOUT', toParentParams);
    } else {
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }    
      runTask();
    }
    return sn;
  } else {
    console.error(`### 新增定时器参数错误，请检查代码！###`);
    return;
  }
}

/**
 * iframe通知父页面创建定时器
 * @param {*} data 
 */
function addParentTimeout(data) {
  // 添加任务到任务列表中
  TIMEOUT_TASK_LIST[data.sn] = {
    type: 'iframe',
    frameName: data.frameName,
    // 任务说明
    describe: data.describe,
    // 任务唯一标识
    sn: data.sn,
    // 任务间隔
    time: data.time,
    // 下次执行时间
    nextRunTime: data.nextRunTime,
    // 任务已执行次数
    taskAlreadyCount: 0,
    // 任务预订执行次数
    count: data.count,
    // 任务失败次数
    failCount: 0
  };
  if(timer) {
    clearTimeout(timer);
    timer = null;
  }    
  runTask();
}

/**
 * 轮询执行任务，返回true时停止
 * @param sn
 */
function runTask () {
  // 当前任务的执行时间
  let currentTime = new Date().getTime();
  // 定时器下次执行的最小时间
  let nextTime = 9999999999999;
  // 待执行的任务回调列表
  let waitCallBack = [];
  let waitFrameCallBack = [];
  for(let key in TIMEOUT_TASK_LIST) {
    const task = TIMEOUT_TASK_LIST[key];
    if(task.type === 'iframe') {
      if(task.nextRunTime <= currentTime) {
        task.nextRunTime = currentTime + task.time;
        waitFrameCallBack.push(task);
      }
      nextTime = Math.min(nextTime, task.nextRunTime);
      // 增加任务已执行次数
      task.taskAlreadyCount++;
      // 当该任务已超过执行次数时，则删除这个任务
      if(task.count > 0 && task.taskAlreadyCount >= task.count) {
        console.log(`### ${task.describe}执行了${task.taskAlreadyCount}次，将删除该定时器 ###`);
        delete TIMEOUT_TASK_LIST[key];
        LonchJsApi.postMessage('DESTROY-TIMEOUT', {sn: key});
      }
    } else {
      // 判断组件是否还存活
      if(task.context && !task.context._isDestroyed) {
        // 判断该任务是否到了执行时间
        if(task.nextRunTime <= currentTime) {
          if(task.callback && typeof task.callback === 'function') {
            console.log(`### 执行了定时器的回调函数 ### ${task.describe} ###`, task);
            // 执行任务
            try {
              // 重要！！！执行任务前，调整下次执行时间，避免递归函数执行过快，导致任务被多次执行
              task.nextRunTime = currentTime + task.time;
              waitCallBack.push(task.callback);
              // 恢复正常后，清除定时器任务执行次数
              if(task.failCount > 0) {
                task.failCount = 0;
              }
            } catch(e) {
              console.error(e);
              // 记录失败次数
              task.failCount++;
              // 第1次，或者每10次上报一次异常
              if(task.failCount === 1 || task.failCount % 10 === 0) {
                webLog.log({
                  code: 'WEBAPP020000',
                  level: 'error',
                  sid: `TIMEOUT_CALLBACK_FAID_ERROR`,
                  msg: `定时器任务执行异常！`
                }, null, '', {describe: task.describe, errorName: e.name, errorMessage: e.message, errorStack: e.stack}, new Date().getTime(), config);
              }
            }
            // 增加任务已执行次数
            task.taskAlreadyCount++;
            // 当该任务已超过执行次数时，则删除这个任务
            if(task.count > 0 && task.taskAlreadyCount >= task.count) {
              console.log(`### ${task.describe}执行了${task.taskAlreadyCount}次，将删除该定时器 ###`);
              destroyTimeout(key);
            }
          }
        }
        // 这里是未执行的任务
        // 在未执行的任务中，需要找出最小的下次执行时间
        nextTime = Math.min(nextTime, task.nextRunTime);
        // 动态调频，任务的最小间隔不得少于600ms
        // 如果下次运行时间与当前时间间隔小于600毫秒，则将下次执行时间设置为当前时间加600毫秒
        if(nextTime - currentTime < 600) {
          console.log(`### 对${task.describe}任务进行调频`);
          nextTime = currentTime + 600;
          task.nextRunTime = currentTime + 600;
        }
      } else {
        destroyTimeout(key);
      }
    }
  }
  // iframe里的页面不需要自己启动定时器
  if (window.self === window.top) {
    if(Object.keys(TIMEOUT_TASK_LIST).length > 0) {
      // 因为执行任务的关系，消耗了一些时间，所以重新获取一下当前时间
      currentTime = new Date().getTime();
      // console.log('TIMEOUT_TASK_LIST:::', TIMEOUT_TASK_LIST)
      // console.log(`当前时间：${new Date().getTime()}，${nextTime - currentTime}毫秒后，将执行下一次定时任务`)
      timer = setTimeout(() => {
        runTask();
      }, nextTime - currentTime)
    }
  }
  /**
   * 为什么要设定定时器后运行任务呢？
   * 因为回调函数有嵌套的话，子函数要清除定时器（timer），如果在设置定时器前执行，则清除定时器这个操作也提前执行了，导致定时器清除失败。
   */
  waitCallBack.forEach(func => {
    func();
  })
  waitFrameCallBack.forEach(task => {
    // console.log('通知子页面运行任务', task.frameName)
    LonchJsApi.postMessage('RUN-TIMEOUT-TASK', {}, task.frameName);
  })
}

/**
 * 停止任务，并清除运行任务
 * @param sn
 */
function destroyTimeout (sn) {
  if(sn && typeof sn === 'string') {
    if(TIMEOUT_TASK_LIST[sn]) {
      delete TIMEOUT_TASK_LIST[sn];
      LonchJsApi.postMessage('DESTROY-TIMEOUT', {sn});
    } else {
      console.log('### 清除定时器失败！请检查代码！ ###', JSON.stringify(TIMEOUT_TASK_LIST || ''), timer);
      webLog.log({
        code: 'WEBAPP020000',
        level: 'error',
        sid: `CLEARTIMEOUT`,
        msg: `清除定时器失败！`
      }, `LonchJsApi.timeout`, '', (TIMEOUT_TASK_LIST || '').toString(), new Date().getTime(), config);
    }
  } else {
    console.log('### 定时器不存在，无需清除 ###')
  }
}

/**
 * 清除某个组件下的所有定时器
 * @param vueComponent 组件this
 */
function clearComponentTimeout (vueComponent) {
  if(vueComponent && vueComponent._uid) {
    for (let key in TIMEOUT_TASK_LIST) {
      if(vueComponent._uid === TIMEOUT_TASK_LIST[key].context._uid) {
        destroyTimeout(TIMEOUT_TASK_LIST[key].sn);
      }
    }
  }
}
/**
 * 清除所有定时器
 */
function clearAllTimeout () {
  for (let key in TIMEOUT_TASK_LIST) {
    destroyTimeout(TIMEOUT_TASK_LIST[key].sn);
  }
}

/**
 * 获取任务列表
 */
function getTaskList () {
  return TIMEOUT_TASK_LIST;
}

export default {
  TIMEOUT_TASK_LIST,
  runTask,
  addTimeout,
  addParentTimeout,
  destroyTimeout,
  clearComponentTimeout,
  clearAllTimeout,
  getTaskList
};
