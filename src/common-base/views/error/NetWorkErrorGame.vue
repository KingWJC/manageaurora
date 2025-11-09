<template>
    <div v-if="isMounted" class="offline-page">
        <div class="main">
            <div ref="player" class="player player-status-0"></div>
            <div class="game-index">
                <div class="game-index-label">HI</div>
                <div class="game-index-label">{{maxScore}}</div>
                <div class="game-index-label">{{score}}</div>
            </div>
            <div v-if="isEnd" class="controller">
                <img @click="restartGame" class="btn-2" src="../../accsets/images/disconnected-game/btn-2.png" />
            </div>
            <div @click="jump" class="scroll-container">
                <div v-for="(item, index) in 3" :key="index" class="scroll-item" :style="styleFormatter(index)"
                     ref="scrollItem">
                    <div ref="monster" class="monster monster-100"></div>
                    <div ref="monster" class="monster monster-101"></div>
                    <div ref="monster" class="monster monster-102"></div>
                    <div ref="monster" class="monster monster-103"></div>
                    <div ref="monster" class="monster monster-104"></div>
                    <div ref="monster" class="monster monster-105"></div>
                    <div ref="monster" class="monster monster-106"></div>
                    <div ref="monster" class="monster monster-107"></div>
                    <div ref="monster" class="monster monster-108"></div>
                    <div ref="monster" class="monster monster-109"></div>
                    <div ref="monster" class="monster monster-110"></div>
                </div>
            </div>
        </div>
        <div @click="jump" class="footer-box">
            <div class="footer-main">
                <div class="footer-main-sptext">
                    <div class="">
                        <div class="footer-main-sptext-top">
                            <span class="footer-main-sptext-1">呀</span>
                            <img width="24" src="../../accsets/images/disconnected-game/text-1.png" />
                            <span class="footer-main-sptext-2">没有网络啦</span>
                        </div>
                        <div class="footer-main-sptext-3">未连接到互联网</div>
                    </div>
                    <img width="20" src="../../accsets/images/disconnected-game/text-2.png" />
                </div>
                <div class="footer-text-tips">
                    <div>请试试以下办法</div>
                    <ul>
                        <li>关闭飞行模式</li>
                        <li>开启移动数据网络或WLAN</li>
                        <li>检查您所在区域的网络信号</li>
                    </ul>
                </div>
            </div>
            <div class="footer-main-pc">
                <img src="../../accsets/images/disconnected-game/text-4.png" />
                <span>未连接到互联网，请稍后再试!</span>
            </div>
        </div>
    </div>
</template>

