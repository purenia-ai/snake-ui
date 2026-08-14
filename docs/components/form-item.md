---
preview: /pages/componentsA/form-item
---

# FormItem 表单项

连接标签、模型字段、输入控件和校验结果。推荐放在 `Form` 内，也可以作为普通布局容器使用。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-form-item label="手机号" prop="mobile" required left-icon="phone">
  <snake-input v-model="model.mobile" type="number" />
</snake-form-item>
```

## API

### Props

| 参数                                       | 说明                    | 类型                 | 默认值    |
| ------------------------------------------ | ----------------------- | -------------------- | --------- |
| `label` / `prop`                           | 标签与 model 字段路径   | `string`             | `''`      |
| `required`                                 | 显示必填星号            | `boolean`            | `false`   |
| `leftIcon` / `rightIcon`                   | 左右图标                | `string`             | `''`      |
| `labelPosition`                            | left/top，默认继承 Form | `string`             | -         |
| `labelWidth` / `labelAlign` / `labelStyle` | 标签宽度、对齐和样式    | `UnitValue \| style` | 继承 Form |
| `borderBottom` / `size`                    | 底边和尺寸              | `boolean \| string`  | 继承 Form |
| `customClass` / `customStyle`              | 自定义类名和样式        | `string \| style`    | `''`      |

### Slots

| 插槽             | 说明           |
| ---------------- | -------------- |
| `default`        | 字段控件       |
| `label`          | 自定义标签     |
| `left` / `right` | 内容区左右扩展 |

### Expose

| 方法                 | 说明         |
| -------------------- | ------------ |
| `validate(trigger?)` | 校验当前字段 |
| `resetField()`       | 恢复初始值   |
| `clearValidate()`    | 清除错误     |

源码：`src/uni_modules/snake-ui/components/snake-form-item/snake-form-item.vue`
