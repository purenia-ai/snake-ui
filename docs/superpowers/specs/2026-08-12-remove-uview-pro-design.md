# Snake UI 移除 uView Pro 依赖设计

## 目标

Snake UI 不再要求使用者安装或注册 uView Pro。当前由 uView Pro 提供的基础能力改为 Snake UI 自有的公开基础组件，并优先保证 H5、微信小程序和 App 可用。

迁移完成后，旧项目可将实际使用到的 `u-*` 组件逐步替换为对应的 `snake-*` 组件，不再引入 uView Pro 的 JavaScript、全局样式或 easycom 规则。

## 范围

第一阶段新增以下公开组件：

- `snake-icon`
- `snake-popup`
- `snake-overlay`
- `snake-button`
- `snake-image`
- `snake-lazy-image`
- `snake-tabs`
- `snake-sticky`
- `snake-notice-bar`
- `snake-loadmore`
- `snake-empty`
- `snake-swiper`

这些组件覆盖 Snake UI 当前源码中实际存在的 uView Pro 依赖。未被当前组件库使用的 uView Pro 组件不在第一阶段复制范围内；后续遇到真实业务需求时再按同一规范补充。

## 架构

基础组件放在 `src/uni_modules/snake-ui/components/` 下，作为正式公开 API，而不是放进 `_internal`。组件名、目录名和 easycom 标签统一使用 `snake-*`。

通用但不渲染 UI 的能力放入 `src/uni_modules/snake-ui/libs/`，例如单位转换、样式标准化和平台判断。组件之间可以复用这些轻量工具，但不能依赖 uView Pro、wot-design-uni 或其他 UI 组件库。

wot-design-uni 和 uView Pro 仅作为只读实现参考，用于理解跨端处理、组件拆分和 API 设计；Snake UI 不复制其包结构，也不增加对它们的运行时依赖。

## API 兼容策略

公开组件尽量保留 Snake UI 当前用到的 uView Pro 常用接口，使迁移以替换标签名为主：

- 双向绑定统一支持 Vue 3 `v-model`，即 `modelValue` 与 `update:modelValue`。
- 保留当前用到的 `mode`、`color`、`size`、`bg-color`、`custom-style`、`current`、`list`、`status` 等属性语义。
- 保留当前用到的 `click`、`change`、`close` 等事件。
- 兼容属性只覆盖当前项目真实用法和明确文档化的部分，不承诺完整复刻 uView Pro 的全部历史 API。
- 新代码采用 Vue 3 `<script setup lang="ts">` 和明确的 props、emits 类型。

组件输出应优先使用 uni-app 原生组件和 API，避免依赖浏览器专属 DOM，以保证 H5、微信小程序和 App 的共同实现路径。

## 组件职责

### 展示类

- `snake-icon`：提供 Snake UI 自有图标映射，覆盖当前使用的搜索、关闭、圆形关闭、播放等图标。
- `snake-image`：封装加载、失败与基础图片展示。
- `snake-lazy-image`：在平台能力允许时延迟加载图片，并提供失败占位。
- `snake-empty`：展示空状态图、说明文字和自定义内容。
- `snake-loadmore`：展示加载中、无更多和继续加载状态。

### 交互与容器类

- `snake-overlay`：遮罩、层级、透明度、点击关闭事件。
- `snake-popup`：基于 overlay 实现 center、top、right、bottom、left 弹层，处理显隐和关闭事件。
- `snake-button`：封装 uni-app button，提供 type、plain、disabled、loading 和自定义样式。
- `snake-tabs`：处理列表、当前项、指示线和 change 事件。
- `snake-sticky`：提供基础吸顶行为，优先使用跨端 CSS sticky，必要的平台差异通过条件编译处理。
- `snake-notice-bar`：处理单行滚动、循环文本和点击事件。
- `snake-swiper`：基于原生 swiper，处理图片列表、指示器、自动播放和 change/click 事件。

## 迁移流程

1. 先为 12 个组件建立公开目录、类型和导出。
2. 补充每个组件当前所需的行为测试或结构测试。
3. 将 Snake UI 现有源码中的 `u-*` 标签替换成 `snake-*`，逐个页面验证行为。
4. 删除 `main.ts` 中的 uView Pro 插件注册。
5. 删除 `App.vue` 与 `uni.scss` 中的 uView Pro 样式导入。
6. 删除 `pages.json` 中的 `u-*` easycom 规则。
7. 删除根 `package.json`、锁文件以及 Snake UI uni_modules 清单中的 uView Pro 依赖。
8. 更新安装文档、组件文档和 H5 iframe 示例。

迁移过程中不保留隐藏的 uView Pro fallback。最终源码、构建产物和包元数据都不得引用 uView Pro。

## 样式与主题

基础组件使用 Snake UI 自身的轻量 CSS 变量，并提供合理默认值。第一阶段只建立当前组件所需的品牌色、文字色、背景色、边框色、圆角和层级变量，不复制完整主题系统。

`custom-style` 同时接受字符串或样式对象；内部统一转换后绑定。尺寸属性支持数字和带单位字符串，数字的默认语义由各组件文档明确说明，避免隐式依赖 uView Pro 的单位换算。

## 错误与降级

- 图片加载失败时显示错误占位，不抛出渲染异常。
- 图标名不存在时显示稳定的文本占位或不渲染图形，并在开发环境给出警告。
- popup、overlay 等组件应避免重复触发 close/change。
- App 或小程序不支持某项增强行为时保留基本可用功能，例如 notice-bar 不滚动但仍显示文本。
- 组件不读取 `uni.$u`，也不要求全局属性存在。

## 验证

完成标准包括：

- 搜索 `src`、package 清单和锁文件时不存在有效的 uView Pro 依赖或运行时代码引用。
- TypeScript 类型检查通过。
- H5 生产构建通过，并在文档 iframe 中验证现有 20 个示例页面。
- 微信小程序构建通过。
- App 构建通过；若本机仅能完成编译而无法启动模拟器或真机，需要明确记录实际验证边界。
- 基础组件的 props、events 和关键状态有自动化测试或可重复的结构检查。
- 组件文档说明支持平台、API 兼容边界和迁移示例。

## 非目标

- 不完整复制 uView Pro 的全部组件和工具函数。
- 不在第一阶段建立复杂的国际化、暗色主题或全局配置提供器。
- 不引入 wot-design-uni 作为替代依赖。
- 不保证与 uView Pro 所有未使用属性、插槽和内部样式完全一致。
