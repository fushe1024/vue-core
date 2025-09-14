import { isFunction } from '@vue-core/shared'
import { type Ref, trackRefValue, triggerRefValue } from './ref'
import { ReactiveEffect } from './effect'
import { ReactiveFlags } from './constants'

export interface ComputedRef<T> extends Ref<T> {}

/**
 * ComputedRef 实现类
 */
class ComputedRefImpl<T> implements ComputedRef<T> {
  private _value!: T
  private _dirty = true
  private effect: ReactiveEffect<T>
  public [ReactiveFlags.IS_REF] = true

  constructor(getter: () => T, private setter?: (v: T) => void) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this as any) // 通知外部依赖更新
      }
    })
  }

  get value(): T {
    trackRefValue(this as any) // 收集依赖
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  set value(newValue: T) {
    if (this.setter) {
      this.setter(newValue)
    } else {
      console.warn('Write operation failed: computed value is readonly')
    }
  }
}

/**
 * computed API
 */
export function computed<T>(
  getterOrOptions: (() => T) | { get: () => T; set: (v: T) => void }
): ComputedRef<T> {
  let getter: () => T
  let setter: ((v: T) => void) | undefined

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = undefined
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}
