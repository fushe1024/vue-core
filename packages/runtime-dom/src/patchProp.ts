import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchEvent } from './modules/events'
import { isOn } from '@vue-core/shared'

// 统一更新 DOM 属性，根据 key 分发到对应逻辑
export const patchProp = (
  el: Element,
  key: string,
  prevValue: any,
  nextValue: any
) => {
  if (key === 'class') {
    patchClass(el, nextValue) // 类名处理
  } else if (key === 'style') {
    patchStyle(el, prevValue, nextValue) // 样式处理
  } else if (isOn(key)) {
    patchEvent(el, key, prevValue, nextValue) // 事件处理
  } else if (shouldSetAsProp(el, key)) {
    patchDOMProp(el, key, nextValue) // 作为 DOM property 设置
  } else {
    patchAttr(el, key, nextValue) // 作为 attribute 设置
  }
}

// 判断属性是否应作为 DOM property 设置
function shouldSetAsProp(el: Element, key: string): boolean {
  if (key === 'form' && el.tagName === 'INPUT') {
    return false // 特殊表单属性
  }
  return key in el // 能在 DOM 对象上访问的 key 使用 property
}
