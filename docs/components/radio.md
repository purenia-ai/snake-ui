---
preview: /pages/componentsA/radio/index
---

# Radio 单选框

`RadioGroup` 与 `Radio` 成对使用：容器管理一组互斥的单选值、禁用状态、颜色与布局，`Radio` 通过 `name` 参与互斥选择。

## 何时使用

用于一组选项中必须或最多选择一项的场景。允许多选时使用 Checkbox；选项很多或空间紧张时可考虑下拉选择组件。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-radio-group v-model="flavor">
  <snake-radio name="sweet">鲜甜</snake-radio>
  <snake-radio name="spicy">香辣</snake-radio>
  <snake-radio name="mild">清淡</snake-radio>
</snake-radio-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 radio 的占宽（如 `width="240rpx"`），`wrap` 让每个 radio 单独占一行。

## API

### RadioGroup

#### Props

| 参数                          | 说明                     | 类型              | 默认值      |
| ----------------------------- | ------------------------ | ----------------- | ----------- |
| `modelValue`                  | 当前选中的 name          | `string \| number` | `''`      |
| `disabled`                    | 全组禁用                 | `boolean`         | `false`     |
| `activeColor`                 | 选中状态下的颜色         | `string`          | 主题色      |
| `size`                        | 整体尺寸 small/default/large | `string`       | `''`        |
| `labelDisabled`               | 是否禁止点击标签选中     | `boolean`         | `false`     |
| `shape`                       | circle/square 形状       | `string`          | `'circle'`  |
| `iconSize`                    | 勾号大小，单位 rpx       | `UnitValue`       | `''`        |
| `width`                       | 每个 radio 占组宽度      | `UnitValue`       | `'auto'`    |
| `wrap`                        | 是否每个 radio 都换行    | `boolean`         | `false`     |
| `customClass` / `customStyle` | 自定义类名和样式         | `string \| style` | `''`        |

#### Events

`update:modelValue` 和 `change` 均返回最新 name。

#### Slots

默认插槽放置 Radio。

### Radio

#### Props

| 参数                          | 说明                                     | 类型               | 默认值      |
| ----------------------------- | ---------------------------------------- | ------------------ | ----------- |
| `label`                       | 展示标签文本                             | `string`           | `''`        |
| `value` / `name`              | 兼容旧 API 的值 / 数据项标识，`value` 非空时优先 | `string \| number` | `''`        |
| `shape`                       | circle/square 形状                       | `string`           | 继承 Group  |
| `disabled` / `labelDisabled`  | 禁用 / 禁止点击标签选中                  | `boolean`          | `false`     |
| `activeColor`                 | 选中颜色，设置后覆盖父级 activeColor     | `string`           | 主题色      |
| `iconSize` / `labelSize`      | 勾号与标签字号，单位 rpx                 | `UnitValue`        | 按 size 预设 |
| `size`                        | 整体尺寸 small/default/large             | `string`           | 继承 Group  |
| `customClass` / `customStyle` | 自定义类名和样式                         | `string \| style`  | `''`        |

#### Events

`change(name)` — radio 从未选中变为选中时触发，携带当前 radio 的 name。点击已选中项不触发。

#### Slots

默认插槽用于标签内容。

## 类型定义

从包根导入 `SnakeRadioGroupProps`、`SnakeRadioProps` 与 `SnakeRadioEmits`。

源码：`src/uni_modules/snake-ui/components/snake-radio-group/snake-radio-group.vue`、`src/uni_modules/snake-ui/components/snake-radio/snake-radio.vue`
