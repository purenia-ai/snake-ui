---
preview: /pages/componentsA/text/index
---

# Text 文本

集成了文本类在项目中的常用功能：价格、手机号/姓名脱敏、日期格式化、超链接与拨打电话，几乎涵盖大部分文本场景。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-text text="普通文本" />
<snake-text :text="1288" mode="price" />
```

## 模式与格式化

```vue
<!-- 手机号脱敏：138****8000 -->
<snake-text text="13800138000" mode="phone" format="encrypt" />
<!-- 姓名脱敏：张*丰 -->
<snake-text text="张三丰" mode="name" format="encrypt" />
<!-- 日期格式化 -->
<snake-text :text="timestamp" mode="date" format="yyyy-mm-dd" />
<!-- 超链接 -->
<snake-text text="打开链接" mode="link" href="https://example.com" />
<!-- 点击拨号 -->
<snake-text text="13800138000" mode="phone" call />
```

脱敏和日期格式化仅用于展示，不会修改原始值；需要提交或计算时仍应使用业务数据源。

## API

### Props

| 参数               | 说明                                                                                                                                        | 类型                                          | 默认值                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------- |
| `customStyle`      | 根节点自定义样式                                                                                                                            | `StyleValue`                                  | `''`                   |
| `customClass`      | 根节点自定义类名                                                                                                                            | `string`                                      | `''`                   |
| `type`             | 主题颜色，可选值 `primary` / `warning` / `success` / `info` / `error` / `main` / `content` / `tips` / `light`                               | `string`                                      | `''`                   |
| `show`             | 是否显示文本                                                                                                                                | `boolean`                                     | `true`                 |
| `text`             | 显示的值                                                                                                                                    | `string \| number`                            | `''`                   |
| `prefixIcon`       | 前置图标名称                                                                                                                                | `string`                                      | `''`                   |
| `suffixIcon`       | 后置图标名称                                                                                                                                | `string`                                      | `''`                   |
| `mode`             | 文本处理模式，可选值 `text`（普通文本）/ `price`（价格）/ `phone`（手机号脱敏）/ `name`（姓名脱敏）/ `date`（日期格式化）/ `link`（超链接） | `TextMode`                                    | `text`                 |
| `href`             | 链接地址，`mode` 为 `link` 时使用                                                                                                           | `string`                                      | `''`                   |
| `format`           | 格式化规则，传 `encrypt` 进行脱敏，也可传自定义函数                                                                                         | `string \| Function`                          | `''`                   |
| `call`             | `mode` 为 `phone` 时，点击文本是否拨打电话                                                                                                  | `boolean`                                     | `false`                |
| `openType`         | 小程序开放能力，传入后以原生 button 渲染（如 `contact` / `launchApp` / `openSetting` 等）                                                   | `string`                                      | `''`                   |
| `bold`             | 是否粗体                                                                                                                                    | `boolean`                                     | `false`                |
| `block`            | 是否块状显示                                                                                                                                | `boolean`                                     | `false`                |
| `lines`            | 显示行数，超出显示省略号                                                                                                                    | `string \| number`                            | `''`                   |
| `color`            | 文本颜色                                                                                                                                    | `string`                                      | 主题文字色             |
| `size`             | 字体大小，数值按 px（375 稿）处理                                                                                                           | `string \| number`                            | `14`                   |
| `iconStyle`        | 图标自定义样式                                                                                                                              | `StyleValue`                                  | `{ fontSize: '15px' }` |
| `textStyle`        | 文字自定义样式                                                                                                                              | `StyleValue`                                  | `{}`                   |
| `decoration`       | 文字装饰，可选值 `none`（无）/ `underline`（下划线）/ `line-through`（删除线）                                                              | `TextDecoration`                              | `none`                 |
| `margin`           | 外边距                                                                                                                                      | `Record<string, unknown> \| string \| number` | `0`                    |
| `lineHeight`       | 行高                                                                                                                                        | `string \| number`                            | `''`                   |
| `align`            | 对齐方式，可选值 `left`（左对齐）/ `center`（居中）/ `right`（右对齐）                                                                      | `TextAlign`                                   | `left`                 |
| `wordWrap`         | 换行方式，可选值 `break-word` / `normal` / `anywhere`                                                                                       | `TextWordWrap`                                | `normal`               |
| `lang`             | 语言，透传给开放能力按钮                                                                                                                    | `string`                                      | `''`                   |
| `sessionFrom`      | 会话来源，`openType` 为 `contact` 时使用                                                                                                    | `string`                                      | `''`                   |
| `sendMessageTitle` | 会话消息卡片标题                                                                                                                            | `string`                                      | `''`                   |
| `sendMessagePath`  | 会话消息卡片跳转路径                                                                                                                        | `string`                                      | `''`                   |
| `sendMessageImg`   | 会话消息卡片图片地址                                                                                                                        | `string`                                      | `''`                   |
| `showMessageCard`  | 是否显示会话消息卡片                                                                                                                        | `boolean`                                     | `false`                |
| `appParameter`     | 打开 App 时传递的参数                                                                                                                       | `string`                                      | `''`                   |
| `formType`         | 原生表单行为类型                                                                                                                            | `string`                                      | `''`                   |

### Events

| 事件名           | 触发时机                | 参数    |
| ---------------- | ----------------------- | ------- |
| `click`          | 点击文本                | -       |
| `getuserinfo`    | `openType` 对应原生事件 | `event` |
| `contact`        | `openType` 对应原生事件 | `event` |
| `getphonenumber` | `openType` 对应原生事件 | `event` |
| `error`          | `openType` 对应原生事件 | `event` |
| `launchapp`      | `openType` 对应原生事件 | `event` |
| `opensetting`    | `openType` 对应原生事件 | `event` |

### Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | 替换默认显示内容 |

## 主题变量

| 变量名                         | 说明                 |
| ------------------------------ | -------------------- |
| `--snake-color-text`           | 默认文字及 main 颜色 |
| `--snake-color-text-secondary` | content 及图标颜色   |
| `--snake-color-text-muted`     | tips 颜色            |
| `--snake-color-text-light`     | light 颜色           |
| `--snake-color-primary`        | primary 颜色         |
| `--snake-color-success`        | success 颜色         |
| `--snake-color-warning`        | warning 颜色         |
| `--snake-color-error`          | error 颜色           |
| `--snake-color-info`           | info 颜色            |
