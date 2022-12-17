import {
  isObject, def
} from '../util/index.js'
import { arrayMethods } from './array.js'
//Object.defineproperty es5语法，所以vue 不支持ie8及以下
class Observer {
  constructor(value) {
    // 如果vue中数据的层次过多，需要递归的去解析对象中的属性，依次增加get  和 set
    // value第一次传进来的时候一定是一个对象，但是对象里的某个属性的值可能是一个数组
    // 数组的话不希望例如 [1, {name: 'wl'}],如果直接走walk会给数组的索引添加get和 set，但并不希望这样做，比如第0项
    // 我们只希望劫持数组里面的对象
    // value.__ob__ = this // 给每一个监测过的对象都添加一个_ob属性，属性值即为Observer实例 ,但是这样直接添加会导致无限递归
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 前端开发中很少会去操作索引 ， 所以索引不需要进行观测，会有性能问题
      // 如果数组里放的是对象,再进行监控
      // 此外还要对数组方法中会改变数组本身的方法进行一个监控 push  pop shift unshift 
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
}

function defineReactive(data, key, value) {
  // 如果属性对应的值也是一个对象那么要递归，那么也要对这个对象进行数据的劫持
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      // 如果设置的值也是一个对象那么要递归，那么也要对这个对象进行数据的劫持
      observe(newValue)
      value = newValue
    }
  })
}
export function observe(data) {
  // 判断一下传过来的data是不是一个对象
  const isObj = isObject(data)
  if (!isObj) return // 如果传进来的数据不是一个对象就直接return 
  return new Observer(data) // 观测数据
}