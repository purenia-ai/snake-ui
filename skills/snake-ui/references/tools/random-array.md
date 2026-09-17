---
name: 'random-array'
description: 'Snake UI 数组乱序参考。处理 random-array、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['random-array', '数组乱序']
---

# 数组乱序

`randomArray<T>(values)` 使用 Fisher–Yates 算法返回乱序副本，不修改原数组。

```ts
import { randomArray } from '@puresnake/snake-ui';

const source = [1, 2, 3, 4];
const result = randomArray(source);
// source 仍为 [1, 2, 3, 4]
```

## API 与边界

`randomArray<T>(values: readonly T[]): T[]` 接受只读数组并返回新数组，元素对象本身仍是原引用；空数组返回空数组。适合随机展示非敏感的推荐项或题目顺序。

底层随机数来自 `Math.random()`。随机顺序不适合密码学、抽奖或可审计场景；需要可复现顺序时也应使用业务指定的随机种子方案。
