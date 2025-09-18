/**
 * patchDOMProp: 更新 DOM 的 property
 * - 用于处理直接可作为元素属性的值（比如 input.value）
 */
export const patchDOMProp = (el: any, key: string, value: any) => {
  // 如果传入 null 或 undefined，直接清空
  if (value == null) {
    el[key] = ''
  } else {
    el[key] = value
  }
}
