---
name: 'grid'
description: 'Snake UI Grid 宫格参考。处理 grid、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['grid', 'snake-grid', 'Grid', '宫格']
---

# Grid 宫格

把入口按等分宽度排成九宫格，用于首页金刚区、CMS 快捷入口与功能面板。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`column` 控制每行列数，子项宽度自动等分：

```vue
<snake-grid :column="4">
    <snake-grid-item icon="home" text="首页" />
    <snake-grid-item icon="search" text="搜索" />
    <snake-grid-item icon="share" text="分享" />
    <snake-grid-item icon="phone" text="客服" />
</snake-grid>
```

## 格线与间距

`border` 画格线（容器画外框、子项画内线，不用 `gap` 模拟以免格线断裂）；`gutter` 控制相邻格子间距：

```vue
<snake-grid :column="3" border :gutter="8">
    <snake-grid-item icon="home" text="首页" />
    <snake-grid-item icon="search" text="搜索" />
    <snake-grid-item icon="share" text="分享" />
</snake-grid>
```

## 等高格子

`square` 让每个格子撑成正方形，适合图标 + 文案的入口：

```vue
<snake-grid :column="4" square border>
    <snake-grid-item icon="home" text="首页" />
    <snake-grid-item icon="search" text="搜索" />
</snake-grid>
```

## 角标与点击

`badge` 在图标右上角挂角标；子项派发 `click(index, event)`，`clickable` 开启点击态：

```vue
<snake-grid :column="4" clickable @click="go">
    <snake-grid-item icon="phone" text="消息" :badge="3" />
    <snake-grid-item icon="home" text="首页" />
</snake-grid>
```

## API

### Props

| 参数          | 说明                             | 类型               | 默认值  |
| ------------- | -------------------------------- | ------------------ | ------- |
| `customStyle` | 根节点自定义样式                 | `StyleValue`       | `''`    |
| `customClass` | 根节点自定义类名                 | `string`           | `''`    |
| `column`      | 每行列数                         | `number`           | `4`     |
| `border`      | 是否显示格线                     | `boolean`          | `false` |
| `gutter`      | 相邻格子间距，裸数字按 375 稿 px | `number \| string` | `0`     |
| `square`      | 是否等宽等高                     | `boolean`          | `false` |
| `clickable`   | 子项是否有点击态                 | `boolean`          | `false` |

| 子项参数    | 说明           | 类型               | 默认值  |
| ----------- | -------------- | ------------------ | ------- |
| `text`      | 文案           | `string`           | `''`    |
| `icon`      | 图标名         | `string`           | `''`    |
| `iconColor` | 图标颜色       | `string`           | `''`    |
| `iconSize`  | 图标尺寸       | `number \| string` | `24`    |
| `badge`     | 右上角角标内容 | `number \| string` | `''`    |
| `disabled`  | 是否禁用       | `boolean`          | `false` |

### Events

| 事件名  | 说明       | 回调参数                        |
| ------- | ---------- | ------------------------------- |
| `click` | 点击格子时 | `index: number, event: unknown` |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 覆盖 `text`    |
| icon    | 自定义图标内容 |

## 主题变量

| 变量名                      | 说明                       |
| --------------------------- | -------------------------- |
| `--snake-grid-bg`           | 容器底色                   |
| `--snake-grid-border-color` | 格线颜色                   |
| `--snake-grid-icon-color`   | 图标颜色                   |
| `--snake-grid-text-size`    | 文案字号                   |
| `--snake-grid-item-padding` | 子项内容额外留白，默认 `0` |

## 注意

- `gutter` 以内边距实现（相邻间距 = `gutter`），`border` 与外框一起用时间距会包在格线内侧。`--snake-grid-item-padding` 是**在 `gutter/2` 之外再加**的留白，两者相加。
- 子项不要包在额外的 `view` 里，`snake-grid` 依赖直接子节点注册顺序计算宽度与角标。
- 角标是绝对定位的：`snake-badge` 让徽标圆心对准图标右上角，因此徽标会**向上溢出 7px**。祖先节点若设了 `overflow: hidden`（例如给宫格做圆角卡片），首行角标会被裁掉一半。给容器留 8px 以上缓冲即可：

```css
/* 圆角卡片 + 角标共存：留出缓冲，别让徽标的 7px 溢出撞上裁剪边界 */
.grid-card {
    border-radius: 8px;
    overflow: hidden;
    --snake-grid-item-padding: 8px;
}
```

完全不裁剪（只设 `border-radius`、不加 `overflow: hidden`）也可以，代价是有格线时子项画出的直角格线不会跟着圆角走。
