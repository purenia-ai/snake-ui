---
preview: /pages/componentsA/sticky/index
---

# Sticky 吸顶

通过节点测量和页面滚动状态实现跨端吸顶，不再只依赖浏览器 CSS sticky。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-sticky :offset-top="0" bg-color="#fff" @change="onStickyChange">
  <view>筛选导航</view>
</snake-sticky>
```

## API

### Props

| 参数                          | 说明                           | 类型               | 默认值             |
| ----------------------------- | ------------------------------ | ------------------ | ------------------ |
| `offsetTop`                   | 吸顶偏移，数字按 px            | `string \| number` | `0`                |
| `customNavHeight`             | 自定义导航栏高度               | `string \| number` | `0`                |
| `scrollTop`                   | 外部滚动位置；也会监听页面滚动 | `number`           | `0`                |
| `zIndex` / `bgColor`          | 层级和背景                     | `number / string`  | `10 / transparent` |
| `disabled`                    | 禁用吸顶                       | `boolean`          | `false`            |
| `index`                       | 事件携带的业务索引             | `string \| number` | `0`                |
| `customClass` / `customStyle` | 自定义类名和样式               | 多类型             | `''`               |

### Events

| 事件名    | 触发时机         | 参数                 |
| --------- | ---------------- | -------------------- |
| `fixed`   | 进入固定状态     | `{ isFixed, index }` |
| `unfixed` | 离开固定状态     | `{ isFixed, index }` |
| `change`  | 固定状态发生变化 | `{ isFixed, index }` |

### Slots

| 插槽名    | 说明     |
| --------- | -------- |
| `default` | 吸顶内容 |

### Expose

| 方法       | 说明                           |
| ---------- | ------------------------------ |
| `update()` | 内容尺寸改变后异步重新测量位置 |

## 主题变量

组件未直接使用 CSS 主题变量。可通过 `bgColor` 设置背景，并通过 `customStyle` 覆盖其他视觉样式。
