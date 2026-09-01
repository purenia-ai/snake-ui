# Snake UI 演示架构重构设计

## 背景

`src/demo/DemoRenderer.vue` 当前集中维护所有公开组件的演示状态、模拟数据、事件、模板分支和局部样式。文件已超过 1100 行，并包含近 50 个按 `kind` 分派的模板分支。增加或调整单个组件演示时，需要同时理解大量无关内容，容易产生冲突和回归。

本次参考 uView Pro 的演示工程组织方式。uView Pro 将具体组件演示放在独立页面，并通过公共 `demo-page` 和共享样式提供页面外壳；但其公共外壳也混入导航、引导、互动和评分等职责，文件超过 1400 行。Snake UI 只吸收“按组件或领域隔离演示”的优点，不复制巨型公共外壳和额外体验功能。

## 目标

- 将 `DemoRenderer.vue` 缩减为演示配置协调与 Showcase 分派入口，目标不超过约 120 行。
- 按基础、表单、导航和 CMS/商品领域隔离演示实现。
- 复杂组件使用独立 Showcase，简单且相关的组件允许共享领域 Showcase。
- 将大体积静态演示数据移出组件逻辑，降低单文件认知成本。
- 保持现有页面路由、文档预览地址、实时参数配置、双语切换和组件公开 API 不变。
- 第一阶段仅进行等价迁移，不改变既有演示效果和交互契约。

## 非目标

- 不调整 `src/uni_modules/snake-ui/components` 的公开组件目录。
- 不移动 `src/pages/componentsA`、`src/pages/componentsB`，也不修改其路由地址。
- 不引入动态远程加载、新依赖、评分系统、任务系统或新手引导。
- 不在重构过程中顺便重新设计组件视觉或业务数据协议。
- 不要求每个公开组件都对应一个独立文件；避免产生大量只有几行模板的文件。

## 目录结构

```text
src/demo/
├─ components/
│  ├─ DemoPage.vue
│  ├─ DemoSection.vue
│  ├─ DemoControlPanel.vue
│  └─ DemoTabbar.vue
├─ showcases/
│  ├─ foundation/
│  ├─ forms/
│  ├─ navigation/
│  └─ commerce/
├─ fixtures/
│  ├─ common.ts
│  ├─ cms.ts
│  ├─ goods.ts
│  └─ navigation.ts
├─ DemoRenderer.vue
├─ showcase-registry.ts
├─ demo-config.ts
├─ demo-i18n.ts
├─ demo-tabbar.ts
└─ theme.scss
```

`components` 保存所有演示共用的页面和控制组件。`showcases` 保存具体组件的演示实现。`fixtures` 只保存静态数据或创建演示数据的纯函数。配置、国际化和主题文件暂留根目录，避免为少量文件增加无收益层级。

## 模块职责

### DemoRenderer

`DemoRenderer.vue` 继续作为所有薄路由页面的稳定入口，接收现有 `kind` 和 `title`。它负责：

1. 根据 `kind` 读取演示定义和本地化信息。
2. 创建当前演示的参数状态。
3. 从注册表取得对应 Showcase。
4. 组合 `DemoPage`、预览区和 `DemoControlPanel`。
5. 将演示上下文通过明确的 Props 和 Events 传给 Showcase。

它不再包含组件专属模拟数据、大量事件处理、几十个模板条件分支或组件专属样式。

### Showcase 注册表

`showcase-registry.ts` 使用静态导入建立 `kind` 到 Showcase 的映射。静态注册能够兼容 uni-app 多端编译，也便于 TypeScript 和测试检查，不使用运行时字符串路径或远程动态组件。

未注册的 `kind` 显示明确的开发期占位提示，不抛出导致整个预览页面白屏的异常。现有 52 个演示类型必须全部注册。

### Showcase

Showcase 只负责某个复杂组件或一组简单相关组件的演示内容。建议初始分组如下：

- `foundation`：Button 独立；图片媒体一组；反馈浮层一组；其余基础展示一组。
- `forms`：Form/FormItem 独立；输入类一组；选择类一组。
- `navigation`：Tabs/Swiper 等导航一组；DropMenu/IndexList 等复杂布局可按需要独立。
- `commerce`：SnakeCms 独立；商品列表与筛选一组；CMS 内容一组；CMS 营销一组。

