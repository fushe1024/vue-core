import { hyphenate, isArray, isObject, isString } from './general'

export type NormalizedStyle = Record<string, string | number>

// 样式归一化：将数组、字符串或对象统一转换为对象形式
export function normalizeStyle(
  value: unknown
): NormalizedStyle | string | undefined {
  if (isArray(value)) {
    const res: NormalizedStyle = {}
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const normalized = isString(item)
        ? parseStringStyle(item) // 字符串样式解析为对象
        : (normalizeStyle(item) as NormalizedStyle) // 递归归一化数组/对象
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key] // 合并对象样式
        }
      }
    }
    return res
  } else if (isString(value) || isObject(value)) {
    return value
  }
}

// 分割符和注释正则
const listDelimiterRE = /;(?![^(]*\))/g // 分号分隔（忽略括号内的分号）
const propertyDelimiterRE = /:([^]+)/ // 冒号分隔 key 和 value
const styleCommentRE = /\/\*[^]*?\*\//g // 去掉 CSS 注释

// 将字符串形式的 CSS 转成对象
export function parseStringStyle(cssText: string): NormalizedStyle {
  const ret: NormalizedStyle = {}
  cssText
    .replace(styleCommentRE, '') // 移除注释
    .split(listDelimiterRE) // 按分号拆分每个样式
    .forEach(item => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE)
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
      }
    })
  return ret
}

// 对象样式转字符串形式（行内 style）
export function stringifyStyle(
  styles: NormalizedStyle | string | undefined
): string {
  let ret = ''
  if (!styles || isString(styles)) return ret
  for (const key in styles) {
    const value = styles[key]
    if (isString(value) || typeof value === 'number') {
      const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key) // 驼峰转连字符
      ret += `${normalizedKey}:${value};` // 拼接成 CSS 字符串
    }
  }
  return ret
}

// class 归一化：字符串、数组、对象都能转换成空格分隔的字符串
export function normalizeClass(value: unknown): string {
  let res = ''
  if (isString(value)) {
    res = value
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]) // 递归处理数组
      if (normalized) res += normalized + ' '
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) res += name + ' ' // 对象键为真则添加
    }
  }
  return res.trim()
}

// props 归一化：处理 class 和 style
export function normalizeProps(props: Record<string, any> | null) {
  if (!props) return null
  let { class: klass, style } = props
  if (klass && !isString(klass)) props.class = normalizeClass(klass)
  if (style) props.style = normalizeStyle(style)
  return props
}
