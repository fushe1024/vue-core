import { VNode, createRenderer } from '@vue-core/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { extend } from '@vue-core/shared'

// 将 DOM 操作和属性更新方法合并成渲染器选项
const renderOptions = extend(nodeOps, { patchProp })

// 渲染 VNode 到容器
export const render = (vnode: VNode, container: Element) => {
  return createRenderer(renderOptions).render(vnode, container)
}

// 创建应用实例
export const createApp = (rootComponent: any) => {
  return {}
}

// 导出 runtime-core API
export * from '@vue-core/runtime-core'
