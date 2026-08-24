---
preview: /pages/componentsA/loadmore/index
---

# Loadmore 加载更多

用于列表底部反馈分页状态。组件不直接请求数据，点击可加载状态时会派发 `loadmore`，由业务更新 `status`。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-loadmore :status="status" @loadmore="loadNextPage" />
```

## 动画与结束线

```vue
<snake-loadmore status="loading" icon-type="flower" icon-color="#06D290" />
<snake-loadmore status="nomore" is-dot nomore-text="已经到底啦" />
```

`loadText` 可传字符串，也可传 `{ loadmore, loading, nomore }` 一次配置全部状态文案。

## API

### Props

| 参数                             | 说明                       | 类型                        | 默认值        |
| -------------------------------- | -------------------------- | --------------------------- | ------------- |
| `status`                         | loadmore/loading/nomore    | `string`                    | `loadmore`    |
| `loadText`                       | 待加载文案或三态文案对象   | `string \| object`          | `加载更多`    |
| `loadingText`                    | 加载中文案                 | `string`                    | `正在加载...` |
| `nomoreText`                     | 无更多文案                 | `string`                    | `没有更多了`  |
| `icon`                           | 加载中是否显示动画         | `boolean`                   | `true`        |
| `iconType`                       | circle/flower/spinner      | `string`                    | `circle`      |
| `iconColor`                      | 动画颜色                   | `string`                    | 主题色        |
| `isDot`                          | 无更多状态是否显示点状分隔 | `boolean`                   | `false`       |
| `color` / `fontSize` / `bgColor` | 文字颜色、字号和背景       | `string \| number`          | 主题默认值    |
| `marginTop` / `marginBottom`     | 上下外边距                 | `string \| number`          | `0`           |
| `customClass` / `customStyle`    | 自定义类名和样式           | `string \| object \| array` | `''`          |

### Events

| 事件名     | 触发时机           | 参数          |
| ---------- | ------------------ | ------------- |
| `loadmore` | 点击 loadmore 状态 | -             |
| `click`    | 点击组件           | 当前 `status` |

源码：`src/uni_modules/snake-ui/components/snake-loadmore/snake-loadmore.vue`
