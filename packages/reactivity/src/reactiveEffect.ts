import { ReactiveEffect, activeEffect } from './effect'

/**
 * 每个 target 的依赖存储
 * WeakMap<target, Map<key, Set<effect>>>
 */
type Dep = Set<ReactiveEffect>
const targetMap = new WeakMap<object, Map<string | symbol, Dep>>()

/**
 * 收集依赖
 * 在 reactive getter 中调用
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(activeEffect)
}

/**
 * 触发依赖
 * 在 reactive setter 中调用
 */
export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  dep.forEach((effectFn: ReactiveEffect) => {
    // 如果 effect 有 scheduler，优先调用 scheduler
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn.run()
    }
  })
}
