import { track, trigger } from './reactiveEffect'
import { ReactiveFlags } from './constants'

/**
 * 可变对象的 Proxy handlers
 * - get: 收集依赖
 * - set: 值变化时触发依赖
 */
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    // 内部标记直接返回，不收集依赖
    if (key === ReactiveFlags.IS_REACTIVE) return true

    const res = Reflect.get(target, key, receiver)
    track(target, key) // 收集依赖
    return res
  },

  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      trigger(target, key) // 值变化触发依赖
    }
    return result
  },
}
