import {
  createElement, createTextNode
} from './vdom/create-element.js'
export function renderMixin(Vue) {
  // _c创建元素的虚拟节点
  // _v 创建文本的虚拟节点
  // _s 创建 {{}}
  Vue.prototype._c = function () {
    return createElement(...arguments) // tag, data, children, children
  }
  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }
  Vue.prototype._s = function (val) {
    return  val == null? '' : (typeof val == 'object' ? JSON.stringify(val):val)
  }
  Vue.prototype._render = function (params) {
    const vm = this
    const { render } = vm.$options
    let vnode = render.call(vm)
    return vnode
  }
}