# useRect

`useRect(selector?, all?)` 返回响应式的节点信息：`rect`、`getRect()` 和 `refresh()`。

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRect } from '@puresnake/snake-ui';

const { rect, getRect, refresh } = useRect('.toolbar');

onMounted(async () => {
    await getRect(); // 测量并写入 rect
    console.log(rect.value);
});

async function measureOther() {
    await refresh('.other'); // 换选择器重新测量
}
</script>
```

## 返回值与边界

`useRect(selector?, all = false)` 返回响应式 `rect`，以及 `getRect(selector?, delay = 0)`、`refresh(selector?, delay?)`。两种方法都会等待 Vue 下一轮 DOM 更新，再按可选毫秒延迟查询；查询结果写入 `rect.value` 并作为 Promise 结果返回。

未提供选择器时直接返回当前 `rect.value`；查询没有匹配项时可能得到 `null` 或空数组，调用方应按实际结果处理。`all: true` 使用 `selectAll`。只需一次性查询且希望得到零值兜底对象时，使用[节点布局信息](/tools/get-rect)。
