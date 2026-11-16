---
preview: /pages/componentsA/skeleton/index
---

# Skeleton 骨架屏

`Skeleton` 在首次请求尚未完成时预显示页面结构：默认用「头像 + 标题 + 若干段落行」快速拼出一个列表占位，也可以用 `template` 插槽加 `SkeletonItem` 拼出任意骨架；`SkeletonItem` 是可复用的基础占位块，能脱离容器单独使用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`loading` 为 `true` 时显示骨架，为 `false` 时渲染默认插槽里的真实内容：

```vue
<snake-skeleton :loading="loading" avatar :rows="3">
  <product-list :list="products" />
</snake-skeleton>
```

快速模式支持的属性：`avatar` / `avatarSize` / `avatarShape`、`title` / `titleWidth` / `titleHeight`、`rows` / `rowsWidth` / `rowsHeight`。

`rowsWidth` 与 `rowsHeight` 接受数组逐行配置；宽度为标量（或数组给得不够长）时，最后一行自动收窄到 `70%`，模拟段落被裁断的视觉效果：

```vue
<snake-skeleton :rows="4" :rows-width="['100%', '100%', '86%', '58%']" :rows-height="10" />
```

## 自定义模板

`template` 插槽替换整个快速模式，用 `snake-skeleton-item` 拼业务骨架：

```vue
<snake-skeleton :loading="loading" animation="pulse">
  <template #template>
    <snake-skeleton-item variant="image" height="88px" radius="8px" />
    <view style="margin-top: 8px">
      <snake-skeleton-item width="82%" height="12px" />
    </view>
    <view style="margin-top: 8px">
      <snake-skeleton-item width="46%" height="12px" />
    </view>
  </template>
  <product-card :item="product" />
</snake-skeleton>
```

