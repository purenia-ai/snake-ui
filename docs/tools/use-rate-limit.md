# useDebounce 与 useThrottle

两个组合式入口分别返回可取消的防抖和节流函数。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useDebounce, useThrottle } from '@puresnake/snake-ui';

const save = useDebounce(() => console.log('保存草稿'), 500);
const measure = useThrottle(() => console.log('重新计算布局'), 200);

onBeforeUnmount(() => {
    save.cancel();
    measure.cancel();
});
</script>
```

## API 与清理

`useDebounce(callback, wait = 300)` 和 `useThrottle(callback, wait = 300)` 分别返回带 `cancel()` 的函数。两者都透传回调参数并返回 `void`；`useDebounce` 不提供底层 `debounce` 的 `immediate` 参数。

组合式函数不会自动在卸载时取消，调用方仍需显式清理。节流等待窗口内的执行时机与示例见[节流与防抖](/tools/debounce-throttle)。
