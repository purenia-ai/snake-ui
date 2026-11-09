---
name: 'changelog'
description: 'Snake UI 更新日志参考。处理 changelog、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['changelog', 'snake-changelog', '更新日志']
---

# 更新日志

## [0.0.16](https://github.com/purenia-ai/snake-ui/compare/v0.0.15...v0.0.16)（2026-11-09）

### ✨ Features | 新功能

- **theme:** 主题支持自定义 CSS 变量：`Theme.css` / `Theme.darkCss` 随色板注入页面根部，暗色模式下合并生效（`darkCss` 只覆盖同名键，其余沿用 `css`）；`theme` 配置顶层 `css` / `darkCss` 可广播到全部主题，主题自身同名键优先

### 🐛 Bug Fixes | Bug 修复

- **theme（行为变更）:** 只改亮色的令牌按亮色色相与饱和度派生暗色、明度沿用基线，暗色下不再回落到内置颜色；`background`、`surface`、`text`、`border`、`divider`、`mask`、`shadow`、`primaryInk` 等结构性令牌仍使用基线暗色
- **theme（行为变更）:** `themes` 不再自动混入内置主题，声明的列表即最终列表；空数组回退内置主题；默认主题名不存在时回写 `config.defaultTheme`；`setThemeColor` 在亮色下同步派生暗色
- **theme:** 扁平单主题形态支持 `css` / `darkCss` / `name` / `darkColor`，`css`、`label` 等元信息不再被当作颜色令牌
- **snake-tabbar:** `isDot` 圆点角标补 8×8 尺寸修饰类，不再渲染成 18×2 的细线
- **snake-popup:** 关闭按钮默认尺寸由 10 调整为 16
- **snake-filter-sorts:** 筛选面板内边距左右对称，价格输入撑满列宽
- **docs:** 主题生成器导出片段改用库中真实导出（`defaultTheme`、`Theme`），修复产物无法编译

### ♻️ Documentation | 文档

- **多主题:** 新增「自定义 CSS 变量」章节（`css` / `darkCss` 合并语义、顶层共享变量、暗色推导与结构性令牌例外），修正主题持久化键名
- **tabbar:** 新增 Tabbar 示例页（凸起按钮、角标、禁用、激活色与高度调节），补概览条目与文档预览
- **示例页:** indexList / indexAnchor / indexListPanel / popup / form / badge / icon / button / loading / link / empty / text / transition / rootPortal 示例页 i18n 收口与结构重排，概览页补齐 verificationCode 条目

## [0.0.15](https://github.com/purenia-ai/snake-ui/compare/v0.0.14...v0.0.15)（2026-11-06）

### ✨ Features | 新功能

- **snake-icon:** `size` 默认值由 `inherit` 改为 `14`（px，375 稿）：默认带尺寸保底，父级字号较小时不再跟着缩小；显式传 `inherit` 仍可跟随父级字号
- **snake-empty:** 图标与图片尺寸分离：`iconSize` 明确为字体图标 em 字号（默认 80 → 96），新增 `imageSize` 控制插画/图片尺寸（默认 160），内边距与文案间距同步调整

### 🐛 Bug Fixes | Bug 修复

- **snake-drop-menu:** 架构重构，标题栏收归 `DropMenu` 统一渲染、菜单项只保留内容面板：共享 `snake-overlay` 遮罩（锁定背景滚动）、面板定位补 `--window-top`（修复 H5 导航栏偏移）、`menuIcon` 真正生效、`show` 语义改为是否在标题栏显示、修复动态增删菜单项后 `highlight`/`open` 下标错位、同屏多实例互斥、暴露方法去掉 `colseAll` 统一为 `close`
- **snake-sticky:** 常驻占位结构重构：测得高度后占位层定高、内容层常驻 absolute，吸顶切换不再引起布局跳动；测量对象改为内容层，H5 端用 ResizeObserver 监听内容尺寸
- **snake-filter-sorts:** 筛选标签固定每行 4 个（宽度改为百分比），新增 `nth-child(4n)` 规则去掉行尾右间距，四列左右对齐

### ✏️ Documentation | 文档

- `color.md` 色板的 `primary-light` 修正为 token 实际值 `#06D2901A`

## [0.0.14](https://github.com/purenia-ai/snake-ui/compare/v0.0.13...v0.0.14)（2026-11-06）

### 🐛 Bug Fixes | Bug 修复

