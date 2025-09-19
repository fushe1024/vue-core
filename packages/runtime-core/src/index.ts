// Core API ------------------------------------------------------------------
export {
  // core
  ref,
  reactive,
  toRef,
  toRefs,
  isRef,
  isProxy,
  isReactive,
  isReadonly,
  isShallow,
  // effect
  effect,
  ReactiveEffect,
  // computed
  computed,
} from '@vue-core/reactivity'
export { watch, watchEffect } from './apiWatch'
export { h } from './h'
export { createRenderer } from './renderer'
