import { isObject, hasChanged } from '@vue-core/shared'
import { toReactive } from './reactive'
import { activeEffect } from './effect'
import { ReactiveFlags } from './constants'
import { Dep, createDep, addDep, triggerDep } from './dep'

/**
 * Ref 接口声明
 * - value: 当前值
 * - [ReactiveFlags.IS_REF]: 标记为 ref
 */
export interface Ref<T = any> {
  value: T
  [ReactiveFlags.IS_REF]: boolean
}

/**
 * 创建 ref
 */
export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value)
}

/**
 * RefImpl：ref 实现类
 * - 对象值会被递归转换为 reactive（除非已是 reactive 或 ref）
 * - getter 收集依赖，setter 触发依赖
 */
class RefImpl<T> {
  private _value: T // 响应式值
  private _rawValue: T // 原始值，用于比较是否变化
  public dep: Dep // 存储依赖的集合
  public [ReactiveFlags.IS_REF] = true

  constructor(value: T) {
    this._rawValue = value
    // 对象类型且未被 reactive/ref 包裹时进行响应式转换
    const shouldConvert =
      isObject(value) &&
      !(value as any)[ReactiveFlags.IS_REACTIVE] &&
      !(value as any)[ReactiveFlags.IS_REF]

    this._value = shouldConvert ? toReactive(value) : value
    this.dep = createDep(() => this.dep.clear())
  }

  get value() {
    // 收集依赖
    if (activeEffect) addDep(this.dep, activeEffect)
    return this._value
  }

  set value(newValue: T) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      // 对象类型且未被 reactive/ref 包裹时进行响应式转换
      const shouldConvert =
        isObject(newValue) &&
        !(newValue as any)[ReactiveFlags.IS_REACTIVE] &&
        !(newValue as any)[ReactiveFlags.IS_REF]
      this._value = shouldConvert ? toReactive(newValue) : newValue
      // 触发依赖
      triggerDep(this.dep, activeEffect)
    }
  }
}

/**
 * toRef：把对象的某个属性包装成 ref
 */
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  return new ObjectRefImpl(object, key)
}

/**
 * ObjectRefImpl：对象属性的 ref 实现
 */
class ObjectRefImpl<T extends object, K extends keyof T> implements Ref<T[K]> {
  public [ReactiveFlags.IS_REF] = true
  public dep: Dep

  constructor(private _object: T, private _key: K) {
    this.dep = createDep(() => this.dep.clear())
  }

  get value(): T[K] {
    if (activeEffect) addDep(this.dep, activeEffect)
    return this._object[this._key]
  }

  set value(newValue: T[K]) {
    if (newValue !== this._object[this._key]) {
      this._object[this._key] = newValue
      triggerDep(this.dep, activeEffect)
    }
  }
}

/**
 * toRefs：把对象的所有属性都转换为 ref
 */
export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  const result: any = {}
  for (const key in object) {
    result[key] = toRef(object, key)
  }
  return result
}
