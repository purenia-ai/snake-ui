---
name: 'use-color'
description: 'Snake UI 颜色管理参考。处理 use-color、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['use-color', '颜色管理']
---

# 颜色管理

`useColor()` 提供当前主题色板和局部颜色覆盖入口。

```vue
<script setup lang="ts">
import { useColor } from '@puresnake/snake-ui';

const { color, setColor } = useColor();

function applyBrand() {
    setColor({ primary: '#00805a' });
}
</script>
```

`color` 是共享响应式色板。修改会影响使用 Snake CSS 变量的组件；临时的单组件颜色应优先使用组件 Props。
