---
preview: /pages/componentsA/radio-group
---

# RadioGroup 单选框组

管理一组 Radio 的互斥值、禁用状态、颜色与横纵布局。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-radio-group v-model="value" placement="column">
  <snake-radio name="sweet">鲜甜</snake-radio>
  <snake-radio name="spicy">香辣</snake-radio>
</snake-radio-group>
```

## API

### Props

| 参数                            | 说明                     | 类型              | 默认值               |
| ------------------------------- | ------------------------ | ----------------- | -------------------- |
| `modelValue`                    | 当前选中的 name          | `unknown`         | -                    |
| `disabled`                      | 全组禁用                 | `boolean`         | `false`              |
| `direction` / `placement`       | row/column 布局          | `string`          | `row`                |
| `size` / `shape`                | 子项尺寸与 circle/square | `string`          | `default` / `circle` |
| `activeColor` / `inactiveColor` | 选中和未选中颜色         | `string`          | 主题默认值           |
| `iconSize` / `labelSize`        | 图标和文字大小           | `UnitValue`       | `20` / `14`          |
| `customClass` / `customStyle`   | 自定义类名和样式         | `string \| style` | `''`                 |

### Events

`update:modelValue` 和 `change` 均返回最新 name。

### Slots

默认插槽放置 Radio。

源码：`src/uni_modules/snake-ui/components/snake-radio-group/snake-radio-group.vue`
