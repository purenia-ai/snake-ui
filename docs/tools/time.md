# 时间格式化

Snake UI 提供绝对时间格式化和相对时间描述。`timeFormat` 是 `formatTime` 的兼容别名。

## 绝对时间

```ts
import { formatTime, timeFormat } from '@puresnake/snake-ui';

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
import { timeFrom } from '@puresnake/snake-ui';

timeFrom(Date.now() - 5 * 60 * 1000); // 5分钟前
```

`timeFrom()` 接受 `Date`、日期字符串、秒级或毫秒级时间戳。无效时间返回空字符串；未来时间返回“刚刚”；超过 30 天返回 `yyyy-mm-dd`。

## 参数与边界

| 方法                          | 参数                                   | 返回值                             |
| ----------------------------- | -------------------------------------- | ---------------------------------- |
| `formatTime(value, pattern?)` | 日期值；默认模板 `yyyy-mm-dd hh:MM:ss` | 格式化字符串，非法日期返回空字符串 |
| `timeFormat(value, pattern?)` | `formatTime` 的兼容别名                | 同上                               |
| `timeFrom(value, now?)`       | 日期值；`now` 可注入当前毫秒时间戳     | 相对时间或日期字符串               |

`formatTime` 对 10 位数字按秒级时间戳处理，`timeFrom` 对绝对值小于 `1e12` 的数字按秒处理。令牌中的月份 `mm` 与分钟 `MM` 区分大小写；输出使用运行环境的本地时区。