- **snake-image:** 失败态改为灰底居中图标：默认 `errorIcon` 改用 `error-circle`，占位层补 `--snake-color-surface-muted` 底色，加载/失败统一 24px 图标且不再叠加默认文案（插槽仍可自定义）；`loading-img` / `error-img` 自身加载失败时回退内置图标，空 `src` 不再提示"加载失败"，仅懒加载时重置图片 key 避免挂载即重复请求
- **snake-sticky:** 吸顶判定重构：观察根顶边改为吸顶线加自身高度并按阈值 0 实时判定，修复吸顶块高于视口时永不触发；降级路径改用宿主 `scrollTop`（原 `onPageScroll` 注册在 H5 与小程序均不会回调），返回页恢复滚动与锚点跳转后也会即时校正

### ✏️ Documentation | 文档

- 示例页骨架统一：`.demo-variant-title` 基础样式收编至全局 demo.scss，去除 30 个示例页的重复定义；upload 示例迁移到 DemoSection / DemoControlPanel 统一骨架并补齐中英文案

## [0.0.13](https://github.com/purenia-ai/snake-ui/compare/v0.0.12...v0.0.13)（2026-11-05）

### ✨ Features | 新功能

- **snake-verification-code:** 新增验证码倒计时组件：无 UI 状态机，`seconds` / `startText` / `changeText` / `endText` 可配，支持跨页面续跑（`keepRunning` + `uniqueKey`），暴露 `start` / `reset` 方法与 `change` / `start` / `end` 事件，附中英文案与示例页

### 🐛 Bug Fixes | Bug 修复

- **snake-root-portal:** App 端节点清理钩子改用 `beforeUnmount`：`beforeDestroy` 在 Vue 3 视图层不会执行，组件卸载后传送节点不再残留
- **snake-calendar:** 修复星期文案语言判断：`currentLocale` 是对象而非字符串，中文环境此前一直显示裸“日/一/二”，现正确显示“星期日/星期一”
- **snake-search:** 输入与搜索事件参数类型放宽，消除与原生 `<input>` 事件签名的类型冲突（运行时行为不变）
- **snake-parse:** wxs 脚本块移至主脚本之后，避免 vue-tsc 将整个 SFC 误判为 TS 导致类型检查报大量语法错误
- **request:** 拦截器伪泛型与传输假联合修正，请求类型归位 request 模块

### ⚠️ Breaking Changes | 不兼容变更

- **snake-input:** 移除 `password` 属性，密码框改用 `type="password"`，保留单一入口
- **snake-notice-bar:** 移除 `direction` 属性，垂直模式改用 `mode="vertical"`，保留单一入口

### ✏️ Documentation | 文档

- 组件文档 API 表重构为一条一行：补齐缺失属性、事件与主题变量，修正默认值
- 新增 snake-verification-code 组件文档与示例页

## [0.0.12](https://github.com/purenia-ai/snake-ui/compare/v0.0.11...v0.0.12)（2026-11-04）

### ✨ Features | 新功能

- **snake-badge:** 新增徽标组件：包裹内容并在右上角圆心对准角点挂载数字 / 圆点徽标，支持 max 溢出、showZero、hidden 与 top/right 偏移，无插槽时作独立徽标
- **snake-tabs:** 新增 `click` / `disabled` 事件与标签项 `disabled` 字段（置灰并拦截切换）；徽标改由 snake-badge 渲染并锚定文字右上角点，`offset` 语义改为相对角点偏移且默认归零
- **snake-tabs:** 滑块与滚动改现场测量（前方宽度累加推算内容坐标），字体晚到、语言切换或动态换标后不再错位；同值 scroll-left 加微量扰动，回切标签也能回中

### 🐛 Bug Fixes | Bug 修复

- **snake-tabs:** 修复徽标上半截被 scroll-view 裁切：包裹层行高回归 normal 并垂直居中，角点留在滚动区内
- **snake-tabs:** 修复滑块加粗后抬升量随厚度翻倍顶到文字，底部改固定 3px 间隙
- **snake-tabs:** 修复纯 CSS 样式块内的非法行注释导致 PostCSS 构建失败

## [0.0.11](https://github.com/purenia-ai/snake-ui/compare/v0.0.10...v0.0.11)（2026-11-04）

### ✨ Features | 新功能

- **unitToPx:** 新增尺寸解析工具：裸数字按 375 稿 px、rpx 后缀按视口换算，供参与几何运算的属性使用
- **snake-sticky:** H5 端未传 `customNavHeight` 时自动让出 uni-app 内置导航栏 44px；显式传值（含 0）仍按传入值生效，其余端行为不变

### 🐛 Bug Fixes | Bug 修复

