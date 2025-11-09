/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2024-04-25 10:48:28
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-06-24 14:03:43
 * @FilePath: \common-basec:\project\middleground\lonch-pwms\src\common-base\_tools\monitoring\resources.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
(function () {
  /**
   * 请求接口
   * @param {Object} service 接口配置
   * @param {Object} data 接口参数()
   * @returns
   */
  function sendAjax(service, data) {
    // vm 不存在,说明vue未渲染完成,延迟发送
    if (!window.vm) {
      setTimeout(() => {
        sendAjax(service, data);
      }, 1000);
      return;
    }
    // 发送数据
    vm.API.send(
      service,
      data,
      function () {},
      function () {},
      null,
      true
    );
  }
  /**
   * 发送资源监控数据
   */
  function sendH5ConsumptionLog(params) {
    sendAjax(
      {
        module: 'operlogNoGetway',
        url: '/log/sendH5ConsumptionLog',
        method: 'POST',
        noLog: true
      },
      params
    );
  }
  function startResourceMonitoring() {
    // 成功的数据是否发送; 0 不处理; 1本地储存; 2请求接口
    const sendSuccessDataStatus = 0;
    // 失败的数据是否发送; 0 不处理; 1本地储存; 2请求接口
    const sendFailDataStatus = 2;
    // 失败的数据，是否立即发送
    const failSendImmediate = true;

    // 正常的类型列表
    const normalTypeList = ['script', 'link', 'img'];
    // 资源列表数据
    const resourceList = new Map();
    // 媒体类型列表
    const mediumTypeList = ['video', 'audio'];
    // 媒体DOM的列表
    const mediumDomAssets = new Map();
    // 媒体DOM的资源数据
    const mediumResourceList = new Map();

    // 本地保存数据的过期时间，默认30天
    const localSaveExpireTime = 10 * 24 * 3600 * 1000;
    // 是否支持PerformanceObserver
    let isPerformanceObserver = false;
    // 页面开始时间,用于计算资源加载时间
    const pageStartTime = Date.now();

    // 资源监控初始化状态
    let init = true; // 初始化

    /**
     * 资源状态
     */
    const STATUS_ENUM = {
      SUCCESS: 'success',
      FAIL: 'fail'
    };

    /**
     * 获取全部的资源
     * @return {Array<PerformanceResourceTiming>} 返回PerformanceResourceTiming格式的数据,所有的资源列表
     */
    function getAllResource() {
      return performance.getEntriesByType('resource');
    }

    /**
     * 得到当前日期格式，
     * @return {String} 当前的: 年-月-日
     */
    function getDataFormat() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      return `${year}-${month}-${date}`;
    }

    /**
     * 根据页面开始相对时间，得到具体的时间戳
     * @return {Number} 时间戳
     */
    function getTimeStamp(time) {
      if (!time) {
        return 0;
      }
      time += pageStartTime;
      return Math.floor(time);
    }

    /**
     * 转化格式，生成资源数据
     * @return {Object} 资源对象格式
     */
    function generateData(entry, data) {
      let startTime = getTimeStamp(entry.startTime);
      let responseEnd = getTimeStamp(entry.responseEnd);
      return {
        ...data,
        url: entry.name || null, // 资源名称
        type: entry.initiatorType || null, // 资源类型
        startTime: startTime || null, // 开始时间
        endTime: responseEnd || null, // 结束时间
        size: entry.decodedBodySize || null // 资源大小
      };
    }

    /**
     * 查找指定的资源
     * @return {Array<PerformanceResourceTiming>} 获得url的资源列表
     */
    function getUrlResource(url) {
      return getAllResource()
        .filter((el) => el.name === url)
        .reverse();
    }

    /**
     * 生成key
     * @return {String} key
     */
    function generateKey(entry) {
      return `${entry.name}----${entry.startTime}`;
    }

    /**
     * 资源加载监控
     */
    function resourceObserver(entryList) {
      /**
       * 初始化时，获取所有的资源数据
       */
      let list = init ? getAllResource() : entryList.getEntries();
      init = false;
      /**
       * 遍历资源列表
       */
      list.forEach((entry) => {
        const name = entry.name;
        const key = generateKey(entry);
        const value = generateData(entry, {
          status: STATUS_ENUM.SUCCESS
        });
        /**
         * 基础资源
         */
        if (normalTypeList.includes(entry.initiatorType)) {
          /**
           * 已添加不在添加（成功或失败）
           */
          if (resourceList.has(name)) {
            return;
          }
          resourceList.set(name, value);
        } else if (mediumTypeList.includes(entry.initiatorType)) {
          /**
           * 媒体资源数据
           */
          /**
           * 已添加成功或失败过滤, 或大小为0的过滤
           */
          if (mediumResourceList.has(key) || !value.size) {
            return;
          }
          mediumResourceList.set(key, value);
        }
      });
    }

    /**
     * 获取媒体的DOM对象资源
     * @param {String} url 媒体的url
     * @returns {Object} 媒体资源数据
     */
    function getMediumDomAssets(url) {
      let current = [...mediumDomAssets].find((el) => el[1].url === url);

      /**
       * 不存在些媒体添加空
       */
      if (!current) {
        return null;
      }

      /**
       * 获取媒体的资源
       */
      current = current[1];
      /**
       * 格式化资源，方便后续直接修改
       */
      current = JSON.parse(JSON.stringify(current));

      /**
       * 移除不需要保存的数据
       */
      delete current.event;
      delete current.data;
      current.waitingList = JSON.stringify(
        current.waitingList.map((el) => ({
          playTime: el.playTime,
          time: el.time // 等待播放的时间
        }))
      );

      return current;
    }

    /**
     * 更新媒体的最后一个等待数据
     * @param {Object} config 媒体资源
     * @returns
     */
    function updateWaitingList(config) {
      const length = config.waitingList.length;
      /**
       * 无等待列表退出
       */
      if (!length) {
        return;
      }
      /**
       * 最后一个等待在不在等待中，退出
       */
      const current = config.waitingList[length - 1];
      if (current.time !== -1) {
        return;
      }

      // 设置最后一个等待的等待时间
      current.time = Date.now() - current.oldTime;
    }

    /**
     * 添加媒体（视频、音频）
     */
    function addMedium($medium) {
      const type = $medium.nodeName.toLowerCase();
      /**
       * 不是媒体文件直接退出
       */
      if (!mediumTypeList.includes(type)) {
        return;
      }
      // 当前媒体的url
      const url = $medium.src;
      /**
       * 媒体文件资源数据
       */
      const config = {
        url,
        type,
        mediaId: Date.now() + Math.floor(Math.random() * 1000000),
        domTime: Date.now(), // DOM渲染时间
        canplayTime: 0, // 可以播放时间
        playTime: 0, // 已播放时间秒
        endStatus: false, // 是否播放完成
        waitingList: [], // 等待列表
        resourceList: [], // 资源列表
        // 数据，不需要上报的数据
        data: {
          currentTime: 0
        },
        // 事件
        event: {
          /**
           * 播放完成
           * */
          ended() {
            config.endStatus = true;
            $medium.removeEventListener('ended', config.event.ended);
            $medium.removeEventListener('timeupdate', config.event.timeupdate);
          },
          /**
           * 可以播放
           */
          canplay() {
            if (!config.canplayTime) {
              config.canplayTime = Date.now();
            }

            // 更新等待列表
            updateWaitingList(config);
          },
          /**
           * 等待资源加载
           * @param {*} e
           */
          waiting() {
            config.waitingList.push({
              playTime: config.data.currentTime,
              oldTime: Date.now(),
              time: -1 // 等待播放的时间
            });
          },
          /**
           * 播放已开始
           */
          play() {
            // 更新等待列表
            updateWaitingList(config);
          },
          /**
           * 已经在暂停或因数据不足而延迟后准备好进行播放。
           */
          playing() {
            // 更新等待列表
            updateWaitingList(config);
          },
          /**
           * 时间更新
           * @param {*} e
           */
          timeupdate(e) {
            config.data.currentTime = e.target.currentTime;
            config.playTime = Math.max(
              config.playTime,
              config.data.currentTime
            );
          }
        }
      };
      mediumDomAssets.set($medium, config);

      /**
       * 添加媒体事件
       */
      Object.entries(config.event).forEach((el) => {
        const eventName = el[0];
        const eventFunc = el[1];
        $medium.addEventListener(eventName, eventFunc);
      });
    }

    /**
     * 移除媒体（视频、音频）
     */
    function removeMedium($medium) {
      /**
       * 不是媒体文件直接退出，没有媒体数据直接退出
       */
      const config = mediumDomAssets.get($medium);
      if (!mediumTypeList.includes($medium.nodeName.toLowerCase()) || !config) {
        return;
      }

      /**
       * 移除事件
       */
      Object.entries(config.event).forEach((el) => {
        const eventName = el[0];
        const eventFunc = el[1];
        $medium.removeEventListener(eventName, eventFunc);
      });
      mediumDomAssets.get($medium, config);
    }

    /**
     * 观察指定类型的DOM列表的修改进行处理
     * @param {Array} list DOM列表
     * @param {Array} typeList 观察的类型
     * @param {Function} callback 回调
     */
    function observerCommon(list, typeList, callback) {
      list.forEach((node) => {
        /**
         * 当前DOM是指定类型的DOM
         */
        if (typeList.includes(node.nodeName.toLowerCase())) {
          callback(node);
        } else if (node.querySelectorAll) {
          /**
           * 获取此DOM的子DOM是指定类型的
           */
          node.querySelectorAll(typeList.join(',')).forEach(($node) => {
            callback($node);
          });
        }
      });
    }

    /**
     * 观察媒体DOM
     * @param {Object} param0
     *    @param {Array} addList 添加的DOM列表
     *    @param {Array} removeList 移除的DOM列表
     */
    function observerMedium({ addList, removeList }) {
      observerCommon(addList, mediumTypeList, addMedium);
      observerCommon(removeList, mediumTypeList, removeMedium);
    }

    /**
     * 监控资源加载
     */
    if (PerformanceObserver) {
      isPerformanceObserver = true;
      new PerformanceObserver((entryList) => {
        resourceObserver(entryList);
      }).observe({ entryTypes: ['resource'] });
    }

    /**
     * 常规资源以dom的方式监控
     * @param {String} name 资源地址
     * @param {Dom} $node 当前dom元素
     * @param {event} e 事件
     */
    function addNormalResource(name, $node, e) {
      const value = generateData(
        {
          name,
          initiatorType: $node.nodeName.toLowerCase(),
          startTime: e.timeStamp
        },
        {
          status: STATUS_ENUM.SUCCESS
        }
      );

      resourceList.set(name, value);
    }

    /**
     * 事件列表
     */
    const eventList = new Map();
    /**
     * dom的加载
     */
    new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((record) => {
        if (record.type === 'childList') {
          const value = {
            addList: [...record.addedNodes],
            removeList: [...record.removedNodes]
          };

          /**
           * 观察媒体
           */
          observerMedium(value);
          /**
           * 不支持isPerformanceObserver, 监控script、css、图片
           */
          if (!isPerformanceObserver) {
            /**
             * 监控常规事件加载
             */
            observerCommon(value.addList, normalTypeList, function ($node) {
              const name = $node.src || $node.href;

              if (!name) {
                return;
              }

              // 加载事件
              const currentEvent = addNormalResource.bind(null, name, $node);

              /** 记录此事件 */
              eventList.set(name, currentEvent);
              $node.addEventListener('load', currentEvent);
            });
            observerCommon(value.removeList, normalTypeList, function ($node) {
              const name = $node.src || $node.href;
              if (!name) {
                return;
              }
              const currentEvent = eventList.get(name);
              // 移除事件
              $node.removeEventListener('load', currentEvent);
              eventList.delete(name);
            });
          }
        }
      });
      // 我们在这里监听 script 和 styleLink 标签的动态
    }).observe(
      document.documentElement,
      // 如下配置参数除了 attributeFilter 这个为了更好性能的参数，一个都不能动
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href'],
        attributeOldValue: true,
        characterData: false
      }
    );

    /**
     * 监控资源加载报错
     */
    window.addEventListener(
      'error',
      (e) => {
        const entry = e.target;
        /**
         * 判断是否是监控的资源文件
         */
        let isElementTarget =
          entry instanceof HTMLScriptElement ||
          entry instanceof HTMLLinkElement ||
          entry instanceof HTMLImageElement ||
          entry instanceof HTMLVideoElement ||
          entry instanceof HTMLAudioElement;
        if (!isElementTarget) {
          return;
        }

        /**
         * 当前报错的地址
         */
        const url = entry.src || entry.href;
        /**
         * 当前报错的类型
         */
        const type = entry.nodeName.toLowerCase();

        /**
         * 获取此地址的所有资源数据
         */
        const list = getUrlResource(url);

        let key = url;
        let value = generateData(
          {
            name: url,
            initiatorType: type,
            startTime: e.timeStamp
          },
          {
            status: STATUS_ENUM.FAIL
          }
        );

        /**
         * 资源管理中存在，优先从中获取
         */
        if (list && list.length) {
          key = generateKey(list[0]);
          value = generateData(list[0], {
            status: STATUS_ENUM.FAIL
          });
        }

        /**
         * js、css、图片资源
         */
        if (normalTypeList.includes(type)) {
          if (resourceList.has(url)) {
            resourceList.delete(url);
          }
          /**
           * 是否立即保存数据
           */
          if (failSendImmediate) {
            save(value);
          } else {
            resourceList.set(url, value);
          }
        } else if (mediumTypeList.includes(type)) {
          /**
           * 音视频资源
           */
          if (mediumResourceList.has(key)) {
            mediumResourceList.delete(key);
          }
          /**
           * 是否立即保存数据
           */
          if (failSendImmediate) {
            save(value);
          } else {
            mediumResourceList.set(key, value);
          }
        }
      },
      true // 注意这里一定得传入 true
    );

    /**
     * 获取的当前地址的h5版本号
     * @returns {String} 版本号
     */
    function getVersion() {
      let matchVersions =
        window.location.href.match(/\/v\d+\.\d+\.\d+\//gi) || [];
      return matchVersions.length > 0
        ? matchVersions[0].replace(/\//g, '')
        : '';
    }
    /**
     * 生成UUID
     * @param len
     * @param radix
     * @return {string}
     * @constructor
     */
    function UUID(len, radix = 62) {
      let chars =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
          ''
        );
      let uuid = [];
      if (len) {
        for (let i = 0; i < len; i++) {
          uuid[i] = chars[0 | (Math.random() * radix)];
        }
      } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (let i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16);
            uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.length > 0 ? uuid.join('') : '';
    }

    /**
     * 处理请求接口的数据结构
     */
    function getParams(data) {
      // prettier-ignore
      let params = {
        sid: 'WEB' + UUID(32, 16),
        sourceName  : window.vm.CFG.projectName,    // 来源名称
        sourceType  : LonchJsApi && LonchJsApi.clientType ? LonchJsApi.clientType : 'web-app', // 来源类型
        userAgent   : navigator.userAgent,   // 浏览器信息
        curPageUrl  : location.href,         // 当前页面的url
        curPageTitle: document.title,        // 当前页面的标题
        h5Ver       : getVersion(),          // H5版本
        url        : data.url,         // 资源地址
        type       : data.type,        // 资源类型(script|link|img|video|audio)
        status     : data.status,      // 加载状态(success | fail)
        startTime  : data.startTime,   // 开始时间戳
        endTime    : data.endTime,     // 结束时间戳
        size       : data.size,        // 资源大小
        mediaId    : '',               // 媒体标识
        domTime    : '',               // DOM渲染时间戳
        canplayTime: '',               // 可以播放时间戳
        playTime   : '',               // 已播放时间
        endStatus  : '',               // 是否播放完成
        waitingList: ''                // 播放时,网络等待
      };
      // 视频/音频
      if (mediumTypeList.includes(data.type)) {
        // prettier-ignore
        params = {
          ...params,
          mediaId    : data.mediaId,   // 媒体标识
          domTime    : data.domTime,   // DOM渲染时间戳
          canplayTime: data.canplayTime,   // 可以播放时间戳
          playTime   : data.playTime,   // 已播放时间
          endStatus  : data.endStatus,   // 是否播放完成
          waitingList: data.waitingList    // 播放时,网络等待
        }
      }

      return params;
    }

    /**
     * 发送数据
     * @param {*} keyList
     */
    function sendLocalData(keyList) {
      // 不存在本地储存列表，直接退出
      if (!keyList || !keyList.length) {
        return;
      }

      // 循环获取当前储存数据，
      keyList.forEach((key) => {
        // 获取当前数据
        let list = localStorage.getItem(key);

        // 格式化数据
        try {
          list = JSON.parse(list);
        } catch (e) {
          list = [];
        }

        // 发送
        list.forEach((params) => {
          console.log('--------请求接口------', params);
          // sendH5ConsumptionLog(params)
        });

        // 移除
        localStorage.removeItem(key);
      });
    }

    /**
     * 发送储存的数据
     */
    function startSendLocalData(successKeyList, failKeyList) {
      /**
       * 发送成功的数据
       */
      if (sendSuccessDataStatus === 2) {
        sendLocalData(successKeyList);
      }
      /**
       * 发送失败的数据
       */
      if (sendFailDataStatus === 2) {
        sendLocalData(failKeyList);
      }
    }

    /**
     * 移除过期的本地数据
     */
    function removeExpireLocalData() {
      // 当前的年月日
      const currentDate = new Date(getDataFormat()).getTime();
      const successKeyPrev = 'lonch-success-resource-list-';
      const failKeyPrev = 'lonch-fail-resource-list-';
      const successKeyList = [];
      const failKeyList = [];

      /**
       * 移除的key
       */
      const removeKey = [];
      /**
       * 循环当前本地保存的数据内容
       */
      const length = localStorage.length;
      for (let i = 0; i < length; i++) {
        const key = localStorage.key(i);
        /**
         * 判断是否为保存的本地资源数据
         */
        if (key.includes(successKeyPrev) || key.includes(failKeyPrev)) {
          /**
           * 获取日期
           */
          const date = key.replace(/lonch-(success|fail)-resource-list-/, '');

          /**
           * 计算日期是否过期
           */
          if (new Date(date).getTime() + localSaveExpireTime < currentDate) {
            removeKey.push(key);
          } else if (key.includes(successKeyPrev)) {
            // 成功的key列表
            successKeyList.push(key);
          } else if (key.includes(successKeyPrev)) {
            // 失败的key列表
            failKeyList.push(key);
          }
        }
      }

      /**
       * 移除过期数据
       */
      removeKey.forEach((el) => localStorage.removeItem(el));

      startSendLocalData(successKeyList, failKeyList);
    }
    /**
     * 本地保存数据
     */
    function localSaveData(params) {
      // 当前的年月日
      const currentDate = getDataFormat();
      /**
       * 设置本地保存数据的key
       */
      const key = `lonch-${params.status}-resource-list-${currentDate}`;

      // 获取当前key的值
      let localData = localStorage.getItem(key) || [];

      try {
        localData = JSON.parse(localData);
      } catch (e) {
        localData = [];
      }

      localData.push(params);

      /**
       * 防止数据保存太大，导致报错，移除之前是数据
       */
      let count = 0;
      while (count < 10) {
        count++;
        try {
          localStorage.setItem(key, JSON.stringify(localData));
          break;
        } catch (e) {
          localData.shift();
        }
      }
    }

    /**
     * 保存数据
     */
    function save(data) {
      /**
       * vm 不存在,说明vue未渲染完成,延迟发送
       */
      if (!window.vm) {
        setTimeout(() => {
          save(data);
        }, 1000);
        return;
      }
      /**
       * 是否请求接口发送数据
       */
      let sendDataState = 0;
      if (data.status === STATUS_ENUM.SUCCESS) {
        sendDataState = sendSuccessDataStatus;
      } else if (data.status === STATUS_ENUM.FAIL) {
        sendDataState = sendFailDataStatus;
      }

      /**
       * 不发送数据，直接返回
       */
      if (sendDataState === 0) {
        return;
      }

      const params = getParams(data);

      /**
       * 接口发送数据
       */
      if (sendDataState === 2) {
        sendH5ConsumptionLog(params);
      } else if (sendDataState === 1) {
        // 本地保存
        localSaveData(params);
      }
    }

    /**
     * 发送数据
     */
    function sendMonitorDate() {
      // 常规资源数据
      resourceList.forEach((el) => save(el));

      /**
       * 媒体资源数据
       */
      mediumResourceList.forEach((el) => {
        const currentDom = getMediumDomAssets(el.url) || {};
        save({
          ...currentDom,
          ...el
        });
      });

      /**
       * 清除数据
       */
      resourceList.clear();
      mediumResourceList.clear();
      mediumDomAssets.clear();
    }

    /**
     * 页面关闭
     */
    window.addEventListener('beforeunload', function () {
      sendMonitorDate();
    });

    /**
     * vue 切换页面
     */
    window.pushState = history.pushState;
    history.pushState = function (...args) {
      sendMonitorDate();
      window.pushState.call(this, ...args);
    };

    /**
     * vue 切换页面
     */
    window.replaceState = history.replaceState;
    history.replaceState = function (...args) {
      sendMonitorDate();
      window.replaceState.call(this, ...args);
    };

    // 移除过期的数据
    removeExpireLocalData();
  }

  try {
    startResourceMonitoring();
  } catch (e) {
    console.error('---------资源监控报错--------，错误信息', e);
  }
})();
