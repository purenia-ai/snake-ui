---
name: 'upload'
description: 'Snake UI Upload 文件上传参考。处理 upload、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['upload', 'snake-upload', 'Upload', '文件上传']
---

# Upload 文件上传

用于选择、预览和上传图片、视频或文件。支持普通接口上传与 OSS 等自定义上传。

## 使用建议

小文件和少量图片可自动上传；批量文件、弱网或需要二次确认的场景使用手动上传。签名、鉴权和文件存储策略必须由业务服务处理，不要写入前端示例。

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
import type { UploadFileItem, UploadRequest } from '@puresnake/snake-ui';

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

`uploadRequest` 返回远程 URL 字符串，或 `{ url, response?, name? }`。返回对象里的其余字段会合并到文件项，适合透传 `imageId`、宽高等元数据；抛出错误时文件进入失败状态，可调用 `retry(index)` 或 `reUpload(index)`。

## 手动上传

```vue
<snake-upload ref="uploadRef" :auto-upload="false" :upload-request="uploadToOss" />
<snake-button @click="uploadRef?.upload()">开始上传</snake-button>
```

## 选择校验与失败重试

`max-count` 和 `max-size` 在文件进入队列前校验；分别监听 `on-exceed`、`on-oversize` 处理业务提示。上传失败的文件保留在队列中，可通过组件实例 `retry(index)` 重试。

```vue
<snake-upload
    ref="uploadRef"
    v-model="files"
    action="https://example.com/upload"
    :max-count="3"
    :max-size="5 * 1024 * 1024"
    @on-oversize="onOversize"
    @on-error="onUploadError"
/>
```

```ts
function onOversize(file) {
    uni.showToast({ title: `${file.name} 超过 5 MB`, icon: 'none' });
}

function onUploadError(_error, index) {
    // 可在用户点击“重试”后调用 uploadRef.value?.retry(index)
}
```

## 自定义选择入口

设置 `custom-choose` 后，组件不再调用系统文件选择器，而是通过 `on-choose` 将当前限制条件交给业务；业务取得文件后调用 `addFiles(files)` 加入队列。

## 拦截与取消

`before-choose`、`before-preview` 与已有的 `before-upload`、`before-remove` 用法一致：返回 `false` 或 Promise 拒绝即中止本次操作。

```vue
<snake-upload
    ref="uploadRef"
    v-model="files"
    :upload-request="uploadToOss"
    :success-status="[200, 201]"
    :before-choose="current => current.length < 9"
    :before-preview="file => file.status === 'success'"
/>
```

```ts
// 取消全部正在上传的文件，或只取消指定索引
uploadRef.value?.abort();
uploadRef.value?.abort(0);
```

- `success-status` 决定 `action` 模式下哪些响应码算成功，默认 `[200, 201, 204]`；`uploadRequest` 模式下以 Promise 是否 resolve 为准。
- 取消后文件回到 `ready` 状态、进度归零，再次调用 `upload()` 即可重传。
- `beforePreview` 返回 `false` 时不触发 `on-preview` 事件，也不会打开预览。

## 无障碍

- 自定义选择入口时使用可点击控件并提供明确文案，例如“选择商品图片”。
- 上传进度、成功和失败不能只靠颜色区分；失败项需要提供重试或移除操作。
- 对文件类型、数量和大小的限制应在选择前说明，并在失败信息中给出可执行的修正方式。

## API

### Props

