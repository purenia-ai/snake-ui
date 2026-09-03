# useModal

`useModal()` 提供 modal 的函数式调用，返回 `{ show, confirm, close, clearLoading }`。使用前需在页面或应用里至少存在一个 `<snake-modal global />` 或 `<snake-modal page />` 实例用于承接事件，不影响原 `<snake-modal v-model>` 声明式用法。

```vue
<!-- App.vue 根部挂一个全局 modal -->
<snake-modal global />
```

```vue
<script setup lang="ts">
import { useModal } from '@puresnake/snake-ui';

const modal = useModal();

function confirmDelete() {
    modal.confirm({
        title: '删除记录',
        content: '此操作无法撤销',
        asyncClose: true,
        onConfirm: async () => {
            await removeRecord();
            modal.close();
        }
    });
}
</script>
```

## 调用方式

- 应用级：`useModal()` / `useModal(true)` / `useModal({ global: true })`，配合 `<snake-modal global />`。
- 页面级：`useModal(false)` / `useModal({ page: true })` / `useModal({ page: 'pageId' })`，配合 `<snake-modal page />` 或 `<snake-modal page="pageId" />`。

## API

| 方法 | 说明 |
| --- | --- |
| `show(contentOrOptions)` | 显示 modal；传入字符串时作为 `content` |
| `confirm(contentOrOptions)` | 显示带确认/取消按钮的 modal，默认 `showCancelButton: true` |
| `close()` | 关闭 modal |
| `clearLoading()` | 清除确认按钮 loading 状态（异步关闭场景） |

`contentOrOptions` 与 `<snake-modal>` 的 props 一一对应（除 `modelValue`），并额外支持 `onConfirm` / `onCancel` 回调。
