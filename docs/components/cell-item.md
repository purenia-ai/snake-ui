---
preview: /pages/componentsA/cellItem/index
---

# CellItem 单元格条目

单元格条目，一般搭配 CellGroup 用于列表场景，比如个人中心页、设置页，支持左侧图标、标题、描述、右侧内容与箭头。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-cell-item icon="phone" title="手机号码" value="138****8000" />
```

## 插槽与交互

```vue
<snake-cell-item :arrow="false" index="1" @click="handleClick">
  <template #title>
    <text>自定义标题</text>
  </template>
  <template #right-icon>
    <text>自定义右侧内容</text>
  </template>
</snake-cell-item>
```

`title`/`value`/`label` 为空时分别启用同名插槽；点击回调携带 `index` 便于标识条目。

## API

### Props

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
| `titleWidth`                               | 标题的宽度，数值按 rpx 处理   | `number \| string`          | `''`                     |
| `titleStyle` / `valueStyle` / `labelStyle` | 标题/内容/描述样式            | `object \| array`           | `{}`                     |
| `bgColor`                                  | 背景颜色                      | `string`                    | `transparent`            |
| `index`                                    | click 回调中标识条目的值      | `string \| number`          | `''`                     |
| `useLabelSlot`                             | 是否使用 label 插槽           | `boolean`                   | `false`                  |
| `iconSize`                                 | 左侧图标大小，数值按 rpx 处理 | `number \| string`          | `34`                     |
| `iconStyle`                                | 左侧图标样式，对象形式        | `object \| array`           | `{}`                     |
| `customClass` / `customStyle`              | 自定义类名和样式              | `string \| object \| array` | `''`                     |

### Events

| 事件名  | 触发时机 | 参数    |
| ------- | -------- | ------- |
| `click` | 点击条目 | `index` |

### Slots

| 名称         | 说明                         |
| ------------ | ---------------------------- |
| default      | 右侧内容（value 为空时启用） |
| `icon`       | 左侧图标                     |
| `title`      | 左侧标题（title 为空时启用） |
| `label`      | 标题下方描述                 |
| `right-icon` | 右侧自定义内容               |

## 主题变量

| 变量名                         | 说明                 |
| ------------------------------ | -------------------- |
| `--snake-color-text-secondary` | 标题默认颜色         |
| `--snake-color-text-muted`     | 内容、描述及图标颜色 |
| `--snake-color-border`         | 上下边框颜色         |
| `--snake-color-error`          | 必填标记颜色         |
| `--snake-color-surface-muted`  | 点击反馈背景色       |

源码：`src/uni_modules/snake-ui/components/snake-cell-item/snake-cell-item.vue`
