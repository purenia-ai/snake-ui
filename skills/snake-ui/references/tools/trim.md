---
name: 'trim'
description: 'Snake UI 去除空格参考。处理 trim、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['trim', '去除空格']
---

# 去除空格

`trim(value, position = 'both')` 按指定位置移除空白。

```ts
import { trim } from '@puresnake/snake-ui';

trim('  Snake UI  '); // 'Snake UI'
trim('  Snake', 'left'); // 'Snake'
trim('Snake  ', 'right'); // 'Snake'
trim('Snake UI', 'all'); // 'SnakeUI'
```

`position` 可选 `both`、`left`、`right` 或 `all`。
