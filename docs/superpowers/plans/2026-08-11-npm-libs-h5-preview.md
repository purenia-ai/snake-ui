# Snake UI npm、libs 与 H5 预览实施计划

## 阶段一：npm 契约与运行时

1. 扩展模块 `package.json` 的版本、types、exports、peerDependencies 和发布文件边界。
2. 新增 `types`、`libs/runtime.ts`、request/cache/config 适配器和聚合入口。
3. 将根 `index.ts` 改为 Vue 插件入口，同时保留组件与 libs 具名导出。
4. 把 7 处宿主绝对导入替换为 libs 稳定接口，并为缺失适配器提供描述性错误。
5. 增加 runtime 单元测试与 npm pack 文件审计脚本。

## 阶段二：组件运行完整性

1. 根据现有调用点实现五个最小内部支撑组件。
2. 为内部支撑组件增加明确 props、events 与 provide/inject 类型。
3. 用 H5 构建和类型检查确认公开组件不再依赖仓库外源码。

## 阶段三：真实 H5 示例

1. 安装根演示工程所需的 npm 版 uView Pro，并配置主入口与全局样式。
2. 新增共享 DemoShell、fixtures 和纯本地 mock adapters。
3. 新增 20 个独立预览页面与 pages.json 路由。
4. 验证所有页面进入 H5 构建，交互型示例不访问外网。

## 阶段四：VitePress iframe

1. 为 20 篇组件文档添加 preview frontmatter。
2. 实现 PreviewFrame 和自定义 Layout，桌面显示 sticky 手机框，窄屏显示独立打开入口。
3. 增加加载、错误、刷新和新窗口打开状态。
4. 增加联合开发脚本与生产产物合并脚本。

## 阶段五：验证

1. runtime 单元测试、vue-tsc、H5 构建、VitePress 构建。
2. npm pack dry-run 与 tgz 内容检查。
3. 20 个 frontmatter/路由一致性审计。
4. 启动本地双服务，使用浏览器抽查文档切页、iframe 加载和窄屏回退。

## 边界

- 不执行 npm publish。
- 不请求真实商城接口。
- 不修改 uView Pro 源码。
- 不扩展五个内部支撑组件到当前调用点之外。
