# vue-core

> 🌱 一个用于学习和理解 Vue 3 源码的简化版实现。

[English](./README.md) | [简体中文](./README.zh-CN.md)

---

## 📖 项目介绍

`vue-core` 是 [fushe1024](https://github.com/fushe1024) 的个人学习项目，通过重新实现 Vue 3 运行时的一些核心模块，帮助更好地理解其底层原理。

⚠️ **注意事项：**
由于 Vue 3 的源码仍在不断优化和演进，本仓库的实现与官方源码可能存在一些差异：

- 对很多 **特殊边界情况** 做了简化或省略
- 更注重 **核心思想** 和 **学习体验**，而非完整性
- 部分 API 行为可能与官方实现略有不同

---

## 🔧 已实现的模块

### shared

- 常用工具函数：`isArray`、`isObject`、`isString`、`isFunction` 等

### reactivity

- 核心响应式 API：`reactive`、`ref`、`computed`、`effect`

### runtime-core（部分）

- **watch** —— 用于监听响应式数据并执行回调
- **VNode 相关**：`h`、`createVNode`、`vnode.ts`、`shapeFlags`
- **渲染和 patch 算法**（部分）

### runtime-dom（部分）

- **nodeOps.ts** —— DOM 操作（创建、插入、删除、设置文本等）
- **patchProps.ts** —— 统一处理 `props / attrs / events / class / style` 的更新

---

## 🎯 学习目标

- 理解 **VNode（虚拟 DOM 节点）** 的创建和标准化过程
- 学习 **属性与事件更新机制** 的实现方式
- 掌握 Vue 中 **runtime-core** 与 **runtime-dom** 的分工与协作
- 学习 **响应式系统**（`reactive`、`ref`、`computed`、`effect`）
- 理解 **watch** 在 runtime-core 中的作用
- 掌握 **shapeFlags** 及按位运算优化
- 掌握 Vue 的 **Diff 算法**，包括 keyed children 和 最长递增子序列 (LIS)

---

## 🚀 使用方法

克隆仓库：

```bash
git clone https://github.com/fushe1024/vue-core.git
cd vue-core
```

---

## 📚 参考资料

- [Vue.js 3 源码](https://github.com/vuejs/core)
- [Vue.js 官方文档](https://cn.vuejs.org/guide/introduction.html)

---

## 📝 说明

本项目仅作为 **学习用途**。
如果你需要真正的 Vue 3 框架，请访问 [vuejs/core](https://github.com/vuejs/core)。

---

## ⚖️ License

[MIT](https://github.com/fushe1024/vue-core/blob/main/LICENSE) license.

Copyright (c) 2025-present Cookie
