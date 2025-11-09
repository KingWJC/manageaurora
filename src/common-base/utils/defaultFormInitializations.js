import utils from './utils'
export default {
  // input: {
  //  types: 'text,textarea,number,search,password,date,datetime,datetime-local,month,week,time,email,tel,url,range',
  //  handler: function () {
  //    var _this = this;
  //    // 去除开始位置空格
  //    this.value = this.value.replace(/^[\s\uFEFF\xA0]+/, '');
  //    // 开启实时验证
  //    Elf.form.validate(this);
  //  }
  // },
  // blur: {
  //  types: 'text,textarea,number,search,password,date,datetime,datetime-local,month,week,time,email,tel,url,range',
  //  handler: function () {
  //    // 去除两端空格
  //    this.value = this.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  //    Elf.form.validate(this);
  //  }
  // },
  // change: {
  //  types: 'select-one,radio,checkbox,select-multi',
  //  handler: function () {
  //    Elf.form.validate(this);
  //  }
  // },
  focus: {
    types: 'text,textarea,number,search,password,date,datetime,datetime-local,month,week,time,email,tel,url,range',
    handler: function () {
      let _this = this
      let scrollEl = utils.getScrollingElement(_this)
      setTimeout(function () {
        if (_this.offsetTop + _this.offsetHeight > scrollEl.offsetHeight + scrollEl.scrollTop) {
          scrollEl.scrollTop = _this.offsetTop + _this.offsetHeight - scrollEl.offsetHeight + 60
        }
      }, 400)
    }
  }
}
