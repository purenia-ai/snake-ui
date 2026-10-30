# 更新日志

## 0.0.4（2026-10-30）

- 新增公开子路径 `@puresnake/snake-ui/qrcode`：导出二维码矩阵生成器 `generateQRCode` / `QRErrorCorrectLevel`，供海报合成等离屏 canvas 场景直接取矩阵数据（`<snake-qr-code>` 组件是屏上渲染，矩阵需求此前无法从包外获取）
- exports 新增 `./components/snake-cms/types` 显式入口（目标显式 `.ts`）：修复业务侧 `import type ... from '@puresnake/snake-ui/components/snake-cms/types'` 在 TS bundler 解析下报 TS2307 的问题（TS 对 exports 目标不做扩展名探测，也不支持中间通配 `*/types`，只能逐个显式声明）

## 0.0.3（2026-10-29）

- 修复 exports 深层路径对 TypeScript / Vite 的兼容性：`./libs/request`、`./libs/runtime` 提供显式入口；`./libs/config/*`、`./libs/cms/*`、`./libs/function/*`、`./libs/hooks/*` 映射到显式 `.ts` 文件（TS 不做扩展名探测，通配 `./libs/*` 下的无扩展名路径此前无法解析）

## 0.0.2（2026-10-29）

- 补齐 package.json `exports` 子路径：`./libs/*`、`./plugins/*`、`./locale/*`、`./iconfont.css`，接入方可以直接通过 `@puresnake/snake-ui/libs/...` 等子路径 import
- 新增 `pnpm changelog:sync`：本文件单向同步到 `docs/components/changelog.md`，文档站更新日志随发版自动对齐

## 0.0.1（2026-10-29）

- 首个 npm 公开发布版本（`@puresnake/snake-ui`，MIT）
- 基于 Vue 3 + TypeScript 的 uni-app 组件库，面向商城与 CMS 场景
- 14 个配置驱动的 CMS 页面区块，统一由 `snake-cms` 渲染
- 内置明暗主题（`theme.scss`）、`zh-CN` / `en-US` 多语言、基于 `uni.request` 的 HTTP 客户端与常用 hooks / 工具
- easycom 按需引入，精简打包体积
- 兼容 H5、微信小程序、App 等多端

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
- Select 列选择器
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
