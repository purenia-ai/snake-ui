---
name: 'use-comp-relation'
description: 'Snake UI useParent / useChildren 组件关系引擎参考。移植成对组件、注入契约或 use-comp-relation 相关问题时按需读取。'
triggers: ['use-comp-relation', 'useParent', 'useChildren']
---

# useParent / useChildren

成对组件（group/item 型）的父子关系引擎，provide/inject 底座（wot/Vant 血统），
替代早期按组件 `name` 爬 `$parent` 链的 useCompRelation 方案：

```ts
import { useChildren, useParent } from '@puresnake/snake-ui';

// 父组件：两行接入，props 实时联动 + 方法下发
const { children, linkChildren } = useChildren(CHECKBOX_GROUP_KEY);
linkChildren({ props, changeSelectState });

// 子组件：一行接入，自动注册 / 注销，拿到响应式下标
const { parent: checkboxGroup, index } = useParent(CHECKBOX_GROUP_KEY);
// 之后 checkboxGroup.value?.props.size 直接响应式读取
```

- `children` 是子组件公开代理的响应式数组，`defineExpose` 暴露的 ref 已解包
  （`child.isChecked` 直接是 boolean），且始终按模板渲染顺序排列（v-for / slot 下注册序 ≠ 渲染序的问题已处理）
- `useParent` 返回 `null` 兜底，子组件可独立使用；仅在 MP-TOUTIAO 下注入延迟到 onMounted
- 需要原始 ref（如写入子项状态）时用 `child.$.exposed.xxx.value`

## 注入键放哪

一律放**父组件的 `types.ts`**，契约跟着提供方走：`snake-form/types.ts` 的 `formKey`、
`snake-form-item/types.ts` 的 `formItemKey`、`snake-drop-menu/types.ts` 的 `dropMenuKey`、
`snake-index-list/types.ts` 的 `indexListKey`、`snake-checkbox-group/types.ts` 的 `CHECKBOX_GROUP_KEY`。
约束：libs 层禁止反向依赖 components（架构测试守卫）；component-contracts 测试要求导出接口的
每个成员带 JSDoc；index-list 这类带共享纯函数（`resolveIndex` 等）的契约也一并放其 `types.ts`。

## 移植 uview-pro 成对组件的写法对照

| uview-pro 写法                                      | snake-ui 对应                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `useParent('u-collapse')` 收集子项                  | `const { children, linkChildren } = useChildren(COLLAPSE_KEY)` + `linkChildren({ props, 方法 })` |
| `useChildren('u-collapse-item', 'u-collapse')` 找爹 | `const { parent } = useParent(COLLAPSE_KEY)`，`parent.value?.props.xxx` 响应式读取               |
| `broadcast('xxx', data)`                            | `children.forEach(child => child.xxx?.(data))`，有类型                                           |
| `emitToParent('xxx', data)`                         | `parent.value?.xxx(data)`，有类型                                                                |
| `parentExposed.value?.props.size` 读父配置          | 契约里放 `props`（响应式对象），直接读                                                           |
| 子项 `getChildIndex()`                              | `useParent` 返回的响应式 `index`                                                                 |

接入步骤：① 父组件 `types.ts` 定义 `XxxContext` + `InjectionKey`（引用本组件 Props 类型）；
② 父组件 `useChildren(KEY)` + 在方法定义之后 `linkChildren({ props, 方法 })`；
③ 子组件 `useParent(KEY)` 读取 / 调用。同一对组件只用这一套通道，不再叠加组件名爬链或 broadcast。

> 旧 `useParent('Name')` / `useChildren('Child', 'Parent')` / `hasParent` / `getParentContextByName`
> 已随 useCompRelation 移除（名串匹配、500ms 重试、无类型），迁移时按上表改写。
