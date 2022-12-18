const oldArrayMethods = Array.prototype
// 数组方法的重写使用了原型链的查找
export const arrayMethods = Object.create(oldArrayMethods)
const methods = [
  'push',
  'shiift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]
methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    console.log('用户调用了push方法')
    const result = oldArrayMethods[method].apply(this, args)
    // push unshift 添加的可能是一个对象
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice': // 3个参数 arr.splice(0, 1, {name: 'zs'})
        inserted = args.slice(2) //截取出splice最后的一个参数
    }
    if (inserted) { // 如果inserted有值，那么就是一个数组，那么就调用数组的观测方法
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  } 
})