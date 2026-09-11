---
preview: /pages/componentsA/popup/index
---

# Popup 弹出层

基于 Overlay 与 Transition 的正式弹层，支持中心和四边弹出、圆角、关闭图标、安全区以及完整生命周期。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-popup v-model="visible" mode="bottom" round closeable safe-area-inset-bottom>
  <view class="panel">弹层内容</view>
</snake-popup>
```

关闭按钮、遮罩和业务操作都可关闭弹层。H5 中打开复杂表单弹层后，业务页面应将焦点移入弹层；关闭后恢复到触发按钮。不可只依赖滑动手势关闭。

默认通过遮罩阻止背景区域触摸滚动。嵌套滚动容器等特殊场景可设置 `:lock-scroll="false"`，并由业务自行处理背景滚动。

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
| `lockScroll`                                  | 阻止遮罩触摸滚动   | `boolean` | `true`                      |
| `safeAreaInsetBottom` / `safeAreaInsetTop`    | 安全区             | `boolean` | `false`                     |
| `customClass` / `customStyle`                 | 面板类名和样式     | 多类型    | `''`                        |

`round` 为数字或字符串时按 rpx 处理，`true` 使用主题大圆角令牌。center 模式四角全圆；四边模式只圆远离屏幕边缘的一侧。四边弹层进出场为整块滑入或滑出。

### Events

| 事件名              | 说明                | 参数       |
| ------------------- | ------------------- | ---------- |
| `update:modelValue` | 更新 `v-model`      | `boolean`  |
| `update:show`       | 更新兼容状态 `show` | `boolean`  |
| `open` / `close`    | 显示状态开始变化    | -          |
| `opened` / `closed` | 进入或离开动画完成  | -          |
| `change`            | 显示状态改变        | `{ show }` |
| `click-overlay`     | 点击遮罩            | 原生事件   |

### Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 弹层内容 |

### Expose

| 方法      | 说明     |
| --------- | -------- |
| `open()`  | 打开弹层 |
| `close()` | 关闭弹层 |

## 主题变量

| 变量                       | 用途                  |
| -------------------------- | --------------------- |
| `--snake-color-surface`    | 默认面板背景          |
| `--snake-color-text-muted` | 默认关闭图标颜色      |
| `--snake-radius-large`     | `round="true"` 的圆角 |
| `--snake-z-index-popup`    | 样式层的默认弹层层级  |