`SkeletonItem` 有四种形态：`text`（默认 100% × 16px）、`rect` 与 `image`（默认 100% × 100px）、`circle`（默认 32 × 32）。未传 `width` / `height` / `radius` 时取形态的 CSS 默认值，可以直接用主题变量统一调整（见[主题变量](#主题变量)）。圆形占位通常宽高相同，用 `size` 一次给两个值即可：`<snake-skeleton-item variant="circle" size="120rpx" />`。

::: tip 为什么不提供 `row-col` 声明式配置
wot-ui 用 `rowCol` 数组声明行列，适合「整齐等分」的宫格；Snake UI 选择 `template` 插槽 + `SkeletonItem`：可嵌套、可循环、可封装成业务组件（例如全局的 `product-skeleton`），不受行列模型限制。宫格本身用两行 `v-for` 就能表达：

```vue
<view v-for="row in 2" :key="row" style="display: flex; gap: 8px">
  <snake-skeleton-item v-for="col in 4" :key="col" variant="rect" height="48px" />
</view>
```

:::

## 动画

`animation` 有三档，默认 `shimmer`：

| 值        | 效果         | 说明                                                      |
| --------- | ------------ | --------------------------------------------------------- |
| `shimmer` | 流光从左扫过 | 用 `background-position` 位移，观感最强，但每帧都重绘背景 |
| `pulse`   | 整体呼吸变淡 | 只动 `opacity`，交给合成层处理，低端机与长列表更省电      |
| `none`    | 静态占位     | 一行多条骨架时更安静，也避免整屏一起闪                    |

```vue
<snake-skeleton animation="pulse" :rows="4" />
```

动画类型由容器下发、子项继承；单个 `SkeletonItem` 可以覆盖容器的设置（见示例页「占位形态」）。旧的 `animated` 属性仍然可用：`animated=false` 等价于 `animation="none"`，两者同时传时 `animation` 优先。

H5 端会跟随系统的「减少动态效果」偏好（`prefers-reduced-motion: reduce`）自动停掉位移与呼吸动画，并去掉静止的高亮带，占位块只剩纯底色。

## 主题与尺寸

占位色默认取主题的 muted 表面色（`--snake-color-surface-muted`：浅色 `#F1F1F1`、暗色 `#1A1A1A`），与 uView-Pro 的 `#F1F2F4`、wot-ui 的 `#E5E6EB` 同一量级，并且跟着明暗主题自动切换。需要品牌化时覆盖变量即可，不必改 `props`：

```vue
<view
    style="
        --snake-skeleton-color: var(--snake-color-primary-light);
        --snake-skeleton-highlight: rgba(var(--snake-color-primary-rgb), 0.24);
    "
>
  <snake-skeleton :rows="2" />
</view>
```

`--snake-skeleton-highlight` 是叠在底色上的半透明流光带：浅色底上扫出更深的带、深色底上扫出更亮的带，一套值同时适配明暗主题。

::: tip 铺在页面底色上时对比偏弱
默认占位色取的是卡片级的 muted 表面色（`#F1F1F1`），放在白色卡片上刚好；直接铺在页面底色（`#F6F6F6`）上只差 5 级，几乎看不见。这种情况给容器加 `--snake-skeleton-color: rgba(0, 0, 0, 0.06)` 提高一档即可，不要改组件默认值。
:::

尺寸默认值：标题 16px、段落 12px、头像 32px、`SkeletonItem` 的 `text` 16px / `rect`·`image` 100px / `circle` 32px。间距同样走变量：`--snake-skeleton-avatar-gap`（头像与内容，默认 15px）、`--snake-skeleton-title-gap`（标题与首行段落，默认 20px）、`--snake-skeleton-row-gap`（段落行之间，默认 12px）。

## 无障碍

骨架屏本身是装饰性的空块，不该被读屏逐个朗读：容器会在 `loading` 时输出 `aria-busy="true"`，快速模式的占位块整体带 `aria-hidden="true"`。传入 `label` 后容器会加上 `aria-label`，让读屏知道页面正在加载：

```vue
<snake-skeleton :loading="loading" :label="t('loading')">…</snake-skeleton>
```

`aria-*` 在 H5 与 App 端生效；小程序端能否朗读取决于平台的无障碍实现，请以真机为准。

## 与请求状态配合

只在「首次加载」用骨架屏；已有内容刷新时保留旧内容 + 局部 loading，避免整页反复闪烁：

```vue
<snake-skeleton :loading="initialLoading" :rows="4">
  <product-list :list="products" />
</snake-skeleton>
```

## API

### Skeleton

#### Props

| 参数          | 说明                                             | 类型                        | 默认值                         |
| ------------- | ------------------------------------------------ | --------------------------- | ------------------------------ |
| `loading`     | 是否显示骨架                                     | `boolean`                   | `true`                         |
| `animated`    | 是否启用流光动画（已废弃，建议改用 `animation`） | `boolean`                   | `true`                         |
| `animation`   | 动画类型，优先级高于 `animated`                  | `shimmer \| pulse \| none`  | 按 `animated` 推导为 `shimmer` |
| `title`       | 是否显示默认标题占位                             | `boolean`                   | `true`                         |
| `titleWidth`  | 默认标题宽度                                     | `string \| number`          | `40%`                          |
| `titleHeight` | 默认标题高度                                     | `string \| number`          | `16`                           |
| `rows`        | 默认段落行数                                     | `number`                    | `3`                            |
| `rowsWidth`   | 默认段落宽度，可逐行配置                         | `string \| number \| Array` | `100%`                         |
| `rowsHeight`  | 默认段落高度，可逐行配置                         | `string \| number \| Array` | `12`                           |
| `avatar`      | 是否显示默认头像占位                             | `boolean`                   | `false`                        |
| `avatarSize`  | 默认头像尺寸                                     | `string \| number`          | `32`                           |
| `avatarShape` | 默认头像形状                                     | `circle \| square`          | `circle`                       |
| `label`       | 无障碍文案，`loading` 时写入 `aria-label`        | `string`                    | `''`                           |
| `customStyle` | 根节点样式                                       | `string \| object \| array` | `''`                           |

#### Slots

| 名称       | 说明                 |
| ---------- | -------------------- |
| `default`  | 加载完成后的真实内容 |
| `template` | 自定义骨架模板       |

### SkeletonItem

#### Props

| 参数          | 说明                                                   | 类型                              | 默认值   |
| ------------- | ------------------------------------------------------ | --------------------------------- | -------- |
| `variant`     | 占位形态                                               | `text \| rect \| circle \| image` | `text`   |
| `size`        | 宽高同时取值（正方形），显式 `width` / `height` 优先   | `string \| number`                | —        |
| `width`       | 宽度，裸数字按 px（375 稿）；不传时取形态的 CSS 默认值 | `string \| number`                | 按形态   |
| `height`      | 高度，裸数字按 px（375 稿）；不传时取形态的 CSS 默认值 | `string \| number`                | 按形态   |
| `radius`      | 圆角，裸数字按 px（375 稿）；不传时取形态的 CSS 默认值 | `string \| number`                | 按形态   |
| `animated`    | 是否启用流光动画（已废弃，建议改用 `animation`）       | `boolean`                         | 继承容器 |
| `animation`   | 动画类型，未传时继承 Skeleton 容器                     | `shimmer \| pulse \| none`        | 继承容器 |
| `customStyle` | 根节点样式                                             | `string \| object \| array`       | `''`     |

## 与其他组件库的对照

| 能力         | wot-ui `wd-skeleton`     | uView-Pro `u-skeleton`      | Snake UI                                    |
| ------------ | ------------------------ | --------------------------- | ------------------------------------------- |
| 默认尺寸     | 文本 16px / 圆形 48px    | 标题与段落 18px / 头像 32px | 标题 16px / 段落 12px / 头像 32px           |
| 占位色       | `#E5E6EB`（实色）        | `#F1F2F4`（实色）           | 主题 `surface-muted`：`#F1F1F1` / `#1A1A1A` |
| 快速模式     | `theme` 预设             | `rows` / `title` / `avatar` | 同 uView-Pro，属性同名同义                  |
| 自定义结构   | `row-col` 声明式数组     | 无（只能快速模式）          | `template` 插槽 + `SkeletonItem`，可嵌套    |
| 占位块复用   | 无独立占位组件           | 无独立占位组件              | `snake-skeleton-item` 可单独使用            |
| 动画         | `gradient` / `flashed`   | 单一流光                    | `shimmer` / `pulse` / `none`                |
| 主题变量     | 11 个 `--wot-skeleton-*` | 无（写死 `#f1f2f4`）        | 13 个 `--snake-skeleton-*`                  |
| 减少动态效果 | 未处理                   | 未处理                      | 跟随 `prefers-reduced-motion`               |
| 无障碍       | 未处理                   | 未处理                      | `aria-busy` / `aria-hidden` / `label`       |

从 uView 迁移只需换标签：`animate` 换成 `animation`（`animated` 仍兼容），其余属性名与语义一致。

## 常见问题

### 骨架屏闪一下就消失

接口很快返回时，骨架屏只亮相几十毫秒，观感比没有更差。库里不内置延时（避免每个实例挂定时器），建议在业务侧合并判定：

```ts
// 请求超过 120ms 还没回来才进骨架态
const skeletonVisible = computed(() => loading.value && Date.now() - startedAt.value > 120);
```

### 骨架屏和真实内容高度不一致，切换时页面跳动

骨架屏的高度是估算值。两种处理：给容器保底高度 `customStyle="min-height: 240px"`；或让 `template` 尽量贴近真实内容的排版（同一个卡片内边距、同一张图片比例）。

### 深色模式下占位块发白

默认占位色就是主题的 `--snake-color-surface-muted`（浅色 `#F1F1F1` / 暗色 `#1A1A1A`），跟着明暗模式走，不需要另配。自定义时不要再写死浅灰实色（例如 `#f1f2f4`），否则暗色下必然发白——用主题变量（`var(--snake-color-surface-muted)`）或半透明叠加（`rgba(var(--snake-color-primary-rgb), 0.16)`）。

### 动画不动

按顺序排查：`animated=false` 或 `animation="none"`；容器传了类型但子项自己写了 `animation="none"`；H5 上系统开启了「减少动态效果」；页面整体处于后台（部分平台会暂停动画）。

### 小程序真机流光卡顿

`shimmer` 每帧都在重绘 `background-position`，长列表里叠加几十个占位块时会掉帧。改用 `animation="pulse"`（只动 `opacity`），或减少同时出现的骨架数量。

### App NVUE 下宽度不对

NVUE 不支持百分比宽度。快速模式的 `rowsWidth` 默认是 `100%`、最后一行 `70%`，在 NVUE 页面上需要显式传带单位的固定值（如 `:rows-width="300"`），或改用 `template` 插槽里定宽的 `SkeletonItem`。

## 主题变量

| 变量                                | 用途                              | 默认值                      |
| ----------------------------------- | --------------------------------- | --------------------------- |
| `--snake-skeleton-color`            | 占位基础色（取主题 muted 表面色） | `#F1F1F1`（暗色 `#1A1A1A`） |
| `--snake-skeleton-highlight`        | 流光带颜色（叠在底色上）          | `rgba(120, 120, 130, 0.12)` |
| `--snake-skeleton-text-height`      | `text` 默认高度                   | `16px`                      |
| `--snake-skeleton-text-radius`      | `text` 圆角                       | `4px`                       |
| `--snake-skeleton-rect-height`      | `rect` / `image` 默认高度         | `100px`                     |
| `--snake-skeleton-rect-radius`      | `rect` / `image` 圆角             | `8px`                       |
| `--snake-skeleton-circle-size`      | `circle` 默认边长                 | `32px`                      |
| `--snake-skeleton-circle-radius`    | `circle` 圆角                     | `50%`                       |
| `--snake-skeleton-shimmer-duration` | 流光一个周期                      | `1.8s`                      |
| `--snake-skeleton-pulse-duration`   | 呼吸一个周期                      | `2s`                        |
| `--snake-skeleton-avatar-gap`       | 头像与内容间距                    | `15px`                      |
| `--snake-skeleton-title-gap`        | 标题与首行段落间距                | `20px`                      |
| `--snake-skeleton-row-gap`          | 段落行间距                        | `12px`                      |
