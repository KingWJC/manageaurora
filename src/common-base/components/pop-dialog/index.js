import popDialog from './src/index'

export default {
  install (Vue) {
    Vue.prototype.$popDialog = popDialog
  }
}
