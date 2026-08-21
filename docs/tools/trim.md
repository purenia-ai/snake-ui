# 去除空格

`trim(value, position = 'both')` 按指定位置移除空白。

```ts
import { trim } from 'snake-ui';

trim('  Snake UI  '); // 'Snake UI'
trim('  Snake', 'left'); // 'Snake'
trim('Snake  ', 'right'); // 'Snake'
trim('Snake UI', 'all'); // 'SnakeUI'
```

`position` 可选 `both`、`left`、`right` 或 `all`。
