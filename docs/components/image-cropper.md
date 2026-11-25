---
preview: /pages/componentsA/imageCropper/index
---

# ImageCropper 图片裁剪

全屏裁剪层：拖拽移动、双指缩放、按 90° 旋转，确认后用离屏 canvas 导出临时文件。
常用于「换头像」「裁剪商品主图」这类选图之后的上传前处理。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

App 端指的是 **vue 页面**；nvue 页面里传统 canvas 没有对应实现，本组件不可用。
鸿蒙与小红书小程序只用标准 canvas API，未实测，按「理论可用」对待。

## 基础用法

组件自带全屏固定层，用 `v-model` 控制显隐，`src` 传待裁剪的图片地址；确认后从 `confirm` 事件拿到结果：

```vue
<snake-image-cropper v-model="show" :src="src" @confirm="onConfirm" @cancel="onCancel" />
```

```ts
const show = ref(false);
const src = ref('');
const cropped = ref('');

function chooseImage() {
    uni.chooseImage({
        count: 1,
        success: res => {
            src.value = res.tempFilePaths[0];
            show.value = true;
        }
    });
}

function onConfirm(result: { tempFilePath: string; width: number; height: number }) {
    cropped.value = result.tempFilePath;
}
```

`confirm` 的 `width` / `height` 是**导出后的像素尺寸**（裁剪框尺寸乘以 `export-scale`），不是原图尺寸。

`show` 是 `v-model` 的等价写法，两者都支持；同时绑定时以 `modelValue` 为准。

## 裁剪比例

`aspect-ratio` 决定裁剪框形状，格式为 `宽:高`，也接受 `宽/高`：

```vue
<snake-image-cropper v-model="show" :src="src" aspect-ratio="16:9" />
<snake-image-cropper v-model="show" :src="src" aspect-ratio="4/3" />
```

比例只改变裁剪框；图片进入时会被拉到「恰好铺满裁剪框」，超出的部分靠拖动与缩放取舍。
非法取值（空串、`0:1`、写错的分隔符）一律按 `1:1` 处理。

## 导出尺寸与格式

`export-scale` 是导出倍数，默认 `2`，即裁剪框 200px 宽时导出 400px：

```vue
<snake-image-cropper v-model="show" :src="src" :export-scale="3" file-type="jpg" :quality="0.9" />
```

- `file-type` 支持 `png`（默认）与 `jpg`。
- `quality` 只对 `jpg` 生效，范围 `0–1`。
- `export-scale` 会被归整为不小于 1 的整数：0 会让画布尺寸归零、导出直接失败。

## 旋转与重置

右下角的旋转按钮每次逆时针转 90°，`disabled-rotate` 可以把它整个关掉：

```vue
<snake-image-cropper v-model="show" :src="src" disabled-rotate />
```

也可以在外部通过 `ref` 调用实例方法：

```vue
<snake-image-cropper ref="cropperRef" v-model="show" :src="src" />
```

```ts
const cropperRef = ref<ImageCropperExpose | null>(null);

cropperRef.value?.setRotate(90); // 绝对值，非 90 的倍数会被归整
cropperRef.value?.reset(); // 角度归零、缩放回到铺满、居中
```

`set-rotate` 收的是**绝对角度**，不是增量。想按按钮逐次旋转时，业务侧自己累计角度。

## 与上传流程配合

裁剪结果是临时文件路径，直接交给 `uni.uploadFile` 或 `snake-upload` 的自定义上传函数：

```ts
function onConfirm(result: { tempFilePath: string }) {
    uni.uploadFile({
        url: 'https://example.com/upload',
        filePath: result.tempFilePath,
        name: 'file',
        success: res => {
            avatar.value = JSON.parse(res.data).url;
        }
    });
}
```

H5 端的 `tempFilePath` 是 base64 形式，需要上传成文件时先转 `Blob`。
小程序端裁剪**网络图片**要先在平台后台配置 downloadFile 域名，否则 `get-image-info` 取不到本地路径，只会拿到 `imgloaderror`。

## API

### Props

