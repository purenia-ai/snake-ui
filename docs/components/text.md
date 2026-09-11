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

## API

### Props

| 参数                          | 说明                             | 类型                                                                                 | 默认值               |
| ----------------------------- | -------------------------------- | ------------------------------------------------------------------------------------ | -------------------- |
| `type`                        | 主题颜色                         | `primary \| warning \| success \| info \| error \| main \| content \| tips \| light` | `''`                 |
| `show`                        | 是否显示文本                     | `boolean`                                                                            | `true`               |
| `text`                        | 显示的值                         | `string \| number`                                                                   | `''`                 |
| `prefixIcon` / `suffixIcon`   | 前置/后置图标                    | `string`                                                                             | `''`                 |
| `mode`                        | 文本处理模式                     | `text \| price \| phone \| name \| date \| link`                                     | `text`               |
| `href`                        | mode 为 link 时的链接地址        | `string`                                                                             | `''`                 |
| `format`                      | 格式化规则，encrypt 或函数       | `string \| function`                                                                 | `''`                 |
| `call`                        | mode 为 phone 时点击是否拨打电话 | `boolean`                                                                            | `false`              |
| `openType`                    | 小程序打开方式                   | `string`                                                                             | `''`                 |
| `bold`                        | 是否粗体                         | `boolean`                                                                            | `false`              |
| `block`                       | 是否块状显示                     | `boolean`                                                                            | `false`              |
| `lines`                       | 显示行数，超出显示省略号         | `string \| number`                                                                   | `''`                 |
| `color`                       | 文本颜色                         | `string`                                                                             | `--snake-color-text` |
| `size`                        | 字体大小                         | `string \| number`                                                                   | `28`                 |
| `iconStyle` / `textStyle`     | 图标/文字样式                    | `object \| array \| string`                                                          | 默认图标样式 / `{}`  |
| `decoration`                  | 文字装饰                         | `none \| underline \| line-through`                                                  | `none`               |
| `margin`                      | 外边距                           | `object \| string \| number`                                                         | `0`                  |
| `lineHeight`                  | 行高                             | `string \| number`                                                                   | `''`                 |
| `align`                       | 对齐方式                         | `left \| center \| right`                                                            | `left`               |
| `wordWrap`                    | 换行方式                         | `break-word \| normal \| anywhere`                                                   | `normal`             |
| `customClass` / `customStyle` | 自定义类名和样式                 | `string \| object \| array`                                                          | `''`                 |

### Events

| 事件名                                                                               | 触发时机              | 参数           |
| ------------------------------------------------------------------------------------ | --------------------- | -------------- |
| `click`                                                                              | 点击文本              | -              |
| `getuserinfo` / `contact` / `getphonenumber` / `error` / `launchapp` / `opensetting` | openType 对应原生事件 | `event.detail` |

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
