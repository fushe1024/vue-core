import { type Ref, trackRefValue, triggerRefValue } from './ref'
import { ReactiveEffect } from './effect'
import { isFunction } from '@vue-core/shared'
import { ReactiveFlags } from './constants'
import { type Dep, createDep } from './dep'

export interface ComputedRef<T> extends Ref<T> {}

class ComputedRefImpl<T> implements ComputedRef<T> {
  private _value!: T
  private _dirty = true
  private effect: ReactiveEffect<T>
  public dep: Dep = createDep()
  public [ReactiveFlags.IS_REF] = true

  constructor(getter: () => T, private setter?: (v: T) => void) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this as any) // 触发外部依赖
      }
    })
  }

  get value(): T {
    trackRefValue(this as any) // 收集外部依赖
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()!
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