普通 Showcase 尽量控制在 250 行以内。某个文件超过该范围且同时包含多个可独立理解的演示时，再按职责拆分；不为了满足行数机械拆文件。

### Fixtures

Fixtures 保存商品、活动、CMS 页面配置、图片和导航等静态演示数据，或返回新数据对象的纯函数。响应式状态、组件引用、计时器、平台 API 和事件处理不得进入 fixtures。

可变对象由工厂函数返回，避免不同页面实例共享并污染同一对象。

### 公共演示组件

现有 `DemoPage`、`DemoSection`、`DemoControlPanel` 和 `DemoTabbar` 移入 `components`。移动只调整内部导入路径，不改变 Props、Events、Slots 和视觉表现。`DemoPage` 保持页面外壳职责，不吸收 uView Pro 的任务、评分、收藏或引导逻辑。

## 数据流

```text
薄路由页面
  -> DemoRenderer(kind, title)
      -> demo-config + demo-i18n
      -> reactive demoState
      -> showcase-registry[kind]
          -> Showcase(props: state/context, events: update/action)
      -> DemoControlPanel(updateDemoValue)
```

`demoState` 仍由 `DemoRenderer` 创建，保证控制面板与 Showcase 使用同一状态源。Showcase 不直接修改配置定义；对外动作通过事件回传，或通过只包含演示能力的窄上下文执行。

## 迁移策略

重构按领域分批进行，每批均保持当前 `kind`、预览内容和参数行为：

1. 创建目录、公共类型和静态注册表，移动公共演示组件。
2. 迁移基础与反馈 Showcase，并移走对应样式和 fixtures。
3. 迁移表单 Showcase。
4. 迁移导航与布局 Showcase。
5. 迁移 CMS 与商品 Showcase。
6. 删除 `DemoRenderer` 中已迁移的旧状态、分支和样式，收紧结构测试。

迁移期间注册表允许新旧实现并存，但同一个 `kind` 只能有一个实际渲染路径。每批独立提交，便于定位和回退。

## 兼容与异常处理

- `src/pages/componentsA|B/*/index.vue` 继续导入同一路径的 `DemoRenderer.vue`。
- `pages.json`、文档 frontmatter 中的 `preview` 地址以及 52 个组件页面保持不变。
- Showcase 加载失败或未注册时显示组件名称和诊断文本；生产演示不输出敏感对象。
- Popup、Overlay、计时器及全局滚动状态仍由所属 Showcase 在卸载时清理。
- Fixtures 中缺少可选字段时沿用当前组件的默认和空状态表现。

## 样式策略

- `theme.scss` 继续保存跨演示共享的主题变量和通用视觉规则。
- Showcase 专属样式与对应 Showcase 共置并使用 scoped 样式。
- 不复制 uView Pro 的 `common/demo.scss`，也不引入 `u-*` 类名或运行时依赖。
- 重构前后的暗色模式、窄屏布局、文档手机预览尺寸和中英文显示保持一致。

## 测试与验证

- 更新预览结构测试，确认 52 个 `kind` 均存在注册项和可解析 Showcase。
- 增加架构约束测试，确保 `DemoRenderer.vue` 不再包含长 `kind` 条件链，并限制其职责性体积。
- 保留现有组件文档、路由、双语、分组展示和交互一致性测试。
- 每个迁移批次运行相关测试、TypeScript 类型检查和 ESLint。
- 完成全部迁移后运行全量测试、H5 构建和 VitePress 文档构建。
- 当前环境不能替代真实小程序和 App 运行；涉及条件编译的演示在 H5 编译通过之外，还需确保分支语法未被动态组件方案破坏。

## 验收标准

- `DemoRenderer.vue` 只承担配置、状态和分派职责，不再维护组件专属模板与大体积 fixtures。
- 52 个现有演示页面均可通过原地址访问，参数控制和双语切换行为不变。
- Showcase 目录按领域可定位，复杂演示具有独立边界，简单演示没有被机械拆成大量碎片文件。
- 公共演示组件没有新增与页面外壳无关的体验功能。
- Snake UI 运行时代码和发布包不依赖演示目录，也不引入 uView Pro 运行时。
- 类型检查、Lint、全量测试、H5 构建和文档构建全部通过。

## 提交策略

- 本设计文档独立提交。
- 实现阶段按基础、表单、导航、CMS/商品领域拆分提交。
- 构建产物、缓存和无关工作区修改不进入提交。
