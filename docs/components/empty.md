---
preview: /pages/componentsA/empty
---

# Empty 空状态

用于列表、搜索结果或页面没有内容时提供统一反馈，可使用图片与文字，也可完全自定义提示区域。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-empty icon="/static/empty.png" text="暂无相关内容" />
```

## 自定义内容

```vue
<snake-empty :custom-style="{ minHeight: '400rpx' }">
  <view>还没有收藏，去逛逛吧</view>
</snake-empty>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `icon` | 空状态图片地址 | `string` | `''` | - |
| `text` | 提示文字 | `string` | `暂无数据` | - |
| `textColor` | 默认文字颜色 | `string` | `#909399` | CSS 颜色 |
| `customStyle` | 根容器样式 | `string \| object \| array` | `''` | - |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 替换默认文字，图片仍会显示 | - |

## 注意事项

- 组件不设置最小高度，居中范围由父容器决定。
- 图标固定为 `200rpx × 200rpx`，当前没有独立尺寸参数。

源码：`src/uni_modules/snake-ui/components/snake-empty/snake-empty.vue`
