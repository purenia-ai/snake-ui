# Snake UI 工具层 uView Pro 兼容设计

## 背景

Snake UI 已经提供防抖、节流、深拷贝、深合并、时间格式化、查询参数、路由、节点尺寸、Toast、HTTP 与组合式函数等工具能力，但目前这些能力分散在 `libs/functions`、`libs/platform`、`libs/hooks` 和 `libs/request` 中。现有路由入口 `navTo()` 只支持基础页面跳转，无法直接承接 uView Pro 项目常用的 `route()` 调用方式。

本次工作将现有能力整理为可公开使用的工具层，并优先补齐迁移价值最高的路由、查询参数和时间能力。目标是降低从 uView Pro 迁移到 Snake UI 的成本，同时保留 Snake UI 的 TypeScript 类型约束和现有 API 兼容性。

## 范围

第一版包含：

- 新增强类型 `route()`，兼容 uView Pro 的字符串简写与对象调用方式。
- 保留现有 `navTo()` 的名称、参数与返回类型，避免影响已有组件和业务代码。
- 为路由参数提供稳定的 URL 编码和追加规则。
- 修复 `timeFrom()` 中文文本乱码，并同时识别秒级与毫秒级时间戳。
- 补充工具层文档，明确按需导入与 `uni.$snake` 两种入口的定位。
- 为路由、查询参数与时间工具补充自动化测试。

第一版不包含：

- MD5 或其他密码学能力。
- 对所有现有工具文件进行目录级重构。
- 修改组件行为或 CMS 导航策略。
- 新增第三方依赖。

## API 设计

### route

公开 API 接受两种调用方式：

```ts
route('/pages/goods/detail', { id: 1 });

route({
    type: 'redirectTo',
    url: '/pages/goods/detail',
    params: { id: 1 }
});
```

对象形式支持以下 `type`：

| 输入值 | 对应 uni-app API |
| --- | --- |
| `navigateTo`、`to` | `uni.navigateTo` |
| `redirect`、`redirectTo` | `uni.redirectTo` |
| `switchTab`、`tab` | `uni.switchTab` |
| `reLaunch` | `uni.reLaunch` |
| `navigateBack`、`back` | `uni.navigateBack` |

对象参数还支持：

- `url`：前进类导航的目标地址。
- `params`：追加到 URL 的普通键值参数。
- `delta`：返回层数，默认 `1`。
- `animationType`：仅在支持该能力的平台上传递。
- `animationDuration`：仅在支持该能力的平台上传递。

`route()` 返回 `Promise<void>`。uni-app 导航失败时 Promise 拒绝，以便调用方显式处理错误。缺失必需 URL、无效导航类型或不合法参数会在调用 uni-app API 前拒绝，并返回带有 Snake UI 上下文的错误。

### navTo

`navTo(url?: string): void` 保持现有公共契约。它继续执行普通页面跳转，并在 `navigateTo` 失败时尝试 `switchTab`，从而维持当前组件行为。实现可复用新的参数构造辅助函数，但本次不改变其同步签名和错误处理方式。

### 查询参数

内部提供单一 URL 参数序列化逻辑，供 `route()` 使用。规则如下：

- 键和值均通过 `encodeURIComponent` 编码。
- `null` 与 `undefined` 参数不写入 URL。
- 字符串、数字和布尔值转换为字符串。
- 数组按重复键输出，例如 `tag=a&tag=b`。
- 已有 query 时使用 `&` 追加，并保留 hash 在 URL 末尾。
- `switchTab` 不携带 `params`，因为不同 uni-app 目标平台对此行为不一致；传入时直接忽略，并在开发调试模式下保留可诊断信息。

现有 `getQueryParams()` 与 `queryParams` 继续负责 URL 解析。解析规则与序列化规则保持对称：重复键为了兼容现有返回类型，仍保留最后一个值。

### 时间工具

`formatTime()` 和 `timeFormat` 保持现有格式令牌。`timeFrom()` 修复中文输出，并按以下规则归一化输入：

- `Date` 直接读取毫秒值。
- 纯数字或纯数字字符串小于 `1e12` 时按秒级时间戳处理，否则按毫秒处理。
- 其他字符串交给 `Date` 解析。
- 无效时间返回空字符串。
- 未来时间按“刚刚”处理，保持现有非负差值语义。

相对时间文本为“刚刚”“N分钟前”“N小时前”“N天前”；超过 30 天时返回 `yyyy-mm-dd`。

## 模块边界与公开入口

- `libs/platform.ts`：承载依赖 `uni` 的导航、节点、系统与提示能力。
- `libs/functions/index.ts`：承载纯函数并重新导出平台工具的兼容入口。
- `libs/hooks/index.ts`：`useSnakeRouter()` 暴露新的 `route()`，同时保留现有组合式调用形态。
- `libs/runtime.ts`：将兼容工具安装到 `$snake` 与 `uni.$snake`。
- 包根入口继续通过 `export * from './libs'` 提供按需导入，不新增第二套包入口。

推荐使用按需导入，以获得明确类型和更直接的依赖分析；`uni.$snake` 用于 Options API、模板环境和旧项目迁移。

## 错误处理与兼容性

- 不改变已有 `navTo()` 调用方的行为。
- 新 `route()` 不做静默降级，失败通过 Promise 交给调用方。
- `navigateBack` 不要求 URL，其他导航类型必须提供非空 URL。
- 调用平台不存在的 uni-app 方法时，返回明确错误而不是抛出模糊的 `TypeError`。
- H5 外链仍由现有 `navTo()` 处理；`route()` 第一版只负责 uni-app 页面路由，避免把 web-view 策略隐式写入公共工具。

## 文档设计

新增“工具”指南页，至少包含：

- 工具能力总览与导入方式。
- `route()` 两种兼容调用形式和支持的导航类型。
- `navTo()` 与 `route()` 的选择建议。
- 查询参数编码规则和 `switchTab` 限制。
- 时间格式化与相对时间示例。
- 平台差异、错误处理和迁移说明。

现有“全局配置与底座”和“从 uView 迁移”文档只增加入口链接，不重复完整 API 内容。

## 测试与验收

自动化测试覆盖：

- 每一种路由别名调用正确的 uni-app API。
- 字符串简写、对象形式、已有 query、hash、特殊字符和数组参数。
- `navigateBack` 的默认与自定义 `delta`。
- 缺失 URL、未知类型和平台 API 不存在时的拒绝行为。
- `navTo()` 现有的 `navigateTo` 到 `switchTab` 降级行为不变。
- `getQueryParams()` 对编码内容、加号和空值的解析。
- `timeFrom()` 对秒级时间戳、毫秒级时间戳、Date、无效时间和未来时间的处理。
- `formatTime()` 的既有格式保持不变。

完成标准：相关测试、TypeScript 类型检查和文档构建通过；不新增依赖，不改变无关组件文件。

