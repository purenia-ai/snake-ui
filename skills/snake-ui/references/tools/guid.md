---
name: 'guid'
description: 'Snake UI 全局唯一标识符参考。处理 guid、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['guid', '全局唯一标识符']
---

# 全局唯一标识符

`guid(prefix = 'snake')` 生成带前缀的客户端标识符。

```ts
import { guid } from '@puresnake/snake-ui';

guid(); // snake-...
guid('order'); // order-...
```

它适合临时节点、表单项和请求追踪键，不保证跨系统永久唯一，数据库主键应由服务端生成。
