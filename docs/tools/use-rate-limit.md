# useSnakeDebounce 与 useSnakeThrottle

两个组合式入口分别返回可取消的防抖和节流函数。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useSnakeDebounce, useSnakeThrottle } from 'snake-ui';

const save = useSnakeDebounce(persist, 500);
const measure = useSnakeThrottle(updateLayout, 200);

onBeforeUnmount(() => {
    save.cancel();
    measure.cancel();
});
</script>
```

参数和执行时机与[节流与防抖](/tools/debounce-throttle)一致。组合式函数不会自动在卸载时取消，调用方仍需显式清理。
