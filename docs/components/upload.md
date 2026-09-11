---
preview: /pages/componentsA/upload/index
---

# Upload 文件上传

用于选择、预览和上传图片、视频或文件。支持普通接口上传与 OSS 等自定义上传。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-upload v-model="files" action="https://example.com/upload" />
```

组件通过 `uni.uploadFile` 上传，支持 `header`、`formData`、`name`、`timeout`、进度、失败重试和手动上传。

## OSS 自定义上传

OSS 凭证和签名由业务端处理，组件只负责文件队列与状态：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { UploadFileItem, UploadRequest } from '@/uni_modules/snake-ui';

const files = ref<UploadFileItem[]>([]);

const uploadToOss: UploadRequest = async (file, { onProgress }) => {
    const policy = await getOssPolicy();
    const result = await uploadOssFile(file.path || file.url || '', policy, onProgress);
    return { url: result.cdnUrl, response: result };
};
</script>

<template>
    <snake-upload v-model="files" :upload-request="uploadToOss" />
</template>
```

`uploadRequest` 返回远程 URL 字符串，或 `{ url, response?, name? }`。抛出错误时文件进入失败状态，可调用 `retry(index)` 或 `reUpload(index)`。

## 手动上传

```vue
<snake-upload ref="uploadRef" :auto-upload="false" :upload-request="uploadToOss" />
<snake-button @click="uploadRef?.upload()">开始上传</snake-button>
```

## API

### Props

| 参数                                  | 说明                                                        | 类型                                   | 默认值                        |
| ------------------------------------- | ----------------------------------------------------------- | -------------------------------------- | ----------------------------- |
| `modelValue`                          | 文件列表，支持 `v-model`                                    | `UploadFileItem[]`                     | `[]`                          |
| `fileList`                            | 初始文件列表（旧版兼容，`modelValue` 有值时优先）           | `UploadFileItem[]`                     | `[]`                          |
| `action`                              | 服务器上传地址                                              | `string`                               | `''`                          |
| `uploadRequest`                       | 自定义上传适配器（OSS 等），优先于 `action`                 | `UploadRequest`                        | -                             |
| `timeout`                             | 默认上传的超时时间，单位毫秒                                | `number`                               | `60000`                       |
| `accept`                              | 接受的文件类型 `image / video / file / media / all`         | `string`                               | `'image'`                     |
| `mode`                                | 展示模式 `grid / list`                                      | `string`                               | `'grid'`                      |
| `width` / `height`                    | 单个格子宽高，单位 rpx                                      | `number \| string`                     | `200`                         |
| `maxCount`                            | 最大文件数量                                                | `number \| string`                     | `52`                          |
| `maxSize`                             | 单个文件最大字节数                                          | `number \| string`                     | `Number.MAX_VALUE`            |
| `multiple`                            | 是否开启文件多选                                            | `boolean`                              | `true`                        |
| `disabled`                            | 是否禁用组件                                                | `boolean`                              | `false`                       |
| `autoUpload`                          | 选择完是否自动上传                                          | `boolean`                              | `true`                        |
| `deletable`                           | 是否显示删除按钮                                            | `boolean`                              | `true`                        |
| `delIcon` / `delBgColor` / `delColor` | 删除按钮图标 / 背景色 / 图标色                              | `string`                               | `'close'` / error 色 / `#fff` |
| `showConfirm`                         | 删除前是否显示确认弹窗                                      | `boolean`                              | `true`                        |
| `showTips`                            | 是否自动提示 toast                                          | `boolean`                              | `true`                        |
| `showProgress`                        | 是否显示上传进度条                                          | `boolean`                              | `true`                        |
| `showUploadList`                      | 是否显示组件内部的文件预览列表                              | `boolean`                              | `true`                        |
| `showFileName`                        | 是否显示文件名                                              | `boolean`                              | `true`                        |
| `showFileSize`                        | 是否显示文件大小                                            | `boolean`                              | `false`                       |
| `previewFullImage`                    | 是否可通过 `uni.previewImage` 预览图片                      | `boolean`                              | `true`                        |
| `previewFile`                         | 是否可预览非图片文件                                        | `boolean`                              | `true`                        |
| `customBtn`                           | 是否自定义选择按钮，`true` 时使用 `addBtn` 插槽             | `boolean`                              | `false`                       |
| `uploadText`                          | 选择按钮提示文字                                            | `string`                               | 按 `accept` 自动              |
| `imageMode`                           | 预览图片显示模式                                            | `string`                               | `'aspectFill'`                |
| `imageShape`                          | 图片/图标形状 `square / circle`                             | `string`                               | `'square'`                    |
| `index`                               | 各回调事件的最后一个参数，用于区分组件实例                  | `string \| number`                     | `''`                          |
| `header`                              | 上传请求头                                                  | `object`                               | `{}`                          |
| `formData`                            | 上传附加参数                                                | `object`                               | `{}`                          |
| `name`                                | 文件字段名，供后端获取                                      | `string`                               | `'file'`                      |
| `sizeType`                            | `original` 原图 / `compressed` 压缩图                       | `string[]`                             | `['original', 'compressed']`  |
| `sourceType`                          | 来源 `album` 相册 / `camera` 相机                           | `string[]`                             | `['album', 'camera']`         |
| `limitType`                           | 允许的文件后缀，优先级高于 `accept` 内置格式限制            | `string[]`                             | `[]`                          |
| `extension`                           | 选择文件的扩展名过滤，仅 H5 与微信 `accept='file'` 有效     | `string[]`                             | `[]`                          |
| `fileIconMap`                         | 文件类型图标映射 `{ [type]: { name, color? } }`             | `object`                               | `{}`                          |
| `compressed`                          | 选择视频时是否压缩                                          | `boolean`                              | `true`                        |
| `maxDuration`                         | 选择视频时拍摄最长时长，单位秒                              | `number`                               | `60`                          |
| `camera`                              | 选择视频时摄像头方向 `front / back`                         | `string`                               | `'back'`                      |
| `beforeUpload`                        | 上传前钩子，返回 `false` 或 Promise 拒绝则跳过该文件        | `(index, files) => boolean \| Promise` | -                             |
| `beforeRemove`                        | 删除前钩子，返回 `false` 或 Promise 拒绝则阻止删除          | `(index, files) => boolean \| Promise` | -                             |
| `toJson`                              | 返回值为 json 字符串时自动转为对象                          | `boolean`                              | `true`                        |
| `customChoose`                        | 自定义文件选择，开启后点击触发 `on-choose` 而不调用默认 API | `boolean`                              | `false`                       |
| `isCustomUpload`                      | 旧版兼容：选择文件走 `customUpload` 事件                    | `boolean`                              | `false`                       |
| `customClass` / `customStyle`         | 自定义类名和样式                                            | `string \| style`                      | `''`                          |

