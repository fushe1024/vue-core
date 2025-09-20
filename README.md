# vue-core

> 🌱 A simplified implementation of Vue 3 core modules — for learning and understanding Vue 3 source code.

[English](./README.md) | [简体中文](./README.zh-CN.md)

---

## 📖 Introduction

`vue-core` is a personal learning project by [fushe1024](https://github.com/fushe1024) that re-implements parts of the Vue 3 runtime.
The goal is to **understand how Vue 3 works internally** by coding simplified versions of its core modules.

⚠️ **Note:**
As Vue 3 evolves, its source code is constantly being optimized and refined.
This repository provides a **simplified version** of the implementation:

- Many **edge cases** and **special scenarios** are intentionally omitted
- The focus is on **clarity and learning**, not production readiness
- Some APIs may behave slightly differently from the official Vue 3 source

---

## 🔧 Implemented Modules

### shared

- Common utility functions: `isArray`, `isObject`, `isString`, `isFunction`, etc.

### reactivity

- Core reactive APIs: `reactive`, `ref`, `computed`, `effect`

### runtime-core (partial)

- **watch** — watches reactive data and executes callbacks
- **VNode** — `h`, `createVNode`, `vnode.ts`, `shapeFlags`
- **rendering & patching** (partial)

### runtime-dom (partial)

- **nodeOps.ts** — DOM operations (create, insert, remove, set text, etc.)
- **patchProps.ts** — Unified entry for updating props/attrs/events/class/style

---

## 🎯 Learning Goals

- Understand how **VNode (Virtual DOM nodes)** are created and normalized
- Learn how **patching props & events** works
- Explore how Vue separates **runtime-core** and **runtime-dom**
- Study **reactivity system** (`reactive`, `ref`, `computed`, `effect`)
- Understand **watch** behavior in runtime-core
- Study **shapeFlags** and bitwise optimizations
- Study Vue’s **Diff algorithm** for keyed children and LIS

---

## 🚀 Getting Started

Clone the repo:

```bash
git clone https://github.com/fushe1024/vue-core.git
cd vue-core
```

---

## 📚 References

- [Vue.js 3 Source Code](https://github.com/vuejs/core)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)

---

## 📝 Note

This project is **for learning purposes only**.
If you need the real Vue 3 framework, please visit [vuejs/core](https://github.com/vuejs/core).

---

## ⚖️ License

[MIT](https://github.com/fushe1024/vue-core/blob/main/LICENSE) license.

Copyright (c) 2025-present Cookie
