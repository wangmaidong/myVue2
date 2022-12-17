let id = 0
export default class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    this.subs.push(Dep.target)
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
