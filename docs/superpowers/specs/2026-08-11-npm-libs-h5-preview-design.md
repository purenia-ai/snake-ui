# Snake UI npm、libs 与 H5 预览设计

## 背景

Snake UI 当前可以作为本地 `uni_modules` 使用，但还不具备完整的 npm 包契约。部分业务组件直接导入宿主工程的 `@/utils/request`、缓存管理器和业务配置，安装到其他工程后无法解析。组件文档目前仅展示静态占位，没有像 uView Pro 文档一样在右侧嵌入真实 H5 示例。

本设计参考 uView Pro 的源码包发布方式和组件文档右侧 iframe 预览模式。npm 包名暂定为 `snake-ui`；若公共注册表名称不可用，再迁移为作用域包，组件 API 和目录结构不随包名改变。

## 目标

- `snake-ui` 同时支持 `uni_modules` 复制安装和 npm 安装。
- 通过 `app.use(SnakeUI, options)` 配置运行时业务适配器。
- 消除组件库内部对宿主 `@/utils` 与 `@/config` 绝对路径的直接依赖。
- 保持 `uview-pro` 为外部 peer dependency，不复制其组件与 `$u` 工具。
- 为 20 个公开组件建立真实的 uni-app H5 预览路由。
- 在 VitePress 桌面组件页右侧嵌入手机框 iframe，并在窄屏提供独立打开入口。
- 文档生产产物内置 H5 预览，不依赖外部演示域名。

## 非目标

- 不执行真实 `npm publish`。
- 不连接真实商城、登录、领券或小程序接口。
- 不将 uView Pro 源码合并进 Snake UI。
- 不在本阶段承诺未经构建和交互验证的平台支持。
- 不重写现有 20 个公开组件的视觉设计。

## 总体架构

采用“源码即 npm 包”模式：`src/uni_modules/snake-ui` 同时是 uni_modules 模块目录和 npm 发布目录。根 uni-app 工程作为组件演示应用，`docs` 继续作为独立 VitePress 包。

```text
src/uni_modules/snake-ui/       npm 与 uni_modules 共用源码
src/demo/                       H5 预览的 fixtures 与 mock adapters
src/pages/components/           20 个真实组件预览页
docs/                           VitePress 文档
docs/.vitepress/theme/          预览框与布局集成
dist/build/h5/                  uni-app H5 构建产物
docs/.vitepress/dist/preview/   最终文档内置预览产物
```

## npm 包结构

```text
src/uni_modules/snake-ui/
├─ components/
├─ libs/
│  ├─ adapters/
│  │  ├─ request.ts
│  │  ├─ cache.ts
│  │  └─ config.ts
│  ├─ runtime.ts
│  └─ index.ts
├─ types/
│  └─ index.d.ts
├─ index.ts
├─ index.d.ts
├─ package.json
├─ readme.md
└─ changelog.md
```

模块 `package.json` 增加：

- 将本次能力版本设为 `0.2.0`，表示新增 npm 安装、运行时适配器和预览能力。
- `browser`、`types` 和明确的 `exports`。
- `vue`、`@dcloudio/uni-app` 与 `uview-pro` peer dependencies。
- 根入口、`components/*`、`libs/*` 和 `types` 子路径导出。
- 只发布组件库目录内的源码、类型与说明文件。

根入口默认导出 Vue 插件，并继续具名导出所有公开组件与 libs：

```ts
app.use(uViewPro)
app.use(SnakeUI, {
  request,
  cache,
  config,
})
```

uni_modules 使用现有 easycom 路径：

```json
"^snake-(.*)": "@/uni_modules/snake-ui/components/snake-$1/snake-$1.vue"
```

npm 使用包路径：

```json
"^snake-(.*)": "snake-ui/components/snake-$1/snake-$1.vue"
```

宿主只能选择其中一种来源，避免同名组件由两份源码解析。

## libs 与运行时适配器

`libs/runtime.ts` 保存当前 Snake UI 安装选项，并提供受控的读取函数。配置只由插件安装或显式配置 API 修改，组件不直接修改全局配置。

适配器职责：

- `request`：接收组件需要的请求参数并返回 Promise，不绑定具体 HTTP 客户端。
- `cache`：提供组件实际使用的读取、写入或删除能力，不暴露宿主缓存实现。
- `config`：保存 API 地址、H5 域名或业务开关等组件确实读取的配置。

组件从 `libs` 导入稳定接口，不再导入：

- `@/utils/request`
- `@/utils/cache/cacheManager`
- `@/config/config`

缺少适配器时，导入组件和渲染纯展示状态不报错。首次调用缺失能力时抛出 `SnakeUIRuntimeError`，错误包含组件名、缺失适配器名和 `app.use(SnakeUI, options)` 配置提示。预览工程安装本地 mock adapters，因此不会触发真实网络。

