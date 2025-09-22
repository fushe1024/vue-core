type Style = Record<string, string> | null

// 更新元素 style
export const patchStyle = (el: Element, prev: Style, next: Style) => {
  const style = (el as HTMLElement).style

  // 移除 prev 中不存在于 next 的样式
  if (prev) {
    for (const key in prev) {
      if (!next || !(key in next)) {
        style[key as any] = ''
      }
    }
  }

  // 更新或新增 next 中的样式
  if (next) {
    for (const key in next) {
      if (!prev || prev[key] !== next[key]) {
        style[key as any] = next[key]
      }
    }
  }
}
