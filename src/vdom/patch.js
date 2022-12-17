// patch可以用于初次渲染 也可以用来更新 oldVnode第一次是一定是一个真实的标签
export function patch(oldVnode, vnode) {
  // 递归创建真实节点 替换掉老的节点
  // 1.判断是更新还是要渲染 渲染的话那么oldVnode一定是个真实的标签
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el // 需要将渲染好的结果返回
  }

}

function createElm(vnode) { // 根据虚拟节点创建真实的节点
  let {
    tag,
    children,
    key,
    data,
    text
  } = vnode
  // 是标签就创建标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => { // 递归创建儿子节点，将儿子节点放到父亲节点
      return vnode.el.appendChild(createElm(child))
    });
  } else {
    // 虚拟dom上映射着真实dom 方便后续更新操作
    vnode.el = document.createTextNode(text)
  }
  // 如果不是标签就是文本
  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data
  let el = vnode.el
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}