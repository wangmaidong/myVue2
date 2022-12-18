import {
  pushTarget,
  popTarget
} from './dep.js'
let id = 0
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.callback = callback
    this.options = options
    this.id = id++
    this.getter = exprOrFn //将内部传过来的回调函数 放到 getter属性上
    this.depsId = new Set()
    this.deps = []
    this.get() // 调用get方法 会让渲染watcher执行
  }

  addDep(dep) { // watcher里面不能放重复的dep  dep里面也不能放重复的watcher
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this) // 把watcher存起来 Dep.target就会存放这个watcher
    this.getter() // 渲染watcher的执行 在渲染的时候会触发属性的取值操作 
    popTarget(this) // 移出watcher
  }
  update() {
    this.get()
  }
}
export default Watcher