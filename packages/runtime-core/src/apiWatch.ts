import { isRef, isReactive, ReactiveEffect } from '@vue-core/reactivity'
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

  let oldValue: any

  // 依赖变化时执行
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || newValue !== oldValue) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    } else {
      // watchEffect
      effect.run() // 直接执行副作用函数，并收集依赖
    }
  }

  const effect = new ReactiveEffect(getter, job)

  // 初始化阶段
  if (cb) {
    immediate ? job() : (oldValue = effect.run())
  } else {
    // watchEffect
    effect.run() // 直接执行副作用函数，并收集依赖
  }

  // 返回停止监听函数
  return () => effect.stop()
}

/**
 * 递归访问对象或数组的所有属性，触发依赖收集
 * @param value 响应式对象或数组
 * @param seen 已访问过的对象集合，防止循环引用
 */
function traverse(value: any, seen = new Set()): any {
  // 非对象或已访问过，直接返回
  if (!isObject(value) || seen.has(value)) return value

  // 标记为已访问
  seen.add(value)

  // 获取对象或数组的所有属性（包括 Symbol）
  const keys = Reflect.ownKeys(value)

  // 遍历所有属性递归访问
  for (const key of keys) {
    const val = (value as any)[key]
    traverse(val, seen)
  }

  return value
}
