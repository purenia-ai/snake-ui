# Snake UI 基础组件完整化实施计划

## 目标

在不引入 uView Pro 运行时依赖、不破坏现有 `snake-*` API 的前提下，建设可复用组件底座，并将 Button、Icon、Image、LazyImage、Overlay、Popup、Sticky 升级为可正式发布的跨端基础组件。

## 原则

- 先补测试和公共底座，再迁移组件，避免七个组件各自复制工具代码。
- 参考 uView Pro 的 MIT 实现，但所有命名、主题、类型和运行时入口改为 Snake UI。
- 保留现有 Props、事件、插槽和暴露方法；新增能力不得改变旧默认行为。
- 每个任务完成后运行最小相关测试，整批结束后运行完整三端验证。
- 不修改 CMS 数据模型，仅修复基础组件升级引发的兼容问题。

## 任务 1：建立第一批组件契约测试

涉及文件：

- 新增 `scripts/foundation-parity.test.mjs`
- 修改 `package.json`

步骤：

1. 增加 `test:foundation-parity` 脚本。
2. 校验 Transition、LoadingIcon、Button、Icon、Image、LazyImage、Overlay、Popup、Sticky 的目录、类型和根导出。
3. 校验旧 Props、事件及插槽仍存在。
4. 校验新增核心 Props、事件和暴露方法存在。
5. 校验源码不包含 `uni.$u`、`uview-pro` 导入和 `<u-*>` 标签。
6. 运行测试并确认在实现前按预期失败。

## 任务 2：实现通用函数与平台底座

涉及文件：

- 新增 `src/uni_modules/snake-ui/libs/functions/debounce.ts`
- 新增 `src/uni_modules/snake-ui/libs/functions/throttle.ts`
- 新增 `src/uni_modules/snake-ui/libs/functions/style.ts`
- 新增 `src/uni_modules/snake-ui/libs/dom/query.ts`
- 新增 `src/uni_modules/snake-ui/libs/internal/z-index.ts`
- 修改 `src/uni_modules/snake-ui/libs/functions/index.ts`
- 修改 `src/uni_modules/snake-ui/libs/index.ts`
- 新增对应 Node 测试或扩展 `scripts/foundation-parity.test.mjs`

步骤：

1. 实现带取消能力的 debounce 和 throttle，并保证首次与末次调用语义明确。
2. 实现尺寸归一化、样式对象序列化和安全数值处理。
3. 封装基于 `uni.createSelectorQuery` 的单节点/多节点测量，支持组件实例作用域。
4. 建立遮罩、弹层、通知等默认层级常量。
5. 从内部入口导出需要复用的函数，但不扩大 npm 稳定公共 API。
6. 运行运行时和新增测试。

