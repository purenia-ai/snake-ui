# Snake UI 详细组件文档与 CMS 标识实施计划

## 目标

参考 uView2 的信息组织方式，将 Snake UI 的 32 篇组件文档扩充为完整使用手册，并为 20 个商城装修业务组件在侧边栏和文档标题处添加绿色 `CMS` 标识。

## 实施原则

- 逐个读取 Snake UI 当前组件源码，文档只描述真实存在的 Props、Events、Slots 和 Methods。
- 参考 uView2 的文档结构，不复制其未实现接口、品牌内容或示例代码。
- 不修改组件运行逻辑、npm 导出、预览路由和 iframe 布局。
- 对声明但未实际使用的参数标记为“兼容预留”。
- 对依赖平台 API 或业务适配器的功能明确说明限制，不虚构真机验证结果。

## 任务 1：建立文档完整性回归检查

涉及文件：

- 新增 `scripts/component-docs.test.mjs`
- 修改根 `package.json`

步骤：

1. 维护 12 个基础组件和 20 个 CMS 组件的显式清单。
2. 断言 32 篇文档均包含简介、平台兼容性、基础用法和 API 标题。
3. 断言 20 篇 CMS 文档包含 CMS frontmatter 和标题标识。
4. 断言 12 篇基础组件不包含 CMS 标识。
5. 断言 Props 表包含“参数、说明、类型、默认值、可选值”列。
6. 保留现有 32 个 frontmatter 与示例路由一一对应检查。
7. 添加 `test:component-docs` 命令并先运行，确认当前文档结构会失败。

## 任务 2：实现可复用 CMS 标识样式

涉及文件：

- 修改 `docs/.vitepress/config.mts`
- 修改 `docs/.vitepress/theme/custom.css`
- 如原生 sidebar 文本无法安全渲染标记，最小修改 `docs/.vitepress/theme/Layout.vue` 或新增主题组件

步骤：

1. 为 20 个 CMS 导航项增加显式标识元数据或可识别的统一标记。
2. 在侧边栏文字末尾渲染短文本 `CMS`，不依赖 URL 模糊匹配。
3. 添加 `.cms-badge` 和侧边栏徽标样式：绿色轻背景、深绿色文字、胶囊圆角、小字号。
4. 适配浅色、暗色、当前导航项、换行和窄屏。
5. 不对“基础组件”分组应用标识。
6. 使用 VitePress 构建验证主题扩展无 SSR 错误。

## 任务 3：源码核对并生成组件接口清单

涉及范围：

- `src/uni_modules/snake-ui/components/**/**/*.vue`
- `src/uni_modules/snake-ui/index.ts`
- `src/uni_modules/snake-ui/index.d.ts`
- `src/uni_modules/snake-ui/types/index.d.ts`

步骤：

1. 对 32 个公开组件记录 Props 名称、类型、默认值和枚举。
2. 记录 Events、事件参数和触发条件。
3. 记录 Slots、作用域参数以及通过 ref 暴露的方法。
4. 标出声明但未使用、只在特定平台使用或依赖外部适配器的字段。
5. 对 `datas`、`setStyle`、列表项等对象结构继续追踪模板和方法中的实际字段访问。
6. 将核对结果直接用于文档改写，不新增与运行时重复维护的公开接口文件。

## 任务 4：详细改写 12 篇基础组件文档

涉及文件：

- `docs/components/button.md`
- `docs/components/icon.md`
- `docs/components/image.md`
- `docs/components/lazy-image.md`
- `docs/components/swiper.md`
- `docs/components/tabs.md`
- `docs/components/notice-bar.md`
- `docs/components/loadmore.md`
- `docs/components/empty.md`
- `docs/components/overlay.md`
- `docs/components/popup.md`
- `docs/components/sticky.md`

每篇按需补充：

1. 组件简介和适用场景。
2. H5、微信小程序、App 兼容性表。
3. 最小基础用法。
4. 2 至 4 个真实进阶场景，例如状态、样式、方向、对象数据源和组合使用。
5. 完整 Props 表，包含可选值。
6. Events、Slots 和 Methods 表。
7. 平台限制、尺寸语义和当前兼容预留参数。
8. 源码相对路径。

完成后运行 `test:component-docs` 和 VitePress 构建。

## 任务 5：详细改写内容与容器类 CMS 文档

涉及文件：

- `snake-cms.md`
- `custom-module.md`
- `images.md`
- `picture-ads.md`
- `magic-cube.md`
- `videos.md`
- `rich-text.md`
- `notice.md`
- `auxiliary-segmentation.md`

步骤：

1. 添加 `cms: true` frontmatter 和标题 CMS 标识。
2. 添加兼容性表与运行依赖说明。
3. 提供完整最小数据示例。
4. 对 `datas` / `setStyle` 建立字段表，标记类型、是否必填、默认行为和副作用。
5. 补充图片、轮播、视频、富文本在不同平台的行为限制。
6. Snake CMS 保留并扩充组件映射、数据流、分页方法和插槽说明。

## 任务 6：详细改写导航与互动类 CMS 文档

涉及文件：

- `graphic-navigation.md`
- `commodity-search.md`
- `suspension.md`
- `page-popup.md`
- `jump-applet.md`
- `follow.md`

步骤：

1. 添加 CMS 元数据和标题标识。
2. 补充跳转字段、点击行为和平台专有 API 说明。
3. 标明 fixed 定位、滚动位置、小程序开放能力和 WebView 限制。
4. 完整记录 Events、Slots 和无事件组件的实际行为。

## 任务 7：详细改写商品类 CMS 文档

涉及文件：

- `goods-list.md`
- `activity-list.md`
- `filter-sorts.md`
- `list-switching.md`
- `coupon.md`

步骤：

1. 添加 CMS 元数据和标题标识。
2. 补充商品项、活动项、筛选配置、列表切换配置和优惠券配置字段表。
3. 说明分页、排序、筛选、领取资格和导航副作用。
4. 明确业务请求由运行时适配器提供，示例预览使用本地 mock。
5. 完整记录事件参数和组件引用方法。

## 任务 8：自动验证

按顺序运行：

1. `pnpm.cmd run test:component-docs`
2. `pnpm.cmd run test:preview-structure`
3. `pnpm.cmd run test:uview-dependency`
4. `pnpm.cmd run type-check`
5. `pnpm.cmd run build:h5`
6. `pnpm.cmd run build:mp-weixin`
7. `pnpm.cmd run build:app`
8. `pnpm.cmd run docs:build:preview`

组合构建前如果 `5174` 开发进程锁定 `.vitepress/.temp`，只在确认进程属于当前 Snake UI 文档后停止，并在构建后恢复开发服务。

## 任务 9：页面验收

1. 检查侧边栏 20 个 CMS 标识和 12 个基础组件无标识。
2. 检查 CMS 标题标识在浅色、暗色和窄屏下的布局。
3. 抽查 Button、Popup、Tabs、Swiper 四篇基础文档的多个用法和 API 表。
4. 抽查 Snake CMS、图文导航、商品列表、优惠券四篇业务文档的数据结构和限制说明。
5. 确认本页目录包含新增章节且未遮挡右侧手机预览。
6. 确认 32 个实时预览路径仍可访问。

## 完成标准

- 32 篇文档的信息结构统一且内容与源码一致。
- 20 个 CMS 组件在侧边栏和标题处均有清晰标识。
- 基础组件不被误标。
- 用户可从单篇文档得到平台兼容、完整接口、配置结构、用法和限制。
- 所有结构测试、类型检查、多端构建和文档构建通过。
