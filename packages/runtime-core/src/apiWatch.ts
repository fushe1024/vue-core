import { isRef, isReactive, ReactiveEffect } from '@vue-core/reactivity'
import { isFunction, isObject } from '@vue-core/shared'

// 监听选项
interface WatchOptions {
  immediate?: boolean // 是否立即执行回调
  deep?: boolean // 是否深度监听
}

// 监听响应式数据变化
export function watch(
  source: any,
  cb: (newValue: any, oldValue: any) => void,
  options: WatchOptions = {}
) {
  return doWatch(source, cb, options)
}

// 响应式副作用函数监听
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

  // 深度监听，递归访问所有属性
  if (deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue: any

  // 依赖变化时执行
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || newValue !== oldValue) {
        cb(newValue, oldValue) // 执行回调
        oldValue = newValue
      }
    } else {
      effect.run() // watchEffect 执行副作用
    }
  }

  const effect = new ReactiveEffect(getter, job)

  // 初始化阶段
  if (cb) {
    immediate ? job() : (oldValue = effect.run())
  } else {
    effect.run() // watchEffect 初始化执行
  }

  // 返回停止监听函数
  return () => effect.stop()
}

// 递归访问对象或数组所有属性，触发依赖收集
function traverse(value: any, seen = new Set()): any {
  if (!isObject(value) || seen.has(value)) return value // 非对象或已访问过，直接返回

  seen.add(value) // 标记已访问
  const keys = Reflect.ownKeys(value) // 获取所有属性

  for (const key of keys) {
    traverse((value as any)[key], seen) // 递归访问
  }

  return value
}
