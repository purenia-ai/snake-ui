# 更新日志

## [0.0.8](https://github.com/purenia-ai/snake-ui/compare/v0.0.7...v0.0.8)（2026-11-02）

### 🐛 修复 | Bug Fixes

- **v1 CMS 宽屏等比修复**：`from750` 由固定 px（375 基准）改为输出 rpx，恢复旧版随屏宽等比缩放、并遵守 `rpxCalcMaxDeviceWidth` 的行为。此前在 390+ 宽机型上（Pro Max 尤其明显，+15%）魔方等 v1 区块格子变扁、图片被裁；375 宽机型完全不受影响
- 新增 `from375(value)`（375 稿 px 数值 → rpx 字符串）：magiccube `heights`、pictureads `height` 等旧 px 语义字段改经它渲染，盒子与图片**同步**等比缩放（旧版盒子固定而图片随宽缩放，宽屏上本就有 ~15% 溢出，此次一并修复）
- 修复 pictureads 轮播分支残留的 `height ×2` rpx 补偿与 `radius` 口径，App 渲染与编辑器 v1 预览一致
- **CMS 商品区 chrome 恢复宽屏等比**：tabs / 筛选工具栏 / 加载更多 / 空态留白 / 回到顶部等分发器内部尺寸原先 ÷2 成了固定 px（375 一致、宽屏偏小），改经 `from750` 恢复随屏宽等比；`snake-filter-sorts` 新增 `fontSize` / `titleSize` 属性、`snake-button-sort` 新增 `fontSize` 属性（默认 px，CMS 场景传入等比值）
- **修复 dev 场景下 CMS 商品服务对组件不可见的问题**（H5 本地开发商品列表不渲染、接口不请求且无任何报错）：运行时上下文（`libs/runtime/context.ts`）与 CMS 全局配置（`libs/cms/config.ts`）原为模块级状态，vite 预打包的包入口（插件 `app.use` 写入侧）与 easycom 按文件路径加载的组件（读取侧）在 dev 下各持一份模块实例，状态互不可见；两处改为挂载在 `globalThis` 上的跨实例单例（生产构建本就单实例，不受影响）
- **补齐 0.0.6 遗漏的默认值 ÷2**：`snake-text` 的 `size` 28→14（此前未换算，按 px 渲染后为旧版 2 倍大）；`snake-skeleton` 的 `titleHeight` 18→9、`rowsHeight` 16→8、`avatarSize` 32→16（含兜底值）；`snake-upload` 的 `width`/`height` 200→100（未换算）；`snake-tooltip` 的 `offset` 8→4（未换算）；`snake-loading` 的 `textSize` 7→12（旧默认 14rpx=7px 过小，统一到可读尺寸）
- **snake-empty 默认尺寸调大**：`iconSize` 60→80、`fontSize` 13→14、图文间距 10→12px（原值沿袭 uview-pro 默认，偏小巧；对齐 wot-design-uni 系空状态的醒目度，仍是图标语言）
- 新增守护测试：双模块实例状态互通、组件模板禁止拼接 rpx 单位字面量、pictureads swiper 绑定契约、模板裸调用 px 助手的渲染上下文可达性

## [0.0.7](https://github.com/purenia-ai/snake-ui/compare/v0.0.6...v0.0.7)（2026-11-02）

### 🐛 修复 | Bug Fixes

- 修复 magiccube 模板直接引用 `from750` 但该函数未注册到 Options API 渲染上下文的问题：魔方容器的 `pageMargin` 内边距与部分布局的 `imgMargin` 间距在运行时静默失效并产生 Vue 告警（`Property "from750" was accessed during render`），现统一改走 `$snake.from750`；并新增守护测试，防止模板内裸调用 `from750` / `addUnit` 而未暴露给渲染上下文的写法再次引入

## [0.0.6](https://github.com/purenia-ai/snake-ui/compare/v0.0.5...v0.0.6)（2026-11-02）

### ⚙️ 变更 | Changes

- **单位体系由 rpx（750 设计稿）整体迁移为 px（375 设计稿）**：库内全部样式换算为 px；传给组件的裸数字属性（`size` / `fontSize` / `height` 等）一律按 375 稿 px 解释，`$snake.addUnit` 默认单位由 rpx 改为 px；各尺寸类属性与尺寸预设表的默认值减半；`1rpx` 细线统一为 `1px`。**宿主迁移只需处理传给本库组件的裸数字属性（÷2）**：带 `rpx` 单位字符串的属性仍按 rpx 渲染、宿主页面自有的 rpx 样式不受任何影响
- CMS v1 存量数据不做迁移：渲染层新增 `from750(value)`（`uni.$snake.from750`，750 稿 rpx 数字 → 375 稿 px 字符串）承接旧数据语义；magiccube `heights`、graphicnavigation `textSize` / `textHeight` / `borderRadius`、pictureads `height` 等原本即按物理 px 语义生效的字段改为直出 px
- CMS v2 组件（`v2.*`）尺寸契约改为 375 稿原生 px（编辑器 v2 schema 同步切换），渲染 helper 由 `rpx()` 更名为 `px()`
- `pxToRpx` 标记为 deprecated（存量可用，新代码勿用）；库内 6 处 `uni.upx2px` 调用点改为直用 px 数值
- 文档全量更新单位口径（组件属性表、示例代码、CMS 数据契约说明）

