---
name: 'use-rate-limit'
description: 'Snake UI useDebounce 与 useThrottle参考。处理 use-rate-limit、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['use-rate-limit', 'useDebounce', 'useThrottle']
---

# useDebounce 与 useThrottle

两个组合式入口分别返回可取消的防抖和节流函数。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useDebounce, useThrottle } from '@puresnake/snake-ui';

const save = useDebounce(persist, 500);
const measure = useThrottle(updateLayout, 200);

onBeforeUnmount(() => {
    save.cancel();
    measure.cancel();
});
</script>
```

参数和执行时机与[节流与防抖](/tools/debounce-throttle)一致。组合式函数不会自动在卸载时取消，调用方仍需显式清理。
