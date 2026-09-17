---
preview: /pages/other/themeLocale/index
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

## 切换主题

```vue
<script setup lang="ts">
import { useTheme } from '@puresnake/snake-ui';

const { currentTheme, darkMode, setTheme, setDarkMode } = useTheme();

function useDarkTheme() {
    setTheme('snake');
    setDarkMode('dark'); // 也可传 'light' 或 'auto'
}
</script>
```

## 返回值与状态

`currentTheme`、`themes`、`darkMode`、`color`、`cssVars` 和 `themeStyle` 是响应式状态；`themeStyle` 是 CSS 变量对象的计算值。`initTheme` 用于初始化，`setTheme`、`setThemeColor`、`setDarkMode`、`toggleDarkMode` 与 `isInDarkMode` 用于切换或读取模式。

主题是应用级共享状态。主题注册、系统跟随和持久化策略见[多主题与暗黑模式](/guide/multi-theme)，仅调整当前色板见[颜色管理](/tools/use-color)。
