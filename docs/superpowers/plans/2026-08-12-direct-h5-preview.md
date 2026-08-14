# Snake UI 直接 H5 预览实施计划

## 目标

移除 H5 示例中的装饰性 `DemoShell`，让 20 个组件示例直接占满 iframe 并自然滚动，同时保持现有 frontmatter、hash 路由、开发端口和生产 `/preview/` 构建流程不变。

## 实施原则

- 只修改 demo 应用及必要的验证代码，不调整 Snake UI 公共组件。
- 不新增依赖，不增加 `postMessage`。
- 普通流组件允许少量安全内边距；依赖视口定位的组件不使用可能影响定位或裁切的包装层。
- 每完成一个结构性步骤先做最相关验证，再扩大到完整构建。

## 任务 1：建立预览结构回归检查

涉及文件：

- 新增 `scripts/preview-structure.test.mjs`
- 修改根 `package.json`

步骤：

1. 编写 Node 测试，读取 `DemoRenderer.vue` 并断言不再导入或渲染 `DemoShell`。
2. 断言示例根容器不包含 `overflow: hidden`、固定高度、负边距或缩放。
3. 统计 `src/pages.json` 中的 20 个 `pages/examples/` 路由及 `docs/components/*.md` 中的 20 个 `preview:` 声明，保证一一对应。
4. 在根 `package.json` 添加 `test:preview-structure` 命令。
5. 先运行测试，确认它会因当前 `DemoShell` 结构失败。

## 任务 2：让 DemoRenderer 直接渲染真实组件

涉及文件：

- 修改 `src/demo/DemoRenderer.vue`

步骤：

1. 移除 `DemoShell` 导入和模板包裹。
2. 增加一个仅负责页面布局的根 `view`，宽度 `100%`、最小高度 `100vh`、`box-sizing: border-box`。
3. 用计算属性区分视口型组件与普通流组件。
4. 视口型组件至少包含：`snake-cms`、`filter-sorts`、`page-popup`、`suspension`。
5. 普通流组件使用克制的安全内边距；视口型组件不增加会影响 fixed、sticky 或遮罩的内边距与裁切。
6. 保留现有 fixture、事件状态和组件选择逻辑，不改变组件 props。
7. 确保根容器不设置 `overflow: hidden`、固定高度、transform 或 scale。
8. 运行 `pnpm run test:preview-structure` 与 `pnpm run type-check`。

## 任务 3：删除失效的 DemoShell

涉及文件：

- 删除 `src/demo/DemoShell.vue`

步骤：

1. 使用 `rg` 确认仓库中没有其他 `DemoShell` 引用。
2. 删除文件。
3. 运行 `pnpm run type-check` 和 `pnpm run build:h5`。

## 任务 4：检查 iframe 内滚动与视口样式

涉及文件：

- 原则上不修改 `docs/.vitepress/theme/PreviewFrame.vue`
- 仅在浏览器验证证明必要时，最小修改 `docs/.vitepress/theme/custom.css`

步骤：

1. 确认 iframe 仍为 `width: 100%`、`height: 100%`。
2. 确认手机框负责外层圆角，H5 示例根容器不负责裁切。
3. 检查是否存在阻止 iframe 内部纵向滚动的 CSS。
4. 不加入动态 iframe 高度和父子窗口通信。
5. 若 CSS 无问题，不修改 VitePress 主题文件。

## 任务 5：完整构建验证

按顺序运行：

1. `pnpm run test:runtime`
2. `pnpm run test:preview-structure`
3. `pnpm run type-check`
4. `pnpm run build:h5`
5. `pnpm run docs:build:preview`
6. 检查 `docs/.vitepress/dist/preview/index.html` 存在。
7. 再次统计 20 个公开组件、20 个预览路由和 20 个 frontmatter。

## 任务 6：浏览器验收

启动生产预览或双开发服务后检查：

1. `notice`：顶部直接出现组件内容，没有 Snake UI 装饰性大标题。
2. `goods-list`：iframe 内可滚动到最后一个商品。
3. `filter-sorts`：打开筛选后面板与遮罩不被根容器裁切。
4. `page-popup`：遮罩覆盖完整 H5 视口。
5. `suspension`：悬浮入口相对 H5 视口定位。
6. `snake-cms`：组合组件内容可以自然增长并滚动。
7. 依次打开全部 20 个预览路由，确认页面可加载且项目控制台无错误。
8. 在 VitePress 中切换两个组件页，确认 iframe `src` 与内容同步更新。
9. 用窄屏断点确认“在新窗口打开实时预览”链接正确。

浏览器验证发现 fixture 缺字段时，只修正 `src/demo/fixtures.ts` 或 `src/demo/mock-adapters.ts`，不通过隐藏内容绕过错误。

## 完成标准

- 20 个预览页均直接显示真实组件。
- H5 页面能够在固定手机 iframe 内自然滚动。
- 视口型组件没有被外层容器裁切。
- 没有新增依赖和跨窗口通信代码。
- 所有自动检查、H5 构建、文档整站构建和浏览器验收通过。
