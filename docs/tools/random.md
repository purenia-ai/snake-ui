# 随机数值

`random(min = 0, max = 1)` 返回包含上下界的随机整数。参数顺序可以互换，小数边界会向有效整数范围收缩。

```ts
import { random } from '@puresnake/snake-ui';

random(1, 6); // 1 到 6
random(10, 5); // 5 到 10
```

## API 与边界

`random(min = 0, max = 1): number` 返回闭区间内的整数；`random()` 因而返回 0 或 1。小数下界向上取整、上界向下取整，调用方应提供至少包含一个整数的区间。

底层使用 `Math.random()`，不适合安全令牌、密码学或公平性要求高的抽奖。打乱列表可使用[数组乱序](/tools/random-array)。
