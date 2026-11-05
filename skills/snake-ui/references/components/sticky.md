---
name: 'sticky'
description: 'Snake UI Sticky 吸顶参考。处理 sticky、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['sticky', 'snake-sticky', 'Sticky', '吸顶']
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

## 导航栏偏移与动态内容

H5 端使用 uni-app 内置导航栏的页面无需任何配置：未传入 `custom-nav-height` 时组件自动让出内置导航栏的 44px。小程序 / App 的原生导航栏在视口之外，默认从页面顶部吸附；页面自绘固定导航栏时通过 `custom-nav-height` 传入其高度，无导航栏页面显式传 `0`。

固定导航栏下使用 `offset-top` 避开导航区。异步筛选项、图片或折叠内容改变高度后，等待视图更新并调用实例 `update()` 重新测量。

## API

### Props

| 参数              | 说明                                                                                                        | 类型               | 默认值                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------- |
| `offsetTop`       | 吸顶或定位的顶部偏移量，数值按 px（375 稿）处理，带 px 后缀时按 px 处理                                     | `UnitValue`        | `0`                    |
| `customNavHeight` | 自定义导航栏高度，单位 px；未传入时 H5 端自动让出内置导航栏 `44`，其余端为 `0`；显式传 `0` 表示页面无导航栏 | `UnitValue`        | H5 端 `44`，其余端 `0` |
| `zIndex`          | 组件层级                                                                                                    | `number`           | `10`                   |
| `disabled`        | 是否禁用吸顶                                                                                                | `boolean`          | `false`                |
| `bgColor`         | 背景颜色                                                                                                    | `string`           | `transparent`          |
| `scrollTop`       | 外部滚动位置，仅在降级定位模式下参与计算，该模式同时监听页面滚动                                            | `number`           | `0`                    |
| `index`           | 当前数据项索引，事件回调中携带                                                                              | `number \| string` | `0`                    |
| `customClass`     | 根节点自定义类名                                                                                            | `string`           | `''`                   |
| `customStyle`     | 根节点自定义样式                                                                                            | `StyleValue`       | `''`                   |

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
