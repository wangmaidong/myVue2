import Watcher from './observe/watcher.js'
import  { patch } from './vdom/patch.js'
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // 通过虚拟节点，渲染出真实的dom
    const vm = this
    vm.$el = patch(vm.$el, vnode) // 用虚拟节点创建出真实节点 替换掉原有的$el
  }
}
export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el // 真实的dom元素
  // Watcher 就是用来渲染的
  // vm._render 通过解析的render方法 渲染出虚拟dom
  // vm._update 通过虚拟dom 创建真实的dom
  callHook(vm, 'beforeMount');
  // 渲染页面
  let updateComponent = () => { // 无论是渲染还是更新都会调用此方法
    // 返回的是虚拟dom  vm._render()
    vm._update(vm._render())
  }
  // 渲染watcher 每个组件都有一个watcher
  new Watcher(vm, updateComponent, () => { }, true) // true 表示他是一个渲染watcher
  callHook(vm, 'mounted')
}
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}