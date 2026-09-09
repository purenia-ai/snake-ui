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

横向模式会根据 `speed` 生成跑马灯；设置 `play-state="paused"` 可暂停，纵向模式使用原生 swiper。

## API

### Props

| 参数                                    | 说明                                     | 类型                        | 默认值               |
| --------------------------------------- | ---------------------------------------- | --------------------------- | -------------------- |
| `list` / `text`                         | 通知列表或单条文字                       | `string[] \| string`        | `[]` / `''`          |
| `type`                                  | primary/success/warning/error/info 主题  | `string`                    | `warning`            |
| `mode` / `direction`                    | horizontal/vertical；row/column 兼容写法 | `string`                    | `horizontal` / `row` |
| `show` / `autoplay`                     | 是否显示、是否自动播放                   | `boolean`                   | `true`               |
| `volumeIcon` / `moreIcon` / `closeIcon` | 左侧提示、更多、关闭图标                 | `boolean`                   | `false`              |
| `bgColor` / `color` / `fontSize`        | 背景、文字颜色和字号                     | `string \| number`          | 主题默认值           |
| `duration`                              | 纵向轮播间隔，ms                         | `number`                    | `3000`               |
| `speed`                                 | 横向滚动速度                             | `number`                    | `80`                 |
| `isCircular` / `playState`              | 是否循环、play/paused                    | `boolean \| string`         | `true` / `play`      |
| `disableTouch`                          | 纵向轮播是否禁用手势                     | `boolean`                   | `true`               |
| `borderRadius` / `padding`              | 圆角和内边距                             | `string \| number`          | `0` / 默认内边距     |
| `noListHidden`                          | 没有内容时是否隐藏                       | `boolean`                   | `true`               |
| `customClass` / `customStyle`           | 自定义类名和样式                         | `string \| object \| array` | `''`                 |

### Events

| 事件名    | 触发时机     | 参数     |
| --------- | ------------ | -------- |
| `click`   | 点击当前通知 | 当前索引 |
| `change`  | 纵向通知切换 | 当前索引 |
| `close`   | 点击关闭图标 | -        |
| `getMore` | 点击更多图标 | -        |

## 主题变量

| 变量                              | 用途               |
| --------------------------------- | ------------------ |
| `--snake-color-<type>`            | 对应类型的文字颜色 |
| `--snake-color-<type>-light`      | 对应类型的浅色背景 |
| `--snake-color-notice`            | 主题文字回退值     |
| `--snake-color-notice-background` | 主题背景回退值     |

`color` 和 `bgColor` 会覆盖单个实例的主题颜色。

源码：`src/uni_modules/snake-ui/components/snake-notice-bar/snake-notice-bar.vue`
