---
name: 'loadmore'
description: 'Snake UI Loadmore 加载更多参考。处理 loadmore、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['loadmore', 'snake-loadmore', 'Loadmore', '加载更多']
---

# Loadmore 加载更多

用于列表底部反馈分页状态。组件不直接请求数据，点击可加载状态时会派发 `loadmore`，由业务更新 `status`。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-loadmore :status="status" @loadmore="loadNextPage" />
```

## 动画与结束线

```vue
<snake-loadmore status="loading" icon-type="flower" icon-color="#06D290" />
<snake-loadmore status="nomore" is-dot nomore-text="已经到底啦" />
```

`loadText` 可传字符串，也可传 `{ loadmore, loading, nomore }` 一次配置全部状态文案。

## API

### Props

| 参数           | 说明                                                                             | 类型                     | 默认值         |
| -------------- | -------------------------------------------------------------------------------- | ------------------------ | -------------- |
| `status`       | 加载状态，可选值 `loadmore`（待加载）/ `loading`（加载中）/ `nomore`（没有更多） | `LoadmoreStatus`         | `loadmore`     |
| `loadText`     | 待加载文案；也可传 `{ loadmore, loading, nomore }` 对象一次配置全部状态文案      | `string \| LoadmoreText` | `加载更多`     |
| `loadingText`  | 加载中状态文案                                                                   | `string`                 | `加载中`       |
| `nomoreText`   | 无更多数据文案                                                                   | `string`                 | `没有更多了`   |
| `bgColor`      | 背景颜色                                                                         | `string`                 | `transparent`  |
| `icon`         | 加载中是否显示动画图标                                                           | `boolean`                | `true`         |
| `iconType`     | 加载图标类型，可选值 `circle`（圆环）/ `flower`（花朵）/ `spinner`（旋转条）     | `string`                 | `circle`       |
| `iconColor`    | 加载图标颜色                                                                     | `string`                 | 主题浅文本色   |
| `isDot`        | `nomore` 状态是否显示点状分隔线                                                  | `boolean`                | `false`        |
| `color`        | 文字颜色                                                                         | `string`                 | 主题次要文字色 |
| `fontSize`     | 文字大小，数值按 px（375 稿）处理                                                | `UnitValue`              | `14`           |
| `marginTop`    | 组件顶部外边距                                                                   | `UnitValue`              | `0`            |
| `marginBottom` | 组件底部外边距                                                                   | `UnitValue`              | `0`            |
| `height`       | 组件高度，数值按 px（375 稿）处理                                                | `UnitValue`              | `auto`         |
| `customClass`  | 根节点自定义类名                                                                 | `string`                 | `''`           |
| `customStyle`  | 根节点自定义样式                                                                 | `StyleValue`             | `''`           |

### Events

| 事件名     | 触发时机           | 参数          |
| ---------- | ------------------ | ------------- |
| `loadmore` | 点击 loadmore 状态 | -             |
| `click`    | 点击组件           | 当前 `status` |

## 主题变量

| 变量名                         | 说明             |
| ------------------------------ | ---------------- |
| `--snake-color-text-light`     | 加载图标默认颜色 |
| `--snake-color-text-secondary` | 状态文字默认颜色 |
