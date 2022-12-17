import { mergeOptions } from '../util/index.js'
export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 实现两个对象的合并
    this.options = mergeOptions(this.options, mixin)
  }
}