- **snake-tabs:** 滑块偏移与圆角改用 unitToPx 解析，`barWidth` / `barHeight` 传 `50rpx` 等带单位值时不再使滑块滞留最左侧
- **snake-circle-progress:** 画布尺寸同步解析单位值，修复 `width` 传 rpx 时按回退值 100 光栅化导致的压缩变形
- **snake-read-more:** `showHeight` 高度比较同样支持带单位值
- **snake-subsection:** 分段模式末项分隔线改由内联样式控制，`:not()` 不可靠的小程序端不再残留

## [0.0.10](https://github.com/purenia-ai/snake-ui/compare/v0.0.9...v0.0.10)（2026-11-04）

### ✨ Features | 新功能

- **snake-circle-progress:** 新增环形进度条：canvas 绘制、中心透明、圆头弧端，微信端按像素比高清渲染
- **v2.floatbutton:** 复用悬浮气泡：可关闭（按组件 id 记忆）、滚动半藏家族签名、跳转走 link service
- **snake-floating-bubble:** 新增 `unit` 尺寸口径与 `hide-on-scroll` 开关属性
- **snake-link:** 小程序端新增 `copy-success` / `copy-fail` 事件
- **snake-search:** 新增 `type` 属性，支持数字 / 身份证 / 小数点键盘

### 🐛 Bug Fixes | Bug 修复

- **snake-floating-bubble:** 收起改为纯 CSS 位移并补偿右边距，修复偶发反向飞出与露幅超半
- **v2.floatbutton:** 修复 `position.bottom` 为 0 时被默认值吞掉
- **snake-drop-menu:** 标题栏默认高度 20→40（迁移折半遗留）
- **snake-line-progress:** `percent` 钳制 0-100 并容错非法输入，百分比文字取整

### ✏️ Documentation | 文档

- 文档与注释全量改用中性表述，移除第三方库对照审计页与对应守卫
- 修正 floatbutton / drop-menu / line-progress 文档默认值漂移

## [0.0.9](https://github.com/purenia-ai/snake-ui/compare/v0.0.7...v0.0.9)（2026-11-03）

### ✨ Features | 新功能

- **from375:** 新增 `uni.$snake.from375`，旧 px 语义字段随屏等比渲染
- **snake-filter-sorts:** 新增 `fontSize` / `titleSize` 属性
- **snake-button-sort:** 新增 `fontSize` 属性

### 🐛 Bug Fixes | Bug 修复

- **from750:** 输出改回 rpx，v1 CMS 区块在宽屏机型恢复随屏等比（375 机型无变化）
- **magiccube / pictureads:** 盒子与图片高度同步等比，宽屏不再溢出裁切
- **pictureads:** 修复轮播分支高度 ×2 与圆角口径，App 端与编辑器 v1 预览一致
- **snake-cms:** 商品区 chrome（tabs / 筛选栏 / 加载更多 / 空态 / 回到顶部）恢复随屏等比
- **runtime:** 修复 H5 本地开发下商品服务对组件不可见（预打包入口与 easycom 组件各持一份模块状态）
- **snake-text:** `size` 默认 28→14
- **snake-skeleton:** `titleHeight` 18→9、`rowsHeight` 16→8、`avatarSize` 32→16
- **snake-upload:** `width` / `height` 默认 200→100
- **snake-tooltip:** `offset` 默认 8→4
- **snake-empty:** `iconSize` 60→80、`fontSize` 13→14，空状态更醒目
- **snake-loading:** `textSize` 默认 7→12，恢复可读

## [0.0.7](https://github.com/purenia-ai/snake-ui/compare/v0.0.6...v0.0.7)（2026-11-02）

### 🐛 Bug Fixes | Bug 修复

- **magiccube:** 修复 `pageMargin` / `imgMargin` 静默失效（模板裸调用未注册的 `from750`，统一走 `$snake.from750`）

## [0.0.6](https://github.com/purenia-ai/snake-ui/compare/v0.0.5...v0.0.6)（2026-11-02）

### ⚙️ Changes | 变更

- **单位体系:** 全库 rpx（750 稿）迁移为 px（375 稿）：裸数字属性按 px 解释、尺寸默认值减半、`1rpx` 细线改 `1px`、`addUnit` 默认单位改 px
- **宿主迁移:** 传给组件的裸数字属性 ÷2 即可；带 `rpx` 字符串的属性与宿主页面自有样式不受影响
- **from750:** 新增 `uni.$snake.from750`，承接 CMS v1 存量 750 稿数据，旧数据零迁移
- **v2 组件:** 尺寸契约改为 375 稿原生 px，渲染助手 `rpx()` 更名 `px()`（编辑器 schema 同步）
- **pxToRpx:** 标记 deprecated

