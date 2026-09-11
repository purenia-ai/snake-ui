---
name: 'emitter'
description: 'Snake UI 事件总线参考。处理 emitter、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['emitter', '事件总线']
---

# 事件总线

`createEmitter()` 创建隔离的同步事件总线；`emitter` 是框架提供的共享实例。

```ts
import { createEmitter } from '@puresnake/snake-ui';

const emitter = createEmitter();
const off = emitter.on<{ id: number }>('order:updated', payload => {
    console.log(payload.id);
});

emitter.emit('order:updated', { id: 1 });
off();
```

实例提供 `on`、`off`、`emit` 和 `clear`。页面级事件应在卸载时退订；父子组件通信优先使用 Props/Events，跨域共享状态优先使用明确的 store。
