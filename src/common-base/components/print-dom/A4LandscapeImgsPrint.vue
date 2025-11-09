<template>
  <div class="print-view" style="display: none;">
    <div ref="printTemplate">
      <a4-img-print-template
        v-for="item in datas"
        :img-url="item"
        :key="item"
        @loaded="onImgLoad">
      </a4-img-print-template>
    </div>
  </div>
</template>

<script>
import PrintDom from '@/common-base/mixins/print-dom';
import A4ImgPrintTemplate from './A4LandscapeImgPrintTemplate';

export default {
  name: 'A4LandscapeImgsPrint',
  mixins: [PrintDom],
  components: {A4ImgPrintTemplate},
  props: {
    permissions: {
      type: Object,
      default () {
        return {
          codes: {},
          names: {}
        };
      }
    },
    datas: {
      type: Array,
      data () {
        return [];
      }
    }
  },
  data () {
    return {
      loadedCount: 0,
      isLoadDone: false,
      isStartPrint: false
    };
  },
  created () {
    this.$on('print', this.startPrint);
  },
  methods: {
    printPage () {
      let that = this;
      if (this.isLoadDone && this.isStartPrint) {
        that.$nextTick(() => {
          that.printDom(this.$refs.printTemplate, function (result) {
            that.$emit('print-done', result);
          }, {
            size: 'A4 landscape',
            margin: '0'
          });
        });
      }
    },
    startPrint () {
      this.isStartPrint = true;
      this.printPage();
    },
    onImgLoad () {
      this.loadedCount = this.loadedCount + 1;
      if (this.loadedCount >= this.datas.length) {
        this.isLoadDone = true;
        this.printPage();
      }
    }
  }
};
</script>
