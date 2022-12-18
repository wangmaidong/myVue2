import { initState } from './state.js'
import { compileToFunction } from './compiler/index.js'
import { mountComponent, callHook } from './lifecycle.js'
import { mergeOptions } from './util/index.js'
import { nextTick } from './util/next-tick.js'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // vm.$options = options 这行代码改为以下代码 要合并Vue上的选项
    vm.$options = mergeOptions(vm.constructor.options, options) // 将用户传递的和全局api进行合并
    callHook(vm, 'beforeCreate')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')
    // 如果用户传入了el属性 需要将页面渲染出来
    // 如果用户传入了el 就要实现挂载流程】
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    // 默认优先查找 有没有 render,没有render 会采用 template template也没有将会采用el中的内容
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunction(template);// 把模板编译成函数
      // 转换完之后再给options进行添加
      options.render = render;
    }
    // 渲染当前的组件 挂载这个组件
    mountComponent(vm, el)
  }
  // 用户调用的nextTick
  Vue.prototype.$nextTick = nextTick
}