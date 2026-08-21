# 事件总线

`createSnakeEmitter()` 创建隔离的同步事件总线；`snakeEmitter` 是框架提供的共享实例。

```ts
import { createSnakeEmitter } from 'snake-ui';

const emitter = createSnakeEmitter();
const off = emitter.on<{ id: number }>('order:updated', payload => {
    console.log(payload.id);
});

emitter.emit('order:updated', { id: 1 });
off();
```

实例提供 `on`、`off`、`emit` 和 `clear`。页面级事件应在卸载时退订；父子组件通信优先使用 Props/Events，跨域共享状态优先使用明确的 store。
