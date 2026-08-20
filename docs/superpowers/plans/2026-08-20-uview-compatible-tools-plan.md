# Snake UI 工具层 uView Pro 兼容实施计划

关联规格：`docs/superpowers/specs/2026-08-20-uview-compatible-tools-design.md`

## 目标

在不破坏 `navTo()` 及现有组件行为、不新增依赖的前提下，提供兼容 uView Pro 调用方式的强类型 `route()`，修复时间工具，并补齐公开入口、测试和文档。

## 实施顺序

### 1. 先补失败测试，固定兼容契约

修改 `scripts/foundation.test.mjs`：

- 扩充测试用 `uni` mock，记录 `navigateTo`、`redirectTo`、`switchTab`、`reLaunch`、`navigateBack` 的参数。
- 验证 `route('/pages/detail', { id: 1 })` 走 `navigateTo`。
- 验证 uView Pro 路由别名映射。
- 验证已有 query、hash、特殊字符、布尔值、数字和数组参数。
- 验证 `switchTab` 忽略 params。
- 验证 `navigateBack` 默认及自定义 `delta`。
- 验证缺失 URL、未知类型与平台 API 缺失时 Promise 拒绝。
- 验证 `navTo()` 的 `navigateTo` 失败后降级 `switchTab` 行为不变。
- 验证 `getQueryParams()` 解码 `%`、`+` 和空值。
- 验证 `timeFrom()` 的秒级、毫秒级、`Date`、无效值、未来值和超过 30 天场景。

先运行：

```powershell
npm run test:foundation
```

预期：新增测试因 `route()` 尚不存在及时间行为不完整而失败。

### 2. 实现路由类型和 URL 参数辅助函数

修改 `src/uni_modules/snake-ui/libs/platform.ts`：

- 定义并导出 `SnakeRouteType`、`SnakeRouteParamValue`、`SnakeRouteParams`、`SnakeRouteOptions`。
- 新增内部路由类型归一化函数，将 uView Pro 别名映射到 uni-app API 名称。
- 新增 URL 参数序列化与 hash 安全追加函数。
- 保留 `getQueryParams()` 的 `Record<string, string>` 返回类型，并加强缺失值与解码处理。
- 不修改 `navTo()` 的签名和降级策略。

实现时避免使用浏览器专属 `URL`/`URLSearchParams`，确保各小程序运行时一致。

### 3. 实现 Promise 形式的 route()

继续修改 `src/uni_modules/snake-ui/libs/platform.ts`：

- 增加字符串和对象形式的 TypeScript 重载。
- 前进类导航校验非空 URL。
- `navigateBack` 生成带默认 `delta: 1` 的参数。
- `switchTab` 不把 params 写入 URL。
- 将 uni-app 回调包装为 `Promise<void>`。
- 平台方法不存在时返回带 `[Snake UI]` 前缀的明确错误。
- 仅向支持选项的导航 API 传递动画字段。

再次运行 `npm run test:foundation`，确保路由测试通过。

### 4. 修复并强化时间处理

修改 `src/uni_modules/snake-ui/libs/functions/index.ts`：

- 将 `timeFrom()` 中乱码文本修复为 UTF-8 中文。
- 增加私有时间归一化函数，区分秒级与毫秒级数字时间戳。
- 保持未来时间映射为“刚刚”。
- 保持超过 30 天回退到 `formatTime(value, 'yyyy-mm-dd')`，但使用归一化后的日期，避免秒级时间戳格式错误。
- 保持无效输入返回空字符串。

运行 `npm run test:foundation` 验证时间与既有 foundation 测试。

### 5. 接通所有公开入口

修改以下文件：

- `src/uni_modules/snake-ui/libs/functions/index.ts`：重新导出 `route` 及路由类型，移除当前 `route = navTo` 别名。
- `src/uni_modules/snake-ui/libs/hooks/index.ts`：`useSnakeRouter()` 返回新的 `route`，并额外保留 `navTo` 便于显式选择旧行为。
- `src/uni_modules/snake-ui/libs/runtime.ts`：把 `route`、`queryParams`、`timeFormat`、`timeFrom` 和已公开通用函数补入 `snake` 对象，使 `uni.$snake` 与按需导入的核心工具一致。

检查 `src/uni_modules/snake-ui/index.ts` 与 `index.d.ts` 的星号导出能够传播新类型；只有类型检查表明手写声明缺失时才做最小补充。

运行：

```powershell
npm run type-check
npm run test:runtime
npm run test:foundation
```

### 6. 编写工具文档并接入导航

新增 `docs/guide/tools.md`：

- 工具总览与按需导入示例。
- `route()` 字符串简写、对象形式、别名表和 Promise 错误处理。
- `navTo()` 与 `route()` 的区别。
- 查询参数编码、数组、hash 与 `switchTab` 限制。
- `formatTime()`、`timeFormat` 和 `timeFrom()` 示例。
- `uni.$snake` 迁移示例和平台边界。

修改：

- `docs/.vitepress/config.mts`：在指南侧边栏增加“工具”入口。
- `docs/guide/foundation.md`：将工具段落链接到工具专页。
- `docs/guide/migrate-from-uview.md`：增加 `uni.$u.route` 到 `route()` 的迁移示例。

只修正本次触及行的乱码或格式问题，不扩大为全站编码整理。

### 7. 完整验证与变更审查

依次运行：

```powershell
npm run test:foundation
npm run test:runtime
npm run type-check
npm run lint
npm run docs:build
git diff --check
```

最后人工检查：

- `git diff --stat` 只包含规格内文件。
- `navTo()` 调用点不需要迁移。
- 没有新增依赖或锁文件变化。
- 文档示例与实际类型签名一致。
- 所有未通过检查都有明确记录，不以未运行的检查宣称成功。

