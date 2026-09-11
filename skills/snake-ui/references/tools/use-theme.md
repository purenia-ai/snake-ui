---
name: 'use-theme'
description: 'Snake UI 主题管理参考。处理 use-theme、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['use-theme', '主题管理']
---

# 主题管理

`useTheme()` 在 Vue 组件中提供响应式主题、暗色模式、颜色和 CSS 变量。

```vue
<script setup lang="ts">
import { useTheme } from '@puresnake/snake-ui';

const {
    currentTheme,
    themes,
    darkMode,
    color,
    themeStyle,
    setTheme,
    setThemeColor,
    setDarkMode,
    toggleDarkMode,
    isInDarkMode
} = useTheme();
</script>
```

`currentTheme`、`themes`、`darkMode`、`color` 和 `themeStyle` 是响应式状态。应用级主题注册和持久化策略见[多主题与暗黑模式](/guide/multi-theme)。
