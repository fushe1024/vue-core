const veiKey = Symbol('_vei')

export const patchEvent = (
  el: any,
  rawName: string,
  prevValue: any,
  nextValue: any
) => {
  // 存放事件 invoker 的缓存对象
  const invokers = el[veiKey] || (el[veiKey] = {})
  const existingInvoker = invokers[rawName]
  const eventName = rawName.slice(2).toLowerCase()

  if (nextValue && existingInvoker) {
    // 已绑定 → 直接更新回调
    return (existingInvoker.fn = nextValue)
  }

  if (nextValue) {
    // 新增绑定
    const invoker = (invokers[rawName] = createInvoker(nextValue))
    return el.addEventListener(eventName, invoker)
  }

  if (existingInvoker) {
    // 移除绑定
    el.removeEventListener(eventName, existingInvoker)
    invokers[rawName] = null
  }
}

/**
 * 创建可更新回调的事件包装器
 * - DOM 上只绑定一次 invoker
 * - 更新时仅修改 invoker.fn，避免反复解绑/绑定
 */
function createInvoker(fn: Function) {
  const invoker = (e: Event) => invoker.fn(e)
  invoker.fn = fn
  return invoker
}
