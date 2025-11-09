/*
 * @Date: 2024-01-19 10:14:15
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-06-05 11:31:47
 * @FilePath: \lonch-rxv-fe\src\common-base\mixins\print-dom.js
 * @Description: 
 */
import '../../assets/print-dom.css';

export default {
  data () {
    return {
      printWrapper: ''
    };
  },
  mounted () {
    this.initPrint();
  },
  methods: {
    initPrint () {
      let wrapper = document.getElementsByClassName('print-wrapper');
      let printWrapper;
      if (wrapper.length > 0) {
        printWrapper = wrapper[0];
      } else {
        printWrapper = document.createElement('div');
        printWrapper.className = 'print-wrapper';
      }
      this.printWrapper = printWrapper;
      document.body.insertBefore(this.printWrapper, document.body.firstChild);
    },
    // 初始化组件权限
    printDom (el, callback, page = {}) {
      let style = document.createElement('style');
      let cssText = [];
      style.type = 'text/css';
      style.media = 'print';
      if (page && page.size) {
        cssText.push('@page{size:' + page.size + ';}');
      }
      if (page && page.margin) {
        cssText.push('@page{margin:' + page.margin + ';}');
      }
      if (page && page.left) {
        cssText.push('@page:left{margin-left:' + page.left + ';}');
      }
      if (page && page.right) {
        cssText.push('@page:right{margin-right:' + page.right + ';}');
      }
      let pagecss = document.createTextNode(cssText.join(' '));
      style.appendChild(pagecss);
      document.head.appendChild(style);
      this.printWrapper.innerHTML = '';
      let printResult;
      let copy = el.cloneNode(true);
      this.printWrapper.appendChild(copy);
      this.$nextTick(() => {
        /*
        只在ios、mac、android才调打印协议
        windows直接用window.print就能打印
        */
        if (
          LonchJsApi.isInIosApp()
          || LonchJsApi.isInIosAppV2()
          || LonchJsApi.isInMacApp()
          || LonchJsApi.isInMacAppV2()
          || LonchJsApi.isInAndroidApp()
          || LonchJsApi.isInAndroidAppV2()
        ) {
          LonchJsApi.callApp({'command': 'cmdAppPrintDom', args:{
            dom:copy,
            style: style,
            printerSize: page.size || '',
            orientation: page.orientation || ''
          }});
        } else if(LonchJsApi.isInSimpleApp() && !LonchJsApi.isInSimplePcApp()) {
          // 简单版桥接协议
          LonchJsApi.callAppSimple({'command': 'cmdAppPrintDom', args:{
            dom:copy,
            style: style,
            printerSize: page.size || '',
            orientation: page.orientation || ''
          }});
        } else {
          printResult = window.print();
        }
        if (style) {
          document.head.removeChild(style);
        }
        if (typeof callback === 'function') {
          callback.call(this, printResult);
        }
      });
    }
  }
};
