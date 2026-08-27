# useSnakeModal

`useSnakeModal()` 把 `uni.showModal` 转为 Promise 调用。

```vue
<script setup lang="ts">
import { useSnakeModal } from '@puresnake/snake-ui';

const { show } = useSnakeModal();

async function remove() {
    const result = await show({
        title: '删除记录',
        content: '此操作无法撤销'
    });
    if (result.confirm) await removeRecord();
}
</script>
```

平台调用失败时 Promise 会拒绝，涉及关键数据的流程应捕获并反馈错误。
