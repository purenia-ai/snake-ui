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
toast.loading('加载中...'); // 常驻，需手动 close()
</script>
```

`show(titleOrOptions)` 既可传字符串，也可传配置对象：

```ts
toast.show({
  title: '受价格波动影响，订单将自动终止',
  icon: false,        // 不显示图标
  position: 'bottom', // center / top / bottom
  duration: 3000,     // ms，0 或省略表示常驻
});
```

## API

| 方法 | 说明 |
|---|---|
| `show(titleOrOptions)` | 显示默认样式 toast |
| `success/error/warning/info(titleOrOptions)` | 显示对应类型 toast |
| `loading(titleOrOptions)` | 显示加载动画（默认常驻） |
| `close()` | 关闭 toast |

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

const toastRef = ref();
toastRef.value?.show({ title: '提示', type: 'success' });
toastRef.value?.hide();
</script>
```
