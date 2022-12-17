export function createElement(tag, data = {}, ...children) {
  let key = data.key
  if (key) { // key是在dif算法的 时候用到
    delete data.key
  }
  return vnode(tag, data,key, children, undefined)
}
export function createTextNode(text) {
  return vnode(undefined, undefined,  undefined, undefined, text)
}
function vnode(tag, data, key, children, text) { 
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
// 1.将template转成 ast语法树 -> 生成render方法 ->生成虚拟dom -> 真实的dom
//  有数据发生变化 重新生成 虚拟dom-> 更新dom
