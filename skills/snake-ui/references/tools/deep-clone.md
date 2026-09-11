---
name: 'deep-clone'
description: 'Snake UI 对象深拷贝参考。处理 deep-clone、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['deep-clone', '对象深拷贝']
---

# 对象深拷贝

`deepClone<T>(value)` 创建独立副本，支持普通对象、数组、`Date`、`Map`、`Set`、Symbol 键和循环引用。

```ts
import { deepClone } from '@puresnake/snake-ui';

const source = { profile: { name: 'Snake' }, tags: new Set(['new']) };
const copy = deepClone(source);
copy.profile.name = 'Pro';
// source.profile.name 仍为 Snake
```

函数保留对象图中的循环关系，但不会复制类实例的私有语义。业务模型实例应使用其自身的序列化或复制方法。
