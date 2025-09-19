# vue-core

> 🌱 一个用于学习和理解 Vue 3 源码的简化版实现。

[简体中文](./README.zh-CN.md) | [English](./README.md)

---

## 📖 项目介绍

`vue-core` 是一个个人学习项目，通过重新实现 Vue 3 运行时的一些核心模块，帮助更好地理解其底层原理。

⚠️ **注意事项：**  
由于 Vue 3 的源码仍在不断优化和演进，本仓库的实现与官方源码可能存在一些差异：

- 对很多 **特殊边界情况** 做了简化或省略
- 更注重 **核心思想** 和 **学习体验**，而非完整性
- 部分 API 行为可能与官方实现略有不同

---

## 🔧 已实现的模块

### runtime-dom

- **nodeOps.ts** —— DOM 基础操作（创建、插入、删除、设置文本等）
- **patchProps.ts** —— 统一处理 `props / attrs / events / class / style` 的更新

### runtime-core

- **h.ts** —— `h` 函数，用于创建 VNode
- **vnode.ts** —— VNode 数据结构与工具函数
- _(更多模块正在实现中...)_

### shared

- 常用工具方法，例如 `isArray`、`isObject`、`isString` 等

---

## 🎯 学习目标

- 理解 **VNode（虚拟 DOM 节点）** 的创建和标准化过程
- 学习 **属性与事件更新机制** 的实现方式
- 掌握 Vue 中 **runtime-core** 与 **runtime-dom** 的分工与协作
- 深入理解 **shapeFlags** 以及按位运算优化
- 研究 Vue 中的 **Diff 算法**，包括 keyed children 和 最长递增子序列 (LIS)

---

## 🚀 使用方法

克隆仓库：

```bash
git clone https://github.com/your-username/vue-core.git
cd vue-core
```
