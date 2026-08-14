---
preview: /pages/componentsA/drop-menu-item
---

# DropMenuItem 下拉菜单项

提供菜单触发器、遮罩和内容面板，必须作为 `DropMenu` 的直接子组件使用。可通过 options 快速生成选项，也可完全自定义内容。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-drop-menu>
  <snake-drop-menu-item
    v-model="value"
    title="全部分类"
    :options="[{ label: '全部', value: 'all' }, { label: '新品', value: 'new' }]"
  />
</snake-drop-menu>
```

## 展开前校验

```ts
const beforeToggle = ({ resolve }) => resolve(userHasPermission);
```

```vue
<snake-drop-menu-item title="高级筛选" :before-toggle="beforeToggle">
  <view class="filter-panel">自定义筛选内容</view>
</snake-drop-menu-item>
```

## API

### Props

| 参数           | 说明                                             | 类型                        | 默认值  |
| -------------- | ------------------------------------------------ | --------------------------- | ------- |
| `modelValue`   | 当前选中值，支持 v-model                         | `unknown`                   | -       |
| `title`        | 固定标题；为空时显示选中项 label                 | `string`                    | `''`    |
| `options`      | `{ label, value, disabled? }[]`                  | `array`                     | `[]`    |
| `disabled`     | 是否禁用菜单项                                   | `boolean`                   | `false` |
| `height`       | 面板最大高度或 auto                              | `string \| number`          | `auto`  |
| `show`         | 外部强制显示面板                                 | `boolean`                   | -       |
| `beforeToggle` | 展开前回调，通过 `resolve(boolean)` 决定是否展开 | `function`                  | -       |
| `customStyle`  | 面板自定义样式                                   | `string \| object \| array` | `''`    |

### Events

| 事件名              | 触发时机     | 参数       |
| ------------------- | ------------ | ---------- |
| `update:modelValue` | 选择可用选项 | 选项 value |
| `change`            | 选择可用选项 | 选项 value |
| `open`              | 面板展开     | -          |
| `close`             | 面板关闭     | -          |

### Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `default` | 替换自动生成的选项列表 |

源码：`src/uni_modules/snake-ui/components/snake-drop-menu-item/snake-drop-menu-item.vue`