<script>
import webLog from "../../api/web-log";
export default {
  data () {
    return {
      // 每个元素的宽度
      width: 2803,
      // 滚动速度
      speed: 140,
      // 是否正在进行游戏
      isGameStart: false,
      isEnd: false,
      isMounted: false,
      // 游戏人物是否在底部
      playerIsBottom: true,
      // 游戏主进程
      timer: null,
      timer1: null,
      timer2: null,
      // 得分
      maxScore: 0,
      score: 0,
      // 备份onkeydown
      onkeydown: null
    };
  },
  async mounted () {
    this.isMounted = true;
    this.$nextTick(() => {
      this.initListener();
    });
    this.keyDown();
    this.appInfo = await this.initAppInfo()
    LonchJsApi.bindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged
    });
    if(this.appInfo.isYangChangTvType){
      //云屏电视增加消息接收
      LonchJsApi.bindMsgHandlers({
        appSendDataToH5: this.handleMsgFromApp
      });
    }
  },
  methods: {
    /*
    * 消息解析
    * */
    handleMsgFromApp(res) {
      const serviceResult = res.serviceResult || {};
      /*
      * type 消息类型
      * data 消息内容
      * */
      let type, msg, data;
      let outerType = serviceResult.type
      let logMsg = ''
      let now = new Date()
      let time = `${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
      if (outerType === '2001') {
        //只处理按键内容
        //遥控器按键格式调整 data:{keyword:2} => msg:2
        type = outerType
        msg = serviceResult.msg
        logMsg = `${this.CFG.userInfo.name || '未获取到用户名'}(${this.CFG.userInfo.id}) - ${time} - type:${type} - msg:${msg}`
      }
      if (!this.appInfo?.local) {
        //增加记录遥控器操作
        webLog.log({
          code: 'TELESCREEN_LOG',
          level: 'warn',
          msg: `云屏断网接收APP消息日志:${logMsg}`
        });
      }

      switch (type) {
        case '2001': {
          //用户操作信息
          const keyword = Number(msg);
          this.doingByCode(keyword);
          break
        }
        default:
          break
      }
    },
    /*
    * 遥控器按键操作
    * */
    async doingByCode(keyword) {
      switch (keyword) {
        case 1:
          //上 =》 跳
          this.jump()
          break;
        case 4:
          // 确认 =》开始游戏
          //游戏结束，则重启游戏
          this.restartGame()
          break;
        default:
          break;
      }
    },
    /*
    * 获取当前设备信息
    *
    * */
    async initAppInfo() {
      return new Promise((resolve, reject) => {
        //app环境下返回设备信息
        if (LonchJsApi.isInApp() || LonchJsApi.isInAppV2()) {
          this.API.send(
              this.CFG.services.appCommand.getAppInfo,
              {},
              function (res) {
                resolve(res.data.clientInfo);
              },
              function (err) {
                reject(err);
              },
              this,
              true
          );
        }
      });
    },
    onNetStatusChanged (result) {
      if (result.status === 1) {
        this.$router.go(-1);
      }
    },
    // 根据索引计算当前元素所在位置
    styleFormatter (index) {
      return {
        width: `${this.width}px`,
        left: `${index * this.width}px`
      };
    },
    // 控制滚动开始
    scroll () {
      this.isGameStart = true;
      const elementList = this.$refs.scrollItem;
      elementList.forEach((ele) => {
        ele.style.transitionDuration = `${(ele.offsetLeft + this.width) / this.speed}s`;
        ele.style.left = `-${this.width}px`;
      });
    },
    // 开始游戏
    gameStart () {
      this.width = document.body.clientWidth > 768 ? 8192 : 2803;
      this.speed = document.body.clientWidth > 768 ? 280 : 130;
      this.$nextTick(() => {
        this.scroll();
        this.score = 0;
        this.$refs['player'].className = 'player player-status-1';
        this.timer = setInterval(() => {
          this.score = this.score + 1;
          if (this.$refs['monster']) {
            for (let i = 0; i < this.$refs["monster"].length; i++) {
              if (this.isOverlap(this.$refs['player'], this.$refs['monster'][i])) {
                this.stop();
                break;
              }
            }
          }
        }, 100);
      });
    },
    stop () {
      if (this.score > this.maxScore) {
        this.maxScore = this.score;
      }
      this.isEnd = true;
      if (this.timer) clearInterval(this.timer);
      if (this.timer1) clearTimeout(this.timer1);
      if (this.timer2) clearTimeout(this.timer2);
      this.$refs['player'].className = 'player player-status-3';
      this.playerIsBottom = true;
      const elementList = this.$refs.scrollItem;
      elementList.forEach((ele) => {
        const styles = getComputedStyle(ele, null);
        ele.style.transitionDuration = '0s';
        ele.style.left = `${styles.left}`;
      });
    },
    // 重新开始
    restartGame () {
      this.isEnd = false;
      const elementList = this.$refs.scrollItem;
      elementList.forEach((ele, index) => {
        ele.style.transitionDuration = `0s`;
        ele.style.left = `${index * this.width}px`;
        this.$nextTick(() => {
          ele.style.transitionDuration = `${(ele.offsetLeft + this.width) / this.speed}s`;
          ele.style.left = `-${this.width}px`;
        });
      });
      this.gameStart();
    },
    // 初始化listener，监听滚动动画
    // 当元素完全滚动至显示范围外时，则将该元素插入队尾
    initListener () {
      const elementList = this.$refs.scrollItem;
      elementList.forEach((ele) => {
        ele.addEventListener('transitionend', () => {
          // 计算队尾位置
          const lastestElementPosition = this.lastestElementPosition();
          ele.style.transitionDuration = `0s`;
          ele.style.left = `${lastestElementPosition + this.width}px`;
          // 渲染完毕之后开始滚动
          this.$nextTick(() => {
            ele.style.transitionDuration = `${(ele.offsetLeft + this.width) / this.speed}s`;
            ele.style.left = `-${this.width}px`;
          });
        });
      });
    },
    // 计算最后一个元素的位置
    lastestElementPosition () {
      const elementList = this.$refs.scrollItem;
      return Math.max(
        ...elementList.map((ele) => {
          // 注意，这里不能直接读取ele.style.left，这样只能读到终点位置的偏移量，而我们需要的是当前元素的实际位置，需要通过getComputedStyle来获取
          const styles = getComputedStyle(ele, null);
          return parseFloat(styles.left);
        })
      );
    },
    // 跳
    jump () {
      if(this.isGameStart) {
        if (this.isEnd) {
          console.log('游戏结束');
        } else if (!this.playerIsBottom) {
          console.log('游戏人物未下落');
        } else {
          this.playerIsBottom = false;
          this.$refs['player'].className = `player player-status-2`;
          this.timer1 = setTimeout(() => {
            this.$refs['player'].className = `player player-status-2-2`;
            clearTimeout(this.timer1);
            this.timer2 = setTimeout(() => {
              this.playerIsBottom = true;
              this.$refs['player'].className = `player player-status-1`;
              clearTimeout(this.timer2);
            }, 600);
          }, 600);
        }
      } else {
        this.gameStart();
      }
    },
    keyDown () {
      if (document.onkeydown) {
        // 缓存之前的键盘事件
        this.onkeydown = document.onkeydown;
      }
      document.onkeydown = (e) => {
        let e1 = e || window.event || arguments.callee.caller.arguments[0];
        if (e1 && e1.keyCode === 32) {
          this.jump();
        } else if (e1 && e1.keyCode === 38) {
          this.jump();
        } else if (e1?.keyCode === 65) {
          // 键盘A 模拟up
          let msg = {
            serviceResult: {
              msg: 1,
              type: '2001'
            }
          }
          this.handleMsgFromApp(msg)
        } else if (e1?.keyCode === 66) {
          // 键盘B 模拟enter
          let msg = {
            serviceResult: {
              msg: 4,
              type: '2001'
            }
          }
          this.handleMsgFromApp(msg)
        }
      };
    },
    isOverlap (objOne, objTwo) {
      let obj1top = objOne.getBoundingClientRect().top;
      let obj1left = objOne.getBoundingClientRect().left;
      let obj1width = objOne.getBoundingClientRect().width;
      let obj1height = objOne.getBoundingClientRect().height;
      let obj2top = objTwo.getBoundingClientRect().top;
      let obj2left = objTwo.getBoundingClientRect().left;
      let obj2width = objTwo.getBoundingClientRect().width;
      let obj2height = objTwo.getBoundingClientRect().height;
      let leftTopOver =
        obj1left >= obj2left &&
        obj1left <= obj2left + obj2width &&
        obj1top >= obj2top &&
        obj1top <= obj2top + obj2height;
      if (leftTopOver) {
        return true;
      }
      // 2右下在其他元素内
      let rightBottomOver =
        obj1left + obj1width >= obj2left &&
        obj1left + obj1width <= obj2left + obj2width &&
        obj1top + obj1height >= obj2top &&
        obj1top + obj1height <= obj2top + obj2height;
      if (rightBottomOver) {
        return true;
      }
      // 3右上在其他元素内
      let rightTopOver =
        obj1left + obj1width >= obj2left &&
        obj1left + obj1width <= obj2left + obj2width &&
        obj1top >= obj2top &&
        obj1top <= obj2top + obj2height;
      if (rightTopOver) {
        return true;
      }
      // 4左下在其他元素内
      let leftBottomOver =
        obj1left >= obj2left &&
        obj1left <= obj2left + obj2width &&
        obj1top + obj1height >= obj2top &&
        obj1top + obj1height <= obj2top + obj2height;
      if (leftBottomOver) {
        return true;
      }
      // 5十字交叉重叠
      let centerCenterOver =
        obj1left < obj2left &&
        obj1left + obj1width > obj2left + obj2width &&
        obj1top > obj2top &&
        obj1top + obj1height < obj2top + obj2height;
      if (centerCenterOver) {
        return true;
      }
      // 6覆盖重叠
      let containOver =
        obj1left > obj2left &&
        obj1left + obj1width < obj2left + obj2width &&
        obj1top > obj2top &&
        obj1top + obj1height < obj2top + obj2height;
      if (containOver) {
        return true;
      }
    }
  },
  beforeDestroy () {
    document.onkeydown = this.onkeydown;
    LonchJsApi.unBindMsgHandlers({
      netStatusChanged: this.onNetStatusChanged,
      appSendDataToH5: this.handleMsgFromApp
    });
  }
};
</script>

<style>
    @font-face {
        font-family: "fontnameRegular";
        src: url(../../accsets/images/disconnected-game/number.otf);
    }

    .player {
        width: 22px;
        height: 22px;
        position: absolute;
        z-index: 999;
        bottom: 35px;
        left: 100px;
        transition-property: bottom;
        transition-timing-function: linear;
        transition-duration: 0.6s;
        background: url(../../accsets/images/disconnected-game/player.png);
        background-repeat: no-repeat;
        background-size: cover;
    }

    /* 角色跑动 */
    .player-status-1 {
        bottom: 35px;
        transition-duration: 0.6s;
    }

    /* 角色跳起 */
    .player-status-2 {
        bottom: 117px;
        transition-duration: 0.6s;
    }

    .player-status-2-2 {
        bottom: 35px;
        transition-duration: 0.6s;
    }

    /* 角色死亡 */
    .player-status-3 {
        bottom: 35px;
        transition-duration: 0s;
    }

    .offline-page {
        z-index: 1;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #dadada;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .main {
        height: 200px;
        position: relative;
        overflow: hidden;
    }

    .scroll-container {
        margin: 0 40px;
        height: 100%;
        display: flex;
        flex-direction: row;
        position: relative;
        overflow: hidden;
        /* background: url(../../accsets/images/disconnected-game/background.png);
        background-position: left 163px;
        background-repeat: repeat-x; */
    }

    .scroll-item {
        display: flex;
        flex-shrink: 0;
        height: 100%;
        position: absolute;
        transition-property: left;
        transition-timing-function: linear;
        background: url("../../accsets/images/disconnected-game/item-background.png");
        background-position: left bottom;
        background-repeat: repeat-x;
    }

    .game-index {
        user-select: none;
        position: absolute;
        z-index: 1;
        right: 40px;
        top: 40px;
        display: flex;
        font-size: 12px;
    }

    .game-index-label {
        font-family: fontnameRegular;
        color: #666;
        margin-right: 10px;
    }

    .controller {
        user-select: none;
        z-index: 998;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn-2 {
        width: 100px;
        cursor: pointer;
    }

    .footer-box {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .footer-main {
        padding: 0 40px;
        flex: 1;
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        background: url(../../accsets/images/disconnected-game/text-3.png);
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: 100% auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-main-pc {
        display: none;
    }

    .footer-main-sptext {
        display: flex;
        align-items: flex-end;
        padding: 20px 0;
    }

    .footer-main-sptext-top {
        display: flex;
        align-items: flex-end;
        margin-bottom: 6px;
    }

    .footer-main-sptext-1 {
        font-size: 24px;
        font-weight: bold;
        font-style: italic;
        color: #666;
        margin-right: 5px;
    }

    .footer-main-sptext-2 {
        font-size: 16px;
        font-weight: bold;
        font-style: italic;
        color: #666;
        margin-left: 4px;
        margin-right: 14px;
    }

    .footer-main-sptext-3 {
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #222;
        margin-right: 15px;
    }

    .footer-text-tips {
        border-top: #fff 1px solid;
        border-bottom: #fff 1px solid;
        padding: 20px 0;
    }

    .footer-text-tips ul {
        margin-top: 10px;
    }

    .footer-text-tips ul li {
        list-style: square;
        margin-left: 30px;
        line-height: 24px;
    }

    .monster {
        display: block;
        position: absolute;
        bottom: 35px;
        /* background: rgba(251, 45, 77, 0.5); */
    }

    .monster-100 {
        left: 422px;
        width: 8px;
        height: 34px;
    }

    .monster-101 {
        left: 682px;
        width: 8px;
        height: 34px;
    }

    .monster-103 {
        left: 892px;
        width: 8px;
        height: 14px;
    }

    .monster-104 {
        left: 1068px;
        width: 57px;
        height: 16px;
    }

    .monster-105 {
        left: 1323px;
        width: 8px;
        height: 19px;
    }

    .monster-106 {
        left: 1574px;
        width: 8px;
        height: 26px;
    }

    .monster-107 {
        left: 1868px;
        width: 42px;
        height: 12px;
    }

    .monster-108 {
        left: 2114px;
        width: 8px;
        height: 12px;
    }

    .monster-109 {
        left: 2346px;
        width: 8px;
        height: 22px;
    }

    .monster-110 {
        left: 2635px;
        width: 8px;
        height: 18px;
    }

    @media screen and (min-width: 600px) {
        .player {
            width: 32px;
            height: 32px;
            left: 500px;
            bottom: 80px;
        }

        .player-status-0::after {
            content: '按空格键即可开始游戏';
            display: block;
            z-index: 1;
            position: absolute;
            left: 0;
            bottom: -50px;
            width: 400px;
            font-weight: bold;
            font-size: 30px;
        }

        /* 角色跑动 */
        .player-status-1 {
            bottom: 80px;
        }

        /* 角色跳起 */
        .player-status-2 {
            bottom: 227px;
        }

        .player-status-2-2 {
            bottom: 80px;
        }

        /* 角色死亡 */
        .player-status-3 {
            bottom: 80px;
        }

        .main {
            height: 480px;
        }

        .scroll-container {
            margin: 0;
        }

        .scroll-item {
            width: 8192px;
            background-image: url("../../accsets/images/disconnected-game/item-background-pc.png");
        }

        .game-index {
            font-size: 32px;
        }

        .btn-2 {
            width: 400px;
            cursor: pointer;
        }

        .footer-main {
            display: none;
        }

        .footer-main-pc {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            color: #888;
            background: url(../../accsets/images/disconnected-game/text-5.png);
            background-repeat: no-repeat;
            background-position: center bottom;
            background-size: 100% auto;
        }

        .footer-main-pc img {
            width: 60px;
            margin-right: 10px;
        }

        .monster {
            bottom: 80px;
        }

        .monster-100 {
            left: 2006px;
            width: 18px;
            height: 80px;
        }

        .monster-101 {
            left: 2730px;
            width: 18px;
            height: 80px;
        }

        .monster-103 {
            left: 3222px;
            width: 18px;
            height: 30px;
        }

        .monster-104 {
            left: 3792px;
            width: 150px;
            height: 40px;
        }

        .monster-105 {
            left: 4512px;
            width: 22px;
            height: 50px;
        }

        .monster-106 {
            left: 5100px;
            width: 22px;
            height: 60px;
        }

        .monster-107 {
            left: 5790px;
            width: 100px;
            height: 30px;
        }

        .monster-108 {
            left: 6362px;
            width: 30px;
            height: 30px;
        }

        .monster-109 {
            left: 6910px;
            width: 20px;
            height: 50px;
        }

        .monster-110 {
            left: 7583px;
            width: 20px;
            height: 40px;
        }
    }
</style>
