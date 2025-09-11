import { activeEffect } from './effect'
import { Dep, createDep, addDep, triggerDep } from './dep'

/**
 * targetMap 依赖存储结构
 * WeakMap<object, Map<key, Dep>>
 *
 * - 第一层 WeakMap：以响应式对象 target 作为 key（弱引用，避免内存泄漏）
 * - 第二层 Map：以属性 key 作为 key，存储该属性对应的依赖集合 Dep
 * - Dep：依赖集合（通常是一个存放 ReactiveEffect 的 Set）
 */
const targetMap = new WeakMap<object, Map<string | symbol, Dep>>()

/**
 * track
 * 在 getter 中调用，收集依赖关系
 *
 * - 将当前正在运行的副作用函数（activeEffect）
 *   收集到 target.key 对应的依赖集合 Dep 中
 * - 同时在 effect.deps 中反向记录该 dep，
 *   以便后续清理（cleanupEffect）
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  // 获取 target 对应的依赖集合 Map，没有则新建
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  // 获取 key 对应的依赖集合 Dep，没有则新建
  let dep = depsMap.get(key)
  if (!dep) {
    // createDep 可以为 dep 绑定一个 cleanup 回调
    depsMap.set(key, (dep = createDep(() => dep!.clear())))
  }

  // 收集依赖（避免重复收集 + 反向记录）
  addDep(dep, activeEffect)
}

/**
 * trigger
 * 在 setter 中调用，触发依赖更新
 *
 * - 根据 target.key 找到依赖集合 Dep
 * - 遍历 Dep 中的所有副作用函数，逐个执行
 * - 支持跳过当前正在运行的 effect（避免死循环）
 */
export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  // 触发依赖，跳过当前 activeEffect
  triggerDep(dep, activeEffect)
}
