let callbacks = []
let waiting = false

function flushCallBack() {
  callbacks.forEach(cb => cb())
  waiting = false
  callbacks = []
}
export function nextTick(cb) {
  // 多次调用nextTick 如果没有刷新的时候 就把他放到数组中
  // 刷新后更改 waiting
  callbacks.push(cb)
  if (waiting === false) {
    setTimeout(flushCallBack, 0)
    waiting = true
  }
}