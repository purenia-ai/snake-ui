---
name: 'keyboard'
description: 'Snake UI Keyboard 虚拟键盘参考。处理 keyboard、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['keyboard', 'snake-keyboard', 'Keyboard', '虚拟键盘']
---

# Keyboard 虚拟键盘

底部弹出的虚拟键盘，内置数字、金额与身份证三种按键组合，支持随机顺序、长按连续删除和右侧大键形态，基于 Popup 实现。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`v-model` 绑定输入值，`v-model:visible` 控制键盘开合。组件只维护「当前字符串」，输入框、验证码格子等展示由宿主自己渲染。

```vue
<snake-keyboard v-model="code" v-model:visible="show" :maxlength="6" title="请输入验证码" />
```

```ts
const code = ref('');
const show = ref(false);

// 打开：也可以调用组件实例的 open()
function openKeyboard() {
    show.value = true;
}
```

## 按键形态

- `mode="default"`（默认）：3 × 4 格子，末行依次是额外键、`0`、删除键。
- `mode="custom"`：`0` 加宽占两列，删除与确认变成右侧两个大键，常用于金额、支付密码等场景。
- `mode="car"`：车牌号键盘，10 列网格，省份页与数字字母页通过「中/英」键切换。
- `extra-key` 决定左下角那个键：金额传 `.`，身份证传 `X`；不传时该位置是「收起键盘」键（向下箭头，点击即关闭）。
- `show-delete-key` 为 `false` 时没有删除键，此时 `0` 自动加宽，末行不会只剩一个格子。

```vue
<!-- 金额：右侧大键 + 小数点 -->
<snake-keyboard v-model="amount" v-model:visible="show" mode="custom" extra-key="." title="输入金额" />

<!-- 身份证 -->
<snake-keyboard v-model="idCard" v-model:visible="show" extra-key="X" />
```

## 车牌键盘

`mode="car"` 用同一套组件渲染车牌输入，两页共用 10 列网格：

- **省份页**：36 个省简称（京、沪、粤…使、学），外加「ABC」切换键与删除键，两者各占两列。
- **字母页**：`1`–`9`、`0` 加 24 个字母（车牌不使用字母 `I` 与 `O`），「省份」切换键与删除键各占两列。
- 车牌长度由宿主管：一般传 `:maxlength="8"`。

语言有两种用法：

```vue
<!-- 非受控：组件内部切页，打开时停在省份页之外的当前页 -->
<snake-keyboard v-model="plate" v-model:visible="show" mode="car" :maxlength="8" title="请输入车牌号" />

<!-- 受控：自己拿着语言，能联动其它 UI -->
<snake-keyboard v-model="plate" v-model:visible="show" mode="car" v-model:car-lang="lang" :maxlength="8" />

<!-- 自动：输完首位省份切到字母页，删空后回到省份页 -->
<snake-keyboard v-model="plate" v-model:visible="show" mode="car" auto-switch-lang :maxlength="8" />
```

`auto-switch-lang` 只在非受控（没传 `car-lang`）时生效；传了 `car-lang` 就由宿主通过 `v-model:car-lang` 决定，组件不做隐式切换。

## 长按删除

按住删除键约 `350ms` 后开始连续删除，间隔 `80ms`；松手即停。格子内的删除键、`custom` 模式右侧的删除大键和车牌键盘的删除键行为一致。

## 随机顺序

`random-key-order` 只打乱 `1`–`9`，额外键与 `0` 的位置保持不变；每次打开都会重新洗牌，适合安全要求较高的密码输入。车牌键盘按固定顺序排布，不受这个开关影响。

```vue
<snake-keyboard v-model="password" v-model:visible="show" random-key-order :maxlength="6" />
```

## 表单与校验

组件是纯受控输入，不注册到 `snake-form-item`。表单场景把 `confirm` 当作提交时机，自行触发校验即可。

```vue
<snake-keyboard v-model="form.code" v-model:visible="show" :maxlength="6" @confirm="submit" />
```

## API

### Props

| 参数                  | 说明                                                                            | 类型                          | 默认值       |
| --------------------- | ------------------------------------------------------------------------------- | ----------------------------- | ------------ |
| `customStyle`         | 根节点自定义样式                                                                | `StyleValue`                  | `''`         |
| `customClass`         | 根节点自定义类名                                                                | `string`                      | `''`         |
| `modelValue`          | 当前输入值（v-model）                                                           | `string`                      | `''`         |
| `visible`             | 键盘开合（v-model:visible）                                                     | `boolean`                     | `false`      |
| `mode`                | 键盘形态，可选值 `default` / `custom` / `car`                                   | `KeyboardMode`                | `'default'`  |
| `carLang`             | 车牌键盘当前语言，传入即受控（v-model:carLang），仅 `mode="car"` 生效           | `'zh' \| 'en'`                | -            |
| `autoSwitchLang`      | 车牌键盘输完省份自动切字母页、删空回省份页，仅非受控时生效                      | `boolean`                     | `false`      |
| `title`               | 头部标题，与确认键都为空时不渲染头部                                            | `string`                      | `''`         |
| `maxlength`           | 输入值最大长度，达到后忽略新的输入                                              | `number`                      | `Infinity`   |
| `extraKey`            | 左下角额外按键：`.` 金额、`X` 身份证；为空时该位置渲染收起键盘键                | `string`                      | `''`         |
| `showDeleteKey`       | 是否显示删除键                                                                  | `boolean`                     | `true`       |
| `deleteText`          | 删除键文案，为空时显示退格图标                                                  | `string`                      | `''`         |
| `showConfirm`         | 是否显示确认键，`default` 在头部右侧，`custom` 在右侧大键                       | `boolean`                     | `true`       |
| `confirmText`         | 确认键文案                                                                      | `string`                      | 语言包默认值 |
| `randomKeyOrder`      | 是否打乱数字键顺序，每次打开重新随机                                            | `boolean`                     | `false`      |
| `closeOnClickOverlay` | 是否允许点击遮罩关闭                                                            | `boolean`                     | `true`       |
| `safeAreaInsetBottom` | 是否开启底部安全区适配                                                          | `boolean`                     | `true`       |
| `rootPortal`          | 是否把弹层传送到页面根节点渲染，避免被祖先的 `transform`、`overflow` 裁剪       | `boolean`                     | `false`      |
| `round`               | 面板圆角，默认直角；传 `true` 取 `--snake-radius-large`，数字/字符串按 CSS 尺寸 | `boolean \| number \| string` | `false`      |
| `zIndex`              | 弹出时的层级，`0` 表示使用弹层默认层级                                          | `number \| string`            | `0`          |
| `disabled`            | 是否禁用键盘，禁用后无法打开也无法输入                                          | `boolean`                     | `false`      |

