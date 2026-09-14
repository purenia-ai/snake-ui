---
name: 'transition'
description: 'Snake UI Transition 过渡动画参考。处理 transition、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['transition', 'snake-transition', 'Transition', '过渡动画']
---

# Transition 过渡动画

跨端内容进出场动画，Overlay 和 Popup 均使用该组件。离场完成前节点会继续保留，因此不会出现弹层瞬间消失的问题。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-transition :show="visible" name="fade-up" :duration="300">
  <view class="card">内容</view>
</snake-transition>
```

动画名支持 `fade`、`fade-up/down/left/right`、`slide-up/down/left/right`、`zoom-in` 和 `zoom-out`。

## 分别设置进出场

`duration` 可传对象，为进入和离开设置不同节奏；通过生命周期事件衔接数据准备或资源清理。

```vue
<snake-transition :show="visible" name="slide-up" :duration="{ enter: 220, leave: 160 }" @after-enter="loadPanelData" @after-leave="resetPanel">
  <view class="sheet">内容</view>
</snake-transition>
```

快速切换 `show` 时，当前动画会被取消，并触发对应的 `enter-cancelled` 或 `leave-cancelled`；不要在取消事件中假定动画已完成。

## API

### Props

| 参数             | 说明                       | 类型                         | 默认值         |
| ---------------- | -------------------------- | ---------------------------- | -------------- |
| `show`           | 是否显示内容               | `boolean`                    | `true`         |
| `name`           | 预设动画名                 | `string`                     | `fade`         |
| `duration`       | 时长；对象可分别设置进出场 | `number \| { enter, leave }` | `300`          |
| `timingFunction` | 动画曲线                   | `string`                     | Snake 标准曲线 |
| `delay`          | 延迟时间，单位 ms          | `number`                     | `0`            |
| `appear`         | 首次显示是否执行动画       | `boolean`                    | `false`        |
| `customClass`    | 自定义类名                 | `string`                     | `''`           |
| `customStyle`    | 根节点样式                 | `string \| object \| array`  | `''`           |

### Events

| 事件名                                   | 触发时机             | 参数    |
| ---------------------------------------- | -------------------- | ------- |
| `before-enter` / `enter` / `after-enter` | 进入动画各阶段       | -       |
| `before-leave` / `leave` / `after-leave` | 离开动画各阶段       | -       |
| `enter-cancelled` / `leave-cancelled`    | 动画被反向切换而取消 | -       |
| `click`                                  | 点击根节点           | `event` |

### Slots

| 插槽名    | 说明           |
| --------- | -------------- |
| `default` | 执行过渡的内容 |

## 主题变量

组件未直接使用 CSS 主题变量。可通过 `customClass` 和 `customStyle` 设置内容容器样式。
