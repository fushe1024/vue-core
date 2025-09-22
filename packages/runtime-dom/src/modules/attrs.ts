// 设置或移除元素属性
export const patchAttr = (el: any, key: string, nextValue: any) => {
  if (!nextValue) {
    el.removeAttribute(key) // 移除属性
  } else {
    el.setAttribute(key, nextValue) // 设置属性
  }
}