| 参数               | 说明                                                                                                          | 类型                                                                      | 默认值                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------- |
| `customStyle`      | 根节点自定义样式                                                                                              | `StyleValue`                                                              | `''`                         |
| `customClass`      | 根节点自定义类名                                                                                              | `string`                                                                  | `''`                         |
| `width`            | 单个格子宽度，单位 px（375 稿）                                                                               | `number \| string`                                                        | `100`                        |
| `height`           | 单个格子高度，单位 px（375 稿）                                                                               | `number \| string`                                                        | `100`                        |
| `maxCount`         | 最大文件数量                                                                                                  | `number \| string`                                                        | `52`                         |
| `deletable`        | 是否显示删除按钮                                                                                              | `boolean`                                                                 | `true`                       |
| `mode`             | 展示模式，可选值 `grid`（宫格）/ `list`（列表）                                                               | `'grid' \| 'list'`                                                        | `grid`                       |
| `showUploadList`   | 是否显示组件内部的文件预览列表                                                                                | `boolean`                                                                 | `true`                       |
| `showProgress`     | 是否显示上传进度条                                                                                            | `boolean`                                                                 | `true`                       |
| `delBgColor`       | 删除按钮背景色                                                                                                | `string`                                                                  | 主题错误色                   |
| `delIcon`          | 删除按钮图标名称                                                                                              | `string`                                                                  | `close`                      |
| `delColor`         | 删除按钮图标颜色                                                                                              | `string`                                                                  | `#fff`                       |
| `imageMode`        | 预览图片裁剪与缩放模式                                                                                        | `ImageMode`                                                               | `aspectFill`                 |
| `customBtn`        | 是否自定义选择按钮，`true` 时使用 `addBtn` 插槽                                                               | `boolean`                                                                 | `false`                      |
| `uploadText`       | 选择按钮提示文字，留空时按 `accept` 自动生成                                                                  | `string`                                                                  | `''`                         |
| `action`           | 服务器上传地址                                                                                                | `string`                                                                  | `''`                         |
| `timeout`          | 上传超时时间，单位毫秒                                                                                        | `number`                                                                  | `60000`                      |
| `disabled`         | 是否禁用组件                                                                                                  | `boolean`                                                                 | `false`                      |
| `index`            | 各回调事件的最后一个参数，用于区分组件实例                                                                    | `string \| number`                                                        | `''`                         |
| `header`           | 上传请求头                                                                                                    | `Record<string, unknown>`                                                 | `{}`                         |
| `formData`         | 上传附加表单参数                                                                                              | `Record<string, unknown>`                                                 | `{}`                         |
| `name`             | 上传文件字段名，供后端获取                                                                                    | `string`                                                                  | `file`                       |
| `sizeType`         | 图片尺寸策略，可选值 `original`（原图）/ `compressed`（压缩图）                                               | `Array<'original' \| 'compressed'>`                                       | `['original', 'compressed']` |
| `sourceType`       | 图片或视频来源，可选值 `album`（相册）/ `camera`（相机）                                                      | `Array<'album' \| 'camera'>`                                              | `['album', 'camera']`        |
| `previewFullImage` | 是否可通过 `uni.previewImage` 预览图片                                                                        | `boolean`                                                                 | `true`                       |
| `previewFile`      | 是否可预览非图片文件                                                                                          | `boolean`                                                                 | `true`                       |
| `multiple`         | 是否开启文件多选                                                                                              | `boolean`                                                                 | `true`                       |
| `maxSize`          | 单个文件最大字节数                                                                                            | `number \| string`                                                        | `Number.MAX_VALUE`           |
| `modelValue`       | 文件列表，支持 `v-model`                                                                                      | `UploadFileItem[]`                                                        | `[]`                         |
| `limitType`        | 允许的文件后缀，优先级高于 `accept` 内置格式限制                                                              | `string[]`                                                                | `[]`                         |
| `autoUpload`       | 选择完是否自动上传                                                                                            | `boolean`                                                                 | `true`                       |
| `showTips`         | 是否自动 toast 提示                                                                                           | `boolean`                                                                 | `true`                       |
| `showConfirm`      | 删除前是否显示确认弹窗                                                                                        | `boolean`                                                                 | `true`                       |
| `beforeUpload`     | 上传前钩子，返回 `false` 或 Promise 拒绝则跳过该文件                                                          | `(index: number, files: UploadFileItem[]) => boolean \| Promise<unknown>` | -                            |
| `beforeRemove`     | 删除前钩子，返回 `false` 或 Promise 拒绝则阻止删除                                                            | `(index: number, files: UploadFileItem[]) => boolean \| Promise<unknown>` | -                            |
| `toJson`           | 返回值为 JSON 字符串时自动转为对象                                                                            | `boolean`                                                                 | `true`                       |
| `accept`           | 接受的文件类别，可选值 `image`（图片）/ `video`（视频）/ `file`（文件）/ `media`（图片或视频）/ `all`（全部） | `UploadAcceptType`                                                        | `image`                      |
| `showFileName`     | 是否显示文件名                                                                                                | `boolean`                                                                 | `true`                       |
| `showFileSize`     | 是否显示文件大小                                                                                              | `boolean`                                                                 | `false`                      |
| `fileIconMap`      | 文件类型图标映射                                                                                              | `Record<string, { name: string; color?: string }>`                        | `{}`                         |
| `compressed`       | 选择视频时是否压缩                                                                                            | `boolean`                                                                 | `true`                       |
| `maxDuration`      | 选择视频时拍摄最长时长，单位秒                                                                                | `number`                                                                  | `60`                         |
| `camera`           | 选择视频时摄像头方向，可选值 `front`（前置）/ `back`（后置）                                                  | `'front' \| 'back'`                                                       | `back`                       |
| `extension`        | 选择文件的扩展名过滤，仅 H5 与微信 `accept='file'` 有效                                                       | `string[]`                                                                | `[]`                         |
| `imageShape`       | 图片/图标形状，可选值 `square`（方形）/ `circle`（圆形）                                                      | `'square' \| 'circle'`                                                    | `square`                     |
| `customChoose`     | 自定义文件选择，开启后点击触发 `on-choose` 而不调用默认 API                                                   | `boolean`                                                                 | `false`                      |
| `uploadRequest`    | 自定义上传适配器（OSS 等），优先于 `action`                                                                   | `UploadRequest`                                                           | -                            |
| `successStatus`    | `action` 模式下判定上传成功的响应状态码                                                                       | `number \| number[]`                                                      | `[200, 201, 204]`            |
| `beforeChoose`     | 选择文件前钩子，返回 `false` 或 Promise 拒绝则中止本次选择                                                    | `(files: UploadFileItem[]) => boolean \| Promise<boolean>`                | -                            |
| `beforePreview`    | 预览文件前钩子，返回 `false` 或 Promise 拒绝则跳过预览                                                        | `(item, index, files) => boolean \| Promise<boolean>`                     | -                            |

