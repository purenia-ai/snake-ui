---
preview: /pages/componentsA/avatar/index
---

# Avatar 头像

用图片展示用户或品牌形象；没有图片或图片加载失败时，按 **文字 → 图标 → 内置人像图标** 的顺序回退。
放进 `snake-avatar-group` 会叠成一排，超出数量折叠为 `+N`。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-avatar src="https://example.com/avatar.png" />
```

尺寸按 375 稿 px 解释，`size` 同时决定宽高与字号（字号默认取尺寸的 0.4 倍）：

```vue
<snake-avatar src="https://example.com/avatar.png" :size="48" />
```

## 内容与兜底

四种内容形态的优先级固定，前面的命中就不再往下走：

1. 默认插槽
2. `src` 且未加载失败
3. `text`（原样渲染，组件不会替你截取首字符）
4. `icon`
5. 内置人像图标 `account`

```vue
<snake-avatar text="张" bg-color="#06D290" color="#FFFFFF" />
<snake-avatar icon="account-fill" />
<snake-avatar>
    <text>VIP</text>
</snake-avatar>
```

首字母这类取名规则交给业务，例如 `:text="user.name.slice(0, 1)"`。

## 形状与尺寸

`shape` 支持 `circle`（默认）与 `square`；方形头像的圆角由 `radius` 控制，默认 6。

```vue
<snake-avatar src="/static/logo.png" shape="square" :size="48" :radius="10" />
```

## 加载失败回退

图片加载失败会触发 `error`，同一个地址只派发一次；组件随即按上面的兜底顺序换内容：

```vue
<!-- 有文字用文字 -->
<snake-avatar src="/static/not-found.png" text="李" />
<!-- 没有文字用图标 -->
<snake-avatar src="/static/not-found.png" icon="account-fill" />
```

换 `src` 后失败态复位，会重新尝试加载。

## 头像组

把头像放进 `snake-avatar-group`，组统一下发 `size` 与 `shape`（子项显式传值优先），
`maxCount` 之外的部分折叠成 `+N`：

```vue
<snake-avatar-group :max-count="3" :size="36">
    <snake-avatar v-for="user in users" :key="user.id" :src="user.avatar" :text="user.name" />
</snake-avatar-group>
```

**只渲染部分子项时必须传 `total`。** 组只能数到实际渲染出来的子项，渲染 4 个又想显示真实人数时：

```vue
<!-- users.slice(0, 4) 只渲染 4 个，total=128 才会显示 +124 -->
<snake-avatar-group :max-count="4" :total="128" :size="36">
    <snake-avatar v-for="user in users.slice(0, 4)" :key="user.id" :src="user.avatar" />
</snake-avatar-group>
```

不传 `total` 时组只按已渲染数量计算，`+N` 会是 `0` 或明显偏小。

## 折叠与层级

`overlap` 控制相邻头像的重叠距离，不传时按尺寸的四分之一计算；组会给组内头像加一圈白色分隔环。

`cascading` 决定哪一端压在上面：

| 取值           | 效果                                     |
| -------------- | ---------------------------------------- |
| `last-on-top`  | 默认。后渲染的压在上面，折叠头像在最上层 |
| `first-on-top` | 第一个压在上面，折叠头像被邻居盖住一部分 |

## API

### Props

#### Avatar Props

| 参数          | 说明                                            | 类型          | 默认值                           |
| ------------- | ----------------------------------------------- | ------------- | -------------------------------- |
| `customStyle` | 根节点自定义样式                                | `StyleValue`  | `''`                             |
| `customClass` | 根节点自定义类名                                | `string`      | `''`                             |
| `src`         | 图片地址                                        | `string`      | `''`                             |
| `text`        | 文字兜底，原样渲染                              | `string`      | `''`                             |
| `icon`        | 图标兜底，取本库图标名                          | `string`      | `''`                             |
| `shape`       | 形状，可选值 `circle`（圆形）/ `square`（方形） | `AvatarShape` | `circle`（组内未传时继承组配置） |
| `size`        | 头像尺寸，数值按 px（375 稿）处理               | `UnitValue`   | `40`（组内未传时继承组配置）     |
| `radius`      | 方形头像的圆角，数值按 px（375 稿）处理         | `UnitValue`   | `6`                              |
| `fontSize`    | 文字字号，数值按 px（375 稿）处理               | `UnitValue`   | 尺寸的 0.4 倍                    |
| `bgColor`     | 背景色                                          | `string`      | `--snake-color-surface-muted`    |
| `color`       | 文字与图标颜色                                  | `string`      | `--snake-color-text-muted`       |
| `fit`         | 图片裁剪模式，同 uni-app `image` 的 `mode`      | `ImageMode`   | `aspectFill`                     |

#### AvatarGroup Props

| 参数           | 说明                                            | 类型              | 默认值            |
| -------------- | ----------------------------------------------- | ----------------- | ----------------- |
| `customStyle`  | 根节点自定义样式                                | `StyleValue`      | `''`              |
| `customClass`  | 根节点自定义类名                                | `string`          | `''`              |
| `size`         | 统一尺寸，下发给未显式指定的子项                | `UnitValue`       | `40`              |
| `shape`        | 统一形状，下发给未显式指定的子项                | `AvatarShape`     | `circle`          |
| `maxCount`     | 最多显示几个头像，不传或非正数时不折叠          | `number`          | -                 |
| `total`        | 真实总数，只渲染部分子项时用于算出剩余量        | `number`          | -                 |
| `collapseText` | 折叠头像的文本                                  | `string`          | -（按 `+N` 生成） |
| `overlap`      | 相邻头像的重叠距离，数值按 px（375 稿）处理     | `UnitValue`       | 尺寸的四分之一    |
| `cascading`    | 层级方向，可选值 `last-on-top` / `first-on-top` | `AvatarCascading` | `last-on-top`     |

### Events

| 事件名  | 说明                               | 参数    |
| ------- | ---------------------------------- | ------- |
| `click` | 点击头像时触发，不携带参数         | -       |
| `error` | 图片加载失败时触发，同一地址仅一次 | `event` |

### Slots

#### Avatar Slots

| 名称    | 说明                                                   |
| ------- | ------------------------------------------------------ |
| default | 完全自定义头像内容，优先级高于 `src` / `text` / `icon` |

#### AvatarGroup Slots

| 名称    | 说明                     |
| ------- | ------------------------ |
| default | 头像列表，放置若干头像项 |

## 主题变量

| 变量名                        | 说明                                               |
| ----------------------------- | -------------------------------------------------- |
| `--snake-color-surface-muted` | 头像与折叠头像的默认背景色                         |
| `--snake-color-text-muted`    | 文字与图标的默认颜色                               |
| `--snake-avatar-ring-color`   | 组内白色分隔环的颜色，默认 `--snake-color-surface` |
| `--snake-avatar-ring-width`   | 分隔环宽度，默认 `2px`                             |
| `--snake-avatar-rest-bg`      | 折叠头像背景色，默认 `--snake-color-surface-muted` |
| `--snake-avatar-rest-color`   | 折叠头像文字颜色，默认 `--snake-color-text-muted`  |

## 使用建议

- 头像自身不处理点击预览大图；需要放大时用 `snake-image` 的预览能力包一层。
- 组内子项只认 `snake-avatar`：折叠判断依赖子头像向组注册的顺序，塞入其他元素不会被折叠。
- 列表里给每条数据加稳定的 `key`，注册顺序才会稳定，头像组的序号与折叠位置才可靠。
