---
preview: /pages/componentsA/sticky
---

# Sticky 吸顶

使用 CSS `position: sticky` 将导航、筛选栏或标题固定在滚动容器顶部。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 有限制 | 有限制 |

微信小程序和 App 的表现取决于页面结构、原生滚动容器及目标平台对 sticky 的支持，复杂场景需真机验证。

## 基础用法

```vue
<snake-sticky :offset-top="0" bg-color="#fff"><view>吸顶内容</view></snake-sticky>
```

## 顶部偏移与禁用

```vue
<snake-sticky offset-top="88rpx" :z-index="20" bg-color="#00a86f">导航栏下方吸顶</snake-sticky>
<snake-sticky disabled>普通文档流内容</snake-sticky>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `offsetTop` | 顶部偏移，数字按 px 处理 | `string \| number` | `0` | - |
| `zIndex` | 层级 | `number` | `10` | - |
| `disabled` | 是否禁用吸顶 | `boolean` | `false` | `true` / `false` |
| `bgColor` | 背景色 | `string` | `transparent` | CSS 颜色 |
| `customStyle` | 自定义样式 | `string \| object \| array` | `''` | - |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 吸顶内容 | - |

## 注意事项

- 任一祖先元素设置不合适的 `overflow` 或 `transform` 可能改变 sticky 的滚动参照。
- 组件不监听滚动，也不发送吸顶状态事件。

源码：`src/uni_modules/snake-ui/components/snake-sticky/snake-sticky.vue`
