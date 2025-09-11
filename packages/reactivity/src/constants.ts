/**
 * track 操作类型枚举
 * 用于依赖收集阶段标识不同操作
 */
export enum TrackOpTypes {
  GET = 'get', // 对象属性读取
  HAS = 'has', // in 操作符检查
  ITERATE = 'iterate', // 遍历操作，例如 for...in / Object.keys
}

/**
 * trigger 操作类型枚举
 * 用于触发依赖更新阶段标识不同操作
 */
export enum TriggerOpTypes {
  SET = 'set', // 对已有属性赋值
  ADD = 'add', // 新增属性
  DELETE = 'delete', // 删除属性
  CLEAR = 'clear', // 清空集合，例如 Map / Set
}

/**
 * 响应式对象特殊标记
 * 用于标记对象状态或元信息
 */
export enum ReactiveFlags {
  SKIP = '__v_skip', // 跳过 reactive / readonly
  IS_REACTIVE = '__v_isReactive', // 标记为 reactive
  IS_READONLY = '__v_isReadonly', // 标记为 readonly
  IS_SHALLOW = '__v_isShallow', // 标记为 shallow reactive
  RAW = '__v_raw', // 存储原始对象引用
  IS_REF = '__v_isRef', // 标记为 ref 对象
}
