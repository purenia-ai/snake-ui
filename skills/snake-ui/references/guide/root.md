---
name: 'root'
description: 'Snake UI 虚拟根组件参考。处理 root、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['root', '虚拟根组件']
---

# 虚拟根组件

uni-app 没有可直接包裹所有页面的应用级根组件。Snake UI 内置 `Root` Vite 插件，在构建时为每个页面自动注入全局根组件，让主题、暗黑模式、全局提示和弹窗在任意页面自动生效，无需逐页添加组件代码。

## 解决的问题

`snake-config-provider`、`snake-toast`、`snake-modal` 这类组件需要存在于每个页面的根部。传统做法是在每个页面手动添加：

- 主题与暗黑模式的 CSS 变量必须逐页包裹才能覆盖页面内容。
- 全局提示、弹窗要在每个页面各放一份，维护成本高，容易遗漏。
- 新增一个全局能力就要改一遍所有页面。

`Root` 把这件事收敛到构建阶段：页面源码保持原样，编译时自动完成根组件注册与包裹。

## 技术方案

`Root` 是零额外依赖的纯字符串构建插件，分三步完成注入：

1. **注册根组件**：向 `main.ts` 注入 `import GlobalRootView from "./App.root.vue"`，并注册为全局组件 `global-root-view`。
2. **包裹页面模板**：解析每个页面的 SFC，将模板内容包裹进 `<global-root-view>`；页面中的 `<page-meta>` 节点会提取到包裹层外部。
3. **加载根组件**：拦截 `App.root.vue` 的模块请求并返回文件内容，模板中的 `<slot />` 接收页面内容。

## 快速上手

### 1. 创建 App.root.vue

在 `src/` 下创建 `App.root.vue`（与 `App.vue` 同级）：

```vue
<!-- src/App.root.vue -->
<script setup lang="ts">
import ConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <ConfigProvider>
        <slot />
    </ConfigProvider>
</template>
```

`<slot />` 是页面内容的渲染位置，必须保留。

### 2. 配置 vite.config.ts

```ts
import { defineConfig } from 'vite';
import Uni from '@dcloudio/vite-plugin-uni';
// npm 安装：import { Root } from '@puresnake/snake-ui/plugins';
import { Root } from './src/uni_modules/snake-ui/plugins';

export default defineConfig({
    plugins: [Root(), Uni()]
});
```

### 3. 运行

首次启用后重新启动开发服务。之后不需要修改任何页面代码，所有页面会自动被 `<global-root-view>` 包裹，`App.root.vue` 中的内容全局生效。

## 常见场景

### 全局主题与暗黑模式

把 `ConfigProvider` 放进根组件，主题变量自动覆盖所有页面：

```vue
<!-- src/App.root.vue -->
<script setup lang="ts">
import ConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <ConfigProvider>
        <slot />
    </ConfigProvider>
</template>
```

主题注册与切换见[多主题与暗黑模式](/guide/multi-theme)，ConfigProvider 的完整能力见 [ConfigProvider](/components/config-provider)。

### 全局提示与弹窗

在根组件中挂载 `global` 模式的 toast 和 modal，任意页面通过组合式函数调用：

```vue
<!-- src/App.root.vue -->
<script setup lang="ts">
import Toast from './uni_modules/snake-ui/components/snake-toast/snake-toast.vue';
import Modal from './uni_modules/snake-ui/components/snake-modal/snake-modal.vue';
</script>

<template>
    <slot />
    <Toast global />
    <Modal global />
</template>
```

```ts
import { useModal, useToast } from '@puresnake/snake-ui';

const toast = useToast();
const modal = useModal();

toast.show('操作成功');
modal.confirm({ content: '确认删除？' });
```

### 其他全局组件

任何需要出现在每个页面的组件都可以放进 `App.root.vue`：网络状态提示、加载遮罩、回到顶部按钮等。组件越多，`App.root.vue` 越值得保持精简，只放真正的全局能力。

## 配置项

| 参数           | 说明                               | 类型     | 默认值       |
| -------------- | ---------------------------------- | -------- | ------------ |
| `rootFileName` | 根组件文件名（不含 `.vue` 扩展名） | `string` | `'App.root'` |

如需使用其他文件名（如 `App.global.vue`），修改配置即可：

```ts
Root({ rootFileName: 'App.global' });
```

## 跨端兼容

`Root` 是纯 Vite 构建时插件，在 uni-app 编译之前完成源代码转换，不依赖任何平台特定 API。H5、微信小程序、支付宝小程序、头条/抖音小程序、Android App、iOS App 与鸿蒙 App 均支持。

启用后修改 `pages.json` 会自动重载页面列表，无需手动重启开发服务器。

## 注意事项

- **`<slot />` 必须保留**：它是页面内容的渲染位置，删除后页面不会渲染任何内容。
- **`<page-meta>` 会被提取**：页面模板中的 `<page-meta>` 会移到包裹层外部，确保微信小程序兼容，无需手动处理。
- **Vue 版本要求**：需要 Vue `>= 3.2.13`（使用 `vue/compiler-sfc` 的 `parse` API；HBuilderX 环境下自动降级为正则匹配）。
- **插件顺序**：如果项目还有其他修改 `pages.json` 的插件，请把 `Root()` 放在它们之后。
- **不启用插件时**：也可以在需要主题变量的页面外层显式包裹 `ConfigProvider`，两种方式互斥，不要同时使用。
- **首次启用需要重启**：开发服务需要在配置完成后重启一次，之后才进入自动包裹与 HMR 状态。

## 下一步

- 根组件的主题注入细节：[ConfigProvider](/components/config-provider)
- 主题与暗黑模式：[多主题与暗黑模式](/guide/multi-theme)
- 全局配置入口：[全局配置总览](/guide/foundation)
