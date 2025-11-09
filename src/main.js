/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2022-07-14 21:29:44
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2023-07-18 14:06:03
 * @FilePath: \YYFc:\project\middleground\manage\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//import './assets/styles/index.scss';
//import './assets/element-styls.css';
//import './assets/media.scss';
import './common-base/accsets/styles/index.scss';
import './common-base/accsets/element-styls.css';
import './common-base/accsets/media.scss';
import './common-base/accsets/icon/index.scss';
//import Vue from 'vue'
//import ElementUI from 'element-ui'
const Vue = require('vue');
const ElementUI = require('element-ui');
//import Confirm from './components/common/confirm'
//import Toast from './components/common/toast'
import Confirm from '@/common-base/components/confirm';
import Toast from '@/common-base/components/toast';
import filters from '@/common-base/utils/filters';
import utils from '@/common-base/utils/utils';
import Api from '@/common-base/api/api';
import UploadFile from '@/common-base/utils/cavansUpload';
import FileViewer from '@/common-base/components/file-viewer';
import login from '@/common-base/login/login';
import webLog from './common-base/api/web-log';
import Config from './config/index';
import App from './App.vue';
import router from './router';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

import icon from '@/common-base/components/icon';
import BigNumber from 'bignumber.js';

Vue.use(icon);

// 朗致 CA 认证
import CaTokenTools from './catoken'

Vue.prototype.$caTokenTools = new CaTokenTools();

Vue.use(Viewer);
Vue.use(FileViewer);
Viewer.setDefaults({
  Options: {
    'inline': true,
    'button': true,
    'navbar': true,
    'title': true,
    'toolbar': true,
    'tooltip': true,
    'movable': true,
    'zoomable': true,
    'rotatable': true,
    'scalable': true,
    'transition': true,
    'fullscreen': true,
    'keyboard': true,
    'url': 'data-source'
  }
});
Vue.use(ElementUI);
Vue.use(Confirm);
Vue.use(Toast);
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.prototype.login = login;
Vue.prototype.webLog = webLog;
Vue.prototype.utils = utils;
Vue.prototype.UploadFile = UploadFile;
Vue.prototype.globalData = Config;
Vue.prototype.API = Api;
Vue.prototype.CFG = Config;
Vue.prototype.OSSCFG = Config.oss;
Vue.prototype.BigNumber = BigNumber.clone({
  // 以舍尾的方式保留小数点位数，具体业务实现如需要四舍五入，在具体业务中重新设置即可
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});
Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');


