import { isString, isObject, isArray, isFunction } from '@vue-core/shared'
import { ShapeFlags } from './shapeFlags'

/**
 * VNode 接口：虚拟 DOM 的基本数据结构
 */
export interface VNode {
  __v_isVNode: true
  type: any // 节点类型（标签 / 组件）
  props: any // 节点属性
  children: any // 子节点
  shapeFlag: number // 类型标记（位运算优化）
}

// 特殊 VNode 类型
export const Fragment = Symbol.for('v-fgt')
export const Text = Symbol.for('v-txt')
export const Comment = Symbol.for('v-cmt')
export const Static = Symbol.for('v-stc')

/**
 * 创建 VNode
 * - 根据 type 判断是 element 还是 component
 * - 委托给 createBaseVNode 进一步处理
 */
export function createVNode(type: any, props?: any, children?: any): VNode {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0

  return createBaseVNode(type, props, children, shapeFlag)
}

/**
 * 创建基础 VNode
 */
function createBaseVNode(
  type: any,
  props?: any,
  children?: any,
  shapeFlag: number = 0
): VNode {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    shapeFlag,
  } as VNode

  // 标准化 children
  normalizeChildren(vnode, children)

  return vnode
}

/**
 * 标准化 children
 * - null → 空
 * - array → 多个子节点
 * - object → 插槽对象
 * - function → 插槽函数
 * - string/number → 文本节点
 */
function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    // 多个子节点
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (isObject(children)) {
    // 插槽对象
    type = ShapeFlags.SLOTS_CHILDREN
  } else if (isFunction(children)) {
    // 插槽函数
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    // 普通文本
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.children = children
  vnode.shapeFlag |= type // vnode.shapeFlag = vnode.shapeFlag | type
}

/**
 * 判断对象是否为 VNode
 */
export function isVNode(node: any): node is VNode {
  return node ? node.__v_isVNode === true : false
}
