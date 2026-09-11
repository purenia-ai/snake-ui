# useParent / useChildren / hasParent

按组件 `name` 链建立父子关系，供跨层级组件协作：

```ts
import { hasParent, useChildren, useParent } from '@puresnake/snake-ui';

// 父组件：收集名为 Checkbox 的子组件
useChildren('Checkbox');

// 子组件：向上查找 CheckboxGroup
const group = useParent('CheckboxGroup');
const inGroup = hasParent('CheckboxGroup');
```

找不到父组件时 `useParent` 返回 `null`。另提供 `getParentContextByName(name)` 与 `cleanupComponentRelations()`；库内原生表单族仍用类型化的 `internal/` InjectionKey 方案，二者并存。

## 移植成对组件时选哪套

从 uview-pro 搬运成对组件（group/item 型）时，按配对复杂度选轨道：

| 轨道                      | 适用                                                           | 仓内示例                                       |
| ------------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| `useCompRelation`（本页） | 薄配对：子项读父的几个 prop、同步选中/禁用，追求与上游最小差异 | checkbox ↔ checkbox-group、radio ↔ radio-group |
| `internal/` InjectionKey  | 厚契约：带校验、方法调用、多状态下发                           | form 全家、drop-menu 一对、index-list 一家     |

判定：只是「子项取值 + 汇报」直接沿用 useCompRelation 零翻译；父要调子的方法、或下发的响应式字段超过三五个，就写 `internal/xxx.ts` 类型化契约。同一对组件只用一套，不要混搭。

### uview-pro → snake-ui 写法对照

| uview-pro 写法                                 | 薄配对（直接沿用）                        | 厚契约（internal/）                                           |
| ---------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `useParent('u-collapse')` 收集子项             | `useParent('Collapse')`                   | `provide(collapseKey, ctx)`，ctx 含 `register` / `unregister` |
| `useChildren('u-collapse-item', 'u-collapse')` | `useChildren('CollapseItem', 'Collapse')` | `inject(collapseKey, null)`，null 兜底独立使用                |
| `broadcast('xxx', data)`                       | 原样                                      | 直接 `ctx.xxx(data)`，有类型                                  |
| `parentExposed.value?.props.size` 读父配置     | 原样                                      | 契约里放响应式 `Ref`，inject 拿到即响应式                     |
| 子项 `getChildIndex()`                         | 原样                                      | `register()` 返回下标，或 ctx 暴露 `indexOf`                  |

匹配串是组件 `defineOptions({ name })` 的值，仓内约定不带 `snake-` 前缀（如 `'Checkbox'`）。

### internal/ 契约模板

厚契约轨道参照 `libs/internal/form.ts`：

```ts
// libs/internal/collapse.ts
import type { InjectionKey, Ref } from 'vue';

export interface CollapseContext {
    activeNames: Ref<string[]>;
    accordion: Ref<boolean>;
    register(item: symbol): void;
    unregister(item: symbol): void;
    toggle(name: string): void;
}

export const collapseKey: InjectionKey<CollapseContext> = Symbol('snake-collapse');
```

父组件 `provide(collapseKey, ctx)`，子组件 `inject(collapseKey, null)`。契约只放配对协作所需字段；会被叶子组件复用的类型（如 `FormSize`）也定义在这里，避免组件间横向 import。
