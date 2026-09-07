---
preview: /pages/componentsA/radioGroup/index
---

# RadioGroup 单选框组

管理一组 Radio 的互斥值、禁用状态、颜色与布局。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-radio-group v-model="value" wrap>
  <snake-radio name="sweet">鲜甜</snake-radio>
  <snake-radio name="spicy">香辣</snake-radio>
</snake-radio-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 radio 的占宽（如 `width="240rpx"`），`wrap` 让每个 radio 单独占一行。

## API

### Props

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

### Events

`update:modelValue` 和 `change` 均返回最新 name。

### Slots

默认插槽放置 Radio。

源码：`src/uni_modules/snake-ui/components/snake-radio-group/snake-radio-group.vue`
