// 设置或移除元素 class
export function patchClass(el: Element, value: string | null) {
  if (value == null) {
    el.removeAttribute('class') // 移除 class
  } else {
    el.className = value // 设置 class
  }
}