### 🐛 Bug Fixes | Bug 修复

- **snake-cms:** 修复视频块从不渲染（编辑器存量 key `videoss` 与分发端 `videos` 不一致，现两者兼容）
- **magiccube:** 修复第 5 种布局高度语义与主路径不一致

### ✏️ Documentation | 文档

- 文档全量对齐 px 口径（属性表 / 示例 / CMS 数据契约）

## [0.0.5](https://github.com/purenia-ai/snake-ui/compare/v0.0.4...v0.0.5)（2026-10-30）

### 🐛 Bug Fixes | Bug 修复

- **$snake 类型:** 改为可增强的 `SnakeGlobalAPI` 接口，宿主补充成员不再与包内声明冲突

## [0.0.4](https://github.com/purenia-ai/snake-ui/compare/v0.0.3...v0.0.4)（2026-10-30）

### ✨ Features | 新功能

- **qrcode:** 新增子路径 `@puresnake/snake-ui/qrcode`，导出 `generateQRCode` / `QRErrorCorrectLevel`，海报合成可直接取矩阵
- **snake-index-list:** 窗口尺寸变化自动重测锚点；开发期 `indexList` 与锚点不匹配时输出告警
- **snake-button:** 新增 `icon`（内置图标，随文字配色）与 `block`（占满整行）属性
- **snake-calendar:** 内置节日新增春节、元宵、端午、中秋、重阳（农历换算）与清明（节气）
- **snake-popup:** 新增 `root-portal` 属性，弹层脱离祖先 transform / overflow 裁剪；补齐 `before-enter` 等四个动画事件透传

### 🐛 Bug Fixes | Bug 修复

- **snake-skeleton:** 占位色适配暗色模式（主题变量此前未定义，长期落在浅灰 fallback）
- **snake-calendar:** 修复 `is-page` 内嵌模式整体不渲染
- **snake-calendar:** 修复「今天」标记被 `minDate` / `maxDate` 钳制错位
- **snake-calendar:** `change` 事件 `week` 改为随语言返回
- **snake-button:** 修复 `type="info"` 无样式、禁用态文字不可见、plain 禁用不可区分等多个状态死角
- **exports:** 补充 `./components/snake-cms/types` 显式入口，修复 TS bundler 解析报 TS2307

### ⚙️ Changes | 变更

- **snake-calendar:** 移除双十一内置节日；底部确定按钮占满整行
- **snake-button:** 加载态改用内置 `snake-loading` 指示器，颜色继承文字色
- **主题:** `--snake-color-primary-light` 修正为主色 10% 透明度，相关 fallback 同步
- **仓库:** 迁移至 GitHub 组织 [purenia-ai/snake-ui](https://github.com/purenia-ai/snake-ui)，补 MIT LICENSE 与文档站入口

### ✏️ Documentation | 文档

- 更新日志改为 Keep a Changelog 结构；二维码演示页收敛为卡片布局

## [0.0.3](https://github.com/purenia-ai/snake-ui/compare/v0.0.2...v0.0.3)（2026-10-29）

### 🐛 Bug Fixes | Bug 修复

- **exports:** `./libs/request`、`./libs/runtime` 等深层路径提供显式入口，修复 TS / Vite 无法解析

### ✏️ Documentation | 文档

- 新增 `pnpm changelog:sync`，文档站更新日志随发版自动对齐

## [0.0.2](https://github.com/purenia-ai/snake-ui/compare/v0.0.1...v0.0.2)（2026-10-29）

### ✨ Features | 新功能

- **exports:** 补齐 `./libs/*` 等子路径，可直接按路径 import

> 注：0.0.1 – 0.0.3 发布自同一份工作区快照（npm registry 记录的 gitHead 均为 afb1b62），版本间差异只存在于 npm 包内容，git 比对在此期间为空；自 0.0.3 起改动随提交入库。

## 0.0.1（2026-10-29）

### ✨ Features | 新功能

- 首个 npm 公开发布版本（MIT）。基于 Vue 3 + TypeScript 的 uni-app 组件库，面向商城与 CMS 场景
- 46 个通用组件 + 14 个配置驱动的 CMS 页面区块（`snake-cms` 统一渲染）
- 内置明暗主题、中英文多语言、HTTP 客户端与常用 hooks / 工具
- 兼容 H5、微信 / 支付宝小程序、App 等多端
