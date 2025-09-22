// 判断是否为数组
export const isArray = Array.isArray

// 判断是否为函数
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

// 判断是否为字符串
export const isString = (val: unknown): val is string => typeof val === 'string'

// 判断是否为 Symbol
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

// 判断是否为对象（非 null 且类型为 object）
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

// 判断值是否发生变化（考虑 NaN 情况）
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

// 判断属性名是否是事件处理函数（以 on 开头且后面是大写字母）
export const isOn = (key: string) =>
  key.charCodeAt(0) === 111 /* o */ &&
  key.charCodeAt(1) === 110 /* n */ &&
  // 大写字母判断
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)

// 对象扩展/合并
export const extend = Object.assign

// 驼峰转连字符（camelCase -> kebab-case）
const hyphenateRE = /([A-Z])/g
export const hyphenate = (str: string): string =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
