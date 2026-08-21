# 数组乱序

`randomArray<T>(values)` 使用 Fisher–Yates 算法返回乱序副本，不修改原数组。

```ts
import { randomArray } from 'snake-ui';

const source = [1, 2, 3, 4];
const result = randomArray(source);
// source 仍为 [1, 2, 3, 4]
```

随机顺序不适合密码学、抽奖或可审计场景。
