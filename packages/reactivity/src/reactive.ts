import { isObject } from '@vue-core/shared'
import { mutableHandlers } from './baseHandlers'
import { ReactiveFlags } from './constants'

/**
 * 响应式对象接口
 */
export interface Target {
  [ReactiveFlags.SKIP]?: boolean // 跳过响应化
  [ReactiveFlags.IS_REACTIVE]?: boolean // 是否响应式
  [ReactiveFlags.RAW]?: any // 原始对象
}

/**
 * 响应式对象缓存
 * WeakMap key 为原始对象，value 为对应 Proxy
 */
export const reactiveMap = new WeakMap<Target, any>()

/**
 * 将普通对象转换为响应式对象
 */
export function reactive<T extends object>(target: T): T {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * 创建响应式对象核心函数
 */
function createReactiveObject<T extends Target>(
  target: T,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
): T {
  // 不是对象，直接返回
  if (!isObject(target)) return target

  // 已经是响应式对象，直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) return target

  // 已有缓存 Proxy，直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy

  // 创建新的 Proxy
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy) // 缓存 Proxy

  return proxy
}
