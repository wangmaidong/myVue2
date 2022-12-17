import { initMixin } from './init.js'
import { renderMixin } from './render.js'
import { lifecycleMixin } from './lifecycle.js'
import { initGlobalAPI } from './initGlobalAPI/index.js'
function Vue(options) {
  // 1.进行vue选项的初始化操作
  this._init(options)
}
// 通过引入的方式给vue 原型上添加方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
// 初始化全局的api
initGlobalAPI(Vue)
export default Vue