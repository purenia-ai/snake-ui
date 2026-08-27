# 快速上手

本页假设你已完成[安装](/components/install)和[配置](/components/setting)。下面用一个按钮验证组件、主题样式和全局工具。

## 创建第一个页面

```vue
<template>
    <view class=page>
        <text class=title>Snake UI 已准备好</text>
        <snake-button type=primary @click=handleClick>显示提示</snake-button>
    </view>
</template>

<script setup lang=ts>
function handleClick() {
    uni.$snake.toast('操作成功');
}
</script>

<style lang=scss scoped>
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

## 下一步

- 查找可用组件：[组件总览](/components/intro)
- 配置主题、语言或 HTTP：[全局配置总览](/guide/foundation)
- 使用装修组件：[CMS 快速接入](/cms/getting-started)
- 接入异常：[常见问题](/guide/troubleshooting)
