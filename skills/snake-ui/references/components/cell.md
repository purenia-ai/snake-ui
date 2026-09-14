---
name: 'cell'
description: 'Snake UI Cell 单元格参考。处理 cell、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['cell', 'snake-cell', 'Cell', '单元格']
---

# Cell 单元格

Cell 组件由 `CellItem` 和 `CellGroup` 组成：前者用于展示单条信息或入口，后者负责将多条内容组织为带标题和外边框的分组。推荐两者搭配使用；`CellItem` 也可以独立使用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-cell-group title="个人中心">
  <snake-cell-item icon="phone" title="手机号码" value="138****8000" />
  <snake-cell-item title="地址管理" value="收货地址" />
</snake-cell-group>
```

## 自定义内容与交互

`title`、`value`、`label` 为空时可使用同名插槽；点击回调携带 `index`，便于识别条目。

```vue
<snake-cell-group title="设置喜好">
  <snake-cell-item :arrow="false" index="1" @click="handleClick">
    <template #title>
      <text>自定义标题</text>
    </template>
    <template #right-icon>
      <text>自定义右侧内容</text>
    </template>
  </snake-cell-item>
</snake-cell-group>
```

## 分组标题与边框

`CellGroup` 的 `title` 用于展示分组标题，`border` 控制分组内容上下边框。它可以包裹 `CellItem`，也可包裹其他任意内容。

```vue
<snake-cell-group title="设置喜好" :border="false">
  <snake-cell-item title="消息通知" />
</snake-cell-group>
```

## 作为页面入口

将跳转逻辑放在 `click` 中，使用 `index` 区分条目；纯展示项关闭箭头并避免绑定点击。

```vue
<snake-cell-group title="账户">
  <snake-cell-item title="收货地址" index="address" @click="openPage" />
  <snake-cell-item title="会员等级" value="黄金会员" :arrow="false" />
</snake-cell-group>
```

## API

### Props

#### CellGroup Props

| 参数                          | 说明                 | 类型                        | 默认值 |
| ----------------------------- | -------------------- | --------------------------- | ------ |
| `title`                       | 分组标题             | `string`                    | `''`   |
| `border`                      | 是否显示分组上下边框 | `boolean`                   | `true` |
| `titleStyle`                  | 分组标题样式         | `object \| array`           | `{}`   |
| `customClass` / `customStyle` | 自定义类名和样式     | `string \| object \| array` | `''`   |

#### CellItem Props

| 参数                                       | 说明                          | 类型                        | 默认值                   |
| ------------------------------------------ | ----------------------------- | --------------------------- | ------------------------ |
| `icon`                                     | 左侧图标名称或图片地址        | `string`                    | `''`                     |
| `title` / `value` / `label`                | 标题、右侧内容、标题下方描述  | `string \| number`          | `''`                     |
| `borderBottom`                             | 是否显示下边框                | `boolean`                   | `true`                   |
| `borderTop`                                | 是否显示上边框                | `boolean`                   | `false`                  |
| `hoverClass`                               | 点击反馈类名                  | `string`                    | `snake-cell-item--hover` |
| `arrow`                                    | 是否显示右侧箭头              | `boolean`                   | `true`                   |
| `arrowDirection`                           | 右侧箭头方向                  | `right \| up \| down`       | `right`                  |
| `center`                                   | 内容是否垂直居中              | `boolean`                   | `false`                  |
| `required`                                 | 是否显示左侧必填星号          | `boolean`                   | `false`                  |
| `titleWidth`                               | 标题宽度，数值按 rpx 处理     | `number \| string`          | `''`                     |
| `titleStyle` / `valueStyle` / `labelStyle` | 标题、内容、描述样式          | `object \| array`           | `{}`                     |
| `bgColor`                                  | 背景颜色                      | `string`                    | `transparent`            |
| `index`                                    | `click` 回调中标识条目的值    | `string \| number`          | `''`                     |
| `useLabelSlot`                             | 是否使用 `label` 插槽         | `boolean`                   | `false`                  |
| `iconSize`                                 | 左侧图标大小，数值按 rpx 处理 | `number \| string`          | `34`                     |
| `iconStyle`                                | 左侧图标样式                  | `object \| array`           | `{}`                     |
| `customClass` / `customStyle`              | 自定义类名和样式              | `string \| object \| array` | `''`                     |

### Slots

#### CellGroup Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 分组内容 |

#### CellItem Slots

| 名称         | 说明                           |
| ------------ | ------------------------------ |
| default      | 右侧内容（`value` 为空时启用） |
| `icon`       | 左侧图标                       |
| `title`      | 左侧标题（`title` 为空时启用） |
| `label`      | 标题下方描述                   |
| `right-icon` | 右侧自定义内容                 |

### Events

| 事件名  | 触发时机             | 参数    |
| ------- | -------------------- | ------- |
| `click` | 点击 CellItem 时触发 | `index` |

## 主题变量

| 变量名                         | 说明                                           |
| ------------------------------ | ---------------------------------------------- |
| `--snake-color-text-secondary` | CellItem 标题默认颜色                          |
| `--snake-color-text-muted`     | CellItem 内容、描述、图标及 CellGroup 标题颜色 |
| `--snake-color-surface`        | CellGroup 内容背景色                           |
| `--snake-color-border`         | 条目和分组边框颜色                             |
| `--snake-color-error`          | 必填标记颜色                                   |
| `--snake-color-surface-muted`  | 点击反馈背景色                                 |
