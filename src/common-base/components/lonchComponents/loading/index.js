import Vue from 'vue';
import Main from './mask.vue';
import {Loading} from 'element-ui';

let LonchLoadingConstructor = Vue.extend(Main);
let instance;
let loadingExample = null;

const LonchLoading = function (options = {}) {
  const _el = document.getElementById("lonchLoading");
  if (options.type === 'close') {
    if(loadingExample) {
      loadingExample.close();
    }
    if (_el) {
      let timer = setTimeout(()=>{
        const _parent = _el.parentElement;
        _parent && _parent.removeChild(_el);
        clearTimeout(timer);
        timer = null;
      }, 300)
    }
  } else {
    if (!_el) {
      if(window.vm && window.vm.CFG && window.vm.CFG.projectName && window.vm.CFG.projectName === 'edc') {
        instance = new LonchLoadingConstructor({
          data: options
        }).$mount();
        document.body.appendChild(instance.$el);
      } else {
        loadingExample = Loading.service(options);
      }
    }
  }
  return {
    show: () => {
      options.type = 'show';
      return LonchLoading(options);
    },
    close: () => {
      options.type = 'close';
      return LonchLoading(options);
    }
  };
}

LonchLoading.service = function (options = {}) {
  if (typeof options === 'string') {
    options = { text: options };
  }

  LonchLoading(options);
  
  return {
    show: () => {
      options.type = 'show';
      return LonchLoading(options);
    },
    close: () => {
      options.type = 'close';
      return LonchLoading(options);
    }
  };
};

export default LonchLoading;