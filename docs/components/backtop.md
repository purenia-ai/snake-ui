---
preview: /pages/componentsA/backtop/index
description: 使用 Snake UI Backtop 在长页面一键回到顶部，支持阈值、形状、位置与自定义内容。
---

# Backtop 回到顶部

长页面滚动超过阈值后出现的回到顶部按钮，点击调用 `uni.pageScrollTo` 平滑回到页面顶部。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

组件拿不到页面滚动距离，需要在页面的 `onPageScroll` 中把 `scrollTop` 传进来：

```vue
<template>
    <view class="page">
        <snake-backtop :scroll-top="scrollTop" />
    </view>
</template>

<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app';
import { ref } from 'vue';

const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
</script>
```

滚动距离超过 `top`（默认 300px）时按钮淡入，回落到阈值以内时淡出，隐藏状态不渲染节点，不会残留透明按钮挡住页面点击。

## 自定义形状、位置与内容

```vue
<snake-backtop :scroll-top="scrollTop" shape="square" text="TOP" :bottom="120" :right="24" />
```

默认插槽会整体替换按钮内容，需要图标和文字以外的组合时直接写插槽：

```vue
<snake-backtop :scroll-top="scrollTop">
  <snake-icon name="arrow-up" />
  <text>顶部</text>
</snake-backtop>
```

`shape="square"` 使用圆角矩形；`circle`（默认）在图标模式下是正圆，带文字时呈胶囊形。

## API

### Props

| 参数          | 说明                                                        | 类型           | 默认值         |
| ------------- | ----------------------------------------------------------- | -------------- | -------------- |
| `scrollTop`   | 页面滚动距离，取 `onPageScroll` 的 `e.scrollTop`，必填      | `number`       | -              |
| `top`         | 显示阈值，滚动距离超过该值显示按钮                          | `UnitValue`    | `300`          |
| `bottom`      | 距屏幕底部的距离                                            | `UnitValue`    | `100`          |
| `right`       | 距屏幕右侧的距离                                            | `UnitValue`    | `20`           |
| `shape`       | 按钮形状，可选 `circle` / `square`                          | `BacktopShape` | `circle`       |
| `icon`        | 图标名或图片地址，规则同 [Icon](/components/icon) 的 `name` | `string`       | `arrow-upward` |
| `iconSize`    | 图标尺寸，数值按 px（375 稿）处理                           | `UnitValue`    | `20`           |
| `iconColor`   | 图标颜色                                                    | `string`       | 主题次要文字色 |
| `text`        | 图标下方文字，为空时不渲染                                  | `string`       | `''`           |
| `duration`    | 回到顶部的滚动时长，单位 ms                                 | `number`       | `100`          |
| `zIndex`      | 按钮层级                                                    | `number`       | `10`           |
| `customClass` | 根节点自定义类名                                            | `string`       | `''`           |
| `customStyle` | 根节点自定义样式                                            | `StyleValue`   | `''`           |

`top`、`bottom`、`right`、`iconSize` 的裸数字按 375 稿 px 处理，带单位的字符串原样生效，例如 `top="600rpx"`。

### Events

| 事件名  | 说明                     | 参数             |
| ------- | ------------------------ | ---------------- |
| `click` | 点击按钮时触发，早于滚动 | `event: unknown` |

### Slots

| 插槽名    | 说明                     |
| --------- | ------------------------ |
| `default` | 整体替换默认的图标与文字 |

## 主题变量

| 变量                           | 用途         |
| ------------------------------ | ------------ |
| `--snake-color-surface`        | 按钮背景色   |
| `--snake-color-border`         | 按钮描边颜色 |
| `--snake-color-shadow`         | 按钮投影颜色 |
| `--snake-color-text-secondary` | 默认图标颜色 |
| `--snake-color-text-muted`     | 文字颜色     |
| `--snake-radius-large`         | 方形模式圆角 |

需要跟随主题换色时覆盖上述变量即可，例如把按钮改成品牌实心色：

```scss
.snake-backtop {
    background-color: var(--snake-color-primary);
    border-color: var(--snake-color-primary);
}
```
