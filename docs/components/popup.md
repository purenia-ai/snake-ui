---
preview: /pages/componentsA/popup
---

# Popup 弹出层

基于 `snake-overlay` 的弹层容器，支持中心及上下左右五个方向，具体内容由默认插槽提供。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-button @click="visible = true">打开</snake-button>
<snake-popup v-model="visible" mode="bottom" safe-area-inset-bottom>
  <view class="panel">弹窗内容</view>
</snake-popup>
```

## 弹出方向

```vue
<snake-popup v-model="visible" mode="center"><view>中心弹层</view></snake-popup>
<snake-popup v-model="visible" mode="right"><view class="drawer">右侧抽屉</view></snake-popup>
```

可选方向为 `center`、`top`、`right`、`bottom`、`left`。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `modelValue` | 是否显示，支持 v-model | `boolean` | `false` | `true` / `false` |
| `mode` | 弹出位置 | `string` | `center` | `center` / `top` / `right` / `bottom` / `left` |
| `bgColor` | 面板背景色 | `string` | `#fff` | CSS 颜色 |
| `zIndex` | 弹层层级 | `number` | `10075` | - |
| `closeOnClickOverlay` | 点击遮罩是否关闭 | `boolean` | `true` | `true` / `false` |
| `safeAreaInsetBottom` | 是否增加底部安全区 | `boolean` | `false` | `true` / `false` |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 请求关闭时 | `false` |
| `close` | 点击遮罩并成功请求关闭时 | - |
| `change` | 点击遮罩并成功请求关闭时 | `{ show: false }` |
| `open` | 已声明但当前实现不会主动触发 | - |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 弹层内容 | - |

## 注意事项

- 外部把 `v-model` 改为 `true` 时不会触发 `open` 或 `change({ show: true })`。
- 面板会阻止点击继续冒泡到遮罩；内容内部仍可自行关闭 v-model。
- 当前没有圆角、关闭图标和开关动画参数，可在插槽根节点设置样式。

源码：`src/uni_modules/snake-ui/components/snake-popup/snake-popup.vue`
