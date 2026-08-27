# useSnakeToast

`useSnakeToast()` 提供轻量文本提示。

```vue
<script setup lang="ts">
import { useSnakeToast } from '@puresnake/snake-ui';

const { show } = useSnakeToast();
show('保存成功', 1800);
</script>
```

`show(title, duration?)` 底层调用 `uni.showToast({ icon: 'none' })`。需要复杂内容或操作按钮时应使用业务弹层组件。
