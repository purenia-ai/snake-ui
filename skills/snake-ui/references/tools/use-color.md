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

## 返回值与作用范围

| 成员              | 用途                                                    |
| ----------------- | ------------------------------------------------------- |
| `color`           | 当前主题的共享响应式色板，可读取 `color.primary` 等颜色 |
| `setColor(patch)` | 覆盖当前主题的部分颜色并更新对应 CSS 变量               |

`color` 是共享状态，修改会影响使用 Snake CSS 变量的组件；它不是仅作用于调用组件的局部样式。临时的单组件颜色应优先使用组件 Props。主题切换和暗色模式见[主题管理](/tools/use-theme)。
