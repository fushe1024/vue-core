import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchEvent } from './modules/events'
import { isOn } from '@vue-core/shared'

/**
 * 统一更新 DOM 属性的函数
 * - vnode diff 过程中调用
 * - 根据 key 分发到对应的处理逻辑
 */
export const patchProp = (
  el: Element,
  key: string,
  prevValue: any,
  nextValue: any
) => {
  if (key === 'class') {
    // 类名处理
    patchClass(el, nextValue)
  } else if (key === 'style') {
    // 样式处理
    patchStyle(el, prevValue, nextValue)
  } else if (isOn(key)) {
    // 事件处理
    patchEvent(el, key, prevValue, nextValue)
  } else if (shouldSetAsProp(el, key)) {
    // 作为 DOM property 设置
    patchDOMProp(el, key, nextValue)
  } else {
    // 否则作为 attribute 设置
    patchAttr(el, key, nextValue)
  }
}

/**
 * 判断属性是否应该作为 DOM property 设置
 * - 规则：一般能在 DOM 对象上直接访问的 key 用 property
 * - 特殊情况：form 属性必须走 setAttribute，避免覆盖 form 属性
 */
function shouldSetAsProp(el: Element, key: string): boolean {
  if (key === 'form' && el.tagName === 'INPUT') {
    return false
  }
  return key in el
}
