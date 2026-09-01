# Snake UI 演示架构重构设计

## 背景

`src/demo/DemoRenderer.vue` 集中维护所有公开组件的演示状态、模拟数据、事件、模板和样式。把这些分支转移到 Showcase 和注册表后，组件页面仍只是 `<DemoRenderer kind="..." />` 的薄入口，页面本身依然无法独立维护。

uView Pro 的实际模式是：公共 `demo-page` 提供页面外壳，每个 `pages/components*/组件/index.vue` 自己维护演示模板、状态、配置和事件。本次采用这一模式，不把任务、评分和引导等额外职责加入公共页面组件。

## 目标

- 完全删除 `src/demo` 和中央 `DemoRenderer.vue`。
- 每个组件的模板、状态、参数、事件和专属样式写在当前 `index.vue`。
- 公共演示外壳放入 `src/components`，公共样式和双语逻辑放入 `src/common`。
- 保持页面路由、文档预览地址、实时参数控制、双语和视觉行为不变。
- CMS 与商品的大体积纯模拟数据允许共享，普通组件数据与页面共置。

## 非目标

- 不调整 `src/uni_modules/snake-ui/components` 的公开目录和 API。
- 不移动或重命名 `src/pages/componentsA|B` 下的路由页面。
- 不引入 Showcase 注册表、动态组件分派或新依赖。
- 不复制 uView Pro 源码、样式变量、任务、评分或引导系统。
- 第一阶段只做等价迁移，不顺便重新设计演示效果。

## 目标目录

```text
src/
├─ components/
│  ├─ demo-page/demo-page.vue
│  ├─ demo-section/demo-section.vue
│  ├─ demo-control-panel/demo-control-panel.vue
│  └─ demo-tabbar/demo-tabbar.vue
├─ common/
│  ├─ demo.scss
│  ├─ demo-i18n.ts
│  ├─ demo-types.ts
│  └─ fixtures/
│     ├─ cms.ts
│     └─ goods.ts
├─ pages/
│  ├─ componentsA/
│  └─ componentsB/
└─ uni_modules/
```

完成后不存在 `src/demo`、`DemoRenderer.vue`、`showcase-registry.ts` 或 `showcases`。

## 页面职责

每个组件页面直接组合公共外壳和 Snake UI 组件。页面拥有当前演示的全部可变状态、控制项和事件；阅读一个 `index.vue` 即可理解该组件如何演示，不需要跳转到中央 Renderer、注册表或领域 Showcase。

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import DemoPage from '@/components/demo-page/demo-page.vue';
import DemoSection from '@/components/demo-section/demo-section.vue';

const state = reactive({ radius: 16 });
</script>

<template>
    <DemoPage title="图片">
        <DemoSection title="演示效果">
            <snake-image :radius="state.radius" />
        </DemoSection>
    </DemoPage>
</template>
```

## 公共职责

- `demo-page`：导航、标题、主题、语言入口、内容和底部演示导航。
- `demo-section`：演示效果、参数配置等统一区块。
- `demo-control-panel`：根据当前页面传入的控制项渲染选择、开关、滑块和输入。
- `demo-tabbar`：组件、工具和关于页面的底部导航。
- `common/demo.scss`：跨页面主题变量和基础演示布局。
- `common/demo-i18n.ts`：语言状态、持久化、切换和公共文本。
- `common/demo-types.ts`：`DemoControl`、`DemoValue` 等公共类型，不保存 52 个组件的集中配置。
- `common/fixtures`：CMS、活动、筛选和商品等大体积纯数据或工厂函数。

公共组件不保存具体组件状态，也不根据组件名选择内容。Fixtures 不包含响应式对象、组件引用、计时器、平台 API 或事件处理。

## 迁移策略

迁移期间允许已迁移页面与旧 Renderer 页面并存：

1. 将公共演示组件迁入 `src/components`，样式、国际化和类型迁入 `src/common`。
2. 将 Button、Icon、Image、LazyImage 的临时 Showcase 内容移动到各自页面并删除注册项。
3. 迁移其余基础与反馈组件页面。
4. 迁移表单组件页面。
5. 迁移导航与布局组件页面。
6. 迁移 CMS 与商品组件页面，共享纯数据下沉到 `common/fixtures`。
7. 删除 Renderer、注册表、Showcase、集中配置和整个 `src/demo`。
8. 收紧测试，禁止组件页面重新依赖中央 Renderer。

同一个页面在任一提交中只能存在一个演示入口。每个领域独立提交，不使用 `git reset` 回退已提交工作。

## 兼容与样式

- `pages.json` 和文档 frontmatter 中的 52 个预览地址保持不变。
- 标题、分类、描述、默认值和控制项从集中配置等价迁移到当前页面。
- 页面计时器、弹层和全局滚动状态由当前页面或组件在卸载时清理。
- 通用主题和布局放在 `common/demo.scss`；专属样式与当前页面共置并 scoped。
- 不引入 `u-*` 类名或 uView Pro 运行时。
- 暗色模式、窄屏、文档手机预览和中英文显示保持一致。

## 测试与验证

- 确认 52 个组件页面不再只是 Renderer 薄入口。
- 禁止 `src/pages/componentsA|B` 导入 `DemoRenderer`。
- 最终验证 `src/demo` 不存在。
- 保留路由、文档、双语、分组展示和组件交互测试。
- 每个领域运行结构测试、类型检查、ESLint 和 H5 构建。
- 全部完成后运行全量测试和 VitePress 文档构建。

## 验收标准

- 每个组件演示可在对应 `index.vue` 直接阅读和修改。
- `src/demo`、中央 Renderer、注册表和 Showcase 全部删除。
- 公共演示组件不包含具体组件分派逻辑。
- 52 个预览页面原地址、控制项、双语和视觉行为保持一致。
- 发布包不依赖演示应用代码，也不引入 uView Pro 运行时。
- 类型检查、Lint、全量测试、H5 构建和文档构建全部通过。

## 提交策略

- 本次设计修订独立提交。
- 实现按公共基础、基础反馈、表单、导航布局、CMS 商品分批提交。
- 已建立的公共组件和临时 Showcase 通过向前迁移调整。
- 构建产物、缓存和无关修改不进入提交。
