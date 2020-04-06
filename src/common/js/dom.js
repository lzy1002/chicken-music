export function addClass(el, cls) {  // 为传入的元素添加传入的类名
  if(hasClass(el, cls)) return;
  let classArr = el.className.split(" ");
  classArr.push(cls);
  el.className = classArr.join(" ");
}

function hasClass(el, cls) {  // 判断传入的元素身上是否有传入的类名
  let reg = new RegExp("(^|\\s)" + cls + "(\\s|$)");
  return reg.test(el.className);
}

export function attr(el, key, val) {
  let prefix = "data-";
  if(!val) {
    return el.getAttribute(prefix + key);
  }
  el.setAttribute(prefix + key, val);
}