### Events

| 事件名               | 说明                               | 参数                                    |
| -------------------- | ---------------------------------- | --------------------------------------- |
| `update:modelValue`  | 文件列表更新，支持 `v-model`       | `files`                                 |
| `on-choose`          | 启用 `customChoose` 时点击选择触发 | `{ accept, maxCount, fileList, index }` |
| `on-choose-complete` | 每次文件选择完成后                 | `files, index`                          |
| `on-choose-fail`     | 文件选择失败                       | `error`                                 |
| `on-oversize`        | 文件超过 `maxSize`                 | `file, files, index`                    |
| `on-exceed`          | 数量超过 `maxCount`                | `file, files, index`                    |
| `on-uploaded`        | 全部文件上传完毕                   | `files, index`                          |
| `on-success`         | 单个文件上传成功                   | `data, index, files, index`             |
| `on-error`           | 单个文件上传失败                   | `err, index, files, index`              |
| `on-change`          | 单个文件上传状态改变（无论成败）   | `res, index, files, index`              |
| `on-progress`        | 上传进度变化                       | `res, index, files, index`              |
| `on-remove`          | 移除文件时                         | `index, files, index`                   |
| `on-preview`         | 预览文件时                         | `url, files, index`                     |
| `on-list-change`     | 文件列表发生变化                   | `files, index`                          |

### Slots

| 插槽名   | 说明                               | 参数          |
| -------- | ---------------------------------- | ------------- |
| 默认     | 组件内容（默认渲染文件列表与按钮） | -             |
| `addBtn` | 自定义选择文件按钮                 | -             |
| `file`   | 自定义文件列表                     | `file: files` |

### Methods

| 方法                       | 说明                                               |
| -------------------------- | -------------------------------------------------- |
| `upload()`                 | 上传全部待上传文件                                 |
| `retry(index)`             | 重试指定文件                                       |
| `reUpload(index?)`         | 重传指定文件或失败队列                             |
| `addFiles(files)`          | 添加外部选择的文件                                 |
| `deleteItem(index)`        | 按确认和钩子规则删除文件                           |
| `remove(index)`            | 直接移除指定文件                                   |
| `selectFile()`             | 打开文件选择器                                     |
| `clear()`                  | 清空列表                                           |
| `previewImage(url)`        | 预览图片                                           |
| `previewFile(item, index)` | 预览/打开文件                                      |
| `onBeforeRead(file)`       | 旧版兼容：把文件交给 `beforeRead`/`afterRead` 流程 |

## 类型定义

从包根导入 `UploadProps`、`UploadFileItem`、`UploadRequest`、`UploadRequestResult`、`UploadExpose` 等类型。

## 旧版兼容

旧项目仍可使用 `isCustomUpload`、`@customUpload` 和 `onBeforeRead(file)`。新代码推荐使用 `customChoose`/`@on-choose`/`addFiles` 处理自定义选择，使用 `uploadRequest` 处理 OSS 上传。

## 主题变量

Upload 没有组件专属令牌，直接复用以下全局变量：

| 变量                           | 用途                   |
| ------------------------------ | ---------------------- |
| `--snake-color-primary`        | 选择入口和图片类型标识 |
| `--snake-color-success`        | 成功及表格文件类型标识 |
| `--snake-color-warning`        | 演示文稿文件类型标识   |
| `--snake-color-error`          | 删除、失败和错误状态   |
| `--snake-color-info`           | 通用信息文件类型标识   |
| `--snake-color-text-secondary` | 文件名和状态文字       |
| `--snake-color-text-muted`     | 辅助信息与默认文件标识 |
| `--snake-color-border`         | 文件项和选择入口边框   |
| `--snake-color-surface`        | 文件项背景             |
| `--snake-color-disabled-bg`    | 禁用背景               |
