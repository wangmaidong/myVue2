import {
  observe
} from './observe/index.js'
import { proxy } from './util/index.js'
export function initState(vm) {
  const opts = vm.$options
  // vue 的数据来源 属性props 方法methods 数据data 计算属性computed watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {}

function initMethods(vm) {}



function initData(vm) {
  let data = vm.$options.data
  // 使用 call调用data方法使得内部this指向vue实例
  // 并给vue实例 vm添加一个_data属性使得用户可以拿到
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 对数据进行劫持 Object.defineproperty
  observe(data)
}

function initComputed(vm) {}

function initWatch(vm) {}