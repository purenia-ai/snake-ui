---
preview: /pages/componentsA/empty/index
---

# Empty 空状态

用于列表、搜索结果或异常页面没有内容时提供统一反馈。内置多种语义模式，也支持图片、图标和插槽定制。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-empty mode="data" text="暂无相关内容" />
<snake-empty mode="search" text="没有找到结果" />
```

## 自定义图片与操作区

```vue
<snake-empty src="/static/empty.png" :icon-size="160" text="还没有收藏">
  <template #bottom><snake-button size="small">去逛逛</snake-button></template>
</snake-empty>
```

`src` 和 `icon` 均可覆盖模式图标；`src` 更适合图片地址，`icon` 可传 Icon 名称。

## 加载、错误与空数据

空状态应只在请求完成且结果为空时显示；加载中使用 Skeleton 或 Loading，请求失败则优先提供重试操作，避免把失败误导为“暂无数据”。

```vue
<snake-empty v-if="loaded && !items.length" mode="search" text="没有找到结果">
  <template #bottom><snake-button size="small" @click="reload">重新加载</snake-button></template>
</snake-empty>
```

## API

### Props

| 参数                  | 说明                                                                                           | 类型                        | 默认值       |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------------------------- | ------------ |
| `show`                | 是否显示                                                                                       | `boolean`                   | `true`       |
| `mode`                | 语义模式：data/list/search/page/order/coupon/favor/permission/history/message/wifi/address/car | `string`                    | `data`       |
| `src`                 | 自定义图片地址                                                                                 | `string`                    | `''`         |
| `icon`                | 自定义图标名或图片地址                                                                         | `string`                    | `''`         |
| `iconColor`           | 图标颜色                                                                                       | `string`                    | 主题弱文本色 |
| `iconSize`            | 图标或图片尺寸                                                                                 | `string \| number`          | `120`        |
| `text`                | 提示文字；为空时使用模式默认文案                                                               | `string`                    | `''`         |
| `color` / `textColor` | 文字颜色，textColor 优先                                                                       | `string`                    | 主题弱文本色 |
| `fontSize`            | 文字大小                                                                                       | `string \| number`          | `26`         |
| `marginTop`           | 组件顶部外边距                                                                                 | `string \| number`          | `0`          |
| `customClass`         | 自定义类名                                                                                     | `string`                    | `''`         |
| `customStyle`         | 根容器样式                                                                                     | `string \| object \| array` | `''`         |

### Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `icon`    | 完全替换默认图片或图标 |
| `default` | 替换默认提示文字       |
| `bottom`  | 文字下方操作区         |

## 主题变量

| 变量                       | 用途             |
| -------------------------- | ---------------- |
| `--snake-color-text-light` | 默认图标颜色     |
| `--snake-color-text-muted` | 默认提示文字颜色 |

`iconColor`、`color` 和 `textColor` 可以覆盖单个实例的颜色。
