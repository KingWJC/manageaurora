//import Vue from 'vue'
const Vue = require('vue')
import Toast from './toast'

const defaults = {
  show: false,
  title: '',
  text: ''
}
const Instance = Vue.extend(Toast)
Instance.prototype.close = function () {
  // let vm = this
  // vm.$destroy()
  // vm.show = false
  this.closeToast()
  // 关闭后删除dom节点
  // if (vm.$el && vm.$el.parentNode) {
  //   vm.$el.parentNode.removeChild(vm.$el)
  // }
}

const toast = (options = {}) => {
  if (Vue.prototype.$isServer) return
  options = Object.assign({}, defaults, options)
  let parent = document.body
  // 没有关闭不允许新开
  // if (isLoading) {
  //   return isLoading
  // }
  let instance = new Instance({
    el: document.createElement('div'),
    data: options
  })
  parent.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.showToast()
    // instance.show = true
  })
  // isLoading = instance
  return instance
}

export default toast
