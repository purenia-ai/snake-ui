---
preview: /pages/componentsA/overlay
---

# Overlay 遮罩层

覆盖当前页面视口，用于弹窗、抽屉和需要阻断背景操作的场景，可在遮罩中承载自定义内容。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-button @click="visible = true">打开遮罩</snake-button>
<snake-overlay v-model="visible"><view class="center-tip">点击关闭</view></snake-overlay>
```

## 透明度与层级

```vue
<snake-overlay v-model="visible" :opacity="0.72" :z-index="12000" :duration="180" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `modelValue` | 是否显示，支持 v-model | `boolean` | `false` | `true` / `false` |
| `opacity` | 黑色背景透明度 | `number` | `0.5` | `0` 至 `1` |
| `zIndex` | 层级 | `number` | `10070` | - |
| `duration` | CSS 过渡时长，单位 ms | `number` | `250` | - |
| `customStyle` | 自定义样式 | `string \| object \| array` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 点击遮罩后请求关闭 | `false` |
| `click` | 点击遮罩 | 原始点击事件 |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 遮罩内内容 | - |

## 注意事项

- 点击插槽内容也会冒泡并关闭遮罩；需要阻止时在内容根节点使用 `@click.stop`。
- 当前使用 `v-if` 切换节点，CSS 只声明过渡时长，没有进入/离开动画类。

源码：`src/uni_modules/snake-ui/components/snake-overlay/snake-overlay.vue`
