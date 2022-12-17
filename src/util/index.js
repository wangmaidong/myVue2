export function isObject(data) {
  if (typeof data === 'object' && data !== null) {
    return true
  } else {
    return false
  }
}
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
let strats = {}
function mergeHook(parentval, childVal) {
  if (childVal) {
    if (parentval) {
      return parentval.concat(childVal)
    } else {
      return [childVal]
    }
  } else { // 只有老，没有新
    return parentval
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) { 
    if (!parent.hasOwnProperty(key)) { // 如果已经合并过了就不需要再次合并
      mergeField(key)
    }
  }
  // 默认的合策略 但是有些属性 需要有特殊的合并策略 生命周期的合并
  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }
  return options
}