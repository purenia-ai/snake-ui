# Snake UI 移除 uView Pro 实施计划

对应设计：`docs/superpowers/specs/2026-08-12-remove-uview-pro-design.md`

## 阶段一：建立无 uView 约束和公共工具

1. 新增依赖审计测试，扫描源码、入口配置和包元数据中的 `uview-pro`、`uni.$u` 与有效 `u-*` 标签。
2. 扩展 `libs`，集中提供尺寸标准化、`custom-style` 转换、颜色和跨端安全辅助函数。
3. 为公共工具增加单元测试，明确数字尺寸与字符串尺寸的处理规则。
4. 此阶段暂不删除依赖，先让审计测试以预期方式失败，作为迁移完成条件。

## 阶段二：实现最小展示基础组件

按依赖关系依次实现：

1. `snake-icon`
   - 覆盖 search、close、close2、close-circle-fill、play-right-fill。
   - 支持 name、color、size、bold、customStyle 和 click。
2. `snake-image`
   - 支持 src、mode、width、height、radius、lazyLoad、showError、errorIcon。
   - 转发 load、error、click。
3. `snake-lazy-image`
   - 基于 `snake-image`，兼容当前 src、loading-img、error-img、threshold、index 用法。
4. `snake-empty`
   - 支持 mode、text、icon、iconSize、customStyle 和默认插槽。
5. `snake-loadmore`
   - 支持 status、loadText、loadingText、nomoreText 与基础 loading 图形。

每完成一个组件：

- 加入 `index.ts` 与 `index.d.ts` 的具名导出。
- 增加结构/API 测试。
- 建立对应文档页和独立 H5 示例路由。

## 阶段三：实现交互基础组件

1. `snake-overlay`
   - 实现 modelValue、opacity、zIndex、duration、customStyle、click。
   - 避免点击内容时误触遮罩关闭。
2. `snake-popup`
   - 组合 overlay，支持 center/top/right/bottom/left。
   - 实现 modelValue、mode、bgColor、zIndex、closeOnClickOverlay、safeAreaInsetBottom。
   - 提供 open、close、change 和 `update:modelValue`。
3. `snake-button`
   - 基于原生 button，支持 type、plain、disabled、loading、customStyle。
   - 清理原生 button 默认边框，并保留表单相关透传能力。
4. `snake-tabs`
   - 支持 list、current、lineColor、activeStyle、inactiveStyle、scrollable。
   - 兼容字符串项和含 name 字段的对象项，change 返回 index 与条目。
5. `snake-sticky`
   - 支持 offsetTop、zIndex、customStyle。
   - H5、微信小程序和 App 优先走 CSS sticky；为不支持的运行环境保留普通文档流降级。
6. `snake-notice-bar`
   - 支持 text、list、direction、mode、color、bgColor、speed、step、volumeIcon、moreIcon。
   - 实现 click/change，无法动画时稳定展示当前文本。
7. `snake-swiper`
   - 基于原生 swiper/swiper-item/image。
   - 支持 list、current、height、autoplay、interval、duration、circular、indicator、imgMode。
   - 实现 change、click，并兼容字符串图片与对象图片。

每个交互组件先测试状态变化与事件契约，再接入现有业务组件。

## 阶段四：迁移现有 Snake UI 组件

按风险从低到高替换：

1. `snake-commodity-search`、`snake-notice`、`snake-suspension` 的 icon/notice-bar。
2. `snake-goods-list`、`snake-videos` 的 image/lazy-image/icon。
3. `snake-coupon`、`snake-page-popup`、`snake-videos` 的 popup。
4. `snake-filter-sorts/filter-page.vue` 的 overlay/button。
5. `snake-picture-ads` 的 swiper。
6. `snake-list-switching` 的 tabs。
7. `snake-cms` 的 sticky、tabs、loadmore、empty。

替换时保持现有业务组件 props、事件与数据结构不变。每组替换后运行类型检查、H5 构建和相关预览结构测试，避免集中到最后排错。

## 阶段五：彻底删除 uView Pro

1. 从 `src/main.ts` 删除插件 import 和 `app.use(uViewPro)`。
2. 从 `src/App.vue` 删除 `uview-pro/index.scss`。
3. 从 `src/uni.scss` 删除 `uview-pro/theme.scss`，补入 Snake UI 必要主题变量入口。
4. 从 `src/pages.json` 删除 `^u-(.*)` easycom 规则；确认 `snake-*` easycom 规则覆盖公开基础组件。
5. 从根 `package.json` 删除 `uview-pro`。
6. 从 `src/uni_modules/snake-ui/package.json` 删除 peerDependencies 和 uni_modules dependencies 中的 uView Pro。
7. 运行 `pnpm install --lockfile-only` 更新锁文件；不改动无关依赖版本。
8. 运行依赖审计测试，要求源码、清单和锁文件零有效引用。

## 阶段六：文档和迁移说明

1. 为 12 个公开基础组件增加 VitePress 页面，包含：用途、基础用法、props、events、slots、平台支持。
2. 增加“从 uView Pro 迁移”页面，列出标签映射和兼容边界。
3. 更新 Snake UI 安装说明，删除 uView Pro 安装、注册和 SCSS 引入步骤。
4. 为基础组件增加 H5 预览 fixture 和路由，并确保文档 frontmatter 与路由一一对应。
5. 文档明确声明第一阶段只保证 H5、微信小程序和 App。

## 阶段七：跨端验证

依次执行并记录结果：

1. 公共工具与基础组件测试。
2. `pnpm run type-check`。
3. `pnpm run build:h5`。
4. `pnpm run build:mp-weixin`。
5. `pnpm run build:app`；若当前 CLI 实际要求 `app-plus`，以项目现有支持的命令执行并记录。
6. `pnpm run docs:build` 和预览结构测试。
7. 启动 H5 与 VitePress，抽查所有受迁移影响的示例交互及 iframe 展示。
8. 最终执行全仓依赖审计，确认没有运行时或包元数据 uView Pro 引用；历史设计文档中的参考文字不计入运行时依赖。

## 实施边界

- 不引入 wot-design-uni 或其他 UI 库。
- 不完整复刻 uView Pro 未被使用的 API。
- 不修改两个参考项目。
- 不发布 npm 包，不提交远程仓库。
- 不借迁移重构无关 CMS 业务逻辑。
