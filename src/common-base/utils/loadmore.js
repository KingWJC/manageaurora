import Vue from 'vue';
const loadmore = Vue.directive('loadmore', {
  bind: function(el, binding) {
    let p = 0;
    let t = 0;
    let down = true;
    let selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function() {
      //判断是否向下滚动
      p = this.scrollTop;
      if (t < p) {
        down = true;
      } else {
        down = false;
      }
      t = p;
      //判断是否到底
      const sign = 1;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      // if (scrollDistance < sign && down) {
      //   binding.value()
      // }
      const datas = {
        isBottom: scrollDistance < sign && down,  // 是否向下移动到底部
        down: down,  // 移动方向 向下  true  向上  false
        scrollWidth: this.scrollWidth, // 对象实际内容宽度
        scrollLeft: this.scrollLeft, // 横向滚动距离
      }
      binding.value(datas)
    })
  }
})
export default loadmore;
