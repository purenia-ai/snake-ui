# Snake Upload 与 OSS 上传适配器设计

## 目标

在 Snake UI 中新增正式的 `snake-upload` 组件。组件以本地 uView Pro 的 `u-upload` 为行为基线，同时支持普通接口上传和 OSS 等自定义上传流程，并为 `r2nd-joker` 现有本地上传组件提供平滑迁移路径。

本阶段只实现 Snake UI 组件，不删除或切换 `r2nd-joker/src/components/snake-upload`。业务项目迁移应在组件验证完成后单独进行。

## 设计原则

- 文件选择、预览、队列、进度、失败与重试由组件统一管理。
- 云存储鉴权、STS 获取、签名、对象路径和 CDN 地址属于业务逻辑，不进入 UI 组件。
- 默认行为与本地 uView Pro `u-upload` 保持一致。
- OSS、腾讯云、七牛或业务接口统一通过上传适配器接入，不增加厂商专属属性。
- 兼容 `r2nd-joker` 旧版 `snake-upload` 的关键接口，降低迁移风险。

## 组件结构

新增目录：

```text
src/uni_modules/snake-ui/components/snake-upload/
  snake-upload.vue
  types.ts
```

`snake-upload.vue` 负责视图、文件选择、上传队列和交互状态；`types.ts` 负责 props、事件、文件模型、上传适配器参数和暴露方法的公共类型。

组件还需接入 Snake UI 的统一导出、文档、演示页和组件契约测试。

## 上传方式

### 默认 action 上传

未传 `uploadRequest` 时，组件沿用 uView Pro 行为，通过以下配置调用 `uni.uploadFile`：

- `action`
- `name`
- `header`
- `formData`
- `timeout`

组件监听上传任务进度，并更新当前文件的 `progress`、`status`、`message` 和 `response`。

### 自定义 uploadRequest 上传

传入 `uploadRequest` 后，自定义适配器优先于 `action`。组件不会自行获取 OSS 凭证，也不会在自定义适配器之外再次调用 `uni.uploadFile`。

适配器契约：

```ts
type SnakeUploadRequest = (
  file: SnakeUploadFile,
  context: SnakeUploadRequestContext,
) => Promise<SnakeUploadRequestResult | string>;
```

上下文包含：

- `index`：当前文件索引。
- `files`：当前文件列表的只读语义快照。
- `name`：上传字段名。
- `header`、`formData`、`action`：调用方传入的通用配置，方便适配器复用。
- `onProgress(percent)`：将 OSS 上传进度同步回组件，组件负责把数值限制在 0 到 100。

成功结果允许两种形式：

- 字符串：直接视为最终文件 URL。
- 对象：必须提供 `url`，可附带 `response`、`name` 等可合并元数据。

适配器 resolve 后，组件将文件标记为 `success`、进度设为 100，并触发成功及列表变更事件。适配器 reject 或抛错后，组件保留文件并标记为 `failed`，保存可展示的错误信息，继续处理队列中的下一项。

## 文件与队列状态

文件至少包含以下字段：

- `url`：本地临时路径或上传后的远程地址。
- `name`、`size`、`fileType`。
- `status`：`ready | uploading | success | failed`。
- `progress`：0 到 100。
- `message`、`response`、`error`。

选择文件后先进入 `ready`。`autoUpload=true` 时自动进入上传队列；否则由调用方执行 `upload()`。上传按 uView Pro 的顺序队列处理，单个文件失败不阻断后续文件。

`reUpload(index)` 仅重置并重新上传指定文件。删除正在上传的文件时，若底层存在可中止任务则终止任务；自定义 Promise 本身无法强制取消，组件忽略已删除文件的迟到结果。

## API 与兼容性

主体 API 与本地 uView Pro 保持一致，包括但不限于：

- `v-model` / `modelValue` 与兼容的 `fileList`。
- `action`、`autoUpload`、`beforeUpload`、`beforeRemove`。
- `accept`、`multiple`、`maxCount`、`maxSize`、`limitType`。
- `mode`、`showUploadList`、`customBtn`、`customChoose`。
- `upload()`、`reUpload(index)`、`addFiles(files)`、`deleteItem(index)`、`clear()`。
- 选择、进度、成功、失败、删除和列表变化事件。

新增公共属性 `uploadRequest`，其优先级高于 `action`。

为迁移 joker 保留以下兼容接口：

- `isCustomUpload=true` 时，点击选择区域发出 `customUpload`，不调用默认选择器。
- `customUpload` 参数继续提供 `chooseFile` 和剩余可选数量等信息。
- 暴露 `onBeforeRead(file)`，允许旧页面将自行选择或裁剪后的文件送回组件流程。
- 保留旧事件 `afterRead`、`beforeRead`、`oversize`、`delete`、`clickPreview` 的载荷语义。

若新旧属性同时出现，新版 `customChoose` 优先于兼容属性 `isCustomUpload`；`uploadRequest` 只接管上传请求，不改变文件选择行为。

## OSS 使用方式

业务端通过 `uploadRequest` 获取 STS 或上传策略，并完成 OSS 直传：

```ts
async function uploadToOss(file, { onProgress }) {
  const policy = await getUploadPolicy(file);
  const result = await uploadOssFile(file.url, policy, onProgress);

  return {
    url: result.cdnUrl,
    response: result,
  };
}
```

模板只需传入适配器：

```vue
<snake-upload v-model="files" :upload-request="uploadToOss" />
```

凭证不得写入 Snake UI，也不得由组件持久化。

## 错误处理

- 缺少 `action` 且未传 `uploadRequest`：当前文件标记失败，并给出明确错误。
- 自定义适配器未返回 URL：视为契约错误并标记失败。
- 选取超量、文件过大、扩展名不允许：沿用 uView Pro 提示和事件。
- `beforeUpload` 返回 `false` 或 Promise reject：跳过当前文件并继续队列，不发起请求。
- 上传失败保留文件，调用方可以删除或重试。
- 文件被删除或组件卸载后的异步回调不得重新写入列表。

## 验证范围

自动验证覆盖：

- action 上传和 `uploadRequest` 的优先级。
- 自定义适配器成功、失败、无 URL、进度更新和队列续传。
- 手动上传、重试、删除与迟到结果保护。
- uView Pro 关键 props、事件和暴露方法契约。
- joker 旧版 `isCustomUpload/customUpload/onBeforeRead` 兼容契约。
- 文档和演示页结构。
- TypeScript、lint、相关测试和 H5 构建。

遵循用户既有要求，不执行微信小程序构建。

## 非目标

- 不在 Snake UI 内置阿里云 OSS SDK、签名算法或凭证接口。
- 不在本阶段删除 joker 本地上传组件或修改 joker Easycom 解析。
- 不承诺跨平台中止任意自定义 Promise；仅保证忽略失效结果。
- 不引入并发上传、分片上传、断点续传或图片裁剪器。
