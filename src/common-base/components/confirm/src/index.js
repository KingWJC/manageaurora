//import Vue from 'vue'
const Vue = require('vue')
import Confirm from './confirm'
const defaults = {
  show: false,
  title: '温馨提示',
  text: '',
  html: '',
  buttons: [
    {
      text: '取消',
      type: 'follow',
      callback: function () {}
    },
    {
      text: '确定',
      type: 'primary',
      callback: function () {}
    }
  ]
}
let isLoading
const Instance = Vue.extend(Confirm)
// 这里关闭的时候返回promise
Instance.prototype.close = function () {
  let vm = this
  isLoading = null
  vm.$destroy()
  vm.show = false
  if (vm.$el && vm.$el.parentNode) {
    vm.$el.parentNode.removeChild(vm.$el)
  }
  // let promise = new Promise(function(resolve, reject) {
  //   if (vm.$el && vm.$el.parentNode) {
  //     vm.$el.parentNode.removeChild(vm.$el);
  //   }
  //   resolve();
  //   vm.$destroy();
  //   vm.show = false;
  // });
  // return promise;
}

const confirm = (options = {}) => {
  if (Vue.prototype.$isServer) return
  options = Object.assign({}, defaults, options)
  let parent = document.body
  // 没有关闭不允许新开
  if (isLoading) {
    return isLoading
  }
  let instance = new Instance({
    el: document.createElement('div'),
    data: options
  })
  parent.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.show = true
  })
  isLoading = instance
  return instance
}
export default confirm
