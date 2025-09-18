type Style = Record<string, string> | null

/**
 * patchStyle: 更新元素 style
 * - 仅处理对象形式的 style
 * - prev 中有但 next 没有的样式会被移除
 */
export const patchStyle = (el: Element, prev: Style, next: Style) => {
  const style = (el as HTMLElement).style

  // 移除 prev 中 next 没有的样式
  if (prev) {
    for (const key in prev) {
      if (!next || !(key in next)) {
        style[key as any] = ''
      }
    }
  }

  // 更新 next 样式
  if (next) {
    for (const key in next) {
      if (!prev || prev[key] !== next[key]) {
        style[key as any] = next[key]
      }
    }
  }
}
