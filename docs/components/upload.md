---
preview: /pages/componentsA/upload/index
---

# Upload 文件上传

用于选择、预览和上传图片、视频或文件。组件对齐本地 uView Pro `u-upload`，支持普通接口上传与 OSS 等自定义上传。

## 普通上传

```vue
<snake-upload v-model="files" action="https://example.com/upload" />
```

组件通过 `uni.uploadFile` 上传，支持 `header`、`formData`、`name`、`timeout`、进度、失败重试和手动上传。

## OSS 自定义上传

OSS 凭证和签名由业务端处理，组件只负责文件队列与状态：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { SnakeUploadFileItem, SnakeUploadRequest } from '@/uni_modules/snake-ui';

const files = ref<SnakeUploadFileItem[]>([]);

const uploadToOss: SnakeUploadRequest = async (file, { onProgress }) => {
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

## 主要 Props

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `modelValue` | 文件列表，支持 `v-model` | `[]` |
| `action` | 默认上传地址 | `''` |
| `uploadRequest` | 自定义上传适配器，优先于 `action` | - |
| `accept` | `image / video / file / media / all` | `image` |
| `mode` | `grid / list` | `grid` |
| `autoUpload` | 选择后自动上传 | `true` |
| `maxCount` | 最大文件数量 | `52` |
| `maxSize` | 单个文件最大字节数 | 不限制 |
| `customChoose` | 由外部完成文件选择 | `false` |

## Methods

| 方法 | 说明 |
| --- | --- |
| `upload()` | 上传全部待上传文件 |
| `retry(index)` | 重试指定文件 |
| `reUpload(index?)` | 重传指定文件或失败队列 |
| `addFiles(files)` | 添加外部选择的文件 |
| `deleteItem(index)` | 按确认和钩子规则删除文件 |
| `clear()` | 清空列表 |

## 旧版兼容

迁移 `r2nd-joker` 时仍可使用 `isCustomUpload`、`@customUpload` 和 `onBeforeRead(file)`。新代码推荐使用 `customChoose/@on-choose/addFiles` 处理自定义选择，使用 `uploadRequest` 处理 OSS 上传。
