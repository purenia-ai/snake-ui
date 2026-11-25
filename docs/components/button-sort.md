---
preview: /pages/componentsA/buttonSort/index
---

# ButtonSort 排序按钮

用于在默认、升序和降序状态之间循环切换。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-button-sort v-model="sort" title="价格" @change="handleChange" />
```

```ts
const sort = ref<ButtonSortValue>('');

function handleChange({ value }) {
    console.log(value); // '' | 'asc' | 'desc'
}
```

排序中标题与箭头一起变成主题色并加粗；不传 `v-model` 时组件自己记状态，只监听 `change` 也能用。

## 循环方式

| 配置                   | 点击顺序                                  |
| ---------------------- | ----------------------------------------- |
| 默认（`allowReset`）   | 未排序 → 升序 → 降序 → 未排序             |
| `:allow-reset="false"` | 未排序 → 升序 → 降序 → 升序（不回未排序） |
| `desc-first`           | 未排序 → 降序 → 升序 → 未排序             |
| 两项都开               | 未排序 → 降序 → 升序 → 降序（不回未排序） |

```vue
<snake-button-sort v-model="sort" title="价格" :allow-reset="false" desc-first />
```

## 受控与复位

商品列表常把「综合 / 价格 / 销量」放在同一栏，只有一列能处于排序态。
用 `v-model` 接管状态，切到别的列时把价格排序清空，箭头才会跟着复位：

```vue
<snake-button-sort v-model="priceSort" title="价格" />

<view @click="priceSort = ''">综合</view>
```

组件只在 `modelValue` 为 `undefined` 时维护内部状态；传了值就以父级为准，父级不回写时组件不会擅自变更。

## API

### Props

| 参数          | 说明                                             | 类型              | 默认值      |
| ------------- | ------------------------------------------------ | ----------------- | ----------- |
| `modelValue`  | 当前排序状态（v-model），不传则由组件自己维护    | `ButtonSortValue` | `undefined` |
| `title`       | 按钮文字                                         | `string`          | `''`        |
| `titleColor`  | 未排序时的文字颜色，不传则用主题文字色           | `string`          | `''`        |
| `activeColor` | 排序中的文字与箭头颜色，不传则用主题色           | `string`          | `''`        |
| `fontSize`    | 文字尺寸，数值按 px（375 稿）处理                | `UnitValue`       | `13`        |
| `allowReset`  | 是否允许回到未排序；关闭后只在升序与降序之间切换 | `boolean`         | `true`      |
| `descFirst`   | 是否优先切换为降序                               | `boolean`         | `false`     |
| `customClass` | 根节点自定义类名                                 | `string`          | `''`        |
| `customStyle` | 根节点自定义样式                                 | `StyleValue`      | `''`        |

### Events

| 事件名              | 触发时机       | 回调参数                           |
| ------------------- | -------------- | ---------------------------------- |
| `change`            | 排序状态切换后 | `{ value: '' \| 'asc' \| 'desc' }` |
| `update:modelValue` | 排序状态更新   | `'' \| 'asc' \| 'desc'`            |

## 主题变量

| 变量名                     | 说明                              |
| -------------------------- | --------------------------------- |
| `--snake-color-text`       | 排序按钮文字默认颜色              |
| `--snake-color-text-muted` | 未激活排序箭头颜色                |
| `--snake-color-primary`    | 激活排序文字与箭头颜色            |
| `--snake-sort-active`      | 由 `activeColor` 下发，覆盖激活色 |
