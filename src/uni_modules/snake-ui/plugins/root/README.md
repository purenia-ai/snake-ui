# vite-plugin-snake-root

Snake UI 虚拟根组件 Vite 插件,零额外依赖,纯字符串操作实现。

## 解决的问题

UniApp 不支持原生的根组件包裹机制,无法在全局统一注入 `snake-config-provider`、toast、modal 等需要在每个页面根部存在的组件。传统方案需要在每个页面手动添加,维护成本高。

本插件通过 Vite 构建时注入,自动为每个页面包裹 `<global-root-view>` 根组件,无需修改任何页面代码本身。

## 技术方案

```
App.root.vue(源码)        → 在 main.ts 中导入并注册为全局组件 global-root-view
                              → 页面模板被包裹 <global-root-view> 页面内容 </global-root-view>
                              → 渲染时页面内容填入 <slot />
```

三步实现:

1. **main.ts 注入**(`root.ts -> registerRootApp`)
   - 注入 `import GlobalRootView from "./App.root.vue"` 与 `app.component("global-root-view", GlobalRootView)`
2. **页面模板包裹**(`page.ts -> transformPage`)
   - 解析 SFC,提取 PageMeta 节点(如有则放到包裹层外部),模板内容包裹 `<global-root-view>`
3. **App.root.vue 加载**(`index.ts -> load`)
   - 拦截 `App.root.vue` 的模块请求,从文件读取并返回;模板中的 `<slot />` 接收页面内容

## 使用方式

### 1. 创建 App.root.vue(应用级,放在 src/ 下)

```vue
<script setup lang="ts">
import ConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <ConfigProvider>
        <slot />
    </ConfigProvider>
</template>
```

关键点:`<slot />` 是页面内容的渲染位置,必须保留。

### 2. 配置 vite.config.ts

```ts
import { Root } from './src/uni_modules/snake-ui/plugins';

export default defineConfig({
    plugins: [Root(), uni()]
});
```

### 3. 运行

不需要修改任何页面代码,所有页面自动被 `<global-root-view>` 包裹。

## 配置项

```ts
Root({
    rootFileName: 'App.root' // 根组件文件名(不含扩展名),默认 App.root
});
```

## 跨端兼容

纯 Vite 构建时插件,在 UniApp 编译之前完成源代码转换,不依赖任何平台特定 API:

H5 / 微信小程序 / 支付宝小程序 / 头条抖音小程序 / Android App / iOS App / 鸿蒙 App 均支持。

## HMR 支持

修改 `pages.json` 后自动重载页面列表,无需手动重启开发服务器。

## 注意事项

- Vue 版本需 >= 3.2.13(使用 `vue/compiler-sfc` 的 `parse` API,HBuilderX 环境下自动降级为正则匹配)
- 页面模板中如有 `<page-meta>` 组件,会被提取到包裹层外部,确保微信小程序兼容
- 页面模板中如有嵌套 `<template #slot>` 具名插槽,不影响根模板的正确识别

## 致谢

- 实现参考了 [@uni-ku/root](https://github.com/uni-ku/root)(MIT License,作者 skiyee),核心思路受其启发并进行了重新实现。
