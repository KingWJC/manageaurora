<template>
  <div class="sf-portait-76130">
    <div class="sf-print-box">
      <!--   主运单区   -->
      <div class="sf-logo"></div>
      <div class="sf-bar-code-content">
        <div class="sf-order-state flex">
          <div>第1次打印</div>
          <div class="ml10">打印时间{{waybillData.timestamp | formatDate('yyyy年MM月dd日 hh时mm分')}}</div>
        </div>
        <div class="sf-bar-code flex flex-content-between flex-items-start">
          <div class="sf-order-code flex-flex-auto">
            <div class="tac bar-code-img-box">
              <bar-code :code="waybillNoInfo.waybillNo" :width="220" :height="42"></bar-code>
            </div>
            <div>
              <div class="sf-sub-order flex flex-content-around">
                <div class="flex flex-column flex-content-center">
                  <span class="sf-order-quantity">{{waybillNoInfo.waybillType == 3 ? '1' :currentIndex+1}}/{{waybillNoInfo.waybillType == 3 ? '1' : waybillCount}}</span>
                </div>
                <div>
                  <template v-if="waybillNoInfo.waybillType == 1">
                    <p>母单号</p>
                  </template>
                  <template v-else-if="waybillNoInfo.waybillType == 3">
                    <p>运单号</p>
                  </template>
                  <template v-else>
                    <p>子单号</p>
                    <p>母单号</p>
                  </template>
                </div>
                <div>
                  <template v-if="waybillNoInfo.waybillType == 1">
                    <p>{{waybillNoInfo.waybillNo}}</p>
                  </template>
                  <template v-else-if="waybillNoInfo.waybillType == 3">
                    <p>{{waybillNoInfo.waybillNo}}</p>
                  </template>
                  <template v-else>
                    <p>{{waybillNoInfo.waybillNo}}</p>
                    <p>{{masterWaybillData.waybillNo}}</p>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="sf-time flex-flex-none">
            <img src="./sf-icons/time/T1-20.png" v-if="routeLabelData.proCode=='T1'">
            <img src="./sf-icons/time/T4-20.png" v-else-if="routeLabelData.proCode=='T4'">
            <img src="./sf-icons/time/T6-20.png" v-else-if="routeLabelData.proCode=='T6'">
            <img src="./sf-icons/time/T8-20.png" v-else-if="routeLabelData.proCode=='T8'">
            <img src="./sf-icons/time/waybill-T29.png" v-else-if="routeLabelData.proCode=='T29'">
            <img src="./sf-icons/time/waybill-26.png" v-else-if="routeLabelData.proCode=='T26'">
            <img src="./sf-icons/time/waybill_T5-20.png" v-else>
          </div>
        </div>
      </div>
      <div class="sf-main-waybill">
        <div class="sf-row">
          <div class="sf-col sf-to">
            <div class="flex flex-content-between flex-items-center">
              <div class="sf-route-label">
                <span>{{routeLabelData.destRouteLabel}}</span>
              </div>
              <div class="sf-package-type">
                {{routeLabelData.proName}}
              </div>
            </div>
            <div class="sf-addr-content flex flex-content-start">
              <div
                class="sf-icon-content flex-flex-none flex flex-column flex-content-center">
                <i class="sf-icon-shou"></i>
              </div>
              <div class="sf-addr flex-flex-auto ml5" v-if="waybillNoInfo.waybillType==3">
                <div class="flex flex-content-start">
                  <span>{{contactFromInfo.contact}}</span>
                  <span class="ml10">{{contactFromInfo.mobile|formatPhoneNumber}}</span>
                  <span class="ml10" v-if="contactFromInfo.tel">{{contactFromInfo.tel}}</span>
                </div>
                <div>
                  {{contactFromInfo.province}}{{contactFromInfo.city}}{{contactFromInfo.county}}{{contactFromInfo.address}}
                </div>
              </div>
              <div class="sf-addr flex-flex-auto ml5" v-else>
                <div class="flex flex-content-start">
                  <span>{{contactToInfo.contact}}</span>
                  <span class="ml10">{{contactToInfo.mobile|formatPhoneNumber}}</span>
                  <span class="ml10" v-if="contactToInfo.tel">{{contactToInfo.tel}}</span>
                </div>
                <div>
                  {{contactToInfo.province}}{{contactToInfo.city}}{{contactToInfo.county}}{{contactToInfo.address}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sf-row sf-waybill-content flex flex-content-start">
          <div class="p5 sf-col flex-flex-auto flex flex-column flex-content-around">
            <p>付款方式：寄付月结</p>
            <p>月结账号：{{waybillData.logcOrderWaybillPmMain.monthlyCard}}</p>
            <div class="flex flex-content-between">
              <span>实际重量：{{waybillNoInfo.waybillType==3?'':waybillData.logcOrderWaybillPmMain.totalWeight + 'kg'}}</span>
              <span>件数：{{waybillNoInfo.waybillType==3?'':waybillData.logcOrderWaybillPmMain.parcelQty}}</span>
            </div>
            <div class="flex flex-content-between">
              <div>
                增值服务：{{waybillNoInfo.waybillType==3?'':waybillData.logcOrderWaybillPmMain.isSpecialWarehouseService?'是':'-'}}
              </div>
              <div>是否保价：{{waybillNoInfo.waybillType==3 ? '' : '是'}}</div>
            </div>
          </div>
          <div class="sf-col flex-flex-none" style="padding: 1px;">
            <qr-code :qtext="replaceK5(routeLabelData.twoDimensionCode, waybillNoInfo.waybillNo)" is-show-img size="75"></qr-code>
          </div>
          <!--<div class="sf-col flex flex-column flex-content-center tac" style="width: 22px;">-->
          <!--<span>已验视</span>-->
          <!--</div>-->
        </div>
        <div class="sf-from sf-row">
          <div class="sf-col sf-addr-content flex flex-content-start">
            <div class="sf-icon-content flex-flex-none flex flex-column flex-content-center">
              <i class="sf-icon-ji"></i>
            </div>
            <div class="sf-addr flex-flex-auto ml5" v-if="waybillNoInfo.waybillType==3">
              <div class="flex flex-content-start">
                <span>{{contactToInfo.contact}}</span>
                <span class="ml10">{{contactToInfo.mobile|formatPhoneNumber}}</span>
                <span class="ml10" v-if="contactToInfo.tel">{{contactToInfo.tel}}</span>
              </div>
              <div>
                {{contactToInfo.province}}{{contactToInfo.city}}{{contactToInfo.county}}{{contactToInfo.address}}
              </div>
            </div>
            <div class="sf-addr flex-flex-auto ml5" v-else>
              <div class="flex flex-content-start">
                <span>{{contactFromInfo.contact}}</span>
                <span class="ml10">{{contactFromInfo.mobile|formatPhoneNumber}}</span>
                <span class="ml10" v-if="contactFromInfo.tel">{{contactFromInfo.tel}}</span>
              </div>
              <div>
                {{contactFromInfo.province}}{{contactFromInfo.city}}{{contactFromInfo.county}}{{contactFromInfo.address}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--   附加联区   -->
      <div class="sf-additional sf-row flex flex-content-start">
        <div class="sf-info sf-col" style="width: 50%;min-height: 42px;">
          <p>寄托物：{{waybillNoInfo.waybillType==3?'':templateConfig.defaultSustenance||''}}</p>
        </div>
        <div class="sf-info sf-col flex flex-column flex-content-between" style="width: 50%;">
          <div>签名：</div>
          <div>
            <p class="tar"><span>年</span><span class="ml20">月</span><span class="ml20">日</span></p>
          </div>
        </div>
      </div>
      <div class="sf-additional sf-row">
        <div class="sf-remark sf-col" style="min-height: 60px;">
          <p>备注:{{waybillData.logcOrderWaybillPmMain.remark}}</p>
          <p>签收提醒:{{templateConfig.signInReminder}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarCode from '../../bar-code/index';
import QrCode from '../../qr-code/index';

export default {
  name: 'SfPrintTemplate130_76',
  components: {
    BarCode,
    QrCode
  },
  props: {
    waybillNoInfo: {
      type: Object,
      default () {
        return {};
      }
    },
    waybillData: {
      type: Object,
      default () {
        return {};
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    templateConfig:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  data () {
    return {
      isLoaded: false,
      direction: 'vertical', // vertical 垂直, horizontal 水平,
      codeUrl: '',
      masterWaybillData: {}, // 母单信息
      contactToInfo: {}, // 到件方信息
      contactFromInfo: {}, // 寄方信息
      routeLabelData: {}, // 路由标签数据详细数据
      waybillCount: 0 // 单数
    };
  },
  created () {
    this.init();
  },
  filters: {
    formatPhoneNumber (n) {
      if (n && n.length > 7) {
        return (n + '').replace(/(\d{3})\d{4}(\d)/, '$1****$2');
      }
      return n;
    }
  },
  methods: {
    init () {
      switch (this.waybillNoInfo.waybillType) {
        case 1 :
          // 母单
          this.masterWaybillData = this.waybillNoInfo;
          this.routeLabelData = this.getRouteLableData(this.waybillNoInfo.waybillNo);
          break;
        case 3 :
          // 签回单
          this.masterWaybillData = this.getMasterWaybillData();
          this.routeLabelData = this.getRouteLableData(this.waybillNoInfo.waybillNo);

          break;
        default:
          this.masterWaybillData = this.getMasterWaybillData();
          this.routeLabelData = this.getRouteLableData(this.masterWaybillData.waybillNo);
      }
      this.contactToInfo = this.getContactInfoByType(2);
      this.contactFromInfo = this.getContactInfoByType(1);
      this.waybillCount = this.getWaybillCount();
    },
    getWaybillCount () {
      let count = 0;
      for (let item of this.waybillData.logcOrderWaybillNoInfoList) {
        if (item.waybillType !== 3) {
          count++;
        }
      }
      return count;
    },
    getContactInfoByType (contactType) {
      for (let item of this.waybillData.pmContactInfoList) {
        if (item.contactType === contactType) {
          return item;
        }
      }
      return {};
    },
    getMasterWaybillData () {
      for (let item of this.waybillData.logcOrderWaybillNoInfoList) {
        if (item.waybillType === 1) {
          return item;
        }
      }
      return {};
    },
    getRouteLableData (waybillNo) {
      for (let item of this.waybillData.routeLabelDataList) {
        if (item.waybillNo === waybillNo) {
          return item;
        }
      }
      return {};
    },
    codeUrlCreated (url) {
      this.codeUrl = url;
    },
    handlerImgLoad () {
      this.isLoaded = true;
      let img = this.$refs.img;
      let imgBox = this.$refs.imgBox;
      let imgWidth = img.clientWidth;
      let imgHeight = img.clientHeight;
      // console.log('img is loading!', img.clientWidth, img.clientHeight)
      if (imgWidth > imgHeight) {
        this.direction = 'horizontal';
      } else {
        imgBox.style = 'transform: rotate(-90deg);transform-origin: 0 0;top: 100%;';
      }
    },
    // 正则将子运单的二维码替换为子运单的顺丰单号
    replaceK5(str, newVal) {
      try {
        if(str && newVal) {
          const reg = /(MMM=(.+)k5':')(\w+)/;
          return str.replace(reg, `$1${newVal}`);
        } else {
          return str
        }
      } catch (e) {
        return str
      }
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
  .w1of2 {
    width: 50%;
  }

  .w1of4 {
    width: 25%;
  }

  .sf-portait-76130 {
    font-family: "heiti", '黑体', "宋体", 'SimSun', Arial;
    width: 287.9143307086613px;
    height: 494.00px;
    position: relative;
    font-size: 14px;
    background-color: #FFFFFF;
    overflow: hidden;
    .sf-print-box {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 6px;
      display: block;
      overflow: hidden;
      text-align: left;
      font-size: 0.8571428571428571rem;
      .sf-logo {
        height: 22px;
      }
      .sf-package-type {
        font-size: 1.5rem;
        font-weight: bold;
        padding: 2px;
      }
      .sf-bar-code-content {
        padding-bottom: 5px;
        .sf-order-state {
          padding-left: 6px;
          font-size: 0.7142857142857143rem;
          color: #000000;
        }
        .bar-code-img-box {
          padding: 5px 0;
        }
        .sf-time {
          padding: 6px;
          width: 48px;
          height: 48px;
          img {
            display: block;
            width: auto;
            height: 100%;
          }
        }
      }

      & .sf-main-waybill {
        font-family: "heiti", '黑体', "宋体", "Songti TC", "Songti SC", SimSun, 'Arial';
        .sf-from,
        .sf-to {
          .sf-route-label {
            font-size: 2rem;
            font-weight: bold;
          }
          .sf-addr-content {
            color: #000000;
            .sf-addr {
              line-height: 1.25;
            }
          }
        }
      }
    }
    .sf-row {
      border-bottom: solid 1px #000000;

      &:first-child {
        border-top: solid 1px #000000;
      }

      .sf-col {
        padding: 3px;
        border-right: solid 1px #000000;
      }

      .sf-col:first-child {
        border-left: solid 1px #000000;
      }
    }
    .sf-info {
      line-height: 1.25;
    }
    .sf-remark {
      line-height: 1.25;
      font-size: 0.75rem;
    }
    .sf-icon {
      display: inline-block;
      font-style: normal;
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      &-shou {
        @extend .sf-icon;
        width: 26px;
        height: 26px;
        line-height: 1.25;
        border-radius: 100%;
        border: solid 1px #000000;
        &:before {
          content: '收';
          color: #000000;
          font-family: "heiti", '黑体', "宋体";
          font-size: 16px;
          display: block;
          text-align: center;
        }
      }
      &-ji {
        @extend .sf-icon;
        width: 26px;
        height: 26px;
        line-height: 1.25;
        border-radius: 100%;
        border: solid 1px #000000;
        &:before {
          content: '寄';
          color: #000000;
          font-family: "heiti", '黑体', "宋体";
          font-size: 16px;
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
