---
preview: /pages/componentsA/switch/index
---

# Switch 开关

切换 boolean、字符串或数字状态，支持加载、禁用、自定义值和短震动反馈。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-switch v-model="enabled" />
<snake-switch v-model="status" active-value="yes" inactive-value="no" loading />
```

H5 中组件可通过 Tab 聚焦，并使用 Enter 或空格切换。`disabled` 或 `loading` 时会退出键盘焦点顺序，也不会更新绑定值。

## API

### Props

| 参数                            | 说明             | 类型                          | 默认值           |
| ------------------------------- | ---------------- | ----------------------------- | ---------------- |
| `modelValue`                    | 当前值           | `boolean \| string \| number` | `false`          |
| `activeValue` / `inactiveValue` | 开启和关闭值     | 同 modelValue                 | `true` / `false` |
| `loading` / `disabled`          | 加载和禁用       | `boolean`                     | `false`          |
| `size` / `space`                | 开关尺寸和内边距 | `UnitValue`                   | `50` / `2`       |
| `activeColor` / `inactiveColor` | 开启和关闭颜色   | `string`                      | 主题默认值       |
| `vibrateShort`                  | 切换时尝试短震动 | `boolean`                     | `false`          |
| `customClass` / `customStyle`   | 自定义类名和样式 | `string \| style`             | `''`             |

### Events

| 事件名                         | 说明                     | 参数  |
| ------------------------------ | ------------------------ | ----- |
| `update:modelValue` / `change` | 状态更新                 | 新值  |
| `click`                        | 点击组件，禁用时也会触发 | event |

## 主题变量

| 变量                    | 用途               |
| ----------------------- | ------------------ |
| `--snake-color-primary` | 默认开启颜色与焦点 |
| `--snake-color-border`  | 默认关闭颜色       |

`activeColor` 和 `inactiveColor` 可以覆盖单个实例的对应颜色。

源码：`src/uni_modules/snake-ui/components/snake-switch/snake-switch.vue`
