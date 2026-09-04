---
preview: /pages/componentsA/cellGroup/index
---

# CellGroup 单元格分组

单元格分组容器，一般搭配 CellItem 用于列表场景，比如个人中心页、设置页，支持分组标题与上下外边框。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-cell-group title="设置喜好">
  <view>内容项</view>
</snake-cell-group>
```

## API

### Props

| 参数          | 说明                     | 类型                 | 默认值 |
| ------------- | ------------------------ | -------------------- | ------ |
| `title`       | 分组标题                 | `string`             | `''`   |
| `border`      | 是否显示分组上下边框     | `boolean`            | `true` |
| `titleStyle`  | 分组标题样式，对象形式   | `object \| array`    | `{}`   |
| `customClass` / `customStyle` | 自定义类名和样式 | `string \| object \| array` | `''` |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 分组内容       |

源码：`src/uni_modules/snake-ui/components/snake-cell-group/snake-cell-group.vue`
