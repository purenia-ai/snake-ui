---
preview: /pages/componentsA/form/index
---

# Form 表单

`Form` 用于管理表单模型和规则，`FormItem` 负责字段布局、校验状态与错误展示。组件行为与 uView Pro Form 保持一致。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-form ref="formRef" :model="model" :rules="rules">
  <snake-form-item label="姓名" prop="profile.name" required>
    <snake-input v-model="model.profile.name" />
  </snake-form-item>
</snake-form>
```

```ts
const valid = await formRef.value.validate();
if (valid) {
    // 提交 model
}
```

规则支持 `required`、`type`、`min`、`max`、`len`、`pattern`、`enum`、`transform`、`validator`、`asyncValidator`、`fields` 和 `defaultField`。字段 `prop` 支持 `profile.name`、`accounts.0.name` 等嵌套路径。

## 校验与提交

将 `rules` 与 `model` 的字段路径保持一致。`validate()` 返回 `true` 才执行提交；提交期间应由业务自行锁定提交按钮，避免重复请求。

```vue
<snake-form ref="formRef" :model="model" :rules="rules">
  <snake-form-item label="手机号" prop="mobile" required>
    <snake-input v-model="model.mobile" placeholder="请输入手机号" />
  </snake-form-item>
  <snake-button @click="submit">提交</snake-button>
</snake-form>
```

```ts
const rules = {
    mobile: [
        { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
        { pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' }
    ]
};

async function submit() {
    if (!(await formRef.value?.validate())) return;
    await saveProfile(model);
}
```

## 动态深层校验

```ts
const rules = {
    accounts: {
        type: 'array',
        required: true,
        defaultField: {
            type: 'object',
            fields: {
                name: { required: true, message: '请输入账户名', trigger: ['change', 'blur'] }
            }
        }
    }
};
```

对应动态字段使用 `prop="accounts.0.name"`。组件会从 `accounts.defaultField.fields.name` 查找规则。

## 错误提示

`errorType` 是数组，可组合以下值：

- `message`：字段下方显示错误文字。
- `toast`：全表校验时提示第一个错误。
- `border-bottom`：字段底边变为错误色。
- `border`：内部输入控件边框变为错误色。
- `none`：隐藏全部错误提示。

## API

### Form Props

| 参数            | 说明                     | 类型                        | 默认值                 |
| --------------- | ------------------------ | --------------------------- | ---------------------- |
| `model`         | 表单数据对象             | `object`                    | `{}`                   |
| `rules`         | 校验规则                 | `FormRules`                 | `{}`                   |
| `errorType`     | 错误提示方式             | `FormErrorType[]`           | `['message', 'toast']` |
| `borderBottom`  | 表单项默认显示底边       | `boolean`                   | `true`                 |
| `labelPosition` | 标签位置                 | `left \| top`               | `left`                 |
| `labelWidth`    | 标签宽度，数字单位为 rpx | `string \| number`          | `90`                   |
| `labelAlign`    | 标签对齐                 | `left \| center \| right`   | `left`                 |
| `labelStyle`    | 标签样式                 | `object`                    | `{}`                   |
| `size`          | 表单尺寸                 | `small \| default \| large` | `default`              |

### Form Expose

| 方法                              | 说明                                            |
| --------------------------------- | ----------------------------------------------- |
| `setRules(rules)`                 | 动态替换规则                                    |
| `resetFields()`                   | 重置全部已注册字段                              |
| `validate(callback?)`             | 校验全部字段，返回 `Promise<boolean>`           |
| `validateField(props, callback?)` | 校验一个或多个指定字段，返回 `Promise<boolean>` |

### Form Slots

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 表单项内容 |

### FormItem Props

| 参数                                                         | 说明                              | 默认值    |
| ------------------------------------------------------------ | --------------------------------- | --------- |
| `label` / `prop`                                             | 标签和模型字段路径                | `''`      |
| `required`                                                   | 仅显示必填星号                    | `false`   |
| `borderBottom`                                               | 是否显示底边；空字符串时继承 Form | `''`      |
| `labelPosition` / `labelWidth` / `labelAlign` / `labelStyle` | 标签布局；未设置时继承 Form       | -         |
| `leftIcon` / `rightIcon`                                     | 左右图标                          | `''`      |
| `leftIconPrefix` / `rightIconPrefix`                         | 自定义图标类前缀                  | `sicon`   |
| `leftIconStyle` / `rightIconStyle`                           | 图标样式                          | `{}`      |
| `size`                                                       | small/default/large 或自定义字号  | 继承 Form |

### FormItem Slots

| 名称        | 说明                 |
| ----------- | -------------------- |
| `default`   | 表单控件             |
| `label`     | 自定义标签内容       |
| `leftIcon`  | 自定义左侧图标       |
| `rightIcon` | 自定义右侧图标       |
| `right`     | 表单项最右侧扩展内容 |

### FormItem Expose

`validation(trigger?, callback?)`、`resetField()`、`onFormBlur()`、`onFormChange()`。

## 主题变量

Form 容器没有独立视觉令牌，FormItem 直接使用以下全局变量：

| 变量                       | 用途               |
| -------------------------- | ------------------ |
| `--snake-color-text`       | 标签文字颜色       |
| `--snake-color-text-light` | 辅助文字颜色       |
| `--snake-color-divider`    | 表单项分隔线       |
| `--snake-color-error`      | 必填标记和错误状态 |
