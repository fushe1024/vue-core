// Symbol 用于在元素上存储事件缓存
const veiKey = Symbol('_vei')

// 绑定、更新或移除事件
export const patchEvent = (
  el: any,
  rawName: string,
  prevValue: any,
  nextValue: any
) => {
  const invokers = el[veiKey] || (el[veiKey] = {}) // 存放事件缓存
  const existingInvoker = invokers[rawName]
  const eventName = rawName.slice(2).toLowerCase() // 去掉 "on" 前缀并转小写

  if (nextValue && existingInvoker) {
    invokerUpdate(existingInvoker, nextValue)
    return
  }

  if (nextValue) {
    // 新增事件绑定
    const invoker = (invokers[rawName] = createInvoker(nextValue))
    el.addEventListener(eventName, invoker)
    return
  }

  if (existingInvoker) {
    // 移除事件
    el.removeEventListener(eventName, existingInvoker)
    invokers[rawName] = null
  }
}

// 创建事件包装器，只绑定一次，支持更新回调
function createInvoker(fn: Function) {
  const invoker = (e: Event) => invoker.fn(e)
  invoker.fn = fn
  return invoker
}

// 更新已有 invoker 的回调
function invokerUpdate(invoker: any, fn: Function) {
  invoker.fn = fn
}
