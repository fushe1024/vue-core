import { isObject, isArray } from '@vue-core/shared'
import { isVNode, VNode, createVNode } from './vnode'

/**
 * h 函数：用户侧创建 VNode 的入口
 * - 作用：对参数 (type, props, children) 进行标准化
 * - 最终统一调用 createVNode 生成 VNode
 */
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length

  if (l === 2) {
    // 情况 1：h('div', { id: 'foo' })
    // 情况 2：h('div', h('span'))
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        // 如果是单个 VNode，当作 children 处理
        return createVNode(type, null, [propsOrChildren])
      }
      // 否则当作 props
      return createVNode(type, propsOrChildren)
    } else {
      // 情况 3：h('div', 'text') 或 h('div', [vnode1, vnode2])
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    // 传入多个 children 时：h('div', {}, vnode1, vnode2, vnode3)
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    }
    // 单个 vnode children 时，统一包成数组
    else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
