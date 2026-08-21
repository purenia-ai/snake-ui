# 内容格式化

## 价格

```ts
import { formatPrice } from 'snake-ui';

formatPrice(12345.6, 2); // 12,345.60
formatPrice(12345.6, 2, ',', '.'); // 12.345,60
```

`formatPrice(value, decimals = 0, decimalPoint = '.', thousandsSeparator = ',')` 会把无效数字安全处理为 0。

## 姓名脱敏

```ts
import { formatName } from 'snake-ui';

formatName('张三'); // 张*
formatName('欧阳小明'); // 欧**明
```

该函数按 JavaScript 字符串长度处理，不承担合规级数据脱敏；日志和持久化数据仍应在服务端处理。
