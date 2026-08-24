---
preview: /pages/componentsA/overlay/index
---

# Overlay 遮罩层

带完整淡入淡出动画的全屏遮罩，可锁定遮罩区域滚动并承载自定义内容。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-overlay v-model="visible" :opacity="0.65" :duration="300" lock-scroll>
  <view @click.stop>自定义内容</view>
</snake-overlay>
```

## API

| 参数                          | 说明                 | 类型      | 默认值        |
| ----------------------------- | -------------------- | --------- | ------------- |
| `modelValue` / `show`         | 显示状态和兼容别名   | `boolean` | `false`       |
| `opacity`                     | 黑色遮罩透明度       | `number`  | `0.5`         |
| `zIndex` / `duration`         | 层级和动画时长       | `number`  | `10070 / 300` |
| `lockScroll`                  | 是否阻止遮罩区域滚动 | `boolean` | `true`        |
| `customClass` / `customStyle` | 自定义类名和样式     | 多类型    | `''`          |

Props 包括 `modelValue`、兼容别名 `show`、`opacity`（默认 `0.5`）、`zIndex`（`10070`）、`duration`（`300`）、`lockScroll`（`true`）、`customClass` 和 `customStyle`。

点击触发 `click(event)`、`update:modelValue(false)` 和 `update:show(false)`；动画结束触发 `opened`、`closed`。默认插槽用于遮罩内容，内容需要自行使用 `@click.stop` 阻止关闭。

源码：`src/uni_modules/snake-ui/components/snake-overlay/snake-overlay.vue`
