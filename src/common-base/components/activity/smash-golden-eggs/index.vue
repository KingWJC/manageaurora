<template>
  <div class="sge">
    <!--<div class="sge-tile tac">-->
      <!--<span>选择一颗您要砸的蛋</span>-->
    <!--</div>-->
    <div class="sge-stage">
      <!--<div class="loading-stage">加载效果</div>-->
      <div class="sge-bg">
        <div class="sge-bg-triangle sge-bg-triangle-1"></div>
        <div class="sge-bg-triangle sge-bg-triangle-2"></div>
        <div class="sge-bg-triangle sge-bg-triangle-3"></div>
        <div class="sge-bg-triangle sge-bg-triangle-4"></div>
        <div class="sge-bg-triangle sge-bg-triangle-5"></div>
        <div class="sge-bg-triangle sge-bg-triangle-6"></div>
        <div class="sge-bg-triangle sge-bg-triangle-7"></div>
        <div class="sge-bg-triangle sge-bg-triangle-8"></div>
        <div class="sge-bg-triangle sge-bg-triangle-9"></div>
        <div class="sge-bg-triangle sge-bg-triangle-10"></div>
        <div class="sge-bg-triangle sge-bg-triangle-11"></div>
        <div class="sge-bg-triangle sge-bg-triangle-12"></div>
        <div class="sge-bg-triangle sge-bg-triangle-13"></div>
        <div class="sge-bg-triangle sge-bg-triangle-14"></div>
        <div class="sge-bg-triangle sge-bg-triangle-15"></div>
        <div class="sge-bg-triangle sge-bg-triangle-16"></div>
        <div class="sge-bg-triangle sge-bg-triangle-17"></div>
        <div class="sge-bg-triangle sge-bg-triangle-18"></div>
        <div class="sge-bg-triangle sge-bg-triangle-19"></div>
        <div class="sge-bg-triangle sge-bg-triangle-20"></div>
        <div class="sge-bg-triangle sge-bg-triangle-21"></div>
        <div class="sge-bg-triangle sge-bg-triangle-22"></div>
        <div class="sge-bg-triangle sge-bg-triangle-23"></div>
        <div class="sge-bg-triangle sge-bg-triangle-24"></div>
        <div class="sge-bg-triangle sge-bg-triangle-25"></div>
        <div class="sge-bg-triangle sge-bg-triangle-26"></div>
        <div class="sge-bg-triangle sge-bg-triangle-27"></div>
        <div class="sge-bg-triangle sge-bg-triangle-28"></div>
        <div class="sge-bg-triangle sge-bg-triangle-29"></div>
        <div class="sge-bg-triangle sge-bg-triangle-30"></div>
        <div class="sge-bg-triangle sge-bg-triangle-31"></div>
        <div class="sge-bg-triangle sge-bg-triangle-32"></div>
        <div class="sge-bg-triangle sge-bg-triangle-33"></div>
        <div class="sge-bg-triangle sge-bg-triangle-34"></div>
        <div class="sge-bg-triangle sge-bg-triangle-35"></div>
        <div class="sge-bg-triangle sge-bg-triangle-36"></div>
      </div>
      <div class="lc-row">
        <div v-for="(item, index) in eggs" :key="item.id" :class="colClass">
          <egg-item
            class="sge-egg-item"
            :data="item"
            :lotteryPrize="lotteryPrize"
            :index="index"
            :isSelected="currentIndex===index"
            :isLoading="isLoading"
            :settings="settings"
            @eggTaped="eggTaped"
            @animateEnd="endLottery"
            :ref="'eggItem-'+index">
          </egg-item>
        </div>
      </div>
      <div class="sge-mask flex flex-column flex-content-end" v-if="isShowMask">
        <div class="tac pb20">
          <button class="btn" @click="resetStage">再来一次</button>
        </div>
      </div>
      <div class="lottery-times tac" v-if="!isNoLimitLottery">
        您还有 <span class="b">{{lotteryTimes}}</span> 次砸蛋机会
      </div>
    </div>
  </div>
</template>

<script>
import EggItem from './EggItem';
import eggImg1 from './egg-state-1.png';
import eggImg2 from './egg-state-2.png';

