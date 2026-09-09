---
preview: /pages/componentsB/images/index
cms: true
---

# 图片展示 <span class="cms-badge">CMS</span>

根据当前运行平台选择图片配置，并支持点击跳转。

## 运行前提

依赖 uni-app 条件编译、`uni.$snake.navTo` 和 Snake UI `addUnit` 单位工具。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-images
    :datas="{
        platformOptions: [
            {
                value: 'h5',
                imgs: {
                    src: 'https://example.com/banner.png',
                    url: '/pages/activity/index',
                    paddingLR: 20,
                    height: 320
                }
            }
        ]
    }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数    | 说明           | 类型             | 默认值 | 可选值 |
| ------- | -------------- | ---------------- | ------ | ------ |
| `datas` | 分平台图片配置 | `Object \| null` | `{}`   | -      |

### `datas` 字段

| 字段                               | 说明                                     |
| ---------------------------------- | ---------------------------------------- |
| `platformOptions`                  | 平台配置数组；每项包含 `value` 和 `imgs` |
| `platformOptions[].value`          | `h5`、`app`、`wxma` 或 `alima`           |
| `platformOptions[].imgs.src`       | 图片地址                                 |
| `platformOptions[].imgs.url`       | 点击跳转地址                             |
| `platformOptions[].imgs.paddingLR` | 左右内边距，单位按 `rpx` 转换            |
| `platformOptions[].imgs.height`    | 固定高度；缺省时图片使用 `widthFix`      |

组件未声明事件和插槽。

## 注意事项

`platformOptions` 必须是数组且至少包含一项，否则计算属性会在 `find` 或回退读取时出错。当前平台没有专属有效图片时，组件回退到数组第一项。

## 主题变量

组件未直接使用 CSS 主题变量。图片地址、尺寸、间距及跳转行为由 `datas.platformOptions` 配置。

源码：`src/uni_modules/snake-ui/components/snake-images/snake-images.vue`
