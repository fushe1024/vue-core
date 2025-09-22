import { computed as _computed } from '@vue-core/reactivity'

// 计算属性, 注意：去掉了 debugOptions 和 SSR 支持
export const computed = (getterOrOptions: any) => {
  return _computed(getterOrOptions)
}
