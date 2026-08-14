---
preview: /pages/componentsA/notice-bar
---

# Notice Bar 通知栏

用于页面顶部公告、活动提示和多条消息轮换，可展示单行通知或定时切换列表。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-notice-bar volume-icon text="欢迎使用 Snake UI" />
```

## 多条轮换

```vue
<snake-notice-bar :list="['第一条公告', '第二条公告']" mode="vertical" :duration="3000" @change="onChange" />
```

当 `mode="vertical"` 或 `direction="column"` 且列表超过一项时，组件按 `duration` 定时切换。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `list` | 通知列表，优先于 text | `string[]` | `[]` | - |
| `text` | 单条或多条通知 | `string \| string[]` | `''` | - |
| `mode` | 展示模式 | `string` | `horizontal` | `horizontal` / `vertical` |
| `direction` | 排列方向，同时影响是否轮换 | `string` | `row` | `row` / `column` |
| `volumeIcon` | 是否显示提示字符 | `boolean` | `false` | `true` / `false` |
| `bgColor` | 背景色 | `string` | `#fff8e6` | CSS 颜色 |
| `color` | 文字颜色 | `string` | `#f9ae3d` | CSS 颜色 |
| `duration` | 轮换间隔，单位 ms | `number` | `3000` | - |
| `customStyle` | 自定义样式 | `string \| object \| array` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `click` | 点击通知栏 | 当前索引 `index` |
| `change` | 自动切换后 | 当前索引 `index` |

## 注意事项

- `mode` 和 `direction` 只控制轮换条件，当前没有滚动动画。
- list 或 duration 改变时定时器会重启，卸载时自动清理。

源码：`src/uni_modules/snake-ui/components/snake-notice-bar/snake-notice-bar.vue`
