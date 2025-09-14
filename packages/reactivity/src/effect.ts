import { type Dep } from './dep'

/** 当前正在执行的副作用 */
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  scheduler?: () => void

  constructor(public fn: () => T, scheduler?: () => void) {
    if (scheduler) this.scheduler = scheduler
  }

  run() {
    if (!this.active) return this.fn()

    const lastEffect = activeEffect
    try {
      activeEffect = this
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }
  }
}

/* 清理 effect 对 dep 的依赖关系 */
export function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

/* 收集依赖 */
export function trackEffect(dep: Dep) {
  if (!activeEffect) return
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

/* 触发依赖 */
export function triggerEffects(dep: Dep) {
  const effects = new Set(dep)
  for (const effect of effects) {
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  }
}

/** 对外 API */
export function effect<T = any>(
  fn: () => T,
  options: { scheduler?: () => void } = {}
) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  return _effect
}
