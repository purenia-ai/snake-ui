# useSnakeEmitter

`useSnakeEmitter()` 返回 Snake UI 的共享事件总线。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useSnakeEmitter } from '@puresnake/snake-ui';

const emitter = useSnakeEmitter();
const off = emitter.on('cart:changed', refreshCart);
onBeforeUnmount(off);
</script>
```

共享事件适合弱耦合通知，不适合承载可追踪业务状态。实例化独立总线和完整 API 见[事件总线](/tools/emitter)。
