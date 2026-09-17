---
name: 'test'
description: 'Snake UI 规则校验参考。处理 test、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['test', '规则校验']
---

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

## 其他常用方法

| 方法                         | 判断内容                                      |
| ---------------------------- | --------------------------------------------- |
| `date/dateISO`               | 可解析日期、`yyyy/mm/dd` 或 `yyyy-mm-dd` 形式 |
| `digits/amount`              | 纯数字、最多两位小数的金额格式                |
| `idCard/carNo`               | 大陆身份证号码格式、车牌号码格式              |
| `contains/range/rangeLength` | 包含指定内容、数值区间、字符串长度区间        |
| `jsonString`                 | 可解析为对象或数组的 JSON 字符串              |
| `code(value, len = 6)`       | 固定长度的数字验证码                          |
| `image/video`                | 常见图片或视频文件扩展名                      |
| `func/promise/regExp`        | 函数、Promise 形对象、正则对象                |

所有方法返回布尔值；`empty` 的别名为 `isEmpty`。这些规则适合前端即时反馈，部分格式判断只检查形状，不能代替服务端校验或安全验证。
