import { VNode } from './vnode'
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

  // 挂载子节点数组
  const mountChildren = (children: VNode[], container: any) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  // 挂载单个元素
  const mountElement = (vnode: VNode, container: any) => {
    const { type, props, children } = vnode

    const el = hostCreateElement(type) // 创建元素

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

  // 补丁函数：挂载或更新 vnode
  const patch = (n1: VNode | null, n2: VNode, container: Element) => {
    if (n1 === n2) return
    if (n1 === null) {
      mountElement(n2, container) // 挂载新节点
    }
  }

  // 渲染函数：渲染或卸载 vnode
  const render = (vnode: VNode, container: any) => {
    if (vnode === null) {
      if (container._vnode) {
        hostRemove(container._vnode) // 卸载
      }
    } else {
      patch(container._vnode || null, vnode, container) // 挂载或更新
      container._vnode = vnode
    }
  }

  return {
    render,
  }
}
