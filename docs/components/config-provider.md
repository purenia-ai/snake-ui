# ConfigProvider 全局配置

`snake-config-provider` 是 Snake UI 主题系统的页面入口组件，负责把当前主题的 CSS 变量注入页面，并根据主题模式附加明亮或暗黑类名。将它与 `SnakeRoot` 插件配合使用，可以让主题配置自动作用于每个页面，无需逐页添加组件。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基本用法

直接包裹页面内容后，内部组件即可使用当前主题的 CSS 变量：

```vue
<script setup lang="ts">
import SnakeConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <SnakeConfigProvider>
        <view class="page">页面内容</view>
    </SnakeConfigProvider>
</template>
```

## 配合虚拟根组件

uni-app 没有可直接包裹所有页面的应用级根组件。推荐在 `src/App.root.vue` 中保留页面插槽，再通过 `SnakeRoot` 插件为每个页面自动注入全局根组件。

```vue
<!-- src/App.root.vue -->
<script setup lang="ts">
import SnakeConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <SnakeConfigProvider>
        <slot />
    </SnakeConfigProvider>
</template>
```

在 `vite.config.ts` 中启用插件：

```ts
import { defineConfig } from 'vite';
import Uni from '@dcloudio/vite-plugin-uni';
import { SnakeRoot } from './src/uni_modules/snake-ui/plugins';

export default defineConfig({
    plugins: [SnakeRoot(), Uni()]
});
```

`<slot />` 是页面内容的渲染位置，必须保留。配置完成后需要重新启动开发服务，插件会在构建阶段完成根组件注册和页面包裹。

## 指定主题与暗黑模式

组件默认只注入主题变量，不会改变当前主题。需要由外层控制主题时，可以传入已注册的主题名和暗黑模式：

```vue
<SnakeConfigProvider current-theme="brand" dark-mode="auto">
    <slot />
</SnakeConfigProvider>
```

`current-theme` 必须对应通过 `app.use(SnakeUI, { theme })` 注册的主题名。`dark-mode="auto"` 会在平台支持时跟随系统主题。

## 监听配置同步

当 `current-theme` 或 `dark-mode` props 促使组件切换主题时，会分别触发 `theme-change` 和 `mode-change`：

```vue
<SnakeConfigProvider
    :current-theme="themeName"
    :dark-mode="darkMode"
    @theme-change="name => console.log('主题已切换', name)"
    @mode-change="mode => console.log('当前渲染模式', mode)"
>
    <slot />
</SnakeConfigProvider>
```

这两个事件描述的是组件对 props 的同步结果。通过 `setSnakeTheme()`、`setSnakeDarkMode()` 或 `useTheme()` 在组件外部切换主题时，请直接监听对应的响应式状态。

## 工作原理

- 组件把主题引擎生成的 CSS 变量以内联样式写入根节点，确保变量在 H5 和小程序中都能向页面内容传递。
- 根节点会附加 `snake-theme-light` 或 `snake-theme-dark` 类名，以及 `data-snake-theme-mode` 属性，便于编写模式相关样式。
- `current-theme` 和 `dark-mode` 变化时，组件会把新值同步到主题引擎并持久化。
- 不传控制 props 时，组件只负责变量注入，主题状态仍由全局主题 API 管理。

## 常见场景

- **应用全局主题**：在 `App.root.vue` 中使用一次，并配合 `SnakeRoot` 自动覆盖所有页面。
- **独立页面入口**：不启用根组件插件时，在需要主题变量的页面外层显式包裹。
- **受控主题设置**：由设置页维护主题名和暗黑模式，通过 props 同步到主题引擎。
- **局部样式扩展**：使用 `custom-class` 或 `custom-style` 补充根节点布局，同时继续继承主题变量。

::: tip 主题状态
组件负责让主题变量进入页面。注册主题、主动切换主题以及读取响应式色板，请使用 [`useTheme()` 和主题 API](/guide/multi-theme)。
:::

## API

### Props

| 参数           | 说明                                         | 类型                               | 默认值 |
| -------------- | -------------------------------------------- | ---------------------------------- | ------ |
| `darkMode`     | 暗黑模式；变化时同步到主题引擎               | `'light' \| 'dark' \| 'auto'`      | —      |
| `currentTheme` | 已通过 `app.use` 注册的主题名                | `string`                           | `''`   |
| `customClass`  | 添加到根节点的自定义类名                     | `string`                           | `''`   |
| `customStyle`  | 添加到根节点的自定义样式，与主题变量样式合并 | `string \| Record<string, string>` | `''`   |

### Events

| 事件名         | 说明                               | 回调参数                    |
| -------------- | ---------------------------------- | --------------------------- |
| `theme-change` | `currentTheme` prop 成功同步时触发 | `(themeName: string)`       |
| `mode-change`  | `darkMode` prop 成功同步时触发     | `(mode: 'light' \| 'dark')` |

### Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `default` | 需要应用主题变量的页面内容 |

## 类型定义

```ts
import type { SnakeConfigProviderEmits, SnakeConfigProviderProps } from '@puresnake/snake-ui';
```

## 主题变量

组件注入当前 Snake UI 主题生成的全部 `--snake-*` 变量；变量清单与生成方式见[多主题与暗黑模式](/guide/multi-theme)。

最低版本：`0.1.0`

源码：`src/uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue`
