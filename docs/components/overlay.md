---
preview: /pages/componentsA/overlay/index
---

# Overlay 遮罩层

带完整淡入淡出动画的全屏遮罩，可锁定遮罩区域滚动并承载自定义内容。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-overlay v-model="visible" :opacity="0.65" :duration="300" lock-scroll>
  <view @click.stop>自定义内容</view>
</snake-overlay>
```

## API

### Props

| 参数                          | 说明                 | 类型      | 默认值        |
| ----------------------------- | -------------------- | --------- | ------------- |
| `modelValue` / `show`         | 显示状态和兼容别名   | `boolean` | `false`       |
| `opacity`                     | 黑色遮罩透明度       | `number`  | `0.5`         |
| `zIndex` / `duration`         | 层级和动画时长       | `number`  | `10070 / 300` |
| `lockScroll`                  | 是否阻止遮罩区域滚动 | `boolean` | `true`        |
| `customClass` / `customStyle` | 自定义类名和样式     | 多类型    | `''`          |

### Events

| 事件名              | 说明               | 参数     |
| ------------------- | ------------------ | -------- |
| `update:modelValue` | 点击后关闭 v-model | `false`  |
| `update:show`       | 更新兼容状态       | `false`  |
| `click`             | 点击遮罩           | 原生事件 |
| `opened`            | 进入动画结束       | -        |
| `closed`            | 离开动画结束       | -        |

### Slots

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 遮罩层内容 |

插槽内容需要自行使用 `@click.stop` 阻止点击后关闭遮罩。

## 主题变量

Overlay 没有直接使用 CSS 主题变量。遮罩透明度、层级和自定义外观分别通过 `opacity`、`zIndex` 与 `customStyle` 配置。
