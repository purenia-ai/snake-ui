# Config Provider 主题包装器

把主题引擎的 CSS 变量内联到所在节点并携带暗色 class,配合 `vite-plugin-snake-root`(见 `src/uni_modules/snake-ui/plugins/root/README.md`)包裹到每个页面根部后,明暗主题切换对全页内容生效,H5 与小程序行为一致。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

在应用的 `src/App.root.vue` 中包裹插槽(由 root 插件自动注入到每个页面):

```vue
<script setup lang="ts">
import SnakeConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <SnakeConfigProvider>
        <slot />
    </SnakeConfigProvider>
</template>
```

也可以声明式固定初始主题与模式:

```vue
<SnakeConfigProvider current-theme="snake" dark-mode="auto">
    <slot />
</SnakeConfigProvider>
```

## 说明

- 组件挂载及 props 变化时,若 `current-theme` / `dark-mode` 与主题引擎当前状态不同,会同步到引擎(含 storage 持久化),并触发 `theme-change` / `mode-change` 事件。
- 不传 props 时组件只做变量注入,不改变当前主题。
- 根节点会附加 `snake-theme-light` / `snake-theme-dark` class 与 `data-snake-theme-mode` 属性,可用于自定义样式适配。

## API

### Props

| 参数           | 说明                                        | 类型                             | 默认值 |
| -------------- | ------------------------------------------- | -------------------------------- | ------ |
| `darkMode`     | 暗黑模式,变化时同步主题引擎                 | `'light' \| 'dark' \| 'auto'`    | —      |
| `currentTheme` | 主题名(需已通过 `app.use` 注册)             | `string`                         | —      |
| `customClass`  | 自定义根节点 class                          | `string`                         | `''`   |
| `customStyle`  | 自定义根节点 style                          | `string \| Record<string,string>` | `''`  |

### Events

| 事件名          | 说明                   | 回调参数                 |
| --------------- | ---------------------- | ------------------------ |
| `theme-change`  | 主题切换成功时触发     | `(themeName: string)`    |
| `mode-change`   | 暗黑模式切换时触发     | `(mode: 'light' \| 'dark')` |

### Slots

| 插槽名 | 说明           |
| ------ | -------------- |
| —      | 页面/业务内容  |
