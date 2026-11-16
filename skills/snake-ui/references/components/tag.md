---
name: 'tag'
description: 'Snake UI Tag 标签参考。处理 tag、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tag', 'snake-tag', 'Tag', '标签']
---

# Tag 标签

行内标记，用于商品属性、订单状态、筛选结果等需要短文本强调的位置；支持主题、尺寸、镂空、圆角与可关闭。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`type` 决定配色，`text` 与默认插槽二选一（插槽优先）：

```vue
<snake-tag text="包邮" />
<snake-tag type="primary" text="新品" />
<snake-tag type="success">已发货</snake-tag>
<snake-tag type="error" text="缺货" />
```

## 镂空与圆角

`plain` 使用浅底 + 主题色描边，`round` 为全圆角；`hairLine` 控制镂空态描边是否按半像素渲染（默认开启）：

```vue
<snake-tag type="warning" plain round text="预售" />
<snake-tag type="primary" plain :hair-line="false" text="不缩放描边" />
```

## 尺寸与图标

`size` 支持 `default` / `medium` / `small` / `mini`，默认档位按 375 稿对齐 wot-ui：

| `size`    | 高度 | 字号 | 左右内边距 | 图标 |
| --------- | ---- | ---- | ---------- | ---- |
| `default` | 24px | 12px | 8px        | 12px |
| `medium`  | 20px | 11px | 6px        | 11px |
| `small`   | 18px | 10px | 6px        | 10px |
| `mini`    | 16px | 10px | 4px        | 9px  |

`icon` 直接传内置图标名：

```vue
<snake-tag size="small" icon="checkmark-circle" type="success" text="已认证" />
<snake-tag size="mini" text="12 期免息" />
```

## 可关闭标签

`closable` 显示关闭图标，点击后派发 `close`，由业务决定是否移除数据：

```vue
<snake-tag type="info" closable @close="removeTag">品牌直营</snake-tag>
```

## API

### Props

| 参数          | 说明                       | 类型         | 默认值      |
| ------------- | -------------------------- | ------------ | ----------- |
| `customStyle` | 根节点自定义样式           | `StyleValue` | `''`        |
| `customClass` | 根节点自定义类名           | `string`     | `''`        |
| `text`        | 标签文本，被默认插槽覆盖   | `string`     | `''`        |
| `type`        | 主题类型                   | `TagType`    | `'default'` |
| `size`        | 尺寸                       | `TagSize`    | `'default'` |
| `plain`       | 是否镂空                   | `boolean`    | `false`     |
| `round`       | 是否全圆角                 | `boolean`    | `false`     |
| `closable`    | 是否显示关闭图标           | `boolean`    | `false`     |
| `icon`        | 左侧图标名                 | `string`     | `''`        |
| `hairLine`    | 镂空态描边是否按半像素渲染 | `boolean`    | `true`      |

### Events

| 事件名  | 说明           | 回调参数         |
| ------- | -------------- | ---------------- |
| `click` | 点击标签时触发 | `event: unknown` |
| `close` | 点击关闭图标   | -                |

### Slots

| 插槽名  | 说明                        |
| ------- | --------------------------- |
| default | 标签文本内容                |
| icon    | 自定义左侧图标，覆盖 `icon` |

## 主题变量

| 变量名                     | 说明           |
| -------------------------- | -------------- |
| `--snake-tag-height`       | 标签高度       |
| `--snake-tag-padding-x`    | 左右内边距     |
| `--snake-tag-font-size`    | 字号           |
| `--snake-tag-radius`       | 圆角           |
| `--snake-tag-bg`           | 背景色         |
| `--snake-tag-color`        | 文字与图标颜色 |
| `--snake-tag-border-color` | 描边颜色       |

## 注意

- 标签只做展示，不内置选中态；需要可选中请用 `snake-checkbox` 组合。
- 镂空态使用 `::after` 半像素描边，父级若有 `overflow: hidden` 且容器紧贴标签，描边可能被裁切 1px。
- 改圆角请用 `--snake-tag-radius`，**不要**在 `customStyle` 里写 `border-radius`：半像素描边的伪元素是放大 2 倍再缩放的，圆角必须同步 ×2，只能从变量读取，否则描边圆角和底色圆角对不上。
- `type` 只认 `default` / `primary` / `success` / `warning` / `error` / `info`。写成别的值（例如从别的库搬来的 `danger`）不会报错，会静默退化成接近 `default` 的外观。
- 实心态用 `customStyle` 指定背景色时，组件会自动把描边改成透明，不会在自定义底色上留一条主题色细边；`plain` 不受影响（描边就是它的轮廓）。
