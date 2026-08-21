# useSnakeRect

`useSnakeRect(instance?)` 把组件实例预绑定到节点查询工具。

```vue
<script setup lang="ts">
import { getCurrentInstance, nextTick } from 'vue';
import { useSnakeRect } from 'snake-ui';

const { proxy } = getCurrentInstance()!;
const { getRect } = useSnakeRect(proxy);

await nextTick();
const rect = await getRect('.toolbar');
</script>
```

查询不到节点时 Promise 会拒绝。页面根节点查询可不传 instance。
