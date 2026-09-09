---
preview: /pages/componentsB/notice/index
cms: true
---

# 公告 <span class="cms-badge">CMS</span>

使用 Snake UI NoticeBar 展示单条横向公告或多条纵向轮播公告。

## 运行前提

依赖 Snake NoticeBar 和 `uni.$snake.navTo`。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-notice
    :datas="{
        direction: 'column',
        textList: [
            { text: '夏季活动开始', url: '/pages/activity/summer' },
            { text: '会员权益更新', url: '/pages/member/index' }
        ],
        noticeText: [],
        isLeftIcon: true,
        backColor: '#effaf5',
        textColor: '#176b4b',
        pageMargin: 24,
        height: 72
    }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数    | 说明             | 类型 | 默认值             | 可选值 |
| ------- | ---------------- | ---- | ------------------ | ------ |
| `datas` | `Object \| null` | `{}` | 公告内容和样式配置 |

### `datas` 字段

| 字段         | 说明                                     |
| ------------ | ---------------------------------------- |
| `direction`  | `row` 使用横向模式，其他值使用纵向模式   |
| `noticeText` | 横向公告内容，或传给公告栏的内容列表     |
| `textList`   | 纵向公告对象数组，每项读取 `text`、`url` |
| `isLeftIcon` | 是否显示音量图标                         |
| `backColor`  | 背景色                                   |
| `textColor`  | 文字颜色                                 |
| `height`     | 公告栏高度，缺省为 `72rpx`               |
| `pageMargin` | 水平内边距                               |
| `url`        | 横向公告点击跳转地址                     |

组件未向父级发送事件；点击后直接导航。

## 注意事项

组件计算属性会直接调用 `datas.textList.map`，即使使用横向公告也建议传入空数组。纵向点击回调的参数会被当作数组索引使用。

## 主题变量

组件未直接使用 CSS 主题变量。公告背景、文字和图标颜色通过 `datas.backColor`、`textColor` 等字段配置。

源码：`src/uni_modules/snake-ui/components/snake-notice/snake-notice.vue`
