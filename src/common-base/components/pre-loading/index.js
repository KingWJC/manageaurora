import comp from './src/index';

export default {
  install (Vue) {
    // let name = comp.name;
    //console.log('==comp name==', name);
    Vue.prototype.$preLoading = comp;
  }
};
