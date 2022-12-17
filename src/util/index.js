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