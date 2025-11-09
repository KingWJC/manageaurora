<template>
  <div class="sf-portait-210">
    <div class="sf-print-box-210">
      <!--   主运单区   -->
      <div class="sf-main-waybill">
        <div class="sf-logo"></div>
        <div class="sf-order-state flex flex-content-around">
          <span>00856602</span>
          <span>DF</span>
          <span>第1次打印</span>
          <span>打印时间9月27日 14：00</span>
        </div>
        <div class="sf-bar-code flex flex-content-between flex-items-start">
          <div class="sf-order-code flex-flex-auto">
            <div class="tac p5">
              <bar-code :code="'SF8888888888888'" :width="240" :height="48"></bar-code>
            </div>
            <div>
              <div class="sf-sub-order flex flex-content-around">
                <span class="sf-order-quantity">1/1</span>
                <span class="sf-order-type">子单号</span>
                <span class="sf-order-number">SF 888 888 888 8888</span>
              </div>
              <div class="sf-master-order flex flex-content-around">
                <span class="sf-order-quantity">1/1</span>
                <span class="sf-order-type">母单号</span>
                <span class="sf-order-number">SF 888 888 888 8888</span>
              </div>
            </div>
          </div>
          <div class="sf-time flex-flex-none">
            <img src="./sf-icons/time/T1-20.png">
          </div>
        </div>
      </div>
      <!--   附加联区   -->
      <div class="sf-additional"></div>
      <!--   存根区   -->
      <div class="sf-stub">

      </div>
    </div>
  </div>
</template>

<script>
  import './sf-portait.scss'
  import PrintDom from "@/common-base/mixins/print-dom";
  import BarCode from "../../common/bar-code/index";

  export default {
    name: "SfPrintTemplate210",
    components: {BarCode},
    mixins: [PrintDom],
    props: {
      imgUrl: {
        type: String
      },
    },
    data() {
      return {
        isLoaded: false,
        direction: 'vertical' // vertical 垂直, horizontal 水平
      }
    },
    methods: {
      handlerImgLoad() {
        this.isLoaded = true
        let img = this.$refs.img
        let imgBox = this.$refs.imgBox
        let imgWidth = img.clientWidth
        let imgHeight = img.clientHeight
        console.log('img is loading!', img.clientWidth, img.clientHeight)
        if (imgWidth > imgHeight) {
          this.direction = 'horizontal'
        } else {
          imgBox.style = 'transform: rotate(-90deg);transform-origin: 0 0;top: 100%;'
        }
      },
      printPage() {
        setTimeout(() => {
          this.printDom(this.$refs.printTemplate, function (result) {
            this.$emit('print-done', result)
          })
        }, 1000)
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .sf-print-box-210 {
    position: relative;
    padding: 5px;
    width: 362.8346456692913px;
    height: 705.9055118110236px;
    border: solid 1px #000000;
    display: block;
    overflow: hidden;
    text-align: left;

    & .sf-main-waybill {
      & .sf-logo {
        height: 40px;
      }

      & .sf-order-state {
        font-family: "宋体", "Songti TC", "Songti SC", SimSun;
        padding-left: 6px;
        padding-right: 80px;
        font-size: 10px;
        color: #000000;
      }

      & .sf-time {
        padding: 6px;
        width: 75.59055118110236px;
        height: 75.59055118110236px;

        img {
          display: block;
          width: auto;
          height: 100%;
        }
      }

      & .sf-order-code {
        /*padding:8px 20px;*/
      }

      & .sf-sub-order,
      & .sf-master-order {
        font-family: 'heiti';
        font-size: 9pt;
      }

      & .sf-order-number {
        font-family: 'heiti';
      }
    }


  }

</style>
