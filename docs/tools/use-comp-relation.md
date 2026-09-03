# useParent / useChildren / hasParent

按组件 `name` 链建立父子关系，供跨层级组件协作：

```ts
import { hasParent, useChildren, useParent } from '@puresnake/snake-ui';

// 父组件：收集名为 SnakeCheckbox 的子组件
useChildren('SnakeCheckbox');

// 子组件：向上查找 SnakeCheckboxGroup
const group = useParent('SnakeCheckboxGroup');
const inGroup = hasParent('SnakeCheckboxGroup');
```

找不到父组件时 `useParent` 返回 `null`。另提供 `getParentContextByName(name)` 与 `cleanupComponentRelations()`；库内原生表单族仍用类型化的 `internal/` InjectionKey 方案，二者并存。
