# vue-core

> 🌱 A simplified implementation of Vue 3 core modules — for learning and understanding Vue 3 source code.

[English](./README.md) | [简体中文](./README.zh-CN.md)

---

## 📖 Introduction

`vue-core` is a personal learning project that re-implements parts of the Vue 3 runtime.  
The goal is to **understand how Vue 3 works internally** by coding simplified versions of its core modules.

⚠️ **Note:**  
As Vue 3 evolves, its source code is constantly being optimized and refined.  
This repository provides a **simplified version** of the implementation:

- Many **edge cases** and **special scenarios** are intentionally omitted
- The focus is on **clarity and learning**, not production readiness
- Therefore, some APIs may behave slightly differently from the official Vue 3 source

---

## 🔧 Implemented Modules

### runtime-dom

- **nodeOps.ts** — DOM operations (create, insert, remove, set text, etc.)
- **patchProps.ts** — Unified entry for updating props/attrs/events/class/style

### runtime-core

- **h.ts** — `h` function for creating VNodes
- **vnode.ts** — VNode structure and helpers
- _(more WIP...)_

### shared

- Common utilities like `isArray`, `isObject`, `isString`, etc.

---

## 🎯 Learning Goals

- Understand how **VNode (Virtual DOM nodes)** are created and normalized
- Learn how **patching props & events** works
- Explore how Vue separates **runtime-core** and **runtime-dom**
- Dive into **shapeFlags** and bitwise optimization
- Study how **diffing algorithms** (like keyed children & LIS) are applied

---

## 🚀 Getting Started

Clone the repo:

```bash
git clone https://github.com/your-username/vue-core.git
cd vue-core
```
