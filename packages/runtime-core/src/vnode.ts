import {
  isString,
  isObject,
  isArray,
  isFunction,
  ShapeFlags,
  extend,
  normalizeClass,
  normalizeStyle,
} from '@vue-core/shared'
import { isProxy } from '@vue-core/reactivity'

/**
 * VNode 接口：虚拟 DOM 的基本数据结构
 */
export interface VNode {
  __v_isVNode: true
  type: any // 节点类型（标签 / 组件）
  props: any // 节点属性
  children: any // 子节点
  shapeFlag: number // 类型标记（位运算优化）
  [key: string]: any // 自定义属性
}

// 特殊 VNode 类型
export const Fragment = Symbol.for('v-fgt')
export const Text = Symbol.for('v-txt')
export const Comment = Symbol.for('v-cmt')
export const Static = Symbol.for('v-stc')

/**
 * 创建 VNode
 * - 处理 props、class/style 标准化
 * - 委托给 createBaseVNode 进一步处理
 */
export function createVNode(type: any, props?: any, children?: any): VNode {
  // class & style 标准化
  if (props) {
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
    if (isObject(style)) {
      // 响应状态对象需要克隆，因为它们可能会发生突变
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style)
      }
      props.style = normalizeStyle(style)
    }
  }

  // 将 vnode 类型信息编码为位图
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0

  return createBaseVNode(type, props, children, shapeFlag)
}

// 创建基础 VNode
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
    key: props && normalizeKey(props),
    children,
    shapeFlag,
  } as VNode

  normalizeChildren(vnode, children) // 标准化 children

  return vnode
}

// 标准化 children
function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  if (children == null) {
    children = null // 空节点
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN // 多个子节点
  } else if (isObject(children)) {
    type = ShapeFlags.SLOTS_CHILDREN // 插槽对象
  } else if (isFunction(children)) {
    type = ShapeFlags.SLOTS_CHILDREN // 插槽函数
  } else {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN // 文本节点
  }

  vnode.children = children
  vnode.shapeFlag |= type // // 更新 shapeFlag
}

// 判断对象是否为 VNode
export function isVNode(node: any): node is VNode {
  return node ? node.__v_isVNode === true : false
}

// 判断是否为相同的 VNode
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}

// 标准化 key
const normalizeKey = ({ key }: VNode) => {
  return key != null ? key : null
}
