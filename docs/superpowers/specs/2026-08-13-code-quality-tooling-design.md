# Snake UI 代码质量工具链设计

## 目标

参考 uView-Pro 的 Prettier 和编辑器约定，为 Snake UI 建立可实际运行的 Vue 3、TypeScript、Node.js 代码检查与格式校验工具链。

本次只建立本地命令和配置，不接入 Husky、lint-staged、commitlint 或 CI，不自动格式化整个仓库。

## 参考项目结论

uView-Pro 当前包含 `.prettierrc.js`、`.prettierignore`、`.editorconfig`、`.lintstagedrc`、`.eslintignore` 和 commitlint 配置。其 `package.json` 安装了 Prettier，但没有 ESLint、Vue ESLint 插件或可执行的 ESLint 配置。因此 Snake UI 只复用其格式偏好，不复制无效的 ESLint 外壳。

## 配置文件

### Prettier

新增 `.prettierrc.cjs`，采用与参考项目一致的核心规则：

- 单引号；
- 语句分号；
- 行宽 120；
- 4 空格缩进；
- 不使用尾逗号；
- Vue 的 `script` 和 `style` 不额外缩进；
- Markdown 保留作者换行；
- 行尾使用 `auto`，兼容当前 Windows 开发环境。

新增 `.prettierignore`，排除依赖、锁文件、构建产物、缓存、日志和生成目录。文档 Markdown 不全局排除，使 `format:check` 能覆盖新文档；已有不规范文件只作为检查结果报告，不在本次批量改写。

### EditorConfig

新增 `.editorconfig`，使用 UTF-8、最终换行和 4 空格。YAML、JSON、Markdown 可以按文件类型覆盖为 2 空格，避免锁文件与生态配置出现不自然缩进。生成文件继续由忽略配置排除。

### ESLint

新增 `eslint.config.mjs`，使用 ESLint Flat Config，并组合：

- `@eslint/js` 推荐规则；
- `typescript-eslint` 推荐规则；
- `eslint-plugin-vue` 的 Vue 3 flat recommended 规则；
- `eslint-config-prettier` 关闭与 Prettier 冲突的格式规则；
- `globals` 提供 browser、Node 和 uni-app 常用运行时全局变量。

检查范围覆盖 `.js`、`.cjs`、`.mjs`、`.ts` 和 `.vue`。构建输出、依赖、缓存、VitePress 输出及 uni-app 生成目录统一忽略。类型安全由现有 `vue-tsc --noEmit` 负责，ESLint 首期不启用依赖完整 TypeScript Program 的类型感知规则，以降低跨端项目配置复杂度。

对当前遗留代码可能产生大量噪音、但不会提高首期正确性的规则，会在配置中有限关闭，例如组件单词数量、显式 `any`、未使用参数前缀等；不会通过全局关闭推荐规则来掩盖真实错误。

## 依赖与脚本

使用仓库现有的 pnpm 锁文件管理以下开发依赖，并选择相互兼容的稳定版本：

- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-vue`
- `eslint-config-prettier`
- `globals`
- `prettier`

在根 `package.json` 新增：

```json
{
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
}
```

不修改现有构建、测试和文档命令。

## 实施与验证

1. 添加配置、依赖和脚本，并通过 pnpm 更新锁文件。
2. 运行 `lint`，优先修正规则配置中的环境误报，再处理小范围真实错误。
3. 运行 `format:check`，记录历史文件的格式差异；不因首次接入而批量执行 `format`。
4. 运行现有 `type-check`，确认工具链没有影响 Vue 和 uni-app 类型检查。
5. 运行最相关的组件契约测试，确认配置文件和依赖变更没有影响组件包结构。

成功标准是 `lint` 和 `type-check` 通过。`format:check` 若发现既有文件不符合新格式，会如实报告并作为后续独立格式化任务，不在本次制造大面积代码差异。

## 非目标

- 不启用提交钩子；
- 不限制提交信息格式；
- 不修改 CI；
- 不批量格式化现有源码；
- 不升级 uni-app、Vue、TypeScript 或 Vite；
- 不复制 uView-Pro 与 Snake UI 无关的忽略项或发布脚本。
