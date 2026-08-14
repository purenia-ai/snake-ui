---
preview: /pages/componentsA/icon
---

# Icon 图标

用于 Snake UI 内部和业务页面的少量常用字符图标，不依赖字体文件或第三方图标库。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-icon name="search" color="#00a86f" :size="28" />
```

## 图标名称与自定义字符

内置名称包括 `search`、`close`、`close2`、`close-circle-fill`、`play-right-fill`。传入其他字符串时会直接将该字符串作为字符显示：

```vue
<snake-icon name="★" color="#f5a623" size="36rpx" bold />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `name` | 内置名称或直接显示的字符 | `string` | `''` | 见上文 |
| `color` | 图标颜色 | `string` | `currentColor` | CSS 颜色 |
| `size` | 字号，数字按 px 处理 | `string \| number` | `16` | - |
| `bold` | 是否加粗 | `boolean` | `false` | `true` / `false` |
| `customStyle` | 自定义样式 | `string \| object \| array` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `click` | 点击图标时 | 原始点击事件 |

## 注意事项

- 这是字符图标，不是完整 iconfont；不同系统字体的字形可能略有差异。
- `close` 与 `close2` 当前显示相同字符。

源码：`src/uni_modules/snake-ui/components/snake-icon/snake-icon.vue`
