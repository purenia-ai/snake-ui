---
preview: /pages/componentsA/rootPortal/index
---

# RootPortal 根节点传送

把插槽内容传送到页面根节点渲染，避免被祖先的 `transform`、`overflow` 或层叠上下文影响，主要用于解决复杂布局下 fixed 弹层失效、被裁剪的问题；也可用于在页面任意深度挂载 `<snake-toast global>`、`<snake-modal global>` 等全局服务组件。

:::tip 提示
组件会按平台自动选择实现：H5 使用 teleport，微信/支付宝小程序使用原生 `root-portal`，App 端使用 renderjs；其他平台不支持传送，内容原位渲染。仅在遇到层级或定位问题时使用。
:::

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

用 `snake-root-portal` 包裹 fixed 定位的弹层，使其脱离带 `transform` 的父容器：

```vue
<view class="cage" style="transform: scale(0.7)">
    <snake-button type="primary" @click="show = true">显示弹层</snake-button>

    <snake-root-portal>
        <snake-popup :show="show" mode="bottom" round @close="show = false">
            <view class="popup-content">脱离 transform 容器的弹层</view>
        </snake-popup>
    </snake-root-portal>
</view>
```

## API

### Props

| 参数          | 说明       | 类型                        | 默认值 |
| ------------- | ---------- | --------------------------- | ------ |
| `customClass` | 自定义类名 | `string`                    | `''`   |
| `customStyle` | 根节点样式 | `string \| object \| array` | `''`   |

### Slots

| 插槽名    | 说明             |
| --------- | ---------------- |
| `default` | 需要传送的内容。 |

## 主题变量

传送后的内容脱离了 `snake-config-provider` 的作用范围，组件会在内层容器重新携带 `snake-theme-{mode}` 类名与主题 CSS 变量，弹层内的语义色与暗黑模式依然生效。