### Events

| 事件名              | 触发时机                                   | 参数           |
| ------------------- | ------------------------------------------ | -------------- |
| `update:modelValue` | 输入值变化（追加或删除）                   | `string`       |
| `update:visible`    | 键盘开合                                   | `boolean`      |
| `update:carLang`    | 车牌键盘切换中英页（v-model:carLang）      | `'zh' \| 'en'` |
| `input`             | 点击数字或额外键                           | `key: string`  |
| `delete`            | 点击删除键，长按会连续触发                 | -              |
| `confirm`           | 点击确认键，随后自动关闭                   | `string`       |
| `open`              | 打开动画结束                               | -              |
| `close`             | 关闭动画结束，含确认、遮罩与收起键三条路径 | -              |

### Expose

| 方法      | 说明                                  |
| --------- | ------------------------------------- |
| `open()`  | 打开键盘，需要绑定 `visible` 才能生效 |
| `close()` | 关闭键盘                              |

## 主题变量

| 变量                                 | 用途                                           |
| ------------------------------------ | ---------------------------------------------- |
| `--snake-color-surface-muted`        | 面板背景                                       |
| `--snake-color-surface`              | 数字键、额外键与右侧删除大键底色               |
| `--snake-color-border`               | 功能键（收起、删除、中英切换）底色             |
| `--snake-color-divider`              | 按键按下底色与头部底部分隔线                   |
| `--snake-color-text`                 | 数字键文字颜色                                 |
| `--snake-color-text-secondary`       | 功能键（收起、删除、中英切换）文字颜色         |
| `--snake-color-primary`              | 确认键颜色与头部确认按钮颜色                   |
| `--snake-color-primary-ink`          | 确认大键文字颜色                               |
| `--snake-radius-base`                | 按键圆角                                       |
| `--snake-radius-large`               | `round` 为 `true` 时的面板圆角                 |
| `--snake-keyboard-panel-bg`          | 面板背景，默认 `--snake-color-surface-muted`   |
| `--snake-keyboard-toolbar-height`    | 头部高度，默认 `44px`                          |
| `--snake-keyboard-toolbar-padding-x` | 头部确认按钮左右内边距，默认 `16px`            |
| `--snake-keyboard-title-font-size`   | 标题字号，默认 `15px`                          |
| `--snake-keyboard-title-font-weight` | 标题字重，默认 `600`                           |
| `--snake-keyboard-confirm-font-size` | 头部确认按钮字号，默认 `16px`                  |
| `--snake-keyboard-padding-top`       | 键盘区顶部内边距，默认 `8px`                   |
| `--snake-keyboard-gap`               | 按键间距，默认 `6px`                           |
| `--snake-keyboard-key-height`        | 按键高度，默认 `56px`                          |
| `--snake-keyboard-key-font-size`     | 数字键字号，默认 `26px`                        |
| `--snake-keyboard-key-font-weight`   | 数字键字重，默认 `500`                         |
| `--snake-keyboard-key-bg`            | 数字键底色，默认 `--snake-color-surface`       |
| `--snake-keyboard-key-color`         | 数字键文字颜色                                 |
| `--snake-keyboard-key-hover-bg`      | 按键按下底色，默认 `--snake-color-divider`     |
| `--snake-keyboard-key-radius`        | 按键圆角                                       |
| `--snake-keyboard-function-bg`       | 功能键底色，默认 `--snake-color-border`        |
| `--snake-keyboard-function-color`    | 功能键与右侧大键文字颜色                       |
| `--snake-keyboard-primary-bg`        | 确认大键底色                                   |
| `--snake-keyboard-primary-color`     | 确认大键文字颜色                               |
| `--snake-keyboard-side-font-size`    | 右侧大键字号，默认 `16px`                      |
| `--snake-keyboard-side-font-weight`  | 右侧大键字重，默认 `500`                       |
| `--snake-keyboard-side-bg`           | 右侧删除大键底色，默认 `--snake-color-surface` |
| `--snake-keyboard-divider-color`     | 头部底部分隔线颜色                             |
| `--snake-keyboard-car-gap`           | 车牌键盘按键间距，默认 `4px`                   |
| `--snake-keyboard-car-key-height`    | 车牌键盘按键高度，默认 `48px`                  |
| `--snake-keyboard-car-key-font-size` | 车牌键盘按键字号，默认 `18px`                  |