export default {
  name: '',
  components: {
    EggItem
  },
  props: {
    // 是否自动抽奖
    isAutoLottery: {
      type: Boolean,
      default: false
    },
    // 是否无限次数抽奖，为true时，不根据lotteryTimes限制
    isNoLimitLottery: {
      type: Boolean,
      default: false
    },
    // 剩余抽奖次数
    lotteryTimes: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      eggs: [{id: '1', state: 1}],
      //currentId: '2',
      defaultSelectIndex: 0, // 默认选中的金蛋
      currentIndex: 0,
      colClass: 'lc-col-12',
      isShowMask: false,
      audio: null,
      isLoading: true,
      isInLottry: false, // 是否正在抽奖
      lotteryPrize: {}, // 抽奖奖品
      settings: {
        eggImg1,
        eggImg2
      }
    };
  },
  mounted () {
    this.$on('updateLotteryResult', this.updateLotteryResult);
  },
  methods: {
    loadingStage () {

    },
    // 重置场景
    resetStage () {
      this.$refs['eggItem-' + this.currentIndex][0].$emit('reset');
      this.currentIndex = this.defaultSelectIndex;
      this.lotteryPrize = {};
      this.isShowMask = false;
      this.isInLottry = false;
    },
    // 开始抽奖
    lottery () {
      this.isInLottry = true;
      this.$emit('startLottery'); // 通知使用者发起抽奖接口
      this.showLotteryAnimate();
      this.lotteryTimes = this.lotteryTimes - 1;
    },
    // 展示抽奖动画效果
    showLotteryAnimate () {
      let currentEggItem = this.$refs['eggItem-' + this.currentIndex][0];
      currentEggItem.$emit('showLotteryAnimate');
    },
    // 展示结束动画
    showEndAnimate () {
      this.isShowMask = true;
    },
    // 开始抽奖流程
    startLottery () {
      if (this.isNoLimitLottery || this.lotteryTimes > 0) {
        this.lottery();
      } else {
        this.$toast({text: '您暂无砸蛋机会！'});
      }
    },
    // 抽奖动画结束
    endLottery () {
      this.showEndAnimate();
      this.$emit('enLottery'); // 通知使用者发起抽奖接口
    },
    // 展示抽奖结果
    updateLotteryResult (result) {
      this.lotteryPrize = result;
    },
    // 播放敲击声音
    //playAudio () {
    //  this.audio.play();
    //},
    // 敲击金蛋
    eggTaped (data, index) {
      if (this.isInLottry) {
        return;
      }
      if (this.currentIndex === index) {
        let currentEggItem = this.$refs['eggItem-' + this.currentIndex][0];
        if (currentEggItem) {
          this.startLottery();
        }
      } else {
        this.resetStage();
        this.currentIndex = index;
      }
    }
  }
};
</script>

<style type="text/scss" lang="scss">
  .sge {
    position: relative;
    z-index: 1;
    &-mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, .1);
      z-index: 100;
    }
    &-bg {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /*background: #1A1A1A;*/
      opacity: .05;
      transition-property: transform;
      transition-duration: 0s;
      animation: rotating 36s linear infinite;
      &-triangle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 30px 600px 30px;
        border-color: transparent transparent #fff transparent;
        transform-origin: 30px 0;
        z-index: 2;
        &-1 {
          transform: rotate(-10deg);
        }
        &-2 {
          transform: rotate(-20deg);
        }
        &-3 {
          transform: rotate(-30deg);
        }
        &-4 {
          transform: rotate(-40deg);
        }
        &-5 {
          transform: rotate(-50deg);
        }
        &-6 {
          transform: rotate(-60deg);
        }
        &-7 {
          transform: rotate(-70deg);
        }
        &-8 {
          transform: rotate(-80deg);
        }
        &-9 {
          transform: rotate(-90deg);
        }
        &-10 {
          transform: rotate(-100deg);
        }
        &-11 {
          transform: rotate(-110deg);
        }
        &-12 {
          transform: rotate(-120deg);
        }
        &-13 {
          transform: rotate(-130deg);
        }
        &-14 {
          transform: rotate(-140deg);
        }
        &-15 {
          transform: rotate(-150deg);
        }
        &-16 {
          transform: rotate(-160deg);
        }
        &-17 {
          transform: rotate(-170deg);
        }
        &-18 {
          transform: rotate(-180deg);
        }
        &-19 {
          transform: rotate(-190deg);
        }
        &-20 {
          transform: rotate(-200deg);
        }
        &-21 {
          transform: rotate(-210deg);
        }
        &-22 {
          transform: rotate(-220deg);
        }
        &-23 {
          transform: rotate(-230deg);
        }
        &-24 {
          transform: rotate(-240deg);
        }
        &-25 {
          transform: rotate(-250deg);
        }
        &-26 {
          transform: rotate(-260deg);
        }
        &-27 {
          transform: rotate(-270deg);
        }
        &-28 {
          transform: rotate(-280deg);
        }
        &-29 {
          transform: rotate(-290deg);
        }
        &-30 {
          transform: rotate(-300deg);
        }
        &-31 {
          transform: rotate(-310deg);
        }
        &-32 {
          transform: rotate(-320deg);
        }
        &-33 {
          transform: rotate(-330deg);
        }
        &-34 {
          transform: rotate(-340deg);
        }
        &-35 {
          transform: rotate(-350deg);
        }
        &-36 {
          transform: rotate(-360deg);
        }
      }
    }
  }

  .sge-stage {
    position: relative;
    padding: 50px 20px;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(35deg, orange, purple);
    & .lottery-times {
      position: absolute;
      left: 0;
      bottom: 15px;
      width: 100%;
      color: white;
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(360deg)
    }
  }
</style>
