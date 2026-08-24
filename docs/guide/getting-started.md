# 快速开始

本页带你完成 Snake UI 的最小接入：安装组件库、注册插件、引入样式、配置 easycom，并显示第一个按钮。

如果你只关心组件接入，也可以按组件文档中的[安装](/components/install)、[配置](/components/setting)和[快速上手](/components/quickstart)逐步完成。

## 开始之前

你需要一个可正常运行的 uni-app Vue 3 项目。Snake UI 的包清单声明 `vue >= 3.4.0` 与 `@dcloudio/uni-app >= 3.0.0` 为 peer dependencies。

请选择一种安装方式，不要同时维护 npm 包和 `uni_modules` 副本。

## 方式一：npm 安装

```bash
pnpm add snake-ui
```

在 `main.ts` 安装插件：

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from 'snake-ui';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI);
    return { app };
}
```

在 `App.vue` 的全局样式中引入完整样式：

```vue
<style lang="scss">
@import 'snake-ui/index.scss';
</style>
```

然后在 `pages.json` 配置组件自动发现：

```json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

## 方式二：uni_modules 安装

将组件库放到项目的 `uni_modules/snake-ui` 后，使用本地路径安装：

```ts
import SnakeUI from './uni_modules/snake-ui';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI);
    return { app };
}
```

全局样式改为本地路径：

```scss
@import './uni_modules/snake-ui/index.scss';
```

easycom 规则也指向本地组件：

```json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "@/uni_modules/snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

## 显示第一个组件

完成 easycom 配置后，无需在页面中手动注册组件：

```vue
<template>
    <view class="page">
        <snake-button type="primary" @click="handleClick">开始使用</snake-button>
    </view>
</template>

<script setup lang="ts">
function handleClick() {
    uni.$snake.toast('Snake UI 已接入');
}
</script>
```

## 检查接入结果

- 页面能显示带主题样式的按钮：样式和 easycom 已生效。
- 点击按钮能显示提示：插件已安装，`uni.$snake` 已注入。
- 控制台没有组件解析警告：组件路径与安装方式一致。

如果组件不显示、没有样式或 `uni.$snake` 不存在，请查看[常见问题](/guide/troubleshooting)。

## 下一步

- 配置主题、语言或 HTTP：[全局配置总览](/guide/foundation)
- 添加或切换语言：[国际化](/guide/internationalization)
- 确认平台和业务依赖：[运行环境](/guide/compatibility)
- 渲染装修页面：[CMS 快速接入](/guide/cms-usage)
