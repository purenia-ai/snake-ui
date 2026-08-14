---
preview: /pages/componentsA/button-sort
---

# ButtonSort 排序按钮

用于在默认、升序和降序状态之间循环切换。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-button-sort title="价格" @change="sort = $event.value" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `title` | 按钮文字 | `string` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `change` | 排序状态切换后 | `{ value: '' \| 'asc' \| 'desc' }` |

源码：`src/uni_modules/snake-ui/components/snake-button-sort/snake-button-sort.vue`
