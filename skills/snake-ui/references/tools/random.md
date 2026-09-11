---
name: 'random'
description: 'Snake UI 随机数值参考。处理 random、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['random', '随机数值']
---

# 随机数值

`random(min = 0, max = 1)` 返回包含上下界的随机整数。参数顺序可以互换，小数边界会向有效整数范围收缩。

```ts
import { random } from '@puresnake/snake-ui';

random(1, 6); // 1 到 6
random(10, 5); // 5 到 10
```

底层使用 `Math.random()`，不适合安全令牌、密码学或公平性要求高的抽奖。
