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

## 返回值与选择

`useRouter()` 返回 `{ route, navTo }`，与按需导入的同名函数共享实现。`route` 返回 Promise，导航失败时可用 `try/catch` 处理；`navTo` 返回 `void`，保留旧项目的特殊链接处理与 `navigateTo → switchTab` 降级。

新代码优先使用 `route`。两种入口的参数、特殊链接与平台行为见[路由跳转](/tools/route)。
