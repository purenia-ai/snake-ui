---
name: 'use-router'
description: 'Snake UI useRouter参考。处理 use-router、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['use-router', 'useRouter']
---

# useRouter

`useRouter()` 在组合式代码中同时提供新的 Promise 路由和旧的兼容路由。

```vue
<script setup lang="ts">
import { useRouter } from '@puresnake/snake-ui';

const { route, navTo } = useRouter();

async function openOrder(id: number) {
    await route('/pages/order/detail', { id });
}
</script>
```

新代码使用 `route`；只有需要 `navigateTo → switchTab` 隐式降级的旧流程才使用 `navTo`。完整参数见[路由跳转](/tools/route)。
