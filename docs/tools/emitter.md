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

## API 与生命周期

| 方法                  | 行为                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `on(name, handler)`   | 注册处理函数；同一事件下重复注册同一函数只保留一次，返回解绑函数 |
| `off(name, handler?)` | 删除指定处理函数；不传 `handler` 时删除该事件的全部处理函数      |
| `emit(name, payload)` | 同步通知该事件的处理函数，无返回值                               |
| `clear()`             | 删除实例中的全部事件                                             |

`createEmitter()` 每次创建独立实例；导出的 `emitter` 是共享实例。Vue 页面或组件中的订阅应在 `onBeforeUnmount` 中调用 `on()` 返回的解绑函数。处理函数中的异常会同步传给调用方，`emit` 不会替你捕获。
