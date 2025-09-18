import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { extend } from '@vue-core/shared'

// 渲染器选项
const randerOptions = extend(nodeOps, { patchProp })

// 渲染器
export function createRenderer() {
  return randerOptions
}
