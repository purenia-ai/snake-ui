---
preview: /pages/componentsA/form/index
description: 使用 Snake UI Form 管理表单模型、嵌套字段、同步与异步校验以及错误提示。
---

# Form 表单

`Form` 用于管理表单模型和规则，`FormItem` 负责字段布局、校验状态与错误展示。组件行为对齐 uni-app 生态广泛使用的 Form 语义。

## 使用建议

Form 负责字段关系和提交校验，不负责发送请求。将 API 调用、提交中状态和失败重试保留在业务页面，规则中的字段路径必须与 `model` 一致。

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

## 无障碍

- 每个可编辑字段都应通过 `FormItem` 提供可见标签，必填状态不能只依赖颜色。
- 错误信息需要说明修正方式；提交失败后应聚焦或滚动到第一个无效字段。
- 提交请求开始后显示加载状态，完成或失败后恢复操作并保留用户输入。

## API

### Form Props

| 参数            | 说明                                                                                                                                                                         | 类型                  | 默认值                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------- |
| `model`         | 表单数据对象                                                                                                                                                                 | `Record<string, any>` | `{}`                   |
| `rules`         | 表单校验规则                                                                                                                                                                 | `FormRules`           | `{}`                   |
| `errorType`     | 错误提示方式，可选值 `message`（字段下方文字）/ `toast`（全表校验提示第一个错误）/ `border-bottom`（字段底边错误色）/ `border`（输入控件边框错误色）/ `none`（隐藏全部提示） | `FormErrorType[]`     | `['message', 'toast']` |
| `borderBottom`  | 是否显示表单项底边                                                                                                                                                           | `boolean`             | `true`                 |
| `labelPosition` | 标签位置，可选值 `left` / `top`                                                                                                                                              | `FormLabelPosition`   | `left`                 |
| `labelWidth`    | 标签宽度，数字单位为 px（375 稿）                                                                                                                                            | `string \| number`    | `45`                   |
| `labelAlign`    | 标签对齐方式，可选值 `left` / `center` / `right`                                                                                                                             | `FormLabelAlign`      | `left`                 |
| `labelStyle`    | 标签自定义样式                                                                                                                                                               | `Record<string, any>` | `{}`                   |
| `size`          | 表单控件尺寸，可选值 `small` / `default` / `large`                                                                                                                           | `FormSize`            | `default`              |
| `customClass`   | 根节点自定义类名                                                                                                                                                             | `string`              | `''`                   |
| `customStyle`   | 根节点自定义样式                                                                                                                                                             | `StyleValue`          | `''`                   |

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

| 参数              | 说明                                                                                | 类型                  | 默认值    |
| ----------------- | ----------------------------------------------------------------------------------- | --------------------- | --------- |
| `label`           | 标签文本                                                                            | `string`              | `''`      |
| `prop`            | 表单模型中的字段路径，支持 `profile.name`、`accounts.0.name` 等嵌套路径             | `string`              | `''`      |
| `borderBottom`    | 是否显示底边，空字符串时继承 Form                                                   | `string \| boolean`   | `''`      |
| `labelPosition`   | 标签位置，可选值 `left` / `top`，未设置时继承 Form                                  | `FormLabelPosition`   | `''`      |
| `labelWidth`      | 标签宽度，数值按 px（375 稿）处理，未设置时继承 Form                                | `UnitValue`           | `''`      |
| `labelStyle`      | 标签自定义样式，未设置时继承 Form                                                   | `Record<string, any>` | `{}`      |
| `labelAlign`      | 标签对齐方式，可选值 `left` / `center` / `right`，未设置时继承 Form                 | `FormLabelAlign`      | `''`      |
| `rightIcon`       | 右侧图标名称                                                                        | `string`              | `''`      |
| `leftIcon`        | 左侧图标名称                                                                        | `string`              | `''`      |
| `leftIconPrefix`  | 左侧图标字体前缀                                                                    | `string`              | `sicon`   |
| `rightIconPrefix` | 右侧图标字体前缀                                                                    | `string`              | `sicon`   |
| `leftIconStyle`   | 左侧图标样式                                                                        | `StyleValue`          | `{}`      |
| `rightIconStyle`  | 右侧图标样式                                                                        | `StyleValue`          | `{}`      |
| `required`        | 是否展示必填星号，仅影响展示不参与校验                                              | `boolean`             | `false`   |
| `size`            | 预设尺寸，可选值 `small` / `default` / `large`，或自定义字号数值，未设置时继承 Form | `string`              | 继承 Form |
| `customClass`     | 根节点自定义类名                                                                    | `string`              | `''`      |
| `customStyle`     | 根节点自定义样式                                                                    | `StyleValue`          | `''`      |

### FormItem Slots

| 名称        | 说明                 |
| ----------- | -------------------- |
| `default`   | 表单控件             |
| `label`     | 自定义标签内容       |
| `leftIcon`  | 自定义左侧图标       |
| `rightIcon` | 自定义右侧图标       |
| `right`     | 表单项最右侧扩展内容 |

### FormItem Expose

| 方法                              | 说明                 |
| --------------------------------- | -------------------- |
| `validation(trigger?, callback?)` | 校验当前字段         |
| `resetField()`                    | 将字段恢复为初始值   |
| `onFormBlur()`                    | 触发 blur 规则校验   |
| `onFormChange()`                  | 触发 change 规则校验 |

## 主题变量

Form 容器没有独立视觉令牌，FormItem 直接使用以下全局变量：

| 变量                       | 用途               |
| -------------------------- | ------------------ |
| `--snake-color-text`       | 标签文字颜色       |
| `--snake-color-text-light` | 辅助文字颜色       |
| `--snake-color-divider`    | 表单项分隔线       |
| `--snake-color-error`      | 必填标记和错误状态 |
