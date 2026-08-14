---
preview: /pages/componentsA/sticky
---

# Sticky 吸顶

通过节点测量和页面滚动状态实现跨端吸顶，不再只依赖浏览器 CSS sticky。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

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

进入与离开固定状态时触发 `fixed(detail)`、`unfixed(detail)`，两者同时触发 `change(detail)`；`detail` 为 `{ isFixed, index }`。实例暴露异步 `update()`，内容尺寸改变后可主动重新测量。

源码：`src/uni_modules/snake-ui/components/snake-sticky/snake-sticky.vue`
