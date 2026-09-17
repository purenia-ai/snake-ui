# 去除空格

`trim(value, position = 'both')` 按指定位置移除空白。

```ts
import { trim } from '@puresnake/snake-ui';

trim('  Snake UI  '); // 'Snake UI'
trim('  Snake', 'left'); // 'Snake'
trim('Snake  ', 'right'); // 'Snake'
trim('Snake UI', 'all'); // 'SnakeUI'
```

## API 与使用场景

`trim(value: string, position: 'both' | 'left' | 'right' | 'all' = 'both'): string` 返回处理后的新字符串。`both` 只去除首尾空白，`all` 删除整串中的空白，包括换行和制表符；需要保留词间空格时不要选 `all`。

它适合表单输入的轻量整理。请先确认输入是字符串；金额、号码等领域格式仍应交给专门校验器，参见[规则校验](/tools/test)。
