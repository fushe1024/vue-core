// 判断当前是否处于浏览器环境，如果有 document 就使用，否则为 null
const doc = (typeof document !== 'undefined' ? document : null) as Document

// nodeOps: 封装所有 DOM 基础操作，作为渲染器的“平台适配层”
// Vue 的 runtime-core 只依赖这些抽象方法，不直接调用浏览器 API
export const nodeOps = {
  /**
   * 将子节点 child 插入到父节点 parent 中
   * 如果传入 anchor，则插入到 anchor 之前；否则相当于 appendChild
   */
  insert: (child: Element, parent: Element, anchor: Element | null) => {
    parent.insertBefore(child, anchor || null)
  },

  /**
   * 从父节点中移除指定子节点 child
   * 如果 child 没有父节点，则不做任何操作
   */
  remove: (child: Element) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  /**
   * 创建一个指定标签名的元素节点
   * 如 createElement('div') -> <div></div>
   */
  createElement: (tag: string): Element => doc.createElement(tag),

  /**
   * 创建一个文本节点
   * 如 createText('hello') -> "hello"
   */
  createText: (text: string): Node => doc.createTextNode(text),

  /**
   * 创建一个注释节点
   * 如 createComment('todo') -> <!-- todo -->
   */
  createComment: (text: string): Node => doc.createComment(text),

  /**
   * 设置节点的文本内容（通常是文本节点）
   * 直接修改 node.nodeValue
   */
  setText: (node: Node, text: string) => {
    node.nodeValue = text
  },

  /**
   * 设置元素节点的文本内容
   * 会替换掉该元素下的所有子节点
   */
  setElementText: (el: Element, text: string) => {
    el.textContent = text
  },

  /**
   * 获取指定节点的父节点
   * 在 vnode diff 算法中，需要根据父节点进行插入或删除操作
   */
  parentNode: (node: Node) => node.parentNode as Element | null,

  /**
   * 获取指定节点的下一个兄弟节点
   * diff 算法在移动节点时需要用到
   */
  nextSibling: (node: Node) => node.nextSibling,

  /**
   * 通过选择器查询节点
   * Vue 的 createApp(App).mount('#app') 就依赖这个方法找到容器
   */
  querySelector: (selector: string) => doc.querySelector(selector),

  /**
   * 给元素设置作用域 ID（scoped CSS 用）
   * 会为元素添加一个空属性，比如 data-v-xxx
   */
  setScopeId(el: Element, id: string) {
    el.setAttribute(id, '')
  },
}
