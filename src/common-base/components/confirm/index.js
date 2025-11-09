import confirm from './src/index'

export default {
  install (Vue) {
    Vue.prototype.$confirm = confirm
  }
}
