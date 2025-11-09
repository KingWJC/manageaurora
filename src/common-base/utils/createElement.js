import utils from './utils'
import iterate from './iterate'
function properties (el, props){
  iterate(props, function(key, obj){
    if (typeof el[key] == "string"){
      el[key] = obj;
    }else{
      el.setAttribute(key,obj);
    }
  });
}
export default function createElement () {
  let tagName = arguments[0],
    length = arguments.length,
    t,
    i = 1,
    parent,
    attr,
    classLs,
    el;
  for (; i < length; i++) {
    t = arguments[i];
    if (utils.isEmpty(t)) {
      continue;
    }
    if (typeof t == 'object' && (t.nodeType == 1 || t.nodeType == 9 || t.nodeType == 11)) {
      parent = t;
    } else if (typeof t == 'object') {
      attr = t;
    } else if (typeof t == 'string') {
      classLs = t;
    }
  }
  el = document.createElement(tagName);
  if (attr) {
    properties(el, attr);
  }
  if (classLs) {
    utils.addClass(el, classLs);
  }
  if (parent) {
    parent.appendChild(el);
  }
  return el;
}