| 参数                  | 说明                                                  | 类型                   | 默认值                      |
| --------------------- | ----------------------------------------------------- | ---------------------- | --------------------------- |
| `customStyle`         | 根节点自定义样式                                      | `StyleValue`           | `''`                        |
| `customClass`         | 根节点自定义类名                                      | `string`               | `''`                        |
| `modelValue`          | 是否显示，支持 `v-model`                              | `boolean`              | `undefined`（布尔 `false`） |
| `show`                | 是否显示，`modelValue` 的等价写法                     | `boolean`              | `undefined`                 |
| `src`                 | 待裁剪图片地址，支持本地与网络地址                    | `string`               | `''`                        |
| `aspectRatio`         | 裁剪框宽高比，`宽:高` 或 `宽/高`                      | `string`               | `1:1`                       |
| `maxScale`            | 最大放大倍数，相对铺满态                              | `number`               | `3`                         |
| `exportScale`         | 导出像素倍数                                          | `number`               | `2`                         |
| `fileType`            | 导出格式，可选值 `png` / `jpg`                        | `ImageCropperFileType` | `png`                       |
| `quality`             | jpg 质量，范围 0–1，png 下无效                        | `number`               | `1`                         |
| `disabledRotate`      | 是否禁止旋转并隐藏旋转按钮                            | `boolean`              | `false`                     |
| `imgWidth`            | 图片初始宽度，数字按 px、字符串支持 `%`，一般不需要传 | `number \| string`     | `undefined`                 |
| `imgHeight`           | 图片初始高度，规则同 `imgWidth`                       | `number \| string`     | `undefined`                 |
| `cancelText`          | 取消文案，空则读语言包 `common.cancel`                | `string`               | `''`                        |
| `confirmText`         | 确认文案，空则读语言包 `common.confirm`               | `string`               | `''`                        |
| `zIndex`              | 层级，缺省取 `zIndex.popup`                           | `number`               | `undefined`                 |
| `lockScroll`          | 是否阻止页面跟随触摸滚动                              | `boolean`              | `true`                      |
| `safeAreaInsetBottom` | 底部操作区是否避让安全区                              | `boolean`              | `true`                      |

### Events

| 事件名              | 说明                 | 参数                              |
| ------------------- | -------------------- | --------------------------------- |
| `confirm`           | 导出完成             | `{ tempFilePath, width, height }` |
| `cancel`            | 用户点击取消         | -                                 |
| `imgloaded`         | 图片信息读取成功     | `{ width, height, path }`         |
| `imgloaderror`      | 图片读取失败         | `{ src, errMsg }`                 |
| `update:modelValue` | 关闭时回写 `v-model` | `boolean`                         |
| `update:show`       | 关闭时回写 `show`    | `boolean`                         |

导出失败不会关闭裁剪层：用户还能重试，也避免业务侧只拿到一个空结果。

### Methods

通过 `ref` 调用：

| 方法名      | 说明                                 | 参数                  |
| ----------- | ------------------------------------ | --------------------- |
| `setRotate` | 设置旋转角度，非 90 的倍数会被归整   | `angle: number`（度） |
| `reset`     | 回到初始态：角度归零、缩放铺满、居中 | -                     |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 暂无插槽 |

## 主题变量

| 变量名                                  | 说明                             | 默认值                      |
| --------------------------------------- | -------------------------------- | --------------------------- |
| `--snake-image-cropper-bg`              | 全屏层背景色                     | `#000000`                   |
| `--snake-image-cropper-mask`            | 裁剪框外的遮罩色                 | `rgba(0, 0, 0, 0.55)`       |
| `--snake-image-cropper-mask-highlight`  | 手势进行中的遮罩色（淡出看全图） | `transparent`               |
| `--snake-image-cropper-border-color`    | 裁剪框边框颜色                   | `#ffffff`                   |
| `--snake-image-cropper-corner-color`    | 四角角标颜色                     | `#ffffff`                   |
| `--snake-image-cropper-gridline-color`  | 网格线颜色                       | `rgba(255, 255, 255, 0.35)` |
| `--snake-image-cropper-footer-color`    | 底部文案与图标颜色               | `#ffffff`                   |
| `--snake-image-cropper-mask-transition` | 遮罩过渡时长                     | `0.2s`                      |

裁剪层是深色浮层，语义色（`--snake-color-surface` 之类）在这层语境下不成立，所以单独提供变量。

## 使用建议

- 图片未加载成功时确认按钮是灰的：拿不到本地路径就没法绘制，提前挡住比导出一张空白图好。
- `lockScroll` 在 H5 端阻止页面跟随滚动；小程序端模板上固定阻止冒泡，不再由该属性控制。
- 组件内部用 `v-if` 承载整层，关闭即销毁 canvas。需要频繁连续裁剪时，关闭比隐藏更省资源。
- 传给 `export-scale` 的值不建议超过 3：超大画布在部分小程序上会碰到 canvas 尺寸上限。
