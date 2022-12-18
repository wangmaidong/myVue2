let id = 0
export default class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    // this.subs.push(Dep.target)
    // 让这个watcher 记住我当前的dep 
    Dep.target.addDep(this) // Dep.target --> 渲染watcher   this-->dep实例
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
let stack = []
// 目前可以做到将watcher保留起来和移出
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
