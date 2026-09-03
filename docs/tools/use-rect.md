# useRect

`useRect(selector?, all?)` 返回响应式的节点信息：`rect`、`getRect()` 和 `refresh()`。

```vue
<script setup lang="ts">
import { useRect } from '@puresnake/snake-ui';

const { rect, getRect, refresh } = useRect('.toolbar');

await getRect();           // 测量并写入 rect
console.log(rect.value);   // 响应式的节点信息
await refresh('.other');   // 换选择器重新测量
</script>
```

查询不到节点时 Promise 会拒绝。`all` 传 `true` 时用 `selectAll` 匹配全部，`rect` 为节点数组。
