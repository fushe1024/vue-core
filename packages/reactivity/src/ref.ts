import { toReactive } from './reactive'
import { activeEffect } from './effect'

/**
 * ref 函数
 * @param value 原始值
 * @returns 响应式对象
 */
export function ref<T>(value: T) {
  return createRef(value)
}

/**
 * 创建 ref 对象
 * @param value 原始值
 * @returns 响应式对象
 */
function createRef<T>(value: T) {
  return new RefImpl(value)
}

/**
 * ref 类
 * @description ref 类用于创建响应式对象
 * @param rawValue 原始值
 * @returns 响应式对象
 */
class RefImpl<T> {
  public __v_isRef = true // 标记是 ref
  private _value: T // 响应式值
  public dep?: Set<any> // 依赖收集容器

  constructor(rawValue: T) {
    // 如果是对象则转成 reactive，否则保持原值
    this._value = toReactive(rawValue)
  }

  get value() {
    // 依赖收集
    trackRefValue(this)
    return this._value
  }

  set value(newValue: T) {
    if (newValue !== this._value) {
      this._value = toReactive(newValue)
      // 触发更新
      triggerRefValue(this)
    }
  }
}

/**
 * 依赖收集
 * @param ref
 */
export function trackRefValue(ref: RefImpl<any>) {
  if (activeEffect) {
    // 初始化 dep
    if (!ref.dep) {
      ref.dep = new Set()
    }
    // 将当前 effect 添加到依赖集合
    ref.dep.add(activeEffect)
  }
}

/**
 * 触发更新
 * @param ref
 */
export function triggerRefValue(ref: RefImpl<any>) {
  if (ref.dep) {
    ref.dep.forEach(effectFn => {
      if (effectFn.scheduler) {
        effectFn.scheduler()
      } else {
        effectFn.run()
      }
    })
  }
}
