import type { ReactiveEffect } from './effect'

/**
 * Dep：依赖集合
 * - Vue3 中 Dep 实际上就是一个 Set<ReactiveEffect>
 * - 这里额外扩展了 cleanup 回调，便于调试或自定义清理逻辑
 */
export type Dep = Set<ReactiveEffect> & { cleanup?: () => void }

/**
 * createDep：创建一个依赖集合
 */
export function createDep(cleanup?: () => void): Dep {
  const dep = new Set<ReactiveEffect>() as Dep
  dep.cleanup = cleanup
  return dep
}
