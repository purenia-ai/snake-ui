---
preview: /pages/componentsA/transition
---

# Transition 过渡动画

跨端内容进出场动画，Overlay 和 Popup 均使用该组件。离场完成前节点会继续保留，因此不会出现弹层瞬间消失的问题。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-transition :show="visible" name="fade-up" :duration="300">
  <view class="card">内容</view>
</snake-transition>
```

动画名支持 `fade`、`fade-up/down/left/right`、`slide-up/down/left/right`、`zoom-in` 和 `zoom-out`。

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

## Events

进入阶段依次触发 `before-enter`、`enter`、`after-enter`；离开阶段依次触发 `before-leave`、`leave`、`after-leave`。动画被反向切换时触发 `enter-cancelled` 或 `leave-cancelled`，点击根节点触发 `click`。

源码：`src/uni_modules/snake-ui/components/snake-transition/snake-transition.vue`
