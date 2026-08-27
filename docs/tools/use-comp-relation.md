# useSnakeCompRelation

`useSnakeCompRelation(key, value?)` 使用类型安全的 `InjectionKey` 建立组件关系：传入 value 时提供上下文，不传时读取最近的上下文。

```ts
import type { InjectionKey, Ref } from 'vue';
import { useSnakeCompRelation } from '@puresnake/snake-ui';

interface GroupContext {
    current: Ref<string>;
}

const groupKey: InjectionKey<GroupContext> = Symbol('group');

// 父组件
useSnakeCompRelation(groupKey, { current });

// 子组件
const group = useSnakeCompRelation(groupKey);
```

找不到 provider 时返回 `null`。公开业务组件优先使用 Props/Events；该工具适合需要跨层级协作的组件族。
