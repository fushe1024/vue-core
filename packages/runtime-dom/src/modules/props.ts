// 更新 DOM 属性
export const patchDOMProp = (el: any, key: string, value: any) => {
  // null 或 undefined 则清空
  el[key] = value == null ? '' : value
}
