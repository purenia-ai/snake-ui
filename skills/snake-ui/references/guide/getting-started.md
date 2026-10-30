---
name: 'getting-started'
description: 'Snake UI 快速开始参考。处理 getting-started、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['getting-started', '快速开始']
---

# 快速开始

本页用一条完整路径完成 Snake UI 的安装、注册、样式引入和首个组件验证。默认采用 npm 包；需要把源码放入项目时，改用 [`uni_modules` 安装](/components/install#uni-modules-安装)。两种方式不要同时使用。

## 开始前确认

准备一个可正常运行的 uni-app Vue 3 项目，并确认项目支持 SCSS 与 `rpx`。完整版本要求和平台差异见[运行环境与能力边界](/guide/compatibility)。

## 1. 安装 Snake UI

使用项目已有的包管理器：

::: code-group

```bash [pnpm]
pnpm add @puresnake/snake-ui
```

```bash [npm]
npm install @puresnake/snake-ui
```

```bash [yarn]
yarn add @puresnake/snake-ui
```

:::

## 2. 注册组件库

在 `main.ts` 中安装插件：

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from '@puresnake/snake-ui';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI);
    return { app };
}
```

## 3. 引入全局样式

在 `App.vue` 的全局样式中引入样式入口：

```vue
<style lang="scss">
@import '@puresnake/snake-ui/index.scss';
</style>
```

## 4. 配置 easycom

在 `pages.json` 中合并以下配置。项目只能有一个 `easycom` 字段；修改后需要重新编译。

```json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "@puresnake/snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

## 5. 渲染第一个组件

在任意页面加入按钮，用一次交互同时验证组件解析、主题样式和插件注册：

```vue
<template>
    <view class="page">
        <text class="title">Snake UI 已准备好</text>
        <snake-button type="primary" @click="handleClick">显示提示</snake-button>
    </view>
</template>

<script setup lang="ts">
function handleClick() {
    uni.$snake.toast('操作成功');
}
</script>

<style lang="scss" scoped>
.page {
    padding: 32rpx;
}

.title {
    display: block;
    margin-bottom: 24rpx;
}
</style>
```

## 检查结果

- 按钮正常渲染：easycom 路径正确。
- 按钮具有主题样式：`index.scss` 已生效。
- 点击后出现提示：`app.use(SnakeUI)` 已执行。
- 控制台没有组件解析警告或样式编译错误。

如果某一步失败，先按上述 4 项定位，再查看[常见问题](/guide/troubleshooting)。完整安装选项、手动导入和本地目录结构分别见[安装 Snake UI](/components/install)、[配置](/components/setting)与[组件快速上手](/components/quickstart)。

## 选择下一步

### 基础组件接入

- 在[组件总览](/components/intro)中按名称、用途或关键词选择组件。
- 在[全局配置总览](/guide/foundation)中配置主题、语言、HTTP 和运行时能力。
- 先从 [Button](/components/button)、[Form](/components/form) 或 [Popup](/components/popup) 了解标准文档结构。

### CMS 页面接入

CMS 页面装修复用同一套安装和运行时。完成本页后，继续阅读 [CMS 快速接入](/cms/getting-started)，再按[页面数据协议](/cms/data-contract)和[业务服务接入](/cms/services)对齐接口数据。
