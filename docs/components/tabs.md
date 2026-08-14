---
preview: /pages/componentsA/tabs
---

# Tabs 标签页

用于分类导航与内容切换，支持字符串列表和对象列表，由父级维护当前选中索引。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-tabs :list="['推荐', '新品', '热门']" :current="current" @change="current = $event" />
```

## 对象列表与样式

```vue
<snake-tabs
  :list="[{ label: '全部' }, { label: '待付款' }]"
  name="label"
  line-color="#ff5a5f"
  active-color="#17221d"
  inactive-color="#87928c"
  :active-item-style="{ fontWeight: 700 }"
  :bar-style="{ width: '56rpx' }"
/>
```

## 配合吸顶

```vue
<snake-sticky bg-color="#fff"><snake-tabs :list="list" :current="current" @change="current = $event" /></snake-sticky>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `list` | 字符串或对象标签列表 | `Array<string \| object>` | `[]` | - |
| `current` | 当前索引 | `number` | `0` | - |
| `name` | 对象标题字段名 | `string` | `name` | - |
| `lineColor` | 指示线颜色 | `string` | `#06d290` | CSS 颜色 |
| `activeColor` | 激活文字颜色 | `string` | `#303133` | CSS 颜色 |
| `inactiveColor` | 未激活文字颜色 | `string` | `#606266` | CSS 颜色 |
| `fontSize` | 文字大小，数字按 px 处理 | `string \| number` | `28rpx` | - |
| `activeItemStyle` | 激活项附加样式 | `object` | `{}` | - |
| `barStyle` | 指示线附加样式 | `object` | `{}` | - |
| `bgColor` | 背景色 | `string` | `transparent` | CSS 颜色 |
| `scrollable` | 滚动配置，当前为兼容预留 | `boolean` | `true` | `true` / `false` |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `click` | 点击任意标签 | `{ index, item }` |
| `change` | 点击的索引与 `current` 不同 | `index: number` |

## 注意事项

- 组件不在内部修改 `current`，父级必须在 `change` 后更新它。
- 当前 `scrollable` 未参与模板逻辑，滚动容器始终启用横向滚动。
- 当前不支持徽标、禁用项和右侧插槽。

源码：`src/uni_modules/snake-ui/components/snake-tabs/snake-tabs.vue`
