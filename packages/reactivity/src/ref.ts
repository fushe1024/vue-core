import { isObject, hasChanged } from '@vue-core/shared'
import { toReactive } from './reactive'
import { activeEffect, trackEffect, triggerEffects } from './effect'
import { ReactiveFlags } from './constants'
import { type Dep, createDep } from './dep'

export interface Ref<T = any> {
  value: T
  [ReactiveFlags.IS_REF]: boolean
}

export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value)
}

/**
 * RefImpl：ref 的核心实现
 */
class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep: Dep
  public [ReactiveFlags.IS_REF] = true

  constructor(value: T) {
    this._rawValue = value
    this._value = isObject(value) ? toReactive(value) : value
    this.dep = createDep()
  }

  get value() {
    // 依赖收集
    trackRefValue(this)
    return this._value
  }

  set value(newValue: T) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = isObject(newValue) ? toReactive(newValue) : newValue
      // 触发依赖
      triggerRefValue(this)
    }
  }
}

/**
 * 收集 ref 依赖
 */
export function trackRefValue(ref: RefImpl<any>) {
  if (activeEffect) {
    trackEffect(ref.dep)
  }
}

/**
 * 触发 ref 依赖
 */
export function triggerRefValue(ref: RefImpl<any>) {
  triggerEffects(ref.dep)
}

/**
 * toRef：把对象的某个属性变成 ref
 */
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  return new ObjectRefImpl(object, key)
}

/**
 * ObjectRefImpl：包装对象的某个属性
 */
class ObjectRefImpl<T extends object, K extends keyof T> {
  public [ReactiveFlags.IS_REF] = true

  constructor(private _object: T, private _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newValue: T[K]) {
    this._object[this._key] = newValue
  }
}

/**
 * toRefs：把对象的所有属性变成 ref
 */
export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
