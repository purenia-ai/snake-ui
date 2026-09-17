---
name: 'formatters'
description: 'Snake UI 内容格式化参考。处理 formatters、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['formatters', '内容格式化']
---

# 内容格式化

## 价格

```ts
import { formatPrice } from '@puresnake/snake-ui';

formatPrice(12345.6, 2); // 12,345.60
formatPrice(12345.6, 2, ',', '.'); // 12.345,60
```

`formatPrice(value, decimals = 0, decimalPoint = '.', thousandsSeparator = ',')` 会把无效数字安全处理为 0。

输入可为数字或数字字符串，返回带千分位的字符串。`decimals` 默认 0，负数按 0 处理；该函数会剥离输入中的非数字字符，若业务需严格校验原始金额，应先用[规则校验](/tools/test)或服务端规则检查。

## 姓名脱敏

```ts
import { formatName } from '@puresnake/snake-ui';

formatName('张三'); // 张*
formatName('欧阳小明'); // 欧**明
```

该函数按 JavaScript 字符串长度处理，不承担合规级数据脱敏；日志和持久化数据仍应在服务端处理。

## API 速查

| 方法                                                                | 参数与返回值                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `formatPrice(value, decimals?, decimalPoint?, thousandsSeparator?)` | 格式化数字或字符串，返回字符串                                       |
| `formatName(value)`                                                 | 接受字符串，返回脱敏后的字符串；单字原样、两字保留首字、其余保留首尾 |
