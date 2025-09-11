import { Dep } from './dep'

/** 当前正在执行的副作用，用于 track 收集依赖 */
export let activeEffect: ReactiveEffect | undefined

/**
 * ReactiveEffect：封装副作用函数、依赖集合和调度器
 */
export class ReactiveEffect<T = any> {
  active = true // 是否激活
  deps: Dep[] = [] // 反向记录：此 effect 被哪些 dep 收集
  scheduler?: () => void // 可选调度器

  constructor(public fn: () => T, scheduler?: () => void) {
    if (scheduler) this.scheduler = scheduler
  }

  /**
   * 执行副作用
   * - stop 状态下直接执行 fn
   * - 否则设置 activeEffect，先清理旧依赖，再收集新依赖
   */
  run() {
    if (!this.active) return this.fn()

    const lastEffect = activeEffect
    try {
      activeEffect = this
      cleanupEffect(this) // 清理旧依赖，避免重复收集
      return this.fn()
    } finally {
      activeEffect = lastEffect // 恢复上一个 activeEffect
    }
  }

  /** 停止副作用，清理依赖并标记 inactive */
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }
  }
}

/** 清理 effect 的依赖：从所有 dep 中删除自身，并清空 deps */
export function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    effect.deps.length = 0
  }
}

/** 对外 API：创建并立即运行 effect */
export function effect<T = any>(
  fn: () => T,
  options: { scheduler?: () => void } = {}
) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  return _effect
}
