---
preview: /pages/componentsA/checkboxGroup/index
---

# CheckboxGroup 复选框组

管理一组 Checkbox 的数组值、禁用状态、最大选择数与布局。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-checkbox-group v-model="value" :max="2" wrap>
  <snake-checkbox name="apple">苹果</snake-checkbox>
  <snake-checkbox name="pear">雪梨</snake-checkbox>
</snake-checkbox-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 checkbox 的占宽（需带单位，如 `width="240rpx"`），`wrap` 让每个 checkbox 单独占一行。

## API

### Props

| 参数                          | 说明                     | 类型                | 默认值     |
| ----------------------------- | ------------------------ | ------------------- | ---------- |
| `modelValue`                  | 选中的 name 数组         | `(string \| number)[]` | -       |
| `max`                         | 最多能选中多少个         | `number`            | `999`      |
| `disabled`                    | 全组禁用                 | `boolean`           | `false`    |
| `name`                        | 表单内提交时的标识符     | `boolean \| string` | `''`       |
| `labelDisabled`               | 是否禁止点击标签选中     | `boolean`           | `false`    |
| `shape`                       | square/circle 形状       | `string`            | `'square'` |
| `activeColor`                 | 选中状态下的颜色         | `string`            | 主题色     |
| `size`                        | 整体尺寸 small/default/large | `string`         | `''`       |
| `width`                       | 每个 checkbox 占组宽度   | `string`            | `'auto'`   |
| `wrap`                        | 是否每个 checkbox 都换行 | `boolean`           | `false`    |
| `iconSize`                    | 勾号大小，单位 rpx       | `UnitValue`         | `''`       |
| `customClass` / `customStyle` | 自定义类名和样式         | `string \| style`   | `''`       |

### Events

`update:modelValue` 和 `change` 均返回最新选中数组。

### Slots

默认插槽放置 Checkbox。

源码：`src/uni_modules/snake-ui/components/snake-checkbox-group/snake-checkbox-group.vue`
