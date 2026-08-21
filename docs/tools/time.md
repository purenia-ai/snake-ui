# 时间格式化

Snake UI 提供绝对时间格式化和相对时间描述。`timeFormat` 是 `formatTime` 的兼容别名。

## 绝对时间

```ts
import { formatTime, timeFormat } from 'snake-ui';

formatTime(Date.now(), 'yyyy-mm-dd hh:MM:ss');
timeFormat(new Date(), 'yyyy/mm/dd');
```

| 令牌   | 含义     |
| ------ | -------- |
| `yyyy` | 四位年份 |
| `mm`   | 两位月份 |
| `dd`   | 两位日期 |
| `hh`   | 两位小时 |
| `MM`   | 两位分钟 |
| `ss`   | 两位秒   |

## 相对时间

```ts
import { timeFrom } from 'snake-ui';

timeFrom(Date.now() - 5 * 60 * 1000); // 5分钟前
```

`timeFrom()` 接受 `Date`、日期字符串、秒级或毫秒级时间戳。无效时间返回空字符串；未来时间返回“刚刚”；超过 30 天返回 `yyyy-mm-dd`。
