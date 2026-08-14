---
preview: /pages/componentsA/switch
---

# Switch 开关

切换 boolean、字符串或数字状态，支持加载、禁用、自定义值和短震动反馈。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-switch v-model="enabled" />
<snake-switch v-model="status" active-value="yes" inactive-value="no" loading />
```

## API

### Props

| 参数                            | 说明             | 类型                          | 默认值           |
| ------------------------------- | ---------------- | ----------------------------- | ---------------- |
| `modelValue`                    | 当前值           | `boolean \| string \| number` | `false`          |
| `activeValue` / `inactiveValue` | 开启和关闭值     | 同 modelValue                 | `true` / `false` |
| `loading` / `disabled`          | 加载和禁用       | `boolean`                     | `false`          |
| `size` / `space`                | 开关尺寸和内边距 | `UnitValue`                   | `24` / `2`       |
| `activeColor` / `inactiveColor` | 开启和关闭颜色   | `string`                      | 主题默认值       |
| `vibrateShort`                  | 切换时尝试短震动 | `boolean`                     | `false`          |
| `customClass` / `customStyle`   | 自定义类名和样式 | `string \| style`             | `''`             |

### Events

| 事件名                         | 说明                     | 参数  |
| ------------------------------ | ------------------------ | ----- |
| `update:modelValue` / `change` | 状态更新                 | 新值  |
| `click`                        | 点击组件，禁用时也会触发 | event |

源码：`src/uni_modules/snake-ui/components/snake-switch/snake-switch.vue`
