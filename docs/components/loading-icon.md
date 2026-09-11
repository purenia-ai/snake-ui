---
preview: /pages/componentsA/loadingIcon/index
---

# LoadingIcon 加载图标

统一的加载状态组件，供 Button、Image 以及业务页面复用，支持圆环和花朵两种形态。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-loading-icon />
<snake-loading-icon mode="spinner" color="#06D290" :size="28" text="加载中" />
<snake-loading-icon vertical text="正在提交" />
```

## API

### Props

| 参数             | 说明                   | 类型                        | 默认值           |
| ---------------- | ---------------------- | --------------------------- | ---------------- |
| `show`           | 是否显示               | `boolean`                   | `true`           |
| `mode`           | 加载形态               | `circle \| spinner`         | `circle`         |
| `color`          | 活动颜色               | `string`                    | Snake 主色       |
| `inactiveColor`  | 非活动颜色             | `string`                    | Snake 边框色     |
| `size`           | 图标尺寸，数字按 px    | `string \| number`          | `20`             |
| `text`           | 提示文字               | `string`                    | `''`             |
| `textColor`      | 文字颜色               | `string`                    | Snake 次要文字色 |
| `textSize`       | 文字尺寸               | `string \| number`          | `14`             |
| `vertical`       | 图标与文字是否垂直排列 | `boolean`                   | `false`          |
| `timingFunction` | 动画曲线               | `string`                    | `linear`         |
| `duration`       | 旋转周期，单位 ms      | `number`                    | `1000`           |
| `customStyle`    | 根节点样式             | `string \| object \| array` | `''`             |

## 主题变量

| 变量                       | 用途           |
| -------------------------- | -------------- |
| `--snake-color-primary`    | 默认活动颜色   |
| `--snake-color-border`     | 默认非活动颜色 |
| `--snake-color-text-muted` | 默认文字颜色   |

`color`、`inactiveColor` 和 `textColor` 可以覆盖单个实例的颜色。
