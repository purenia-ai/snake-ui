---
preview: /pages/componentsA/button
---

# Button 按钮

基于 uni-app `button` 的轻量操作按钮，适合表单提交、确认、取消及页面内普通操作。当前实现聚焦主题色、朴素、禁用和加载状态。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-button type="primary" @click="submit">确定</snake-button>
```

## 状态与自定义样式

```vue
<snake-button type="primary" plain>朴素按钮</snake-button>
<snake-button disabled>禁用按钮</snake-button>
<snake-button loading>加载中</snake-button>
<snake-button :custom-style="{ width: '320rpx', marginTop: '24rpx' }">自定义</snake-button>
```

`customStyle` 直接合并到内部 `button`，对象样式键建议使用驼峰写法。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `type` | 样式类型，目前仅用于类名扩展 | `string` | `default` | `default` / `primary` / 自定义 |
| `plain` | 是否使用透明背景和主题色文字 | `boolean` | `false` | `true` / `false` |
| `disabled` | 是否禁用 | `boolean` | `false` | `true` / `false` |
| `loading` | 是否使用原生按钮加载状态 | `boolean` | `false` | `true` / `false` |
| `customStyle` | 合并到内部按钮的样式 | `string \| object \| array` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `click` | 点击按钮时 | 原始点击事件 |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 按钮文字或自定义内容 | - |

## 注意事项

- 当前没有透传 `open-type`、`form-type` 等小程序开放能力。
- `type` 不会自动切换多套颜色；默认主题色均为 Snake UI 绿色。
- 禁用状态由原生 `button` 处理，不会触发组件 `click`。

源码：`src/uni_modules/snake-ui/components/snake-button/snake-button.vue`
