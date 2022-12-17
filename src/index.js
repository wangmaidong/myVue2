import { initMixin } from './init.js'
function Vue(options) {
  // 1.进行vue选项的初始化操作
  this._init(options)
}
// 通过引入的方式给vue 原型上添加方法
initMixin(Vue)
export default Vue