export const patchAttr = (el: any, key: string, nextValue: any) => {
  if (!nextValue) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, nextValue)
  }
}