### Events

| 事件名               | 说明                               | 参数                                    |
| -------------------- | ---------------------------------- | --------------------------------------- |
| `update:modelValue`  | 文件列表更新，支持 `v-model`       | `files`                                 |
| `on-list-change`     | 文件列表发生变化                   | `files, index`                          |
| `on-oversize`        | 文件超过 `maxSize`                 | `file, files, index`                    |
| `on-exceed`          | 数量超过 `maxCount`                | `file, files, index`                    |
| `on-choose`          | 启用 `customChoose` 时点击选择触发 | `{ accept, maxCount, fileList, index }` |
| `on-choose-complete` | 每次文件选择完成后                 | `files, index`                          |
| `on-choose-fail`     | 文件选择失败                       | `error`                                 |
| `on-uploaded`        | 全部文件上传完毕                   | `files, index`                          |
| `on-success`         | 单个文件上传成功                   | `data, fileIndex, files, index`         |
| `on-error`           | 单个文件上传失败                   | `error, fileIndex, files, index`        |
| `on-change`          | 单个文件上传状态改变（无论成败）   | `response, fileIndex, files, index`     |
| `on-progress`        | 上传进度变化                       | `progress, fileIndex, files, index`     |
| `on-remove`          | 移除文件时                         | `fileIndex, files, index`               |
| `on-preview`         | 预览文件时                         | `url, files, index`                     |
| `chooseStart`        | 开始选择文件时                     | -                                       |
| `chooseComplete`     | 选择文件结束时                     | -                                       |

### Slots

| 插槽名   | 说明                               | 参数          |
| -------- | ---------------------------------- | ------------- |
| 默认     | 组件内容（默认渲染文件列表与按钮） | -             |
| `addBtn` | 自定义选择文件按钮                 | -             |
| `file`   | 自定义文件列表                     | `file: files` |

### Methods

| 方法                       | 说明                         |
| -------------------------- | ---------------------------- |
| `lists`                    | 当前内部文件列表（暴露属性） |
| `upload()`                 | 上传全部待上传文件           |
| `abort(index?)`            | 取消指定或全部正在上传的文件 |
| `retry(index)`             | 重试指定文件                 |
| `reUpload(index?)`         | 重传指定文件或失败队列       |
| `addFiles(files)`          | 添加外部选择的文件           |
| `deleteItem(index)`        | 按确认和钩子规则删除文件     |
| `remove(index)`            | 直接移除指定文件             |
| `selectFile()`             | 打开文件选择器               |
| `clear()`                  | 清空列表                     |
| `previewImage(url)`        | 预览图片                     |
| `previewFile(item, index)` | 预览/打开文件                |

## 类型定义

```ts
import type {
    UploadProps,
    UploadFileItem,
    UploadRequest,
    UploadRequestResult,
    UploadExpose
} from '@puresnake/snake-ui';
```

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
