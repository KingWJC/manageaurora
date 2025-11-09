import webLog from './../api/web-log';
import utils from './../utils/utils';

/**
 * 页面用户行为数据
 * =================
 * 自定义数据埋点
 * input点击
 * tab选项卡
 * 点击分页器
 * 菜单树点击
 * button点击
 * img图片点击
 * 页面滚动 todo
 * -----------------
 * selector, dom选择器，多个时，匹配任意一个成功即完成匹配
 * expect 非必需，期待dom选择器，用于限定具体条件规则，如果设置了预期选项，事件触发区域必需在预期选择器之内， 参考分页器
 * operation 操作类型
 * remark 说明
 * handler 参数处理器
 * @param object
 *  evt
 *  currentTarget
 *  matchedTarget
 */
const settings = [
  {
    selector: '[data-info]',
    operation: 'dataInfo',
    remark: '数据埋点',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText,
        data: {
          info: matched.getAttribute('data-info')
        }
      };
    }
  }, {
    selector: '.el-tabs__item .tab-item',
    operation: 'tabs',
    remark: '标签页点击行为',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: '.el-menu-item',
    operation: 'menu',
    remark: '菜单点击',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: '.number',
    expect: '.el-pager',
    operation: 'pager',
    remark: '分页器页码',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: '.btn-prev',
    expect: '.el-pagination',
    operation: 'pagerPrev',
    remark: '分页器上一页',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: '.btn-next',
    expect: '.el-pagination',
    operation: 'pagerNext',
    remark: '分页器下一页',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: 'button input[type=button] .el-button [role=button]',
    operation: 'button',
    remark: '按钮',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.innerText
      };
    }
  }, {
    selector: 'img',
    operation: 'img',
    remark: '图片',
    handler: function (evt, matched) {
      return {
        operation: this.operation,
        evt: evt.type,
        target: matched.src,
        data: {
          rel: matched.alt
        }
      };
    }
  }
];

//function getReportEventTarget (target) {
//  let args = {};
//  let dataInfo = utils.closest(target, '[data-info]');
//  let button = utils.closest(target, 'button') || utils.closest(target, '.el-button') || utils.closest(target,
// 'input[type=button]') || utils.closest(target, '.el-button'); let img = utils.closest(target, 'img'); let input =
// utils.closest(target, 'input'); let elPager = utils.closest(target, '.el-pager'); if (dataInfo) {
// Object.assign(args, { operation: 'click', url: window.location.href, evt: 'click', target: dataInfo.innerText, data:
// { info: dataInfo.getAttribute('data-info') } }); } else if (button) { Object.assign(args, { operation:
// 'button-click', evt: 'click', target: button.innerHTML, data: {} }); } else if (img) { Object.assign(args, {
// operation: 'img-click', url: window.location.href, evt: 'click', target: img.src, data: {} }); } else if (input) {
// Object.assign(args, { operation: 'input-click', url: window.location.href, evt: 'click', target: input.value, data:
// { value: '' } }); } else if (elPager) { Object.assign(args, { operation: 'input-click', url: window.location.href,
// evt: 'click', target: input.value, data: { value: '' } }); } else { let popTextEl = closestText(target); if
// (popTextEl) { Object.assign(args, { operation: 'click', evt: 'click', target: '', data: { similar:
// popTextEl.innerText } }); } } return args; }

/**
 * 统一事件处理器
 * 上报用户行为，按钮点击事件
 * @param target
 */
function handlers (evt) {
  // 行为日志处理
  let target = evt.target || evt.srcElement || evt.currentTarget.activeElement;
  for (let setting of settings) {
    // 如果设置了预期选项，事件触发区域必需在预期选择器之内， 参考分页器
    let isExpect = false;
    let isReported = false;
    if (setting.expect && utils.closest(target, setting.expect)) {
      isExpect = true;
    }
    if (setting.selector && (setting.expect ? isExpect : true)) {
      let matched;
      let selectors = setting.selector.split(' ');
      for (let selector of selectors) {
        matched = utils.closest(target, selector);
        if (matched) {
          let result = setting.handler.call(setting, evt, matched, target);
          if (result) {
            webLog.reportBehavior(result);
          }
          isReported = true;
          break;
        }
      }
    }
    // 已上报记录，结束处理
    if (isReported) {
      break;
    }
  }
}

export default handlers;
