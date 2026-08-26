---
preview: /pages/componentsA/icon/index
---

# Icon 图标

图标组件支持 Snake UI 自有字体图标、图片地址和项目自定义图标字体，可同时显示四个方向的标签。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-icon name="search" color="#06D290" :size="28" />
<snake-icon name="success" label="成功" label-pos="bottom" />
<snake-icon name="warning" label="注意" label-pos="left" />
<snake-icon name="https://example.com/icon.png" width="40rpx" height="40rpx" />
<snake-icon name="cart" custom-prefix="my-icon" />
```

示例页中的图标集与包内 `iconfont.css` 保持一致。当前包含搜索、选择、状态、增减、编辑、删除、可见性和方向箭头等常用图标；也可以直接传入单字符。

## 图标集

<IconGallery />

## API

### Props

| 参数                                 | 说明                   | 类型                                        | 默认值                      |
| ------------------------------------ | ---------------------- | ------------------------------------------- | --------------------------- |
| `name`                               | 图标名、字符或图片地址 | `string`                                    | `''`                        |
| `color` / `size` / `bold`            | 颜色、尺寸、粗体       | `string / string\|number / boolean`         | `currentColor / 16 / false` |
| `index`                              | 点击时附带的索引       | `string \| number`                          | `''`                        |
| `label` / `labelPos`                 | 标签及其位置           | `string\|number / left\|right\|top\|bottom` | `'' / right`                |
| `labelColor` / `labelSize` / `space` | 标签颜色、字号和间距   | 多类型                                      | 主题默认值                  |
| `customPrefix`                       | 自定义字体类前缀       | `string`                                    | `''`                        |
| `imgMode` / `width` / `height`       | 图片图标参数           | 多类型                                      | `widthFix`                  |
| `top` / `stop`                       | 垂直微调 / 阻止冒泡    | `string\|number / boolean`                  | `0 / false`                 |
| `customClass` / `customStyle`        | 自定义类名与样式       | 多类型                                      | `''`                        |

点击触发 `click(event, index)`；原有第一个参数仍是事件对象。

源码：`src/uni_modules/snake-ui/components/snake-icon/snake-icon.vue`
