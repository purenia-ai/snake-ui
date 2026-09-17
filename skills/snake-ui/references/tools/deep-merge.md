---
name: 'deep-merge'
description: 'Snake UI 对象深合并参考。处理 deep-merge、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['deep-merge', '对象深合并']
---

# 对象深合并

`deepMerge(target, ...sources)` 递归合并普通对象，并返回新对象，不修改输入值。数组、日期和其他值由后一个来源整体替换。

```ts
import { deepMerge } from '@puresnake/snake-ui';

const config = deepMerge(
    { header: { locale: 'zh-CN' }, tags: ['base'] },
    { header: { token: 'abc' }, tags: ['custom'] }
);
// { header: { locale: 'zh-CN', token: 'abc' }, tags: ['custom'] }
```

该函数适合配置合并。需要按主键合并数组时，应在业务层明确实现数组策略。

## API 与覆盖规则

`deepMerge<T>(target: T, ...sources: Partial<T>[]): T` 从左到右合并来源，返回新对象，输入对象不变。只有前后两侧都是普通对象时才递归合并；数组、`Date`、`Map` 等由后一个来源整体替换为副本。

例如主题默认配置与页面配置可以合并；若要把数组按 `id` 合并，需在调用前明确业务规则。嵌套引用的复制规则见[对象深拷贝](/tools/deep-clone)。
