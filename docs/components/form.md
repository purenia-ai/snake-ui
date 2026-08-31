---
preview: /pages/componentsA/form/index
---

# Form 表单

管理表单模型、字段规则、错误状态、提交校验和重置。与 `FormItem` 及 Snake UI 输入控件组合使用。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-form ref="formRef" :model="model" :rules="rules">
  <snake-form-item label="姓名" prop="profile.name" required>
    <snake-input v-model="model.profile.name" />
  </snake-form-item>
</snake-form>
```

```ts
const rules = {
    'profile.name': [
        { required: true, message: '请输入姓名', trigger: ['change', 'blur'] },
        { min: 2, message: '至少输入两个字符', trigger: 'blur' }
    ]
};

await formRef.value.validate();
```

规则支持 `required`、`type`、`min`、`max`、`len`、`pattern`、`enum`、`transform`、`validator` 和 `asyncValidator`。字段路径支持对象和数组嵌套。

## 提交与错误处理

```ts
async function submit() {
    try {
        const values = await formRef.value.validate();
        await save(values);
    } catch (errors) {
        // FormItem 会就近展示错误；页面可在这里滚动到第一个错误字段。
    }
}
```

标签必须描述输入目的，placeholder 只提供示例而不能代替标签。异步校验失败时应保留用户输入并给出可执行的修正提示。

## API

### Props

| 参数                                       | 说明                                      | 类型                 | 默认值         |
| ------------------------------------------ | ----------------------------------------- | -------------------- | -------------- |
| `model`                                    | 表单数据对象                              | `object`             | `{}`           |
| `rules`                                    | 按字段名配置的规则                        | `SnakeFormRules`     | `{}`           |
| `errorType`                                | message/border/border-bottom/none，可组合 | `string \| string[]` | `['message']`  |
| `borderBottom`                             | 表单项默认显示底边                        | `boolean`            | `true`         |
| `labelPosition`                            | left/top                                  | `string`             | `left`         |
| `labelWidth` / `labelAlign` / `labelStyle` | 标签宽度、对齐和样式                      | `UnitValue \| style` | `160` / `left` |
| `size`                                     | small/default/large                       | `string`             | `default`      |
| `customClass` / `customStyle`              | 自定义类名和样式                          | `string \| style`    | `''`           |

### Events

| 事件名     | 说明         | 参数              |
| ---------- | ------------ | ----------------- |
| `validate` | 主动校验结束 | `(valid, errors)` |

### Expose

| 方法                              | 说明                                               |
| --------------------------------- | -------------------------------------------------- |
| `validate(callback?)`             | 校验全部字段，成功返回 model，失败 reject 错误数组 |
| `validateField(props, callback?)` | 校验指定字段                                       |
| `resetFields(props?)`             | 恢复字段初始值并清错                               |
| `clearValidate(props?)`           | 清除字段错误                                       |
| `setRules(rules)`                 | 动态替换规则                                       |

源码：`src/uni_modules/snake-ui/components/snake-form/snake-form.vue`
