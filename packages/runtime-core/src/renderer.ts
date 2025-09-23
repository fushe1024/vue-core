import { isSameVNodeType, VNode } from './vnode'
import { ShapeFlags } from '@vue-core/shared'

// 创建渲染器
export function createRenderer(renderOptions: any) {
  return baseCreateRenderer(renderOptions)
}

function baseCreateRenderer(options: any): any {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId,
    insertStaticContent: hostInsertStaticContent,
  } = options

  // 挂载单个元素
  const mountElement = (vnode: VNode, container: any) => {
    const { type, props, children } = vnode

    const el = (vnode.el = hostCreateElement(type)) // 创建元素

    // 处理 props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    // 处理子节点
    if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children) // 文本子节点
    } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el) // 数组子节点
    }

    hostInsert(el, container) // 插入到容器
  }

  // 挂载子节点数组
  const mountChildren = (children: VNode[], container: any) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  // 卸载 vnode
  const unmount = (vnode: VNode) => {
    hostRemove(vnode.el)
  }

  // 卸载子节点数组：卸载数组中的每个 vnode
  const unmountChildren = (children: VNode[]) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }

  // 更新 props
  const patchProps = (el: Element, oldProps: any, newProps: any) => {
    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }

    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key])
    }
  }

  // 更新 children
  const patchChildren = (n1: VNode, n2: VNode, container: Element) => {
    const c1 = n1 && n1.children
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    const c2 = n2.children

    const { shapeFlag } = n2

    // 若 新子节点是文本：
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 若旧是数组：卸载旧数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
      }
      // 若旧是文本且内容不同：直接更新文本
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      // 若 新子节点不是文本（意味着可能是数组或空）：

      // 若旧是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 若新也是数组 => diff 算法
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(c1, c2, container) // 处理 keyed 子节点的 diff 算法
        } else {
          // 若新不是数组：卸载旧数组
          unmountChildren(c1)
        }
      } else {
        // 若旧不是数组（即旧是文本或空）：

        // 若旧是文本：先清空文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, '')
        }

        // 若新是数组：挂载新数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, container)
        }
      }
    }
  }

  // 处理 keyed 子节点的 diff 算法
  const patchKeyedChildren = (
    c1: VNode[],
    c2: VNode[],
    container: Element
  ) => {}

  // 更新元素
  const patchElement = (n1: VNode, n2: VNode) => {
    const el = (n2.el = n1.el) // 复用旧元素

    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 先更新 props
    patchProps(el, oldProps, newProps)

    // 再更新 children
    patchChildren(n1, n2, el)
  }

  // 处理元素节点
  const processElement = (n1: VNode | null, n2: VNode, container: Element) => {
    if (n1 === null) {
      mountElement(n2, container) // 挂载新元素
    } else {
      // 相同类型元素，更新元素 props 和 children
      patchElement(n1, n2)
    }
  }

  // 补丁函数：挂载或更新 vnode
  const patch = (n1: VNode | null, n2: VNode, container: Element) => {
    if (n1 === n2) {
      return
    }

    // 不同类型的 VNode，卸载旧节点并挂载新节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1)
      n1 = null
    }

    processElement(n1, n2, container)
  }

  // 渲染函数：渲染或卸载 vnode
  const render = (vnode: VNode | null, container: any) => {
    // 如果 vnode 为 null，且容器有旧的 vnode，卸载旧的 vnode
    if (vnode === null) {
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container) // 挂载或更新
      container._vnode = vnode // 更新容器的 vnode 引用
    }
  }

  return {
    render,
  }
}
