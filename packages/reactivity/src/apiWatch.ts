import { isRef } from './ref'
import { isReactive } from './reactive'
import { ReactiveEffect } from './effect'
import { isFunction, isObject } from '@vue-core/shared'

// 监听选项
interface WatchOptions {
  immediate?: boolean
  deep?: boolean
}

// 监听响应式数据变化
export function watch(
  source: any,
  cb: (newValue: any, oldValue: any) => void,
  options: WatchOptions = {}
) {
  return doWatch(source, cb, options)
}

// 监听响应式数据变化
export function watchEffect(effectFn: () => void) {
  return doWatch(effectFn, null)
}

// 核心监听函数
function doWatch(
  source: any,
  cb: Function | null,
  { immediate = false, deep = false }: WatchOptions = {}
) {
  let getter: () => any

  // 根据 source 类型生成 getter
  if (isFunction(source)) {
    getter = source
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = () => {}
  }

  // 深度监听对象时递归访问属性
  if (deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue: any, newValue: any

  // 依赖变化时执行
  const job = () => {
    newValue = effect.run()
    if (cb && (deep || newValue !== oldValue)) {
      cb(newValue, oldValue)
      oldValue = newValue
    }
  }

  const effect = new ReactiveEffect(getter, job)

  // 初始化值
  if (cb) {
    immediate ? job() : (oldValue = effect.run())
  } else {
    effect.run()
  }

  // 返回停止监听函数
  return () => effect.stop()
}

// 递归访问对象属性，触发深度依赖收集
function traverse(value: any, seen = new Set()) {
  if (!isObject(value) || seen.has(value)) return value
  seen.add(value)
  const keys = Reflect.ownKeys(value)
  for (const key of keys) {
    traverse((value as any)[key], seen)
  }
  return value
}
