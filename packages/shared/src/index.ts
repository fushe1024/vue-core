/**
 * 检查值是否为对象
 * @param val 要检查的值
 * @returns 如果值是对象（非 null 且类型为 'object'），则返回 true；否则返回 false
 */
export function isObject(val: unknown) {
  return val !== null && typeof val === 'object'
}
