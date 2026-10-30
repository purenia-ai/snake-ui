# 更新日志

## [0.0.4](https://github.com/purenia-ai/snake-ui/compare/v0.0.3...v0.0.4)（2026-10-30）

### ✨ 新增 | Features

- 新增公开子路径 `@puresnake/snake-ui/qrcode`：导出二维码矩阵生成器 `generateQRCode` / `QRErrorCorrectLevel`，供海报合成等离屏 canvas 场景直接取矩阵数据。`<snake-qr-code>` 组件为屏上渲染，矩阵需求此前无法从包外获取（[c126cbb](https://github.com/purenia-ai/snake-ui/commit/c126cbb)）
- 索引列表（`snake-index-list` / `snake-index-list-panel`）窗口尺寸变化（旋转屏、分屏）后自动重测锚点几何信息；开发期校验 `indexList` 与实际挂载锚点的匹配，未匹配索引输出告警，不再静默失败
- `snake-button` 新增 `icon`（内置图标，颜色与字号跟随按钮文字）与 `block`（块级按钮占满整行）属性

### 🐛 修复 | Bug Fixes

- 修复骨架屏占位色不适配暗色模式的问题：`--snake-skeleton-color` / `--snake-skeleton-highlight` 未在任何主题层定义，组件长期落在浅灰 fallback 上，暗色背景中呈现刺眼浅灰块；默认值改为中性灰半透明叠加，明暗底色自适应，业务覆盖变量仍生效
- `exports` 补充 `./components/snake-cms/types` 显式入口：修复业务侧 `import type ... from '@puresnake/snake-ui/components/snake-cms/types'` 在 TypeScript bundler 解析下报 TS2307 的问题。TypeScript 对 `exports` 目标不做扩展名探测，也不支持中间通配（`*/types`），组件内部模块必须逐个显式声明（[c126cbb](https://github.com/purenia-ai/snake-ui/commit/c126cbb)）
- 修复 `snake-button` 多处状态死角：`type="info"` 此前完全没有样式（渲染为无底色按钮）；默认类型禁用态白字白底文字不可见；镂空（plain）禁用态与可用态无法区分；镂空边框误用 `-disabled` 褪色令牌而非主题主色；镂空按压态会反转为实心深色底。顺带移除写死的 `id="snake-wave-btn"`（多按钮同页 id 重复且无引用）与从未生效的 `hoverBgColor` 属性

### ⚙️ 变更 | Changes

- `snake-button` 加载态由「原生 loading + 白色蒙层」改为内置 `snake-loading` 指示器：颜色继承按钮文字色，各主题与镂空态下视觉一致；过渡属性由 `all` 收敛为颜色与透明度

- 品牌浅色 token 对齐规范：`--snake-color-primary-light`（含 runtime `lightPalette.primaryLight` 与 `-rgb` 变量）由遗留的 `#eeffe0` 修正为主色 10% 透明度 `#06D2901A`；同步修正 snake-button 蓝色 fallback（`#ecf5ff`）、snake-toast / snake-index-list / snake-index-list-panel / filter-sorts 的 `rgba(6,210,144,.1)` fallback 写法，以及文档站主题色板展示数据
- 开源仓库迁移至 GitHub 组织 [purenia-ai/snake-ui](https://github.com/purenia-ai/snake-ui)，`repository` / `bugs` 等包元数据与文档链接同步更新，根目录补 MIT LICENSE；包 `homepage` 指向线上文档站 [m.puresnake.com/snake-ui](https://m.puresnake.com/snake-ui/)，README 增加徽章与文档 / 演示入口（[b9ba6c1](https://github.com/purenia-ai/snake-ui/commit/b9ba6c1)）

### ✏️ 文档 | Documentation

- 更新日志改为 Keep a Changelog 规范结构：格式说明、分类、版本锚点与提交链接（[b9ba6c1](https://github.com/purenia-ai/snake-ui/commit/b9ba6c1)）
- 二维码演示页收敛为卡片布局，补强 switch / slider / subsection 示例页（[4c8aee3](https://github.com/purenia-ai/snake-ui/commit/4c8aee3)）
- 重新生成 skill 引用与 LLM 上下文，补齐缺失的 qr-code 组件引用（[9cef7b7](https://github.com/purenia-ai/snake-ui/commit/9cef7b7)）

## [0.0.3](https://github.com/purenia-ai/snake-ui/compare/v0.0.2...v0.0.3)（2026-10-29）

### 🐛 修复 | Bug Fixes

- 修复 `exports` 深层路径对 TypeScript / Vite 的兼容性：`./libs/request`、`./libs/runtime` 提供显式入口；`./libs/config/*`、`./libs/cms/*`、`./libs/function/*`、`./libs/hooks/*` 映射到显式 `.ts` 文件（TypeScript 不做扩展名探测，通配 `./libs/*` 下的无扩展名路径此前无法解析）（[b7c6416](https://github.com/purenia-ai/snake-ui/commit/b7c6416)）

### ✏️ 文档 | Documentation

- 新增 `pnpm changelog:sync` 脚本：本文件单向同步到 `docs/components/changelog.md`，文档站更新日志随发版自动对齐（[b7c6416](https://github.com/purenia-ai/snake-ui/commit/b7c6416)）

## [0.0.2](https://github.com/purenia-ai/snake-ui/compare/v0.0.1...v0.0.2)（2026-10-29）

### ✨ 新增 | Features

- `package.json` 补齐 `exports` 子路径：`./libs/*`、`./plugins/*`、`./locale/*`、`./iconfont.css`，接入方可以直接通过 `@puresnake/snake-ui/libs/...` 等子路径 import

> 注：0.0.1 – 0.0.3 发布自同一份工作区快照（npm registry 记录的 gitHead 均为 afb1b62），版本间差异只存在于 npm 包内容，git 比对在此期间为空；自 0.0.3 起改动随提交入库。

## 0.0.1（2026-10-29）

### ✨ 新增 | Features

- 首个 npm 公开发布版本（MIT）。基于 Vue 3 + TypeScript 的 uni-app 组件库，面向商城与 CMS 场景
- 46 个通用组件，覆盖基础、表单、数据、反馈、布局、导航等分类，easycom 按需引入
- 14 个配置驱动的 CMS 页面区块，统一由 `snake-cms` 渲染
- 内置明暗主题（`theme.scss`）、`zh-CN` / `en-US` 多语言、基于 `uni.request` 的 HTTP 客户端与常用 hooks / 工具
- 兼容 H5、微信小程序、支付宝小程序、App 等多端

---

## 组件索引

以下清单随组件目录更新，当前共 46 个通用组件入口。

基础组件（12）

- Parse 富文本解析
- ConfigProvider 全局配置
- Button 按钮
- Icon 图标
- Image 图片
- QrCode 二维码
- Loading 加载
- Skeleton 骨架屏
- Transition 过渡动画
- RootPortal 根节点传送
- Text 文本
- Link 超链接

表单组件（11）

- Form 表单
- Input 输入框
- Textarea 文本域
- Checkbox 复选框
- Radio 单选框
- Switch 开关
- Slider 滑动选择器
- Search 搜索框
- Select 列表选择器
- Upload 文件上传
- Calendar 日历

数据组件（5）

- Loadmore 加载更多
- LineProgress 线形进度条
- ReadMore 阅读更多
- Empty 空状态
- CountDown 倒计时

反馈组件（5）

- NoticeBar 通知栏
- Overlay 遮罩层
- Tooltip 文字提示
- Popup 弹出层
- NoNetwork 无网络提示

布局组件（4）

- Swiper 轮播图
- Sticky 吸顶
- Line 分隔线
- Cell 单元格

导航组件（9）

- Navbar 导航栏
- Tabbar 底部导航栏
- Tabs 标签页
- Subsection 分段器
- ButtonSort 排序按钮
- DropMenu 下拉菜单
- IndexList 索引列表
- IndexListPanel 容器索引列表
- IndexAnchor 索引锚点
