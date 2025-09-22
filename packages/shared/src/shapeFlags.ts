export enum ShapeFlags {
  ELEMENT = 1, // 普通 HTML 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态组件（对象式组件）
  TEXT_CHILDREN = 1 << 3, // 子节点是文本
  ARRAY_CHILDREN = 1 << 4, // 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 子节点是插槽对象
  TELEPORT = 1 << 6, // teleport 节点
  SUSPENSE = 1 << 7, // suspense 节点
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 组件应被 keep-alive
  COMPONENT_KEPT_ALIVE = 1 << 9, // 组件被 keep-alive 缓存
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, // 泛指组件（状态组件或函数组件）
}
