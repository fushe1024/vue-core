import type { ReactiveEffect } from './effect'

/**
 * Dep：依赖集合，存储副作用函数 ReactiveEffect
 * - cleanup: 停止 effect 时调用，可清理依赖集合
 */
export type Dep = Set<ReactiveEffect> & {
  cleanup: () => void
}

/**
 * 创建 Dep 并附加 cleanup
 */
export function createDep(cleanup: () => void): Dep {
  const dep = new Set<ReactiveEffect>() as Dep
  dep.cleanup = cleanup
  return dep
}

/**
 * 将副作用加入 dep 并做反向收集
 */
export function addDep(dep: Dep, effectFn: ReactiveEffect) {
  if (!dep.has(effectFn)) {
    dep.add(effectFn)
    effectFn.deps.push(dep) // 反向记录，便于清理
  }
}

/**
 * 遍历 dep 并触发副作用
 */
export function triggerDep(dep: Dep, currentActiveEffect?: ReactiveEffect) {
  // 使用副本遍历，防止迭代时修改
  const effects = new Set(dep)
  effects.forEach(effectFn => {
    // 跳过当前正在执行的 effect
    if (effectFn === currentActiveEffect) return

    // 有 scheduler 则调用，否则直接执行
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn.run()
    }
  })
}
