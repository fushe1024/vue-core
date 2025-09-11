import { isObject } from '@vue-core/shared'
import { mutableHandlers } from './baseHandlers'
import { ReactiveFlags } from './constants'

/**
 * 响应式对象接口
 */
export interface Target {
  [key: string]: any
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.RAW]?: any
}

/**
 * 缓存原始对象 -> Proxy 的映射，避免重复创建
 */
const reactiveMap = new WeakMap<Target, any>()

/**
 * 将对象转换为响应式对象
 */
export function reactive<T extends object>(target: T): T {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * 核心方法：创建 Proxy
 */
function createReactiveObject<T extends object>(
  target: T,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<T, any>
): T {
  // 非对象直接返回
  if (!isObject(target)) return target

  // 已经是响应式对象直接返回
  if ((target as any)[ReactiveFlags.IS_REACTIVE]) return target

  // 已存在代理直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy

  // 创建新代理并缓存
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}

/**
 * 将值转换为响应式对象，如果不是对象则直接返回
 */
export function toReactive<T extends unknown>(value: T): T {
  return isObject(value) ? reactive(value) : value
}
