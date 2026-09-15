---
preview: /pages/componentsA/noticeBar/index
---

# NoticeBar 通知栏

用于公告、活动提示和多条消息轮播，支持横向跑马灯、纵向轮播、关闭与更多操作。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-notice-bar volume-icon text="欢迎使用 Snake UI" />
```

横向模式根据实际内容宽度和 `speed` 计算动画时长，并在有内容时持续播放。`play-state="paused"` 会暂停播放。

## 纵向轮播与操作

```vue
<snake-notice-bar
    :list="['第一条公告', '第二条公告']"
    mode="vertical"
    more-icon
    close-icon
    :duration="3000"
    @change="onChange"
    @get-more="openNoticeList"
/>
```

纵向模式使用原生 swiper；横向 `is-circular="false"` 会逐条播放，最后一条完成后触发 `end`。

## 关闭与重置

关闭图标会立即隐藏组件，并同步触发 `close`、`update:show` 与 `update:modelValue`。使用 `v-model:show` 或标准 `v-model` 可由父组件同步可见性。

```vue
<snake-notice-bar v-model:show="showNotice" text="系统公告" close-icon more-icon @get-more="goNoticeList" />
```

通过组件 ref 调用 `reset()`，可从第一条消息重新开始并重新测量尺寸。

## API

### Props

| 参数                                    | 说明                                         | 类型                        | 默认值               |
| --------------------------------------- | -------------------------------------------- | --------------------------- | -------------------- |
| `list` / `text`                         | 通知列表或文本                               | `string[] \| string`        | `[]` / `''`          |
| `type`                                  | `primary/success/warning/error/info` 主题    | `string`                    | `warning`            |
| `mode` / `direction`                    | `horizontal/vertical`，`row/column` 兼容写法 | `string`                    | `horizontal` / `row` |
| `modelValue` / `show`                   | `v-model` / `v-model:show` 可见性            | `boolean`                   | `true`               |
| `autoplay` / `playState`                | 是否自动播放、`play/paused` 播放状态         | `boolean \| string`         | `true` / `play`      |
| `volumeIcon` / `moreIcon` / `closeIcon` | 左侧提示、更多、关闭图标                     | `boolean`                   | `false`              |
| `bgColor` / `color` / `fontSize`        | 背景、文字颜色和字号                         | `string \| number`          | 主题默认值           |
| `duration`                              | 纵向轮播间隔及横向静态消息停留时间（ms）     | `number`                    | `3000`               |
| `speed`                                 | 横向滚动速度（rpx/s）                        | `number`                    | `80`                 |
| `isCircular`                            | 横向是否无缝循环                             | `boolean`                   | `true`               |
| `disableTouch`                          | 纵向轮播是否禁用手势                         | `boolean`                   | `true`               |
| `borderRadius` / `padding`              | 圆角与内边距                                 | `string \| number`          | `0` / `18rpx 24rpx`  |
| `noListHidden`                          | 无内容时是否隐藏                             | `boolean`                   | `true`               |
| `customClass` / `customStyle`           | 自定义类名与样式                             | `string \| object \| array` | `''`                 |

### Events

| 事件名                              | 触发时机                                 | 参数      |
| ----------------------------------- | ---------------------------------------- | --------- |
| `update:modelValue` / `update:show` | 关闭时同步可见性                         | `boolean` |
| `click`                             | 点击当前通知                             | 当前索引  |
| `change`                            | 纵向通知切换                             | 当前索引  |
| `close`                             | 点击关闭图标                             | -         |
| `getMore`                           | 点击更多图标                             | -         |
| `end`                               | 非循环横向播放完成，或纵向消息完成一整轮 | -         |

## 主题变量

| 变量                              | 用途               |
| --------------------------------- | ------------------ |
| `--snake-color-<type>`            | 对应类型的文字颜色 |
| `--snake-color-<type>-light`      | 对应类型的浅色背景 |
| `--snake-color-notice`            | 主题文字回退值     |
| `--snake-color-notice-background` | 主题背景回退值     |

`color` 和 `bgColor` 会覆盖单个实例的主题颜色。
