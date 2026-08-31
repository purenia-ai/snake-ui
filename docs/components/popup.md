---
preview: /pages/componentsA/popup/index
---

# Popup 弹出层

基于 Overlay 与 Transition 的正式弹层，支持中心和四边弹出、圆角、关闭图标、安全区以及完整生命周期。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-popup v-model="visible" mode="bottom" round closeable safe-area-inset-bottom>
  <view class="panel">弹层内容</view>
</snake-popup>
```

关闭按钮、遮罩和业务操作都可关闭弹层。H5 中打开复杂表单弹层后，业务页面应将焦点移入弹层；关闭后恢复到触发按钮。不可只依赖滑动手势关闭。

## API

### Props

| 参数                                          | 说明               | 类型      | 默认值                      |
| --------------------------------------------- | ------------------ | --------- | --------------------------- |
| `modelValue` / `show`                         | 显示状态和兼容别名 | `boolean` | `false`                     |
| `mode`                                        | 弹出方向           | `string`  | `center`                    |
| `duration` / `zIndex` / `bgColor`             | 动画、层级和背景   | 多类型    | `300 / 10075 / 主题表面色`  |
| `round` / `zoom`                              | 圆角与中心缩放     | 多类型    | `false / true`              |
| `closeable` / `closeIcon` / `closeIconPos`    | 关闭按钮参数       | 多类型    | `false / close / top-right` |
| `closeOnClickOverlay`                         | 点击遮罩关闭       | `boolean` | `true`                      |
| `overlay` / `overlayOpacity` / `overlayStyle` | 遮罩参数           | 多类型    | `true / 0.5 / ''`           |
| `safeAreaInsetBottom` / `safeAreaInsetTop`    | 安全区             | `boolean` | `false`                     |
| `customClass` / `customStyle`                 | 面板类名和样式     | 多类型    | `''`                        |

## Events 与方法

状态开始变化时触发 `open` 或 `close` 及 `change({ show })`，动画完成后触发 `opened` 或 `closed`，点击遮罩触发 `click-overlay(event)`。组件实例暴露 `open()`、`close()`；同时支持 `v-model`。

源码：`src/uni_modules/snake-ui/components/snake-popup/snake-popup.vue`
