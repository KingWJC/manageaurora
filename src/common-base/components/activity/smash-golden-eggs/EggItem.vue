<template>
  <div class="sge-item"
       :class="{'sge-item--selected':isSelected}"
       @click="eggTaped"
       ref="sgeItem">
    <div class="sge-item-bg">
      <img src="./size-12-19.png">
    </div>
    <div class="sge-hammer sge-hammer-swing" ref="hammer">
      <img src="./hammer.png">
    </div>
    <div class="sge-item-content">
      <div class="sge-item-state">
        <div class="sge-item-prize flex flex-column flex-content-end">
          <img src="./lw-pic.png" ref="lotterPrizeImg">
        </div>
        <div class="sge-item-egg">
          <div class="sge-item-light" ref="prizeLight"></div>
          <img ref="eggImg">
        </div>
        <div class="sge-item-bed">
          <img src="./bed.png">
        </div>
      </div>
    </div>
    <audio ref="audio" src="./bang.mp3" preload="preload" type="audio/mp3"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import eggImg1 from './egg-state-1.png';
import eggImg2 from './egg-state-2.png';

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    // 奖品
    lotteryPrize: {
      type: Object,
      default () {
        return {};
      }
    },
    settings: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      state: 1,
      showLight: false,
      isWaitingLottery: false,
      config: {
        eggImg1: eggImg1,
        eggImg2: eggImg2
      },
      audio: null
    };
  },
  mounted () {
    //this.$on('start', this.start);
    this.$on('reset', this.initialize);
    this.$on('showLotteryAnimate', this.showLotteryAnimate);
    this.$on('updateLottery', this.updateLottery);
    this.initialize();
    this.audio = this.$refs.audio;
  },
  methods: {
    initialize () {
      this.utils.removeClass(this.$refs.sgeItem, 'sge-item--step2');
      this.$refs.eggImg.src = this.settings.eggImg1;
      this.$refs.prizeLight.style.display = 'none';
      this.$refs.lotterPrizeImg.style.display = 'none';
      this.$refs.hammer.style.display = '';
      this.utils.removeClass(this.$refs.hammer, 'sge-hammer-smash');
      this.utils.removeClass(this.$refs.lotterPrizeImg, 'prizeFadeIn');
    },
    eggTaped () {
      this.$emit('eggTaped', this.data, this.index);
    },
    updateLottery () {

    },
    //start () {
    //  this.state = 2;
    //  console.log('===start===', this.state);
    //},
    showLotteryAnimate () {
      let that = this;
      this.showSmashAnimate();
      setTimeout(function () {
        that.showEggAnimate();
        setTimeout(function () {
          that.showPrizeAnimate();
        }, 600);
      }, 2000);
    },
    // 展示砸蛋动作 2s
    showSmashAnimate () {
      let that = this;
      let hammer = this.$refs.hammer;
      this.utils.addClass(hammer, 'sge-hammer-smash');
      setTimeout(function () {
        that.audio.play();
      }, 1800);
      setTimeout(function () {
        hammer.style.display = 'none';
      }, 2000);
    },
    // 展示金蛋破裂效果
    showEggAnimate () {
      this.utils.addClass(this.$refs.sgeItem, 'sge-item--step2');
      this.$refs.eggImg.src = this.settings.eggImg2;
      this.$refs.prizeLight.style.display = 'block';
    },
    // 展示奖品动画
    showPrizeAnimate () {
      this.$refs.lotterPrizeImg.style.display = 'block';
      this.utils.addClass(this.$refs.lotterPrizeImg, 'prizeFadeIn');
      setTimeout(() => {
        this.showEndAnimate();
      }, 1500);
    },
    // 展示结束动画
    showEndAnimate () {
      this.$emit('animateEnd');
    }
  }
};
</script>

<style lang="scss" type="text/scss">
  .sge-item {
    width: 100%;
    text-align: center;
    position: relative;
    margin-top: 5px;
    &-bg {
      & > img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
    &-content {
      display: block;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        box-shadow: 0 0 5rem 4rem rgba(0, 0, 0, .5);
        z-index: 100;
      }
      /*opacity: .6;*/
    }
    .sge-item-egg, .sge-item-bed {
      position: relative;
      z-index: 2;
      & > img {
        display: inline-block;
        width: 75%;
        height: auto;
        position: relative;
        z-index: 1;
        transition: width 1s;

      }
    }
    &-prize {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 60%;
      bottom: 40%;
      padding: 0 5px;
      left: 0;
      & > img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
    &-light {
      position: absolute;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      bottom: 15%;
      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 22%;
        width: 90%;
        height: 85%;
        left: 5%;
        transform: perspective(14px) rotateX(358deg);
        transform-origin: bottom;
        /*background-color: #fbf893;*/
        background: linear-gradient(rgba(251,248,147, .01), rgba(251,248,147, .8));
      }
    }
    & .sge-item-bed {
      position: relative;
      z-index: 1;
      margin-top: -13%;
    }
    &--selected {
      .sge-item-content {
        &:after {
          content: none;
        }
      }
      margin-top: 0;
      .sge-hammer {
        display: block;
      }
      .sge-item-egg, .sge-item-bed {
        & > img {
          transition: width 1s;
          width: 100%;
        }
      }
      .sge-item-egg:after {
        content: '';
        display: block;
        position: absolute;
        top: 8%;
        right: 18%;
        bottom: 7%;
        left: 18%;
        background: repeating-linear-gradient(90deg, transparent 0, transparent 15%, rgba(0, 0, 20, 0.1) 15%, rgba(0, 0, 20, 0.1) 20%);
        mix-blend-mode: multiply;
        border-radius: 100% 100% 100% 100%;
        z-index: 0;
        box-shadow: inset -14px 0 2px 3px rgb(0 0 0 / 10%);
        animation: goldenlight 4000ms ease infinite;
      }
    }
    &--step2 {
      .sge-item-egg:after {
        content: none;
      }
    }
  }

  .sge-hammer {
    position: absolute;
    display: none;
    width: 30%;
    z-index: 100;
    right: 0;
    top: 0;
    & img {
      width: 100%;
      display: block;
      height: auto;
    }
  }

  .sge-hammer-swing {
    transform-origin: 100% 100%;
    animation: swing 2000ms ease infinite;
  }

  .sge-hammer-smash {
    transform-origin: 100% 100%;
    animation: smash 2000ms ease;
  }

  .sag-item--state-2 {
    .sge-hammer {
      display: none;
    }
  }

  .prizeFadeIn {
    transform-origin: 50% 100%;
    animation: fadeIn 1500ms ease;
  }

  @keyframes swing {
    0%, 100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-10deg);
    }
  }

  @keyframes smash {
    0%, 100% {
      transform: rotate(0deg);
    }
    85% {
      transform: rotate(45deg);
    }
    100% {
      transform: rotate(-45deg);
    }
  }

  @keyframes goldenlight {
    0%, 100% {
      background: #fefa01;
      box-shadow: 0 0 10px #fefa01, inset -4px 0 0 8px rgb(14 10 10 / 10%);
    }
    30%, 70% {
      background: #fffd99;
      box-shadow: -10px 0 60px 14px #fefa01, inset -3px 0 0 8px rgb(14 10 10 / 10%);
    }
    50% {
      box-shadow: -10px 0 60px 14px rgb(254 250 1 / 80%), inset -3px 0 0 8px rgb(14 10 10 / 10%);
    }
  }

  @keyframes fadeIn {
    0% {
      transform: scale(0, 0);
      opacity: 0;
    }
    100% {
      transform: scale(1, 1);
      opacity: 1;
    }
  }
</style>
