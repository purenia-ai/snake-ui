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

| 参数           | 说明                                                                  | 类型                 | 默认值           |
| -------------- | --------------------------------------------------------------------- | -------------------- | ---------------- |
| `list`         | 用于轮播或滚动的消息列表                                              | `string[]`           | `[]`             |
| `text`         | 展示文本；传入数组时按列表轮播                                        | `string \| string[]` | `''`             |
| `type`         | 主题类型，可选值 `primary` / `success` / `warning` / `error` / `info` | `string`             | `warning`        |
| `mode`         | 展示模式，可选值 `horizontal`（横向滚动）/ `vertical`（纵向轮播）     | `NoticeBarMode`      | `horizontal`     |
| `modelValue`   | 可见性（v-model）                                                     | `boolean`            | `true`           |
| `show`         | 是否显示组件（v-model:show），未设置时跟随 `modelValue`               | `boolean`            | `true`           |
| `autoplay`     | 是否自动播放                                                          | `boolean`            | `true`           |
| `volumeIcon`   | 是否显示左侧提示图标                                                  | `boolean`            | `false`          |
| `volumeSize`   | 左侧提示图标尺寸，数值按 px（375 稿）处理                             | `UnitValue`          | `17`             |
| `moreIcon`     | 是否显示右侧"更多"图标                                                | `boolean`            | `false`          |
| `closeIcon`    | 是否显示关闭图标                                                      | `boolean`            | `false`          |
| `bgColor`      | 背景颜色                                                              | `string`             | 主题类型浅色背景 |
| `color`        | 文字颜色                                                              | `string`             | 主题类型文字色   |
| `fontSize`     | 文字大小，数值按 px（375 稿）处理                                     | `UnitValue`          | `14`             |
| `duration`     | 纵向轮播间隔及横向静态消息停留时间，单位 ms                           | `number`             | `3000`           |
| `speed`        | 横向滚动速度，单位 px/s                                               | `number`             | `40`             |
| `isCircular`   | 横向是否无缝循环                                                      | `boolean`            | `true`           |
| `playState`    | 播放状态，可选值 `play`（播放）/ `paused`（暂停）                     | `string`             | `play`           |
| `disableTouch` | 纵向轮播是否禁用手势                                                  | `boolean`            | `true`           |
| `borderRadius` | 圆角大小，数值按 px（375 稿）处理                                     | `UnitValue`          | `0`              |
| `padding`      | 内边距                                                                | `string`             | `9px 12px`       |
| `noListHidden` | 无内容时是否隐藏组件                                                  | `boolean`            | `true`           |
| `customClass`  | 根节点自定义类名                                                      | `string`             | `''`             |
| `customStyle`  | 根节点自定义样式                                                      | `StyleValue`         | `''`             |

### Events

| 事件名              | 触发时机                                 | 参数      |
| ------------------- | ---------------------------------------- | --------- |
| `update:modelValue` | 关闭时同步 v-model 可见性                | `boolean` |
| `update:show`       | 关闭时同步 v-model:show 可见性           | `boolean` |
| `click`             | 点击当前通知                             | 当前索引  |
| `change`            | 纵向通知切换                             | 当前索引  |
| `close`             | 点击关闭图标                             | -         |
| `getMore`           | 点击更多图标                             | -         |
| `end`               | 非循环横向播放完成，或纵向消息完成一整轮 | -         |

## 主题变量

| 变量                              | 用途               |
| --------------------------------- | ------------------ |
| `--snake-color-<type>`            | 对应类型的文字颜色 |
| `--snake-color-<type>-light`      | 对应类型的浅色背景 |
| `--snake-color-notice`            | 主题文字回退值     |
| `--snake-color-notice-background` | 主题背景回退值     |

`color` 和 `bgColor` 会覆盖单个实例的主题颜色。
