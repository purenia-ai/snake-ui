---
preview: /pages/componentsA/loadmore
---

# Loadmore 加载更多

用于列表底部反馈当前分页状态，本身不发起请求，由父级根据加载过程更新 `status`。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-loadmore :status="loading ? 'loading' : finished ? 'nomore' : 'loadmore'" />
```

## 自定义文案

```vue
<snake-loadmore status="nomore" nomore-text="已经到底啦" bg-color="#f6f8f7" :margin-bottom="20" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `status` | 当前状态 | `string` | `loadmore` | `loadmore` / `loading` / `nomore` |
| `loadText` | 待加载文案 | `string` | `加载更多` | - |
| `loadingText` | 加载中文案 | `string` | `正在加载...` | - |
| `nomoreText` | 无更多文案 | `string` | `没有更多了` | - |
| `bgColor` | 背景色 | `string` | `transparent` | CSS 颜色 |
| `marginBottom` | 底部外边距，数字按 px 处理 | `string \| number` | `0` | - |
| `customStyle` | 自定义样式 | `string \| object \| array` | `''` | - |

## 注意事项

- 只有 `loading` 状态显示旋转图形。
- 组件没有点击和触底事件，请在列表或页面生命周期中发起分页请求。

源码：`src/uni_modules/snake-ui/components/snake-loadmore/snake-loadmore.vue`
