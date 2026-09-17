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

## API 与使用边界

`guid(prefix = 'snake'): string` 返回 `前缀-时间戳-随机段` 形式的字符串。每次调用都会生成新值，适合在创建列表项时生成稳定的前端 `key`：

```ts
const item = { id: guid('item'), label: '新项目' };
```

不要在每次渲染时重新调用，否则列表 `key` 会变化。它不保证跨系统永久唯一，也不具备密码学安全性；数据库主键和安全令牌应由相应系统生成。