### 🐛 修复 | Bug Fixes

- 修复 CMS 视频块从不渲染的问题：编辑器 manifest 的存量 key 为 `videoss`，而 C 端 `snake-cms` 只分发 `videos`，两边从未对上；现在分发同时兼容两个 key
- 修复 magiccube 第 5 种布局（两行每列两张）高度语义与主路径不一致的问题：该分支按 `heights / 2` rpx 渲染（仅为主路径 1/4 物理高度），现统一为与主路径相同的 px 直出

## [0.0.5](https://github.com/purenia-ai/snake-ui/compare/v0.0.4...v0.0.5)（2026-10-30）

### 🐛 修复 | Bug Fixes

- 全局 `$snake` 类型改为可增强的 `SnakeGlobalAPI` 接口并由 `types/uni-app.d.ts` 导出：此前宿主侧再声明 `Uni.$snake`（如向 $snake 挂载业务工具后的完整类型）会与包内声明同名属性冲突，报错被 skipLibCheck 压掉后 `$snake`的类型随文件加载顺序漂移，时而是库类型、时而是宿主类型。现在宿主通过`declare module '@puresnake/snake-ui/types/uni-app'`向`SnakeGlobalAPI` 补充成员即可，`Uni.$snake` 与组件 `this.$snake` 的类型全局仅此一份声明

## [0.0.4](https://github.com/purenia-ai/snake-ui/compare/v0.0.3...v0.0.4)（2026-10-30）

### ✨ 新增 | Features

- 新增公开子路径 `@puresnake/snake-ui/qrcode`：导出二维码矩阵生成器 `generateQRCode` / `QRErrorCorrectLevel`，供海报合成等离屏 canvas 场景直接取矩阵数据。`<snake-qr-code>` 组件为屏上渲染，矩阵需求此前无法从包外获取（[c126cbb](https://github.com/purenia-ai/snake-ui/commit/c126cbb)）
- 索引列表（`snake-index-list` / `snake-index-list-panel`）窗口尺寸变化（旋转屏、分屏）后自动重测锚点几何信息；开发期校验 `indexList` 与实际挂载锚点的匹配，未匹配索引输出告警，不再静默失败
- `snake-button` 新增 `icon`（内置图标，颜色与字号跟随按钮文字）与 `block`（块级按钮占满整行）属性
- 日历内置节日扩充：新增春节、元宵、端午、中秋、重阳五个农历节日（由 `solar2lunar` 逐年换算，无需维护公历日期）与清明（按节气字段判定，公历落点逐年浮动）
- `snake-popup` 新增 `root-portal` 属性：整棵弹层传送到页面根节点渲染，脱离祖先的 `transform` / `overflow` / 层叠上下文，解决弹层在 scroll-view、轮播等容器内被裁剪的问题；同时补齐 `before-enter` / `enter` / `before-leave` / `leave` 动画生命周期事件（底层组件本已发出，此前未透传）

### 🐛 修复 | Bug Fixes

- 修复骨架屏占位色不适配暗色模式的问题：`--snake-skeleton-color` / `--snake-skeleton-highlight` 未在任何主题层定义，组件长期落在浅灰 fallback 上，暗色背景中呈现刺眼浅灰块；默认值改为中性灰半透明叠加，明暗底色自适应，业务覆盖变量仍生效
- 修复日历 `is-page` 内嵌模式整体不渲染的问题：此前 `modelValue` 默认 `false` 且内嵌用法不绑定 v-model，内容被弹层 `v-if` 掉；现在内嵌模式常显，并由 snake-popup 新增的 `embedded` 模式让根与面板回到文档流，不再固定全屏、不被 `max-height` 裁剪
- 修复日历「今天」标记被 `minDate` / `maxDate` 钳制污染：今天不在可选范围内时，`isToday` 回调与今日标记错位到边界日期；现在以真实日期计算
- 修复日历 `change` 事件载荷 `week` 硬编码中文「星期X」，英文环境下仍返回中文；现在中文「星期X」、英文返回缩写
- `exports` 补充 `./components/snake-cms/types` 显式入口：修复业务侧 `import type ... from '@puresnake/snake-ui/components/snake-cms/types'` 在 TypeScript bundler 解析下报 TS2307 的问题。TypeScript 对 `exports` 目标不做扩展名探测，也不支持中间通配（`*/types`），组件内部模块必须逐个显式声明（[c126cbb](https://github.com/purenia-ai/snake-ui/commit/c126cbb)）
- 修复 `snake-button` 多处状态死角：`type="info"` 此前完全没有样式（渲染为无底色按钮），修复后与默认按钮同为中性配色；默认类型禁用态白字白底文字不可见；镂空（plain）禁用态与可用态无法区分；镂空边框误用 `-disabled` 褪色令牌而非主题主色；镂空按压态会反转为实心深色底。顺带移除写死的 `id="snake-wave-btn"`（多按钮同页 id 重复且无引用）与从未生效的 `hoverBgColor` 属性

### ⚙️ 变更 | Changes

- 日历内置节日修订：移除双十一；新增春节、元宵、端午、中秋、重阳五个农历节日（由 `solar2lunar` 逐年换算，无需维护公历日期）与清明（按节气字段判定，公历落点逐年浮动）
- 日历底部确定按钮改为占满整行（对齐 wot-design 的日历弹窗样式）
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
