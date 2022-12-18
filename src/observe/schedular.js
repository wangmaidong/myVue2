import {
  nextTick
} from '../util/next-tick.js'
let queue = []
let has = {}

function flushSchedularQueue() {
  queue.forEach(watcher => watcher.run())
  queue = [] // 让下一次可以继续使用
  has = {}
}
export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    queue.push(watcher)
    nextTick(flushSchedularQueue)
  }
}