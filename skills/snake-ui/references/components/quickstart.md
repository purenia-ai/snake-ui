---
name: 'quickstart'
description: 'Snake UI 快速上手参考。处理 quickstart、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['quickstart', 'snake-quickstart', '快速上手']
---

# 快速上手

本页假设你已完成[安装](/components/install)和[配置](/components/setting)。下面用一个按钮验证组件、主题样式和全局工具。

## 创建第一个页面

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

- 按钮能够正常渲染：easycom 路径正确。
- 按钮具有主题样式：`index.scss` 已生效。
- 点击后出现提示：`app.use(SnakeUI)` 已执行，`uni.$snake` 已注入。
- 控制台没有组件解析警告或样式编译错误。

## 关于 uni.$snake

执行 `app.use(SnakeUI)` 后，常用工具会挂载到 `uni.$snake`，页面和组件内可以直接调用：

```ts
uni.$snake.toast('操作成功');
uni.$snake.navTo('/pages/index/index');
```

挂载的工具包括 `toast`、`navTo`、`guid`、`sleep`、`formatTime` 和 `sys` 等。模块代码中也可以绕过全局属性，按需导入同名函数，行为一致：

```ts
import { navTo, toast } from '@puresnake/snake-ui/libs';

toast('操作成功');
navTo('/pages/index/index');
```

## 不使用 easycom 单独引用组件

easycom 是推荐用法，但某些场景（如类型提示受限、动态组件）可以显式引入：

```vue
<template>
    <Button type="primary">显式引入</Button>
</template>

<script setup lang="ts">
import Button from '@puresnake/snake-ui/components/snake-button/snake-button.vue';
</script>
```

显式引入时模板中的标签名必须与 import 的组件名一致。`uni_modules` 安装改用本地相对路径：

```ts
import Button from './uni_modules/snake-ui/components/snake-button/snake-button.vue';
```

## 下一步

- 查找可用组件：[组件总览](/components/intro)
- 配置主题、语言或 HTTP：[全局配置总览](/guide/foundation)
- 使用装修组件：[CMS 快速接入](/cms/getting-started)
- 接入异常：[常见问题](/guide/troubleshooting)
