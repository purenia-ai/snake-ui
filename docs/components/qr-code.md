---
preview: /pages/componentsA/qrCode/index
---

# QrCode 二维码

把文本或链接渲染为可扫描的 canvas 二维码，支持纠错级别、颜色定制、中心 Logo 与导出临时图片，适用于分享码、支付码等场景。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-qr-code text="https://example.com" />
```

`size` 单位为 px（画布坐标基准），微信小程序内部按设备像素比放大保证清晰度；内容或尺寸变化时自动重绘。

## 中心 Logo 与样式

```vue
<snake-qr-code
    text="https://example.com"
    :size="220"
    :margin="10"
    logo="https://cdn.example.com/logo.png"
    color-dark="#1a1a1a"
    color-light="#ffffff"
/>
```

- `logo` 尺寸默认取 `size` 的 20%，可用 `logoWidth` / `logoHeight` 覆盖；Logo 下方自动垫白底。
- 带 Logo 时建议 `correctLevel="H"`，中心被遮挡后仍可稳定扫描。
- Logo 加载失败时触发 `error` 并保留完整矩阵，二维码不受影响。

## 导出图片

海报存图等场景通过 ref 调用 `exportImage()`，拿到本地临时路径后再保存或上传。

```ts
const qrCodeRef = ref();

async function saveQrCode() {
    const tempFilePath = await qrCodeRef.value?.exportImage();
    if (tempFilePath) uni.saveImageToPhotosAlbum({ filePath: tempFilePath });
}
```

## API

### Props

| 参数                          | 说明                                       | 类型                       | 默认值                |
| ----------------------------- | ------------------------------------------ | -------------------------- | --------------------- |
| `text`                        | 二维码内容，UTF-8 文本或链接               | `string`                   | `''`                  |
| `size`                        | 二维码边长（px）                           | `number`                   | `200`                 |
| `correctLevel`                | 纠错级别                                   | `'L' \| 'M' \| 'Q' \| 'H'` | `H`                   |
| `colorDark` / `colorLight`    | 深色模块 / 浅色背景颜色                    | `string`                   | `#000000` / `#FFFFFF` |
| `margin`                      | 四周留白（px）                             | `number`                   | `0`                   |
| `logo`                        | 中心 Logo 图片地址，为空时不绘制           | `string`                   | `''`                  |
| `logoWidth` / `logoHeight`    | Logo 宽高（px），0 时取 size 的 20% / 同宽 | `number`                   | `0`                   |
| `canvasId`                    | Canvas 标识，同页多实例时建议显式指定      | `string`                   | 自动生成              |
| `customClass` / `customStyle` | 自定义类名与样式                           | `string / style`           | `''`                  |

### Events

| 事件名  | 触发时机                 | 参数     |
| ------- | ------------------------ | -------- |
| `click` | 点击二维码               | 事件对象 |
| `error` | 内容编码或 Logo 绘制失败 | 错误对象 |

### Expose

| 方法            | 说明                                     |
| --------------- | ---------------------------------------- |
| `exportImage()` | 等待当前绘制完成后导出二维码临时图片路径 |

## 类型定义

```ts
import type { QrCodeProps, QrCodeEmits, QrCodeExpose } from 'snake-ui';
```

## 主题变量

二维码为画布渲染，不引入独立主题变量；配色通过 `colorDark` / `colorLight` 控制。
