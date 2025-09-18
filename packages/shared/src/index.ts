// check whether a value is array
export const isArray = Array.isArray

// check whether a value is function
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

// check whether a value is string
export const isString = (val: unknown): val is string => typeof val === 'string'

// check whether a value is symbol
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

// check whether a value is object
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

// check whether a key is a native event
export const isOn = (key: string) =>
  key.charCodeAt(0) === 111 /* o */ &&
  key.charCodeAt(1) === 110 /* n */ &&
  // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)

// extend object
export const extend = Object.assign