## 任务 3：实现 Transition 与 LoadingIcon

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-transition/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-transition/snake-transition.vue`
- 新增 `src/uni_modules/snake-ui/components/snake-loading-icon/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-loading-icon/snake-loading-icon.vue`
- 修改 `src/uni_modules/snake-ui/index.ts`
- 修改 `src/uni_modules/snake-ui/index.d.ts`
- 修改 `src/uni_modules/snake-ui/types/index.d.ts`
- 修改 `src/pages.json` easycom 配置（若当前为显式映射）

步骤：

1. Transition 支持 fade、zoom、slide 四向组合、duration、timingFunction、customStyle 和 show。
2. Transition 正确触发 before-enter、enter、after-enter、before-leave、leave、after-leave 和 click。
3. LoadingIcon 支持 circle、spinner、size、color、text、textColor、textSize、vertical 和 inactive。
4. 两个组件使用 Snake 主题变量并兼容 H5、微信小程序和 App 样式语法。
5. 增加组件根导出、类型导出和 easycom 可发现性。
6. 运行契约测试、类型检查和 H5 构建。

## 任务 4：完整化 Button

涉及文件：

- 重写 `src/uni_modules/snake-ui/components/snake-button/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-button/snake-button.vue`
- 修改 `docs/components/button.md`
- 修改 `src/demo/DemoRenderer.vue`

步骤：

1. 保留 type、plain、disabled、loading、customStyle 和默认插槽。
2. 新增 size、shape、hairline、loadingText、loadingMode、loadingSize、icon、iconColor、color、throttleTime、formType、openType、appParameter、hoverStopPropagation、lang、sessionFrom、sendMessageTitle、sendMessagePath、sendMessageImg、showMessageCard、dataName。
3. 支持 click、getphonenumber、getuserinfo、error、opensetting、launchapp、contact、chooseavatar、agreeprivacyauthorization 等平台事件。
4. 使用 LoadingIcon，正确处理 disabled/loading 下的点击与按压态。
5. 增加全尺寸、形状、状态、图标和自定义色演示。
6. 运行契约测试、类型检查和微信小程序构建。

## 任务 5：完整化 Icon

涉及文件：

- 重写 `src/uni_modules/snake-ui/components/snake-icon/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-icon/snake-icon.vue`
- 新增或迁移 `src/uni_modules/snake-ui/components/snake-icon/iconfont.*`
- 修改 npm 发布清单相关测试
- 修改 `docs/components/icon.md`
- 修改 `src/demo/DemoRenderer.vue`

步骤：

1. 引入可随包发布的完整图标资源，消除当前五个硬编码图标限制。
2. 支持 name、color、size、bold、index、label、labelPos、labelColor、labelSize、space、imgMode、width、height、top、stop、customPrefix 和 customStyle。
3. 同时支持内置图标、图片 URL 和用户自定义图标字体。
4. 补齐 click 事件和无障碍标签。
5. 文档增加图标总览与搜索入口。
6. 验证 npm 打包内容包含字体资源。

## 任务 6：完整化 Image 与 LazyImage

涉及文件：

- 重写 `src/uni_modules/snake-ui/components/snake-image/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-image/snake-image.vue`
- 重写 `src/uni_modules/snake-ui/components/snake-lazy-image/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-lazy-image/snake-lazy-image.vue`
- 修改对应文档和 `src/demo/DemoRenderer.vue`

步骤：

1. Image 支持 width、height、mode、shape、radius、lazyLoad、showMenuByLongpress、fade、duration、bgColor、webp 和 preview。
2. 增加 loading、error 插槽以及 load、error、click 事件；图片地址变化时重置状态。
3. LazyImage 通过节点测量与页面滚动/IntersectionObserver 可用能力判断可见性。
4. 不支持可视检测的平台回退为普通 Image，保证图片不会永久空白。
5. 验证正常、加载、失败、圆角和长列表懒加载演示。

## 任务 7：完整化 Overlay 与 Popup

涉及文件：

- 重写 `src/uni_modules/snake-ui/components/snake-overlay/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-overlay/snake-overlay.vue`
- 重写 `src/uni_modules/snake-ui/components/snake-popup/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-popup/snake-popup.vue`
- 修改对应文档和 `src/demo/DemoRenderer.vue`

步骤：

1. Overlay 基于 Transition 实现 show、duration、opacity、zIndex、lockScroll 和 customStyle。
2. Popup 支持 center/top/right/bottom/left、round、zoom、duration、safeAreaInsetBottom、closeable、closeIcon、closeIconPos、closeOnClickOverlay、overlayStyle、customStyle 和 zIndex。
3. 保留现有 open()/close() 暴露方法，并增加受控 show/modelValue 支持。
4. 完整触发 open、opened、close、closed、change、click-overlay 事件。
5. 处理连续开关、动画中关闭、页面滚动锁定和安全区。
6. 在手机预览中逐方向验证定位和遮罩覆盖。

## 任务 8：完整化 Sticky

涉及文件：

- 重写 `src/uni_modules/snake-ui/components/snake-sticky/types.ts`
- 重写 `src/uni_modules/snake-ui/components/snake-sticky/snake-sticky.vue`
- 修改 `docs/components/sticky.md`
- 修改 `src/demo/DemoRenderer.vue`

步骤：

1. 增加 offsetTop、customNavHeight、disabled、zIndex、index 和 customStyle。
2. 通过节点测量计算占位高度、固定位置与容器边界。
3. 支持页面滚动及外部传入 scrollTop 两种更新路径。
4. 触发 fixed、unfixed 和 change 事件，并暴露 update() 重新测量方法。
5. CSS sticky 可作为 H5 优化，但不作为唯一实现。
6. 在 H5、微信小程序和 App 构建中验证无 DOM 专用调用泄漏。

## 任务 9：统一主题、导出、文档和预览

涉及文件：

- 修改 `src/uni_modules/snake-ui/theme.scss`
- 修改 `src/uni_modules/snake-ui/index.scss`
- 修改 `src/uni_modules/snake-ui/index.ts`
- 修改 `src/uni_modules/snake-ui/index.d.ts`
- 修改 `src/uni_modules/snake-ui/types/index.d.ts`
- 修改 `src/uni_modules/snake-ui/package.json`
- 修改七个组件文档和两个新底座组件文档
- 修改 VitePress 侧边栏与组件总览
- 修改 uni-app 示例路由与 DemoRenderer

步骤：

1. 增加颜色、圆角、字号、禁用态、动画和层级变量。
2. 确保所有新增组件支持 easycom、命名导入和类型导入。
3. 文档 API 表与源码类型保持一致，明确新增能力和旧 API 兼容情况。
4. 在组件总览中新增 Transition 和 LoadingIcon；CMS 标识保持不变。
5. 手机预览使用真实组件和真实路由，Popup/Overlay 使用完整视口模式。
6. 更新第三方声明中的适配范围，不复制 uView Pro 品牌素材。

## 任务 10：完整验证与分批提交

按顺序执行：

1. `npm run test:foundation-parity`
2. `npm run test:runtime`
3. `npm run test:foundation`
4. `npm run test:component-contracts`
5. `npm run test:uview-dependency`
6. `npm run test:preview-structure`
7. `npm run type-check`
8. `npm run lint`
9. `npm run build:h5`
10. `npm run build:mp-weixin`
11. `npm run build:app`
12. `npm run docs:build:preview`

验证完成后检查 `git diff --check`，确认没有意外修改 CMS 组件及用户文件。提交按“底座”“展示组件”“弹层与定位”“文档与验证”拆分，便于回溯。

## 完成标准

- 七个现有核心组件不再是轻量壳，具备设计文档约定的正式公共 API 和交互能力。
- Transition、LoadingIcon 和共享工具可被后续组件复用。
- 原有 Snake UI 用法保持兼容，源码和产物中不存在 `uni.$u` 或 uView Pro 运行时依赖。
- H5、微信小程序、App 和 VitePress 构建通过。
- 文档、真实预览、根导出、类型声明和 npm 发布内容一致。
