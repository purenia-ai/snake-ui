# 规则校验

`test` 提供常用的轻量类型与格式判断。

```ts
import { test } from '@puresnake/snake-ui';

test.email('dev@example.com');
test.mobile('13800138000');
test.url('https://snake.example.com');
test.number('12.5');
test.string('Snake');
test.object({ name: 'Snake' });
test.array([]);
test.empty({});
```

| 方法                  | 判断内容                       |
| --------------------- | ------------------------------ |
| `email`               | 常见邮箱结构                   |
| `mobile`              | 中国大陆手机号段格式           |
| `url`                 | HTTP/HTTPS URL                 |
| `number`              | 可转换且有限的数字             |
| `string/object/array` | 基础类型                       |
| `empty`               | null、空字符串、空数组或空对象 |

这些规则用于前端即时反馈，不能代替服务端校验或安全验证。
