/**
 * 当前正在执行的副作用函数（全局变量）
 * 在 track 中用它来收集依赖
 */
export let activeEffect: ReactiveEffect | undefined

/**
 * 响应式副作用类
 */
export class ReactiveEffect<T = any> {
  active = true // 是否激活
  scheduler?: () => void // 可选调度器，用于自定义更新策略

  constructor(public fn: () => T, scheduler?: () => void) {
    if (scheduler) this.scheduler = scheduler
  }

  /**
   * 执行副作用函数
   * - 如果 effect 未激活，直接执行 fn
   * - 否则设置 activeEffect，执行 fn，收集依赖
   */
  run() {
    if (!this.active) return this.fn()

    // 保存当前 activeEffect，执行前替换为当前 effect
    const lastEffect = activeEffect
    activeEffect = this

    try {
      return this.fn()
    } finally {
      activeEffect = lastEffect // 恢复上一个 effect
    }
  }

  /**
   * 停止副作用
   */
  stop() {
    this.active = false
  }
}

/**
 * 对外 API，创建并立即执行副作用函数
 * @param fn 副作用函数
 * @param options 可选配置，例如 scheduler
 */
export function effect<T = any>(
  fn: () => T,
  options: { scheduler?: () => void } = {}
) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run() // 立即执行一次收集依赖
  return _effect
}