`uview-pro` 继续提供 `<u-*>`、`uni.$u` 和 `$u`。Snake UI 不重新实现 `sleep`、`toast`、`navTo`、`getRect` 等已存在的 uView Pro 工具。

## 内部支撑组件

当前筛选相关源码引用但仓库缺失的以下组件必须补齐，作为 Snake UI 内部支撑组件：

- `snake-button-sort`
- `snake-drop-menu`
- `snake-drop-menu-item`
- `snake-index-list`
- `snake-index-anchor`

它们用于让现有公开组件完整运行，不在首期文档导航中作为新的公开产品组件。实现以当前调用点所需的最小 props、events、provide/inject 契约为边界，不扩展额外功能。

## H5 预览应用

根 uni-app 工程安装 npm 版 `uview-pro`，并使用本地 Snake UI 源码。`src/main.ts` 先安装 uView Pro，再安装 Snake UI 和 mock adapters。

每个公开组件拥有一个稳定页面路由：

```text
/pages/components/activity-list/index
/pages/components/auxiliary-segmentation/index
...
/pages/components/snake-cms/index
```

共 20 个页面。每页只负责：

- 提供标题和必要的页面容器。
- 从 `src/demo/fixtures` 读取确定性样例。
- 渲染对应的 Snake UI 组件。
- 为交互型示例显示可见的 mock 结果。

领券、请求、登录态、小程序跳转等动作不得访问真实服务。无法在 H5 执行的平台动作显示说明或 toast，不伪造成功跳转。

## VitePress iframe 集成

每篇组件 Markdown 使用 frontmatter 声明预览路由：

```yaml
preview: /pages/components/notice/index
```

主题布局读取当前路由数据，并渲染 `PreviewFrame`：

- 桌面宽屏：右侧 sticky 手机外框，内部 iframe 加载当前预览页。
- 页面切换：根据 frontmatter 更新 iframe 路由。
- 窄屏：隐藏固定手机框，显示“打开在线预览”按钮。
- 状态：显示加载中、加载失败、刷新和独立打开。
- 可访问性：iframe 必须有与组件标题关联的 `title`，控制按钮可键盘操作并有可见焦点。

开发环境的 iframe 基址由环境变量指定，默认指向本地 uni-app H5 服务。生产环境使用同站点 `/preview/#/...`。

## 开发与生产构建

开发脚本同时启动：

- uni-app H5 开发服务器。
- VitePress 开发服务器。

两者使用固定且不冲突的端口，VitePress 通过环境变量获得 H5 地址。

生产流程：

1. 以 `/preview/` 为资源基址构建 uni-app H5。
2. 构建 VitePress。
3. 将 H5 产物复制到 `docs/.vitepress/dist/preview/`。
4. 校验每个 frontmatter 路由都能在 H5 构建清单中找到。

生成的预览产物不写入 `docs/public`，避免把构建结果作为源码维护。

## 错误处理

- runtime 未安装：业务能力首次调用时抛出描述性错误，纯展示组件仍可渲染。
- mock 未覆盖：对应预览页显示错误卡片并让验证失败，不回退到真实网络。
- iframe 服务不可达：保留失败提示、刷新和独立打开按钮。
- frontmatter 缺失或路由无效：文档构建后的审计失败。
- npm 包名冲突：仅将名称迁移为作用域包并同步安装文档与路径测试。
- peer dependency 缺失：安装或构建阶段给出明确提示，不把 peer 复制进包。

## 验证

### libs

- 配置合并与重复安装行为。
- request、cache、config 适配器调用。
- 缺失适配器的错误类型与消息。
- mock adapters 不产生外部网络请求。

### npm

- `npm pack --dry-run` 只包含预期文件。
- 生成 tgz 并安装到临时 uni-app 测试工程。
- 验证根导出、组件子路径、libs 子路径和类型声明。
- 使用 npm easycom 路径完成 H5 构建。

### uni-app 预览

- `vue-tsc --noEmit` 通过。
- H5 构建通过，20 个路由进入产物。
- 每个页面可渲染目标组件。
- 交互型页面只调用 mock adapters。

### VitePress

- 20 篇组件文档均有 `preview` frontmatter。
- VitePress 构建通过。
- 最终产物包含 `/preview/` H5 应用。
- 桌面 iframe 加载对应路由；窄屏回退入口可用。
- 内部 `superpowers` 文档仍不进入发布产物。

## 实施顺序

1. npm exports、类型与打包检查。
2. libs runtime 和三个适配器。
3. 移除组件中的宿主绝对导入。
4. 补齐五个内部支撑组件。
5. mock adapters、fixtures 与 20 个 H5 页面。
6. VitePress 预览框和 frontmatter。
7. 联合开发、生产构建与完整审计。
