---
name: 'use-toast'
description: 'Snake UI useToast参考。处理 use-toast、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['use-toast', 'useToast']
---

# useToast

`useToast()` 提供函数式消息提示，依赖页面/应用根部挂载的 `<snake-toast global />`（或页面级 `<snake-toast page />`）承接事件。

## 快速开始

应用根部（如 `App.vue` / 布局组件）挂载全局 toast：

```vue
<template>
    <!-- 全局 toast，承接 useToast() 的事件 -->
    <snake-toast global />
</template>
```

业务中调用：

```vue
<script setup lang="ts">
import { useToast } from '@puresnake/snake-ui';

const toast = useToast();

toast.show('保存成功');
toast.success('操作成功');
toast.error('操作失败');
toast.warning('请注意');
toast.info('提示信息');
toast.loading('加载中…'); // 常驻，需手动 close()
</script>
```

`show(titleOrOptions)` 既可传字符串，也可传配置对象：

```ts
toast.show({
    title: '受价格波动影响，订单将自动终止',
    icon: false, // 不显示图标
    position: 'bottom', // center / top / bottom
    duration: 3000 // ms；0 表示常驻，省略时使用组件默认值 2000
});
```

## API

| 方法                                         | 说明                     |
| -------------------------------------------- | ------------------------ |
| `show(titleOrOptions)`                       | 显示默认样式 toast       |
| `success/error/warning/info(titleOrOptions)` | 显示对应类型 toast       |
| `loading(titleOrOptions)`                    | 显示加载动画（默认常驻） |
| `close()`                                    | 关闭 toast               |

四个提示类型方法和 `show()` 都返回 `void`，不能 `await` 提示消失。`loading()` 未指定 `duration` 时会显式设为 0；完成异步任务后应调用 `close()`。需要固定展示时长的普通提示，传入正数毫秒值。

## 模式

- `useToast()` / `useToast(true)` / `useToast({ global: true })` — 应用级（需 `<snake-toast global />`）
- `useToast(false)` / `useToast({ page: true })` — 页面级（需 `<snake-toast page />`）
- `useToast({ page: 'pageId' })` — 指定页面的 `<snake-toast page="pageId" />`

## 声明式 ref 调用

也可通过 ref 直接调用组件方法：

```vue
<template>
    <snake-toast ref="toastRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const toastRef = ref<{ show: (options: { title: string; type: string }) => void; hide: () => void } | null>(null);

function notify() {
    toastRef.value?.show({ title: '提示', type: 'success' });
}

function dismiss() {
    toastRef.value?.hide();
}
</script>
```

`ref` 只有在组件挂载后才有值，应在事件处理或挂载后调用。只需短暂的无图标提示时，也可使用[平台辅助](/tools/platform)中的 `toast()`。
