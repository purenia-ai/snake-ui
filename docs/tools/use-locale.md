---
preview: /pages/tools/theme-locale
---

# 语言管理

`useSnakeLocale(namespace?)` 提供响应式语言状态和带命名空间的翻译函数。

```vue
<script setup lang="ts">
import { useSnakeLocale } from 'snake-ui';

const { currentLocale, locales, t, setLocale } = useSnakeLocale('checkout');

t('submit');
setLocale('en-US');
</script>
```

缺失词条按“当前语言 → 中文 → key”回退。语言包注册方式见[全局配置与底座](/guide/foundation)。
