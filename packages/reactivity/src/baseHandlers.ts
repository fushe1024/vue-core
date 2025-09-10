import { track, trigger } from './reactiveEffect'
import { ReactiveFlags } from './constants'

/**
 * 响应式对象 Proxy 拦截器
 */
export const mutableHandlers: ProxyHandler<any> = {
  /**
   * 拦截读取属性
   */
  get(target, key, receiver) {
    // 内部标识判断
    if (key === ReactiveFlags.IS_REACTIVE) return true

    // 收集依赖
    track(target, key)

    // 保持原始行为（支持继承和 getter）
    return Reflect.get(target, key, receiver)
  },

  /**
   * 拦截设置属性
   */
  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)

    // 新值和旧值不同时才触发依赖
    if (oldValue !== value) {
      trigger(target, key)
    }

    return result
  },
}
