import { type Dep, createDep } from './dep'
import { activeEffect, trackEffect, triggerEffects } from './effect'

/** targetMap: WeakMap<target, Map<key, Dep>> */
const targetMap = new WeakMap<object, Map<any, Dep>>()

/** 收集依赖 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep(() => dep!.clear())
    depsMap.set(key, dep)
  }

  trackEffect(dep)
}

/** 触发依赖 */
export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  triggerEffects(dep)
}
