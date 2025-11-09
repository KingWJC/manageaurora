<template>
  <div class="print-view" style="display: none;">
    <div ref="printTemplate">
      <template v-for="(item, index) in waybillData.logcOrderWaybillNoInfoList">
        <sf-print-template100150
          v-if="paperCode==='100150'"
          :key="item.id"
          :waybill-no-info="item"
          :waybill-data="waybillData"
          :current-index="index"
          :template-config="templateConfig">
        </sf-print-template100150>
        <sf-print-template76130
          v-if="paperCode==='76130'"
          :key="item.id"
          :waybill-no-info="item"
          :waybill-data="waybillData"
          :template-config="templateConfig"
          :current-index="index">
        </sf-print-template76130>
      </template>
    </div>
  </div>
</template>

<script>
import PrintDom from '../../mixins/print-dom';
import SfPrintTemplate100150 from './sf-express-templates/SfPrintTemplate100150';
import SfPrintTemplate76130 from './sf-express-templates/SfPrintTemplate76130';

export default {
  name: 'CommonSfPrint',
  mixins: [PrintDom],
  components: {SfPrintTemplate100150, SfPrintTemplate76130},
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
    waybillData: {
      type: Object,
      default () {
        return {};
      }
    },
    paperCode: {
      type: String,
      default: '100150'
    },
    templateConfig: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {};
  },
  created () {
    this.$on('print', this.printPage);
  },
  methods: {
    printPage () {
      setTimeout(() => {
        this.printDom(this.$refs.printTemplate, function (result) {
          this.$emit('print-done', result);
        }, {
          size: '4in 6in portrait',
          margin: '0'
        });
      }, 1000);
    }
  }
};
</script>
