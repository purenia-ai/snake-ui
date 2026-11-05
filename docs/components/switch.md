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

## 异步切换

切换远程设置时，用 `loading` 锁定当前开关；请求失败后将绑定值恢复为原值，避免界面与服务端状态不一致。

```vue
<snake-switch v-model="enabled" :loading="updating" @change="updateSetting" />
```

## API

### Props

| 参数            | 说明                                                                                   | 类型                    | 默认值     |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| `modelValue`    | 当前值（v-model）                                                                      | `SwitchValue`           | `false`    |
| `activeValue`   | 开启状态对应的值                                                                       | `SwitchValue`           | `true`     |
| `inactiveValue` | 关闭状态对应的值                                                                       | `SwitchValue`           | `false`    |
| `loading`       | 是否显示加载状态，加载中不可切换                                                       | `boolean`               | `false`    |
| `disabled`      | 是否禁用交互                                                                           | `boolean`               | `false`    |
| `size`          | 开关尺寸，支持数值或 `small` / `default` / `large`；未设置时跟随 FormItem，兜底为 `25` | `UnitValue \| FormSize` | -          |
| `activeColor`   | 开启状态颜色                                                                           | `string`                | 主题主色   |
| `inactiveColor` | 关闭状态颜色                                                                           | `string`                | 主题边框色 |
| `space`         | 滑块与轨道之间的内边距                                                                 | `UnitValue`             | `1`        |
| `vibrateShort`  | 切换时是否触发短震动                                                                   | `boolean`               | `false`    |
| `customClass`   | 根节点自定义类名                                                                       | `string`                | `''`       |
| `customStyle`   | 根节点自定义样式                                                                       | `StyleValue`            | `''`       |

### Events

| 事件名              | 说明                     | 参数                 |
| ------------------- | ------------------------ | -------------------- |
| `update:modelValue` | 状态更新（v-model）      | `value: SwitchValue` |
| `change`            | 状态变化时触发           | `value: SwitchValue` |
| `click`             | 点击组件，禁用时也会触发 | `event`              |

## 主题变量

| 变量                    | 用途               |
| ----------------------- | ------------------ |
| `--snake-color-primary` | 默认开启颜色与焦点 |
| `--snake-color-border`  | 默认关闭颜色       |

`activeColor` 和 `inactiveColor` 可以覆盖单个实例的对应颜色。
